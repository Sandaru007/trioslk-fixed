import React from 'react';
import { MapPin, Mail, Phone, Edit, Book, FileText, Award } from 'lucide-react';

// Ensure these image paths are correct for your project folder!
import profileImg from '../../assets/images/profile.png'; 
import coverImg from '../../assets/images/profileBg.png';

const Profile = () => {
  return (
    <div className="animate__animated animate__fadeIn">
      
      {/* Main Profile Header Card */}
      <div className="card border-0 shadow-sm modern-card overflow-hidden mb-4">
        
        {/* Cover Image Banner */}
        <div 
          style={{ 
            height: '160px', 
            backgroundImage: `url(${coverImg})`, 
            backgroundSize: 'cover', 
            backgroundPosition: 'center',
            backgroundColor: 'var(--trioslk-maroon, #7a1b29)' // Fallback color
          }}
        ></div>
        
        <div className="card-body p-4 position-relative text-center text-md-start d-flex flex-column flex-md-row align-items-center gap-4">
          
          {/* Avatar (Overlapping the banner) */}
          <div 
            className="rounded-circle overflow-hidden bg-white shadow-sm" 
            style={{ 
              width: '120px', 
              height: '120px', 
              marginTop: '-80px', 
              border: '4px solid #fff',
              flexShrink: 0 
            }}
          >
            {/* If profileImg doesn't exist, this will gracefully break. You can swap with a placeholder later! */}
            <img src={profileImg} alt="Kavishka Shenal" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          
          {/* Basic Info */}
          <div className="flex-grow-1 mt-3 mt-md-0">
            <h3 className="fw-bold mb-1">Kavishka Shenal</h3>
            <p className="text-muted fw-medium mb-2">Student ID: SA24610455 • Higher Diploma in IT</p>
            <div className="d-flex align-items-center justify-content-center justify-content-md-start gap-2 text-muted small fw-medium">
              <MapPin size={16} className="text-danger" /> Bandaragama, Sri Lanka
            </div>
          </div>
          
          {/* Action Button */}
          <div className="mt-3 mt-md-0">
            <button className="btn btn-theme-red px-4 fw-medium shadow-sm d-flex align-items-center gap-2">
              <Edit size={16} /> Edit Profile
            </button>
          </div>
        </div>
      </div>

      <div className="row g-4">
        
        {/* Left Column: Stats & Contact Info */}
        <div className="col-lg-8">
          
          {/* Quick Stats Row */}
          <div className="row g-3 mb-4">
            <div className="col-sm-4">
              <div className="card border-0 bg-light p-3 text-center h-100 rounded-3">
                <Book size={24} className="text-danger mx-auto mb-2" />
                <h3 className="fw-bold mb-0">5</h3>
                <p className="text-muted small fw-medium mb-0">Enrolled Courses</p>
              </div>
            </div>
            <div className="col-sm-4">
              <div className="card border-0 bg-light p-3 text-center h-100 rounded-3">
                <FileText size={24} className="text-danger mx-auto mb-2" />
                <h3 className="fw-bold mb-0">12</h3>
                <p className="text-muted small fw-medium mb-0">Assignments</p>
              </div>
            </div>
            <div className="col-sm-4">
              <div className="card border-0 bg-light p-3 text-center h-100 rounded-3">
                <Award size={24} className="text-danger mx-auto mb-2" />
                <h3 className="fw-bold mb-0">3</h3>
                <p className="text-muted small fw-medium mb-0">Certificates</p>
              </div>
            </div>
          </div>

          {/* Contact Details Card */}
          <div className="card border-0 shadow-sm modern-card p-4">
            <h5 className="fw-bold mb-4">Contact Information</h5>
            <div className="row g-4">
              <div className="col-md-6 d-flex align-items-center gap-3">
                <div className="bg-light p-3 rounded-circle text-danger">
                  <Mail size={20} />
                </div>
                <div>
                  <small className="text-muted d-block fw-medium">Email Address</small>
                  <span className="fw-bold text-dark">kavish.student@lms.edu</span>
                </div>
              </div>
              <div className="col-md-6 d-flex align-items-center gap-3">
                <div className="bg-light p-3 rounded-circle text-danger">
                  <Phone size={20} />
                </div>
                <div>
                  <small className="text-muted d-block fw-medium">Phone Number</small>
                  <span className="fw-bold text-dark">+94 75 667 0739</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Skills & Interests */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm modern-card p-4 h-100">
            <h5 className="fw-bold mb-4">Skills & Interests</h5>
            <div className="d-flex flex-wrap gap-2">
              <span className="badge bg-light text-dark border px-3 py-2 fw-medium shadow-sm">Android Dev</span>
              <span className="badge bg-light text-dark border px-3 py-2 fw-medium shadow-sm">R Programming</span>
              <span className="badge bg-light text-dark border px-3 py-2 fw-medium shadow-sm">Photography</span>
              <span className="badge bg-light text-dark border px-3 py-2 fw-medium shadow-sm">Music</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;