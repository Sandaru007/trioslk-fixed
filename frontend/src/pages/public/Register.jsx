import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import logoImg from '../../assets/images/logo.jpg'; 
import './Auth.css';

const Register = () => {
  const navigate = useNavigate();
  
  // 1. State now includes all the fields we added to the MongoDB model
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', dateOfBirth: '', gender: '',
    email: '', phone: '', address: '', 
    parentName: '', parentPhone: '', 
    password: '', confirmPassword: ''
  });
  
  const [status, setStatus] = useState({ loading: false, error: '', success: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: '', success: '' });

    // Basic Validation
    if (formData.password !== formData.confirmPassword) {
      setStatus({ loading: false, error: 'Passwords do not match.', success: '' });
      return;
    }

    try {
      // 2. Send the data to our new backend route
      const response = await api.post('/auth/login', formData);
      
      if (response.data.success) {
        setStatus({ loading: false, error: '', success: response.data.message });
        // Clear the form
        setFormData({
          firstName: '', lastName: '', dateOfBirth: '', gender: '',
          email: '', phone: '', address: '', parentName: '', parentPhone: '', 
          password: '', confirmPassword: ''
        });
        
        // Optional: Automatically redirect them to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (error) {
      console.error(error);
      setStatus({ 
        loading: false, 
        error: error.response?.data?.message || 'Failed to register. Please try again.', 
        success: '' 
      });
    }
  };

  return (
    <div className="auth-page py-5">
      <div className="auth-card" style={{ maxWidth: '650px' }} data-aos="zoom-in" data-aos-duration="600">
        
        <div className="auth-logo mb-4">
          <img src={logoImg} alt="TrioSLK Logo" style={{ maxWidth: '150px', marginBottom: '10px' }} />
          <h4 className="fw-bold mb-1">Student Registration</h4>
          <p className="text-muted small mb-0">Create your TrioSLK LMS account</p>
        </div>

        {status.error && <div className="alert alert-danger py-2 text-center fw-medium small">{status.error}</div>}
        {status.success && <div className="alert alert-success py-2 text-center fw-medium small">{status.success}</div>}

        <form onSubmit={handleSubmit}>
          
          {/* PERSONAL INFO */}
          <h6 className="fw-bold text-muted mb-3 border-bottom pb-2">Personal Details</h6>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="auth-label">First Name</label>
              <input type="text" name="firstName" className="form-control auth-input" placeholder="John" value={formData.firstName} onChange={handleChange} required />
            </div>
            <div className="col-md-6 mb-3">
              <label className="auth-label">Last Name</label>
              <input type="text" name="lastName" className="form-control auth-input" placeholder="Doe" value={formData.lastName} onChange={handleChange} required />
            </div>
            <div className="col-md-6 mb-3">
              <label className="auth-label">Date of Birth</label>
              <input type="date" name="dateOfBirth" className="form-control auth-input" value={formData.dateOfBirth} onChange={handleChange} required />
            </div>
            <div className="col-md-6 mb-3">
              <label className="auth-label">Gender</label>
              <select name="gender" className="form-select auth-input" value={formData.gender} onChange={handleChange} required>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* CONTACT INFO */}
          <h6 className="fw-bold text-muted mt-2 mb-3 border-bottom pb-2">Contact Details</h6>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="auth-label">Email Address</label>
              <input type="email" name="email" className="form-control auth-input" placeholder="student@example.com" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="col-md-6 mb-3">
              <label className="auth-label">Student Phone</label>
              <input type="tel" name="phone" className="form-control auth-input" placeholder="07XXXXXXXX" value={formData.phone} onChange={handleChange} required />
            </div>
            <div className="col-md-12 mb-3">
              <label className="auth-label">Home Address</label>
              <input type="text" name="address" className="form-control auth-input" placeholder="No, Street, City" value={formData.address} onChange={handleChange} required />
            </div>
          </div>

          {/* PARENT INFO */}
          <h6 className="fw-bold text-muted mt-2 mb-3 border-bottom pb-2">Guardian / Parent Details</h6>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="auth-label">Parent/Guardian Name</label>
              <input type="text" name="parentName" className="form-control auth-input" placeholder="Jane Doe" value={formData.parentName} onChange={handleChange} required />
            </div>
            <div className="col-md-6 mb-3">
              <label className="auth-label">Emergency Phone</label>
              <input type="tel" name="parentPhone" className="form-control auth-input" placeholder="07XXXXXXXX" value={formData.parentPhone} onChange={handleChange} required />
            </div>
          </div>

          {/* SECURITY */}
          <h6 className="fw-bold text-muted mt-2 mb-3 border-bottom pb-2">Account Security</h6>
          <div className="row">
            <div className="col-md-6 mb-4">
              <label className="auth-label">Password</label>
              <input type="password" name="password" className="form-control auth-input" placeholder="Create a password" value={formData.password} onChange={handleChange} required minLength="6" />
            </div>
            <div className="col-md-6 mb-4">
              <label className="auth-label">Confirm Password</label>
              <input type="password" name="confirmPassword" className="form-control auth-input" placeholder="Confirm password" value={formData.confirmPassword} onChange={handleChange} required />
            </div>
          </div>

          <button type="submit" className="btn btn-theme-red w-100 py-2 fw-bold rounded-3 mb-3" disabled={status.loading}>
            {status.loading ? 'Creating Account & Sending Email...' : 'Register Student Account'}
          </button>
        </form>

        <div className="text-center mt-3 pt-3 border-top">
          <p className="text-muted small mb-0">
            Already have an account? <Link to="/login" className="fw-bold text-dark text-decoration-none">Sign In here</Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Register;