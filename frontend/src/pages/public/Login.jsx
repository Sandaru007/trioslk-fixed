import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import logoImg from '../../assets/images/logo.jpg'; 
import './Auth.css';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setCredentials({ ...credentials, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const { data } = await api.post('/auth/login', credentials);
      
      // Store token and user data in browser storage
      sessionStorage.setItem('trioslk_token', data.token);
      sessionStorage.setItem('trioslk_userInfo', JSON.stringify(data));

      // Route based on backend role
      if (data.role === 'admin') {
        navigate('/admin');
      } else if (data.role === 'lecturer') {
        navigate('/lecturer'); // <--- Navigates to Lecturer Dashboard
      } else {
        navigate('/dashboard'); // For students
      }

    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        
        <div className="auth-logo">
          <img src={logoImg} alt="TrioSLK Logo" style={{ maxWidth: '180px', marginBottom: '15px' }} />
          <p className="text-muted small mb-0">Academy Portal</p>
        </div>

        {error && <div className="alert alert-danger py-2 text-center fw-medium small">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="auth-label">Username</label>
            <input 
              type="text" 
              name="username" 
              className="form-control auth-input" 
              placeholder=""
              value={credentials.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <label className="auth-label mb-0">Password</label>
              <Link to="/forgot-password" stroke="none" className="forgot-password">Lost Password?</Link>
            </div>
            <input 
              type="password" 
              name="password" 
              className="form-control auth-input" 
              placeholder="••••••••"
              value={credentials.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-theme-red w-100 py-2 fw-bold rounded-3 mb-3">
            Sign In
          </button>
        </form>

        <div className="text-center mt-4 pt-3 border-top">
          <p className="text-muted small mb-0">
            New to TrioSLK Academy? <br/>
            <Link to="/register" className="fw-bold text-dark text-decoration-none">Register as a Student</Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;