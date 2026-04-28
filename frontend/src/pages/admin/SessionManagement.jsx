import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { PlusCircle, Calendar, Clock, User, BookOpen, Trash2 } from 'lucide-react';
import './AdminDashboard.css';

const SessionManagement = () => {
  const [sessions, setSessions] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    courseCode: '',
    hostedBy: ''
  });

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch employees to assign as lecturers
        const empRes = await api.get('/employees');
        // Filter only those who can be lecturers if needed, for now use all
        setEmployees(empRes.data || []);

        // Fetch courses for the dropdown
        const courseRes = await api.get('/courses');
        setCourses(courseRes.data || []);
      } catch (error) {
        console.error("Error fetching dependencies:", error);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.date || !formData.time || !formData.courseCode || !formData.hostedBy) {
      return alert("Please fill in all fields.");
    }

    try {
      setLoading(true);
      await api.post('/sessions', formData);
      alert("Session assigned successfully!");
      setFormData({ title: '', date: '', time: '', courseCode: '', hostedBy: '' });
      // In a full implementation we would fetch sessions again, but here we just create.
    } catch (error) {
      console.error("Error creating session:", error);
      alert("Failed to create session.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="session-management-box">
      <h2>Session Management</h2>
      <p className="text-muted small mb-4">Create new live sessions and assign them to lecturers.</p>
      
      <div className="card border-0 shadow-sm modern-card p-4 mb-4">
        <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
          <PlusCircle size={20} className="text-danger"/> Assign New Session
        </h5>
        <form className="row g-3" onSubmit={handleCreateSession}>
          <div className="col-md-6">
            <label className="form-label text-muted small fw-medium">Session Title</label>
            <input 
              type="text" 
              className="form-control" 
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g. Q&A and Project Review" 
            />
          </div>
          <div className="col-md-6">
            <label className="form-label text-muted small fw-medium">Course</label>
            {courses.length > 0 ? (
              <select className="form-select" name="courseCode" value={formData.courseCode} onChange={handleInputChange}>
                <option value="">Select Course</option>
                {courses.map(c => (
                  <option key={c._id} value={c.courseCode}>{c.title || c.courseCode}</option>
                ))}
              </select>
            ) : (
              <input 
                type="text" 
                className="form-control" 
                name="courseCode"
                value={formData.courseCode}
                onChange={handleInputChange}
                placeholder="Course Code (e.g., TA101)" 
              />
            )}
          </div>
          <div className="col-md-6">
            <label className="form-label text-muted small fw-medium">Assign Lecturer</label>
            {employees.length > 0 ? (
              <select className="form-select" name="hostedBy" value={formData.hostedBy} onChange={handleInputChange}>
                <option value="">Select Lecturer</option>
                {employees.map(emp => (
                  <option key={emp._id} value={emp._id}>{emp.fullName || emp.name || emp.firstName}</option>
                ))}
              </select>
            ) : (
              <input 
                type="text" 
                className="form-control" 
                name="hostedBy"
                value={formData.hostedBy}
                onChange={handleInputChange}
                placeholder="Lecturer ID" 
              />
            )}
          </div>
          <div className="col-md-3">
            <label className="form-label text-muted small fw-medium">Date</label>
            <input 
              type="date" 
              className="form-control" 
              name="date"
              value={formData.date}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label text-muted small fw-medium">Time</label>
            <input 
              type="time" 
              className="form-control" 
              name="time"
              value={formData.time}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-12 mt-4 text-end">
            <button type="submit" className="btn btn-theme-red px-4 py-2 fw-bold" disabled={loading}>
              {loading ? 'Assigning...' : 'Assign Session'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SessionManagement;
