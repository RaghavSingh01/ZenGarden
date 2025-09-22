import React from 'react';

 function MenuCard({
  id,
  name,
  description,
  price,
  category,
  image,
  available = true,
  popular = false,
  onAddToCart,
  onViewDetails
}) {
  return (
    <div className="zg-card">
      <div className="zg-card-media">
        <img
          src={image}
          alt={name}
          className="zg-card-img"
          loading="lazy"
        />
        {popular && <span className="zg-badge zg-badge-accent">Popular</span>}
        {!available && <span className="zg-badge zg-badge-muted">Unavailable</span>}
      </div>

      <div className="zg-card-body">
        <div className="zg-card-header">
          <h3 className="zg-card-title">{name}</h3>
          <span className="zg-card-price">₹{price?.toFixed(2)}</span>
        </div>

        <p className="zg-card-desc" title={description}>
          {description}
        </p>

        <div className="zg-card-meta">
          <span className="zg-chip">{category}</span>
        </div>

        <div className="zg-card-actions">
          <button
            className="zg-btn zg-btn-outline"
            onClick={() => onViewDetails?.(id)}
            aria-label={`View details for ${name}`}
          >
            Details
          </button>
          <button
            className="zg-btn zg-btn-primary"
            onClick={() => onAddToCart?.(id)}
            disabled={!available}
            aria-disabled={!available}
            aria-label={`Add ${name} to cart`}
          >
            {available ? 'Add to Cart' : 'Not Available'}
          </button>
        </div>
      </div>
    </div>
  );
}


export default MenuCard;