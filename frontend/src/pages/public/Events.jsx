import React, { useState, useEffect } from 'react';
import api from '../../services/api'; 
import eventsImg from '../../assets/images/events.jpg'; 
import './Events.css';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Stores the full event object for the modal (important for getting eventId)
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Form states
  const [regData, setRegData] = useState({ fullName: '', email: '', phone: '' });
  const [status, setStatus] = useState({ loading: false, message: '', type: '' });

  useEffect(() => {
    const fetchLiveEvents = async () => {
      try {
        const response = await api.get('/events');
        setEvents(response.data);
      } catch (error) { 
        console.error('Error fetching live events:', error); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchLiveEvents();
  }, []);

  // Open Modal and Auto-fill data from localStorage if logged in
  const handleOpenRegister = (event) => {
    setSelectedEvent(event);
    setStatus({ loading: false, message: '', type: '' });

    const savedUser = JSON.parse(localStorage.getItem('userInfo'));
    if (savedUser) {
      setRegData({
        fullName: `${savedUser.firstName} ${savedUser.lastName}`,
        email: savedUser.email,
        phone: savedUser.phone
      });
    } else {
      setRegData({ fullName: '', email: '', phone: '' });
    }
  };

  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, message: 'Registering...', type: 'info' });

    const savedUser = JSON.parse(localStorage.getItem('userInfo'));

    const payload = {
      eventId: selectedEvent.eventId, // The manual ID like EVT-1001
      eventTitle: selectedEvent.title,
      studentId: savedUser ? savedUser.studentId : 'GUEST', // The Link!
      studentName: regData.fullName,
      studentEmail: regData.email,
      studentPhone: regData.phone
    };

    try {
      await api.post('/registrations', payload);
      setStatus({ 
        loading: false, 
        message: `Successfully registered for ${selectedEvent.title}!`, 
        type: 'success' 
      });
      // Optional: Clear form after success
      setTimeout(() => {
        setRegData({ fullName: '', email: '', phone: '' });
      }, 2000);
    } catch (error) {
      setStatus({ 
        loading: false, 
        message: error.response?.data?.message || 'Registration failed. Try again.', 
        type: 'danger' 
      });
    }
  };

  const getStatusClass = (status) => {
    if (status === 'Ongoing') return 'status-open'; 
    if (status === 'Upcoming') return 'status-upcoming'; 
    if (status === 'Completed') return 'status-new'; 
    return 'status-new'; 
  };

  return (
    <div>
      <section className="page-header-bg" style={{ backgroundImage: `url(${eventsImg})` }} data-aos="fade-down">
        <div className="header-right-overlay"></div>
        <div className="container header-content d-flex justify-content-end text-end text-white">
          <div style={{ maxWidth: '600px' }}>
            <h1 className="display-5 fw-bold mb-3">Upcoming Events & Registrations</h1>
            <p className="lead text-light">Stay updated with our latest course intakes, workshops, and academy events.</p>
          </div>
        </div>
      </section>

      <section className="py-5 bg-white">
        <div className="container py-4">
          {loading && <div className="text-center py-5"><h4>Loading live events...</h4></div>}
          {!loading && events.length === 0 && (
            <div className="text-center py-5 text-muted"><h4>No events available right now.</h4></div>
          )}

          <div className="row justify-content-center g-4">
            {events.map((event, index) => (
              <div key={event._id} className="col-lg-8" data-aos="fade-up" data-aos-delay={index * 100}>
                <div className="card modern-card border-0 shadow-sm flex-md-row overflow-hidden">
                  <div className="position-relative d-none d-md-block" style={{ width: '250px', flexShrink: 0 }}>
                    <img src={event.imageFile} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <span className={`status-badge position-absolute top-0 start-0 m-3 shadow-sm ${getStatusClass(event.status)}`}>{event.status}</span>
                  </div>
                  
                  <div className="card-body p-4 d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <small className="text-primary fw-bold">{event.eventId}</small>
                        <h4 className="fw-bold mb-0">{event.title}</h4>
                      </div>
                      <span className="badge bg-light text-dark border">{event.type}</span>
                    </div>
                    
                    <div className="collapse mb-3" id={`collapseEvent${event._id}`}>
                      <div className="p-3 bg-light rounded border">
                        <p className="mb-0 small text-dark">{event.description}</p>
                      </div>
                    </div>

                    <div className="mt-auto d-flex gap-2 pt-2 border-top">
                      <button className="btn btn-outline-secondary fw-medium px-4" type="button" data-bs-toggle="collapse" data-bs-target={`#collapseEvent${event._id}`}>
                        Details <i className="bi bi-chevron-down ms-1"></i>
                      </button>
                      <button 
                        className={`btn px-4 fw-medium shadow-sm ${event.status === 'Completed' ? 'btn-secondary' : 'btn-theme-red'}`} 
                        data-bs-toggle="modal" 
                        data-bs-target="#eventRegisterModal" 
                        onClick={() => handleOpenRegister(event)} 
                        disabled={event.status === 'Completed'}
                      >
                        {event.status === 'Completed' ? 'Closed' : 'Register Now'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REGISTRATION MODAL */}
      <div className="modal fade" id="eventRegisterModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg">
            <div className="modal-header bg-dark text-white">
              <h5 className="modal-title fw-bold">Event Registration</h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body p-4">
              
              {status.message && (
                <div className={`alert alert-${status.type} py-2 text-center small fw-bold`}>
                  {status.message}
                </div>
              )}

              <div className="alert alert-warning mb-4 border-0 text-dark">
                Event: <strong>{selectedEvent?.title}</strong><br/>
                <small className="text-muted">ID: {selectedEvent?.eventId}</small>
              </div>

              <form onSubmit={handleRegistrationSubmit}>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">Full Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={regData.fullName} 
                    onChange={(e) => setRegData({...regData, fullName: e.target.value})}
                    required 
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">Email Address</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    value={regData.email}
                    onChange={(e) => setRegData({...regData, email: e.target.value})}
                    required 
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label small fw-bold text-muted">Phone Number</label>
                  <input 
                    type="tel" 
                    className="form-control" 
                    value={regData.phone}
                    onChange={(e) => setRegData({...regData, phone: e.target.value})}
                    required 
                  />
                </div>
                <button type="submit" className="btn btn-theme-red w-100 py-2 fw-bold" disabled={status.loading}>
                  {status.loading ? 'Processing...' : 'Confirm My Registration'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;