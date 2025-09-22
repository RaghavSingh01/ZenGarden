// src/features/menu/MenuGrid.jsx
import React from 'react';
import MenuCard from '../../components/Cards/MenuCard.jsx';
import Pagination from '../../components/UI/Pagination.jsx';
import DishDetailsModal from './DishDetailsModal.jsx';

export default function MenuGrid({
  items = [],
  total = 0,
  page = 1,
  limit = 12,
  onPageChange,
  onAddToCart,
  onViewDetails,
  selectedDish,
  onCloseDetails
}) {
  return (
    <div className="stack" style={{ gap: 12 }}>
      <div className="row" style={{ gap: 16, flexWrap: 'wrap' }}>
        {items.map((dish) => (
          <div key={dish._id || dish.id} style={{ width: 300 }}>
            <MenuCard
              id={dish._id || dish.id}
              name={dish.name}
              description={dish.description}
              price={dish.price}
              category={dish.category}
              image={dish.image}
              available={dish.isAvailable ?? dish.available}
              popular={dish.popular}
              onAddToCart={() => onAddToCart?.(dish)}
              onViewDetails={() => onViewDetails?.(dish._id || dish.id)}
            />
          </div>
        ))}
        {items.length === 0 && (
          <p className="muted">No dishes found.</p>
        )}
      </div>

      <Pagination
        page={page}
        totalPages={Math.max(1, Math.ceil(total / limit))}
        onChange={onPageChange}
      />

      <DishDetailsModal dish={selectedDish} onClose={onCloseDetails} onAddToCart={() => selectedDish && onAddToCart?.(selectedDish)} />
    </div>
  );
}