import React, { useState, useEffect } from 'react';
import { 
  Users, Calendar, BookOpen, CreditCard, 
  MessageSquare, LayoutDashboard, LogOut, Search, Bell, Briefcase 
} from 'lucide-react';
import './AdminDashboard.css';
import api from '../../services/api';

// Import sub-components
import EmployeeManagement from './EmployeeManagement';
import UserManagement from './UserManagement';
import AdminOverview from './AdminOverview';
import EventManagement from './EventManagement';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [pendingCount, setPendingCount] = useState(0);

  // 1. Logic to fetch notifications
  const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/volunteers');
      // Only count those with 'Pending' status
      const pending = (data || []).filter(v => v.status === 'Pending').length;
      setPendingCount(pending);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  // 2. THE FIX: Initialize and set interval inside useEffect
  useEffect(() => {
    // eslint-disable-next-line
    fetchNotifications();

    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'users', label: 'User Management', icon: <Users size={20} /> },
    { id: 'employees', label: 'Employee Management', icon: <Briefcase size={20} /> },
    { id: 'events', label: 'Event Management', icon: <Calendar size={20} /> },
    { id: 'sessions', label: 'Session Management', icon: <BookOpen size={20} /> },
    { id: 'finance', label: 'Financial Reports', icon: <CreditCard size={20} /> },
    { id: 'feedback', label: 'Feedback & Inquiries', icon: <MessageSquare size={20} /> },
  ];

  return (
    <div className="admin-container">
      {/* SIDEBAR */}
      <aside className="admin-sidebar">
        <div className="sidebar-logo">
          <h2>Trioslk <span>Academy</span></h2>
        </div>
        
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button 
              key={item.id} 
              className={`nav-btn ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-link">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN SECTION */}
      <div className="admin-main">
        <header className="admin-header">
          <div className="header-search">
            <Search size={18} />
            <input type="text" placeholder="Search anything..." />
          </div>
          <div className="header-profile">
            {/* NOTIFICATION BADGE SECTION */}
            <div className="notification-badge">
              <Bell size={20} className="icon-badge" />
              {pendingCount > 0 && (
                <span className="badge-count">{pendingCount}</span>
              )}
            </div>
            
            <div className="user-info">
              <p>Admin Name</p>
              <span>Super Admin</span>
            </div>
            <div className="profile-img">AD</div>
          </div>
        </header>

        <main className="admin-content">
          {activeTab === 'overview' && <AdminOverview />}
          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'employees' && <EmployeeManagement />}
          {activeTab === 'events' && <EventManagement />}

          {['sessions', 'finance', 'feedback'].includes(activeTab) && (
            <div className="view-placeholder">
              <h3>Section Under Construction</h3>
              <p>This module is currently being developed by the team.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;