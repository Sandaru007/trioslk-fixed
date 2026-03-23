import React, { useState } from 'react';
import { LayoutDashboard, BookOpen, FileText, User, Bell, LogOut } from 'lucide-react';
import './Dashboard.css';

// Import your sub-components
import DashboardHome from './DashboardHome';
import MyCourses from './MyCourses';
import Assignments from './Assignments';
import Profile from './Profile';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const getHeaderTitle = () => {
    switch(activeTab) {
      case 'dashboard': return 'Student Dashboard';
      case 'my-courses': return 'My Courses';
      case 'assignments': return 'Assignments';
      case 'profile': return 'My Profile';
      default: return 'Dashboard';
    }
  };

  return (
    <div className="student-container">

      {/* SIDEBAR */}
      <aside className="student-sidebar shadow-sm">
        <div className="student-sidebar-logo">
          <h2>TrioSLK <span>Student</span></h2>
        </div>

        <nav className="student-nav">
          <button 
            className={`student-nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`} 
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard size={20} /> Dashboard
          </button>

          <button 
            className={`student-nav-btn ${activeTab === 'my-courses' ? 'active' : ''}`} 
            onClick={() => setActiveTab('my-courses')}
          >
            <BookOpen size={20} /> My Courses
          </button>

          <button 
            className={`student-nav-btn ${activeTab === 'assignments' ? 'active' : ''}`} 
            onClick={() => setActiveTab('assignments')}
          >
            <FileText size={20} /> Assignments
          </button>

          <button 
            className={`student-nav-btn ${activeTab === 'profile' ? 'active' : ''}`} 
            onClick={() => setActiveTab('profile')}
          >
            <User size={20} /> Profile
          </button>
        </nav>

        {/* LOGOUT BUTTON */}
        <div className="p-3 border-top">
          <button className="student-nav-btn text-danger">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="student-main">

        {/* Top Header */}
        <header className="student-header border">
          <h1>{getHeaderTitle()}</h1>

          <div className="header-actions">
            <Bell size={22} className="text-muted" style={{ cursor: 'pointer' }} />
            <div className="d-flex align-items-center gap-2">
              <div className="student-mini-profile">KS</div>
              <span className="fw-medium text-dark d-none d-md-block">Kavishka S.</span>
            </div>
          </div>
        </header>

        {/* Tab Content Rendering */}
        <div className="animate__animated animate__fadeIn">
          {activeTab === 'dashboard' && <DashboardHome />}
          {activeTab === 'my-courses' && <MyCourses />}
          {activeTab === 'assignments' && <Assignments />}
          {activeTab === 'profile' && <Profile />}
        </div>

      </main>
    </div>
  );
};

export default Dashboard;