import React, { useState } from 'react';
import { 
  Users, Calendar, BookOpen, CreditCard, 
  MessageSquare, LayoutDashboard, LogOut, Search, Bell,Briefcase 
} from 'lucide-react';
import './AdminDashboard.css';

// Import sub-components
import EmployeeManagement from './EmployeeManagement';
import UserManagement from './UserManagement';
import AdminOverview from './AdminOverview';
// Import the sub-components (Assuming these files exist in the same folder)
// import UserManagement from './UserManagement';
import EventManagement from './EventManagement';

const AdminDashboard = () => {
  // Set this to 'overview' so it starts on the Dashboard Home
  const [activeTab, setActiveTab] = useState('overview');

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
            <Bell size={20} className="icon-badge" />
            <div className="user-info">
              <p>Admin Name</p>
              <span>Super Admin</span>
            </div>
            <div className="profile-img">AD</div>
          </div>
        </header>

        {/* --- FIXED: ONLY ONE MAIN TAG --- */}
        <main className="admin-content">
          {/* Tab 1: Overview Dashboard */}
          {activeTab === 'overview' && <AdminOverview />}

          {/* Tab 2: User Management (Udari) */}
          {activeTab === 'users' && <UserManagement />}

          {/* Tab 3: Employee Management (Methupa) */}
  {activeTab === 'employees' && <EmployeeManagement />}

          {/* Tab 3: Event Management (Sandaru) */}
          {activeTab === 'events' && (
            <EventManagement />
          )}

          {/* Placeholder for other teammates */}
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