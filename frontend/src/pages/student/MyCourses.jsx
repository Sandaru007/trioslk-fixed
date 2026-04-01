import React from 'react';
import { PlayCircle, CheckCircle } from 'lucide-react';

// Make sure these assets exist in your path!
import englishImg from '../../assets/images/english-c.jpg';
import eventImg from '../../assets/images/event-c.jpg';
import fashionImg from '../../assets/images/fashion-c.jpg';

const MyCourses = () => {
  return (
    <div className="animate__animated animate__fadeIn">
      
      {/* Header - Aligned with Diane's UI style */}
      <div className="card-header-inline mb-4">
        <h3 className="fw-bold m-0" style={{color: 'var(--text-main)'}}>My Learning</h3>
      </div>

      <div className="row g-4">
        
        {/* ======================================= */}
        {/* Course 1 - Ongoing (Blue Progress) */}
        {/* ======================================= */}
        <div className="col-12">
          {/* Replaced 'card' with the universal 'lms-card' */}
          <div className="lms-card d-flex flex-column flex-md-row overflow-hidden p-0">
            {/* Rounded image container */}
            <div style={{ width: '100%', maxWidth: '280px', flexShrink: 0, borderRadius: '20px 0 0 20px', overflow: 'hidden' }}>
              <img src={englishImg} alt="Spoken English" style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: '200px' }} />
            </div>
            
            {/* Card Body - adjusted padding */}
            <div className="card-body p-4 d-flex flex-column justify-content-center">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <h4 className="fw-bold mb-1" style={{color: 'var(--text-main)'}}>Spoken English</h4>
                  <p className="small fw-medium mb-3" style={{color: 'var(--text-muted)'}}>Lecturer: Jane Doe</p>
                </div>
                {/* Standard badge */}
                <span className="badge bg-light text-dark border rounded-pill px-3 py-2">Ongoing</span>
              </div>
              
              {/* Universal Course Progress Bar (Uses CSS variable defined earlier) */}
              <div className="course-progress-bar mb-2">
                <div className="progress-fill" style={{ width: '70%' }}></div>
              </div>
              
              <div className="d-flex justify-content-between align-items-center mt-2">
                <small className="fw-bold" style={{color: 'var(--text-muted)'}}>70% Completed</small>
                {/* Updated Button class to match the main LMS blue */}
                <button className="btn btn-primary btn-sm px-4 fw-medium d-flex align-items-center gap-2 rounded-pill">
                  <PlayCircle size={18} /> Continue
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================= */}
        {/* Course 2 - Ongoing (Orange Indicator Example) */}
        {/* ======================================= */}
        <div className="col-12">
          <div className="lms-card d-flex flex-column flex-md-row overflow-hidden p-0">
            <div style={{ width: '100%', maxWidth: '280px', flexShrink: 0, borderRadius: '20px 0 0 20px', overflow: 'hidden' }}>
              <img src={eventImg} alt="Event Management" style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: '200px' }} />
            </div>
            <div className="card-body p-4 d-flex flex-column justify-content-center">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <h4 className="fw-bold mb-1" style={{color: 'var(--text-main)'}}>Event Management</h4>
                  <p className="small fw-medium mb-3" style={{color: 'var(--text-muted)'}}>Lecturer: John Smith</p>
                </div>
                {/* Ongoing badge */}
                <span className="badge bg-light text-dark border rounded-pill px-3 py-2">Ongoing</span>
              </div>
              
              <div className="course-progress-bar mb-2">
                {/* Example of showing lower progress, keeping consistency */}
                <div className="progress-fill" style={{ width: '45%' }}></div>
              </div>
              
              <div className="d-flex justify-content-between align-items-center mt-2">
                <small className="fw-bold" style={{color: 'var(--text-muted)'}}>45% Completed</small>
                <button className="btn btn-primary btn-sm px-4 fw-medium d-flex align-items-center gap-2 rounded-pill">
                  <PlayCircle size={18} /> Continue
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================= */}
        {/* Course 3 - Completed (Green Theme) */}
        {/* ======================================= */}
        <div className="col-12">
          <div className="lms-card d-flex flex-column flex-md-row overflow-hidden p-0">
            <div style={{ width: '100%', maxWidth: '280px', flexShrink: 0, borderRadius: '20px 0 0 20px', overflow: 'hidden' }}>
              <img src={fashionImg} alt="Fashion Designing" style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: '200px' }} />
            </div>
            <div className="card-body p-4 d-flex flex-column justify-content-center">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <h4 className="fw-bold mb-1" style={{color: 'var(--text-main)'}}>Fashion Designing</h4>
                  <p className="small fw-medium mb-3" style={{color: 'var(--text-muted)'}}>Lecturer: Sarah Lee</p>
                </div>
                {/* Changed to green success badge and text */}
                <span className="badge bg-success text-white rounded-pill px-3 py-2 d-flex align-items-center gap-1">
                  <CheckCircle size={14}/> Completed
                </span>
              </div>
              
              <div className="course-progress-bar mb-2" style={{backgroundColor: '#d1fae5'}}>
                {/* Completed state uses Bootstrap's bg-success class to create a green fill */}
                <div className="progress-fill bg-success" style={{ width: '100%' }}></div>
              </div>
              
              <div className="d-flex justify-content-between align-items-center mt-2">
                <small className="fw-bold text-success">100% Completed</small>
                {/* Updated Review button to match the blue theme but using an outline style */}
                <button className="btn btn-outline-primary btn-sm px-4 fw-medium d-flex align-items-center gap-2 rounded-pill">
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