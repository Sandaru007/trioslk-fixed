import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    specialization: '',
    qualifications: '',
    accessLevel: 'Lecturer'
  });

  const API_URL = 'http://localhost:8000/api/employees';

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(API_URL);
      setEmployees(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching employees", err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
        specialization: formData.specialization.split(',').map(s => s.trim()),
        qualifications: formData.qualifications.split(',').map(q => q.trim())
      };
      await axios.post(API_URL, dataToSend);
      alert("Lecturer Registered!");
      setFormData({ fullName: '', email: '', specialization: '', qualifications: '', accessLevel: 'Lecturer' });
      fetchEmployees();
    } catch {
      alert("Error registering lecturer");
    }
  };

  const updateStatus = async (id, updates) => {
  // 1. Update the UI locally first so the dropdown actually changes
  setEmployees(prevEmployees => 
    prevEmployees.map(emp => 
      emp._id === id ? { ...emp, ...updates } : emp
    )
  );

  try {
    // 2. Send the update to the server
    await axios.put(`${API_URL}/${id}`, updates);
    
    // 3. Optional: Refresh from server to ensure sync
    // fetchEmployees(); 
  } catch (err) {
    alert("Update failed. Reverting changes...");
    fetchEmployees(); // Rollback to original data if server fails
  }
  };

  // --- STYLES OBJECT ---
  const styles = {
    container: {
      padding: '40px 20px',
      maxWidth: '1100px',
      margin: 'auto',
      fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    },
    header: {
      color: '#2c3e50',
      marginBottom: '30px',
      fontWeight: '700',
      borderBottom: '2px solid #dee2e6',
      paddingBottom: '10px'
    },
    card: {
      background: 'white',
      padding: '25px',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
      marginBottom: '30px',
      border: '1px solid #e9ecef'
    },
    inputGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '15px',
      marginBottom: '15px'
    },
    input: {
      padding: '12px',
      borderRadius: '6px',
      border: '1px solid #ced4da',
      fontSize: '14px',
      outline: 'none',
      transition: 'border-color 0.2s'
    },
    button: {
      padding: '12px 24px',
      background: '#4a90e2',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '15px',
      transition: 'background 0.3s'
    },
    table: {
      width: '100%',
      borderCollapse: 'separate',
      borderSpacing: '0 10px',
    },
    th: {
      padding: '15px',
      textAlign: 'left',
      color: '#6c757d',
      fontWeight: '600',
      textTransform: 'uppercase',
      fontSize: '12px',
      letterSpacing: '1px'
    },
    tr: {
      background: 'white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
      borderRadius: '8px'
    },
    td: {
      padding: '15px',
      borderTop: '1px solid #f1f3f5',
      borderBottom: '1px solid #f1f3f5'
    },
    badge: {
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '11px',
      fontWeight: 'bold',
      marginRight: '5px',
      backgroundColor: '#e7f1ff',
      color: '#007bff'
    },
    select: {
      padding: '8px',
      borderRadius: '4px',
      border: '1px solid #ced4da',
      backgroundColor: '#fff'
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Staff Management Portal</h1>

      {/* REGISTRATION FORM */}
      <section style={styles.card}>
        <h3 style={{ marginTop: 0, color: '#4a5568' }}>Add New Staff Member</h3>
        <form onSubmit={handleSubmit}>
          <div style={styles.inputGrid}>
            <input style={styles.input} name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required />
            <input style={styles.input} name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
            <input style={styles.input} name="specialization" placeholder="Specializations (React, Java...)" value={formData.specialization} onChange={handleChange} />
            <input style={styles.input} name="qualifications" placeholder="Qualifications (BSc, MSc...)" value={formData.qualifications} onChange={handleChange} />
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <label style={{ fontSize: '14px', fontWeight: 'bold' }}>Access Level:</label>
            <select style={styles.select} name="accessLevel" value={formData.accessLevel} onChange={handleChange}>
              <option value="Lecturer">Lecturer</option>
              <option value="Senior Lecturer">Senior Lecturer</option>
              <option value="Admin">Admin</option>
            </select>
            <button type="submit" style={styles.button}>Register Member</button>
          </div>
        </form>
      </section>

      {/* EMPLOYEE LIST TABLE */}
      <section style={styles.card}>
        <h3 style={{ marginTop: 0, color: '#4a5568' }}>Current Employee Directory</h3>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>Loading records...</div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Lecturer Info</th>
                <th style={styles.th}>Specialization</th>
                <th style={styles.th}>Access</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => (
                <tr key={emp._id} style={{ ...styles.tr, opacity: emp.status === 'Resigned' ? 0.6 : 1 }}>
                  <td style={{ ...styles.td, color: '#4a90e2', fontWeight: 'bold' }}>
                    {emp.lecturerId || "NEW"}
                  </td>
                  <td style={styles.td}>
                    <div style={{ fontWeight: '600' }}>{emp.fullName}</div>
                    <div style={{ fontSize: '12px', color: '#6c757d' }}>{emp.email}</div>
                  </td>
                  <td style={styles.td}>
                    {emp.specialization?.map((spec, i) => (
                      <span key={i} style={styles.badge}>{spec}</span>
                    ))}
                  </td>
                  <td style={styles.td}>
                    <select 
                      style={styles.select}
                      value={emp.accessLevel || 'Lecturer'} 
                      onChange={(e) => updateStatus(emp._id, { accessLevel: e.target.value })}
                    >
                      <option value="Lecturer">Lecturer</option>
                      <option value="Senior Lecturer">Senior Lecturer</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </td>
                  <td style={styles.td}>
                    {emp.status === 'Active' ? (
                      <button 
                        onClick={() => updateStatus(emp._id, { status: 'Resigned' })} 
                        style={{ ...styles.button, background: '#fff', color: '#e74c3c', border: '1px solid #e74c3c', padding: '6px 12px', fontSize: '12px' }}
                      >
                        Deactivate
                      </button>
                    ) : (
                      <button 
                        onClick={() => updateStatus(emp._id, { status: 'Active' })} 
                        style={{ ...styles.button, background: '#2ecc71', padding: '6px 12px', fontSize: '12px' }}
                      >
                        Re-activate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
};

export default EmployeeManagement;