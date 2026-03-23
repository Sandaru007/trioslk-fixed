import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-section pt-5">
      <div className="container pb-4">
        <div className="row">
          
          {/* LEFT COLUMN: Logo & About */}
          <div className="col-lg-5 col-md-6 mb-4 mb-lg-0">
            <h2 className="footer-brand fw-bold mb-3 fs-3">TRIOSLK</h2>
            <p className="footer-text pe-lg-4 mb-4">
              SriLanka's premier multi-department creative services company, crafting unforgettable experiences across events, entertainment, media, education, and technology.
            </p>
            <div className="social-icons d-flex gap-3">
              <a href="https://www.facebook.com/share/1FDaqntSJu/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <i className="bi bi-facebook"></i>
              </a>{/* [cite: 34] */}
              <a href="https://www.instagram.com/trioslkacademy?igsh=cW01ZTEyc2EydGw4" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <i className="bi bi-instagram"></i>
              </a>{/* [cite: 36] */}
              <a href="https://www.tiktok.com/@trioslk.academy?r=1&t=ZS-93a9DauVOnE" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                <i className="bi bi-tiktok"></i>
              </a>{/* [cite: 39] */}
            </div>
          </div>

          {/* MIDDLE COLUMN: Quick Links */}
          <div className="col-lg-3 col-md-6 mb-4 mb-lg-0">
            <h5 className="footer-heading">Quick Links</h5>
            <ul className="footer-links">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/events">Events</Link></li>
              <li><Link to="/courses">Courses</Link></li>
            </ul>
          </div>

          {/* RIGHT COLUMN: Stay Connected */}
          <div className="col-lg-4 col-md-12">
            <h5 className="footer-heading">Stay Connected</h5>
            
            <div className="contact-item">
              <i className="bi bi-envelope-fill"></i>
              <span>trioslkacademy@gmail.com</span> {/* [cite: 40] */}
            </div>
            
            <div className="contact-item">
              <i className="bi bi-telephone-fill"></i>
              <span>+94 77 121 6125</span> {/* [cite: 42] */}
            </div>
            
            <div className="contact-item">
              <i className="bi bi-whatsapp"></i>
              <span>+94 77 121 6125 (WhatsApp)</span> {/* [cite: 44] */}
            </div>
            
            <div className="contact-item">
              <i className="bi bi-geo-alt-fill"></i>
              <span>Colombo, Sri Lanka</span> {/* [cite: 46] */}
            </div>
          </div>

        </div>
      </div>

      {/* BOTTOM COPYRIGHT BAR */}
      <div className="footer-bottom py-3 mt-2">
        <div className="container text-center text-md-start d-md-flex justify-content-between">
          <span>&copy; 2026 trios.lk. All Rights Reserved.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;