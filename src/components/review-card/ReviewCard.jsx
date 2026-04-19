
import './ReviewCard.css';

const ReviewCard = ({ review }) => {
  return (
    <article className="review-card">
      <h3 className="review-card-author">{review.author}</h3>
      
      <div className="review-card-stars">
        {[1, 2, 3, 4, 5].map(num => (
          <span 
            key={num} 
            className={`star ${num <= review.rating ? 'star-filled' : ''}`}
          >
            ★
          </span>
        ))}
      </div>
      
      <p className="review-card-comment">{review.comment}</p>
    </article>
  );
};

export default ReviewCard;