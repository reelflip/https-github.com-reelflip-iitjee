import React from 'react';
import { useApp } from '../context/AppContext';
import { Subject } from '../types';
import { PlayCircle, Award, Calendar, ChevronRight } from 'lucide-react';

const MockTests: React.FC = () => {
  const { testResults } = useApp();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Mock Tests & Practice</h1>
          <p className="text-slate-500 mt-1">Take tests to evaluate your preparation level.</p>
        </div>
        <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
          <PlayCircle size={20} />
          Start New Mock Test
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Available Tests */}
        <div className="lg:col-span-2 space-y-4">
           <h3 className="font-semibold text-slate-700 text-lg">Upcoming / Available Tests</h3>
           {[1, 2].map((i) => (
             <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
               <div>
                 <div className="flex items-center gap-2 mb-1">
                   <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded">FULL SYLLABUS</span>
                   <span className="text-slate-400 text-xs">• 3 Hours</span>
                 </div>
                 <h4 className="font-bold text-slate-900 text-lg">All India Mock Test #{i + 3}</h4>
                 <p className="text-slate-500 text-sm">Physics, Chemistry, Mathematics • 300 Marks</p>
               </div>
               <button className="px-5 py-2 rounded-lg border-2 border-indigo-600 text-indigo-600 font-bold hover:bg-indigo-50 transition-colors">
                 View Syllabus
               </button>
             </div>
           ))}
        </div>

        {/* Previous Results Summary */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit">
          <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <Award className="text-yellow-500" /> Performance Summary
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <span className="text-slate-600">Tests Taken</span>
              <span className="font-bold text-slate-900">{testResults.length}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <span className="text-slate-600">Highest Score</span>
              <span className="font-bold text-emerald-600">{Math.max(...testResults.map(t => t.score))}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Average Accuracy</span>
              <span className="font-bold text-slate-900">72%</span>
            </div>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="font-bold text-slate-800">Test History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm">
                <th className="px-6 py-4 font-medium">Test Name</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Score</th>
                <th className="px-6 py-4 font-medium">Breakdown (P/C/M)</th>
                <th className="px-6 py-4 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {testResults.map((test) => (
                <tr key={test.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{test.testName}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} />
                      {test.date}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-bold bg-indigo-50 text-indigo-700">
                      {test.score} / {test.totalScore}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {test.subjectBreakdown[Subject.PHYSICS]} / {test.subjectBreakdown[Subject.CHEMISTRY]} / {test.subjectBreakdown[Subject.MATH]}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-indigo-600">
                      <ChevronRight size={20} />
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
};

export default MockTests;