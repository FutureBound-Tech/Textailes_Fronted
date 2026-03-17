import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, deleteProduct } from '../../redux/slices/productSlice';
import StatusBadge from './StatusBadge';
import EditProductModal from './EditProductModal';
import { API_BASE_URL } from '../../config/api';

const ProductTable = () => {
  const dispatch = useDispatch();
  const { items, status } = useSelector((state) => state.products);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    dispatch(fetchProducts({ limit: 50 }));
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      dispatch(deleteProduct(id));
      dispatch(fetchProducts({ limit: 50 })); // refresh table
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/150';
    if (imagePath.startsWith('http')) return imagePath;
    const baseUrl = API_BASE_URL;
    return `${baseUrl}${imagePath}`;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 col-span-1 lg:col-span-2">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-slate-800">Recent Products</h2>
      </div>

      {status === 'loading' ? (
        <p className="text-sm text-slate-500">Loading products...</p>
      ) : items && items.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-sm text-slate-500">
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Quantity</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => {
                const id = p.id || p._id;
                return (
                  <tr key={id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={getImageUrl(p.images?.[0])}
                          alt={p.name}
                          className="h-10 w-10 rounded-md object-cover bg-slate-100"
                        />
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{p.name}</p>
                          <p className="text-xs text-slate-500">{p.series || 'No Series'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">₹{p.price}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{p.quantity ?? 0}</td>
                    <td className="px-4 py-3 text-sm">
                      <StatusBadge value={p.quantity > 0 ? 'In stock' : 'Out'} />
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      <button
                        onClick={() => setEditingProduct(p)}
                        className="text-indigo-600 hover:text-indigo-800 font-medium mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(id)}
                        className="text-red-500 hover:text-red-700 font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-sm text-slate-500">No products available. Add a new saree to see it here.</p>
      )}

      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => {
            setEditingProduct(null);
            dispatch(fetchProducts({ limit: 50 })); // Refresh after closing modal to get updated fields
          }}
        />
      )}
    </div>
  );
};

export default ProductTable;
