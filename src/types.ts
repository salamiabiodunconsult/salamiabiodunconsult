/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 
  | 'Student'
  | 'Parent'
  | 'Teacher'
  | 'School Admin'
  | 'Mentor'
  | 'Sponsor'
  | 'Client'
  | 'Admin';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  role: UserRole;
  profileCompleted: boolean;
  phone?: string;
  xp?: number;
  badges?: string[];
  accessStatus?: 'active' | 'expired';
  termEnd?: string; // ISO date string
  paidBy?: 'client' | 'self' | 'teacher' | 'parent' | 'sponsor';
  children?: string[]; // email array or UID array for Parent
  parentEmail?: string; // for Student
  schoolId?: string; // for Teacher / Student
  bio?: string;
  companyName?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  duration: string;
  price: number; // in NGN
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  syllabus: string[];
  mentorId?: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number; // in NGN
  category: 'Gadgets' | 'E-Books' | 'Templates';
  rating: number;
  imageUrl?: string;
  downloads?: number;
}

export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Contract' | 'Part-time' | 'Remote';
  salary: string;
  description: string;
}

export interface Appointment {
  id: string;
  clientEmail: string;
  clientName: string;
  dateTime: string;
  serviceType: string;
  meetLink: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  companyName?: string;
}

export interface BrandAudit {
  id: string;
  clientEmail: string;
  clientName: string;
  websiteUrl: string;
  industry: string;
  primaryGoal: string;
  timestamp: string;
  reportPdfUrl?: string; // Mock PDF download
  status: 'pending' | 'completed';
  scores?: {
    seo: number;
    speed: number;
    social: number;
    marketing: number;
  };
  recommendations?: string[];
}

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  userId: string;
  text: string;
  timestamp: string;
  read: boolean;
}

export interface CommissionLog {
  id: string;
  userId: string;
  amount: number;
  type: 'Teacher' | 'Mentor' | 'Platform' | 'Sponsor';
  courseId: string;
  courseTitle: string;
  studentName: string;
  timestamp: string;
}

export interface SponsorshipRequest {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  courseId: string;
  courseTitle: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  sponsorId?: string;
  fundingNeeded?: number;
}
