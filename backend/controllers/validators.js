/**
 * Backend Form Validation Utilities
 * Provides server-side validation functions for security and data integrity
 */

// Email validation using regex
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return { isValid: false, error: 'Email is required' };
  if (!emailRegex.test(email)) return { isValid: false, error: 'Invalid email format' };
  return { isValid: true, error: '' };
};

// Password validation - must meet security requirements
const validatePassword = (password) => {
  if (!password) return { isValid: false, error: 'Password is required' };
  if (password.length < 8) return { isValid: false, error: 'Password must be at least 8 characters' };
  if (!/[A-Z]/.test(password)) return { isValid: false, error: 'Password must contain uppercase letter' };
  if (!/[a-z]/.test(password)) return { isValid: false, error: 'Password must contain lowercase letter' };
  if (!/[0-9]/.test(password)) return { isValid: false, error: 'Password must contain number' };
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return { isValid: false, error: 'Password must contain special character' };
  return { isValid: true, error: '' };
};

// Phone validation - Sri Lankan format
const validatePhone = (phone) => {
  if (!phone) return { isValid: false, error: 'Phone number is required' };
  const phoneRegex = /^07\d{6,8}$/;
  if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
    return { isValid: false, error: 'Invalid phone format. Use Sri Lankan format: 07xxxxxx' };
  }
  return { isValid: true, error: '' };
};

// Date of birth validation with age requirement
const validateDateOfBirth = (dateString, minAge = 16) => {
  if (!dateString) return { isValid: false, error: 'Date of birth is required' };
  
  const dateOfBirth = new Date(dateString);
  const today = new Date();
  
  // Validate it's a valid date
  if (isNaN(dateOfBirth.getTime())) {
    return { isValid: false, error: 'Invalid date format' };
  }
  
  let age = today.getFullYear() - dateOfBirth.getFullYear();
  const monthDiff = today.getMonth() - dateOfBirth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
    age--;
  }
  
  if (age < minAge) {
    return { isValid: false, error: `User must be at least ${minAge} years old` };
  }
  if (age > 120) {
    return { isValid: false, error: 'Invalid date of birth' };
  }
  
  return { isValid: true, error: '' };
};

// NIC validation - Sri Lankan format
const validateNIC = (nic) => {
  if (!nic) return { isValid: false, error: 'NIC number is required' };
  
  nic = nic.replace(/\s/g, '').toUpperCase();
  
  // Old format: 9 digits + V
  const oldNICRegex = /^\d{9}V$/;
  // New format: 12 digits
  const newNICRegex = /^\d{12}$/;
  
  if (!oldNICRegex.test(nic) && !newNICRegex.test(nic)) {
    return { isValid: false, error: 'Invalid NIC format. Must be 9 digits + V or 12 digits' };
  }
  
  return { isValid: true, error: '' };
};

// Text field validation
const validateTextField = (value, fieldName, minLength = 2, maxLength = 100) => {
  if (!value || value.trim() === '') {
    return { isValid: false, error: `${fieldName} is required` };
  }
  if (value.trim().length < minLength) {
    return { isValid: false, error: `${fieldName} must be at least ${minLength} characters` };
  }
  if (value.trim().length > maxLength) {
    return { isValid: false, error: `${fieldName} must not exceed ${maxLength} characters` };
  }
  return { isValid: true, error: '' };
};

// Required field validation
const validateRequired = (value, fieldName) => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  return { isValid: true, error: '' };
};

// Full student registration validation
const validateStudentRegistration = (data) => {
  const errors = {};
  
  // Personal Details
  const firstNameVal = validateTextField(data.firstName, 'First name', 2, 50);
  if (!firstNameVal.isValid) errors.firstName = firstNameVal.error;
  
  const lastNameVal = validateTextField(data.lastName, 'Last name', 2, 50);
  if (!lastNameVal.isValid) errors.lastName = lastNameVal.error;
  
  const dobVal = validateDateOfBirth(data.dateOfBirth, 16);
  if (!dobVal.isValid) errors.dateOfBirth = dobVal.error;
  
  const genderVal = validateRequired(data.gender, 'Gender');
  if (!genderVal.isValid) errors.gender = genderVal.error;
  
  // Contact Details
  const emailVal = validateEmail(data.email);
  if (!emailVal.isValid) errors.email = emailVal.error;
  
  const phoneVal = validatePhone(data.phone);
  if (!phoneVal.isValid) errors.phone = phoneVal.error;
  
  const addressVal = validateTextField(data.address, 'Address', 5, 200);
  if (!addressVal.isValid) errors.address = addressVal.error;
  
  // Guardian Details
  const parentNameVal = validateTextField(data.parentName, 'Parent name', 2, 50);
  if (!parentNameVal.isValid) errors.parentName = parentNameVal.error;
  
  const parentPhoneVal = validatePhone(data.parentPhone);
  if (!parentPhoneVal.isValid) errors.parentPhone = parentPhoneVal.error;
  
  // Security
  const passwordVal = validatePassword(data.password);
  if (!passwordVal.isValid) errors.password = passwordVal.error;
  
  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }
  
  return errors;
};

// Full volunteer registration validation
const validateVolunteerRegistration = (data) => {
  const errors = {};
  
  // Personal Information
  const fullNameVal = validateTextField(data.fullName, 'Full name', 2, 50);
  if (!fullNameVal.isValid) errors.fullName = fullNameVal.error;
  
  const nicVal = validateNIC(data.nic);
  if (!nicVal.isValid) errors.nic = nicVal.error;
  
  const dobVal = validateDateOfBirth(data.dateOfBirth, 18);
  if (!dobVal.isValid) errors.dateOfBirth = dobVal.error;
  
  const genderVal = validateRequired(data.gender, 'Gender');
  if (!genderVal.isValid) errors.gender = genderVal.error;
  
  // Contact Information
  const emailVal = validateEmail(data.email);
  if (!emailVal.isValid) errors.email = emailVal.error;
  
  const primaryPhoneVal = validatePhone(data.primaryPhone);
  if (!primaryPhoneVal.isValid) errors.primaryPhone = primaryPhoneVal.error;
  
  if (data.secondaryPhone) {
    const secondaryPhoneVal = validatePhone(data.secondaryPhone);
    if (!secondaryPhoneVal.isValid) errors.secondaryPhone = secondaryPhoneVal.error;
  }
  
  const addressVal = validateTextField(data.address, 'Address', 5, 200);
  if (!addressVal.isValid) errors.address = addressVal.error;
  
  // Emergency Contact
  const emergencyNameVal = validateTextField(data.emergencyContactName, 'Emergency contact name', 2, 50);
  if (!emergencyNameVal.isValid) errors.emergencyContactName = emergencyNameVal.error;
  
  const relationshipVal = validateTextField(data.emergencyRelationship, 'Relationship', 2, 50);
  if (!relationshipVal.isValid) errors.emergencyRelationship = relationshipVal.error;
  
  const emergencyPhoneVal = validatePhone(data.emergencyPhone);
  if (!emergencyPhoneVal.isValid) errors.emergencyPhone = emergencyPhoneVal.error;
  
  // Preferences
  const primaryAreaVal = validateRequired(data.primaryArea, 'Primary area');
  if (!primaryAreaVal.isValid) errors.primaryArea = primaryAreaVal.error;
  
  const availabilityVal = validateRequired(data.availability, 'Availability');
  if (!availabilityVal.isValid) errors.availability = availabilityVal.error;

  
  
  return errors;
};

const validateLecturerRegistration = (data) => {
  const errors = {};

  const nameVal = validateTextField(data.fullName, 'Full name', 2, 100);
  if (!nameVal.isValid) errors.fullName = nameVal.error;

  const emailVal = validateEmail(data.email);
  if (!emailVal.isValid) errors.email = emailVal.error;

  const nicVal = validateNIC(data.nic);
  if (!nicVal.isValid) errors.nic = nicVal.error;

  const phoneVal = validatePhone(data.phone);
  if (!phoneVal.isValid) errors.phone = phoneVal.error;

  const addressVal = validateTextField(data.address, 'Address', 5, 250);
  if (!addressVal.isValid) errors.address = addressVal.error;

  return errors;
};

// Check if validation object has errors
const hasValidationErrors = (validationErrors) => {
  return Object.keys(validationErrors).length > 0;
};

module.exports = {
  validateEmail,
  validatePassword,
  validatePhone,
  validateDateOfBirth,
  validateNIC,
  validateTextField,
  validateRequired,
  validateStudentRegistration,
  validateVolunteerRegistration,
  validateLecturerRegistration,
  hasValidationErrors
};
