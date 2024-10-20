import React from 'react';
import './FilterButtons.css';

interface FilterButtonsProps {
  filter: 'all' | 'completed' | 'pending';
  setFilter: (filter: 'all' | 'completed' | 'pending') => void;
}

export default function FilterButtons({ filter, setFilter }: FilterButtonsProps) {
  return (
    <div className="filter-buttons">
      <button
        onClick={() => setFilter('all')}
        className={`filter-button ${filter === 'all' ? 'active' : ''}`}
      >
        All
      </button>
      <button
        onClick={() => setFilter('completed')}
        className={`filter-button ${filter === 'completed' ? 'active' : ''}`}
      >
        Completed
      </button>
      <button
        onClick={() => setFilter('pending')}
        className={`filter-button ${filter === 'pending' ? 'active' : ''}`}
      >
        Pending
      </button>
    </div>
  );
}