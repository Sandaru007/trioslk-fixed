import React, { useState, useEffect, useCallback } from 'react';
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
import FinancialReport from './FinancialReport';
// Assuming your team member creates this file:
// import SessionManagement from './SessionManagement'; 

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [pendingCount, setPendingCount] = useState(0);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loadingFeedback, setLoadingFeedback] = useState(false);

  // 1. Fetch Volunteer Notifications
  const fetchNotifications = useCallback(async () => {
    try {
      const { data } = await api.get('/volunteers');
      const pending = (data || []).filter(v => v.status === 'Pending').length;
      setPendingCount(pending);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  }, []);

  // 2. Fetch Session Feedbacks (Now called when 'feedback' tab is active)
  const fetchFeedbacks = useCallback(async () => {
    try {
      setLoadingFeedback(true);
      const res = await api.get('/feedback');
      setFeedbacks(res.data.data || []);
    } catch (error) {
      console.error('Error fetching feedback', error);
    } finally {
      setLoadingFeedback(false);
    }
  }, []);

  // 3. Feedback Action Handlers
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
    if (!window.confirm('Are you sure you want to delete this feedback?')) return;
    try {
      await api.delete(`/feedback/${id}`);
      fetchFeedbacks();
      alert('Feedback deleted successfully');
    } catch (error) {
      console.error('Error deleting feedback', error);
      alert('Failed to delete feedback');
    }
  };

  // Effect for Notifications
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // FIXED: Now triggers when 'feedback' tab is selected
  useEffect(() => {
    if (activeTab === 'feedback') {
      fetchFeedbacks();
    }
  }, [activeTab, fetchFeedbacks]);

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
            <div className="notification-badge">
              <Bell size={20} className="icon-badge" />
              {pendingCount > 0 && <span className="badge-count">{pendingCount}</span>}
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
          {activeTab === 'finance' && <FinancialReport />}

          {/* SESSIONS: Now ready for your team member's component */}
          {activeTab === 'sessions' && (
            <div className="view-placeholder">
              <h3>Session Management</h3>
              <p>The session management system is currently being implemented.</p>
              {/* Once ready, replace the placeholder with: <SessionManagement /> */}
            </div>
          )}

          {/* FEEDBACK: Now contains the feedback management table */}
          {activeTab === 'feedback' && (
            <div className="session-management-box">
              <h2>Feedback & Inquiries Management</h2>
              <p className="text-muted small">Manage user feedback and homepage visibility.</p>
              {loadingFeedback ? (
                <p>Loading feedback data...</p>
              ) : feedbacks.length === 0 ? (
                <p>No feedback found.</p>
              ) : (
                <div className="feedback-table-wrapper">
                  <table className="feedback-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Course</th>
                        <th>Rating</th>
                        <th>Comment</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {feedbacks.map((item) => (
                        <tr key={item._id}>
                          <td>{item.name}</td>
                          <td>{item.course}</td>
                          <td>{item.rating} / 5</td>
                          <td><span className="small">{item.comment}</span></td>
                          <td>
                            <span className={item.showOnHomepage ? 'text-success fw-bold' : 'text-muted'}>
                              {item.showOnHomepage ? 'Visible' : 'Hidden'}
                            </span>
                          </td>
                          <td className="action-cells">
                            <button className="show-btn" onClick={() => handleShow(item._id)} disabled={item.showOnHomepage}>
                              Show
                            </button>
                            <button className="delete-btn" onClick={() => handleDelete(item._id)}>
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
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;