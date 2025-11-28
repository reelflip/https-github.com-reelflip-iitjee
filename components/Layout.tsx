import React from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { 
  LayoutDashboard, 
  BookOpen, 
  LineChart, 
  FileCheck, 
  LogOut, 
  Bell,
  MessageSquare,
  ShieldCheck,
  Settings
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, logout } = useApp();
  const location = useLocation();

  if (!currentUser) {
    return <>{children}</>;
  }

  const isParent = currentUser.role === UserRole.PARENT;
  const isAdmin = currentUser.role === UserRole.ADMIN;

  let navItems;

  if (isAdmin) {
    navItems = [
      { label: 'Admin Dashboard', path: '/admin', icon: ShieldCheck },
      { label: 'User Analytics', path: '/analytics', icon: LineChart },
      { label: 'Content Overview', path: '/syllabus', icon: BookOpen },
    ];
  } else if (isParent) {
    navItems = [
      { label: 'Overview', path: '/', icon: LayoutDashboard },
      { label: 'Student Progress', path: '/syllabus', icon: BookOpen },
      { label: 'Analytics', path: '/analytics', icon: LineChart },
    ];
  } else {
    // Student
    navItems = [
      { label: 'Dashboard', path: '/', icon: LayoutDashboard },
      { label: 'Syllabus Tracker', path: '/syllabus', icon: BookOpen },
      { label: 'Mock Tests', path: '/mock-tests', icon: FileCheck },
      { label: 'Analytics', path: '/analytics', icon: LineChart },
    ];
  }

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold ${isAdmin ? 'bg-amber-500' : 'bg-indigo-600'}`}>
              {isAdmin ? 'A' : 'J'}
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">JEE Tracker</h1>
          </div>
          <div className={`mt-4 px-3 py-2 rounded-md ${isAdmin ? 'bg-amber-50' : 'bg-indigo-50'}`}>
            <p className={`text-xs font-semibold uppercase tracking-wider ${isAdmin ? 'text-amber-600' : 'text-indigo-600'}`}>Current Role</p>
            <p className={`text-sm font-medium ${isAdmin ? 'text-amber-900' : 'text-indigo-900'}`}>{currentUser.role}</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive 
                    ? (isAdmin ? 'bg-amber-500 text-white shadow-md shadow-amber-200' : 'bg-indigo-600 text-white shadow-md shadow-indigo-200')
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon size={20} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 w-full text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <span className="md:hidden font-bold text-lg">JEE Tracker</span>
            <h2 className="hidden md:block text-lg font-semibold text-slate-700">
              {navItems.find(i => i.path === location.pathname)?.label || 'Dashboard'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-medium text-sm ${isAdmin ? 'bg-amber-500' : 'bg-gradient-to-tr from-indigo-500 to-purple-500'}`}>
              {currentUser.name.charAt(0)}
            </div>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;