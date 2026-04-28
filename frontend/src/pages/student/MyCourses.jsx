import React, { useState, useEffect } from 'react';
import { PlayCircle, CheckCircle, Video, Calendar, Clock, Film, FileText } from 'lucide-react';
import api from '../../services/api';

// Fallback images
import englishImg from '../../assets/images/english-c.jpg';
import eventImg from '../../assets/images/event-c.jpg';
import fashionImg from '../../assets/images/fashion-c.jpg';

const getCourseImage = (imageUrl) => {
  if (imageUrl) {
    // Check if it's a base64 data URI or an absolute HTTP URL
    if (imageUrl.startsWith('data:image') || imageUrl.startsWith('http')) {
      return imageUrl;
    }
    // Otherwise, assume it's a relative path on the backend server
    return `http://localhost:8000${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
  }
  return englishImg; // Fallback
};

const MyCourses = () => {
  const [sessions, setSessions] = useState([]);
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resSessions = await api.get('/sessions');
        setSessions(resSessions.data || []);
        
        const resMaterials = await api.get('/materials');
        setMaterials(resMaterials.data || []);
      } catch (err) {
        console.error("Error fetching data", err);
      }
    };
    fetchData();
  }, []);

  const handleJoinZoom = async (session) => {
    try {
      await api.put(`/sessions/${session._id}/attendance`, {
        userId: 'dummy-student-id', // Dummy student ID
        userRole: 'Student'
      });
    } catch (err) {
      console.error("Attendance error", err);
    }
    // Open link anyway
    window.open(session.meetingLink, '_blank');
  };

  return (
    <div className="animate__animated animate__fadeIn">
      
      {/* --- SESSIONS AND RECORDINGS SECTION --- */}
      {sessions.length > 0 && (
        <div className="mb-5">
          <div className="card-header-inline mb-4">
            <h3 className="fw-bold m-0" style={{color: 'var(--text-main)'}}><Video size={24} className="me-2 text-danger"/>Live Sessions & Recordings</h3>
          </div>
          <div className="row g-3">
            {sessions.map(session => (
              <div key={session._id} className="col-md-6 col-lg-4">
                <div className="card border-0 shadow-sm p-4 h-100 modern-card">
                  <h6 className="fw-bold text-dark mb-1">{session.title}</h6>
                  <p className="text-muted small mb-3">Course: {session.courseCode}</p>
                  
                  <div className="d-flex gap-3 small fw-medium text-dark mb-4">
                    <span className="d-flex align-items-center gap-1"><Calendar size={14}/> {session.date}</span>
                    <span className="d-flex align-items-center gap-1"><Clock size={14}/> {session.time}</span>
                  </div>

                  <div className="mt-auto d-flex flex-column gap-2">
                    {session.meetingLink && !session.videoUrl && (
                      <button 
                        className="btn btn-primary btn-sm rounded-pill fw-bold"
                        onClick={() => handleJoinZoom(session)}
                      >
                        Join Zoom Meeting
                      </button>
                    )}
                    {session.videoUrl && (
                      <a 
                        href={`http://localhost:8000${session.videoUrl}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="btn btn-outline-danger btn-sm rounded-pill fw-bold d-flex align-items-center justify-content-center gap-2"
                      >
                        <Film size={16}/> Watch Recording
                      </a>
                    )}
                    {!session.meetingLink && !session.videoUrl && (
                      <span className="badge bg-light text-muted w-100 py-2 rounded-pill">Link Pending</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- COURSE MATERIALS SECTION --- */}
      {materials.length > 0 && (
        <div className="mb-5">
          <div className="card-header-inline mb-4">
            <h3 className="fw-bold m-0" style={{color: 'var(--text-main)'}}><FileText size={24} className="me-2 text-danger"/>Course Materials</h3>
          </div>
          <div className="row g-3">
            {materials.map(mat => (
              <div key={mat._id} className="col-md-6 col-lg-4">
                <div className="card border-0 shadow-sm p-4 h-100 modern-card d-flex flex-column justify-content-between">
                  <div>
                    <h6 className="fw-bold text-dark mb-1">{mat.title}</h6>
                    <p className="text-muted small mb-2">Course: {mat.courseCode}</p>
                    <p className="text-muted small mb-3">Added {new Date(mat.createdAt).toLocaleDateString()}</p>
                  </div>
                  <a 
                    href={mat.fileUrl?.startsWith('http') ? mat.fileUrl : `http://localhost:8000${mat.fileUrl}`} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="btn btn-outline-primary btn-sm rounded-pill fw-bold w-100 mt-2"
                  >
                    View Material
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Header - Aligned with Diane's UI style */}
      <div className="card-header-inline mb-4">
        <h3 className="fw-bold m-0" style={{color: 'var(--text-main)'}}>My Learning</h3>
      </div>

      <div className="row g-4">
        {loading ? (
          <p>Loading courses...</p>
        ) : enrolledCourses.length > 0 ? (
          enrolledCourses.map((course, index) => (
            <div className="col-12" key={course._id || index}>
              <div className="lms-card d-flex flex-column flex-md-row overflow-hidden p-0">
                <div style={{ width: '100%', maxWidth: '280px', flexShrink: 0, borderRadius: '20px 0 0 20px', overflow: 'hidden' }}>
                  <img 
                    src={getCourseImage(course.imageUrl)} 
                    alt={course.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: '200px' }} 
                  />
                </div>
                
                <div className="card-body p-4 d-flex flex-column justify-content-center">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h4 className="fw-bold mb-1" style={{color: 'var(--text-main)'}}>{course.title}</h4>
                      <p className="small fw-medium mb-3" style={{color: 'var(--text-muted)'}}>Status: Active</p>
                    </div>
                    <span className="badge bg-primary text-white rounded-pill px-3 py-2 d-flex align-items-center gap-1">
                      <PlayCircle size={14}/> In Progress
                    </span>
                  </div>
                  
                  <div className="course-progress-bar mb-2" style={{backgroundColor: '#e9ecef'}}>
                    <div className="progress-fill bg-primary" style={{ width: '0%' }}></div>
                  </div>
                  
                  <div className="d-flex justify-content-between align-items-center mt-2">
                    <small className="fw-bold text-muted">
                      0% Completed
                    </small>
                    <button className="btn btn-primary btn-sm px-4 fw-medium d-flex align-items-center gap-2 rounded-pill">
                      <PlayCircle size={18} /> Start Course
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <div className="lms-card p-4 text-center">
              <h5 className="text-muted">You have no approved enrollments yet.</h5>
              <p className="small text-muted">Courses will appear here once your payment is approved by the admin.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;