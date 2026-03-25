import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Trash2, PlusCircle, Edit, Calendar, BookOpen, XCircle, Users, Eye } from 'lucide-react';
import './AdminDashboard.css';

const EventManagement = () => {
  const [activeTab, setActiveTab] = useState('events'); 
  const [events, setEvents] = useState([]);
  const [courses, setCourses] = useState([]);
  
  // Registration States
  const [registrants, setRegistrants] = useState([]);
  const [viewingEvent, setViewingEvent] = useState(null);
  const [showRegistrantsModal, setShowRegistrantsModal] = useState(false);

  const [editingEventId, setEditingEventId] = useState(null);
  const [editingCourseId, setEditingCourseId] = useState(null);

  const initialEventForm = { eventId: '', title: '', description: '', type: 'Online', status: 'Upcoming', imageFile: null };
  const initialCourseForm = { courseCode: '', title: '', duration: '3 Months', shortDesc: '', fullDesc: '', icon: 'bi-book', imageUrl: '', status: 'Active' };
  
  const [eventForm, setEventForm] = useState(initialEventForm);
  const [courseForm, setCourseForm] = useState(initialCourseForm);

  const fetchEvents = async () => {
    try {
      const { data } = await api.get('/events');
      setEvents(data);
    } catch (error) { console.error('Error fetching events:', error); }
  };

  const fetchCourses = async () => {
    try {
      const { data } = await api.get('/courses');
      setCourses(data);
    } catch (error) { console.error('Error fetching courses:', error); }
  };

  // NEW: Fetch Registrants for a specific Event ID
  const handleViewRegistrants = async (event) => {
    try {
      setViewingEvent(event);
      const { data } = await api.get(`/registrations/event/${event.eventId}`);
      setRegistrants(Array.isArray(data) ? data : []);
      setShowRegistrantsModal(true);
    } catch (error) {
      console.error('Error fetching registrants:', error);
      setRegistrants([]);
      setShowRegistrantsModal(true);
      alert('Failed to load registrant list.');
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    fetchEvents();
    fetchCourses();
  }, []);

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('eventId', eventForm.eventId);
      formData.append('title', eventForm.title);
      formData.append('description', eventForm.description);
      formData.append('type', eventForm.type);
      formData.append('status', eventForm.status);
      
      if (eventForm.imageFile instanceof File) {
        formData.append('imageFile', eventForm.imageFile);
      }

      if (editingEventId) {
        await api.put(`/events/${editingEventId}`, formData);
        alert('Event updated successfully!');
      } else {
        await api.post('/events', formData);
        alert('Event created successfully!');
      }
      setEventForm(initialEventForm);
      setEditingEventId(null);
      fetchEvents();
    } catch (error) { 
      console.error('Submit Error:', error); 
      alert('Failed to save event.'); 
    }
  };

  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCourseId) {
        await api.put(`/courses/${editingCourseId}`, courseForm);
        alert('Course updated successfully!');
      } else {
        await api.post('/courses', courseForm);
        alert('Course created successfully!');
      }
      setCourseForm(initialCourseForm);
      setEditingCourseId(null);
      fetchCourses();
    } catch (error) { 
      console.error('Submit Error:', error); 
      alert('Failed to save course.'); 
    }
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await api.delete(`/events/${id}`);
        fetchEvents();
      } catch (error) { console.error('Delete Error:', error); }
    }
  };

  const handleDeleteCourse = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await api.delete(`/courses/${id}`);
        fetchCourses();
      } catch (error) { console.error('Delete Error:', error); }
    }
  };

  const startEditingEvent = (event) => {
    setEditingEventId(event._id);
    setEventForm({ ...event, imageFile: null }); // Don't try to set binary file from URL
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startEditingCourse = (course) => {
    setEditingCourseId(course._id);
    setCourseForm(course);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingEventId(null);
    setEventForm(initialEventForm);
    setEditingCourseId(null);
    setCourseForm(initialCourseForm);
  };

  return (
    <div className="event-management-container">
      {/* Tab Header */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', borderBottom: '2px solid #e0e5f2', paddingBottom: '10px' }}>
        <button onClick={() => { setActiveTab('events'); cancelEdit(); }} style={activeTab === 'events' ? activeTabStyle : inactiveTabStyle}>
          <Calendar size={20} /> Manage Events
        </button>
        <button onClick={() => { setActiveTab('courses'); cancelEdit(); }} style={activeTab === 'courses' ? activeTabStyle : inactiveTabStyle}>
          <BookOpen size={20} /> Manage Courses
        </button>
      </div>

      {activeTab === 'events' && (
        <>
          {/* Create/Edit Form */}
          <div className="view-placeholder" style={{ textAlign: 'left', marginBottom: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                {editingEventId ? <Edit size={24} color="#4318ff" /> : <PlusCircle size={24} color="#4318ff" />}
                {editingEventId ? 'Update Event Details' : 'Create New Event'}
              </h3>
              {editingEventId && <button onClick={cancelEdit} style={cancelButtonStyle}><XCircle size={18} /> Cancel</button>}
            </div>
            
            <form onSubmit={handleEventSubmit} style={{ display: 'grid', gap: '15px' }}>
              <input type="text" placeholder="Event ID (e.g., EVT-1001)" value={eventForm.eventId} onChange={(e) => setEventForm({...eventForm, eventId: e.target.value})} required style={inputStyle} />
              <input type="text" placeholder="Event Title" value={eventForm.title} onChange={(e) => setEventForm({...eventForm, title: e.target.value})} required style={inputStyle} />
              <textarea placeholder="Event Description" value={eventForm.description} onChange={(e) => setEventForm({...eventForm, description: e.target.value})} required rows="3" style={inputStyle} />
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>Event Image</label>
                <input type="file" accept="image/*" onChange={(e) => setEventForm({...eventForm, imageFile: e.target.files[0]})} required={!editingEventId} style={{...inputStyle, padding: '10px'}} />
                {eventForm.imageFile && <p style={{ fontSize: '12px', color: '#4318ff', marginTop: '5px' }}>Selected: {eventForm.imageFile.name}</p>}
              </div>
              <div style={{ display: 'flex', gap: '15px' }}>
                <select value={eventForm.type} onChange={(e) => setEventForm({...eventForm, type: e.target.value})} style={inputStyle}>
                  <option value="Online">Online</option>
                  <option value="Physical">Physical</option>
                </select>
                <select value={eventForm.status} onChange={(e) => setEventForm({...eventForm, status: e.target.value})} style={inputStyle}>
                  <option value="Upcoming">Upcoming</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <button type="submit" style={editingEventId ? updateButtonStyle : buttonStyle}>
                {editingEventId ? 'Save Changes' : 'Publish Event'}
              </button>
            </form>
          </div>

          {/* List Display */}
          <div className="view-placeholder" style={{ textAlign: 'left' }}>
            <h3 style={{ marginBottom: '20px' }}>Live Events</h3>
            <div style={{ display: 'grid', gap: '15px' }}>
              {events.length === 0 && <p>No events found.</p>}
              {events.map((event) => (
                <div key={event._id} style={cardStyle}>
                  <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <img src={event.imageFile} alt={event.title} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                    <div>
                      <h4 style={{ margin: '0 0 5px 0' }}>{event.eventId} - {event.title}</h4>
                      <span style={badgeStyle}>{event.status}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => handleViewRegistrants(event)} style={viewButtonStyle} title="View Attendees"><Users size={18} /></button>
                    <button onClick={() => startEditingEvent(event)} style={editButtonStyle} title="Edit"><Edit size={18} /></button>
                    <button onClick={() => handleDeleteEvent(event._id)} style={deleteButtonStyle} title="Delete"><Trash2 size={18} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* REGISTRANTS MODAL */}
      {showRegistrantsModal && (
        <div className="custom-modal-overlay" style={modalOverlayStyle}>
          <div className="custom-modal-content" style={modalContentStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
              <h4 style={{ margin: 0, fontWeight: 'bold' }}>
                Attendees for <span style={{ color: '#4318ff' }}>{viewingEvent?.eventId}</span>
              </h4>
              <button onClick={() => setShowRegistrantsModal(false)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><XCircle size={24} /></button>
            </div>
            
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ textAlign: 'left', background: '#f8fafc', fontSize: '13px', color: '#64748b' }}>
                    <th style={thStyle}>Student ID</th>
                    <th style={thStyle}>Name</th>
                    <th style={thStyle}>Email</th>
                    <th style={thStyle}>Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {registrants.length === 0 ? (
                    <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>No registrations yet.</td></tr>
                  ) : (
                    registrants.map((reg) => (
                      <tr key={reg._id} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '14px' }}>
                        <td style={tdStyle}>{reg.studentCustomId}</td>
                        <td style={tdStyle}>{reg.studentName}</td>
                        <td style={tdStyle}>{reg.studentEmail}</td>
                        <td style={tdStyle}>{reg.studentPhone}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Courses Logic */}
      {activeTab === 'courses' && (
        <>
          {/* Course Create/Edit Form */}
          <div className="view-placeholder" style={{ textAlign: 'left', marginBottom: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                {editingCourseId ? <Edit size={24} color="#4318ff" /> : <PlusCircle size={24} color="#4318ff" />}
                {editingCourseId ? 'Update Course Details' : 'Create New Course'}
              </h3>
              {editingCourseId && <button onClick={cancelEdit} style={cancelButtonStyle}><XCircle size={18} /> Cancel</button>}
            </div>
            
            <form onSubmit={handleCourseSubmit} style={{ display: 'grid', gap: '15px' }}>
              <div style={{ display: 'flex', gap: '15px' }}>
                <input type="text" placeholder="Code (e.g TA101)" value={courseForm.courseCode} onChange={(e) => setCourseForm({...courseForm, courseCode: e.target.value})} required style={{...inputStyle, flex: 1}} />
                <input type="text" placeholder="Course Title" value={courseForm.title} onChange={(e) => setCourseForm({...courseForm, title: e.target.value})} required style={{...inputStyle, flex: 2}} />
                <input type="text" placeholder="Duration (e.g. 3 Months)" value={courseForm.duration} onChange={(e) => setCourseForm({...courseForm, duration: e.target.value})} required style={{...inputStyle, flex: 1}} />
              </div>
              <input type="text" placeholder="Short Description" value={courseForm.shortDesc} onChange={(e) => setCourseForm({...courseForm, shortDesc: e.target.value})} required style={inputStyle} />
              <textarea placeholder="Full Description" value={courseForm.fullDesc} onChange={(e) => setCourseForm({...courseForm, fullDesc: e.target.value})} required rows="3" style={inputStyle} />
              <input type="text" placeholder="Image URL" value={courseForm.imageUrl} onChange={(e) => setCourseForm({...courseForm, imageUrl: e.target.value})} required style={inputStyle} />
              <select value={courseForm.status} onChange={(e) => setCourseForm({...courseForm, status: e.target.value})} style={inputStyle}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <button type="submit" style={editingCourseId ? updateButtonStyle : buttonStyle}>
                {editingCourseId ? 'Save Changes' : 'Create Course'}
              </button>
            </form>
          </div>

          {/* Course List */}
          <div className="view-placeholder" style={{ textAlign: 'left' }}>
            <h3 style={{ marginBottom: '20px' }}>Active Courses</h3>
            <div style={{ display: 'grid', gap: '15px' }}>
              {courses.length === 0 && <p>No courses found.</p>}
              {courses.map((course) => (
                <div key={course._id} style={cardStyle}>
                  <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    {course.imageUrl && <img src={course.imageUrl} alt={course.title} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />}
                    <div>
                      <h4 style={{ margin: '0 0 5px 0' }}>{course.courseCode} - {course.title}</h4>
                      <span style={badgeStyle}>{course.status}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => startEditingCourse(course)} style={editButtonStyle}><Edit size={18} /></button>
                    <button onClick={() => handleDeleteCourse(course._id)} style={deleteButtonStyle}><Trash2 size={18} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Styles
const inputStyle = { padding: '12px', borderRadius: '8px', border: '1px solid #e0e5f2', width: '100%', outline: 'none', backgroundColor: '#fff' };
const buttonStyle = { padding: '12px', borderRadius: '8px', border: 'none', background: '#4318ff', color: 'white', cursor: 'pointer', fontWeight: 'bold' };
const updateButtonStyle = { ...buttonStyle, background: '#10b981' }; 
const cancelButtonStyle = { background: 'transparent', color: '#64748b', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold' };
const cardStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', border: '1px solid #e0e5f2', borderRadius: '12px', background: '#fafbfc' };
const editButtonStyle = { background: '#e0e7ff', color: '#4f46e5', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer' };
const viewButtonStyle = { background: '#f0f9ff', color: '#0369a1', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer' };
const deleteButtonStyle = { background: '#ffe4e6', color: '#e11d48', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer' };
const badgeStyle = { fontSize: '12px', background: '#dcfce7', color: '#166534', padding: '4px 8px', borderRadius: '12px', fontWeight: 'bold' };
const activeTabStyle = { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'transparent', border: 'none', borderBottom: '3px solid #4318ff', color: '#4318ff', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' };
const inactiveTabStyle = { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'transparent', border: 'none', color: '#64748b', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' };

const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
const modalContentStyle = { background: '#fff', padding: '30px', borderRadius: '16px', width: '90%', maxWidth: '750px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' };
const thStyle = { padding: '12px', borderBottom: '1px solid #e2e8f0' };
const tdStyle = { padding: '12px' };

export default EventManagement;