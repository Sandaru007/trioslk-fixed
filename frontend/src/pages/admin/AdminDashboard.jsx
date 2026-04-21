import React, { useState, useEffect } from 'react';
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

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [pendingCount, setPendingCount] = useState(0);

  const [feedbacks, setFeedbacks] = useState([]);
  const [loadingFeedback, setLoadingFeedback] = useState(false);

  const [inquiries, setInquiries] = useState([]);
  const [loadingInquiry, setLoadingInquiry] = useState(false);

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/volunteers');
      const pending = (data || []).filter((v) => v.status === 'Pending').length;
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

  const fetchInquiries = async () => {
    try {
      setLoadingInquiry(true);
      const res = await api.get('/inquiries');
      setInquiries(res.data.data || []);
    } catch (error) {
      console.error('Error fetching inquiries', error);
    } finally {
      setLoadingInquiry(false);
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

  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeTab === 'feedback') {
      fetchFeedbacks();
      fetchInquiries();
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

          {activeTab === 'sessions' && (
            <div className="view-placeholder">
              <h3>Section Under Construction</h3>
            </div>
          )}

          {activeTab === 'feedback' && (
            <div className="session-management-box">
              <h2>Feedback & Inquiries Management</h2>

              <div style={{ marginBottom: '40px' }}>
                <h3 style={{ marginBottom: '15px' }}>Feedback</h3>

                {loadingFeedback ? (
                  <p>Loading feedback...</p>
                ) : feedbacks.length === 0 ? (
                  <p>No feedback found.</p>
                ) : (
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
                          <td>{item.rating}</td>
                          <td>{item.comment}</td>
                          <td>{item.showOnHomepage ? 'Visible' : 'Hidden'}</td>
                          <td>
                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                              <button onClick={() => handleShow(item._id)}>Show</button>
                              <button onClick={() => handleDelete(item._id)}>Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              <div>
                <h3 style={{ marginBottom: '15px' }}>Inquiries</h3>

                {loadingInquiry ? (
                  <p>Loading inquiries...</p>
                ) : inquiries.length === 0 ? (
                  <p>No inquiries found.</p>
                ) : (
                  <table className="feedback-table">
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
                          <td>{item.category}</td>
                          <td>{item.message}</td>
                          <td>{item.status}</td>
                          <td>
                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                              <button onClick={() => handleDeleteInquiry(item._id)}>
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {activeTab === 'finance' && (
            <div className="view-placeholder">
              <h3>Section Under Construction</h3>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;