import { Link } from 'react-router-dom';
import './Navbar.css'; // Importing your custom styles

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white py-3 border-bottom">
      <div className="container d-flex justify-content-between align-items-center">
        
        {/* LEFT: Brand Logo */}
        <Link className="navbar-brand fw-bold fs-3 brand-text" to="/">
          TRIOSLK
        </Link>

        {/* Mobile Hamburger Button */}
        <button 
          className="navbar-toggler border-0 shadow-none" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation Collapse Wrapper */}
        <div className="collapse navbar-collapse justify-content-between" id="navbarNav">
          
          {/* CENTER: Pill-shaped Navigation Links */}
          <ul className="navbar-nav mx-auto nav-pill-container px-4 py-2 rounded-pill mt-3 mt-lg-0">
            <li className="nav-item px-2">
              <Link className="nav-link text-dark fw-medium" to="/">Home</Link>
            </li>
            <li className="nav-item px-2">
              <Link className="nav-link text-dark fw-medium" to="/about">About Us</Link>
            </li>
            <li className="nav-item px-2">
              <Link className="nav-link text-dark fw-medium" to="/events">Events</Link>
            </li>
            <li className="nav-item px-2">
              <Link className="nav-link text-dark fw-medium" to="/courses">Courses</Link>
            </li>
          </ul>
          
          {/* RIGHT: Action Buttons (Login & Register) */}
          <div className="d-flex align-items-center mt-3 mt-lg-0 mobile-gap">
            <Link to="/login" className="btn btn-login me-2 px-4 py-2">
              Login
            </Link>
            <Link to="/register" className="btn btn-theme-red rounded-pill px-4 py-2 fw-medium">
              Register
            </Link>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;