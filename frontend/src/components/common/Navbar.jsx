import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  
  const userInfo = (() => {
    try {
      const data = sessionStorage.getItem('trioslk_userInfo');
      if (!data) return null;
      const parsed = JSON.parse(data);
      // Ensure we actually have a logged in user (must have a token or valid ID)
      if (!parsed || Object.keys(parsed).length === 0 || !parsed.name) return null;
      return parsed;
    } catch {
      return null;
    }
  })();

  const getDashboardRoute = () => {
    if (userInfo?.role === 'admin' || userInfo?.role === 'superadmin') return '/admin';
    if (userInfo?.role === 'lecturer') return '/lecturer';
    return '/dashboard'; // student
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body py-3 border-bottom transition-theme">
      <div className="container d-flex justify-content-between align-items-center">
        
        {/* Logo */}
        <Link className="navbar-brand fw-bold fs-3" to="/">
          TRIOSLK
        </Link>

        {/* Mobile Button */}
        <button 
          className="navbar-toggler border-0 shadow-none" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menu */}
        <div className="collapse navbar-collapse justify-content-between" id="navbarNav">
          
          <ul className="navbar-nav mx-auto">
            <li className="nav-item px-2">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item px-2">
              <Link className="nav-link" to="/about">About</Link>
            </li>
            <li className="nav-item px-2">
              <Link className="nav-link" to="/courses">Courses</Link>
            </li>
            <li className="nav-item px-2">
              <Link className="nav-link" to="/events">Events</Link>
            </li>
          </ul>

          <div className="d-flex align-items-center">
            {userInfo ? (
              <Link to={getDashboardRoute()} className="btn btn-danger d-flex align-items-center gap-2 px-3 fw-medium rounded-pill shadow-sm">
                <i className="bi bi-person-circle fs-5"></i> {userInfo.name}
              </Link>
            ) : (
              <>
                <Link to="/login" className={`btn ${theme === 'dark' ? 'btn-outline-light' : 'btn-outline-dark'} me-2`}>
                  Login
                </Link>
                <Link to="/register" className="btn btn-danger">
                  Register
                </Link>
              </>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;