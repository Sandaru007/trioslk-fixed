import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, FileText, ChevronRight } from 'lucide-react';
import api from '../../services/api';

// Ensure this asset path is correct in your project structure
import courseImg from '../../assets/images/courses.jpg';

const Assignments = () => {
  const [filter, setFilter] = useState('All');
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        const response = await api.get('/assignments');
        setAssignments(response.data || []);
      } catch (error) {
        console.error("Error fetching assignments:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, []);

  // Helper function to define logic for active filter buttons
  const getFilterButtonClass = (buttonFilter) => {
    return filter === buttonFilter
      ? 'btn btn-primary px-4 rounded-pill' // The active blue, rounded style
      : 'btn btn-outline-secondary bg-white text-muted px-4 rounded-pill'; // Standard outlined, muted
  };

  const filteredAssignments = assignments.filter((assignment) => {
    if (filter === 'All') return true;
    if (filter === 'Pending') {
      return new Date(assignment.dueDate) >= new Date();
    }
    if (filter === 'Submitted') {
      return false; // Not implemented yet
    }
    return true;
  });

  return (
    <div className="animate__animated animate__fadeIn">
      
      {/* Header & Filters - Aligned with the dashboard's clean structure */}
      <div className="card-header-inline mb-4 pb-3 border-bottom">
        <h3 className="fw-bold m-0 d-flex align-items-center gap-2" style={{color: 'var(--text-main)'}}>
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
        {loading ? (
          <p>Loading assignments...</p>
        ) : filteredAssignments.length === 0 ? (
          <p className="text-muted">No assignments found for this filter.</p>
        ) : (
          filteredAssignments.map((assignment) => (
            <div key={assignment._id} className="lms-card p-3 transition-hover shadow-sm">
              <div className="d-flex align-items-center flex-wrap gap-3">
                <div style={{ width: '70px', height: '70px', flexShrink: 0, borderRadius: '12px', overflow: 'hidden' }}>
                    <img src={courseImg} alt="Course" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                
                <div className="flex-grow-1">
                  <h5 className="fw-bold mb-1" style={{color: 'var(--text-main)'}}>{assignment.title}</h5>
                  <p className="small mb-2" style={{color: 'var(--text-muted)'}}>Course: {assignment.courseCode}</p>
                  
                  {new Date(assignment.dueDate) >= new Date() ? (
                    <div className="d-flex align-items-center gap-2 text-warning fw-bold" style={{ fontSize: '13px' }}>
                      <Clock size={14} /> Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </div>
                  ) : (
                    <div className="d-flex align-items-center gap-2 text-danger fw-bold" style={{ fontSize: '13px' }}>
                      <Clock size={14} /> Overdue: {new Date(assignment.dueDate).toLocaleDateString()}
                    </div>
                  )}
                </div>

                <div className="d-flex flex-column align-items-end gap-2 ms-auto">
                  {new Date(assignment.dueDate) >= new Date() ? (
                    <span className="badge bg-warning text-dark px-3 py-2 rounded-pill shadow-sm">Pending</span>
                  ) : (
                    <span className="badge bg-danger text-white px-3 py-2 rounded-pill shadow-sm">Overdue</span>
                  )}
                  <a href={assignment.fileUrl.startsWith('http') ? assignment.fileUrl : `http://localhost:8000${assignment.fileUrl}`} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-primary fw-medium px-3 d-flex align-items-center gap-1 rounded-pill">
                    View Details <ChevronRight size={14} />
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Assignments;