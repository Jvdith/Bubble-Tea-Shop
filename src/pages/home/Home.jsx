// src/pages/home/Home.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import ProductCard from '../../components/product-card/ProductCard';
import ReviewCard from '../../components/review-card/ReviewCard';
import AddReviewForm from '../forum/AddReviewForm';
import { bobaProducts } from '../../data/products-data';
import { getReviews, updateReview, deleteReview } from '../../firebase-config/Firebase';
import './Home.css';
import heroBg from '../../assets/bubble-background.jpg';

const Home = () => {
  // Estados para productos destacados
  const featuredIds = new Set([1, 2, 3]);
  const featured = bobaProducts.filter((p) => featuredIds.has(p.id));

  // 📌 ESTADOS PARA REVIEWS (copiados de Forum.jsx)
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Cargar reviews
  const loadReviews = async () => {
    console.log("Loading reviews...");
    setLoading(true);
    const data = await getReviews();
    console.log("Reviews loaded:", data.length);
    setReviews(data);
    setLoading(false);
  };

  useEffect(() => {
    loadReviews();
  }, []);

  // Mostrar mensajes
  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  // Actualizar review
  const handleUpdate = async (id, updatedData) => {
    console.log("handleUpdate", id, updatedData);
    const result = await updateReview(id, updatedData);
    if (result.success) {
      console.log("Updated, loading...");
      showMessage('success', 'Review Updated');
      await loadReviews();
      console.log("Reviews loaded");
    } else {
      console.error("Error:", result.error);
      showMessage('error', 'Error');
    }
    setEditingReview(null);
    setShowForm(false);
  };

  // Review añadida
  const handleReviewAdded = () => {
    console.log("Review added, loading...");
    loadReviews();
    setShowForm(false);
  };

  // Eliminar review
  const handleDelete = async (id) => {
    const result = await deleteReview(id);
    if (result.success) {
      showMessage('success', 'Deleted');
      loadReviews();
    } else {
      showMessage('error', 'Error');
    }
  };

  // Abrir edición
  const handleEditClick = (review) => {
    setEditingReview(review);
    setShowForm(true);
  };

  return (
    <div className="app-container">
      <Header />
      <main className="home-main">

        {/* SECCIÓN HERO (existente) */}
        <section
          className="hero"
          style={{ backgroundImage: `url(${heroBg})` }}
        >
          <div className="hero-content">
            <p className="hero-label">Fresh bubble tea</p>
            <h1 className="hero-title">
              Slow down.<br />Sip something special.
            </h1>
            <p className="hero-desc">
              Handcrafted with natural ingredients, topped with our signature pearl pop.
            </p>
            <div className="hero-actions">
              <Link to="/menu" className="btn btn-primary">
                View menu
              </Link>
              <Link to="/contact" className="btn btn-secondary">
                Find us
              </Link>
            </div>
          </div>
        </section>

        {/* SECCIÓN PRODUCTOS DESTACADOS (existente) */}
        <section className="section section-stars">
          <h2 className="section-title">Our favourites</h2>
          <p className="section-desc">Best-sellers. Try these three and tell us which one you like best.</p>
          <div className="product-grid">
            {featured.map((product) => (
              <ProductCard key={product.id} data={product} />
            ))}
          </div>
          <Link to="/menu" className="section-link">
            View full menu →
          </Link>
        </section>

        {/* 📌 NUEVA SECCIÓN: REVIEWS */}
        <section className="section section-reviews">
          <div className="reviews-header">
            <h2 className="section-title">Customer Reviews</h2>
            
            {message.text && (
              <div className={`message-badge ${message.type}`}>
                {message.text}
              </div>
            )}

            <button
              className="btn-toggle-review"
              onClick={() => {
                setEditingReview(null);
                setShowForm(!showForm);
              }}
            >
              {showForm ? 'Close' : 'Write a review'}
            </button>
          </div>

          {/* Formulario de reviews */}
          {showForm && (
            <AddReviewForm
              onReviewAdded={handleReviewAdded}
              onUpdate={handleUpdate}
              editingReview={editingReview}
              onCancel={() => {
                setShowForm(false);
                setEditingReview(null);
              }}
            />
          )}

          {/* Lista de reviews */}
          {loading ? (
            <div className="loading">Loading reviews...</div>
          ) : (
            <>
              <p className="results-count">{reviews.length} reviews</p>
              <div className="home-reviews-grid">
                {reviews.map(review => (
                  <div key={review.id} className="review-wrapper">
                    <ReviewCard review={review} />
                    <div className="review-actions">
                      <button
                        className="review-btn-edit"
                        onClick={() => handleEditClick(review)}
                        title="Edit"
                      >
                        Edit
                      </button>
                      <button
                        className="review-btn-delete"
                        onClick={() => handleDelete(review.id)}
                        title="Delete"
                      >
                        Del
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {!loading && reviews.length === 0 && (
            <div className="no-results">
              <p>No reviews yet. Be the first!</p>
            </div>
          )}
        </section>

        {/* SECCIÓN CTA (existente) */}
        <section className="section section-cta">
          <div className="cta-box">
            <h2 className="cta-title">Fancy customising?</h2>
            <p className="cta-desc">
              On our menu you can choose sugar level, ice and extra toppings.
              Come and try, and create your perfect combination.
            </p>
            <Link to="/contact" className="btn btn-primary">
              Get in touch or visit us
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
};

export default Home;