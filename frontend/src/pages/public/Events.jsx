import React, { useState, useEffect } from 'react';
import api from '../../services/api'; 
import eventsImg from '../../assets/images/events.jpg'; 
import './Events.css';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Form states
  const [regData, setRegData] = useState({ fullName: '', email: '', phone: '' });
  const [status, setStatus] = useState({ loading: false, message: '', type: '' });

  useEffect(() => {
    const fetchLiveEvents = async () => {
      try {
        // IMPORTANT: Using the /public endpoint to exclude 'Completed' events
        const response = await api.get('/events/public');
        setEvents(response.data);
      } catch (error) { 
        console.error('Error fetching live events:', error); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchLiveEvents();
  }, []);


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
    setStatus({ loading: true, message: 'Processing registration...', type: 'info' });

    const savedUser = JSON.parse(localStorage.getItem('userInfo'));

    const payload = {
      eventId: selectedEvent.eventId,
      eventTitle: selectedEvent.title,
      // If no savedUser, it defaults to 'GUEST'
      studentId: savedUser ? savedUser.studentId : 'GUEST', 
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
      setTimeout(() => {
        setRegData({ fullName: '', email: '', phone: '' });
      }, 2000);
    } catch (error) {
      setStatus({ 
        loading: false, 
        message: error.response?.data?.message || 'Registration failed.', 
        type: 'danger' 
      });
    }
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'Ongoing': return 'status-open';
      case 'Upcoming': return 'status-upcoming';
      case 'Extended': return 'status-extended'; // Ensure this class exists in Events.css
      default: return 'status-new';
    }
  };

  return (
    <div>
      <section className="page-header-bg" style={{ backgroundImage: `url(${eventsImg})` }} data-aos="fade-down">
        <div className="header-right-overlay"></div>
        <div className="container header-content d-flex justify-content-end text-end text-white">
          <div style={{ maxWidth: '600px' }}>
            <h1 className="display-5 fw-bold mb-3">Live Events & Workshop Registrations</h1>
            <p className="lead text-light">Join our latest intakes and academy workshops. Register today to secure your spot.</p>
          </div>
        </div>
      </section>

      <section className="py-5 bg-white">
        <div className="container py-4">
          {loading && <div className="text-center py-5"><h4>Syncing live events...</h4></div>}
          {!loading && events.length === 0 && (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-calendar-x display-4 mb-3"></i>
              <h4>No active events at the moment.</h4>
              <p>Please check back later for new workshops and intakes.</p>
            </div>
          )}

          <div className="row justify-content-center g-4">
            {events.map((event, index) => (
              <div key={event._id} className="col-lg-8" data-aos="fade-up" data-aos-delay={index * 100}>
                <div className="card modern-card border-0 shadow-sm flex-md-row overflow-hidden">
                  <div className="position-relative d-none d-md-block" style={{ width: '250px', flexShrink: 0 }}>
                    <img src={event.imageFile} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <span className={`status-badge position-absolute top-0 start-0 m-3 shadow-sm ${getStatusClass(event.status)}`}>
                      {event.status}
                    </span>
                  </div>
                  
                  <div className="card-body p-4 d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <small className="text-primary fw-bold text-uppercase" style={{ letterSpacing: '1px' }}>{event.eventId}</small>
                        <h4 className="fw-bold mb-0">{event.title}</h4>
                      </div>
                      <span className="badge bg-light text-dark border">{event.type}</span>
                    </div>
                    
                    <div className="collapse mb-3" id={`collapseEvent${event._id}`}>
                      <div className="p-3 bg-light rounded border">
                        <p className="mb-0 small text-dark lh-base">{event.description}</p>
                      </div>
                    </div>

                    <div className="mt-auto d-flex gap-2 pt-2 border-top">
                      <button className="btn btn-outline-secondary fw-medium px-4" type="button" data-bs-toggle="collapse" data-bs-target={`#collapseEvent${event._id}`}>
                        View Details
                      </button>

                      {/* LOGIC: Registration button depends on Status */}
                      <button 
                        className={`btn px-4 fw-bold shadow-sm ${event.status === 'Upcoming' ? 'btn-light border text-muted' : 'btn-theme-red'}`} 
                        data-bs-toggle="modal" 
                        data-bs-target={event.status === 'Upcoming' ? '' : "#eventRegisterModal"} 
                        onClick={() => event.status !== 'Upcoming' && handleOpenRegister(event)} 
                        disabled={event.status === 'Upcoming'}
                      >
                        {event.status === 'Upcoming' ? 'Coming Soon' : 'Register Now'}
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

              <div className="alert alert-info mb-4 border-0">
                <small className="text-uppercase fw-bold opacity-75 d-block mb-1">You are registering for:</small>
                <h5 className="mb-0 fw-bold">{selectedEvent?.title}</h5>
                <span className="badge bg-white text-primary mt-2">{selectedEvent?.eventId}</span>
              </div>

              <form onSubmit={handleRegistrationSubmit}>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">Full Name</label>
                  <input 
                    type="text" 
                    className="form-control form-control-lg fs-6" 
                    value={regData.fullName} 
                    onChange={(e) => setRegData({...regData, fullName: e.target.value})}
                    required 
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">Email Address</label>
                  <input 
                    type="email" 
                    className="form-control form-control-lg fs-6" 
                    value={regData.email}
                    onChange={(e) => setRegData({...regData, email: e.target.value})}
                    required 
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label small fw-bold text-muted">Phone Number</label>
                  <input 
                    type="tel" 
                    className="form-control form-control-lg fs-6" 
                    value={regData.phone}
                    onChange={(e) => setRegData({...regData, phone: e.target.value})}
                    required 
                  />
                </div>
                <button type="submit" className="btn btn-theme-red w-100 py-3 fw-bold shadow" disabled={status.loading}>
                  {status.loading ? (
                    <span><i className="bi bi-hourglass-split me-2"></i>Processing...</span>
                  ) : (
                    'Confirm My Spot'
                  )}
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