import React, { useState } from 'react';
import { Clock, CheckCircle, FileText, ChevronRight } from 'lucide-react';
import courseImg from '../../assets/images/courses.jpg';

const Assignments = () => {
  const [filter, setFilter] = useState('All');

  return (
    <div className="animate__animated animate__fadeIn">
      
      {/* Header & Filters */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 pb-3 border-bottom">
        <h3 className="fw-bold m-0 mb-3 mb-md-0 d-flex align-items-center gap-2">
          <FileText size={24} className="text-danger" /> Course Assignments
        </h3>

        <div className="btn-group shadow-sm" role="group">
          <button 
            type="button" 
            className={`btn ${filter === 'All' ? 'btn-dark' : 'btn-outline-secondary bg-white'}`}
            onClick={() => setFilter('All')}
          >
            All
          </button>
          <button 
            type="button" 
            className={`btn ${filter === 'Pending' ? 'btn-dark' : 'btn-outline-secondary bg-white'}`}
            onClick={() => setFilter('Pending')}
          >
            Pending
          </button>
          <button 
            type="button" 
            className={`btn ${filter === 'Submitted' ? 'btn-dark' : 'btn-outline-secondary bg-white'}`}
            onClick={() => setFilter('Submitted')}
          >
            Submitted
          </button>
        </div>
      </div>

      {/* Assignment List */}
      <div className="d-flex flex-column gap-3">

        {/* Assignment 1: Pending */}
        <div className="card border-0 shadow-sm modern-card p-3 transition-hover">
          <div className="d-flex align-items-center flex-wrap gap-3">
            <img src={courseImg} alt="Course" className="rounded" style={{ width: '80px', height: '80px', objectFit: 'cover' }} />
            
            <div className="flex-grow-1">
              <h5 className="fw-bold mb-1">Android App UI Mockup</h5>
              <p className="text-muted small mb-2">Mobile Application Development</p>
              <div className="d-flex align-items-center gap-2 text-warning fw-bold" style={{ fontSize: '13px' }}>
                <Clock size={14} /> Due: March 25, 2026
              </div>
            </div>

            <div className="d-flex flex-column align-items-end gap-2">
              <span className="badge bg-warning text-dark px-3 py-2 rounded-pill shadow-sm">Pending</span>
              <button className="btn btn-sm btn-outline-dark fw-medium px-3 d-flex align-items-center gap-1">
                View Details <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Assignment 2: Submitted */}
        <div className="card border-0 shadow-sm modern-card p-3 transition-hover">
          <div className="d-flex align-items-center flex-wrap gap-3">
            <img src={courseImg} alt="Course" className="rounded" style={{ width: '80px', height: '80px', objectFit: 'cover' }} />
            
            <div className="flex-grow-1">
              <h5 className="fw-bold mb-1">Data Analysis with R</h5>
              <p className="text-muted small mb-2">Data Science Fundamentals</p>
              <div className="d-flex align-items-center gap-2 text-success fw-bold" style={{ fontSize: '13px' }}>
                <CheckCircle size={14} /> Submitted: March 18, 2026
              </div>
            </div>

            <div className="d-flex flex-column align-items-end gap-2">
              <span className="badge bg-success text-white px-3 py-2 rounded-pill shadow-sm">Submitted</span>
              <button className="btn btn-sm btn-outline-dark fw-medium px-3 d-flex align-items-center gap-1">
                View Feedback <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Assignment 3: Pending */}
        <div className="card border-0 shadow-sm modern-card p-3 transition-hover">
          <div className="d-flex align-items-center flex-wrap gap-3">
            <img src={courseImg} alt="Course" className="rounded" style={{ width: '80px', height: '80px', objectFit: 'cover' }} />
            
            <div className="flex-grow-1">
              <h5 className="fw-bold mb-1">Photography Portfolio</h5>
              <p className="text-muted small mb-2">Multimedia Arts</p>
              <div className="d-flex align-items-center gap-2 text-warning fw-bold" style={{ fontSize: '13px' }}>
                <Clock size={14} /> Due: March 28, 2026
              </div>
            </div>

            <div className="d-flex flex-column align-items-end gap-2">
              <span className="badge bg-warning text-dark px-3 py-2 rounded-pill shadow-sm">Pending</span>
              <button className="btn btn-sm btn-outline-dark fw-medium px-3 d-flex align-items-center gap-1">
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