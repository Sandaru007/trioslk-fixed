import { useState } from 'react';
import api from '../../services/api';
import {
  validateName,
  validateEmail,
  validatePhone,
  validateDateOfBirth,
  validateAddress,
  validateNIC,
  validateTextField,
  validateSelect,
  validateVolunteerForm,
  hasErrors
} from '../../utils/validations';
import './Volunteer.css';

const Volunteer = () => {
  // 1. Form data state
  const [formData, setFormData] = useState({
    fullName: '', nic: '', dateOfBirth: '', gender: '',
    email: '', primaryPhone: '', secondaryPhone: '', address: '',
    emergencyContactName: '', emergencyRelationship: '', emergencyPhone: '',
    primaryArea: '', availability: ''
  });

  // Validation errors state
  const [errors, setErrors] = useState({});
  
  // Hint text state
  const [hints, setHints] = useState({});
  
  // Track which fields have been touched
  const [touched, setTouched] = useState({});

  const [status, setStatus] = useState({ loading: false, error: null, success: false });

  // Validate individual field
  const validateField = (name, value) => {
    let error = '';
    let hint = '';
    
    switch (name) {
      case 'fullName': {
        const result = validateName(value, 'Full name');
        error = result.error;
        hint = result.hint;
        break;
      }
      case 'nic': {
        const result = validateNIC(value);
        error = result.error;
        hint = result.hint;
        break;
      }
      case 'dateOfBirth': {
        const result = validateDateOfBirth(value, 18);
        error = result.error;
        hint = result.hint;
        break;
      }
      case 'gender': {
        const result = validateSelect(value, 'gender');
        error = result.error;
        hint = result.hint;
        break;
      }
      case 'email': {
        const result = validateEmail(value);
        error = result.error;
        hint = result.hint;
        break;
      }
      case 'primaryPhone': {
        const result = validatePhone(value);
        error = result.error;
        hint = result.hint;
        break;
      }
      case 'secondaryPhone': {
        // Secondary phone is optional, but if provided must be valid
        const result = value ? validatePhone(value) : { error: '', hint: 'Optional - Sri Lankan format if provided' };
        error = result.error;
        hint = result.hint;
        break;
      }
      case 'address': {
        const result = validateAddress(value);
        error = result.error;
        hint = result.hint;
        break;
      }
      case 'emergencyContactName': {
        const result = validateName(value, 'Emergency contact name');
        error = result.error;
        hint = result.hint;
        break;
      }
      case 'emergencyRelationship': {
        const result = validateTextField(value, 'Relationship', 2, 50);
        error = result.error;
        hint = result.hint;
        break;
      }
      case 'emergencyPhone': {
        const result = validatePhone(value);
        error = result.error;
        hint = result.hint;
        break;
      }
      case 'primaryArea': {
        const result = validateSelect(value, 'primary area');
        error = result.error;
        hint = result.hint;
        break;
      }
      case 'availability': {
        const result = validateSelect(value, 'availability');
        error = result.error;
        hint = result.hint;
        break;
      }
      default:
        break;
    }
    
    return { error, hint };
  };

  // 2. Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Validate if field has been touched
    if (touched[name]) {
      const { error, hint } = validateField(name, value);
      setErrors({ ...errors, [name]: error });
      setHints({ ...hints, [name]: hint });
    }
  };

  // Handle blur event to mark field as touched and validate
  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    setTouched({ ...touched, [name]: true });
    
    const { error, hint } = validateField(name, value);
    setErrors({ ...errors, [name]: error });
    setHints({ ...hints, [name]: hint });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: null, success: false });

    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    // Run full form validation
    const validationErrors = validateVolunteerForm(formData);
    setErrors(validationErrors);

    // If there are errors, don't submit
    if (hasErrors(validationErrors)) {
      setStatus({ loading: false, error: 'Please fix the validation errors above', success: false });
      return;
    }

    try {
      // Use the shared api service instead of hardcoded URL
      const response = await api.post('/volunteers/register', formData);
      
      if (response.data.success) {
        setStatus({ loading: false, error: null, success: true });
        // Clear the form
        setFormData({
          fullName: '', nic: '', dateOfBirth: '', gender: '',
          email: '', primaryPhone: '', secondaryPhone: '', address: '',
          emergencyContactName: '', emergencyRelationship: '', emergencyPhone: '',
          primaryArea: '', availability: ''
        });
        setErrors({});
        setTouched({});
      }
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.message || 'Failed to submit application. Please try again.';
      
      // Check if backend returned field-specific errors
      if (error.response?.data?.errors && typeof error.response.data.errors === 'object') {
        setErrors(error.response.data.errors);
      }
      
      setStatus({ loading: false, error: errorMessage, success: false });
    }
  };

  // Helper to get input class based on validation state
  const getInputClass = (fieldName) => {
    let className = 'form-control';
    if (touched[fieldName]) {
      className += errors[fieldName] ? ' is-invalid' : ' is-valid';
    }
    return className;
  };

  // Helper to display error, hint, or success message
  const renderFieldGuidance = (fieldName) => {
    // Show error message if field is touched and has error
    if (touched[fieldName] && errors[fieldName]) {
      return <div className="invalid-feedback d-block small text-danger mt-1">✕ {errors[fieldName]}</div>;
    }
    
    // Show hint text if field is not touched and has hint
    if (!touched[fieldName] && hints[fieldName]) {
      return <div className="form-hint d-block small text-muted mt-1" style={{ fontStyle: 'italic' }}>💡 {hints[fieldName]}</div>;
    }
    
    // Show success message if field is touched and valid and has hint (ex: age hint)
    if (touched[fieldName] && !errors[fieldName] && hints[fieldName] && hints[fieldName].includes('✓')) {
      return <div className="form-success d-block small text-success mt-1">✓ {hints[fieldName]}</div>;
    }
    
    return null;
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
                    <input 
                      type="text" 
                      name="fullName" 
                      value={formData.fullName} 
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={getInputClass('fullName')}
                      required 
                    />
                    {renderFieldGuidance('fullName')}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">NIC Number</label>
                    <input 
                      type="text" 
                      name="nic" 
                      value={formData.nic} 
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={getInputClass('nic')}
                      required 
                    />
                    {renderFieldGuidance('nic')}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Date of Birth</label>
                    <input 
                      type="date" 
                      name="dateOfBirth" 
                      value={formData.dateOfBirth} 
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={getInputClass('dateOfBirth')}
                      required 
                    />
                    {renderFieldGuidance('dateOfBirth')}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Gender</label>
                    <select 
                      name="gender" 
                      value={formData.gender} 
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={getInputClass('gender')}
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    {renderFieldGuidance('gender')}
                  </div>
                </div>

                {/* 2. CONTACT INFORMATION */}
                <h4 className="form-section-title"><i className="bi bi-telephone me-2"></i>Contact Information</h4>
                <div className="row g-3 mb-5">
                  <div className="col-md-6">
                    <label className="form-label">Email Address</label>
                    <input 
                      type="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={getInputClass('email')}
                      required 
                    />
                    {renderFieldGuidance('email')}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Primary Phone Number</label>
                    <input 
                      type="tel" 
                      name="primaryPhone" 
                      value={formData.primaryPhone} 
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={getInputClass('primaryPhone')}
                      required 
                    />
                    {renderFieldGuidance('primaryPhone')}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Secondary / WhatsApp</label>
                    <input 
                      type="tel" 
                      name="secondaryPhone" 
                      value={formData.secondaryPhone} 
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={getInputClass('secondaryPhone')}
                    />
                    {renderFieldGuidance('secondaryPhone')}
                  </div>
                  <div className="col-md-12">
                    <label className="form-label">Physical Address</label>
                    <input 
                      type="text" 
                      name="address" 
                      value={formData.address} 
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={getInputClass('address')}
                      required 
                    />
                    {renderFieldGuidance('address')}
                  </div>
                </div>

                {/* 3. EMERGENCY CONTACT */}
                <h4 className="form-section-title"><i className="bi bi-heart-pulse me-2"></i>Emergency Contact</h4>
                <div className="row g-3 mb-5">
                  <div className="col-md-12">
                    <label className="form-label">Contact Name</label>
                    <input 
                      type="text" 
                      name="emergencyContactName" 
                      value={formData.emergencyContactName} 
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={getInputClass('emergencyContactName')}
                      required 
                    />
                    {renderFieldGuidance('emergencyContactName')}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Relationship</label>
                    <input 
                      type="text" 
                      name="emergencyRelationship" 
                      value={formData.emergencyRelationship} 
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={getInputClass('emergencyRelationship')}
                      required 
                    />
                    {renderFieldGuidance('emergencyRelationship')}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Emergency Phone Number</label>
                    <input 
                      type="tel" 
                      name="emergencyPhone" 
                      value={formData.emergencyPhone} 
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={getInputClass('emergencyPhone')}
                      required 
                    />
                    {renderFieldGuidance('emergencyPhone')}
                  </div>
                </div>

                {/* 4. PREFERENCES */}
                <h4 className="form-section-title"><i className="bi bi-star me-2"></i>Volunteer Preferences</h4>
                <div className="row g-3 mb-5">
                  <div className="col-md-6">
                    <label className="form-label">Primary Area of Interest</label>
                    <select 
                      name="primaryArea" 
                      value={formData.primaryArea} 
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={getInputClass('primaryArea')}
                      required
                    >
                      <option value="">Select an area</option>
                      <option value="event_management">Event Management</option>
                      <option value="photography_media">Photography & Media</option>
                      <option value="logistics">Logistics & Setup</option>
                      <option value="guest_relations">Guest Relations</option>
                    </select>
                    {renderFieldGuidance('primaryArea')}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Availability</label>
                    <select 
                      name="availability" 
                      value={formData.availability} 
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={getInputClass('availability')}
                      required
                    >
                      <option value="">Select availability</option>
                      <option value="weekdays">Weekdays Only</option>
                      <option value="weekends">Weekends Only</option>
                      <option value="both">Both</option>
                    </select>
                    {renderFieldGuidance('availability')}
                  </div>
                </div>

                <div className="text-center pt-3 border-top">
                  <button 
                    type="submit" 
                    className="btn btn-theme-red btn-lg rounded-pill px-5 fw-bold shadow-sm" 
                    disabled={status.loading || hasErrors(errors)}
                  >
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