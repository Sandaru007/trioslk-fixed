/**
 * Frontend Form Validation Utilities
 * Provides reusable validation functions for student and volunteer registration forms
 */

// Email validation using standard regex pattern
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return { isValid: false, error: 'Email is required', hint: 'example@domain.com' };
  if (!emailRegex.test(email)) return { isValid: false, error: 'Invalid email format', hint: 'example@domain.com' };
  return { isValid: true, error: '', hint: 'example@domain.com' };
};

// Password strength validation
// Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
export const validatePassword = (password) => {
  const hint = 'Min 8 chars • 1 uppercase • 1 lowercase • 1 number • 1 special char';
  if (!password) return { isValid: false, error: 'Password is required', hint };
  if (password.length < 8) return { isValid: false, error: 'Password must be at least 8 characters', hint };
  if (!/[A-Z]/.test(password)) return { isValid: false, error: 'Must contain uppercase letter', hint };
  if (!/[a-z]/.test(password)) return { isValid: false, error: 'Must contain lowercase letter', hint };
  if (!/[0-9]/.test(password)) return { isValid: false, error: 'Must contain a number', hint };
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return { isValid: false, error: 'Must contain special character (!@#$%^&*)', hint };
  return { isValid: true, error: '', hint };
};

// Confirm password matching
export const validatePasswordMatch = (password, confirmPassword) => {
  if (!confirmPassword) return { isValid: false, error: 'Please confirm your password', hint: '' };
  if (password !== confirmPassword) return { isValid: false, error: 'Passwords do not match', hint: '' };
  return { isValid: true, error: '', hint: '' };
};

// Phone validation - Sri Lankan format: 07xxxxxx (6-8 digits after 07)
export const validatePhone = (phone) => {
  const hint = 'Format: 07xxxxxx (Sri Lankan)';
  if (!phone) return { isValid: false, error: 'Phone number is required', hint };
  const phoneRegex = /^07\d{6,8}$/;
  if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
    return { isValid: false, error: 'Invalid phone format', hint };
  }
  return { isValid: true, error: '', hint };
};

// Date of birth validation with age requirement
export const validateDateOfBirth = (dateOfBirthString, minAge = 16) => {
  const hint = minAge === 16 ? 'Must be at least 16 years old' : 'Must be at least 18 years old';
  if (!dateOfBirthString) return { isValid: false, error: 'Date of birth is required', hint };
  
  const dateOfBirth = new Date(dateOfBirthString);
  const today = new Date();
  let age = today.getFullYear() - dateOfBirth.getFullYear();
  const monthDiff = today.getMonth() - dateOfBirth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
    age--;
  }
  
  if (age < minAge) {
    return { isValid: false, error: `You must be at least ${minAge} years old`, hint };
  }
  if (age > 120) {
    return { isValid: false, error: 'Please enter a valid date of birth', hint };
  }
  
  return { isValid: true, error: '', hint: `Age: ${age} years ✓` };
};

// NIC validation - Sri Lankan format
// Format: 9 digits + V (old format) or 12 digits (new format)
export const validateNIC = (nic) => {
  const hint = 'Format: 9 digits + V (e.g., 123456789V) or 12 digits';
  if (!nic) return { isValid: false, error: 'NIC number is required', hint };
  
  nic = nic.replace(/\s/g, '').toUpperCase();
  
  // Old format: 9 digits + V
  const oldNICRegex = /^\d{9}V$/;
  // New format: 12 digits
  const newNICRegex = /^\d{12}$/;
  
  if (!oldNICRegex.test(nic) && !newNICRegex.test(nic)) {
    return { isValid: false, error: 'NIC is not valid', hint };
  }
  
  return { isValid: true, error: '', hint };
};

// Text field validation - check for required and length limits
export const validateTextField = (value, fieldName, minLength = 2, maxLength = 100) => {
  const hint = `Minimum ${minLength} characters`;
  if (!value || value.trim() === '') {
    return { isValid: false, error: `${fieldName} is required`, hint };
  }
  if (value.trim().length < minLength) {
    return { isValid: false, error: `${fieldName} must be at least ${minLength} characters`, hint };
  }
  if (value.trim().length > maxLength) {
    return { isValid: false, error: `${fieldName} must not exceed ${maxLength} characters`, hint };
  }
  return { isValid: true, error: '', hint };
};

// Address validation
export const validateAddress = (address) => {
  const hint = 'Minimum 5 characters';
  if (!address || address.trim() === '') {
    return { isValid: false, error: 'Address is required', hint };
  }
  if (address.trim().length < 5) {
    return { isValid: false, error: 'Address must be at least 5 characters', hint };
  }
  if (address.trim().length > 200) {
    return { isValid: false, error: 'Address must not exceed 200 characters', hint };
  }
  return { isValid: true, error: '', hint };
};

// Validate name field
export const validateName = (name, fieldName = 'Name') => {
  const hint = 'Minimum 2 characters';
  if (!name || name.trim() === '') {
    return { isValid: false, error: `${fieldName} is required`, hint };
  }
  if (name.trim().length < 2) {
    return { isValid: false, error: `${fieldName} must be at least 2 characters`, hint };
  }
  if (name.trim().length > 50) {
    return { isValid: false, error: `${fieldName} must not exceed 50 characters`, hint };
  }
  return { isValid: true, error: '', hint };
};

// Generic required field validation
export const validateRequired = (value, fieldName) => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return { isValid: false, error: `${fieldName} is required`, hint: '' };
  }
  return { isValid: true, error: '', hint: '' };
};

// Validate select dropdown
export const validateSelect = (value, fieldName) => {
  if (!value || value === '') {
    return { isValid: false, error: `Please select a ${fieldName}`, hint: '' };
  }
  return { isValid: true, error: '', hint: '' };
};

// Validate entire student registration form
export const validateStudentForm = (formData) => {
  const errors = {};
  
  // Personal Details
  const firstNameValidation = validateName(formData.firstName, 'First name');
  if (!firstNameValidation.isValid) errors.firstName = firstNameValidation.error;
  
  const lastNameValidation = validateName(formData.lastName, 'Last name');
  if (!lastNameValidation.isValid) errors.lastName = lastNameValidation.error;
  
  const dobValidation = validateDateOfBirth(formData.dateOfBirth, 16);
  if (!dobValidation.isValid) errors.dateOfBirth = dobValidation.error;
  
  const genderValidation = validateSelect(formData.gender, 'gender');
  if (!genderValidation.isValid) errors.gender = genderValidation.error;
  
  // Contact Details
  const emailValidation = validateEmail(formData.email);
  if (!emailValidation.isValid) errors.email = emailValidation.error;
  
  const phoneValidation = validatePhone(formData.phone);
  if (!phoneValidation.isValid) errors.phone = phoneValidation.error;
  
  const addressValidation = validateAddress(formData.address);
  if (!addressValidation.isValid) errors.address = addressValidation.error;
  
  // Guardian Details
  const parentNameValidation = validateName(formData.parentName, 'Parent/Guardian name');
  if (!parentNameValidation.isValid) errors.parentName = parentNameValidation.error;
  
  const parentPhoneValidation = validatePhone(formData.parentPhone);
  if (!parentPhoneValidation.isValid) errors.parentPhone = parentPhoneValidation.error;
  
  // Security
  const passwordValidation = validatePassword(formData.password);
  if (!passwordValidation.isValid) errors.password = passwordValidation.error;
  
  const passwordMatchValidation = validatePasswordMatch(formData.password, formData.confirmPassword);
  if (!passwordMatchValidation.isValid) errors.confirmPassword = passwordMatchValidation.error;
  
  return errors;
};

// Validate entire volunteer registration form
export const validateVolunteerForm = (formData) => {
  const errors = {};
  
  // Personal Information
  const fullNameValidation = validateName(formData.fullName, 'Full name');
  if (!fullNameValidation.isValid) errors.fullName = fullNameValidation.error;
  
  const nicValidation = validateNIC(formData.nic);
  if (!nicValidation.isValid) errors.nic = nicValidation.error;
  
  const dobValidation = validateDateOfBirth(formData.dateOfBirth, 18);
  if (!dobValidation.isValid) errors.dateOfBirth = dobValidation.error;
  
  const genderValidation = validateSelect(formData.gender, 'gender');
  if (!genderValidation.isValid) errors.gender = genderValidation.error;
  
  // Contact Information
  const emailValidation = validateEmail(formData.email);
  if (!emailValidation.isValid) errors.email = emailValidation.error;
  
  const primaryPhoneValidation = validatePhone(formData.primaryPhone);
  if (!primaryPhoneValidation.isValid) errors.primaryPhone = primaryPhoneValidation.error;
  
  if (formData.secondaryPhone) {
    const secondaryPhoneValidation = validatePhone(formData.secondaryPhone);
    if (!secondaryPhoneValidation.isValid) errors.secondaryPhone = secondaryPhoneValidation.error;
  }
  
  const addressValidation = validateAddress(formData.address);
  if (!addressValidation.isValid) errors.address = addressValidation.error;
  
  // Emergency Contact
  const emergencyContactValidation = validateName(formData.emergencyContactName, 'Emergency contact name');
  if (!emergencyContactValidation.isValid) errors.emergencyContactName = emergencyContactValidation.error;
  
  const relationshipValidation = validateTextField(formData.emergencyRelationship, 'Relationship', 2, 50);
  if (!relationshipValidation.isValid) errors.emergencyRelationship = relationshipValidation.error;
  
  const emergencyPhoneValidation = validatePhone(formData.emergencyPhone);
  if (!emergencyPhoneValidation.isValid) errors.emergencyPhone = emergencyPhoneValidation.error;
  
  // Preferences
  const primaryAreaValidation = validateSelect(formData.primaryArea, 'primary area');
  if (!primaryAreaValidation.isValid) errors.primaryArea = primaryAreaValidation.error;
  
  const availabilityValidation = validateSelect(formData.availability, 'availability');
  if (!availabilityValidation.isValid) errors.availability = availabilityValidation.error;
  
  return errors;
};

// Utility to check if object has any errors
export const hasErrors = (errorsObject) => {
  return Object.values(errorsObject).some(error => error && error.trim() !== '');
};
