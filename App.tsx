import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import SyllabusTracker from './pages/SyllabusTracker';
import MockTests from './pages/MockTests';
import Analytics from './pages/Analytics';
import AdminDashboard from './pages/AdminDashboard';
import { UserRole } from './types';

const AppRoutes: React.FC = () => {
  const { currentUser } = useApp();

  if (!currentUser) {
    return <Login />;
  }

  // Admin Routes
  if (currentUser.role === UserRole.ADMIN) {
    return (
      <Layout>
        <Routes>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/syllabus" element={<SyllabusTracker />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </Layout>
    );
  }

  // Student & Parent Routes
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/syllabus" element={<SyllabusTracker />} />
        <Route path="/mock-tests" element={<MockTests />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AppProvider>
  );
};

export default App;