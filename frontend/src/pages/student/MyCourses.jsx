import React, { useState, useEffect } from 'react';
import { PlayCircle, CheckCircle } from 'lucide-react';
import api from '../../services/api';

// Fallback images if needed
import englishImg from '../../assets/images/english-c.jpg';

const MyCourses = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const userInfo = (() => {
    try {
      return JSON.parse(sessionStorage.getItem('trioslk_userInfo') || '{}');
    } catch {
      return {};
    }
  })();
  const studentId = userInfo.studentId;

  useEffect(() => {
    const fetchCourses = async () => {
      if (!studentId) return;
      try {
        const response = await api.get(`/students/${encodeURIComponent(studentId)}/courses`);
        setEnrolledCourses(response.data);
      } catch (error) {
        console.error('Error fetching enrolled courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [studentId]);

  return (
    <div className="animate__animated animate__fadeIn">
      
      {/* Header */}
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
                    src={course.imageUrl ? (course.imageUrl.startsWith('http') ? course.imageUrl : `http://localhost:8000${course.imageUrl.startsWith('/') ? '' : '/'}${course.imageUrl}`) : englishImg} 
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