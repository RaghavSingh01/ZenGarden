import React from 'react';
import MenuFilters from '../../features/menu/MenuFilters.jsx';
import MenuGrid from '../../features/menu/MenuGrid.jsx';
import { useMenu } from '../../features/menu/useMenu.js';

export default function MenuPage() {
  const m = useMenu();

  return (
    <div className="stack" style={{ gap: 12 }}>
      <h2>Menu</h2>
      <MenuFilters
        categories={m.categories}
        initial={m.query}
        onChange={(patch) => m.load(patch)}
      />
      <MenuGrid
        items={m.items}
        total={m.total}
        page={m.query.page}
        limit={m.query.limit}
        onPageChange={(p) => m.load({ page: p })}
        onAddToCart={m.addToCart}
        onViewDetails={m.openDetails}
        selectedDish={m.selectedDish}
        onCloseDetails={m.closeDetails}
      />
    </div>
  );
}