import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import logoImg from '../../assets/images/logo.jpg'; 
import {
  validateName,
  validateEmail,
  validatePhone,
  validateDateOfBirth,
  validateAddress,
  validatePassword,
  validatePasswordMatch,
  validateSelect,
  validateStudentForm,
  hasErrors
} from '../../utils/validations';
import './Auth.css';

const Register = () => {
  const navigate = useNavigate();
  
  // Form data state
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', dateOfBirth: '', gender: '',
    email: '', phone: '', address: '', 
    parentName: '', parentPhone: '', 
    password: '', confirmPassword: ''
  });
  
  // Validation errors state
  const [errors, setErrors] = useState({});
  
  // Hint text state
  const [hints, setHints] = useState({});
  
  // Track which fields have been touched (for UX - only show errors for touched fields)
  const [touched, setTouched] = useState({});
  
  const [status, setStatus] = useState({ loading: false, error: '', success: '' });

  // Validate individual field and update errors and hints
  const validateField = (name, value) => {
    let error = '';
    let hint = '';
    
    switch (name) {
      case 'firstName':
      case 'lastName': {
        const result = validateName(value, name === 'firstName' ? 'First name' : 'Last name');
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
      case 'phone':
      case 'parentPhone': {
        const result = validatePhone(value);
        error = result.error;
        hint = result.hint;
        break;
      }
      case 'dateOfBirth': {
        const result = validateDateOfBirth(value, 16);
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
      case 'address': {
        const result = validateAddress(value);
        error = result.error;
        hint = result.hint;
        break;
      }
      case 'parentName': {
        const result = validateName(value, 'Parent/Guardian name');
        error = result.error;
        hint = result.hint;
        break;
      }
      case 'password': {
        const result = validatePassword(value);
        error = result.error;
        hint = result.hint;
        break;
      }
      case 'confirmPassword': {
        const result = validatePasswordMatch(formData.password, value);
        error = result.error;
        hint = result.hint;
        break;
      }
      default:
        break;
    }
    
    return { error, hint };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Update form data
    setFormData({ ...formData, [name]: value });
    
    // Validate field if it has been touched
    if (touched[name]) {
      const { error, hint } = validateField(name, value);
      setErrors({ ...errors, [name]: error });
      setHints({ ...hints, [name]: hint });
    }
  };

  // Mark field as touched when user leaves the field
  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    // Mark as touched
    setTouched({ ...touched, [name]: true });
    
    // Validate the field
    const { error, hint } = validateField(name, value);
    setErrors({ ...errors, [name]: error });
    setHints({ ...hints, [name]: hint });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: '', success: '' });

    // Mark all fields as touched to show all validation errors
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    // Run full form validation
    const validationErrors = validateStudentForm(formData);
    setErrors(validationErrors);

    // If there are errors, don't submit
    if (hasErrors(validationErrors)) {
      setStatus({ loading: false, error: 'Please fix the validation errors above', success: '' });
      return;
    }

    try {
      // Send the data to backend
      const response = await api.post('/auth/register/student', formData);
      
      if (response.data.success) {
        setStatus({ loading: false, error: '', success: response.data.message });
        // Clear the form
        setFormData({
          firstName: '', lastName: '', dateOfBirth: '', gender: '',
          email: '', phone: '', address: '', parentName: '', parentPhone: '', 
          password: '', confirmPassword: ''
        });
        setErrors({});
        setTouched({});
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.message || 'Failed to register. Please try again.';
      
      // Check if backend returned field-specific errors
      if (error.response?.data?.errors && typeof error.response.data.errors === 'object') {
        setErrors(error.response.data.errors);
      }
      
      setStatus({ 
        loading: false, 
        error: errorMessage, 
        success: '' 
      });
    }
  };

  // Helper function to get input class based on validation state
  const getInputClass = (fieldName) => {
    let className = 'form-control auth-input';
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

  // Render password strength checklist
  const renderPasswordChecklist = () => {
    if (!touched['password'] && !touched['confirmPassword']) {
      return null;
    }

    const password = formData.password;
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    const CheckItem = ({ met, label }) => (
      <div className="small mt-1">
        <span style={{ color: met ? '#28a745' : '#ccc', marginRight: '8px' }}>
          {met ? '✓' : '○'} {label}
        </span>
      </div>
    );

    return (
      <div className="password-checklist mt-2 p-2 bg-light rounded small">
        <div className="fw-bold mb-2">Password Requirements:</div>
        <CheckItem met={checks.length} label="At least 8 characters" />
        <CheckItem met={checks.uppercase} label="One uppercase letter (A-Z)" />
        <CheckItem met={checks.lowercase} label="One lowercase letter (a-z)" />
        <CheckItem met={checks.number} label="One number (0-9)" />
        <CheckItem met={checks.special} label="One special character (!@#$%^&*)" />
      </div>
    );
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
              <input 
                type="text" 
                name="firstName" 
                className={getInputClass('firstName')} 
                value={formData.firstName} 
                onChange={handleChange}
                onBlur={handleBlur}
                required 
              />
              {renderFieldGuidance('firstName')}
            </div>
            <div className="col-md-6 mb-3">
              <label className="auth-label">Last Name</label>
              <input 
                type="text" 
                name="lastName" 
                className={getInputClass('lastName')} 
                value={formData.lastName} 
                onChange={handleChange}
                onBlur={handleBlur}
                required 
              />
              {renderFieldGuidance('lastName')}
            </div>
            <div className="col-md-6 mb-3">
              <label className="auth-label">Date of Birth</label>
              <input 
                type="date" 
                name="dateOfBirth" 
                className={getInputClass('dateOfBirth')} 
                value={formData.dateOfBirth} 
                onChange={handleChange}
                onBlur={handleBlur}
                required 
              />
              {renderFieldGuidance('dateOfBirth')}
            </div>
            <div className="col-md-6 mb-3">
              <label className="auth-label">Gender</label>
              <select 
                name="gender" 
                className={getInputClass('gender')} 
                value={formData.gender} 
                onChange={handleChange}
                onBlur={handleBlur}
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

          {/* CONTACT INFO */}
          <h6 className="fw-bold text-muted mt-2 mb-3 border-bottom pb-2">Contact Details</h6>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="auth-label">Email Address</label>
              <input 
                type="email" 
                name="email" 
                className={getInputClass('email')} 
                value={formData.email} 
                onChange={handleChange}
                onBlur={handleBlur}
                required 
              />
              {renderFieldGuidance('email')}
            </div>
            <div className="col-md-6 mb-3">
              <label className="auth-label">Student Phone</label>
              <input 
                type="tel" 
                name="phone" 
                className={getInputClass('phone')} 
                value={formData.phone} 
                onChange={handleChange}
                onBlur={handleBlur}
                required 
              />
              {renderFieldGuidance('phone')}
            </div>
            <div className="col-md-12 mb-3">
              <label className="auth-label">Home Address</label>
              <input 
                type="text" 
                name="address" 
                className={getInputClass('address')} 
                value={formData.address} 
                onChange={handleChange}
                onBlur={handleBlur}
                required 
              />
              {renderFieldGuidance('address')}
            </div>
          </div>
            
          

          {/* PARENT INFO */}
          <h6 className="fw-bold text-muted mt-2 mb-3 border-bottom pb-2">Guardian / Parent Details</h6>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="auth-label">Parent/Guardian Name</label>
              <input 
                type="text" 
                name="parentName" 
                className={getInputClass('parentName')} 
                value={formData.parentName} 
                onChange={handleChange}
                onBlur={handleBlur}
                required 
              />
              {renderFieldGuidance('parentName')}
            </div>
            <div className="col-md-6 mb-3">
              <label className="auth-label">Emergency Phone</label>
              <input 
                type="tel" 
                name="parentPhone" 
                className={getInputClass('parentPhone')} 
                value={formData.parentPhone} 
                onChange={handleChange}
                onBlur={handleBlur}
                required 
              />
              {renderFieldGuidance('parentPhone')}
            </div>
          </div>

          {/* SECURITY */}
          <h6 className="fw-bold text-muted mt-2 mb-3 border-bottom pb-2">Account Security</h6>
          <div className="row">
            <div className="col-md-6 mb-4">
              <label className="auth-label">Password</label>
              <input 
                type="password" 
                name="password" 
                className={getInputClass('password')} 
                value={formData.password} 
                onChange={handleChange}
                onBlur={handleBlur}
                required 
              />
              {renderFieldGuidance('password')}
              {renderPasswordChecklist()}
            </div>
            <div className="col-md-6 mb-4">
              <label className="auth-label">Confirm Password</label>
              <input 
                type="password" 
                name="confirmPassword" 
                className={getInputClass('confirmPassword')} 
                value={formData.confirmPassword} 
                onChange={handleChange}
                onBlur={handleBlur}
                required 
              />
              {renderFieldGuidance('confirmPassword')}
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-theme-red w-100 py-2 fw-bold rounded-3 mb-3" 
            disabled={status.loading || hasErrors(errors)}
          >
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