import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, UserRole, Subject, Chapter } from '../types';
import { 
  Users, 
  BookOpen, 
  Server, 
  Trash2, 
  Plus, 
  Search, 
  Settings,
  Database,
  ShieldAlert,
  RefreshCw,
  CheckCircle
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const AdminDashboard: React.FC = () => {
  const { users, chapters, deleteUser, addChapter, deleteChapter, currentUser } = useApp();
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'USERS' | 'SYLLABUS' | 'SETTINGS'>('OVERVIEW');

  // New Chapter Form State
  const [newChapter, setNewChapter] = useState<{subject: Subject, name: string, topics: number}>({
    subject: Subject.PHYSICS,
    name: '',
    topics: 5
  });

  // Overview Stats
  const stats = [
    { label: 'Total Users', value: users.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Chapters', value: chapters.length, icon: BookOpen, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Database Node', value: '82.25.121.80', icon: Server, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  // Chart Data
  const roleData = [
    { name: 'Student', value: users.filter(u => u.role === UserRole.STUDENT).length },
    { name: 'Parent', value: users.filter(u => u.role === UserRole.PARENT).length },
    { name: 'Admin', value: users.filter(u => u.role === UserRole.ADMIN).length },
  ];
  const COLORS = ['#4f46e5', '#a855f7', '#f59e0b'];

  const subjectData = [
    { name: 'Physics', count: chapters.filter(c => c.subject === Subject.PHYSICS).length },
    { name: 'Chemistry', count: chapters.filter(c => c.subject === Subject.CHEMISTRY).length },
    { name: 'Math', count: chapters.filter(c => c.subject === Subject.MATH).length },
  ];

  const handleAddChapter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChapter.name) return;
    const chapter: Chapter = {
      id: Math.random().toString(36).substr(2, 9),
      subject: newChapter.subject,
      name: newChapter.name,
      totalTopics: newChapter.topics
    };
    addChapter(chapter);
    setNewChapter({ ...newChapter, name: '' });
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className={`p-3 rounded-lg ${stat.bg}`}>
              <stat.icon className={stat.color} size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">User Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roleData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {roleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 text-sm">
            {roleData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                <span className="text-slate-600">{d.name} ({d.value})</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Content Stats</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex justify-between items-center">
        <h3 className="font-semibold text-slate-800">System Users</h3>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Search users..." 
            className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
      <table className="w-full text-left">
        <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
          <tr>
            <th className="px-6 py-4">User</th>
            <th className="px-6 py-4">Role</th>
            <th className="px-6 py-4">Email</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-slate-50">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs">
                    {user.name.charAt(0)}
                  </div>
                  <span className="font-medium text-slate-900">{user.name}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                  user.role === UserRole.ADMIN ? 'bg-amber-100 text-amber-700' : 
                  user.role === UserRole.STUDENT ? 'bg-indigo-100 text-indigo-700' : 'bg-purple-100 text-purple-700'
                }`}>
                  {user.role}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-slate-500">{user.email}</td>
              <td className="px-6 py-4 text-right">
                {user.id !== currentUser?.id && (
                  <button 
                    onClick={() => deleteUser(user.id)}
                    className="text-slate-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderSyllabus = () => (
    <div className="space-y-6">
      {/* Add Chapter Form */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Add New Chapter</h3>
        <form onSubmit={handleAddChapter} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-xs font-medium text-slate-700 mb-1">Subject</label>
            <select 
              value={newChapter.subject}
              onChange={(e) => setNewChapter({...newChapter, subject: e.target.value as Subject})}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            >
              {Object.values(Subject).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex-[2] w-full">
            <label className="block text-xs font-medium text-slate-700 mb-1">Chapter Name</label>
            <input 
              type="text" 
              value={newChapter.name}
              onChange={(e) => setNewChapter({...newChapter, name: e.target.value})}
              placeholder="e.g. Wave Optics"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            />
          </div>
          <div className="w-full md:w-32">
            <label className="block text-xs font-medium text-slate-700 mb-1">Total Topics</label>
            <input 
              type="number" 
              value={newChapter.topics}
              onChange={(e) => setNewChapter({...newChapter, topics: parseInt(e.target.value)})}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            />
          </div>
          <button 
            type="submit"
            className="w-full md:w-auto px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center justify-center gap-2"
          >
            <Plus size={16} /> Add
          </button>
        </form>
      </div>

      {/* Chapters List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100">
           <h3 className="font-semibold text-slate-800">All Chapters</h3>
        </div>
        <div className="max-h-[500px] overflow-y-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase sticky top-0">
              <tr>
                <th className="px-6 py-3">Subject</th>
                <th className="px-6 py-3">Chapter Name</th>
                <th className="px-6 py-3">Topics</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {chapters.map((chapter) => (
                <tr key={chapter.id} className="hover:bg-slate-50">
                  <td className="px-6 py-3 text-sm text-slate-600">{chapter.subject}</td>
                  <td className="px-6 py-3 text-sm font-medium text-slate-900">{chapter.name}</td>
                  <td className="px-6 py-3 text-sm text-slate-500">{chapter.totalTopics}</td>
                  <td className="px-6 py-3 text-right">
                    <button 
                      onClick={() => deleteChapter(chapter.id)}
                      className="text-slate-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <Settings size={20} /> System Configuration
        </h3>
        <button className="flex items-center gap-2 text-sm text-indigo-600 font-medium bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors">
          <RefreshCw size={14} /> Test Connection
        </button>
      </div>
      
      <div className="space-y-6">
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <Database className="text-slate-500" size={20} />
            <h4 className="font-medium text-slate-900">Remote MySQL Configuration</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Database Name</label>
              <div className="font-mono bg-white px-3 py-2 rounded border border-slate-200 text-slate-700 shadow-sm">
                u131922718_iitjee_tracker
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Access Host (IP)</label>
              <div className="font-mono bg-white px-3 py-2 rounded border border-slate-200 text-slate-700 shadow-sm flex justify-between items-center">
                <span>82.25.121.80</span>
                <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  <CheckCircle size={10} /> Active
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Driver</label>
              <div className="font-mono bg-white px-3 py-2 rounded border border-slate-200 text-slate-600">
                mysqli (PHP Native)
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Status</label>
              <div className="font-mono bg-white px-3 py-2 rounded border border-slate-200 text-slate-600">
                Bridge Mode (api.php)
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-red-50 rounded-lg border border-red-100">
          <div className="flex items-center gap-3 mb-2">
            <ShieldAlert className="text-red-600" size={20} />
            <h4 className="font-medium text-red-900">Danger Zone</h4>
          </div>
          <p className="text-sm text-red-700 mb-4">Irreversible actions for system administrators.</p>
          <div className="flex gap-4">
            <button className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50">
              Reset All Progress
            </button>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">
              Purge Deleted Users
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
          <p className="text-slate-500 mt-1">Manage users, content, and system settings.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 space-x-6">
        {[
          { id: 'OVERVIEW', label: 'Overview' },
          { id: 'USERS', label: 'User Management' },
          { id: 'SYLLABUS', label: 'Content & Syllabus' },
          { id: 'SETTINGS', label: 'Settings' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id 
                ? 'border-indigo-600 text-indigo-600' 
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="min-h-[500px]">
        {activeTab === 'OVERVIEW' && renderOverview()}
        {activeTab === 'USERS' && renderUsers()}
        {activeTab === 'SYLLABUS' && renderSyllabus()}
        {activeTab === 'SETTINGS' && renderSettings()}
      </div>
    </div>
  );
};

export default AdminDashboard;