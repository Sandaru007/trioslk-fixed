import { useState } from 'react';
import axios from 'axios';
import './Volunteer.css';

const Volunteer = () => {
  // 1. Create state to hold all form data
  const [formData, setFormData] = useState({
    fullName: '', nic: '', dateOfBirth: '', gender: '',
    email: '', primaryPhone: '', secondaryPhone: '', address: '',
    emergencyContactName: '', emergencyRelationship: '', emergencyPhone: '',
    primaryArea: '', availability: ''
  });

  const [status, setStatus] = useState({ loading: false, error: null, success: false });

  // 2. Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: null, success: false });

    try {
      // Make sure your backend server is running on port 8000!
      const response = await axios.post('http://localhost:8000/api/volunteers/register', formData);
      
      if (response.data.success) {
        setStatus({ loading: false, error: null, success: true });
        // Clear the form
        setFormData({
          fullName: '', nic: '', dateOfBirth: '', gender: '',
          email: '', primaryPhone: '', secondaryPhone: '', address: '',
          emergencyContactName: '', emergencyRelationship: '', emergencyPhone: '',
          primaryArea: '', availability: ''
        });
      }
    } catch (error) {
      console.error(error);
      setStatus({ loading: false, error: 'Failed to submit application. Please try again.', success: false });
    }
  };

  return (
    <div className="bg-light pb-5 min-vh-100">
      <section className="volunteer-header" data-aos="fade-down">
        <div className="container">
          <h1 className="display-5 fw-bold mb-3">Empower Your Community</h1>
          <p className="lead text-light max-w-75 mx-auto mb-5">
            Join the TrioSLK Team. Gain real-world experience, build your network, and help us create unforgettable events.
          </p>
        </div>
      </section>

      <div className="container pb-5">
        <div className="row justify-content-center">
          <div className="col-lg-10" data-aos="fade-up" data-aos-delay="100">
            <div className="volunteer-form-wrapper shadow-lg border-0">
              
              {/* Success/Error Messages */}
              {status.success && <div className="alert alert-success fw-bold">Thank you! Your volunteer application has been successfully submitted.</div>}
              {status.error && <div className="alert alert-danger fw-bold">{status.error}</div>}

              <form onSubmit={handleSubmit}>
                
                {/* 1. PERSONAL INFORMATION */}
                <h4 className="form-section-title"><i className="bi bi-person-vcard me-2"></i>Personal Information</h4>
                <div className="row g-3 mb-5">
                  <div className="col-md-12">
                    <label className="form-label">Full Name</label>
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="form-control" required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">NIC Number</label>
                    <input type="text" name="nic" value={formData.nic} onChange={handleChange} className="form-control" required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Date of Birth</label>
                    <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="form-control" required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Gender</label>
                    <select name="gender" value={formData.gender} onChange={handleChange} className="form-select" required>
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                {/* 2. CONTACT INFORMATION */}
                <h4 className="form-section-title"><i className="bi bi-telephone me-2"></i>Contact Information</h4>
                <div className="row g-3 mb-5">
                  <div className="col-md-6">
                    <label className="form-label">Email Address</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-control" required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Primary Phone Number</label>
                    <input type="tel" name="primaryPhone" value={formData.primaryPhone} onChange={handleChange} className="form-control" required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Secondary / WhatsApp</label>
                    <input type="tel" name="secondaryPhone" value={formData.secondaryPhone} onChange={handleChange} className="form-control" />
                  </div>
                  <div className="col-md-12">
                    <label className="form-label">Physical Address</label>
                    <input type="text" name="address" value={formData.address} onChange={handleChange} className="form-control" required />
                  </div>
                </div>

                {/* 3. EMERGENCY CONTACT */}
                <h4 className="form-section-title"><i className="bi bi-heart-pulse me-2"></i>Emergency Contact</h4>
                <div className="row g-3 mb-5">
                  <div className="col-md-12">
                    <label className="form-label">Contact Name</label>
                    <input type="text" name="emergencyContactName" value={formData.emergencyContactName} onChange={handleChange} className="form-control" required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Relationship</label>
                    <input type="text" name="emergencyRelationship" value={formData.emergencyRelationship} onChange={handleChange} className="form-control" required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Emergency Phone Number</label>
                    <input type="tel" name="emergencyPhone" value={formData.emergencyPhone} onChange={handleChange} className="form-control" required />
                  </div>
                </div>

                {/* 4. PREFERENCES */}
                <h4 className="form-section-title"><i className="bi bi-star me-2"></i>Volunteer Preferences</h4>
                <div className="row g-3 mb-5">
                  <div className="col-md-6">
                    <label className="form-label">Primary Area of Interest</label>
                    <select name="primaryArea" value={formData.primaryArea} onChange={handleChange} className="form-select" required>
                      <option value="">Select an area</option>
                      <option value="event_management">Event Management</option>
                      <option value="photography_media">Photography & Media</option>
                      <option value="logistics">Logistics & Setup</option>
                      <option value="guest_relations">Guest Relations</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Availability</label>
                    <select name="availability" value={formData.availability} onChange={handleChange} className="form-select" required>
                      <option value="">Select availability</option>
                      <option value="weekdays">Weekdays Only</option>
                      <option value="weekends">Weekends Only</option>
                      <option value="both">Both</option>
                    </select>
                  </div>
                </div>

                <div className="text-center pt-3 border-top">
                  <button type="submit" className="btn btn-theme-red btn-lg rounded-pill px-5 fw-bold shadow-sm" disabled={status.loading}>
                    {status.loading ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Volunteer;