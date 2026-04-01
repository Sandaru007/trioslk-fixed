import React, { useState } from 'react';
import { Clock, CheckCircle, FileText, ChevronRight } from 'lucide-react';

// Ensure this asset path is correct in your project structure
import courseImg from '../../assets/images/courses.jpg';

const Assignments = () => {
  const [filter, setFilter] = useState('All');

  // Helper function to define logic for active filter buttons
  const getFilterButtonClass = (buttonFilter) => {
    return filter === buttonFilter
      ? 'btn btn-primary px-4 rounded-pill' // The active blue, rounded style
      : 'btn btn-outline-secondary bg-white text-muted px-4 rounded-pill'; // Standard outlined, muted
  };

  return (
    <div className="animate__animated animate__fadeIn">
      
      {/* Header & Filters - Aligned with the dashboard's clean structure */}
      <div className="card-header-inline mb-4 pb-3 border-bottom">
        <h3 className="fw-bold m-0 d-flex align-items-center gap-2" style={{color: 'var(--text-main)'}}>
          {/* Changed text-danger to lms-blue and slightly increased icon size */}
          <FileText size={26} color="var(--lms-blue)" /> Course Assignments
        </h3>

        {/* Updated Button Group: Added gap and ensured all buttons are rounded pills */}
        <div className="btn-group d-flex gap-2" role="group">
          <button 
            type="button" 
            className={getFilterButtonClass('All')}
            onClick={() => setFilter('All')}
          >
            All
          </button>
          <button 
            type="button" 
            className={getFilterButtonClass('Pending')}
            onClick={() => setFilter('Pending')}
          >
            Pending
          </button>
          <button 
            type="button" 
            className={getFilterButtonClass('Submitted')}
            onClick={() => setFilter('Submitted')}
          >
            Submitted
          </button>
        </div>
      </div>

      {/* Assignment List */}
      <div className="d-flex flex-column gap-3">

        {/* ======================================= */}
        {/* Assignment 1: Pending (Orange warning theme) */}
        {/* ======================================= */}
        {/* Replaced 'card' with 'lms-card' and adjusted padding */}
        <div className="lms-card p-3 transition-hover shadow-sm">
          <div className="d-flex align-items-center flex-wrap gap-3">
            {/* Standardized image container size and rounding (similar to Diane's list items) */}
            <div style={{ width: '70px', height: '70px', flexShrink: 0, borderRadius: '12px', overflow: 'hidden' }}>
                <img src={courseImg} alt="Course" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            
            <div className="flex-grow-1">
              <h5 className="fw-bold mb-1" style={{color: 'var(--text-main)'}}>Android App UI Mockup</h5>
              <p className="small mb-2" style={{color: 'var(--text-muted)'}}>Mobile Application Development</p>
              {/* Uses Bootstrap text-warning (standard light-orange) */}
              <div className="d-flex align-items-center gap-2 text-warning fw-bold" style={{ fontSize: '13px' }}>
                <Clock size={14} /> Due: March 25, 2026
              </div>
            </div>

            <div className="d-flex flex-column align-items-end gap-2 ms-auto">
              {/* Refined Pending Badge (standard orange warning) */}
              <span className="badge bg-warning text-dark px-3 py-2 rounded-pill shadow-sm">Pending</span>
              {/* Updated Button class to match the main LMS blue theme but outlined */}
              <button className="btn btn-sm btn-outline-primary fw-medium px-3 d-flex align-items-center gap-1 rounded-pill">
                View Details <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* ======================================= */}
        {/* Assignment 2: Submitted (Green success theme) */}
        {/* ======================================= */}
        <div className="lms-card p-3 transition-hover shadow-sm">
          <div className="d-flex align-items-center flex-wrap gap-3">
            <div style={{ width: '70px', height: '70px', flexShrink: 0, borderRadius: '12px', overflow: 'hidden' }}>
                <img src={courseImg} alt="Course" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            
            <div className="flex-grow-1">
              <h5 className="fw-bold mb-1" style={{color: 'var(--text-main)'}}>Data Analysis with R</h5>
              <p className="small mb-2" style={{color: 'var(--text-muted)'}}>Data Science Fundamentals</p>
              {/* Uses text-success green */}
              <div className="d-flex align-items-center gap-2 text-success fw-bold" style={{ fontSize: '13px' }}>
                <CheckCircle size={14} /> Submitted: March 18, 2026
              </div>
            </div>

            <div className="d-flex flex-column align-items-end gap-2 ms-auto">
              {/* Submitted Green Success Badge */}
              <span className="badge bg-success text-white px-3 py-2 rounded-pill shadow-sm">Submitted</span>
              <button className="btn btn-sm btn-outline-primary fw-medium px-3 d-flex align-items-center gap-1 rounded-pill">
                View Feedback <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* ======================================= */}
        {/* Assignment 3: Pending (Orange warning theme) */}
        {/* ======================================= */}
        <div className="lms-card p-3 transition-hover shadow-sm">
          <div className="d-flex align-items-center flex-wrap gap-3">
            <div style={{ width: '70px', height: '70px', flexShrink: 0, borderRadius: '12px', overflow: 'hidden' }}>
                <img src={courseImg} alt="Course" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            
            <div className="flex-grow-1">
              <h5 className="fw-bold mb-1" style={{color: 'var(--text-main)'}}>Photography Portfolio</h5>
              <p className="small mb-2" style={{color: 'var(--text-muted)'}}>Multimedia Arts</p>
              <div className="d-flex align-items-center gap-2 text-warning fw-bold" style={{ fontSize: '13px' }}>
                <Clock size={14} /> Due: March 28, 2026
              </div>
            </div>

            <div className="d-flex flex-column align-items-end gap-2 ms-auto">
              <span className="badge bg-warning text-dark px-3 py-2 rounded-pill shadow-sm">Pending</span>
              <button className="btn btn-sm btn-outline-primary fw-medium px-3 d-flex align-items-center gap-1 rounded-pill">
                View Details <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Assignments;