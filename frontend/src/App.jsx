import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// AOS Animation Library
import AOS from 'aos';
import 'aos/dist/aos.css'; // The CSS that makes the animations work

import PublicLayout from './components/layouts/PublicLayout';
import Home from './pages/public/Home';
import About from './pages/public/About';
import Courses from './pages/public/Courses';
import Events from './pages/public/Events';
import Volunteer from './pages/public/Volunteer';
import Login from './pages/public/Login';
import Register from './pages/public/Register';

//  NEW ADMIN DASHBOARD
import AdminDashboard from './pages/admin/AdminDashboard';
import Dashboard from './pages/student/Dashboard_Lms';
import LecturerDashboard from './pages/lecturer/LecturerDashboard';


function App() {
  
  // This initializes the scroll animations when the website loads
  useEffect(() => {
    AOS.init({
      duration: 800,     
      once: true,        
      offset: 100,       
      easing: 'ease-out-cubic', 
    });
  }, []);

  return (
    <Router>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/events" element={<Events />} />
          <Route path="/volunteer" element={<Volunteer />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route> 
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/lecturer" element={<LecturerDashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;