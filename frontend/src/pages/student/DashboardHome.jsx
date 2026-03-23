import React from 'react';
import { BookOpen, FileText, Award } from 'lucide-react';

// Make sure your image imports match your actual folder structure!
import spokenImg from '../../assets/images/english-c.jpg';
import eventM from '../../assets/images/event-e.jpg';
import fashionD from '../../assets/images/fashion-e.jpg';

const DashboardHome = () => {
  return (
    <div>
      {/* Welcome Banner */}
      <div 
        className="card border-0 shadow-sm modern-card p-4 mb-4" 
        style={{ backgroundColor: 'var(--trioslk-maroon, #7a1b29)', color: 'white' }}
      >
        <h3 className="fw-bold mb-2">Welcome back, Kavishka!</h3>
        <p className="mb-0 text-light" style={{ opacity: 0.85 }}>
          Continue your learning journey today. You have 3 pending assignments due this week.
        </p>
      </div>

      {/* Summary Stat Cards */}
      <div className="row g-4 mb-5">
        
        <div className="col-md-4">
          <div className="card border-0 shadow-sm modern-card p-4 d-flex flex-row align-items-center gap-3 h-100">
            <div className="bg-light p-3 rounded-circle text-danger">
              <BookOpen size={28} />
            </div>
            <div>
              <h6 className="text-muted mb-1 fw-medium" style={{ fontSize: '14px' }}>Enrolled Courses</h6>
              <h3 className="fw-bold m-0">5</h3>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm modern-card p-4 d-flex flex-row align-items-center gap-3 h-100">
            <div className="bg-light p-3 rounded-circle text-danger">
              <FileText size={28} />
            </div>
            <div>
              <h6 className="text-muted mb-1 fw-medium" style={{ fontSize: '14px' }}>Pending Assignments</h6>
              <h3 className="fw-bold m-0 text-danger">3</h3>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm modern-card p-4 d-flex flex-row align-items-center gap-3 h-100">
            <div className="bg-light p-3 rounded-circle text-success">
              <Award size={28} />
            </div>
            <div>
              <h6 className="text-muted mb-1 fw-medium" style={{ fontSize: '14px' }}>Completed Courses</h6>
              <h3 className="fw-bold m-0">2</h3>
            </div>
          </div>
        </div>

      </div>

      {/* Recent Activity (Course Progress) */}
      <h4 className="fw-bold mb-4">Recent Activity</h4>
      
      <div className="row g-4">
        
        {/* Course Card 1 */}
        <div className="col-md-4">
          <div className="card border-0 shadow-sm modern-card h-100 overflow-hidden">
            <img src={spokenImg} alt="Spoken English" className="card-img-top" style={{ height: '160px', objectFit: 'cover' }} />
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3">Spoken English</h6>
              
              <div className="progress mb-2" style={{ height: '8px', backgroundColor: '#e5e7eb' }}>
                <div className="progress-bar" style={{ width: '70%', backgroundColor: 'var(--trioslk-maroon, #7a1b29)' }}></div>
              </div>
              
              <div className="d-flex justify-content-between align-items-center">
                <small className="text-muted fw-medium">70% Completed</small>
                <button className="btn btn-sm btn-light fw-bold text-dark border shadow-sm">Resume</button>
              </div>
            </div>
          </div>
        </div>

        {/* Course Card 2 */}
        <div className="col-md-4">
          <div className="card border-0 shadow-sm modern-card h-100 overflow-hidden">
            <img src={eventM} alt="Event Management" className="card-img-top" style={{ height: '160px', objectFit: 'cover' }} />
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3">Event Management</h6>
              
              <div className="progress mb-2" style={{ height: '8px', backgroundColor: '#e5e7eb' }}>
                <div className="progress-bar" style={{ width: '30%', backgroundColor: 'var(--trioslk-maroon, #7a1b29)' }}></div>
              </div>
              
              <div className="d-flex justify-content-between align-items-center">
                <small className="text-muted fw-medium">30% Completed</small>
                <button className="btn btn-sm btn-light fw-bold text-dark border shadow-sm">Resume</button>
              </div>
            </div>
          </div>
        </div>

        {/* Course Card 3 */}
        <div className="col-md-4">
          <div className="card border-0 shadow-sm modern-card h-100 overflow-hidden">
            <img src={fashionD} alt="Fashion Designing" className="card-img-top" style={{ height: '160px', objectFit: 'cover' }} />
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3">Fashion Designing</h6>
              
              <div className="progress mb-2" style={{ height: '8px', backgroundColor: '#e5e7eb' }}>
                <div className="progress-bar bg-success" style={{ width: '80%' }}></div>
              </div>
              
              <div className="d-flex justify-content-between align-items-center">
                <small className="text-muted fw-medium">80% Completed</small>
                <button className="btn btn-sm btn-light fw-bold text-dark border shadow-sm">Resume</button>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default DashboardHome;