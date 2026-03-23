import React, { useState, useEffect, useCallback } from 'react';
import { Search, Trash2, CheckCircle } from 'lucide-react';
import api from '../../services/api'; 
import './AdminDashboard.css';


const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filterRole, setFilterRole] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Use useCallback to prevent the "Calling setState synchronously" warning
  const fetchUsers = useCallback(async () => {
    try {
      const studentRes = await api.get('/students');
      const volunteerRes = await api.get('/volunteers');
      
      // Look at your JSON: it uses "fullName" instead of "name"
      const studentData = (studentRes.data || []).map(s => ({
        id: s._id,
        name: `${s.firstName} ${s.lastName}`,
        email: s.email,
        role: 'Student',
        status: s.status || 'Active'
      }));

      const volunteerData = (volunteerRes.data || []).map(v => ({
        id: v._id,
        name: v.fullName, // <--- Fixed to match your JSON "fullName"
        email: v.email,
        role: 'Volunteer',
        status: v.status || 'Pending'
      }));

      setUsers([...studentData, ...volunteerData]);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }, []);

  // THE FIX: Trigger it once when the component mounts
  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApprove = async (id) => {
    try {
      await api.put(`/volunteers/${id}/approve`);
      alert("Volunteer Approved!");
      fetchUsers(); 
    } catch (error) {
      console.error("Approval Error:", error);
      alert("Approval failed: " + (error.response?.data?.message || "Server Error"));
    }
  };

  const handleDelete = async (id, role) => {
    if (window.confirm(`Are you sure you want to delete this ${role}?`)) {
      try {
        const path = role === 'Student' ? `/students/${id}` : `/volunteers/${id}`;
        await api.delete(path);
        alert(`${role} deleted successfully`);
        fetchUsers();
      } catch (error) {
        console.error("Delete Error:", error);
        alert("Delete failed");
      }
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesRole = filterRole === 'All' || user.role === filterRole;
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div className="management-card">
      <div className="management-header">
        <div className="header-left">
          <h2>User Directory</h2>
          <p>Manage all registered members and their roles.</p>
        </div>
      </div>

      <div className="filter-bar">
        <div className="search-wrapper">
          <Search size={16} />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="role-filters">
          {['All', 'Student', 'Volunteer'].map(role => (
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
          {filteredUsers.length > 0 ? (
            filteredUsers.map(user => (
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
                <td><span className={`role-badge ${user.role.toLowerCase()}`}>{user.role}</span></td>
                <td>
                  <span className={`status-indicator ${user.status.toLowerCase()}`}>
                    {user.status}
                  </span>
                </td>
                <td className="action-cells">
                  {user.role === 'Volunteer' && user.status === 'Pending' && (
                    <button className="action-icon approve" onClick={() => handleApprove(user.id)} title="Approve">
                      <CheckCircle size={18} />
                    </button>
                  )}
                  <button className="action-icon delete" onClick={() => handleDelete(user.id, user.role)} title="Delete">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="4" className="text-center py-4">No users found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;