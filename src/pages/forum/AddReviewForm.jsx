import { useState } from 'react';
import { addReview } from '../../firebase-config/Firebase';
import './AddReviewForm.css';

const AddReviewForm = ({ onReviewAdded }) => {
  const [formData, setFormData] = useState({
    author: '',
    rating: 5,
    comment: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');


    if (formData.author.length < 2) {
      setErrorMessage('Name is too short');
      setIsSubmitting(false);
      return;
    }

    if (formData.comment.length < 5) {
      setErrorMessage('Review is too short');
      setIsSubmitting(false);
      return;
    }

    const result = await addReview(formData);
    
    if (result.success) {
      setSuccessMessage('The review has been shared!');
      setFormData({
        author: '',
        rating: 5,
        comment: ''
      });
      
      if (onReviewAdded) {
        setTimeout(() => {
          onReviewAdded();
        }, 1500);
      }
    } else {
      setErrorMessage('Error, try again!');
    }
    
    setIsSubmitting(false);
  };

  return (
    <section className="add-review-section">
      <h2 className="add-review-title">Write a Review:</h2>
      <p className="add-review-subtitle">Share your Bubbly experience!</p>
      
      <form onSubmit={handleSubmit} className="add-review-form">
        
        <div className="form-group">
          <label htmlFor="author">Name</label>
          <input
            type="text"
            id="author"
            value={formData.author}
            onChange={(e) => setFormData({...formData, author: e.target.value})}
            placeholder="Write your name here:"
            required
            minLength="2"
          />
        </div>

        <div className="form-group">
          <label htmlFor="rating">Rating</label>
          <div className="rating-selector">
            {[1, 2, 3, 4, 5].map(num => (
              <button
                key={num}
                type="button"
                className={`rating-star ${formData.rating >= num ? 'active' : ''}`}
                onClick={() => setFormData({...formData, rating: num})}
              >
                ★
              </button>
            ))}
            <span className="rating-value">{formData.rating}/5</span>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="comment">Review</label>
          <textarea
            id="comment"
            value={formData.comment}
            onChange={(e) => setFormData({...formData, comment: e.target.value})}
            placeholder="Tell us your experience!"
            rows="4"
            required
            minLength="5"
          />
          <small className="char-count">
            {formData.comment.length}/500 caracteres
          </small>
        </div>

        {successMessage && (
          <div className="form-message success">
            {successMessage}
          </div>
        )}
        
        {errorMessage && (
          <div className="form-message error">
            {errorMessage}
          </div>
        )}

        <button 
          type="submit" 
          className="btn-submit-review"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="spinner"></span>
              Publicando...
            </>
          ) : (
            'Publicar reseña'
          )}
        </button>
      </form>
    </section>
  );
};

export default AddReviewForm;