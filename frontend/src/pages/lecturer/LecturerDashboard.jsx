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
  
  // Materials state
  const [materials, setMaterials] = useState([]);
  const [loadingMaterials, setLoadingMaterials] = useState(false);

  // --- NEW: Live Sessions State ---
  const [sessions, setSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [generatingId, setGeneratingId] = useState(null);

  // --- NEW: Assignments State ---
  const [assignmentForm, setAssignmentForm] = useState({ courseCode: '', title: '', description: '', dueDate: '' });
  const [selectedAssignmentFile, setSelectedAssignmentFile] = useState(null);
  const [isUploadingAssignment, setIsUploadingAssignment] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [loadingAssignments, setLoadingAssignments] = useState(false);
  
  // Courses state for dropdown
  const [courses, setCourses] = useState([]);
  const [employees, setEmployees] = useState([]);

  // --- NEW: Session Creation State ---
  const [sessionFormData, setSessionFormData] = useState({
    title: '',
    date: '',
    time: '',
    courseCode: '',
    hostedBy: ''
  });
  const [sessionLoading, setSessionLoading] = useState(false);
  
  // Video upload states
  const [uploadVideoSessionId, setUploadVideoSessionId] = useState(null);
  const [selectedVideoFile, setSelectedVideoFile] = useState(null);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);

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
      
      fetchMaterials();

    } catch (error) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || "Something broke on the server!";
      alert(`Backend Error: ${errorMessage}`);
    } finally {
      setIsUploading(false);
    }
  };

  // --- Live Sessions Functions ---
  const fetchMaterials = async () => {
    try {
      setLoadingMaterials(true);
      const res = await api.get('/materials');
      setMaterials(res.data || []);
    } catch (err) {
      console.error("Error fetching materials", err);
    } finally {
      setLoadingMaterials(false);
    }
  };

  React.useEffect(() => {
    if (activeTab === 'materials') {
      fetchMaterials();
    }
  }, [activeTab]);

  const fetchAssignments = async () => {
    try {
      setLoadingAssignments(true);
      const res = await api.get('/assignments');
      setAssignments(res.data || []);
    } catch (err) {
      console.error("Error fetching assignments", err);
    } finally {
      setLoadingAssignments(false);
    }
  };

  React.useEffect(() => {
    if (activeTab === 'assignments') {
      fetchAssignments();
    }
  }, [activeTab]);

  const fetchSessions = async () => {
    try {
      setLoadingSessions(true);
      const res = await api.get('/sessions');
      setSessions(res.data || []);
    } catch (err) {
      console.error("Error fetching sessions", err);
    } finally {
      setLoadingSessions(false);
    }
  };

  React.useEffect(() => {
    if (activeTab === 'sessions') {
      fetchSessions();
    }
  }, [activeTab]);

  // Fetch courses for the dropdown
  React.useEffect(() => {
    const fetchDependencies = async () => {
      try {
        const courseRes = await api.get('/courses');
        setCourses(courseRes.data || []);
        
        const empRes = await api.get('/employees');
        setEmployees(empRes.data || []);
      } catch (err) {
        console.error("Error fetching dependencies", err);
      }
    };
    fetchDependencies();
  }, []);

  const handleSessionInputChange = (e) => {
    const { name, value } = e.target;
    setSessionFormData({ ...sessionFormData, [name]: value });
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();
    if (!sessionFormData.title || !sessionFormData.date || !sessionFormData.time || !sessionFormData.courseCode || !sessionFormData.hostedBy) {
      return alert("Please fill in all fields.");
    }

    try {
      setSessionLoading(true);
      await api.post('/sessions', sessionFormData);
      alert("Session assigned successfully!");
      setSessionFormData({ title: '', date: '', time: '', courseCode: '', hostedBy: '' });
      fetchSessions();
    } catch (error) {
      console.error("Error creating session:", error);
      alert("Failed to create session.");
    } finally {
      setSessionLoading(false);
    }
  };

  const handleGenerateZoom = async (sessionId) => {
    try {
      setGeneratingId(sessionId);
      await api.put(`/sessions/${sessionId}/zoom`);
      alert('Zoom link generated successfully!');
      fetchSessions();
    } catch (error) {
      console.error("Error generating zoom", error);
      alert('Failed to generate Zoom link.');
    } finally {
      setGeneratingId(null);
    }
  };

  const handleVideoUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedVideoFile) return alert('Select a video file');
    const formData = new FormData();
    formData.append('video', selectedVideoFile);

    try {
      setIsUploadingVideo(true);
      await api.post(`/sessions/${uploadVideoSessionId}/video`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Video uploaded successfully!');
      setUploadVideoSessionId(null);
      setSelectedVideoFile(null);
      fetchSessions();
    } catch (err) {
      console.error("Video upload error", err);
      alert('Video upload failed.');
    } finally {
      setIsUploadingVideo(false);
    }
  };

  const handleAssignmentUpload = async (e) => {
    e.preventDefault();
    if (!selectedAssignmentFile) return alert("Please select a file to upload!");
    if (!assignmentForm.courseCode || !assignmentForm.title || !assignmentForm.dueDate) return alert("Please fill in all required fields!");

    const formData = new FormData();
    formData.append('file', selectedAssignmentFile);
    formData.append('title', assignmentForm.title);
    formData.append('description', assignmentForm.description);
    formData.append('courseCode', assignmentForm.courseCode);
    formData.append('dueDate', assignmentForm.dueDate);

    try {
      setIsUploadingAssignment(true);
      await api.post('/assignments', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert("Assignment uploaded successfully!");
      setAssignmentForm({ courseCode: '', title: '', description: '', dueDate: '' });
      setSelectedAssignmentFile(null);
      fetchAssignments();

    } catch (error) {
      console.error("Assignment upload error:", error);
      alert("Failed to upload assignment.");
    } finally {
      setIsUploadingAssignment(false);
    }
  };

  // Helper: get initials from a full name
  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  };

  // Guard: show spinner while loading OR if redirect is happening
  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#f8f9fa' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner-border text-danger" role="status" style={{ width: '3rem', height: '3rem' }}></div>
          <p style={{ marginTop: '16px', color: '#6c757d', fontWeight: 600 }}>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!lecturerInfo) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <p style={{ color: '#6c757d' }}>Unable to load profile. Please <a href="/login">log in again</a>.</p>
      </div>
    );
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
          <button className={`lecturer-nav-btn ${activeTab === 'assignments' ? 'active' : ''}`} onClick={() => setActiveTab('assignments')}>
            <FileText size={20} /> Assignments
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
                      {courses.length > 0 ? (
                        <select 
                          className="form-select" 
                          value={uploadForm.courseCode}
                          onChange={(e) => setUploadForm({...uploadForm, courseCode: e.target.value})}
                          required
                        >
                          <option value="">Select Course</option>
                          {courses.map(c => (
                            <option key={c._id} value={c.courseCode}>{c.title || c.courseCode}</option>
                          ))}
                        </select>
                      ) : (
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder="e.g. TA101" 
                          value={uploadForm.courseCode}
                          onChange={(e) => setUploadForm({...uploadForm, courseCode: e.target.value})}
                          required
                        />
                      )}
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

              {/* Uploaded List */}
              <div className="col-lg-7">
                <div className="card border-0 shadow-sm modern-card p-4 h-100">
                  <h5 className="fw-bold mb-4">Recently Uploaded</h5>
                  <div className="list-group list-group-flush">
                    {loadingMaterials ? (
                      <p>Loading materials...</p>
                    ) : materials.length === 0 ? (
                      <p className="text-muted mt-3">No materials uploaded yet.</p>
                    ) : (
                      materials.map((mat) => (
                        <div key={mat._id} className="list-group-item px-0 py-3 d-flex justify-content-between align-items-center border-bottom">
                          <div className="d-flex align-items-center gap-3">
                            <div className="bg-light p-2 rounded text-danger"><FileText size={24} /></div>
                            <div>
                              <h6 className="mb-1 fw-bold">{mat.title}</h6>
                              <small className="text-muted">{mat.courseCode} • Added {new Date(mat.createdAt).toLocaleDateString()}</small>
                            </div>
                          </div>
                          <a href={mat.fileUrl.startsWith('http') ? mat.fileUrl : `http://localhost:8000${mat.fileUrl}`} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-secondary">View</a>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: LIVE SESSIONS */}
        {activeTab === 'sessions' && (
          <div className="animate__animated animate__fadeIn">
            <div className="lecturer-header">
              <h2 className="fw-bold m-0">Live Sessions</h2>
            </div>

            <div className="card border-0 shadow-sm modern-card p-4 mb-4 mt-3">
              <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
                <PlusCircle size={20} className="text-danger"/> Assign New Session
              </h5>
              <form className="row g-3" onSubmit={handleCreateSession}>
                <div className="col-md-6">
                  <label className="form-label text-muted small fw-medium">Session Title</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="title"
                    value={sessionFormData.title}
                    onChange={handleSessionInputChange}
                    placeholder="e.g. Q&A and Project Review" 
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted small fw-medium">Course</label>
                  {courses.length > 0 ? (
                    <select className="form-select" name="courseCode" value={sessionFormData.courseCode} onChange={handleSessionInputChange}>
                      <option value="">Select Course</option>
                      {courses.map(c => (
                        <option key={c._id} value={c.courseCode}>{c.title || c.courseCode}</option>
                      ))}
                    </select>
                  ) : (
                    <input 
                      type="text" 
                      className="form-control" 
                      name="courseCode"
                      value={sessionFormData.courseCode}
                      onChange={handleSessionInputChange}
                      placeholder="Course Code (e.g., TA101)" 
                    />
                  )}
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted small fw-medium">Assign Lecturer</label>
                  {employees.length > 0 ? (
                    <select className="form-select" name="hostedBy" value={sessionFormData.hostedBy} onChange={handleSessionInputChange}>
                      <option value="">Select Lecturer</option>
                      {employees.map(emp => (
                        <option key={emp._id} value={emp._id}>{emp.fullName || emp.name || emp.firstName}</option>
                      ))}
                    </select>
                  ) : (
                    <input 
                      type="text" 
                      className="form-control" 
                      name="hostedBy"
                      value={sessionFormData.hostedBy}
                      onChange={handleSessionInputChange}
                      placeholder="Lecturer ID" 
                    />
                  )}
                </div>
                <div className="col-md-3">
                  <label className="form-label text-muted small fw-medium">Date</label>
                  <input 
                    type="date" 
                    className="form-control" 
                    name="date"
                    value={sessionFormData.date}
                    onChange={handleSessionInputChange}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label text-muted small fw-medium">Time</label>
                  <input 
                    type="time" 
                    className="form-control" 
                    name="time"
                    value={sessionFormData.time}
                    onChange={handleSessionInputChange}
                  />
                </div>
                <div className="col-12 mt-4 text-end">
                  <button type="submit" className="btn btn-theme-red px-4 py-2 fw-bold" disabled={sessionLoading}>
                    {sessionLoading ? 'Assigning...' : 'Assign Session'}
                  </button>
                </div>
              </form>
            </div>

            <h5 className="fw-bold mt-4 mb-3">My Assigned Sessions</h5>
            {loadingSessions ? (
              <p>Loading your sessions...</p>
            ) : sessions.length === 0 ? (
              <p className="text-muted mt-3">No sessions assigned yet.</p>
            ) : (
              <div className="row g-3 mt-3">
                {sessions.map(session => (
                  <div key={session._id} className="col-md-6">
                    <div className="card border border-light shadow-sm p-3 border-start border-danger border-4 h-100 d-flex flex-column">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className="fw-bold mb-0">{session.title}</h6>
                        <span className={`badge ${session.meetingLink ? 'bg-success' : 'bg-secondary'}`}>
                          {session.meetingLink ? 'Scheduled' : 'Pending Link'}
                        </span>
                      </div>
                      <p className="text-muted small mb-3">Course: {session.courseCode}</p>
                      <div className="d-flex gap-3 small fw-medium text-dark mb-3">
                        <span className="d-flex align-items-center gap-1"><Calendar size={14}/> {session.date}</span>
                        <span className="d-flex align-items-center gap-1"><Clock size={14}/> {session.time}</span>
                        <span className="d-flex align-items-center gap-1"><User size={14}/> {session.attendance?.length || 0} Attended</span>
                      </div>
                      
                      <div className="mt-auto d-flex flex-wrap gap-2">
                        {!session.meetingLink ? (
                          <button 
                            className="btn btn-sm btn-outline-danger w-100"
                            onClick={() => handleGenerateZoom(session._id)}
                            disabled={generatingId === session._id}
                          >
                            {generatingId === session._id ? 'Generating...' : 'Generate Zoom Link'}
                          </button>
                        ) : (
                          <>
                            <a href={session.meetingLink} target="_blank" rel="noreferrer" className="btn btn-sm btn-success flex-grow-1">
                              Join Meeting
                            </a>
                            {!session.videoUrl && (
                              <button 
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() => setUploadVideoSessionId(session._id)}
                              >
                                Upload Video
                              </button>
                            )}
                          </>
                        )}
                        {session.videoUrl && (
                          <span className="badge bg-info text-dark w-100 mt-2 py-2">Recording Available</span>
                        )}
                      </div>

                      {/* Upload Video Inline Form */}
                      {uploadVideoSessionId === session._id && (
                        <div className="mt-3 p-3 bg-light rounded">
                          <form onSubmit={handleVideoUploadSubmit}>
                            <label className="small fw-medium mb-2">Select Recorded Video</label>
                            <input 
                              type="file" 
                              accept="video/*" 
                              className="form-control form-control-sm mb-2"
                              onChange={e => setSelectedVideoFile(e.target.files[0])}
                            />
                            <div className="d-flex gap-2">
                              <button type="submit" className="btn btn-sm btn-danger flex-grow-1" disabled={isUploadingVideo}>
                                {isUploadingVideo ? 'Uploading...' : 'Submit'}
                              </button>
                              <button type="button" className="btn btn-sm btn-secondary" onClick={() => setUploadVideoSessionId(null)}>
                                Cancel
                              </button>
                            </div>
                          </form>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: ASSIGNMENTS */}
        {activeTab === 'assignments' && (
          <div className="animate__animated animate__fadeIn">
            <div className="lecturer-header">
              <h2 className="fw-bold m-0">Course Assignments</h2>
            </div>

            <div className="row g-4 mt-2">
              <div className="col-lg-5">
                <div className="card border-0 shadow-sm modern-card p-4 h-100">
                  <h5 className="fw-bold mb-4 d-flex align-items-center gap-2"><PlusCircle size={20} className="text-danger"/> Upload Assignment</h5>
                  
                  <form onSubmit={handleAssignmentUpload}>
                    <div className="mb-3">
                      <label className="form-label text-muted small fw-medium">Course</label>
                      {courses.length > 0 ? (
                        <select 
                          className="form-select" 
                          value={assignmentForm.courseCode}
                          onChange={(e) => setAssignmentForm({...assignmentForm, courseCode: e.target.value})}
                          required
                        >
                          <option value="">Select Course</option>
                          {courses.map(c => (
                            <option key={c._id} value={c.courseCode}>{c.title || c.courseCode}</option>
                          ))}
                        </select>
                      ) : (
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder="e.g. TA101" 
                          value={assignmentForm.courseCode}
                          onChange={(e) => setAssignmentForm({...assignmentForm, courseCode: e.target.value})}
                          required
                        />
                      )}
                    </div>

                    <div className="mb-3">
                      <label className="form-label text-muted small fw-medium">Assignment Title</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="e.g. Midterm Assignment" 
                        value={assignmentForm.title}
                        onChange={(e) => setAssignmentForm({...assignmentForm, title: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label text-muted small fw-medium">Description</label>
                      <textarea 
                        className="form-control" 
                        placeholder="Brief description..." 
                        rows="2"
                        value={assignmentForm.description}
                        onChange={(e) => setAssignmentForm({...assignmentForm, description: e.target.value})}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label text-muted small fw-medium">Due Date</label>
                      <input 
                        type="date" 
                        className="form-control" 
                        value={assignmentForm.dueDate}
                        onChange={(e) => setAssignmentForm({...assignmentForm, dueDate: e.target.value})}
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label className="form-label text-muted small fw-medium">Select File (PDF, Docs)</label>
                      <input 
                        type="file" 
                        className="form-control" 
                        onChange={(e) => setSelectedAssignmentFile(e.target.files[0])} 
                        required
                      />
                    </div>

                    <button 
                      type="submit" 
                      className="btn btn-theme-red w-100 py-2 fw-bold"
                      disabled={isUploadingAssignment}
                    >
                      {isUploadingAssignment ? 'Uploading...' : 'Publish Assignment'}
                    </button>
                  </form>
                </div>
              </div>

              {/* Uploaded Assignments List */}
              <div className="col-lg-7">
                <div className="card border-0 shadow-sm modern-card p-4 h-100">
                  <h5 className="fw-bold mb-4">Uploaded Assignments</h5>
                  <div className="list-group list-group-flush">
                    {loadingAssignments ? (
                      <p>Loading assignments...</p>
                    ) : assignments.length === 0 ? (
                      <p className="text-muted mt-3">No assignments uploaded yet.</p>
                    ) : (
                      assignments.map((assignment) => (
                        <div key={assignment._id} className="list-group-item px-0 py-3 d-flex justify-content-between align-items-center border-bottom">
                          <div className="d-flex align-items-center gap-3">
                            <div className="bg-light p-2 rounded text-danger"><FileText size={24} /></div>
                            <div>
                              <h6 className="mb-1 fw-bold">{assignment.title}</h6>
                              <small className="text-muted d-block">{assignment.courseCode} • Due: {new Date(assignment.dueDate).toLocaleDateString()}</small>
                            </div>
                          </div>
                          <a href={assignment.fileUrl.startsWith('http') ? assignment.fileUrl : `http://localhost:8000${assignment.fileUrl}`} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-primary">View File</a>
                        </div>
                      ))
                    )}
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