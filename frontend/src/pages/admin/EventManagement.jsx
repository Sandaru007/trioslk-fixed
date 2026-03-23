import React, { useState, useEffect } from 'react';
import api from '../../services/api'; // <-- 1. IMPORT (Adjust path if necessary!)
import { Trash2, PlusCircle, Edit, Calendar, BookOpen, XCircle } from 'lucide-react';
import './AdminDashboard.css';

const EventManagement = () => {
  const [activeTab, setActiveTab] = useState('events'); 
  const [events, setEvents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [editingEventId, setEditingEventId] = useState(null);
  const [editingCourseId, setEditingCourseId] = useState(null);

  const initialEventForm = { title: '', description: '', type: 'Online', status: 'Upcoming', imageUrl: '' };
  const initialCourseForm = { courseCode: '',title: '', duration: '3 Months', shortDesc: '', fullDesc: '', icon: 'bi-book', imageUrl: '', status: 'Active' };
  
  const [eventForm, setEventForm] = useState(initialEventForm);
  const [courseForm, setCourseForm] = useState(initialCourseForm);

  const fetchEvents = async () => {
    try {
      const { data } = await api.get('/events'); // <-- 2. CLEANER URL
      setEvents(data);
    } catch (error) { console.error('Error fetching events:', error); }
  };

  const fetchCourses = async () => {
    try {
      const { data } = await api.get('/courses'); // <-- 3. CLEANER URL
      setCourses(data);
    } catch (error) { console.error('Error fetching courses:', error); }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchEvents();
      await fetchCourses();
    };
    loadData();
  }, []);

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEventId) {
        await api.put(`/events/${editingEventId}`, eventForm); // <-- 4. CLEANER URL
        alert('Event updated successfully!');
      } else {
        await api.post('/events', eventForm); // <-- 5. CLEANER URL
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
        await api.put(`/courses/${editingCourseId}`, courseForm); // <-- 6. CLEANER URL
        alert('Course updated successfully!');
      } else {
        await api.post('/courses', courseForm); // <-- 7. CLEANER URL
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
        await api.delete(`/events/${id}`); // <-- 8. CLEANER URL
        fetchEvents();
      } catch (error) { console.error('Delete Error:', error); }
    }
  };

  const handleDeleteCourse = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await api.delete(`/courses/${id}`); // <-- 9. CLEANER URL
        fetchCourses();
      } catch (error) { console.error('Delete Error:', error); }
    }
  };

  const startEditingEvent = (event) => {
    setEditingEventId(event._id);
    setEventForm(event);
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
          <div className="view-placeholder" style={{ textAlign: 'left', marginBottom: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                {editingEventId ? <Edit size={24} color="#4318ff" /> : <PlusCircle size={24} color="#4318ff" />}
                {editingEventId ? 'Update Event Details' : 'Create New Event'}
              </h3>
              {editingEventId && <button onClick={cancelEdit} style={cancelButtonStyle}><XCircle size={18} /> Cancel</button>}
            </div>
            
            <form onSubmit={handleEventSubmit} style={{ display: 'grid', gap: '15px' }}>
              <input type="text" placeholder="Event Title" value={eventForm.title} onChange={(e) => setEventForm({...eventForm, title: e.target.value})} required style={inputStyle} />
              <textarea placeholder="Event Description" value={eventForm.description} onChange={(e) => setEventForm({...eventForm, description: e.target.value})} required rows="3" style={inputStyle} />
              <input type="url" placeholder="Image URL" value={eventForm.imageUrl} onChange={(e) => setEventForm({...eventForm, imageUrl: e.target.value})} required style={inputStyle} />
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

          <div className="view-placeholder" style={{ textAlign: 'left' }}>
            <h3 style={{ marginBottom: '20px' }}>Live Events</h3>
            <div style={{ display: 'grid', gap: '15px' }}>
              {events.length === 0 && <p>No events found.</p>}
              {events.map((event) => (
                <div key={event._id} style={cardStyle}>
                  <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <img src={event.imageUrl} alt={event.title} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                    <div>
                      <h4 style={{ margin: '0 0 5px 0' }}>{event.title}</h4>
                      <span style={badgeStyle}>{event.status}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => startEditingEvent(event)} style={editButtonStyle}><Edit size={18} /></button>
                    <button onClick={() => handleDeleteEvent(event._id)} style={deleteButtonStyle}><Trash2 size={18} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {activeTab === 'courses' && (
        <>
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
                <input type="text" placeholder="Code (e.g. TA101)" value={courseForm.courseCode} onChange={(e) => setCourseForm({...courseForm, courseCode: e.target.value})} required style={{...inputStyle, flex: 1}} />
                <input type="text" placeholder="Course Title" value={courseForm.title} onChange={(e) => setCourseForm({...courseForm, title: e.target.value})} required style={{...inputStyle, flex: 2}} />
                <input type="text" placeholder="Duration (e.g. 3 Months)" value={courseForm.duration} onChange={(e) => setCourseForm({...courseForm, duration: e.target.value})} required style={{...inputStyle, flex: 1}} />
              </div>
              <input type="text" placeholder="Short Description (Appears on card)" value={courseForm.shortDesc} onChange={(e) => setCourseForm({...courseForm, shortDesc: e.target.value})} required style={inputStyle} />
              <textarea placeholder="Full Description (What you will learn)" value={courseForm.fullDesc} onChange={(e) => setCourseForm({...courseForm, fullDesc: e.target.value})} required rows="4" style={inputStyle} />
              <div style={{ display: 'flex', gap: '15px' }}>
                <input type="url" placeholder="Course Image URL" value={courseForm.imageUrl} onChange={(e) => setCourseForm({...courseForm, imageUrl: e.target.value})} required style={{...inputStyle, flex: 2}} />
                <input type="text" placeholder="Bootstrap Icon (e.g. bi-book)" value={courseForm.icon} onChange={(e) => setCourseForm({...courseForm, icon: e.target.value})} style={{...inputStyle, flex: 1}} />
                <select value={courseForm.status} onChange={(e) => setCourseForm({...courseForm, status: e.target.value})} style={{...inputStyle, flex: 1}}>
                  <option value="Active">Active</option>
                  <option value="Upcoming">Upcoming</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
              <button type="submit" style={editingCourseId ? updateButtonStyle : buttonStyle}>
                {editingCourseId ? 'Save Course Changes' : 'Publish Course'}
              </button>
            </form>
          </div>

          <div className="view-placeholder" style={{ textAlign: 'left' }}>
            <h3 style={{ marginBottom: '20px' }}>Live Courses</h3>
            <div style={{ display: 'grid', gap: '15px' }}>
              {courses.length === 0 && <p>No courses found.</p>}
              {courses.map((course) => (
                <div key={course._id} style={cardStyle}>
                  <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <img src={course.imageUrl} alt={course.title} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                    <div>
                      <h4 style={{ margin: '0 0 5px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '13px', color: '#4318ff', background: '#e0e7ff', padding: '2px 6px', borderRadius: '6px', fontWeight: 'bold' }}>
                          {course.courseCode || 'NO-CODE'}
                        </span>
                        {course.title}
                      </h4>
                      <span style={{ fontSize: '12px', background: '#e0e5f2', padding: '4px 8px', borderRadius: '12px', marginRight: '10px' }}>
                         <i className={`bi ${course.icon} me-1`}></i> {course.duration}
                      </span>
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

const inputStyle = { padding: '12px', borderRadius: '8px', border: '1px solid #e0e5f2', width: '100%', outline: 'none', backgroundColor: '#fff' };
const buttonStyle = { padding: '12px', borderRadius: '8px', border: 'none', background: '#4318ff', color: 'white', cursor: 'pointer', fontWeight: 'bold' };
const updateButtonStyle = { ...buttonStyle, background: '#10b981' }; 
const cancelButtonStyle = { background: 'transparent', color: '#64748b', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold' };
const cardStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', border: '1px solid #e0e5f2', borderRadius: '12px', background: '#fafbfc' };
const editButtonStyle = { background: '#e0e7ff', color: '#4f46e5', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer' };
const deleteButtonStyle = { background: '#ffe4e6', color: '#e11d48', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer' };
const badgeStyle = { fontSize: '12px', background: '#dcfce7', color: '#166534', padding: '4px 8px', borderRadius: '12px', fontWeight: 'bold' };
const activeTabStyle = { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'transparent', border: 'none', borderBottom: '3px solid #4318ff', color: '#4318ff', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' };
const inactiveTabStyle = { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'transparent', border: 'none', color: '#64748b', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' };

export default EventManagement;