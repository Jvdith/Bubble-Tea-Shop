import { useState, useEffect } from 'react';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import ReviewCard from '../../components/review-card/ReviewCard';
import AddReviewForm from './AddReviewForm'; 
import { getReviews } from '../../firebase-config/Firebase';
import './Forum.css';

const Forum = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

 
  const loadReviews = async () => {
    setLoading(true);
    const data = await getReviews();
    setReviews(data);
    setLoading(false);
  };


  useEffect(() => {
    loadReviews();
  }, []);

  return (
    <div className="app-container">
      <Header />
      <main className="forum-main">
        
      
        <div className="forum-header">
          <h1 className="forum-title">Customer Reviews</h1>
          <button 
            className="btn-toggle-form"
            onClick={() => setShowForm(!showForm)}
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
          <AddReviewForm onReviewAdded={() => {
            loadReviews();      
            setShowForm(false);    
          }} />
        )}

        {loading ? (
          <div className="loading">Loading reviews...</div>
        ) : (
          <>
            <p className="results-count">
              {reviews.length} reviews
            </p>
            <div className="reviews-grid">
              {reviews.map(review => (
                <ReviewCard key={review.id} review={review} />
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