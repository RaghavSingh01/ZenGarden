// src/features/menu/MenuFilters.jsx
import React, { useEffect, useState } from 'react';
import Input from '../../components/UI/Input.jsx';
import Select from '../../components/UI/Select.jsx';
import Button from '../../components/UI/Button.jsx';

export default function MenuFilters({
  categories = [],
  initial = {},
  onChange
}) {
  const [search, setSearch] = useState(initial.search || '');
  const [category, setCategory] = useState(initial.category || '');
  const [isAvailable, setIsAvailable] = useState(
    typeof initial.isAvailable === 'boolean' ? initial.isAvailable : true
  );
  const [sort, setSort] = useState(initial.sort || 'popular');

  useEffect(() => {
    const id = setTimeout(() => {
      onChange?.({ search, category, isAvailable, sort, page: 1 });
    }, 300);
    return () => clearTimeout(id);
  }, [search, category, isAvailable, sort, onChange]);

  return (
    <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
      <Input
        name="search"
        placeholder="Search dishes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Select
        name="category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        options={[
          { value: '', label: 'All categories' },
          ...categories
        ]}
      />
      <Select
        name="sort"
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        options={[
          { value: 'popular', label: 'Popular' },
          { value: 'name', label: 'Name' },
          { value: '-createdAt', label: 'Latest' },
          { value: 'price', label: 'Price (low to high)' },
          { value: '-price', label: 'Price (high to low)' }
        ]}
      />
      <label className="row" style={{ gap: 6 }}>
        <input
          type="checkbox"
          checked={isAvailable}
          onChange={(e) => setIsAvailable(e.target.checked)}
        />
        In stock only
      </label>
      <Button variant="outline" onClick={() => onChange?.({ search: '', category: '', isAvailable: true, sort: 'popular', page: 1 })}>
        Reset
      </Button>
    </div>
  );
}