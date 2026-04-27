import React, { useState } from 'react';
import { LayoutDashboard, BookOpen, FileText, User, Bell, LogOut, Search, Mail } from 'lucide-react';
import './Dashboard.css';
import DashboardHome from './DashboardHome';
import MyCourses from './MyCourses';
import Assignments from './Assignments';
import Profile from './Profile'
import profileImg from '../../assets/images/profile.png';
import logoImg from '../../assets/images/logo.jpg'; 

import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();
  
  const [userInfo, setUserInfo] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem('trioslk_userInfo') || '{}');
    } catch {
      return {};
    }
  });

  React.useEffect(() => {
    const handleProfileUpdate = () => {
      try {
        setUserInfo(JSON.parse(sessionStorage.getItem('trioslk_userInfo') || '{}'));
      } catch (e) {}
    };
    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => window.removeEventListener('profileUpdated', handleProfileUpdate);
  }, []);

  const resolveDashboardImageUrl = (url) => {
    if (!url) return profileImg;
    if (url.startsWith('http')) return url;
    if (url.includes('\\uploads\\')) {
      return `http://localhost:8000/uploads/${url.split('\\uploads\\').pop()}`;
    }
    if (url.includes('/uploads/')) {
      return `http://localhost:8000/uploads/${url.split('/uploads/').pop()}`;
    }
    return `http://localhost:8000${url.startsWith('/') ? '' : '/'}${url}`;
  };

  return (
    <div className="student-container">
      {/* SIDEBAR */}
      <aside className="student-sidebar">
        <div className="student-sidebar-logo" onClick={() => navigate('/courses')} style={{ cursor: 'pointer' }}>
          <img src={logoImg} alt="TriosLK Logo"/>
          <h2>TriosLK Academy</h2>
        </div>

        <nav className="student-nav">
          <button className={`student-nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button className={`student-nav-btn ${activeTab === 'my-courses' ? 'active' : ''}`} onClick={() => setActiveTab('my-courses')}>
            <BookOpen size={20} /> My Courses
          </button>
          <button className={`student-nav-btn ${activeTab === 'assignments' ? 'active' : ''}`} onClick={() => setActiveTab('assignments')}>
            <FileText size={20} /> Assignments
          </button>
          <button className={`student-nav-btn ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
            <User size={20} /> Profile
          </button>
        </nav>

        {/* LOGOUT BUTTON */}
        <div className="p-3 border-top mt-auto">
          <button className="student-nav-btn text-danger" onClick={() => { sessionStorage.removeItem('trioslk_userInfo'); sessionStorage.removeItem('trioslk_token'); navigate('/login'); }}>
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="student-main">
        {/* Top Header */}
        <header className="student-header">
          <div className="search-container">
            <Search size={18} className="search-icon" />
            <input type="text" placeholder="Search..." className="search-input" />
          </div>

          <div className="header-actions">
            <button className="icon-btn"><Mail size={20} /></button>
            <button className="icon-btn"><Bell size={20} /><span className="notification-badge"></span></button>
            
            <button className="user-profile-btn" onClick={() => setActiveTab('profile')} style={{ cursor: 'pointer' }}>
              <img 
                src={resolveDashboardImageUrl(userInfo.profilePhoto)} 
                alt={userInfo.name || 'Student'} 
                className="user-avatar" 
              />
              <div className="user-info d-none d-md-block">
                <span className="user-name">{userInfo.name || 'Student'}</span>
                <span className="user-role">{userInfo.role ? userInfo.role.charAt(0).toUpperCase() + userInfo.role.slice(1) : 'Student'}</span>
              </div>
            </button>
          </div>
        </header>

        {/* Tab Content Rendering */}
        <div className="animate__animated animate__fadeIn flex-grow-1">
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