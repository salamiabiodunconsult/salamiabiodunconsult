/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  addDoc,
  collection, 
  query, 
  where, 
  getDocs, 
  onSnapshot,
  getDocFromServer
} from 'firebase/firestore';
import firebaseConfig from './firebase-applet-config.json';
import { UserProfile, UserRole, ChatMessage, Notification, CommissionLog, Appointment, BrandAudit, SponsorshipRequest, Course, UtmLink, Subscriber, Enrollment, Announcement, MentorshipRequest } from './types';

// Detect whether real Firebase is configured
export const isRealFirebase = 
  firebaseConfig.apiKey && 
  !firebaseConfig.apiKey.includes('PLACEHOLDER') && 
  firebaseConfig.projectId && 
  !firebaseConfig.projectId.includes('PLACEHOLDER');

let firebaseApp: any = null;
export let db: any = null;
export let auth: any = null;

if (isRealFirebase) {
  try {
    firebaseApp = initializeApp(firebaseConfig);
    // Use default database to ensure security rules are correctly applied and to prevent named database deployment mismatch
    db = getFirestore(firebaseApp);
    auth = getAuth(firebaseApp);
    
    // Validate connection to Firestore as per Firebase Skill guidelines
    const testConnection = async () => {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.warn("Please check your Firebase configuration.");
        }
      }
    };
    testConnection();
  } catch (err) {
    console.error('Firebase initialization failed:', err);
  }
}

// Helper to recursively clean undefined fields to avoid "Unsupported field value: undefined" errors in Firestore
export const cleanUndefined = <T extends Record<string, any>>(obj: T): T => {
  const clean: any = {};
  Object.keys(obj).forEach(key => {
    const val = obj[key];
    if (val !== undefined) {
      if (val !== null && typeof val === 'object' && !Array.isArray(val) && !(val instanceof Date)) {
        clean[key] = cleanUndefined(val);
      } else {
        clean[key] = val;
      }
    }
  });
  return clean;
};

// Error handling matching FirestoreErrorInfo interface
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid || 'simulated-user-id',
      email: auth?.currentUser?.email || 'simulated@example.com',
      emailVerified: auth?.currentUser?.emailVerified || true,
      isAnonymous: auth?.currentUser?.isAnonymous || false,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// --- LOCAL STORAGE PERSISTENCE ENGINE ---
// Fallback storage for preview environments or local testing

const LOCAL_STORAGE_KEYS = {
  USERS: 'sac_users',
  CHATS: 'sac_chats',
  NOTIFICATIONS: 'sac_notifications',
  COMMISSIONS: 'sac_commissions',
  APPOINTMENTS: 'sac_appointments',
  BRAND_AUDITS: 'sac_brand_audits',
  SPONSORSHIPS: 'sac_sponsorships',
  CURRENT_USER: 'sac_current_user',
  UTM_LINKS: 'sac_utm_links',
  SUBSCRIBERS: 'sac_subscribers',
  ENROLLMENTS: 'sac_enrollments',
  ANNOUNCEMENTS: 'sac_announcements',
  MENTORSHIP_REQUESTS: 'sac_mentorship_requests'
};

const getLocalStorage = <T>(key: string, defaultValue: T): T => {
  const data = localStorage.getItem(key);
  if (!data) return defaultValue;
  try {
    return JSON.parse(data);
  } catch {
    return defaultValue;
  }
};

const setLocalStorage = <T>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

// Initial simulated mock datasets
const INITIAL_COURSES: Course[] = [
  {
    id: 'course-1',
    title: 'Advanced AI & Large Language Models',
    description: 'Learn prompt engineering, retrieval augmented generation (RAG), and build generative apps.',
    longDescription: 'A deep-dive course teaching full-stack developers how to leverage Gemini models, construct conversational bots, analyze unstructured multimedia data, and deploy serverless AI nodes.',
    duration: '8 Weeks',
    price: 15000,
    level: 'Advanced',
    syllabus: ['Intro to LLMs & Prompt Tuning', 'Vector DBs & RAG Architectures', 'Gemini APIs & Multimodality', 'Building Conversational Agents', 'Enterprise Deployment & Monitoring']
  },
  {
    id: 'course-2',
    title: 'Digital Marketing & Growth Ads Accelerator',
    description: 'Master SEO, SEM, content funnels, and programmatic ad campaigns.',
    longDescription: 'Perfect for business owners, clients, and aspiring marketers. Learn to manage high-yield Google Ads, optimize web conversion pathways, design brand strategy briefs, and lead dynamic social campaigns.',
    duration: '6 Weeks',
    price: 12000,
    level: 'Intermediate',
    syllabus: ['Conversion Rate Optimization', 'Search Engine Optimization (SEO)', 'Google & Meta Ads Blueprint', 'Email Automated Funnels', 'Growth Analytics & KPI Tracking']
  },
  {
    id: 'course-3',
    title: 'Full-Stack React & Vite Development',
    description: 'Build premium responsive single page applications with React, Tailwind, and Node.',
    longDescription: 'Our hallmark Edtech course. Create modern desktop-first and mobile-responsive dashboards, utilize motion transitions, orchestrate React state flows, and deploy serverless microservices.',
    duration: '10 Weeks',
    price: 30000,
    level: 'Intermediate',
    syllabus: ['ES6+ & React Core Foundations', 'Tailwind CSS Layout Mastery', 'React Hooks & State Orchestration', 'Vite & Frontend Deployment', 'Firebase & Serverless DB Binding']
  },
  {
    id: 'course-kidztech-scratch',
    title: 'Scratch Coding & Creative Animation',
    description: 'Introduction to logic, algorithms, and computational thinking for kids aged 5-11 using visual Scratch block programming.',
    longDescription: 'A fun, interactive course designed to introduce kids to visual block coding. Children will build animated stories, interactive greeting cards, and multi-level video games while mastering foundational programming concepts like loops, variables, and conditionals.',
    duration: '4 Weeks',
    price: 8000,
    level: 'Beginner',
    syllabus: ['Getting Started with Scratch Interface', 'Sprites, Costumes, and Backdrops', 'Variables, Loops, and Logic Bricks', 'Creating Animations & Sound Effects', 'Publishing and Sharing Your First Game']
  },
  {
    id: 'course-kidztech-web',
    title: 'Frontend Web Design for Young Innovators',
    description: 'Learn to structure, design, and launch live, beautiful websites using modern HTML5, CSS3, and simple JavaScript.',
    longDescription: 'Designed for children and teenagers to bridge the gap between visual coding and real-world software creation. Students will learn how web browsers interpret files, style web pages with colors and custom layouts, and create interactive personal portals.',
    duration: '6 Weeks',
    price: 12000,
    level: 'Beginner',
    syllabus: ['Understanding the Web & HTML5 tags', 'Styling with CSS3 Colors & Fonts', 'Creating Layouts and Navigation Panels', 'Introduction to JS and Click Interactions', 'Deploying your Personal Website Live']
  },
  {
    id: 'course-kidztech-python',
    title: 'Python Programming: Scripting & Turtle Graphics',
    description: 'Master text-based coding with Python through graphical design, mathematical arts, and text-based adventure games.',
    longDescription: 'The ultimate transition course from block coding to pure text-based programming. Students use Python\'s Turtle library to create rich graphics, learn scripting syntax, manage lists, and design basic command-line utilities.',
    duration: '8 Weeks',
    price: 15000,
    level: 'Intermediate',
    syllabus: ['Python Syntax & Variable Assignations', 'Turtle Graphics: Drawing Shapes & Patterns', 'Decision-Making with Conditional Logic', 'Functions, Lists, and Loop Controls', 'Building a text-based Adventure RPG']
  },
  {
    id: 'course-techkids-mobile',
    title: 'Mobile App Builder: MIT App Inventor',
    description: 'Build, test, and deploy functional Android and iOS mobile applications utilizing drag-and-drop logical blocks.',
    longDescription: 'A highly interactive course utilizing MIT App Inventor to teach mobile systems architecture. Kids learn how to utilize mobile phone sensors (accelerometer, GPS, camera), manage databases, and bundle functional APKs to share with friends and family.',
    duration: '6 Weeks',
    price: 10000,
    level: 'Intermediate',
    syllabus: ['MIT App Inventor Setup & Screen Layouts', 'UI Components: Buttons, Sound, and Canvas', 'Utilizing Phone Sensors & GPS Trackers', 'Data Storage with TinyDB', 'Compiling and Testing APK Packages']
  },
  {
    id: 'course-techkids-roblox',
    title: '3D Game Design in Roblox Studio',
    description: 'Design realistic 3D game environments and script interactive elements using Lua scripting in Roblox Studio.',
    longDescription: 'Turn players into builders! This course teaches kids how to build multi-dimensional obstacles, design terrain assets, and write simple Lua scripts inside Roblox Studio to trigger events, spawn power-ups, and manage player scores.',
    duration: '8 Weeks',
    price: 18000,
    level: 'Intermediate',
    syllabus: ['Roblox Studio Interface & Part Modeling', 'Designing Immersive 3D Terrains & Obbys', 'Lua Scripting Foundations: Variables & Events', 'Manipulating Game Physics & Spawn Zones', 'Publishing & Sharing Games on Roblox']
  },
  {
    id: 'course-techkids-robotics',
    title: 'Robotics & Internet of Things (IoT)',
    description: 'Introduction to electronic circuits, smart sensor microcontrollers, and micro-python scripting.',
    longDescription: 'Learn how hardware meets software. Students explore virtual circuit diagrams, program simulated microcontrollers (like Arduino or Micro:bit), and understand how IoT smart appliances process ambient environmental variables.',
    duration: '8 Weeks',
    price: 22000,
    level: 'Advanced',
    syllabus: ['Introduction to Electrical Circuits & Resistors', 'Microcontroller Pin Architectures', 'Reading Analog & Digital Sensor Outputs', 'Programming with Micro:bit Block Editor', 'Simulating Smart Home Automations']
  },
  {
    id: 'course-graphics-design',
    title: 'Graphics Design & Brand Identity',
    description: 'Learn to design professional visuals, logos, marketing flyers, and digital artwork with Figma and Photoshop.',
    longDescription: 'Master the principles of typography, visual hierarchy, color theory, and software tools to create stunning, print-ready, and web-ready designs for any brand or agency.',
    duration: '6 Weeks',
    price: 10000,
    level: 'Beginner',
    syllabus: ['Introduction to Design Principles', 'Working with Vector Graphics in Figma', 'Raster Editing & Photo Manipulation', 'Brand Identity, Style Guides, and Logos', 'Creating Social Media & Print Portfolio Assets']
  },
  {
    id: 'course-video-editing',
    title: 'Video Editing & Motion Graphics',
    description: 'Master non-linear video editing, sound engineering, transition design, and cinematic cuts.',
    longDescription: 'Turn raw footage into professional cinematic stories, marketing videos, and social media reels. Learn advanced techniques of keyframing, motion graphics, audio mastering, and color grading.',
    duration: '8 Weeks',
    price: 15000,
    level: 'Intermediate',
    syllabus: ['Intro to Timeline Editing & Cuts', 'Advanced Transitions & Keyframing', 'Color Grading & Lighting Corrections', 'Sound Design & Royalty-Free Audio Syncing', 'Rendering and Optimizing for Social Media']
  },
  {
    id: 'course-intro-ai',
    title: 'Introduction to Artificial Intelligence',
    description: 'De-mystify AI neural networks, cognitive computing, machine learning, and its impact on the modern workforce.',
    longDescription: 'Designed for beginners to grasp the core concepts of artificial intelligence. Discover how data trains models, explore everyday use-cases, and learn to navigate AI-driven environments ethically.',
    duration: '4 Weeks',
    price: 8000,
    level: 'Beginner',
    syllabus: ['What is AI? History & Core Concepts', 'Supervised vs. Unsupervised Machine Learning', 'How Neural Networks Process Information', 'AI Tools in Everyday Life & Business', 'Ethics, Safety, and the Future of AI']
  },
  {
    id: 'course-prompt-engineering',
    title: 'Prompt Engineering & Generative AI Mastery',
    description: 'Master advanced instruction engineering, persona frameworks, chain-of-thought prompting, and direct API logic orchestration.',
    longDescription: 'Learn how to communicate effectively with large language models. Master techniques like few-shot prompting, system instructions, and RAG to build intelligent workflows and optimize prompt-driven systems.',
    duration: '6 Weeks',
    price: 12000,
    level: 'Intermediate',
    syllabus: ['Language Model Architecture & Tokens', 'Zero-Shot, Few-Shot, and Role Prompting', 'Chain-of-Thought & Iterative Prompts', 'Automating Tasks with Multi-Modal Models', 'Building Production-Ready AI Agents']
  },
  {
    id: 'reception-tynker',
    title: 'Tynker Game-Based Coding',
    description: 'A highly interactive platform that teaches kids to code through game design, modding Minecraft, and flying drones. It offers both block-based coding for younger beginners and real text-based coding (Python, JavaScript) for older kids.',
    longDescription: 'Curated visual sandbox playground to practice block-coding concepts. Kids learn logic, loops, variables, and game physics through engaging play.',
    duration: 'Self-Paced Sandbox',
    price: 0,
    level: 'Reception',
    syllabus: [
      'Interactive Block-Based Coding Layout',
      'Minecraft Mods & Character Controls',
      'Simple Game Physics & Logic Chains',
      'Advanced Scripting & Flight Modules'
    ],
    url: 'https://www.tynker.com/',
    ageRange: 'Ages 5-16',
    category: 'Game Design & Block Coding',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop',
    tags: ['Interactive', 'Free Access', 'Visual'],
    points: '+100 XP'
  },
  {
    id: 'reception-swift',
    title: 'Apple Swift Playgrounds',
    description: 'Created by Apple, this interactive puzzle app/website teaches kids ages 6+ how to write real Swift code (the language used to build iOS apps) by guiding a character through an amazing 3D world.',
    longDescription: 'Learn real text-based iOS Swift syntax. Move characters through beautiful 3D landscapes, solving complex spatial puzzles using loops, functions, and standard object-oriented operations.',
    duration: 'Self-Paced Sandbox',
    price: 0,
    level: 'Reception',
    syllabus: [
      'Introduction to 3D Coding Sandbox',
      'Writing Commands & Standard Loops',
      'Custom Functions & Logic Branches',
      'Debugging Algorithms in real-time'
    ],
    url: 'https://www.apple.com/swift/playgrounds/',
    ageRange: 'Ages 6+',
    category: 'Real Swift Programming',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop',
    tags: ['3D Puzzles', 'Free Access', 'iOS Dev'],
    points: '+150 XP'
  },
  {
    id: 'reception-khan',
    title: 'Khan Academy Kids',
    description: 'Perfect for younger children (ages 2-7), this free mobile and web platform uses playful animated characters and games to teach foundational logic, reading, and problem-solving skills to build early digital literacy.',
    longDescription: 'Provides early computer logic foundations. Guides toddler and pre-school pupils through playful challenges to enhance spatial awareness, math patterns, reading tracks, and cognitive critical thinking.',
    duration: 'Self-Paced Sandbox',
    price: 0,
    level: 'Reception',
    syllabus: [
      'Early Logic & Pattern Matching',
      'Spatial Reasoning & Color Shapes',
      'Phonics & Creative Story Paths',
      'Foundational Problem Solving Drills'
    ],
    url: 'https://khankids.zendesk.com/hc/en-us',
    ageRange: 'Ages 2-7',
    category: 'Early Digital Literacy',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=600&auto=format&fit=crop',
    tags: ['Fun Games', 'Free Access', 'Logic'],
    points: '+80 XP'
  },
  {
    id: 'reception-codemonkey',
    title: 'CodeMonkey Coding Adventures',
    description: 'A world-class game-based learning environment where younger kids write actual lines of code to catch bananas, save the world, and solve increasingly difficult computer science puzzles.',
    longDescription: 'Get real experience writing CoffeeScript or Python code. Help monkeys solve levels by using parameters, index sequences, objects, and function triggers in a gamified, safe learning ecosystem.',
    duration: 'Self-Paced Sandbox',
    price: 0,
    level: 'Reception',
    syllabus: [
      'Introduction to CodeMonkey Sandbox',
      'Controlling Sprites with Syntax Code',
      'Looping Iterations & Banana Arrays',
      'Designing & Hosting Personal Puzzles'
    ],
    url: 'https://www.codemonkey.com/',
    ageRange: 'Ages 5-14',
    category: 'Python & Block Coding',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=600&auto=format&fit=crop',
    tags: ['Gamified', 'Free Access', 'Syntax'],
    points: '+120 XP'
  },
  {
    id: 'reception-codemoji',
    title: 'Codemoji Web Builder',
    description: 'Uses fun, intuitive emojis to teach students (ages 8-14) the foundational building blocks of modern web development, including HTML, CSS, and Javascript, in an engaging visual sandbox.',
    longDescription: 'The ultimate web builder for young minds. Build clean pages by matching emoticons to HTML layout syntax tags, modify CSS styling, and watch your emojis compile into standard web code instantly.',
    duration: 'Self-Paced Sandbox',
    price: 0,
    level: 'Reception',
    syllabus: [
      'Understanding HTML Structure with Emojis',
      'Styling Web Objects with Visual Tags',
      'Setting Custom Font & Background Colors',
      'Previewing and Live Compiling Web Pages'
    ],
    url: 'https://www.codemoji.com/',
    ageRange: 'Ages 8-14',
    category: 'Web Design & Emoji Coding',
    image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=600&auto=format&fit=crop',
    tags: ['Web Design', 'Free Access', 'Emojis'],
    points: '+110 XP'
  }
];

// Initialize local database values if empty
if (!localStorage.getItem(LOCAL_STORAGE_KEYS.USERS)) {
  const defaultUsers: Record<string, UserProfile> = {
    'student-demo': {
      uid: 'student-demo',
      email: 'student@sac.com',
      displayName: 'Adebayo Oluwaseun',
      role: 'Student',
      profileCompleted: true,
      phone: '+2348011223344',
      xp: 450,
      badges: ['Quick Learner', 'Coding Rookie'],
      accessStatus: 'active',
      termEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      paidBy: 'self'
    },
    'parent-demo': {
      uid: 'parent-demo',
      email: 'parent@sac.com',
      displayName: 'Chioma Obi',
      role: 'Parent',
      profileCompleted: true,
      phone: '+2348022334455',
      children: ['student@sac.com']
    },
    'teacher-demo': {
      uid: 'teacher-demo',
      email: 'teacher@sac.com',
      displayName: 'Mr. Babajide Alao',
      role: 'Teacher',
      profileCompleted: true,
      phone: '+2348033445566'
    },
    'mentor-demo': {
      uid: 'mentor-demo',
      email: 'mentor@sac.com',
      displayName: 'Dr. Sarah Carter',
      role: 'Mentor',
      profileCompleted: true,
      phone: '+2348044556677',
      bio: 'Ex-Google Engineering Lead. Passionate about mentoring upcoming African tech talents.'
    },
    'client-demo': {
      uid: 'client-demo',
      email: 'client@sac.com',
      displayName: 'Abiodun Salami',
      role: 'Client',
      profileCompleted: true,
      phone: '+2348055667788',
      companyName: 'Salami Consult Limited'
    },
    'admin-demo': {
      uid: 'admin-demo',
      email: 'info.salamiabiodunconsult@gmail.com',
      displayName: 'SAC Global Admin',
      role: 'Admin',
      profileCompleted: true,
      phone: '+2348011112222'
    }
  };
  setLocalStorage(LOCAL_STORAGE_KEYS.USERS, defaultUsers);
}

if (!localStorage.getItem(LOCAL_STORAGE_KEYS.CHATS)) {
  const defaultChats: ChatMessage[] = [
    {
      id: 'msg-1',
      chatId: 'student-demo_mentor-demo',
      senderId: 'mentor-demo',
      senderName: 'Dr. Sarah Carter',
      text: 'Hello Adebayo! Welcome to the Mentorship program. How is your learning path in the Advanced AI course going?',
      timestamp: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 'msg-2',
      chatId: 'student-demo_mentor-demo',
      senderId: 'student-demo',
      senderName: 'Adebayo Oluwaseun',
      text: 'Hello Dr. Sarah! It is going great. I am currently working on implementing the Gemini SDK server-side and trying to map RAG architectures.',
      timestamp: new Date(Date.now() - 1800000).toISOString()
    }
  ];
  setLocalStorage(LOCAL_STORAGE_KEYS.CHATS, defaultChats);
}

if (!localStorage.getItem(LOCAL_STORAGE_KEYS.NOTIFICATIONS)) {
  const defaultNotifications: Notification[] = [
    {
      id: 'notif-1',
      userId: 'student-demo',
      text: 'Welcome to SAC Edtech Hub! Your profile is verified.',
      timestamp: new Date().toISOString(),
      read: false
    }
  ];
  setLocalStorage(LOCAL_STORAGE_KEYS.NOTIFICATIONS, defaultNotifications);
}

if (!localStorage.getItem(LOCAL_STORAGE_KEYS.COMMISSIONS)) {
  const defaultCommissions: CommissionLog[] = [
    {
      id: 'comm-1',
      userId: 'teacher-demo',
      amount: 6000, // 20% of 30,000 React course
      type: 'Teacher',
      courseId: 'course-3',
      courseTitle: 'Full-Stack React & Vite Development',
      studentName: 'Adebayo Oluwaseun',
      timestamp: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 'comm-2',
      userId: 'mentor-demo',
      amount: 1500, // 10% of 15,000 AI Course
      type: 'Mentor',
      courseId: 'course-1',
      courseTitle: 'Advanced AI & Large Language Models',
      studentName: 'Adebayo Oluwaseun',
      timestamp: new Date(Date.now() - 43200000).toISOString()
    }
  ];
  setLocalStorage(LOCAL_STORAGE_KEYS.COMMISSIONS, defaultCommissions);
}

if (!localStorage.getItem(LOCAL_STORAGE_KEYS.APPOINTMENTS)) {
  const defaultAppointments: Appointment[] = [
    {
      id: 'appt-1',
      clientEmail: 'client@sac.com',
      clientName: 'Abiodun Salami',
      dateTime: '2026-07-05T14:00',
      serviceType: 'Growth Audit and Strategy Planning',
      meetLink: 'https://meet.google.com/abc-defg-hij',
      status: 'confirmed',
      companyName: 'Salami Consult Limited'
    }
  ];
  setLocalStorage(LOCAL_STORAGE_KEYS.APPOINTMENTS, defaultAppointments);
}

if (!localStorage.getItem(LOCAL_STORAGE_KEYS.BRAND_AUDITS)) {
  const defaultAudits: BrandAudit[] = [
    {
      id: 'audit-1',
      clientEmail: 'client@sac.com',
      clientName: 'Abiodun Salami',
      websiteUrl: 'https://salamiconsult.com',
      industry: 'Business Advisory & Software Solutions',
      primaryGoal: 'Increase online tech student enrollments & optimize digital reach',
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      status: 'completed',
      scores: {
        seo: 82,
        speed: 76,
        social: 64,
        marketing: 70
      },
      recommendations: [
        'Optimize page metadata and inject critical semantic headers for local search targeting.',
        'Implement server-side rendering or heavy static-site optimization to decrease initial paint time to <1.5s.',
        'Establish an automated email onboarding trigger chain for Resource Vault downloads.'
      ],
      reportPdfUrl: '#'
    }
  ];
  setLocalStorage(LOCAL_STORAGE_KEYS.BRAND_AUDITS, defaultAudits);
}

if (!localStorage.getItem(LOCAL_STORAGE_KEYS.SPONSORSHIPS)) {
  const defaultSponsorships: SponsorshipRequest[] = [
    {
      id: 'spons-1',
      studentId: 'student-demo',
      studentName: 'Adebayo Oluwaseun',
      studentEmail: 'student@sac.com',
      courseId: 'course-1',
      courseTitle: 'Advanced AI & Large Language Models',
      reason: 'I am a highly motivated computer science undergraduate currently seeking micro-sponsorship to master AI and support local agricultural crop-disease tech projects.',
      status: 'pending'
    }
  ];
  setLocalStorage(LOCAL_STORAGE_KEYS.SPONSORSHIPS, defaultSponsorships);
}

// --- CORE FIREBASE AUTH & FIRESTORE FUNCTIONS (WITH FALLBACK) ---

export const getCourses = (): Course[] => {
  return INITIAL_COURSES;
};

export const getProfile = async (uid: string): Promise<UserProfile | null> => {
  if (isRealFirebase) {
    try {
      const docRef = doc(db, 'users', uid);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        return snapshot.data() as UserProfile;
      }
      return null;
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, `users/${uid}`);
      return null;
    }
  } else {
    const users = getLocalStorage<Record<string, UserProfile>>(LOCAL_STORAGE_KEYS.USERS, {});
    return users[uid] || null;
  }
};

export const saveProfile = async (profile: UserProfile): Promise<void> => {
  if (isRealFirebase) {
    try {
      await setDoc(doc(db, 'users', profile.uid), cleanUndefined(profile));
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `users/${profile.uid}`);
    }
  } else {
    const users = getLocalStorage<Record<string, UserProfile>>(LOCAL_STORAGE_KEYS.USERS, {});
    users[profile.uid] = profile;
    setLocalStorage(LOCAL_STORAGE_KEYS.USERS, users);
  }
};

export const updateProfileFields = async (uid: string, fields: Partial<UserProfile>): Promise<void> => {
  if (isRealFirebase) {
    try {
      await updateDoc(doc(db, 'users', uid), cleanUndefined(fields));
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${uid}`);
    }
  } else {
    const users = getLocalStorage<Record<string, UserProfile>>(LOCAL_STORAGE_KEYS.USERS, {});
    if (users[uid]) {
      users[uid] = { ...users[uid], ...fields };
      setLocalStorage(LOCAL_STORAGE_KEYS.USERS, users);
    }
  }
};

export const loginWithGoogleSimulated = async (roleSelection: UserRole): Promise<UserProfile> => {
  if (isRealFirebase && auth?.currentUser) {
    const uid = auth.currentUser.uid;
    const existingProf = await getProfile(uid);
    const updatedProfile: UserProfile = existingProf 
      ? { ...existingProf, role: roleSelection }
      : {
          uid,
          email: auth.currentUser.email || '',
          displayName: auth.currentUser.displayName || 'Active User',
          role: roleSelection,
          profileCompleted: true
        };
    await saveProfile(updatedProfile);
    setLocalStorage(LOCAL_STORAGE_KEYS.CURRENT_USER, updatedProfile);
    return updatedProfile;
  }

  const mockUid = `${roleSelection.toLowerCase()}-demo`;
  const defaultDisplayName = 
    roleSelection === 'Student' ? 'Adebayo Oluwaseun' :
    roleSelection === 'Parent' ? 'Chioma Obi' :
    roleSelection === 'Teacher' ? 'Mr. Babajide Alao' :
    roleSelection === 'Mentor' ? 'Dr. Sarah Carter' :
    roleSelection === 'Client' ? 'Abiodun Salami' :
    roleSelection === 'Admin' ? 'SAC Global Admin' :
    'Jane Doe';
    
  const email = `${roleSelection.toLowerCase()}@sac.com`;
  
  const existingProf = await getProfile(mockUid);
  if (existingProf) {
    setLocalStorage(LOCAL_STORAGE_KEYS.CURRENT_USER, existingProf);
    return existingProf;
  }

  const newProfile: UserProfile = {
    uid: mockUid,
    email: email,
    displayName: defaultDisplayName,
    role: roleSelection,
    profileCompleted: true,
    xp: roleSelection === 'Student' ? 100 : undefined,
    badges: roleSelection === 'Student' ? ['New Member'] : undefined
  };

  await saveProfile(newProfile);
  setLocalStorage(LOCAL_STORAGE_KEYS.CURRENT_USER, newProfile);
  return newProfile;
};

export const signUpWithEmailReal = async (
  email: string, 
  password: string, 
  displayName: string, 
  role: UserRole
): Promise<UserProfile> => {
  if (!isRealFirebase || !auth) {
    throw new Error("Firebase is not initialized or configured");
  }
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    
    const newProfile: UserProfile = {
      uid: firebaseUser.uid,
      email: firebaseUser.email || email,
      displayName: displayName,
      role: role,
      profileCompleted: true,
      xp: role === 'Student' ? 100 : undefined,
      badges: role === 'Student' ? ['New Member'] : undefined
    };
    
    await saveProfile(newProfile);
    setLocalStorage(LOCAL_STORAGE_KEYS.CURRENT_USER, newProfile);
    return newProfile;
  } catch (err) {
    console.error("Firebase Sign-Up error:", err);
    throw err;
  }
};

export const signInWithEmailReal = async (email: string, password: string): Promise<UserProfile> => {
  if (!isRealFirebase || !auth) {
    throw new Error("Firebase is not initialized or configured");
  }
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    
    const profile = await getProfile(firebaseUser.uid);
    if (profile) {
      setLocalStorage(LOCAL_STORAGE_KEYS.CURRENT_USER, profile);
      return profile;
    } else {
      const newProfile: UserProfile = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || email,
        displayName: firebaseUser.displayName || email.split('@')[0],
        role: 'Student',
        profileCompleted: false,
        xp: 100,
        badges: ['New Member']
      };
      await saveProfile(newProfile);
      setLocalStorage(LOCAL_STORAGE_KEYS.CURRENT_USER, newProfile);
      return newProfile;
    }
  } catch (err) {
    console.error("Firebase Sign-In error:", err);
    throw err;
  }
};

export const signInWithGoogleReal = async (defaultRole: UserRole = 'Student'): Promise<UserProfile> => {
  if (!isRealFirebase || !auth) {
    throw new Error("Firebase is not initialized or configured");
  }
  try {
    const provider = new GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/calendar.events');
    const userCredential = await signInWithPopup(auth, provider);
    const firebaseUser = userCredential.user;
    
    const credential = GoogleAuthProvider.credentialFromResult(userCredential);
    if (credential?.accessToken) {
      sessionStorage.setItem('last_google_access_token', credential.accessToken);
    }
    
    const profile = await getProfile(firebaseUser.uid);
    if (profile) {
      setLocalStorage(LOCAL_STORAGE_KEYS.CURRENT_USER, profile);
      return profile;
    } else {
      const newProfile: UserProfile = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: firebaseUser.displayName || 'Active Member',
        role: defaultRole,
        profileCompleted: false,
        xp: 100,
        badges: ['New Member']
      };
      await saveProfile(newProfile);
      setLocalStorage(LOCAL_STORAGE_KEYS.CURRENT_USER, newProfile);
      return newProfile;
    }
  } catch (err: any) {
    if (err && (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request' || (err.message && err.message.includes('popup-closed-by-user')))) {
      console.warn("Firebase Google Sign-In closed by user");
    } else {
      console.error("Firebase Google Sign-In error:", err);
    }
    throw err;
  }
};

export const onAuthUserProfileChanged = (callback: (profile: UserProfile | null) => void) => {
  if (!isRealFirebase || !auth) {
    return () => {};
  }
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      const profile = await getProfile(firebaseUser.uid);
      if (profile) {
        setLocalStorage(LOCAL_STORAGE_KEYS.CURRENT_USER, profile);
        callback(profile);
      } else {
        const selectedRoleStr = sessionStorage.getItem('selected_role');
        const role = (selectedRoleStr as UserRole) || 'Student';
        const newProfile: UserProfile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || 'Active Member',
          role: role,
          profileCompleted: false,
          xp: role === 'Student' ? 100 : undefined,
          badges: role === 'Student' ? ['New Member'] : undefined
        };
        await saveProfile(newProfile);
        setLocalStorage(LOCAL_STORAGE_KEYS.CURRENT_USER, newProfile);
        callback(newProfile);
      }
    } else {
      callback(null);
    }
  });
};

export const triggerSignOut = async (): Promise<void> => {
  if (isRealFirebase) {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Signout failed', err);
    }
  }
  localStorage.removeItem(LOCAL_STORAGE_KEYS.CURRENT_USER);
};

export const getCurrentUserSync = (): UserProfile | null => {
  return getLocalStorage<UserProfile | null>(LOCAL_STORAGE_KEYS.CURRENT_USER, null);
};

// --- LEADS & AUDITS ---
export const saveBrandAudit = async (audit: Omit<BrandAudit, 'id' | 'timestamp' | 'status'>): Promise<BrandAudit> => {
  const newAudit: BrandAudit = {
    ...audit,
    id: `audit-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    status: 'completed',
    scores: {
      seo: Math.floor(Math.random() * 20) + 75,
      speed: Math.floor(Math.random() * 25) + 65,
      social: Math.floor(Math.random() * 30) + 55,
      marketing: Math.floor(Math.random() * 20) + 70
    },
    recommendations: [
      'Increase responsive display layouts and test across distinct browser sizes.',
      'Improve site load index by reducing raw video file loads and minifying Javascript bundles.',
      'Drive traffic with optimized search grounding indexing and localized keywords.'
    ],
    reportPdfUrl: '#'
  };

  if (isRealFirebase && auth?.currentUser) {
    try {
      await setDoc(doc(db, 'brandAudits', newAudit.id), cleanUndefined(newAudit));
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `brandAudits/${newAudit.id}`);
    }
  } else {
    const audits = getLocalStorage<BrandAudit[]>(LOCAL_STORAGE_KEYS.BRAND_AUDITS, []);
    audits.push(newAudit);
    setLocalStorage(LOCAL_STORAGE_KEYS.BRAND_AUDITS, audits);
  }

  return newAudit;
};

export const getBrandAudits = async (): Promise<BrandAudit[]> => {
  if (isRealFirebase && auth?.currentUser) {
    try {
      const q = query(collection(db, 'brandAudits'));
      const snapshot = await getDocs(q);
      const items: BrandAudit[] = [];
      snapshot.forEach(d => items.push(d.data() as BrandAudit));
      return items;
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, 'brandAudits');
      return [];
    }
  } else {
    return getLocalStorage<BrandAudit[]>(LOCAL_STORAGE_KEYS.BRAND_AUDITS, []);
  }
};

// --- APPOINTMENTS ---
export const bookAppointment = async (appt: Omit<Appointment, 'id' | 'status' | 'meetLink'>): Promise<Appointment & { etherealUrl?: string }> => {
  const googleAccessToken = sessionStorage.getItem('last_google_access_token');
  
  let finalAppt: Appointment & { etherealUrl?: string };
  
  try {
    const response = await fetch('/api/appointments/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...appt,
        googleAccessToken
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      finalAppt = {
        ...appt,
        id: data.id || `appt-${Math.random().toString(36).substr(2, 9)}`,
        meetLink: data.meetLink || `https://meet.google.com/${Math.random().toString(36).substr(2, 3)}-${Math.random().toString(36).substr(2, 4)}-${Math.random().toString(36).substr(2, 3)}`,
        status: data.status || 'confirmed',
        etherealUrl: data.etherealUrl
      };
    } else {
      throw new Error("Backend booking failed, using local generation fallback");
    }
  } catch (error) {
    console.warn("Could not reach backend or create real appointment:", error);
    finalAppt = {
      ...appt,
      id: `appt-${Math.random().toString(36).substr(2, 9)}`,
      meetLink: `https://meet.google.com/${Math.random().toString(36).substr(2, 3)}-${Math.random().toString(36).substr(2, 4)}-${Math.random().toString(36).substr(2, 3)}`,
      status: 'confirmed'
    };
  }

  if (isRealFirebase && auth?.currentUser) {
    try {
      await setDoc(doc(db, 'appointments', finalAppt.id), cleanUndefined(finalAppt));
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `appointments/${finalAppt.id}`);
    }
  } else {
    const appointments = getLocalStorage<Appointment[]>(LOCAL_STORAGE_KEYS.APPOINTMENTS, []);
    appointments.push(finalAppt);
    setLocalStorage(LOCAL_STORAGE_KEYS.APPOINTMENTS, appointments);
  }

  return finalAppt;
};

export const registerAcademyFreeTrial = async (trial: {
  clientName: string;
  clientEmail: string;
  dateTime: string;
  courseInterest: string;
}): Promise<Appointment & { etherealUrl?: string }> => {
  const googleAccessToken = sessionStorage.getItem('last_google_access_token');
  let finalAppt: Appointment & { etherealUrl?: string };

  try {
    const response = await fetch('/api/academy/free-trial', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...trial,
        googleAccessToken
      })
    });

    if (response.ok) {
      const data = await response.json();
      finalAppt = {
        id: data.id || `trial-${Math.random().toString(36).substr(2, 9)}`,
        clientName: trial.clientName,
        clientEmail: trial.clientEmail,
        dateTime: trial.dateTime,
        serviceType: `Academy Free Trial: ${trial.courseInterest}`,
        meetLink: data.meetLink || `https://meet.google.com/${Math.random().toString(36).substr(2, 3)}-${Math.random().toString(36).substr(2, 4)}-${Math.random().toString(36).substr(2, 3)}`,
        status: data.status || 'confirmed',
        etherealUrl: data.etherealUrl
      };
    } else {
      throw new Error("Backend trial registration failed, using local generation fallback");
    }
  } catch (error) {
    console.warn("Could not reach backend or create real trial booking:", error);
    finalAppt = {
      id: `trial-${Math.random().toString(36).substr(2, 9)}`,
      clientName: trial.clientName,
      clientEmail: trial.clientEmail,
      dateTime: trial.dateTime,
      serviceType: `Academy Free Trial: ${trial.courseInterest}`,
      meetLink: `https://meet.google.com/${Math.random().toString(36).substr(2, 3)}-${Math.random().toString(36).substr(2, 4)}-${Math.random().toString(36).substr(2, 3)}`,
      status: 'confirmed'
    };
  }

  if (isRealFirebase && auth?.currentUser) {
    try {
      await setDoc(doc(db, 'appointments', finalAppt.id), cleanUndefined(finalAppt));
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `appointments/${finalAppt.id}`);
    }
  } else {
    const appointments = getLocalStorage<Appointment[]>(LOCAL_STORAGE_KEYS.APPOINTMENTS, []);
    appointments.push(finalAppt);
    setLocalStorage(LOCAL_STORAGE_KEYS.APPOINTMENTS, appointments);
  }

  return finalAppt;
};

export const getAppointments = async (): Promise<Appointment[]> => {
  if (isRealFirebase && auth?.currentUser) {
    try {
      const snapshot = await getDocs(collection(db, 'appointments'));
      const items: Appointment[] = [];
      snapshot.forEach(d => items.push(d.data() as Appointment));
      return items;
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, 'appointments');
      return [];
    }
  } else {
    return getLocalStorage<Appointment[]>(LOCAL_STORAGE_KEYS.APPOINTMENTS, []);
  }
};

// --- NEWSLETTER SUBSCRIPTION ---
export const subscribeToNewsletter = async (email: string, firstName?: string): Promise<{ success: boolean; etherealUrl?: string }> => {
  const id = `sub-${Math.random().toString(36).substring(2, 11)}`;
  const newSub: Subscriber = {
    id,
    email,
    firstName,
    createdAt: new Date().toISOString(),
    status: 'active'
  };

  let etherealUrl: string | undefined;

  try {
    const response = await fetch('/api/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, firstName })
    });

    if (response.ok) {
      const data = await response.json();
      if (data.etherealUrl) {
        etherealUrl = data.etherealUrl;
      }
    }
  } catch (error) {
    console.warn("Could not register subscription with backend api:", error);
  }

  // Persist the subscriber to Firestore or LocalStorage
  if (isRealFirebase) {
    try {
      await setDoc(doc(db, 'subscribers', id), cleanUndefined(newSub));
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `subscribers/${id}`);
    }
  } else {
    const subscribers = getLocalStorage<Subscriber[]>(LOCAL_STORAGE_KEYS.SUBSCRIBERS, []);
    subscribers.push(newSub);
    setLocalStorage(LOCAL_STORAGE_KEYS.SUBSCRIBERS, subscribers);
  }

  return { success: true, etherealUrl };
};

// --- NOTIFICATIONS ---
export const getNotifications = async (userId: string): Promise<Notification[]> => {
  if (isRealFirebase && auth?.currentUser) {
    try {
      const q = query(collection(db, 'notifications'), where('userId', '==', userId));
      const snapshot = await getDocs(q);
      const items: Notification[] = [];
      snapshot.forEach(d => items.push(d.data() as Notification));
      return items;
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, 'notifications');
      return [];
    }
  } else {
    const notifs = getLocalStorage<Notification[]>(LOCAL_STORAGE_KEYS.NOTIFICATIONS, []);
    return notifs.filter(n => n.userId === userId);
  }
};

export const sendNotification = async (userId: string, text: string): Promise<void> => {
  const newNotif: Notification = {
    id: `notif-${Math.random().toString(36).substr(2, 9)}`,
    userId,
    text,
    timestamp: new Date().toISOString(),
    read: false
  };

  if (isRealFirebase && auth?.currentUser) {
    try {
      await setDoc(doc(db, 'notifications', newNotif.id), cleanUndefined(newNotif));
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `notifications/${newNotif.id}`);
    }
  } else {
    const notifs = getLocalStorage<Notification[]>(LOCAL_STORAGE_KEYS.NOTIFICATIONS, []);
    notifs.push(newNotif);
    setLocalStorage(LOCAL_STORAGE_KEYS.NOTIFICATIONS, notifs);
  }
};

// --- CHATS ---
export const getChatsForRoom = async (chatId: string): Promise<ChatMessage[]> => {
  if (isRealFirebase && auth?.currentUser) {
    try {
      const q = query(collection(db, `chats/${chatId}/messages`));
      const snapshot = await getDocs(q);
      const messages: ChatMessage[] = [];
      snapshot.forEach(d => messages.push(d.data() as ChatMessage));
      return messages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, `chats/${chatId}/messages`);
      return [];
    }
  } else {
    const chats = getLocalStorage<ChatMessage[]>(LOCAL_STORAGE_KEYS.CHATS, []);
    return chats
      .filter(c => c.chatId === chatId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }
};

export const sendChatMessage = async (chatId: string, senderId: string, senderName: string, text: string): Promise<ChatMessage> => {
  const newMessage: ChatMessage = {
    id: `msg-${Math.random().toString(36).substr(2, 9)}`,
    chatId,
    senderId,
    senderName,
    text,
    timestamp: new Date().toISOString()
  };

  if (isRealFirebase && auth?.currentUser) {
    try {
      await setDoc(doc(db, `chats/${chatId}/messages`, newMessage.id), cleanUndefined(newMessage));
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `chats/${chatId}/messages/${newMessage.id}`);
    }
  } else {
    const chats = getLocalStorage<ChatMessage[]>(LOCAL_STORAGE_KEYS.CHATS, []);
    chats.push(newMessage);
    setLocalStorage(LOCAL_STORAGE_KEYS.CHATS, chats);
  }

  return newMessage;
};

// --- COMMISSIONS ---
export const getCommissions = async (): Promise<CommissionLog[]> => {
  if (isRealFirebase && auth?.currentUser) {
    try {
      const snapshot = await getDocs(collection(db, 'commissions'));
      const items: CommissionLog[] = [];
      snapshot.forEach(d => items.push(d.data() as CommissionLog));
      return items;
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, 'commissions');
      return [];
    }
  } else {
    return getLocalStorage<CommissionLog[]>(LOCAL_STORAGE_KEYS.COMMISSIONS, []);
  }
};

export const logCommission = async (log: Omit<CommissionLog, 'id' | 'timestamp'>): Promise<void> => {
  const newLog: CommissionLog = {
    ...log,
    id: `comm-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString()
  };

  if (isRealFirebase && auth?.currentUser) {
    try {
      await setDoc(doc(db, 'commissions', newLog.id), cleanUndefined(newLog));
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `commissions/${newLog.id}`);
    }
  } else {
    const comms = getLocalStorage<CommissionLog[]>(LOCAL_STORAGE_KEYS.COMMISSIONS, []);
    comms.push(newLog);
    setLocalStorage(LOCAL_STORAGE_KEYS.COMMISSIONS, comms);
  }
};

// --- SPONSORSHIPS ---
export const requestSponsorship = async (req: Omit<SponsorshipRequest, 'id' | 'status'>): Promise<SponsorshipRequest> => {
  const newReq: SponsorshipRequest = {
    ...req,
    id: `spons-${Math.random().toString(36).substr(2, 9)}`,
    status: 'pending'
  };

  if (isRealFirebase && auth?.currentUser) {
    try {
      await setDoc(doc(db, 'sponsorships', newReq.id), cleanUndefined(newReq));
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `sponsorships/${newReq.id}`);
    }
  } else {
    const sponsorships = getLocalStorage<SponsorshipRequest[]>(LOCAL_STORAGE_KEYS.SPONSORSHIPS, []);
    sponsorships.push(newReq);
    setLocalStorage(LOCAL_STORAGE_KEYS.SPONSORSHIPS, sponsorships);
  }

  return newReq;
};

export const getSponsorships = async (): Promise<SponsorshipRequest[]> => {
  if (isRealFirebase && auth?.currentUser) {
    try {
      const snapshot = await getDocs(collection(db, 'sponsorships'));
      const items: SponsorshipRequest[] = [];
      snapshot.forEach(d => items.push(d.data() as SponsorshipRequest));
      return items;
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, 'sponsorships');
      return [];
    }
  } else {
    return getLocalStorage<SponsorshipRequest[]>(LOCAL_STORAGE_KEYS.SPONSORSHIPS, []);
  }
};

export const updateSponsorshipStatus = async (id: string, status: 'approved' | 'rejected', sponsorId?: string): Promise<void> => {
  if (isRealFirebase && auth?.currentUser) {
    try {
      await updateDoc(doc(db, 'sponsorships', id), cleanUndefined({ status, sponsorId }));
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `sponsorships/${id}`);
    }
  } else {
    const sponsorships = getLocalStorage<SponsorshipRequest[]>(LOCAL_STORAGE_KEYS.SPONSORSHIPS, []);
    const idx = sponsorships.findIndex(s => s.id === id);
    if (idx !== -1) {
      sponsorships[idx].status = status;
      if (sponsorId) sponsorships[idx].sponsorId = sponsorId;
      setLocalStorage(LOCAL_STORAGE_KEYS.SPONSORSHIPS, sponsorships);
    }
  }
};

// --- ACADEMY ROLE-BASED FUNCTIONS ---

export const enrollInCourse = async (
  studentId: string,
  studentEmail: string,
  courseId: string,
  courseTitle: string,
  mode?: 'Online' | 'Physical',
  pricePaid?: number,
  scheduleDate?: string,
  scheduleTime?: string,
  durationDays?: number,
  hoursPerDay?: number,
  paymentStatus?: 'Paid' | 'Unpaid'
): Promise<Enrollment> => {
  const newEnrollment: Enrollment = {
    id: `enroll-${studentId}-${courseId}`,
    studentId,
    studentEmail,
    courseId,
    courseTitle,
    progress: 0,
    completedLessons: [],
    xpEarned: 0,
    mode,
    pricePaid,
    scheduleDate,
    scheduleTime,
    durationDays,
    hoursPerDay,
    paymentStatus
  };

  if (isRealFirebase) {
    try {
      await setDoc(doc(db, 'enrollments', newEnrollment.id), cleanUndefined(newEnrollment));
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `enrollments/${newEnrollment.id}`);
    }
  } else {
    const enrolls = getLocalStorage<Enrollment[]>(LOCAL_STORAGE_KEYS.ENROLLMENTS, []);
    const existingIdx = enrolls.findIndex(e => e.id === newEnrollment.id);
    if (existingIdx === -1) {
      enrolls.push(newEnrollment);
    } else {
      enrolls[existingIdx] = {
        ...enrolls[existingIdx],
        ...newEnrollment
      };
    }
    setLocalStorage(LOCAL_STORAGE_KEYS.ENROLLMENTS, enrolls);
  }
  return newEnrollment;
};

export const getStudentEnrollments = async (studentId: string): Promise<Enrollment[]> => {
  if (isRealFirebase) {
    try {
      const q = query(collection(db, 'enrollments'), where('studentId', '==', studentId));
      const snap = await getDocs(q);
      const items: Enrollment[] = [];
      snap.forEach(d => items.push(d.data() as Enrollment));
      return items;
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, 'enrollments');
      return [];
    }
  } else {
    const enrolls = getLocalStorage<Enrollment[]>(LOCAL_STORAGE_KEYS.ENROLLMENTS, []);
    return enrolls.filter(e => e.studentId === studentId);
  }
};

export const getAllEnrollments = async (): Promise<Enrollment[]> => {
  if (isRealFirebase) {
    try {
      const snap = await getDocs(collection(db, 'enrollments'));
      const items: Enrollment[] = [];
      snap.forEach(d => items.push(d.data() as Enrollment));
      return items;
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, 'enrollments');
      return [];
    }
  } else {
    return getLocalStorage<Enrollment[]>(LOCAL_STORAGE_KEYS.ENROLLMENTS, []);
  }
};

export const completeLessonInDb = async (
  enrollmentId: string,
  lessonName: string,
  totalLessonsCount: number,
  studentId: string
): Promise<Enrollment | null> => {
  let enrollment: Enrollment | null = null;

  if (isRealFirebase) {
    try {
      const docRef = doc(db, 'enrollments', enrollmentId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data() as Enrollment;
        if (!data.completedLessons.includes(lessonName)) {
          const completedLessons = [...data.completedLessons, lessonName];
          const progress = Math.min(100, Math.round((completedLessons.length / totalLessonsCount) * 100));
          const xpEarned = data.xpEarned + 50;
          const completedDate = progress === 100 ? new Date().toISOString() : data.completedDate;
          
          enrollment = {
            ...data,
            completedLessons,
            progress,
            xpEarned,
            completedDate
          };
          await updateDoc(docRef, cleanUndefined(enrollment) as any);

          // Award 50 XP to user profile
          const userRef = doc(db, 'users', studentId);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const userProfile = userSnap.data() as UserProfile;
            const currentXp = userProfile.xp || 0;
            const updatedXp = currentXp + 50;
            const badges = userProfile.badges || [];
            
            if (completedLessons.length === 1 && !badges.includes('Course Starter')) {
              badges.push('Course Starter');
            }
            if (progress === 100 && !badges.includes('Graduate')) {
              badges.push('Graduate');
            }
            await updateDoc(userRef, { xp: updatedXp, badges });
          }
        }
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `enrollments/${enrollmentId}`);
    }
  } else {
    const enrolls = getLocalStorage<Enrollment[]>(LOCAL_STORAGE_KEYS.ENROLLMENTS, []);
    const idx = enrolls.findIndex(e => e.id === enrollmentId);
    if (idx !== -1) {
      const data = enrolls[idx];
      if (!data.completedLessons.includes(lessonName)) {
        const completedLessons = [...data.completedLessons, lessonName];
        const progress = Math.min(100, Math.round((completedLessons.length / totalLessonsCount) * 100));
        const xpEarned = data.xpEarned + 50;
        const completedDate = progress === 100 ? new Date().toISOString() : data.completedDate;

        enrollment = {
          ...data,
          completedLessons,
          progress,
          xpEarned,
          completedDate
        };
        enrolls[idx] = enrollment;
        setLocalStorage(LOCAL_STORAGE_KEYS.ENROLLMENTS, enrolls);

        // Update local users store for XP
        const users = getLocalStorage<Record<string, UserProfile>>(LOCAL_STORAGE_KEYS.USERS, {});
        if (users[studentId]) {
          const userProfile = users[studentId];
          const currentXp = userProfile.xp || 0;
          const updatedXp = currentXp + 50;
          const badges = userProfile.badges || [];
          
          if (completedLessons.length === 1 && !badges.includes('Course Starter')) {
            badges.push('Course Starter');
          }
          if (progress === 100 && !badges.includes('Graduate')) {
            badges.push('Graduate');
          }
          users[studentId] = { ...userProfile, xp: updatedXp, badges };
          setLocalStorage(LOCAL_STORAGE_KEYS.USERS, users);
          
          const currentUser = getLocalStorage<UserProfile | null>(LOCAL_STORAGE_KEYS.CURRENT_USER, null);
          if (currentUser && currentUser.uid === studentId) {
            setLocalStorage(LOCAL_STORAGE_KEYS.CURRENT_USER, { ...currentUser, xp: updatedXp, badges });
          }
        }
      }
    }
  }
  return enrollment;
};

export const createAnnouncement = async (
  senderId: string,
  senderName: string,
  title: string,
  text: string
): Promise<Announcement> => {
  const ann: Announcement = {
    id: `ann-${Date.now()}`,
    senderId,
    senderName,
    title,
    text,
    timestamp: new Date().toISOString()
  };

  if (isRealFirebase) {
    try {
      await setDoc(doc(db, 'announcements', ann.id), cleanUndefined(ann));
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `announcements/${ann.id}`);
    }
  } else {
    const anns = getLocalStorage<Announcement[]>(LOCAL_STORAGE_KEYS.ANNOUNCEMENTS, []);
    anns.unshift(ann);
    setLocalStorage(LOCAL_STORAGE_KEYS.ANNOUNCEMENTS, anns);
  }
  return ann;
};

export const getAnnouncements = async (): Promise<Announcement[]> => {
  if (isRealFirebase) {
    try {
      const snap = await getDocs(collection(db, 'announcements'));
      const items: Announcement[] = [];
      snap.forEach(d => items.push(d.data() as Announcement));
      return items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, 'announcements');
      return [];
    }
  } else {
    const anns = getLocalStorage<Announcement[]>(LOCAL_STORAGE_KEYS.ANNOUNCEMENTS, []);
    return anns.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
};

export const requestMentorship = async (
  studentId: string,
  studentName: string,
  studentEmail: string,
  mentorId: string,
  mentorName: string
): Promise<MentorshipRequest> => {
  const req: MentorshipRequest = {
    id: `mentor-req-${studentId}-${mentorId}`,
    studentId,
    studentName,
    studentEmail,
    mentorId,
    mentorName,
    status: 'pending',
    timestamp: new Date().toISOString()
  };

  if (isRealFirebase) {
    try {
      await setDoc(doc(db, 'mentorshipRequests', req.id), cleanUndefined(req));
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `mentorshipRequests/${req.id}`);
    }
  } else {
    const reqs = getLocalStorage<MentorshipRequest[]>(LOCAL_STORAGE_KEYS.MENTORSHIP_REQUESTS, []);
    const existingIdx = reqs.findIndex(r => r.id === req.id);
    if (existingIdx === -1) {
      reqs.push(req);
    } else {
      reqs[existingIdx] = req;
    }
    setLocalStorage(LOCAL_STORAGE_KEYS.MENTORSHIP_REQUESTS, reqs);
  }
  return req;
};

export const getMentorshipRequests = async (mentorId: string): Promise<MentorshipRequest[]> => {
  if (isRealFirebase) {
    try {
      const q = query(collection(db, 'mentorshipRequests'), where('mentorId', '==', mentorId));
      const snap = await getDocs(q);
      const items: MentorshipRequest[] = [];
      snap.forEach(d => items.push(d.data() as MentorshipRequest));
      return items;
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, 'mentorshipRequests');
      return [];
    }
  } else {
    const reqs = getLocalStorage<MentorshipRequest[]>(LOCAL_STORAGE_KEYS.MENTORSHIP_REQUESTS, []);
    return reqs.filter(r => r.mentorId === mentorId);
  }
};

export const updateMentorshipStatus = async (requestId: string, status: 'approved' | 'rejected'): Promise<void> => {
  if (isRealFirebase) {
    try {
      await updateDoc(doc(db, 'mentorshipRequests', requestId), { status });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `mentorshipRequests/${requestId}`);
    }
  } else {
    const reqs = getLocalStorage<MentorshipRequest[]>(LOCAL_STORAGE_KEYS.MENTORSHIP_REQUESTS, []);
    const idx = reqs.findIndex(r => r.id === requestId);
    if (idx !== -1) {
      reqs[idx].status = status;
      setLocalStorage(LOCAL_STORAGE_KEYS.MENTORSHIP_REQUESTS, reqs);
    }
  }
};

export const inviteChild = async (parentEmail: string, childEmail: string): Promise<void> => {
  if (isRealFirebase) {
    try {
      const q = query(collection(db, 'users'), where('email', '==', parentEmail));
      const parentSnap = await getDocs(q);
      if (!parentSnap.empty) {
        const parentDoc = parentSnap.docs[0];
        const parentData = parentDoc.data() as UserProfile;
        const children = parentData.children || [];
        if (!children.includes(childEmail)) {
          children.push(childEmail);
          await updateDoc(doc(db, 'users', parentData.uid), { children });
        }
      }

      const qChild = query(collection(db, 'users'), where('email', '==', childEmail));
      const childSnap = await getDocs(qChild);
      if (!childSnap.empty) {
        const childDoc = childSnap.docs[0];
        const childData = childDoc.data() as UserProfile;
        await updateDoc(doc(db, 'users', childData.uid), { parentEmail });
      }
    } catch (err) {
      console.error('Error in inviteChild:', err);
    }
  } else {
    const users = getLocalStorage<Record<string, UserProfile>>(LOCAL_STORAGE_KEYS.USERS, {});
    let parentUid = '';
    Object.keys(users).forEach(uid => {
      if (users[uid].email === parentEmail) {
        parentUid = uid;
      }
    });

    if (parentUid && users[parentUid]) {
      const children = users[parentUid].children || [];
      if (!children.includes(childEmail)) {
        children.push(childEmail);
        users[parentUid].children = children;
      }
    }

    Object.keys(users).forEach(uid => {
      if (users[uid].email === childEmail) {
        users[uid].parentEmail = parentEmail;
      }
    });

    setLocalStorage(LOCAL_STORAGE_KEYS.USERS, users);

    const currentUser = getLocalStorage<UserProfile | null>(LOCAL_STORAGE_KEYS.CURRENT_USER, null);
    if (currentUser) {
      if (currentUser.email === parentEmail) {
        setLocalStorage(LOCAL_STORAGE_KEYS.CURRENT_USER, { ...currentUser, children: [...(currentUser.children || []), childEmail] });
      } else if (currentUser.email === childEmail) {
        setLocalStorage(LOCAL_STORAGE_KEYS.CURRENT_USER, { ...currentUser, parentEmail });
      }
    }
  }
};

export const getChildrenProgress = async (childEmails: string[]): Promise<Array<{ profile: UserProfile; enrollments: Enrollment[] }>> => {
  const results: Array<{ profile: UserProfile; enrollments: Enrollment[] }> = [];

  for (const email of childEmails) {
    let profile: UserProfile | null = null;
    let enrolls: Enrollment[] = [];

    if (isRealFirebase) {
      try {
        const q = query(collection(db, 'users'), where('email', '==', email));
        const snap = await getDocs(q);
        if (!snap.empty) {
          profile = snap.docs[0].data() as UserProfile;
          enrolls = await getStudentEnrollments(profile.uid);
        }
      } catch (err) {
        console.error('Error fetching child progress for email:', email, err);
      }
    } else {
      const users = getLocalStorage<Record<string, UserProfile>>(LOCAL_STORAGE_KEYS.USERS, {});
      Object.keys(users).forEach(uid => {
        if (users[uid].email === email) {
          profile = users[uid];
        }
      });
      if (profile) {
        enrolls = getLocalStorage<Enrollment[]>(LOCAL_STORAGE_KEYS.ENROLLMENTS, []).filter(e => e.studentId === (profile as UserProfile).uid);
      }
    }

    if (profile) {
      results.push({ profile, enrollments: enrolls });
    } else {
      results.push({
        profile: {
          uid: `unregistered-${email}`,
          email,
          displayName: email.split('@')[0],
          role: 'Student',
          profileCompleted: false,
          xp: 0,
          badges: []
        },
        enrollments: []
      });
    }
  }

  return results;
};

export const getAllUsers = async (): Promise<UserProfile[]> => {
  if (isRealFirebase) {
    try {
      const snap = await getDocs(collection(db, 'users'));
      const items: UserProfile[] = [];
      snap.forEach(d => items.push(d.data() as UserProfile));
      return items;
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, 'users');
      return [];
    }
  } else {
    const users = getLocalStorage<Record<string, UserProfile>>(LOCAL_STORAGE_KEYS.USERS, {});
    return Object.values(users);
  }
};

export const updateUserRoleAndStatusInDb = async (userId: string, role: UserRole, accessStatus?: 'active' | 'expired'): Promise<void> => {
  if (isRealFirebase) {
    try {
      const fields: any = { role };
      if (accessStatus) {
        fields.accessStatus = accessStatus;
      }
      await updateDoc(doc(db, 'users', userId), fields);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${userId}`);
    }
  } else {
    const users = getLocalStorage<Record<string, UserProfile>>(LOCAL_STORAGE_KEYS.USERS, {});
    if (users[userId]) {
      users[userId].role = role;
      if (accessStatus) {
        users[userId].accessStatus = accessStatus;
      }
      setLocalStorage(LOCAL_STORAGE_KEYS.USERS, users);
    }
  }
};

// --- UTM LINKS ---
export const saveUtmLink = async (link: Omit<UtmLink, 'id' | 'date'>): Promise<UtmLink> => {
  const newLink: UtmLink = {
    ...link,
    id: `utm-${Math.random().toString(36).substr(2, 9)}`,
    date: new Date().toISOString()
  };

  if (isRealFirebase && auth?.currentUser) {
    try {
      await setDoc(doc(db, 'utmLinks', newLink.id), cleanUndefined(newLink));
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `utmLinks/${newLink.id}`);
    }
  } else {
    const links = getLocalStorage<UtmLink[]>(LOCAL_STORAGE_KEYS.UTM_LINKS, []);
    links.push(newLink);
    setLocalStorage(LOCAL_STORAGE_KEYS.UTM_LINKS, links);
  }

  return newLink;
};

export const getUtmLinks = async (): Promise<UtmLink[]> => {
  if (isRealFirebase && auth?.currentUser) {
    try {
      const snapshot = await getDocs(collection(db, 'utmLinks'));
      const items: UtmLink[] = [];
      snapshot.forEach(d => items.push(d.data() as UtmLink));
      return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, 'utmLinks');
      return [];
    }
  } else {
    const links = getLocalStorage<UtmLink[]>(LOCAL_STORAGE_KEYS.UTM_LINKS, []);
    return links.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
};

