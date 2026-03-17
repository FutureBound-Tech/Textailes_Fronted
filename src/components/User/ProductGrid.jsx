import React from 'react';
import ProductCard from './ProductCard';

const ProductGrid = ({ items = [], status = 'idle' }) => {
  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-48">
         <div className="w-8 h-8 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="text-center bg-white rounded-3xl p-12 shadow-sm border border-slate-100">
        <h3 className="text-xl font-bold text-slate-900 mb-2">No drops yet</h3>
        <p className="text-slate-500 text-sm">Check back later for fresh threads.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
      {items.map((p) => (
        <ProductCard key={p.id || p._id} product={p} />
      ))}
    </div>
  );
};

export default ProductGrid;
