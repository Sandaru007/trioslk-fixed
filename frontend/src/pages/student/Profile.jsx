import React, { useState, useEffect } from 'react';
import { MapPin, Mail, Phone, Edit, Book, FileText, Award, X } from 'lucide-react';
import api from '../../services/api';

import profileImgPlaceholder from '../../assets/images/profile.png'; 
import coverImg from '../../assets/images/profileBg.png';

const Profile = () => {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: ''
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  // Safely parse user info from localStorage
  const getUserInfo = () => {
    try {
      const raw = sessionStorage.getItem('trioslk_userInfo');
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  };

  const userInfo = getUserInfo();

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      
      if (!userInfo || !userInfo._id) {
        setErrorMsg('No user session found. Please log in again.');
        setLoading(false);
        return;
      }

      const { data } = await api.get(`/students/${userInfo._id}`);
      setStudentData(data);
      setFormData({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        phone: data.phone || '',
        address: data.address || ''
      });
    } catch (error) {
      console.error("Error fetching profile", error);
      if (error.response?.status === 404) {
        setErrorMsg('Student profile not found in the database. Your account may have been removed.');
      } else {
        setErrorMsg(error.response?.data?.message || error.message || 'Failed to load profile. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    if (e.target.files[0]) {
      setPhotoFile(e.target.files[0]);
      setPhotoPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('firstName', formData.firstName);
      data.append('lastName', formData.lastName);
      data.append('phone', formData.phone);
      data.append('address', formData.address);
      if (photoFile) {
        data.append('profilePhoto', photoFile);
      }

      await api.put(`/students/${userInfo._id}/profile`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      alert('Profile updated successfully!');
      const updatedStudentResponse = await api.get(`/students/${userInfo._id}`);
      const updatedStudent = updatedStudentResponse.data;
      
      const updatedUserInfo = {
        ...userInfo,
        name: `${updatedStudent.firstName} ${updatedStudent.lastName}`,
        profilePhoto: updatedStudent.profilePhoto
      };
      sessionStorage.setItem('trioslk_userInfo', JSON.stringify(updatedUserInfo));

      setIsEditing(false);
      setPhotoFile(null);
      setPhotoPreview(null);
      fetchProfile();
      
      // Dispatch a custom event so Dashboard_Lms can pick up the change
      window.dispatchEvent(new Event('profileUpdated'));
    } catch (error) {
      console.error("Error updating profile", error);
      alert('Failed to update profile');
    }
  };

  if (loading) return <div className="text-center p-5">Loading Profile...</div>;
  if (errorMsg) return <div className="text-center p-5 text-danger">Error fetching profile: {errorMsg}</div>;
  if (!studentData) return <div className="text-center p-5">Profile not found.</div>;

  const resolveImageUrl = (url) => {
    if (!url) return profileImgPlaceholder;
    if (url.startsWith('http')) return url;
    
    // Robustly handle absolute paths containing 'uploads'
    if (url.includes('\\uploads\\')) {
      return `http://localhost:8000/uploads/${url.split('\\uploads\\').pop()}`;
    }
    if (url.includes('/uploads/')) {
      return `http://localhost:8000/uploads/${url.split('/uploads/').pop()}`;
    }
    
    return `http://localhost:8000${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const displayImage = resolveImageUrl(studentData.profilePhoto);

  return (
    <div className="animate__animated animate__fadeIn position-relative">
      
      <div className="lms-card overflow-hidden mb-4 p-0 shadow-sm">
        <div 
          style={{ 
            height: '180px', 
            backgroundImage: `url(${coverImg})`, 
            backgroundSize: 'cover', 
            backgroundPosition: 'center',
            backgroundColor: 'var(--lms-blue)',
            borderRadius: '20px 20px 0 0'
          }}
        ></div>
        
        <div className="card-body p-4 position-relative text-center text-md-start d-flex flex-column flex-md-row align-items-center gap-4">
          
          <div 
            className="rounded-circle overflow-hidden bg-white shadow-lg" 
            style={{ 
              width: '130px', 
              height: '130px', 
              marginTop: '-90px', 
              border: '6px solid #fff', 
              flexShrink: 0 
            }}
          >
            <img src={displayImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          
          <div className="flex-grow-1 mt-3 mt-md-0">
            <h3 className="fw-bold mb-1" style={{color: 'var(--text-main)'}}>{studentData.firstName} {studentData.lastName}</h3>
            <p className="small fw-medium mb-2" style={{color: 'var(--text-muted)'}}>Student ID: {studentData.studentId} • {studentData.role.charAt(0).toUpperCase() + studentData.role.slice(1)}</p>
            <div className="d-flex align-items-center justify-content-center justify-content-md-start gap-2 small fw-medium" style={{color: 'var(--text-muted)'}}>
              <MapPin size={16} /> {studentData.address}
            </div>
          </div>
          
          <div className="mt-3 mt-md-0">
            <button 
              className="btn btn-primary px-4 fw-medium shadow-sm d-flex align-items-center gap-2 rounded-pill"
              onClick={() => setIsEditing(true)}
            >
              <Edit size={16} /> Edit Profile
            </button>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          
          <div className="row g-3 mb-4">
            <div className="col-sm-4">
              <div className="lms-card p-4 text-center h-100 rounded-3 shadow-none" style={{backgroundColor: 'var(--sidebar-active-bg)', border: '1px solid #d1e9ff'}}>
                <Book size={30} className="mx-auto mb-2" color="var(--lms-blue)" strokeWidth={1.5} />
                <h2 className="fw-bold mb-0" style={{color: 'var(--text-main)'}}>0</h2>
                <p className="small fw-medium mb-0" style={{color: 'var(--text-muted)'}}>Enrolled Courses</p>
              </div>
            </div>
            <div className="col-sm-4">
              <div className="lms-card p-4 text-center h-100 rounded-3 shadow-none" style={{backgroundColor: 'var(--sidebar-active-bg)', border: '1px solid #d1e9ff'}}>
                <FileText size={30} className="mx-auto mb-2" color="var(--lms-blue)" strokeWidth={1.5} />
                <h2 className="fw-bold mb-0" style={{color: 'var(--text-main)'}}>0</h2>
                <p className="small fw-medium mb-0" style={{color: 'var(--text-muted)'}}>Assignments</p>
              </div>
            </div>
            <div className="col-sm-4">
              <div className="lms-card p-4 text-center h-100 rounded-3 shadow-none" style={{backgroundColor: 'var(--sidebar-active-bg)', border: '1px solid #d1e9ff'}}>
                <Award size={30} className="mx-auto mb-2" color="var(--lms-blue)" strokeWidth={1.5} />
                <h2 className="fw-bold mb-0" style={{color: 'var(--text-main)'}}>0</h2>
                <p className="small fw-medium mb-0" style={{color: 'var(--text-muted)'}}>Certificates</p>
              </div>
            </div>
          </div>

          <div className="lms-card p-4 shadow-sm">
            <h5 className="fw-bold mb-4" style={{color: 'var(--text-main)'}}>Contact Information</h5>
            <div className="row g-4">
              <div className="col-md-6 d-flex align-items-center gap-3">
                <div className="p-3 rounded-circle" style={{backgroundColor: 'var(--sidebar-active-bg)', color: 'var(--lms-blue)'}}>
                  <Mail size={22} />
                </div>
                <div>
                  <small className="d-block fw-medium" style={{color: 'var(--text-muted)'}}>Email Address</small>
                  <span className="fw-bold text-dark">{studentData.email}</span>
                </div>
              </div>
              <div className="col-md-6 d-flex align-items-center gap-3">
                <div className="p-3 rounded-circle" style={{backgroundColor: 'var(--sidebar-active-bg)', color: 'var(--lms-blue)'}}>
                  <Phone size={22} />
                </div>
                <div>
                  <small className="d-block fw-medium" style={{color: 'var(--text-muted)'}}>Phone Number</small>
                  <span className="fw-bold text-dark">{studentData.phone}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="lms-card p-4 h-100 shadow-sm">
            <h5 className="fw-bold mb-4" style={{color: 'var(--text-main)'}}>Skills & Interests</h5>
            <div className="d-flex flex-wrap gap-2">
              <span className="badge rounded-pill px-3 py-2 fw-medium shadow-sm border-0" style={{backgroundColor: 'var(--sidebar-active-bg)', color: 'var(--lms-blue)'}}>Technology</span>
              <span className="badge rounded-pill px-3 py-2 fw-medium shadow-sm border-0" style={{backgroundColor: 'var(--sidebar-active-bg)', color: 'var(--lms-blue)'}}>Continuous Learning</span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="modal-backdrop fade show" style={{ zIndex: 1040 }}></div>
      )}
      {isEditing && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ zIndex: 1050, background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '20px' }}>
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">Edit Profile</h5>
                <button type="button" className="btn-close" onClick={() => setIsEditing(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="text-center mb-4">
                    <div className="position-relative d-inline-block">
                      <img 
                        src={photoPreview || displayImage} 
                        alt="Preview" 
                        className="rounded-circle shadow-sm"
                        style={{ width: '100px', height: '100px', objectFit: 'cover', border: '3px solid #f4f7fe' }}
                      />
                      <label 
                        htmlFor="photoUpload" 
                        className="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle p-2 cursor-pointer shadow-sm"
                        style={{ cursor: 'pointer' }}
                      >
                        <Edit size={14} />
                      </label>
                      <input 
                        type="file" 
                        id="photoUpload" 
                        accept="image/*" 
                        className="d-none" 
                        onChange={handlePhotoChange} 
                      />
                    </div>
                  </div>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">First Name</label>
                      <input type="text" className="form-control rounded-3" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Last Name</label>
                      <input type="text" className="form-control rounded-3" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-bold">Phone Number</label>
                      <input type="text" className="form-control rounded-3" name="phone" value={formData.phone} onChange={handleInputChange} required />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-bold">Address</label>
                      <input type="text" className="form-control rounded-3" name="address" value={formData.address} onChange={handleInputChange} required />
                    </div>
                  </div>

                  <div className="mt-4 d-flex gap-2 justify-content-end">
                    <button type="button" className="btn btn-light rounded-pill px-4 fw-medium" onClick={() => setIsEditing(false)}>Cancel</button>
                    <button type="submit" className="btn btn-primary rounded-pill px-4 fw-medium">Save Changes</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Profile;