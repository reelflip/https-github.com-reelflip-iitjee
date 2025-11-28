import React from 'react';
import { useApp } from '../context/AppContext';
import { UserRole, Subject } from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { Trophy, Clock, Target, AlertCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { currentUser, getSyllabusCoverage, testResults, feedbacks } = useApp();
  const coverage = getSyllabusCoverage();

  const isParent = currentUser?.role === UserRole.PARENT;

  const RecentTests = () => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Test Performance</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={testResults}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="testName" tick={{fontSize: 12}} interval={0} tickFormatter={(val) => val.split(' - ')[0]} />
            <YAxis domain={[0, 300]} />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Line type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={3} dot={{r: 4}} activeDot={{r: 8}} name="Total Score" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const SubjectProgress = () => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Syllabus Coverage</h3>
      <div className="space-y-6">
        {[
          { label: 'Physics', value: coverage.physics, color: 'bg-blue-500' },
          { label: 'Chemistry', value: coverage.chemistry, color: 'bg-teal-500' },
          { label: 'Mathematics', value: coverage.math, color: 'bg-rose-500' }
        ].map((sub) => (
          <div key={sub.label}>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium text-slate-700">{sub.label}</span>
              <span className="font-bold text-slate-900">{sub.value}%</span>
            </div>
            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className={`h-full ${sub.color} rounded-full transition-all duration-1000`} 
                style={{ width: `${sub.value}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const StatCard = ({ icon: Icon, label, value, color }: any) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-full ${color} bg-opacity-10 flex items-center justify-center shrink-0`}>
        <Icon size={24} className={color.replace('bg-', 'text-')} />
      </div>
      <div>
        <p className="text-sm text-slate-500 font-medium">{label}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            {isParent ? `Student Overview: Rahul` : `Welcome back, Rahul!`}
          </h1>
          <p className="text-slate-500 mt-1">
            {isParent 
              ? "Here's how your child is performing this week." 
              : "You're making great progress. Keep it up!"}
          </p>
        </div>
        {!isParent && (
          <button className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200">
            Resume Studying
          </button>
        )}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={Trophy} 
          label="Avg. Test Score" 
          value={`${Math.round(testResults.reduce((acc, curr) => acc + curr.score, 0) / testResults.length)}/300`} 
          color="bg-yellow-500" 
        />
        <StatCard 
          icon={Target} 
          label="Syllabus Done" 
          value={`${coverage.overall}%`} 
          color="bg-emerald-500" 
        />
        <StatCard 
          icon={Clock} 
          label="Study Hours" 
          value="34h" 
          color="bg-blue-500" 
        />
        <StatCard 
          icon={AlertCircle} 
          label="Pending Topics" 
          value="12" 
          color="bg-rose-500" 
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentTests />
        </div>
        <div>
          <SubjectProgress />
        </div>
      </div>

      {/* Feedback / Notifications Area */}
      {isParent && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Teacher & System Notes</h3>
          <div className="space-y-4">
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-100 flex gap-3">
              <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={20} />
              <div>
                <p className="text-sm font-semibold text-amber-800">Physics - Rotational Motion</p>
                <p className="text-sm text-amber-700 mt-1">Rahul is struggling with Moment of Inertia concepts. Recommended to review the basics.</p>
              </div>
            </div>
            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100 flex gap-3">
              <Trophy className="text-emerald-600 shrink-0 mt-0.5" size={20} />
              <div>
                <p className="text-sm font-semibold text-emerald-800">Mock Test 2 Result</p>
                <p className="text-sm text-emerald-700 mt-1">Great improvement in Mechanics! Score increased by 15% compared to last month.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;