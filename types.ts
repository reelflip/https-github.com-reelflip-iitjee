export enum UserRole {
  STUDENT = 'STUDENT',
  PARENT = 'PARENT',
  ADMIN = 'ADMIN'
}

export enum Subject {
  PHYSICS = 'Physics',
  CHEMISTRY = 'Chemistry',
  MATH = 'Mathematics'
}

export enum ChapterStatus {
  NOT_STARTED = 'Not Started',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
  REVISION = 'Revision'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  avatarUrl?: string;
  linkedStudentId?: string; // For parents
}

export interface Chapter {
  id: string;
  subject: Subject;
  name: string;
  totalTopics: number;
}

export interface Progress {
  chapterId: string;
  status: ChapterStatus;
  lastUpdated: string;
  completionPercentage: number; // 0-100
}

export interface TestResult {
  id: string;
  testName: string;
  date: string;
  score: number;
  totalScore: number;
  subjectBreakdown: {
    [key in Subject]: number;
  };
}

export interface Feedback {
  id: string;
  fromId: string;
  toId: string;
  message: string;
  date: string;
  isRead: boolean;
}