import { useState, useEffect } from 'react';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import ReviewCard from '../../components/review-card/ReviewCard';
import { getReviews } from '../../firebase-config/Firebase';
import './Forum.css';

const Forum = () => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const loadReviews = async () => {
      setLoading(true);
      const data = await getReviews();
      setReviews(data);
      setFilteredReviews(data);
      setLoading(false);
    };
    loadReviews();
  }, []);

  useEffect(() => {
    let result = reviews;
    
    if (selectedCategory !== 'all') {
      result = result.filter(r => r.product === selectedCategory);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(r => 
        r.title.toLowerCase().includes(term) ||
        r.comment.toLowerCase().includes(term)
      );
    }
    
    setFilteredReviews(result);
  }, [reviews, selectedCategory, searchTerm]);

  return (
    <div className="app-container">
      <Header />
      <main className="forum-main">
        <h1 className="forum-title">Client Reviews</h1>
        
        {loading ? (
          <div className="loading">Loading reviews...</div>
        ) : (
          <div className="reviews-grid">
            {filteredReviews.map(review => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}
        
        {!loading && filteredReviews.length === 0 && (
          <p className="no-results">No reviews found</p>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Forum;