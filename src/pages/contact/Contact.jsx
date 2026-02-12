import { useState } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import 'leaflet/dist/leaflet.css';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
import './Contact.css';

const defaultIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Message received! We will get back to you soon.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="app-container">
      <Header />
      <main className="contact-main">
        <section className="contact-intro">
          <h1 className="contact-title">Find us</h1>
          <p className="contact-desc">
            Visit us at our store or drop us a line and we will reply as soon as we can.
          </p>
        </section>

        <div className="contact-layout">
          <div className="contact-info">
            <div className="info-block">
              <h3>Address</h3>
              <p>Centro Comercial Las Arenas<br />Las Palmas de Gran Canaria</p>
            </div>
            <div className="info-block">
              <h3>Opening hours</h3>
              <p>Monday to Sunday<br />10:00 – 22:00</p>
            </div>
            <div className="info-block">
              <h3>Contact</h3>
              <p>bubbleshop@bubbly.com<br />+34 612 345 678</p>
            </div>
          </div>

          <div className="map-wrapper">
            <MapContainer
              center={[28.12898, -15.44887]}
              zoom={14}
              className="contact-map"
              scrollWheelZoom={false}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[28.12898, -15.44887]}>
                <Popup>Bubbly - Bubble Tea Shop</Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>

        <section className="contact-form-section">
          <h2 className="form-section-title">Get in touch</h2>
          <form className="contact-form" onSubmit={handleSubmit}>
            <label className="form-label" htmlFor="contact-name">
              Name
            </label>
            <input
              id="contact-name"
              type="text"
              name="name"
              placeholder="Your name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <label className="form-label" htmlFor="contact-email">
              Email
            </label>
            <input
              id="contact-email"
              type="email"
              name="email"
              placeholder="you@email.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <label className="form-label" htmlFor="contact-message">
              Message
            </label>
            <textarea
              id="contact-message"
              name="message"
              placeholder="How can we help?"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              required
            />
            <button type="submit" className="btn btn-primary btn-submit">
              Send message
            </button>
          </form>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
