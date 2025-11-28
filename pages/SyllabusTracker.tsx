import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Subject, ChapterStatus } from '../types';
import { CheckCircle2, Circle, Clock, RotateCcw, Filter } from 'lucide-react';

const SyllabusTracker: React.FC = () => {
  const { chapters, progress, updateProgress, currentUser, getSyllabusCoverage } = useApp();
  const [activeSubject, setActiveSubject] = useState<Subject>(Subject.PHYSICS);
  const [filterStatus, setFilterStatus] = useState<ChapterStatus | 'ALL'>('ALL');

  const coverage = getSyllabusCoverage();

  const getStatusIcon = (status: ChapterStatus) => {
    switch (status) {
      case ChapterStatus.COMPLETED: return <CheckCircle2 className="text-emerald-500" />;
      case ChapterStatus.IN_PROGRESS: return <Clock className="text-blue-500" />;
      case ChapterStatus.REVISION: return <RotateCcw className="text-purple-500" />;
      default: return <Circle className="text-slate-300" />;
    }
  };

  const getStatusColor = (status: ChapterStatus) => {
    switch (status) {
      case ChapterStatus.COMPLETED: return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case ChapterStatus.IN_PROGRESS: return 'bg-blue-50 text-blue-700 border-blue-200';
      case ChapterStatus.REVISION: return 'bg-purple-50 text-purple-700 border-purple-200';
      default: return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const filteredChapters = chapters
    .filter(ch => ch.subject === activeSubject)
    .filter(ch => {
      if (filterStatus === 'ALL') return true;
      const prog = progress.find(p => p.chapterId === ch.id);
      return prog?.status === filterStatus || (filterStatus === ChapterStatus.NOT_STARTED && !prog);
    });

  const getProgressForChapter = (chapterId: string) => {
    return progress.find(p => p.chapterId === chapterId) || { status: ChapterStatus.NOT_STARTED };
  };

  const handleStatusChange = (chapterId: string, currentStatus: ChapterStatus) => {
    // Cycle through statuses
    const cycle = [
      ChapterStatus.NOT_STARTED,
      ChapterStatus.IN_PROGRESS,
      ChapterStatus.COMPLETED,
      ChapterStatus.REVISION
    ];
    const currentIndex = cycle.indexOf(currentStatus);
    const nextStatus = cycle[(currentIndex + 1) % cycle.length];
    updateProgress(chapterId, nextStatus);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Syllabus Tracker</h1>
          <p className="text-slate-500 mt-1">Manage your chapter completion and revision status.</p>
        </div>
        
        {/* Subject Tabs */}
        <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
          {[Subject.PHYSICS, Subject.CHEMISTRY, Subject.MATH].map(subject => (
            <button
              key={subject}
              onClick={() => setActiveSubject(subject)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeSubject === subject 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {subject}
            </button>
          ))}
        </div>
      </div>

      {/* Progress Bar for Active Subject */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex justify-between items-end mb-2">
          <div>
            <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{activeSubject} Progress</span>
            <div className="text-3xl font-bold text-slate-900 mt-1">
              {activeSubject === Subject.PHYSICS ? coverage.physics : activeSubject === Subject.CHEMISTRY ? coverage.chemistry : coverage.math}%
            </div>
          </div>
          <div className="text-right text-sm text-slate-500">
            {progress.filter(p => {
              const ch = chapters.find(c => c.id === p.chapterId);
              return ch?.subject === activeSubject && (p.status === ChapterStatus.COMPLETED || p.status === ChapterStatus.REVISION);
            }).length} / {chapters.filter(c => c.subject === activeSubject).length} Chapters
          </div>
        </div>
        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-600 rounded-full transition-all duration-500"
            style={{ 
              width: `${activeSubject === Subject.PHYSICS ? coverage.physics : activeSubject === Subject.CHEMISTRY ? coverage.chemistry : coverage.math}%` 
            }}
          />
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <Filter size={18} className="text-slate-400 mr-2" />
        {['ALL', ChapterStatus.NOT_STARTED, ChapterStatus.IN_PROGRESS, ChapterStatus.COMPLETED, ChapterStatus.REVISION].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status as any)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              filterStatus === status
                ? 'bg-indigo-600 border-indigo-600 text-white'
                : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Chapters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredChapters.map(chapter => {
          const prog = getProgressForChapter(chapter.id);
          return (
            <div 
              key={chapter.id}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
              onClick={() => handleStatusChange(chapter.id, prog.status)}
            >
              <div className="flex justify-between items-start mb-3">
                <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${getStatusColor(prog.status)}`}>
                  {prog.status}
                </span>
                <div className="text-slate-400 group-hover:text-indigo-600 transition-colors">
                  {getStatusIcon(prog.status)}
                </div>
              </div>
              <h3 className="font-semibold text-slate-800 mb-1">{chapter.name}</h3>
              <p className="text-xs text-slate-500">{chapter.totalTopics} Topics</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SyllabusTracker;