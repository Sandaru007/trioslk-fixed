import React, { useState, useEffect } from 'react';
import api from '../../services/api'; // <-- 1. IMPORT
import coursesImg from '../../assets/images/courses.jpg';
import './Courses.css';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    const fetchLiveCourses = async () => {
      try {
        const response = await api.get('/courses'); // <-- 2. CLEANER URL
        setCourses(response.data);
      } catch (error) { console.error('Error fetching live courses:', error); }
      finally { setLoading(false); }
    };
    fetchLiveCourses();
  }, []);

  return (
    <div>
      <section className="page-header-bg" style={{ backgroundImage: `url(${coursesImg})` }} data-aos="fade-down">
        <div className="header-right-overlay"></div>
        <div className="container header-content d-flex justify-content-end text-end text-white">
          <div style={{ maxWidth: '600px' }}>
            <h1 className="display-5 fw-bold mb-3">Our Certificate Courses</h1>
            <p className="lead text-light">Industry-focused programs designed to give you practical skills and real-world experience.</p>
          </div>
        </div>
      </section>

      <section className="py-5 bg-white">
        <div className="container py-4">
          {loading && <div className="text-center py-5"><h4>Loading courses...</h4></div>}
          {!loading && courses.length === 0 && (
            <div className="text-center py-5 text-muted"><h4>No courses available right now. Check back later!</h4></div>
          )}

          <div className="row g-4">
            {!loading && courses.map((course, index) => (
              <div key={course._id} className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay={index * 150}>
                <div className="course-card d-flex flex-column bg-white">
                  <img src={course.imageUrl} alt={course.title} className="card-img-top border-bottom" style={{ height: '220px', objectFit: 'cover' }} />
                  <div className="p-4 flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <i className={`bi ${course.icon || 'bi-book'} fs-1`} style={{ color: 'var(--trioslk-maroon)' }}></i>
                      <span className="course-duration"><i className="bi bi-clock me-1"></i>{course.duration}</span>
                    </div>
                    <h4 className="fw-bold mb-3" style={{ fontSize: '1.25rem' }}>{course.title}</h4>
                    <p className="text-muted" style={{ fontSize: '14px', fontWeight: '400', lineHeight: '1.5' }}>{course.shortDesc}</p>

                    <div className="collapse" id={`collapseCourse${course._id}`}>
                      <div className="pt-2 pb-3 border-top mt-3">
                        <p className="text-muted mb-0 lh-base text-start" style={{ fontSize: '14px', fontWeight: '400', lineHeight: '1.5' }}>
                          <strong style={{ fontSize: '14px' }}>What you will learn:</strong><br/>
                          {course.fullDesc}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-0 mt-auto border-top-0">
                    <div className="d-flex gap-2">
                      <button className="btn btn-light flex-grow-1 fw-medium collapse-btn text-dark border shadow-sm" type="button" data-bs-toggle="collapse" data-bs-target={`#collapseCourse${course._id}`} aria-expanded="false">
                        Details <i className="bi bi-chevron-down ms-1 expand-icon"></i>
                      </button>
                      <button className={`btn flex-grow-1 fw-medium shadow-sm ${course.status === 'Closed' ? 'btn-secondary' : 'btn-theme-red'}`} data-bs-toggle="modal" data-bs-target="#enrollmentModal" onClick={() => setSelectedCourse(course.title)} disabled={course.status === 'Closed'}>
                        {course.status === 'Closed' ? 'Closed' : 'Enroll Now'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MODAL */}
      <div className="modal fade" id="enrollmentModal" tabIndex="-1" aria-labelledby="enrollmentModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg">
            <div className="modal-header bg-light border-bottom-0 pb-0">
              <h5 className="modal-title fw-bold" id="enrollmentModalLabel">Course Enrollment</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body p-4">
              <div className="alert alert-secondary mb-4 border-0 text-dark">
                You are applying for: <strong>{selectedCourse || "a course"}</strong>
              </div>
              <form>
                <div className="mb-3"><label className="form-label fw-medium text-muted small">Full Name</label><input type="text" className="form-control" placeholder="Enter your full name" required /></div>
                <div className="row mb-3">
                  <div className="col-md-6"><label className="form-label fw-medium text-muted small">Email Address</label><input type="email" className="form-control" placeholder="name@example.com" required /></div>
                  <div className="col-md-6 mt-3 mt-md-0"><label className="form-label fw-medium text-muted small">Phone Number</label><input type="tel" className="form-control" placeholder="07XXXXXXXX" required /></div>
                </div>
                <div className="mb-4"><label className="form-label fw-medium text-muted small">Student ID (If applicable)</label><input type="text" className="form-control" placeholder="e.g. STU001" /><div className="form-text">Leave blank if you are a new student.</div></div>
                <button type="submit" className="btn btn-theme-red w-100 py-2 fw-bold">Enroll Me</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses;