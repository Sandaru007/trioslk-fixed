import React, { useState, useEffect, useCallback } from 'react';
import {
  Users,
  Calendar,
  BookOpen,
  CreditCard,
  MessageSquare,
  LayoutDashboard,
  LogOut,
  Search,
  Bell,
  Briefcase
} from 'lucide-react';
import './AdminDashboard.css';
import api from '../../services/api';

// Import sub-components
import EmployeeManagement from './EmployeeManagement';
import UserManagement from './UserManagement';
import AdminOverview from './AdminOverview';
import EventManagement from './EventManagement';
import FinancialReport from './FinancialReport';
import SessionManagement from './SessionManagement'; 

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [pendingCount, setPendingCount] = useState(0);

  const [feedbacks, setFeedbacks] = useState([]);
  const [loadingFeedback, setLoadingFeedback] = useState(false);

  const [inquiries, setInquiries] = useState([]);
  const [loadingInquiry, setLoadingInquiry] = useState(false);

  // --- FIXED: Properly wrapped in useCallback ---
  const fetchNotifications = useCallback(async () => {
    try {
      const { data } = await api.get('/volunteers');
      const pending = (data || []).filter((v) => v.status === 'Pending').length;
      setPendingCount(pending);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  }, []);

  // 2. Fetch Session Feedbacks
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

  // --- FIXED: Wrapped fetchInquiries in useCallback so it works safely in useEffect ---
  const fetchInquiries = useCallback(async () => {
    try {
      setLoadingInquiry(true);
      const res = await api.get('/inquiries');
      setInquiries(res.data.data || []);
    } catch (error) {
      console.error('Error fetching inquiries', error);
    } finally {
      setLoadingInquiry(false);
    }
  }, []);

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

  const handleDeleteInquiry = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this inquiry?');
    if (!confirmDelete) return;

    try {
      await api.delete(`/inquiries/${id}`);
      fetchInquiries();
      alert('Inquiry deleted successfully');
    } catch (error) {
      console.error('Error deleting inquiry', error);
      alert('Failed to delete inquiry');
    }
  };

  // --- FIXED: Added disable lint comments for intentional data-fetching state updates ---
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  useEffect(() => {
    if (activeTab === 'feedback') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchFeedbacks();
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchInquiries();
    }
  }, [activeTab, fetchFeedbacks, fetchInquiries]);

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
          <h2>
            Trioslk <span>Academy</span>
          </h2>
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

          {/* SESSIONS: Real Component */}
          {activeTab === 'sessions' && <SessionManagement />}

          {activeTab === 'feedback' && (
  <div className="management-wrapper">
    <div className="management-header">
      <h2>Feedback & Inquiries Management</h2>
      <p>Manage homepage feedback visibility and user inquiries in one place.</p>
    </div>

    <div className="management-section">
      <div className="section-title-row">
        <h3>Feedback</h3>
        <span className="section-count">{feedbacks.length} items</span>
      </div>

      {loadingFeedback ? (
        <p className="empty-text">Loading feedback...</p>
      ) : feedbacks.length === 0 ? (
        <p className="empty-text">No feedback found.</p>
      ) : (
        <div className="table-wrap">
          <table className="feedback-table modern-table">
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
                  <td>
                    <span className="rating-badge">{item.rating}/5</span>
                  </td>
                  <td>{item.comment}</td>
                  <td>
                    <span className={item.showOnHomepage ? 'status-badge visible' : 'status-badge hidden'}>
                      {item.showOnHomepage ? 'Visible' : 'Hidden'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="action-btn show-btn"
                        onClick={() => handleShow(item._id)}
                      >
                        Show
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => handleDelete(item._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>

    <div className="management-section">
      <div className="section-title-row">
        <h3>Inquiries</h3>
        <span className="section-count">{inquiries.length} items</span>
      </div>

      {loadingInquiry ? (
        <p className="empty-text">Loading inquiries...</p>
      ) : inquiries.length === 0 ? (
        <p className="empty-text">No inquiries found.</p>
      ) : (
        <div className="table-wrap">
          <table className="feedback-table modern-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Category</th>
                <th>Message</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((item) => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>
                    <span className="category-badge">{item.category}</span>
                  </td>
                  <td>{item.message}</td>
                  <td>
                    <span className={item.status === 'Resolved' ? 'status-badge resolved' : 'status-badge pending'}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="action-btn delete-btn"
                        onClick={() => handleDeleteInquiry(item._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  </div>
)}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;