
import { useState, useEffect } from 'react';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import ReviewCard from '../../components/review-card/ReviewCard';
import AddReviewForm from './AddReviewForm';
import { getReviews, updateReview, deleteReview } from '../../firebase-config/Firebase';
import './Forum.css';

const Forum = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

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

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleUpdate = async (id, updatedData) => {
    console.log("handleUpdate", id, updatedData);
    const result = await updateReview(id, updatedData);
    if (result.success) {
      console.log("Updated, loading...");
      showMessage('success', 'Review Updated');
      await loadReviews(); // ← Asegúrate que espera a recargar
      console.log("Reviews loaded");
    } else {
      console.error("Error:", result.error);
      showMessage('error', 'Error');
    }
    setEditingReview(null);
    setShowForm(false);
  };

  const handleReviewAdded = () => {
    console.log("Review added, loading...");
    loadReviews();
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    const result = await deleteReview(id);
    if (result.success) {
      showMessage('success', 'Deleted');
      loadReviews();
    } else {
      showMessage('error', 'Error');
    }
  };

  const handleEditClick = (review) => {
    setEditingReview(review);
    setShowForm(true);
  };

  return (
    <div className="app-container">
      <Header />
      <main className="forum-main">

        <div className="forum-header">
          <h1 className="forum-title">Customer Reviews</h1>

          {message.text && (
            <div className={`message-badge ${message.type}`}>
              {message.text}
            </div>
          )}

          <button
            className="btn-toggle-form"
            onClick={() => {
              setEditingReview(null);
              setShowForm(!showForm);
            }}
          >
            {showForm ? 'Close' : 'Write a review'}
          </button>
        </div>

        <div className="forum-stats">
          <div className="stat-card">
            <span className="stat-value">{reviews.length}</span>
            <span className="stat-label">Reviews</span>
          </div>
        </div>

        {showForm && (
          <AddReviewForm
            onReviewAdded={() => {
              loadReviews();
              setShowForm(false);
            }}
            onUpdate={handleUpdate}
            editingReview={editingReview}
            onCancel={() => {
              setShowForm(false);
              setEditingReview(null);
            }}
          />
        )}

        {loading ? (
          <div className="loading">Loading reviews...</div>
        ) : (
          <>
            <p className="results-count">{reviews.length} reviews</p>
            <div className="reviews-grid">
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
            <p>No reviews yet.</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Forum;