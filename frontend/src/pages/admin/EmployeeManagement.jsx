/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    nic: '',
    phone: '',
    address: '',
    specialization: '',
    qualifications: '',
    accessLevel: 'Lecturer'
  });

  const API_URL = 'http://localhost:8000/api/employees';

  const fetchEmployees = useCallback(async () => {
    try {
      const res = await axios.get(API_URL);
      setEmployees(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching employees", err);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Inside EmployeeManagement.jsx -> handleSubmit function
  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const dataToSend = {
      ...formData,
      specialization: formData.specialization ? formData.specialization.split(',').map(s => s.trim()) : [],
      qualifications: formData.qualifications ? formData.qualifications.split(',').map(q => q.trim()) : []
    };
    
    const response = await axios.post(API_URL, dataToSend);
    
    if (response.data.success) {
      alert(`Lecturer Registered! Credentials sent to ${formData.email}`);
      setFormData({ 
        fullName: '', email: '', nic: '', phone: '', address: '', 
        specialization: '', qualifications: '', accessLevel: 'Lecturer' 
      });
      fetchEmployees();
    }
  } catch (err) {
    // If backend returns validation errors
    if (err.response && err.response.data.errors) {
      const errorMsgs = Object.values(err.response.data.errors).join('\n');
      alert("Validation Errors:\n" + errorMsgs);
    } else {
      alert("Error: " + (err.response?.data?.message || "Registration failed"));
    }
  }
};

  const updateStatus = async (id, updates) => {
    setEmployees(prevEmployees => 
      prevEmployees.map(emp => emp._id === id ? { ...emp, ...updates } : emp)
    );
    try {
      await axios.put(`${API_URL}/${id}`, updates);
    } catch (err) {
      console.error("Update failed:", err);
      alert("Update failed.");
      fetchEmployees(); 
    }
  };

  const styles = {
    container: { padding: '40px 20px', maxWidth: '1200px', margin: 'auto', fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif", backgroundColor: '#f8f9fa', minHeight: '100vh' },
    header: { color: '#2c3e50', marginBottom: '30px', fontWeight: '700', borderBottom: '2px solid #dee2e6', paddingBottom: '10px' },
    card: { background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '30px', border: '1px solid #e9ecef' },
    inputGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '15px' },
    input: { padding: '12px', borderRadius: '6px', border: '1px solid #ced4da', fontSize: '14px', outline: 'none' },
    button: { padding: '12px 24px', background: '#4a90e2', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', transition: '0.3s' },
    table: { width: '100%', borderCollapse: 'separate', borderSpacing: '0 10px' },
    th: { padding: '15px', textAlign: 'left', color: '#6c757d', fontWeight: '600', textTransform: 'uppercase', fontSize: '12px' },
    tr: { background: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', borderRadius: '8px' },
    td: { padding: '15px', borderTop: '1px solid #f1f3f5', borderBottom: '1px solid #f1f3f5' },
    select: { padding: '8px', borderRadius: '4px', border: '1px solid #ced4da', backgroundColor: '#fff' }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Staff Management Portal</h1>

      {/* FORM SECTION */}
      <section style={styles.card}>
        <h3 style={{ marginTop: 0, color: '#4a5568' }}>Add New Staff Member</h3>
        <form onSubmit={handleSubmit}>
          <div style={styles.inputGrid}>
            <input style={styles.input} name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required />
            <input style={styles.input} name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
            <input style={styles.input} name="nic" placeholder="NIC Number" value={formData.nic} onChange={handleChange} required />
            <input style={styles.input} name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
            <input style={styles.input} name="address" placeholder="Residential Address" value={formData.address} onChange={handleChange} required />
            <input style={styles.input} name="specialization" placeholder="Specializations (React, Java...)" value={formData.specialization} onChange={handleChange} />
            <input style={styles.input} name="qualifications" placeholder="Qualifications (BSc, MSc...)" value={formData.qualifications} onChange={handleChange} />
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <select style={styles.select} name="accessLevel" value={formData.accessLevel} onChange={handleChange}>
              <option value="Lecturer">Lecturer</option>
              <option value="Senior Lecturer">Senior Lecturer</option>
              <option value="Admin">Admin</option>
            </select>
            <button type="submit" style={styles.button}>Register Member</button>
          </div>
        </form>
      </section>

      {/* DIRECTORY SECTION */}
      <section style={styles.card}>
        <h3 style={{ marginTop: 0, color: '#4a5568' }}>Current Employee Directory</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Staff Info</th>
              <th style={styles.th}>Contact & Identity</th>
              <th style={styles.th}>Address</th>
              <th style={styles.th}>Access</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(emp => (
              <tr key={emp._id} style={{ ...styles.tr, opacity: emp.status === 'Resigned' ? 0.6 : 1 }}>
                <td style={{ ...styles.td, color: '#4a90e2', fontWeight: 'bold' }}>{emp.lecturerId}</td>
                <td style={styles.td}>
                  <div style={{ fontWeight: '600' }}>{emp.fullName}</div>
                  <div style={{ fontSize: '12px', color: '#6c757d' }}>{emp.email}</div>
                </td>
                <td style={styles.td}>
                  <div style={{ fontSize: '12px' }}><strong>NIC:</strong> {emp.nic}</div>
                  <div style={{ fontSize: '12px' }}><strong>Ph:</strong> {emp.phone}</div>
                </td>
                {/* --- ADDRESS WRAPPING FIX --- */}
                <td style={{ ...styles.td, maxWidth: '200px' }}>
                  <div style={{ fontSize: '12px', lineHeight: '1.4', whiteSpace: 'normal', wordBreak: 'break-word' }}>
                    {emp.address}
                  </div>
                </td>
                <td style={styles.td}>
                  <select 
                    style={styles.select} 
                    value={emp.accessLevel} 
                    onChange={(e) => updateStatus(emp._id, { accessLevel: e.target.value })}
                  >
                    <option value="Lecturer">Lecturer</option>
                    <option value="Senior Lecturer">Senior Lecturer</option>
                    <option value="Admin">Admin</option>
                  </select>
                </td>
                <td style={styles.td}>
                  {/* --- RESTORED COLORED BUTTONS --- */}
                  <button 
                    onClick={() => updateStatus(emp._id, { status: emp.status === 'Active' ? 'Resigned' : 'Active' })} 
                    style={{ 
                      ...styles.button, 
                      background: emp.status === 'Active' ? '#fff' : '#2ecc71', 
                      color: emp.status === 'Active' ? '#e74c3c' : '#fff', 
                      border: emp.status === 'Active' ? '1px solid #e74c3c' : 'none', 
                      padding: '8px 16px', 
                      fontSize: '12px',
                      width: '100px'
                    }}
                  >
                    {emp.status === 'Active' ? 'Deactivate' : 'Re-activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default EmployeeManagement;