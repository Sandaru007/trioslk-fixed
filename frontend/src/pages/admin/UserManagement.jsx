import React, { useState } from 'react';
import { Search, Filter, Edit, Trash2, UserPlus, MoreVertical } from 'lucide-react';
import './AdminDashboard.css'; // We can reuse the same CSS file

const UserManagement = () => {
  // Dummy data for Udari to start with
  const [users] = useState([
    { id: 1, name: 'Sandaru Silva', email: 'sandaru@trioslk.com', role: 'Volunteer', status: 'Active' },
    { id: 2, name: 'Jithmina K.', email: 'jith@trioslk.com', role: 'Lecturer', status: 'Active' },
    { id: 3, name: 'Shenal Perera', email: 'shenal@trioslk.com', role: 'Student', status: 'Inactive' },
    { id: 4, name: 'Methupa D.', email: 'meth@trioslk.com', role: 'Lecturer', status: 'Active' },
  ]);

  const [filterRole, setFilterRole] = useState('All');

  const filteredUsers = filterRole === 'All' 
    ? users 
    : users.filter(user => user.role === filterRole);

  return (
    <div className="management-card">
      <div className="management-header">
        <div className="header-left">
          <h2>User Directory</h2>
          <p>Manage all registered members and their roles.</p>
        </div>
        <button className="add-btn">
          <UserPlus size={18} /> Add User
        </button>
      </div>

      <div className="filter-bar">
        <div className="search-wrapper">
          <Search size={16} />
          <input type="text" placeholder="Search by name or email..." />
        </div>
        <div className="role-filters">
          {['All', 'Student', 'Lecturer', 'Volunteer'].map(role => (
            <button 
              key={role}
              className={`filter-tag ${filterRole === role ? 'active' : ''}`}
              onClick={() => setFilterRole(role)}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      <table className="user-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            <tr key={user.id}>
              <td>
                <div className="user-info-cell">
                  <div className="user-avatar">{user.name.charAt(0)}</div>
                  <div>
                    <p className="user-name">{user.name}</p>
                    <p className="user-email">{user.email}</p>
                  </div>
                </div>
              </td>
              <td>
                <span className={`role-badge ${user.role.toLowerCase()}`}>
                  {user.role}
                </span>
              </td>
              <td>
                <span className={`status-indicator ${user.status.toLowerCase()}`}>
                  {user.status}
                </span>
              </td>
              <td className="action-cells">
                <button className="action-icon edit"><Edit size={16} /></button>
                <button className="action-icon delete"><Trash2 size={16} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;