import api from '../../services/api';
import React, { useState } from 'react';
import { 
  User, BookOpen, Video, LogOut, Upload, PlusCircle, FileText, Calendar, Clock 
} from 'lucide-react';
import './LecturerDashboard.css';

const LecturerDashboard = () => {
  const [activeTab, setActiveTab] = useState('profile');

  // --- NEW: File Upload State ---
  const [uploadForm, setUploadForm] = useState({ courseCode: '', title: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Dummy data for the UI (Backend will replace this later)
  const lecturerInfo = {
    name: "Dr. Anura Perera",
    email: "anura.p@trioslk.com",
    specialization: ["Event Management", "Public Speaking"],
    qualifications: "MSc in Management",
    status: "Active"
  };

  // --- NEW: The FormData Submit Function ---
  const handleMaterialUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return alert("Please select a file to upload!");
    if (!uploadForm.courseCode || !uploadForm.title) return alert("Please fill in all fields!");

    // 1. Create the FormData object
    const formData = new FormData();
    formData.append('file', selectedFile); // The actual physical file
    formData.append('title', uploadForm.title);
    formData.append('courseCode', uploadForm.courseCode); // The "glue" to the course

    try {
      setIsUploading(true);
      
      // 2. Send it to the backend! Notice the special header.
      await api.post('/materials', formData, {
        headers: { 'Content-Type': 'multipart/form-data' } // Crucial for Multer!
      });

      alert("Material uploaded successfully!");
      
      // Clear the form
      setUploadForm({ courseCode: '', title: '' });
      setSelectedFile(null);
      
      // Note: If you have a fetchMaterials() function later, call it here!

    } catch (error) {
      console.error("Upload failed details:", error.response || error);
      
      // Extract the exact error message sent from the Node backend!
      const errorMessage = error.response?.data?.error || error.response?.data?.message || "Something broke on the server!";
      
      alert(`Backend Error: ${errorMessage}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="lecturer-container">
      
      {/* SIDEBAR */}
      <aside className="lecturer-sidebar shadow-sm">
        <div className="lecturer-profile-widget">
          <div className="lecturer-avatar">AP</div>
          <h5 className="fw-bold mb-1">{lecturerInfo.name}</h5>
          <span className="badge bg-light text-dark border">Senior Lecturer</span>
        </div>
        
        <nav className="lecturer-nav">
          <button className={`lecturer-nav-btn ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
            <User size={20} /> My Profile
          </button>
          <button className={`lecturer-nav-btn ${activeTab === 'materials' ? 'active' : ''}`} onClick={() => setActiveTab('materials')}>
            <BookOpen size={20} /> Course Materials
          </button>
          <button className={`lecturer-nav-btn ${activeTab === 'sessions' ? 'active' : ''}`} onClick={() => setActiveTab('sessions')}>
            <Video size={20} /> Live Sessions
          </button>
        </nav>

        <div className="p-3 border-top">
          <button className="lecturer-nav-btn text-danger">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="lecturer-main">
        
        {/* TAB 1: PROFILE */}
        {activeTab === 'profile' && (
          <div className="animate__animated animate__fadeIn">
            <h2 className="fw-bold mb-4">My Profile</h2>
            <div className="card border-0 shadow-sm modern-card p-4">
              <div className="row">
                <div className="col-md-8">
                  <h4 className="fw-bold border-bottom pb-2 mb-4">Personal Details</h4>
                  <div className="row mb-3">
                    <div className="col-sm-4 text-muted fw-medium">Full Name</div>
                    <div className="col-sm-8 fw-bold">{lecturerInfo.name}</div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-sm-4 text-muted fw-medium">Email Address</div>
                    <div className="col-sm-8">{lecturerInfo.email}</div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-sm-4 text-muted fw-medium">Qualifications</div>
                    <div className="col-sm-8">{lecturerInfo.qualifications}</div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-sm-4 text-muted fw-medium">Specializations</div>
                    <div className="col-sm-8">
                      {lecturerInfo.specialization.map((spec, i) => (
                        <span key={i} className="badge bg-secondary me-2">{spec}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="col-md-4 d-flex flex-column align-items-center justify-content-center bg-light rounded-3 p-4">
                  <div className="lecturer-avatar mb-3" style={{ width: '120px', height: '120px', fontSize: '48px' }}>AP</div>
                  <button className="btn btn-outline-secondary btn-sm w-100"><Upload size={16} className="me-2"/>Update Photo</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: COURSE MATERIALS */}
        {activeTab === 'materials' && (
          <div className="animate__animated animate__fadeIn">
            <div className="lecturer-header">
              <h2 className="fw-bold m-0">Course Materials</h2>
            </div>

            <div className="row g-4">
              {/* --- UPDATED: Upload Form --- */}
              <div className="col-lg-5">
                <div className="card border-0 shadow-sm modern-card p-4 h-100">
                  <h5 className="fw-bold mb-4 d-flex align-items-center gap-2"><PlusCircle size={20} className="text-danger"/> Upload New Material</h5>
                  
                  <form onSubmit={handleMaterialUpload}>
                    <div className="mb-3">
                      <label className="form-label text-muted small fw-medium">Course Code</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="e.g. TA101" 
                        value={uploadForm.courseCode}
                        onChange={(e) => setUploadForm({...uploadForm, courseCode: e.target.value})}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label text-muted small fw-medium">Material Title</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="e.g. Week 1 Slides" 
                        value={uploadForm.title}
                        onChange={(e) => setUploadForm({...uploadForm, title: e.target.value})}
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label className="form-label text-muted small fw-medium">Select File (PDF, Image)</label>
                      <input 
                        type="file" 
                        className="form-control" 
                        onChange={(e) => setSelectedFile(e.target.files[0])} 
                        required
                      />
                    </div>

                    <button 
                      type="submit" 
                      className="btn btn-theme-red w-100 py-2 fw-bold"
                      disabled={isUploading}
                    >
                      {isUploading ? 'Uploading...' : 'Publish Material'}
                    </button>
                  </form>

                </div>
              </div>

              {/* Uploaded List (Static for now) */}
              <div className="col-lg-7">
                <div className="card border-0 shadow-sm modern-card p-4 h-100">
                  <h5 className="fw-bold mb-4">Recently Uploaded</h5>
                  <div className="list-group list-group-flush">
                    <div className="list-group-item px-0 py-3 d-flex justify-content-between align-items-center border-bottom">
                      <div className="d-flex align-items-center gap-3">
                        <div className="bg-light p-2 rounded text-danger"><FileText size={24} /></div>
                        <div>
                          <h6 className="mb-1 fw-bold">Introduction to Event Planning</h6>
                          <small className="text-muted">Event Management • Added Oct 12</small>
                        </div>
                      </div>
                      <button className="btn btn-sm btn-outline-secondary">View</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: LIVE SESSIONS (Unchanged) */}
        {activeTab === 'sessions' && (
          <div className="animate__animated animate__fadeIn">
            <div className="lecturer-header">
              <h2 className="fw-bold m-0">Live Sessions</h2>
            </div>

            <div className="card border-0 shadow-sm modern-card p-4 mb-4">
              <h5 className="fw-bold mb-4 d-flex align-items-center gap-2"><Video size={20} className="text-danger"/> Schedule New Session</h5>
              <form className="row g-3">
                <div className="col-md-6">
                  <label className="form-label text-muted small fw-medium">Session Title</label>
                  <input type="text" className="form-control" placeholder="e.g. Q&A and Project Review" />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted small fw-medium">Select Course</label>
                  <select className="form-select">
                    <option>Event Management Certificate</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label text-muted small fw-medium">Date</label>
                  <input type="date" className="form-control" />
                </div>
                <div className="col-md-4">
                  <label className="form-label text-muted small fw-medium">Time</label>
                  <input type="time" className="form-control" />
                </div>
                <div className="col-md-4">
                  <label className="form-label text-muted small fw-medium">Meeting Link (Zoom/Meet)</label>
                  <input type="url" className="form-control" placeholder="https://zoom.us/..." />
                </div>
                <div className="col-12 mt-4 text-end">
                  <button type="button" className="btn btn-theme-red px-4 py-2 fw-bold">Schedule Session</button>
                </div>
              </form>
            </div>

            <h5 className="fw-bold mb-3 mt-5">Upcoming Sessions</h5>
            <div className="row g-3">
              <div className="col-md-6">
                <div className="card border border-light shadow-sm p-3 border-start border-danger border-4">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h6 className="fw-bold mb-0">Vendor Coordination Masterclass</h6>
                    <span className="badge bg-danger">Zoom</span>
                  </div>
                  <p className="text-muted small mb-3">Event Management Certificate</p>
                  <div className="d-flex gap-3 small fw-medium text-dark">
                    <span className="d-flex align-items-center gap-1"><Calendar size={14}/> Oct 15, 2026</span>
                    <span className="d-flex align-items-center gap-1"><Clock size={14}/> 06:00 PM</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
};

export default LecturerDashboard;