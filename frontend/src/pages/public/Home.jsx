import React, { useState, useEffect } from 'react';
import api from '../../services/api'; // <-- 1. IMPORT YOUR NEW API UTILITY
import { Link } from 'react-router-dom';
import homeImg from '../../assets/images/hero-img.jpg';
import volunteerImpactImg from '../../assets/images/volunteer.jpg';
import './Home.css';

const Home = () => {

    const [feedbackData, setFeedbackData] = useState({
    name: '',
    email: '',
    course: '',
    rating: '',
    comment: '',
    recommend: 'false',
  });

  const [inquiryData, setInquiryData] = useState({
    name: '',
    email: '',
    category: '',
    message: '',
  });

  const handleFeedbackChange = (e) => {
    const { name, value } = e.target;
    setFeedbackData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInquiryChange = (e) => {
    const { name, value } = e.target;
    setInquiryData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...feedbackData,
          rating: Number(feedbackData.rating),
          recommend: feedbackData.recommend === 'true',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit feedback');
      }

      alert('Feedback submitted successfully!');

      setFeedbackData({
        name: '',
        email: '',
        course: '',
        rating: '',
        comment: '',
        recommend: 'false',
      });
    } catch (error) {
      alert(error.message);
    }
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inquiryData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit inquiry');
      }

      alert('Inquiry submitted successfully!');

      setInquiryData({
        name: '',
        email: '',
        category: '',
        message: '',
      });
    } catch (error) {
      alert(error.message);
    }
  };
  const [recentEvents, setRecentEvents] = useState([]);
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingCourses, setLoadingCourses] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const eventRes = await api.get('/events'); // <-- 2. CLEANER URL
        setRecentEvents(eventRes.data.slice(0, 2)); 
      } catch (error) { console.error('Error fetching recent events:', error); } 
      finally { setLoadingEvents(false); }

      try {
        const courseRes = await api.get('/courses'); // <-- 3. CLEANER URL
        setFeaturedCourses(courseRes.data.slice(0, 3)); 
      } catch (error) { console.error('Error fetching featured courses:', error); } 
      finally { setLoadingCourses(false); }
    };
    fetchHomeData();
  }, []);

  const getBadgeConfig = (status) => {
    if (status === 'Ongoing') return { text: 'OPEN', bg: 'bg-success' };
    if (status === 'Upcoming') return { text: 'COMING SOON', bg: 'bg-secondary' };
    if (status === 'Completed') return { text: 'CLOSED', bg: 'bg-dark' };
    return { text: 'NEW', bg: 'bg-theme-red' }; 
  };

  return (
    <div>
      {/* HERO SECTION */}
      <section className="page-header-bg" style={{ backgroundImage: `url(${homeImg})` }}>
        <div className="header-right-overlay"></div>
        <div className="container header-content d-flex justify-content-end text-end text-white" data-aos="fade-up">
          <div style={{ maxWidth: '600px' }}>
            <h1 className="display-3 fw-bold mb-4">Empowering Young Minds</h1>
            <p className="lead fs-4 mb-5">Learn. Create. Lead.</p>
            <div className="d-flex justify-content-end gap-3">
              <Link to="/courses" className="btn btn-theme-red btn-lg rounded-pill px-5">Explore Courses</Link>
              <Link to="/about" className="btn btn-outline-light btn-lg rounded-pill px-5">About Us</Link>
            </div>
          </div>
        </div>
      </section>

      {/* COURSES SECTION */}
      <section className="py-5 bg-white">
        <div className="container py-4">
          <div className="d-flex justify-content-between align-items-end mb-4" data-aos="fade-right">
            <h2 className="fw-bold m-0">Our Featured Courses</h2>
            <Link to="/courses" className="text-decoration-none fw-semibold text-dark">View All <i className="bi bi-arrow-right"></i></Link>
          </div>
          
          <div className="row g-4">
            {loadingCourses ? (
              <div className="col-12 text-center py-4"><p className="text-muted">Loading featured courses...</p></div>
            ) : featuredCourses.length === 0 ? (
              <div className="col-12 text-center py-4"><p className="text-muted">No courses available right now. Check back soon!</p></div>
            ) : (
              featuredCourses.map((course, index) => (
                <div key={course._id} className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay={index * 150}>
                  <div className="card h-100 border-0 shadow-sm modern-card">
                    <img src={course.imageUrl} alt={course.title} className="card-img-top" style={{ height: '220px', objectFit: 'cover' }} />
                    <div className="card-body">
                      <h5 className="card-title fw-bold" style={{ fontSize: '1.25rem', marginBottom: '8px' }}>{course.title}</h5>
                      <p className="card-text text-muted" style={{ fontSize: '14px', fontWeight: '400', lineHeight: '1.5' }}>{course.shortDesc}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* VOLUNTEER CTA SECTION */}
      <section className="volunteer-section py-5 bg-white">
        <div className="container py-4">
          <div className="row align-items-center bg-light rounded-4 shadow-sm overflow-hidden" data-aos="zoom-in" data-aos-duration="1000">
            <div className="col-lg-5 p-5 text-center text-lg-start">
              <h2 className="fw-bold mb-3">Make an Impact.<br/>Join as a Volunteer!</h2>
              <p className="lead text-muted mb-4">
                Become a part of the TrioSLK community. Gain real-world experience, build your network, and help us create unforgettable educational programs.
              </p>
              <Link to="/volunteer" className="btn btn-theme-red btn-lg rounded-pill px-5 shadow-sm">Register as Volunteer</Link>
            </div>
            <div className="col-lg-7 p-0 d-none d-lg-block">
              <img src={volunteerImpactImg} alt="TrioSLK Volunteers in Action" className="img-fluid w-100 h-100" style={{ objectFit: 'cover', minHeight: '400px' }} />
            </div>
          </div>
        </div>
      </section>

      {/* UPCOMING EVENTS SECTION */}
      <section className="py-5 bg-white">
        <div className="container py-4">
          <div className="d-flex justify-content-between align-items-end mb-4" data-aos="fade-right">
            <h2 className="fw-bold m-0">Upcoming Events & Batches</h2>
            <Link to="/events" className="text-decoration-none fw-semibold text-dark">All Events <i className="bi bi-arrow-right"></i></Link>
          </div>

          <div className="row g-4">
            {loadingEvents ? (
              <div className="col-12 text-center py-4"><p className="text-muted">Loading latest events...</p></div>
            ) : recentEvents.length === 0 ? (
              <div className="col-12 text-center py-4"><p className="text-muted">No upcoming events at the moment. Check back soon!</p></div>
            ) : (
              recentEvents.map((event, index) => {
                const badge = getBadgeConfig(event.status);
                return (
                  <div key={event._id} className="col-md-6" data-aos="fade-up" data-aos-delay={index * 200}>
                    <div className="card border-0 shadow-sm modern-card d-flex flex-row overflow-hidden h-100">
                      <div style={{ width: '150px', flexShrink: 0, position: 'relative' }}>
                        <img src={event.imageUrl} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-25"></div>
                        <div className={`position-absolute top-0 start-0 m-2 text-white fw-bold px-2 py-1 rounded ${badge.bg}`} style={{ fontSize: '0.7rem' }}>{badge.text}</div>
                      </div>
                      <div className="card-body d-flex flex-column justify-content-center p-4">
                        <h5 className="card-title fw-bold" style={{ fontSize: '1.1rem', marginBottom: '8px' }}>{event.title}</h5>
                        <p className="card-text text-muted mb-0" style={{ fontSize: '14px', fontWeight: '400', letterSpacing: 'normal', lineHeight: '1.5' }}>
                          {event.description.length > 60 ? event.description.substring(0, 60) + '...' : event.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

            {/* 5. FEEDBACK & INQUIRY SECTION */}
      <section className="feedback-inquiry-section py-5 bg-light">
        <div className="container py-4">
          <div className="row g-4">
            
            {/* Feedback Form */}
            <div className="col-lg-6" data-aos="fade-right">
              <div className="fi-card h-100">
                <h2 className="fw-bold mb-3 text-center">Feedback Form</h2>
                <p className="text-muted text-center mb-4">
                  We value your feedback to improve our service.
                </p>

                <form onSubmit={handleFeedbackSubmit} className="d-flex flex-column h-100">
                  <div className="mb-3">
                    <input
                      type="text"
                      name="name"
                      className="form-control fi-input"
                      placeholder="Your Name"
                      value={feedbackData.name}
                      onChange={handleFeedbackChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <input
                      type="email"
                      name="email"
                      className="form-control fi-input"
                      placeholder="Your Email"
                      value={feedbackData.email}
                      onChange={handleFeedbackChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <input
                      type="text"
                      name="course"
                      className="form-control fi-input"
                      placeholder="Course Name"
                      value={feedbackData.course}
                      onChange={handleFeedbackChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <select
                      name="rating"
                      className="form-select fi-input"
                      value={feedbackData.rating}
                      onChange={handleFeedbackChange}
                      required
                    >
                      <option value="">Select Rating</option>
                      <option value="1">1 - Very Poor</option>
                      <option value="2">2 - Poor</option>
                      <option value="3">3 - Good</option>
                      <option value="4">4 - Very Good</option>
                      <option value="5">5 - Excellent</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <textarea
                      name="comment"
                      className="form-control fi-textarea"
                      placeholder="Write your comment here..."
                      rows="5"
                      value={feedbackData.comment}
                      onChange={handleFeedbackChange}
                      required
                    ></textarea>
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-semibold d-block mb-2">
                      Would you recommend us?
                    </label>

                    <div className="d-flex gap-4">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="recommend"
                          id="recommendYes"
                          value="true"
                          checked={feedbackData.recommend === 'true'}
                          onChange={handleFeedbackChange}
                        />
                        <label className="form-check-label" htmlFor="recommendYes">
                          Yes
                        </label>
                      </div>

                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="recommend"
                          id="recommendNo"
                          value="false"
                          checked={feedbackData.recommend === 'false'}
                          onChange={handleFeedbackChange}
                        />
                        <label className="form-check-label" htmlFor="recommendNo">
                          No
                        </label>
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-theme-red w-100 rounded-pill py-3 fw-semibold mt-auto">
                    Submit Feedback
                  </button>
                </form>
              </div>
            </div>

            {/* Inquiry Form */}
            <div className="col-lg-6" data-aos="fade-left">
              <div className="fi-card h-100">
                <h2 className="fw-bold mb-3 text-center">Inquiry Page</h2>
                <p className="text-muted text-center mb-4">
                  Send your questions or issues to the administration.
                </p>

                <form onSubmit={handleInquirySubmit} className="d-flex flex-column h-100">
                  <div className="mb-3">
                    <input
                      type="text"
                      name="name"
                      className="form-control fi-input"
                      placeholder="Name"
                      value={inquiryData.name}
                      onChange={handleInquiryChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <input
                      type="email"
                      name="email"
                      className="form-control fi-input"
                      placeholder="Email"
                      value={inquiryData.email}
                      onChange={handleInquiryChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <select
                      name="category"
                      className="form-select fi-input"
                      value={inquiryData.category}
                      onChange={handleInquiryChange}
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="General">General</option>
                      <option value="Course">Course</option>
                      <option value="Technical">Technical</option>
                      <option value="Volunteer">Volunteer</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <textarea
                      name="message"
                      className="form-control fi-textarea"
                      placeholder="Describe your issue or question here..."
                      rows="8"
                      value={inquiryData.message}
                      onChange={handleInquiryChange}
                      required
                    ></textarea>
                  </div>

                  <button type="submit" className="btn btn-theme-red w-100 rounded-pill py-3 fw-semibold mt-auto">
                    Submit Inquiry
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>


    </div>
  );
};

export default Home;