import { Link } from 'react-router-dom';
import './Footer.css';
import bubbleIcon from '../../assets/bubble-icon.png';


const instagramIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const githubIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-logo">
            <span
              className="logo-icon"
              style={{ backgroundImage: `url(${bubbleIcon})` }}
              aria-hidden
            />
            <span className="logo-text">Bubbly</span>
          </div>

          <p className="footer-tagline">Fresh bubble tea, every day.</p>
        </div>
        <div className="footer-links">
          <span className="footer-links-label">Links</span>
          <Link to="/home">Home</Link>
          <Link to="/menu">Menu</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/legal">Legal notice</Link>
        </div>
        <div className="footer-legal">
          <p>
            © 2026 Bubbly. All rights reserved.{' '}
            <Link to="/legal#privacy">Privacy Policy</Link>
            {' and '}
            <Link to="/legal#cookies">Cookies</Link>
            {' | '}
            <Link to="/legal#terms">Terms of Sale</Link>
          </p>
        </div>
        <div className="footer-social">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            {instagramIcon}
          </a>
          <a href="https://github.com/jvdith" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            {githubIcon}
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
