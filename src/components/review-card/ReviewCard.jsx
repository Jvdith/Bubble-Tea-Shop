import { useState } from 'react';
import './ReviewCard.css';

const ReviewCard = ({ review }) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(review.likes);

  const handleLike = () => {
    if (liked) {
      setLikesCount(prev => prev - 1);
    } else {
      setLikesCount(prev => prev + 1);
    }
    setLiked(!liked);
  };

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

      <div className="review-card-footer">
        <button 
          className={`review-card-like ${liked ? 'review-card-liked' : ''}`}
          onClick={handleLike}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <span>{likesCount}</span>
        </button>
      </div>
    </article>
  );
};

export default ReviewCard;