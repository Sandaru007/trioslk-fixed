import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-section pt-5">
      <div className="container pb-4">
        <div className="row">
          <div className="col-lg-5 col-md-6 mb-4 mb-lg-0">
            <h2 className="footer-brand fw-bold mb-3 fs-3">TRIOSLK</h2>
            <p className="footer-text pe-lg-4 mb-4">
              SriLanka's premier multi-department creative services company,
              crafting unforgettable experiences across events, entertainment,
              media, education, and technology.
            </p>
          </div>

          <div className="col-lg-3 col-md-6 mb-4 mb-lg-0">
            <h5 className="footer-heading">Quick Links</h5>
            <ul className="footer-links list-unstyled">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/events">Events</Link></li>
              <li><Link to="/courses">Courses</Link></li>
            </ul>
          </div>

          <div className="col-lg-4 col-md-12">
            <h5 className="footer-heading">Stay Connected</h5>

            <div className="contact-item mb-2">
              <i className="bi bi-envelope-fill me-2"></i>
              <span>trioslkacademy@gmail.com</span>
            </div>

            <div className="contact-item mb-2">
              <i className="bi bi-telephone-fill me-2"></i>
              <span>+94 77 121 6125</span>
            </div>

            <div className="contact-item mb-2">
              <i className="bi bi-whatsapp me-2"></i>
              <span>+94 77 121 6125 (WhatsApp)</span>
            </div>

            <div className="contact-item">
              <i className="bi bi-geo-alt-fill me-2"></i>
              <span>Colombo, Sri Lanka</span>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom py-3 mt-2">
        <div className="container text-center text-md-start d-md-flex justify-content-between">
          <span>&copy; 2026 trios.lk. All Rights Reserved.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;