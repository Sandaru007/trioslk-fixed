import React from 'react';
import { MapPin, Mail, Phone, Edit, Book, FileText, Award } from 'lucide-react';

// Ensure these image paths are correct for your project folder!
import profileImg from '../../assets/images/profile.png'; 
import coverImg from '../../assets/images/profileBg.png';

const Profile = () => {
  return (
    <div className="animate__animated animate__fadeIn">
      
      {/* ======================================= */}
      {/* Main Profile Header Card (Using lms-card) */}
      {/* ======================================= */}
      <div className="lms-card overflow-hidden mb-4 p-0 shadow-sm">
        
        {/* Cover Image Banner (Rounded top corners to match card) */}
        <div 
          style={{ 
            height: '180px', // Slightly taller cover
            backgroundImage: `url(${coverImg})`, 
            backgroundSize: 'cover', 
            backgroundPosition: 'center',
            backgroundColor: 'var(--lms-blue)', // Updated Fallback color to LMS Blue
            borderRadius: '20px 20px 0 0' // Match card rounding
          }}
        ></div>
        
        {/* Card Body - adjusted padding */}
        <div className="card-body p-4 position-relative text-center text-md-start d-flex flex-column flex-md-row align-items-center gap-4">
          
          {/* Avatar (Overlapping the banner) - Refined */}
          <div 
            className="rounded-circle overflow-hidden bg-white shadow-lg" 
            style={{ 
              width: '130px', // Slightly larger
              height: '130px', 
              marginTop: '-90px', // Deeper overlap
              border: '6px solid #fff', // Thicker border
              flexShrink: 0 
            }}
          >
            {/* If profileImg doesn't exist, this will gracefully break. You can swap with a placeholder later! */}
            <img src={profileImg} alt="Kavishka Shenal" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          
          {/* Basic Info */}
          <div className="flex-grow-1 mt-3 mt-md-0">
            <h3 className="fw-bold mb-1" style={{color: 'var(--text-main)'}}>Kavishka Shenal</h3>
            <p className="small fw-medium mb-2" style={{color: 'var(--text-muted)'}}>Student ID: SA24610455 • Higher Diploma in IT</p>
            {/* Standardized Location text color to muted */}
            <div className="d-flex align-items-center justify-content-center justify-content-md-start gap-2 small fw-medium" style={{color: 'var(--text-muted)'}}>
              <MapPin size={16} /> Bandaragama, Sri Lanka
            </div>
          </div>
          
          {/* Action Button - Updated to match LMS Blue */}
          <div className="mt-3 mt-md-0">
            <button className="btn btn-primary px-4 fw-medium shadow-sm d-flex align-items-center gap-2 rounded-pill">
              <Edit size={16} /> Edit Profile
            </button>
          </div>
        </div>
      </div>

      <div className="row g-4">
        
        {/* ======================================= */}
        {/* Left Column: Stats & Contact Info */}
        {/* ======================================= */}
        <div className="col-lg-8">
          
          {/* Quick Stats Row - Redesigned to be more consistent with the Diane UI look */}
          <div className="row g-3 mb-4">
            <div className="col-sm-4">
              {/* Card within card - using light blue background instead of light grey */}
              <div className="lms-card p-4 text-center h-100 rounded-3 shadow-none" style={{backgroundColor: 'var(--sidebar-active-bg)', border: '1px solid #d1e9ff'}}>
                <Book size={30} className="mx-auto mb-2" color="var(--lms-blue)" strokeWidth={1.5} />
                <h2 className="fw-bold mb-0" style={{color: 'var(--text-main)'}}>5</h2>
                <p className="small fw-medium mb-0" style={{color: 'var(--text-muted)'}}>Enrolled Courses</p>
              </div>
            </div>
            <div className="col-sm-4">
              <div className="lms-card p-4 text-center h-100 rounded-3 shadow-none" style={{backgroundColor: 'var(--sidebar-active-bg)', border: '1px solid #d1e9ff'}}>
                <FileText size={30} className="mx-auto mb-2" color="var(--lms-blue)" strokeWidth={1.5} />
                <h2 className="fw-bold mb-0" style={{color: 'var(--text-main)'}}>12</h2>
                <p className="small fw-medium mb-0" style={{color: 'var(--text-muted)'}}>Assignments</p>
              </div>
            </div>
            <div className="col-sm-4">
              <div className="lms-card p-4 text-center h-100 rounded-3 shadow-none" style={{backgroundColor: 'var(--sidebar-active-bg)', border: '1px solid #d1e9ff'}}>
                <Award size={30} className="mx-auto mb-2" color="var(--lms-blue)" strokeWidth={1.5} />
                <h2 className="fw-bold mb-0" style={{color: 'var(--text-main)'}}>3</h2>
                <p className="small fw-medium mb-0" style={{color: 'var(--text-muted)'}}>Certificates</p>
              </div>
            </div>
          </div>

          {/* Contact Details Card */}
          <div className="lms-card p-4 shadow-sm">
            <h5 className="fw-bold mb-4" style={{color: 'var(--text-main)'}}>Contact Information</h5>
            <div className="row g-4">
              {/* Email */}
              <div className="col-md-6 d-flex align-items-center gap-3">
                {/* Standardized circle background to very light blue */}
                <div className="p-3 rounded-circle" style={{backgroundColor: 'var(--sidebar-active-bg)', color: 'var(--lms-blue)'}}>
                  <Mail size={22} />
                </div>
                <div>
                  <small className="d-block fw-medium" style={{color: 'var(--text-muted)'}}>Email Address</small>
                  <span className="fw-bold text-dark">kavish.student@lms.edu</span>
                </div>
              </div>
              {/* Phone */}
              <div className="col-md-6 d-flex align-items-center gap-3">
                <div className="p-3 rounded-circle" style={{backgroundColor: 'var(--sidebar-active-bg)', color: 'var(--lms-blue)'}}>
                  <Phone size={22} />
                </div>
                <div>
                  <small className="d-block fw-medium" style={{color: 'var(--text-muted)'}}>Phone Number</small>
                  <span className="fw-bold text-dark">+94 75 667 0739</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ======================================= */}
        {/* Right Column: Skills & Interests */}
        {/* ======================================= */}
        <div className="col-lg-4">
          <div className="lms-card p-4 h-100 shadow-sm">
            <h5 className="fw-bold mb-4" style={{color: 'var(--text-main)'}}>Skills & Interests</h5>
            {/* Added gap between skills */}
            <div className="d-flex flex-wrap gap-2">
              {/* Refined Badge style: using light blue background with blue text */}
              <span className="badge rounded-pill px-3 py-2 fw-medium shadow-sm border-0" style={{backgroundColor: 'var(--sidebar-active-bg)', color: 'var(--lms-blue)'}}>Android Dev</span>
              <span className="badge rounded-pill px-3 py-2 fw-medium shadow-sm border-0" style={{backgroundColor: 'var(--sidebar-active-bg)', color: 'var(--lms-blue)'}}>R Programming</span>
              <span className="badge rounded-pill px-3 py-2 fw-medium shadow-sm border-0" style={{backgroundColor: 'var(--sidebar-active-bg)', color: 'var(--lms-blue)'}}>Photography</span>
              <span className="badge rounded-pill px-3 py-2 fw-medium shadow-sm border-0" style={{backgroundColor: 'var(--sidebar-active-bg)', color: 'var(--lms-blue)'}}>Music</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;