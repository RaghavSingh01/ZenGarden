// src/features/menu/DishDetailsModal.jsx
import React from 'react';
import Modal from '../../components/UI/Modal.jsx';
import Button from '../../components/UI/Button.jsx';
import Badge from '../../components/UI/Badge.jsx';

export default function DishDetailsModal({ dish, onClose, onAddToCart }) {
  const open = Boolean(dish);
  if (!open) return null;

  const {
    name,
    description,
    price,
    category,
    image,
    ingredients = [],
    allergens = [],
    isAvailable = true,
    popular
  } = dish || {};

  return (
    <Modal open={open} onClose={onClose} title={name}
      primaryAction={isAvailable ? { label: 'Add to Cart', onClick: onAddToCart } : null}
      secondaryAction={{ label: 'Close', onClick: onClose, variant: 'outline' }}
    >
      <div className="stack" style={{ gap: 12 }}>
        {image && (
          <img src={image} alt={name} style={{ width: '100%', height: 220, objectFit: 'cover', borderRadius: 8 }} />
        )}

        <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
          {category && <Badge variant="accent">{category}</Badge>}
          {popular && <Badge variant="accent">Popular</Badge>}
          {!isAvailable && <Badge variant="muted">Unavailable</Badge>}
          <Badge variant="success">₹{Number(price || 0).toFixed(2)}</Badge>
        </div>

        {description && <p className="zg-card-desc">{description}</p>}

        {!!ingredients.length && (
          <div className="stack">
            <strong>Ingredients</strong>
            <div className="row" style={{ gap: 6, flexWrap: 'wrap' }}>
              {ingredients.map((ing, i) => <Badge key={i} variant="info">{ing}</Badge>)}
            </div>
          </div>
        )}

        {!!allergens.length && (
          <div className="stack">
            <strong>Allergens</strong>
            <div className="row" style={{ gap: 6, flexWrap: 'wrap' }}>
              {allergens.map((a, i) => <Badge key={i} variant="warn">{a}</Badge>)}
            </div>
          </div>
        )}

        {!isAvailable && (
          <div className="row" style={{ color: 'var(--zg-color-danger)' }}>
            This dish is currently unavailable.
          </div>
        )}
      </div>
    </Modal>
  );
}