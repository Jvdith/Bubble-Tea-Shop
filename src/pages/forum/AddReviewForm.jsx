import { useState, useEffect } from 'react';
import { addReview } from '../../services/firebaseService';
import './AddReviewForm.css';

const AddReviewForm = ({ onReviewAdded, onUpdate, editingReview, onCancel }) => {
  const [formData, setFormData] = useState({
    author: '',
    rating: 5,
    comment: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (editingReview) {
      setFormData({
        author: editingReview.author,
        rating: editingReview.rating,
        comment: editingReview.comment
      });
    } else {
      setFormData({
        author: '',
        rating: 5,
        comment: ''
      });
    }
  }, [editingReview]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
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

    if (editingReview) {
      await onUpdate(editingReview.id, formData);
    } else {
      const result = await addReview(formData);
      if (result.success) {
        onReviewAdded();
      } else {
        setErrorMessage('Error, try again!');
      }
    }
    
    setIsSubmitting(false);
  };

  return (
    <section className="add-review-section">
      <h2 className="add-review-title">
        {editingReview ? 'Edit Review' : 'Write a Review:'}
      </h2>
      
      <form onSubmit={handleSubmit} className="add-review-form">
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            value={formData.author}
            onChange={(e) => setFormData({...formData, author: e.target.value})}
            placeholder="Your name"
            required
          />
        </div>

        <div className="form-group">
          <label>Rating</label>
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
          <label>Review</label>
          <textarea
            value={formData.comment}
            onChange={(e) => setFormData({...formData, comment: e.target.value})}
            placeholder="Tell us your experience"
            rows="4"
            required
          />
        </div>

        {errorMessage && (
          <div className="form-message error">
            {errorMessage}
          </div>
        )}

        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn-submit-review" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : (editingReview ? 'Update' : 'Publish')}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AddReviewForm;