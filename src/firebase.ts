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
import { UserProfile, UserRole, ChatMessage, Notification, CommissionLog, Appointment, BrandAudit, SponsorshipRequest, Course } from './types';

// Detect whether real Firebase is configured
const isRealFirebase = 
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
    db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);
    auth = getAuth(firebaseApp);
    
    // Validate connection to Firestore as per Firebase Skill guidelines
    const testConnection = async () => {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    };
    testConnection();
  } catch (err) {
    console.error('Firebase initialization failed:', err);
  }
}

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
  CURRENT_USER: 'sac_current_user'
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
      await setDoc(doc(db, 'users', profile.uid), profile);
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
      await updateDoc(doc(db, 'users', uid), fields as any);
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

  if (isRealFirebase) {
    try {
      await setDoc(doc(db, 'brandAudits', newAudit.id), newAudit);
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
  if (isRealFirebase) {
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
export const bookAppointment = async (appt: Omit<Appointment, 'id' | 'status' | 'meetLink'>): Promise<Appointment> => {
  const newAppt: Appointment = {
    ...appt,
    id: `appt-${Math.random().toString(36).substr(2, 9)}`,
    meetLink: `https://meet.google.com/${Math.random().toString(36).substr(2, 3)}-${Math.random().toString(36).substr(2, 4)}-${Math.random().toString(36).substr(2, 3)}`,
    status: 'confirmed'
  };

  if (isRealFirebase) {
    try {
      await setDoc(doc(db, 'appointments', newAppt.id), newAppt);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `appointments/${newAppt.id}`);
    }
  } else {
    const appointments = getLocalStorage<Appointment[]>(LOCAL_STORAGE_KEYS.APPOINTMENTS, []);
    appointments.push(newAppt);
    setLocalStorage(LOCAL_STORAGE_KEYS.APPOINTMENTS, appointments);
  }

  return newAppt;
};

export const getAppointments = async (): Promise<Appointment[]> => {
  if (isRealFirebase) {
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

// --- NOTIFICATIONS ---
export const getNotifications = async (userId: string): Promise<Notification[]> => {
  if (isRealFirebase) {
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

  if (isRealFirebase) {
    try {
      await setDoc(doc(db, 'notifications', newNotif.id), newNotif);
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
  if (isRealFirebase) {
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

  if (isRealFirebase) {
    try {
      await setDoc(doc(db, `chats/${chatId}/messages`, newMessage.id), newMessage);
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
  if (isRealFirebase) {
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

  if (isRealFirebase) {
    try {
      await setDoc(doc(db, 'commissions', newLog.id), newLog);
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

  if (isRealFirebase) {
    try {
      await setDoc(doc(db, 'sponsorships', newReq.id), newReq);
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
  if (isRealFirebase) {
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
  if (isRealFirebase) {
    try {
      await updateDoc(doc(db, 'sponsorships', id), { status, sponsorId } as any);
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
