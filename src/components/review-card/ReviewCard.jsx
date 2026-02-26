import { useState } from 'react';
import './ReviewCard.css';

const ReviewCard = ({ review }) => {
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`star ${i <= review.rating ? 'star-filled' : ''}`}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <article className="review-card">
      <div className="review-card-header">
        <div className="review-card-user">
          <h3 className="review-card-author">{review.author}</h3>
          <div>
             <span className="review-card-date">{review.date}</span>
          </div>
        </div>
      </div>

      <div className="review-card-rating">
        <div className="review-card-stars">{renderStars()}</div>
        <span className="review-card-rating-text">{review.rating}/5</span>
      </div>

      <h4 className="review-card-title">{review.title}</h4>
      <p className="review-card-comment">{review.comment}</p>

      <div className="review-card-footer"></div>
    </article>
  );
};

export default ReviewCard;