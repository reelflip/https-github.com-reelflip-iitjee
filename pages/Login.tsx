import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { GraduationCap, Users, Lock, Mail, ShieldCheck, ArrowRight, Database, CheckCircle2, AlertTriangle } from 'lucide-react';

const Login: React.FC = () => {
  const { login, registerUser, setupDatabase } = useApp();
  const [activeTab, setActiveTab] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.STUDENT);
  
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'LOGIN') {
      const success = await login(formData.email, selectedRole);
      if (!success) {
        setToast("Login failed. Check your credentials.");
      }
    } else {
      await registerUser(formData.name, formData.email, selectedRole);
      setToast("Account created! Logging in...");
      setTimeout(() => login(formData.email, selectedRole), 1000);
    }
  };

  const handleForgotPassword = () => {
    setToast("Reset link sent to your email (Simulated)");
    setTimeout(() => setToast(null), 3000);
  };

  const handleInitDatabase = async () => {
    if (window.confirm("Initialize Database Tables? This will create tables if they don't exist.")) {
      setIsInitializing(true);
      setToast("Initializing database...");
      const success = await setupDatabase();
      setIsInitializing(false);
      if (success) {
        setToast("Database Initialized Successfully!");
      } else {
        setToast("Failed to initialize database. Check API connection.");
      }
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      {toast && (
        <div className="fixed top-4 right-4 bg-slate-800 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in flex items-center gap-2">
           <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
          {toast}
        </div>
      )}

      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-2 tracking-tight">JEE Prep<span className="text-indigo-600">Tracker</span></h1>
        <p className="text-slate-500 max-w-md mx-auto">
          Comprehensive progress tracking and analytics for IIT JEE aspirants.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-slate-100">
          <button 
            className={`flex-1 py-4 text-sm font-semibold transition-colors ${activeTab === 'LOGIN' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
            onClick={() => setActiveTab('LOGIN')}
          >
            Login
          </button>
          <button 
            className={`flex-1 py-4 text-sm font-semibold transition-colors ${activeTab === 'REGISTER' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
            onClick={() => setActiveTab('REGISTER')}
          >
            Register
          </button>
        </div>

        <div className="p-8">
          {/* Role Selection */}
          <div className="flex gap-2 mb-6">
            {[UserRole.STUDENT, UserRole.PARENT, UserRole.ADMIN].map(role => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-colors ${
                  selectedRole === role 
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                    : 'bg-white border-slate-200 text-slate-500 hover:border-indigo-300'
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {activeTab === 'REGISTER' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <div className="absolute left-3 top-2.5 text-slate-400"><Users size={16} /></div>
                  <input 
                    type="text" 
                    required 
                    className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute left-3 top-2.5 text-slate-400"><Mail size={16} /></div>
                <input 
                  type="email" 
                  required 
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <div className="absolute left-3 top-2.5 text-slate-400"><Lock size={16} /></div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  required 
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                />
                <button 
                  type="button"
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-indigo-600 text-xs"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {activeTab === 'LOGIN' && (
              <div className="flex justify-end">
                <button 
                  type="button" 
                  onClick={handleForgotPassword}
                  className="text-xs text-indigo-600 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            <button 
              type="submit" 
              className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
            >
              {activeTab === 'LOGIN' ? 'Sign In' : 'Create Account'}
              <ArrowRight size={16} />
            </button>
          </form>

          {selectedRole === UserRole.ADMIN && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-lg flex gap-2 items-start">
              <ShieldCheck className="text-amber-600 shrink-0 mt-0.5" size={16} />
              <p className="text-xs text-amber-700">
                <strong>Admin Mode:</strong> Access system settings, user management, and global analytics.
              </p>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-8 flex flex-col items-center gap-2 text-xs text-slate-400">
        <p>Simulated Database Environment • v1.1.0</p>
        <button 
          onClick={handleInitDatabase}
          disabled={isInitializing}
          className="flex items-center gap-2 px-3 py-1.5 bg-slate-200 text-slate-600 rounded hover:bg-slate-300 transition-colors"
        >
          {isInitializing ? (
             <div className="animate-spin h-3 w-3 border-2 border-slate-600 rounded-full border-t-transparent"></div>
          ) : (
             <Database size={12} />
          )}
          System Setup: Initialize Database
        </button>
      </div>
    </div>
  );
};

export default Login;