import React from 'react';
import { PlayCircle } from 'lucide-react';
import englishImg from '../../assets/images/english-c.jpg';
import eventImg from '../../assets/images/event-c.jpg';
import fashionImg from '../../assets/images/fashion-c.jpg';

const MyCourses = () => {
  return (
    <div className="animate__animated animate__fadeIn">
      
      <div className="d-flex justify-content-between align-items-end mb-4">
        <h3 className="fw-bold m-0">My Learning</h3>
      </div>

      <div className="row g-4">
        
        {/* Course 1 */}
        <div className="col-12">
          <div className="card border-0 shadow-sm modern-card d-flex flex-column flex-md-row overflow-hidden">
            <div style={{ width: '100%', maxWidth: '250px', flexShrink: 0 }}>
              <img src={englishImg} alt="Spoken English" style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: '180px' }} />
            </div>
            <div className="card-body p-4 d-flex flex-column justify-content-center">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <h4 className="fw-bold mb-1">Spoken English</h4>
                  <p className="text-muted small fw-medium mb-3">Lecturer: Jane Doe</p>
                </div>
                <span className="badge bg-light text-dark border">Ongoing</span>
              </div>
              
              <div className="progress mb-2" style={{ height: '8px', backgroundColor: '#e5e7eb' }}>
                <div className="progress-bar" style={{ width: '70%', backgroundColor: 'var(--trioslk-maroon, #7a1b29)' }}></div>
              </div>
              
              <div className="d-flex justify-content-between align-items-center mt-2">
                <small className="text-muted fw-bold">70% Completed</small>
                <button className="btn btn-theme-red px-4 fw-medium shadow-sm d-flex align-items-center gap-2">
                  <PlayCircle size={18} /> Continue
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Course 2 */}
        <div className="col-12">
          <div className="card border-0 shadow-sm modern-card d-flex flex-column flex-md-row overflow-hidden">
            <div style={{ width: '100%', maxWidth: '250px', flexShrink: 0 }}>
              <img src={eventImg} alt="Event Management" style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: '180px' }} />
            </div>
            <div className="card-body p-4 d-flex flex-column justify-content-center">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <h4 className="fw-bold mb-1">Event Management</h4>
                  <p className="text-muted small fw-medium mb-3">Lecturer: John Smith</p>
                </div>
                <span className="badge bg-light text-dark border">Ongoing</span>
              </div>
              
              <div className="progress mb-2" style={{ height: '8px', backgroundColor: '#e5e7eb' }}>
                <div className="progress-bar" style={{ width: '45%', backgroundColor: 'var(--trioslk-maroon, #7a1b29)' }}></div>
              </div>
              
              <div className="d-flex justify-content-between align-items-center mt-2">
                <small className="text-muted fw-bold">45% Completed</small>
                <button className="btn btn-theme-red px-4 fw-medium shadow-sm d-flex align-items-center gap-2">
                  <PlayCircle size={18} /> Continue
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Course 3 */}
        <div className="col-12">
          <div className="card border-0 shadow-sm modern-card d-flex flex-column flex-md-row overflow-hidden">
            <div style={{ width: '100%', maxWidth: '250px', flexShrink: 0 }}>
              <img src={fashionImg} alt="Fashion Designing" style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: '180px' }} />
            </div>
            <div className="card-body p-4 d-flex flex-column justify-content-center">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <h4 className="fw-bold mb-1">Fashion Designing</h4>
                  <p className="text-muted small fw-medium mb-3">Lecturer: Sarah Lee</p>
                </div>
                <span className="badge bg-success text-white">Completed</span>
              </div>
              
              <div className="progress mb-2" style={{ height: '8px', backgroundColor: '#e5e7eb' }}>
                <div className="progress-bar bg-success" style={{ width: '100%' }}></div>
              </div>
              
              <div className="d-flex justify-content-between align-items-center mt-2">
                <small className="text-success fw-bold">100% Completed</small>
                <button className="btn btn-outline-secondary px-4 fw-medium d-flex align-items-center gap-2">
                  Review Course
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MyCourses;