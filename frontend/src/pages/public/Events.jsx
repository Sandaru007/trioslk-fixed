import React, { useState, useEffect } from 'react';
import api from '../../services/api'; // <-- 1. IMPORT
import eventsImg from '../../assets/images/events.jpg'; 
import './Events.css';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fetchLiveEvents = async () => {
      try {
        const response = await api.get('/events'); // <-- 2. CLEANER URL
        setEvents(response.data);
      } catch (error) { console.error('Error fetching live events:', error); }
      finally { setLoading(false); }
    };
    fetchLiveEvents();
  }, []);

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
            <div className="text-center py-5 text-muted"><h4>No events available right now. Check back later!</h4></div>
          )}

          <div className="row justify-content-center g-4">
            {events.map((event, index) => (
              <div key={event._id} className="col-lg-8" data-aos="fade-up" data-aos-delay={index * 100}>
                <div className="card modern-card border-0 shadow-sm flex-md-row overflow-hidden">
                  <div className="position-relative d-none d-md-block" style={{ width: '250px', flexShrink: 0 }}>
                    <img src={event.imageFile} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-25"></div>
                    <span className={`status-badge position-absolute top-0 start-0 m-3 shadow-sm ${getStatusClass(event.status)}`}>{event.status}</span>
                  </div>
                  <div className="d-md-none p-3 pb-0">
                    <span className={`status-badge ${getStatusClass(event.status)}`}>{event.status}</span>
                  </div>
                  
                  <div className="card-body p-4 d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h4 className="fw-bold mb-0">{event.title}</h4>
                      <span className="badge bg-light text-dark border">{event.type}</span>
                    </div>
                    
                    <div className="collapse mb-3" id={`collapseEvent${event._id}`}>
                      <div className="p-3 bg-light rounded border">
                        <p className="mb-0 lh-base text-dark" style={{ fontSize: '14px', fontWeight: '400', letterSpacing: 'normal' }}>
                          {event.description}
                        </p>
                      </div>
                    </div>

                    <div className="mt-auto d-flex gap-2 pt-2 border-top">
                      <button className="btn btn-outline-secondary fw-medium collapse-btn px-4" type="button" data-bs-toggle="collapse" data-bs-target={`#collapseEvent${event._id}`} aria-expanded="false">
                        Details <i className="bi bi-chevron-down ms-1 expand-icon"></i>
                      </button>
                      <button className={`btn px-4 fw-medium shadow-sm ${event.status === 'Completed' ? 'btn-secondary' : 'btn-theme-red'}`} data-bs-toggle="modal" data-bs-target="#eventRegisterModal" onClick={() => setSelectedEvent(event.title)} disabled={event.status === 'Completed'}>
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

      {/* MODAL */}
      <div className="modal fade" id="eventRegisterModal" tabIndex="-1" aria-labelledby="eventRegisterModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg">
            <div className="modal-header bg-dark text-white border-bottom-0 pb-3">
              <h5 className="modal-title fw-bold" id="eventRegisterModalLabel">Event Registration</h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body p-4">
              <div className="alert alert-warning mb-4 border-0 text-dark fw-medium">
                Registering for: <br/><strong>{selectedEvent || "an event"}</strong>
              </div>
              <form>
                <div className="mb-3"><label className="form-label fw-medium text-muted small">Full Name</label><input type="text" className="form-control" placeholder="Enter your full name" required /></div>
                <div className="mb-3"><label className="form-label fw-medium text-muted small">Email Address</label><input type="email" className="form-control" placeholder="name@example.com" required /></div>
                <div className="mb-4"><label className="form-label fw-medium text-muted small">Phone Number / WhatsApp</label><input type="tel" className="form-control" placeholder="07XXXXXXXX" required /></div>
                <button type="submit" className="btn btn-theme-red w-100 py-2 fw-bold">Submit Registration</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;