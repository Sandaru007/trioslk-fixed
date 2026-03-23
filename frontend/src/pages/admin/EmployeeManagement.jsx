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

  // 1. Fetch all employees on load
  useEffect(() => {
    fetchEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // 2. Handle Form Input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Register New Lecturer
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert comma strings to arrays for the backend
      const dataToSend = {
        ...formData,
        specialization: formData.specialization.split(','),
        qualifications: formData.qualifications.split(',')
      };
      await axios.post(API_URL, dataToSend);
      alert("Lecturer Registered!");
      setFormData({ fullName: '', email: '', specialization: '', qualifications: '', accessLevel: 'Lecturer' });
      fetchEmployees();
    } catch  {
      alert("Error registering lecturer");
    }
  };

  // 4. Update Status (Resigned/Active) or Access
  const updateStatus = async (id, updates) => {
    try {
      await axios.put(`${API_URL}/${id}`, updates);
      fetchEmployees();
    } catch  {
      alert("Update failed");
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: 'auto', fontFamily: 'sans-serif' }}>
      <h1>Staff & Lecturer Management</h1>

      {/* REGISTRATION FORM */}
      <section style={{ background: '#f4f4f4', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
        <h3>Register New Lecturer</h3>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '10px' }}>
          <input name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required />
          <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input name="specialization" placeholder="Specializations (e.g. React, Java)" value={formData.specialization} onChange={handleChange} />
          <input name="qualifications" placeholder="Qualifications (e.g. BSc, MSc)" value={formData.qualifications} onChange={handleChange} />
          
          <label>Access Level:</label>
          <select name="accessLevel" value={formData.accessLevel} onChange={handleChange}>
            <option value="Lecturer">Lecturer (Standard)</option>
            <option value="Senior Lecturer">Senior Lecturer (Expanded)</option>
            <option value="Admin">Admin (Full Access)</option>
          </select>
          
          <button type="submit" style={{ padding: '10px', background: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
            Add Staff Member
          </button>
        </form>
      </section>

      {/* EMPLOYEE LIST TABLE */}
      <section>
        <h3>Current Employees</h3>
        {loading ? <p>Loading...</p> : (
          <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#eee' }}>
                <th>Lecturer ID</th>
                <th>Name</th>
                <th>Specialization</th>
                <th>Access</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => (
                <tr key={emp._id} style={{ opacity: emp.status === 'Resigned' ? 0.5 : 1 }}>
                  <td style={{ fontWeight: 'bold', color: '#007bff' }}>
                  {emp.lecturerId ? emp.lecturerId : "N/A"}</td>
                  <td><strong>{emp.fullName}</strong><br/><small>{emp.email}</small></td>
                  <td>{emp.specialization?.join(', ')}</td>
                  <td>
                    <select 
                      value={emp.accessLevel || 'Lecturer'} 
                      onChange={(e) => updateStatus(emp._id, { accessLevel: e.target.value })}
                    >
                      <option value="Lecturer">Lecturer</option>
                      <option value="Senior Lecturer">Senior</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </td>
                  <td>{emp.status}</td>
                  <td>
                    {emp.status === 'Active' ? (
                      <button onClick={() => updateStatus(emp._id, { status: 'Resigned' })} style={{ color: 'red' }}>
                        Mark Resigned
                      </button>
                    ) : (
                      <button onClick={() => updateStatus(emp._id, { status: 'Active' })} style={{ color: 'green' }}>
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