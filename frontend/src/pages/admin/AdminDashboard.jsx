<<<<<<< Updated upstream
import React, { useState } from 'react';
import { 
  Users, Calendar, BookOpen, CreditCard, 
  MessageSquare, LayoutDashboard, LogOut, Search, Bell,Briefcase 
=======
import React, { useState, useEffect } from 'react';
import {
  Users, Calendar, BookOpen, CreditCard,
  MessageSquare, LayoutDashboard, LogOut, Search, Bell, Briefcase
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
=======
  const [pendingCount, setPendingCount] = useState(0);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loadingFeedback, setLoadingFeedback] = useState(false);

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/volunteers');
      const pending = (data || []).filter(v => v.status === 'Pending').length;
      setPendingCount(pending);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    }
  };

  const fetchFeedbacks = async () => {
    try {
      setLoadingFeedback(true);
      const res = await api.get('/feedback');
      setFeedbacks(res.data.data || []);
    } catch (error) {
      console.error('Error fetching feedback', error);
    } finally {
      setLoadingFeedback(false);
    }
  };

  const handleShow = async (id) => {
    try {
      await api.put(`/feedback/${id}/show`);
      fetchFeedbacks();
      alert('Feedback is now visible on homepage');
    } catch (error) {
      console.error('Error showing feedback', error);
      alert('Failed to show feedback');
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this feedback?');
    if (!confirmDelete) return;

    try {
      await api.delete(`/feedback/${id}`);
      fetchFeedbacks();
      alert('Feedback deleted successfully');
    } catch (error) {
      console.error('Error deleting feedback', error);
      alert('Failed to delete feedback');
    }
  };

  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000);

    return () => clearInterval(interval);
  }, []);
>>>>>>> Stashed changes

  useEffect(() => {
    if (activeTab === 'sessions') {
      fetchFeedbacks();
    }
  }, [activeTab]);

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

      <div className="admin-main">
        <header className="admin-header">
          <div className="header-search">
            <Search size={18} />
            <input type="text" placeholder="Search anything..." />
          </div>
          <div className="header-profile">
<<<<<<< Updated upstream
            <Bell size={20} className="icon-badge" />
=======
            <div className="notification-badge">
              <Bell size={20} className="icon-badge" />
              {pendingCount > 0 && (
                <span className="badge-count">{pendingCount}</span>
              )}
            </div>

>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
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
=======
          {activeTab === 'sessions' && (
            <div className="session-management-box">
              <h2>Session Management Feedback</h2>
              <p>Manage submitted feedback and choose what appears on the homepage.</p>

              {loadingFeedback ? (
                <p>Loading feedback...</p>
              ) : feedbacks.length === 0 ? (
                <p>No feedback found.</p>
              ) : (
                <div className="feedback-table-wrapper">
                  <table className="feedback-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Course</th>
                        <th>Rating</th>
                        <th>Comment</th>
                        <th>Recommend</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {feedbacks.map((item) => (
                        <tr key={item._id}>
                          <td>{item.name}</td>
                          <td>{item.email}</td>
                          <td>{item.course}</td>
                          <td>{item.rating}</td>
                          <td>{item.comment}</td>
                          <td>{item.recommend ? 'Yes' : 'No'}</td>
                          <td>{item.showOnHomepage ? 'Visible' : 'Hidden'}</td>
                          <td>
                            <button
                              className="show-btn"
                              onClick={() => handleShow(item._id)}
                              disabled={item.showOnHomepage}
                            >
                              {item.showOnHomepage ? 'Shown' : 'Show'}
                            </button>

                            <button
                              className="delete-btn"
                              onClick={() => handleDelete(item._id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {['finance', 'feedback'].includes(activeTab) && (
>>>>>>> Stashed changes
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