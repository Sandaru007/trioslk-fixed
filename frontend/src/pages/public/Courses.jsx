import React, { useState, useEffect } from 'react';
import api from '../../services/api'; // <-- 1. IMPORT
import coursesImg from '../../assets/images/courses.jpg';
import './Courses.css';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [step, setStep] = useState(1);
  const [enrollmentData, setEnrollmentData] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [receiptFile, setReceiptFile] = useState(null);

  // Get logged-in user info to pre-fill enrollment
  const userInfo = (() => {
    try {
      return JSON.parse(sessionStorage.getItem('trioslk_userInfo') || '{}');
    } catch {
      return {};
    }
  })();

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

  const proceedToPayment = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    setEnrollmentData({
      fullName: data.get('fullName'),
      email: data.get('email'),
      phone: data.get('phone'),
      studentId: data.get('studentId') || userInfo?.studentId || 'New Student',
    });
    setStep(2);
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const method = data.get('paymentMethod');
    try {
      const formData = new FormData();
      formData.append('studentId', enrollmentData.studentId);
      formData.append('studentName', enrollmentData.fullName);
      formData.append('courseId', selectedCourse._id);
      formData.append('courseTitle', selectedCourse.title);
      formData.append('amount', 15000);
      formData.append('method', method);
      formData.append('status', 'Pending');
      
      if (method === 'Bank Transfer') {
        if (receiptFile) {
          formData.append('receipt', receiptFile);
        } else {
          alert('Please upload a payment receipt.');
          return;
        }
      }

      const response = await api.post('/payments', formData);
      
      if (!response.data) {
        throw new Error('Payment failed: No data returned');
      }

      alert('Enrollment and payment submitted successfully!');
      
      const modalElement = document.getElementById('enrollmentModal');
      const closeBtn = modalElement.querySelector('.btn-close');
      if (closeBtn) closeBtn.click();
      
      setStep(1);
      setEnrollmentData(null);
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.error || error.response?.data?.message || error.message;
      alert(`Payment failed: ${errorMsg}`);
    }
  };

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
                      <button className={`btn flex-grow-1 fw-medium shadow-sm ${course.status === 'Closed' ? 'btn-secondary' : 'btn-theme-red'}`} data-bs-toggle="modal" data-bs-target="#enrollmentModal" onClick={() => { setSelectedCourse(course); setStep(1); }} disabled={course.status === 'Closed'}>
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
              <h5 className="modal-title fw-bold" id="enrollmentModalLabel">
                {step === 1 ? 'Course Enrollment' : 'Payment Details'}
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body p-4">
              <div className="alert alert-secondary mb-4 border-0 text-dark">
                {step === 1 ? (
                  <>You are applying for: <strong>{selectedCourse?.title || "a course"}</strong></>
                ) : (
                  <>Course Fee: <strong>Rs. 15,000</strong></>
                )}
              </div>
              
              {step === 1 ? (
                <form onSubmit={proceedToPayment}>
                  <div className="mb-3"><label className="form-label fw-medium text-muted small">Full Name</label><input type="text" name="fullName" className="form-control" placeholder="Enter your full name" defaultValue={userInfo?.name || ''} required /></div>
                  <div className="row mb-3">
                    <div className="col-md-6"><label className="form-label fw-medium text-muted small">Email Address</label><input type="email" name="email" className="form-control" placeholder="name@example.com" defaultValue={userInfo?.email || ''} required /></div>
                    <div className="col-md-6 mt-3 mt-md-0"><label className="form-label fw-medium text-muted small">Phone Number</label><input type="tel" name="phone" className="form-control" placeholder="07XXXXXXXX" required /></div>
                  </div>
                  <div className="mb-4"><label className="form-label fw-medium text-muted small">Student ID (If applicable)</label><input type="text" name="studentId" className="form-control" placeholder="e.g. STU-1001" defaultValue={userInfo?.studentId || ''} /><div className="form-text">Leave blank if you are a new student.</div></div>
                  <button type="submit" className="btn btn-theme-red w-100 py-2 fw-bold">Proceed to Payment <i className="bi bi-arrow-right ms-2"></i></button>
                </form>
              ) : (
                <form onSubmit={handlePayment}>
                  <div className="mb-4">
                    <label className="form-label fw-medium text-muted small mb-3">Select Payment Method</label>
                    <div className="payment-method-selector">
                      <label className={`payment-method-card ${paymentMethod === 'Bank Transfer' ? 'active' : ''}`}>
                        <input 
                          type="radio" 
                          name="paymentMethod" 
                          value="Bank Transfer" 
                          checked={paymentMethod === 'Bank Transfer'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="d-none"
                          required
                        />
                        <div className="d-flex align-items-center">
                          <div className="method-icon"><i className="bi bi-bank"></i></div>
                          <div className="method-info">
                            <h6 className="mb-0 fw-bold">Bank Transfer</h6>
                            <small className="text-muted">Direct transfer to our bank account</small>
                          </div>
                          <div className="ms-auto check-icon">
                            <i className="bi bi-check-circle-fill"></i>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {paymentMethod === 'Bank Transfer' && (
                    <div className="bank-transfer-details animate-fade-in mb-4">
                      <div className="d-flex align-items-center mb-3">
                        <div className="bank-logo-placeholder me-3">
                          <i className="bi bi-building fs-3" style={{ color: 'var(--trioslk-maroon, #7a1b29)' }}></i>
                        </div>
                        <div>
                          <h6 className="fw-bold mb-1">Commercial Bank</h6>
                          <span className="badge bg-light text-dark border">TrioSLK Academy</span>
                        </div>
                      </div>
                      
                      <div className="account-number-box mb-4">
                        <span className="small text-muted d-block mb-1">Account Number</span>
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="fs-5 fw-bold font-monospace tracking-wider text-dark">1234 5678 9012</span>
                        </div>
                      </div>

                      <div className="upload-receipt-area">
                        <label className="form-label fw-medium text-dark small mb-2 d-flex align-items-center">
                          <i className="bi bi-cloud-arrow-up me-2" style={{ color: 'var(--trioslk-maroon, #7a1b29)' }}></i>
                          Upload Payment Receipt (PDF)
                        </label>
                        <div className="file-upload-wrapper">
                          <input 
                            type="file" 
                            name="receipt" 
                            accept=".pdf" 
                            className="form-control file-input-custom" 
                            required 
                            onChange={(e) => {
                                if (e.target.files && e.target.files.length > 0) {
                                    setReceiptFile(e.target.files[0]);
                                }
                            }}
                          />
                          <div className="form-text text-muted small mt-2">
                             Max file size: 5MB. Only PDF accepted.
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="p-3 bg-light rounded mb-4">
                    <p className="text-muted small mb-0">By clicking "Pay Now", you confirm your enrollment and agree to the course terms and conditions.</p>
                  </div>
                  
                  <div className="d-flex gap-2">
                    <button type="button" className="btn btn-light flex-grow-1" onClick={() => { setStep(1); setPaymentMethod(''); }}>Back</button>
                    <button type="submit" className="btn btn-danger flex-grow-1 py-2 fw-bold" disabled={!paymentMethod}>Pay Now <i className="bi bi-shield-lock ms-2"></i></button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses;