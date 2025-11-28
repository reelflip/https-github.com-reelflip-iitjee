import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, UserRole, Chapter, Progress, TestResult, Feedback, ChapterStatus, Subject } from '../types';
import { SYLLABUS_DATA, MOCK_TEST_RESULTS } from '../constants';

// --- CONFIGURATION ---
// Set this to true when you have uploaded 'api.php' to your server
const USE_LIVE_API = true; 
const API_URL = './api.php'; // Points to the PHP file in the same directory

interface AppContextType {
  currentUser: User | null;
  users: User[];
  login: (email: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  registerUser: (name: string, email: string, role: UserRole) => Promise<void>;
  deleteUser: (id: string) => void;
  
  chapters: Chapter[];
  addChapter: (chapter: Chapter) => void;
  deleteChapter: (id: string) => void;
  
  progress: Progress[];
  updateProgress: (chapterId: string, status: ChapterStatus) => void;
  
  testResults: TestResult[];
  feedbacks: Feedback[];
  sendFeedback: (message: string) => void;
  getSyllabusCoverage: () => { overall: number; physics: number; chemistry: number; math: number };
  
  setupDatabase: () => Promise<boolean>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Mock Users
const STUDENT_USER: User = { id: 's1', name: 'Rahul Sharma', email: 'rahul@example.com', role: UserRole.STUDENT };
const PARENT_USER: User = { id: 'p1', name: 'Mr. Sharma', email: 'parent@example.com', role: UserRole.PARENT, linkedStudentId: 's1' };
const ADMIN_USER: User = { id: 'a1', name: 'System Admin', email: 'admin@jeetracker.com', role: UserRole.ADMIN };

// Initial Progress Mock
const INITIAL_PROGRESS: Progress[] = SYLLABUS_DATA.map(ch => ({
  chapterId: ch.id,
  status: Math.random() > 0.7 ? ChapterStatus.COMPLETED : Math.random() > 0.4 ? ChapterStatus.IN_PROGRESS : ChapterStatus.NOT_STARTED,
  lastUpdated: new Date().toISOString(),
  completionPercentage: 0
}));

// Helper for safe fetching that handles "garbage" appended by free hosting providers
const safeFetch = async (url: string, options?: RequestInit) => {
  try {
    const res = await fetch(url, options);
    const text = await res.text();
    
    try {
      // First try standard parse
      return JSON.parse(text);
    } catch (e) {
      // If failed, try to sanitize (Hosting providers often add <script> or <div> at the end)
      try {
        // Find the last closing brace or bracket
        const lastBrace = text.lastIndexOf('}');
        const lastBracket = text.lastIndexOf(']');
        const cutOff = Math.max(lastBrace, lastBracket);
        
        if (cutOff > 0) {
          const cleanText = text.substring(0, cutOff + 1);
          return JSON.parse(cleanText);
        }
      } catch (e2) {
        // Fallback: console log but return null to prevent app crash
        console.warn("API returned invalid JSON even after cleaning:", text.substring(0, 100) + "...");
        return null;
      }
      return null;
    }
  } catch (err) {
    console.error("Network error:", err);
    return null;
  }
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([STUDENT_USER, PARENT_USER, ADMIN_USER]);
  
  const [chapters, setChapters] = useState<Chapter[]>(SYLLABUS_DATA);
  const [progress, setProgress] = useState<Progress[]>(INITIAL_PROGRESS);
  const [testResults] = useState<TestResult[]>(MOCK_TEST_RESULTS);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  // Load initial data from API if live
  useEffect(() => {
    if (USE_LIVE_API) {
      safeFetch(`${API_URL}?action=users`).then(data => {
        if (Array.isArray(data)) setUsers(data);
      });

      safeFetch(`${API_URL}?action=chapters`).then(data => {
        if (Array.isArray(data) && data.length > 0) setChapters(data);
      });
    }
  }, []);

  const login = async (email: string, role: UserRole) => {
    if (USE_LIVE_API) {
      const user = await safeFetch(`${API_URL}?action=login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role }) 
      });
      
      if (user && user.id) {
        setCurrentUser(user);
        return true;
      }
      return false;
    } else {
      // Simulating authentication logic
      const user = users.find(u => u.email === email && u.role === role);
      if (user) {
        setCurrentUser(user);
        return true;
      }
      // Fallback for demo purposes
      if (role === UserRole.ADMIN) { setCurrentUser(ADMIN_USER); return true; }
      if (role === UserRole.STUDENT) { setCurrentUser(STUDENT_USER); return true; }
      if (role === UserRole.PARENT) { setCurrentUser(PARENT_USER); return true; }
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const registerUser = async (name: string, email: string, role: UserRole) => {
    if (USE_LIVE_API) {
      await safeFetch(`${API_URL}?action=register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, role })
      });
      
      // Refresh user list
      const data = await safeFetch(`${API_URL}?action=users`);
      if(Array.isArray(data)) setUsers(data);
    } else {
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        email,
        role
      };
      setUsers([...users, newUser]);
    }
  };

  const deleteUser = async (id: string) => {
    // Optimistic update
    setUsers(users.filter(u => u.id !== id));
  };

  const addChapter = async (chapter: Chapter) => {
    if (USE_LIVE_API) {
      await safeFetch(`${API_URL}?action=addChapter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(chapter)
      });
    }
    setChapters([...chapters, chapter]);
  };

  const deleteChapter = (id: string) => {
    setChapters(chapters.filter(c => c.id !== id));
  };

  const updateProgress = async (chapterId: string, status: ChapterStatus) => {
    if (currentUser && USE_LIVE_API) {
      await safeFetch(`${API_URL}?action=updateProgress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id, chapterId, status })
      });
    }

    setProgress(prev => {
      const existing = prev.find(p => p.chapterId === chapterId);
      if (existing) {
        return prev.map(p => p.chapterId === chapterId ? { ...p, status, lastUpdated: new Date().toISOString() } : p);
      }
      return [...prev, { chapterId, status, lastUpdated: new Date().toISOString(), completionPercentage: 0 }];
    });
  };

  const sendFeedback = (message: string) => {
    const newFeedback: Feedback = {
      id: Date.now().toString(),
      fromId: currentUser?.id || 'unknown',
      toId: currentUser?.role === UserRole.PARENT ? (currentUser.linkedStudentId || 's1') : 'p1',
      message,
      date: new Date().toISOString(),
      isRead: false,
    };
    setFeedbacks(prev => [newFeedback, ...prev]);
  };

  const getSyllabusCoverage = () => {
    const calculate = (filterFn: (c: Chapter) => boolean) => {
      const relevantChapters = chapters.filter(filterFn);
      const completed = relevantChapters.filter(ch => {
        const prog = progress.find(p => p.chapterId === ch.id);
        return prog?.status === ChapterStatus.COMPLETED || prog?.status === ChapterStatus.REVISION;
      }).length;
      return relevantChapters.length > 0 ? Math.round((completed / relevantChapters.length) * 100) : 0;
    };

    return {
      overall: calculate(() => true),
      physics: calculate(c => c.subject === Subject.PHYSICS),
      chemistry: calculate(c => c.subject === Subject.CHEMISTRY),
      math: calculate(c => c.subject === Subject.MATH),
    };
  };

  const setupDatabase = async () => {
    if (USE_LIVE_API) {
      const result = await safeFetch(`${API_URL}?action=setup_db`);
      return !!result?.success;
    }
    return true;
  };

  return (
    <AppContext.Provider value={{ 
      currentUser, 
      users,
      login, 
      logout, 
      registerUser,
      deleteUser,
      chapters, 
      addChapter,
      deleteChapter,
      progress, 
      updateProgress, 
      testResults, 
      feedbacks,
      sendFeedback,
      getSyllabusCoverage,
      setupDatabase
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};