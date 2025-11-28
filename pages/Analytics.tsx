import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';

const Analytics: React.FC = () => {
  const { testResults, getSyllabusCoverage } = useApp();
  const coverage = getSyllabusCoverage();

  const mockRadarData = [
    { subject: 'Mechanics', A: 120, fullMark: 150 },
    { subject: 'Optics', A: 98, fullMark: 150 },
    { subject: 'Algebra', A: 86, fullMark: 150 },
    { subject: 'Calculus', A: 99, fullMark: 150 },
    { subject: 'Organic', A: 85, fullMark: 150 },
    { subject: 'Physical', A: 65, fullMark: 150 },
  ];

  const barData = testResults.map(t => ({
    name: t.testName.split(' - ')[0],
    Physics: t.subjectBreakdown.Physics,
    Chemistry: t.subjectBreakdown.Chemistry,
    Math: t.subjectBreakdown.Mathematics
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Performance Analytics</h1>
        <p className="text-slate-500 mt-1">Deep dive into your strengths and weaknesses.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Topic Strength Analysis</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={mockRadarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 150]} />
                <Radar
                  name="Rahul"
                  dataKey="A"
                  stroke="#4f46e5"
                  fill="#4f46e5"
                  fillOpacity={0.6}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-center text-sm text-slate-500 mt-2">Based on recent mock test questions</p>
        </div>

        {/* Subject Breakdown Bar Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Score Breakdown by Subject</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{fontSize: 12}} />
                <YAxis />
                <Tooltip 
                   cursor={{fill: '#f8fafc'}}
                   contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend />
                <Bar dataKey="Physics" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Chemistry" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Math" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Weak Areas List */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Focus Areas (Weak Topics)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['Thermodynamics (Chem)', 'Complex Numbers', 'Rotational Motion'].map((topic, i) => (
              <div key={i} className="p-4 rounded-lg bg-red-50 border border-red-100 flex items-start gap-3">
                <div className="w-2 h-2 mt-2 rounded-full bg-red-500 shrink-0" />
                <div>
                  <h4 className="font-semibold text-red-900">{topic}</h4>
                  <p className="text-xs text-red-700 mt-1">Accuracy below 45% in last 3 tests.</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;