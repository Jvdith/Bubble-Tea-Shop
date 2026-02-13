import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import './Legal.css';

const Legal = () => {
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return (
    <div className="app-container">
      <Header />
      <main className="legal-main">
        <h1 className="legal-title">Legal notice</h1>
        <nav className="legal-nav">
          <a href="#privacy">Privacy</a>
          <a href="#cookies">Cookies</a>
          <a href="#terms">Terms of sale</a>
        </nav>

        <section id="privacy" className="legal-section">
          <h2>Privacy policy</h2>
          <p>
            Bubbly collects and processes the information you provide when filling in forms or contacting us.
            We use your data only to respond to your enquiry, process orders or send you information about
            our products if you have given your consent. We do not share your data with third parties except where required by law.
            You may exercise your rights of access, rectification, erasure and objection by contacting Bubbly@BubbleTeaShop.com.
          </p>
        </section>

        <section id="cookies" className="legal-section">
          <h2>Cookie policy</h2>
          <p>
            This website may use technical cookies necessary for the operation of the site (e.g. language or session preferences).
            We do not use advertising or third-party cookies without your consent. You can set your browser to reject cookies;
            in that case, some features may not be available.
          </p>
        </section>

        <section id="terms" className="legal-section">
          <h2>Terms of sale</h2>
          <p>
            Prices shown include applicable VAT. Your order is confirmed when we receive your request; we reserve the right to limit quantities.
            Products are delivered at the store or at the agreed collection point. For claims or returns, contact us within 14 days of delivery.
          </p>
        </section>

        <p className="legal-back">
          <Link to="/home">← Back to home</Link>
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default Legal;
