import './ProductCard.css';

const ProductCard = ({ data, showAddButton = false }) => {
  const { name, price, img, description } = data;

  return (
    <article className="product-card">
      <div className="product-card-image-wrap">
        <img src={img} alt={name} className="product-card-image" loading="lazy" />
      </div>
      <div className="product-card-body">
        <h3 className="product-card-title">{name}</h3>
        <p className="product-card-desc">
          {description || 'Tea with pearls.'}
        </p>
        <div className="product-card-footer">
          <span className="product-card-price">{price}</span>
          {showAddButton && (
            <button type="button" className="product-card-btn">
              Add
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
