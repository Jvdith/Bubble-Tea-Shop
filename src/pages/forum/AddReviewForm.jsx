import { useState, useEffect } from 'react';
import { addReview } from '../../firebase-config/Firebase';
import './AddReviewForm.css';

const AddReviewForm = ({ onReviewAdded, onUpdate, editingReview, onCancel }) => {
  const [formData, setFormData] = useState({
    author: '',
    rating: 5,
    comment: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
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
    console.log("onUpdate");
    await onUpdate(editingReview.id, formData);
  } 
 
  else {
    console.log("addReview");
    const result = await addReview(formData);
    if (result.success) {
      console.log("onReviewAdded");
      onReviewAdded(); 
    } else {
      setErrorMessage('Error, try again!');
    }
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

       <div className="form-actions">
          <button 
            type="button" 
            className="btn-cancel"
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="btn-submit-review"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : (editingReview ? 'Update' : 'Publish')}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AddReviewForm;