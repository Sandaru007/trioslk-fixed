import api from '../../services/api';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // For logout
import { 
  User, BookOpen, Video, LogOut, Upload, PlusCircle, FileText, Calendar, Clock, Phone, MapPin, Hash
} from 'lucide-react';
import './LecturerDashboard.css';

const LecturerDashboard = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const navigate = useNavigate();

  // --- Real Data State ---
  const [lecturerInfo, setLecturerInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // --- File Upload State ---
  const [uploadForm, setUploadForm] = useState({ courseCode: '', title: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // --- FETCH LECTURER DATA ON LOAD ---
  useEffect(() => {
    const fetchMyData = async () => {
      try {
        // Retrieve the user info saved during login
        const storedInfo = JSON.parse(sessionStorage.getItem('trioslk_userInfo'));
        
        if (!storedInfo || storedInfo.role !== 'lecturer') {
          navigate('/login'); // Kick them out if not a lecturer
          return;
        }

        // We stored their name and ID during login. 
        // We will fetch the full profile using their specific ID.
        // NOTE: Make sure the ID you save in login matches what the DB expects!
        const res = await api.get(`/employees/${storedInfo._id}`); 
        setLecturerInfo(res.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyData();
  }, [navigate]);

  // --- LOGOUT HANDLER ---
  const handleLogout = () => {
    sessionStorage.removeItem('trioslk_token');
    sessionStorage.removeItem('trioslk_userInfo');
    navigate('/login');
  };

  // --- MATERIAL UPLOAD HANDLER ---
  const handleMaterialUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return alert("Please select a file to upload!");
    if (!uploadForm.courseCode || !uploadForm.title) return alert("Please fill in all fields!");

    const formData = new FormData();
    formData.append('file', selectedFile); 
    formData.append('title', uploadForm.title);
    formData.append('courseCode', uploadForm.courseCode); 

    try {
      setIsUploading(true);
      await api.post('/materials', formData, {
        headers: { 'Content-Type': 'multipart/form-data' } 
      });
      alert("Material uploaded successfully!");
      setUploadForm({ courseCode: '', title: '' });
      setSelectedFile(null);
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || "Something broke on the server!";
      alert(`Backend Error: ${errorMessage}`);
    } finally {
      setIsUploading(false);
    }
  };

  // Helper to get initials for the avatar if no photo exists
  const getInitials = (name) => {
    if (!name) return "L";
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  // If still loading, show a loading spinner
  if (isLoading) {
    return <div className="text-center mt-5 p-5">Loading Dashboard...</div>;
  }

  // If data fails to load
  if (!lecturerInfo) {
    return <div className="text-center mt-5 p-5 text-danger">Failed to load profile. Please log in again.</div>;
  }

  return (
    <div className="lecturer-container">
      
      {/* SIDEBAR */}
      <aside className="lecturer-sidebar shadow-sm">
        <div className="lecturer-profile-widget">
          {/* Avatar (Uses Real Name Initials) */}
          <div className="lecturer-avatar">{getInitials(lecturerInfo.fullName)}</div>
          <h5 className="fw-bold mb-1">{lecturerInfo.fullName}</h5>
          
          {/* Dynamic Access Level Badge */}
          <span className={`badge border ${lecturerInfo.accessLevel === 'Senior Lecturer' ? 'bg-primary' : 'bg-light text-dark'}`}>
            {lecturerInfo.accessLevel}
          </span>
          <br/>
          {/* Dynamic Status Badge */}
          <span className={`badge mt-2 ${lecturerInfo.status === 'Active' ? 'bg-success' : 'bg-danger'}`}>
            {lecturerInfo.status}
          </span>
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
          {/* REAL LOGOUT FUNCTION */}
          <button className="lecturer-nav-btn text-danger w-100" onClick={handleLogout}>
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
                  
                  {/* DYNAMIC DATA DISPLAY */}
                  <div className="row mb-3">
                    <div className="col-sm-4 text-muted fw-medium d-flex align-items-center gap-2"><Hash size={16}/> Lecturer ID</div>
                    <div className="col-sm-8 fw-bold text-primary">{lecturerInfo.lecturerId}</div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-sm-4 text-muted fw-medium d-flex align-items-center gap-2"><User size={16}/> Full Name</div>
                    <div className="col-sm-8 fw-bold">{lecturerInfo.fullName}</div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-sm-4 text-muted fw-medium">Email Address</div>
                    <div className="col-sm-8">{lecturerInfo.email}</div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-sm-4 text-muted fw-medium d-flex align-items-center gap-2"><Phone size={16}/> Phone</div>
                    <div className="col-sm-8">{lecturerInfo.phone || 'N/A'}</div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-sm-4 text-muted fw-medium">NIC Number</div>
                    <div className="col-sm-8">{lecturerInfo.nic || 'N/A'}</div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-sm-4 text-muted fw-medium d-flex align-items-center gap-2"><MapPin size={16}/> Address</div>
                    <div className="col-sm-8">{lecturerInfo.address || 'N/A'}</div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-sm-4 text-muted fw-medium">Qualifications</div>
                    <div className="col-sm-8">
                      {lecturerInfo.qualifications?.length > 0 
                        ? lecturerInfo.qualifications.join(', ') 
                        : 'No qualifications listed'}
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-sm-4 text-muted fw-medium">Specializations</div>
                    <div className="col-sm-8">
                      {lecturerInfo.specialization?.length > 0 ? (
                        lecturerInfo.specialization.map((spec, i) => (
                          <span key={i} className="badge bg-secondary me-2">{spec}</span>
                        ))
                      ) : (
                        <span className="text-muted">None listed</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* PROFILE PHOTO AREA */}
                <div className="col-md-4 d-flex flex-column align-items-center justify-content-center bg-light rounded-3 p-4">
                  <div className="lecturer-avatar mb-3" style={{ width: '120px', height: '120px', fontSize: '48px', backgroundColor: '#e9ecef', color: '#2c3e50' }}>
                    {getInitials(lecturerInfo.fullName)}
                  </div>
                  <small className="text-muted text-center mb-3">Profile photo feature coming soon</small>
                  <button className="btn btn-outline-secondary btn-sm w-100" disabled><Upload size={16} className="me-2"/>Update Photo</button>
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