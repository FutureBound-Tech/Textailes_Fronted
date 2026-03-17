import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateProduct } from '../../redux/slices/productSlice';

const EditProductModal = ({ product, onClose }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    series: '',
    price: '',
    discount: '',
    quantity: '',
    material: '',
    colors: '',
    sizes: '',
    description: '',
    careInstructions: ''
  });
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        series: product.series || '',
        price: product.price || 0,
        discount: product.discount || 0,
        quantity: product.quantity || 0,
        material: product.material || '',
        colors: Array.isArray(product.colors) ? product.colors.join(', ') : (product.colors || ''),
        sizes: Array.isArray(product.sizes) ? product.sizes.join(', ') : (product.sizes || ''),
        description: product.description || '',
        careInstructions: product.care_instructions || ''
      });
    }
  }, [product]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      for (const key in formData) {
         if (key === 'colors' || key === 'sizes') {
           const items = formData[key].split(',').map(s => s.trim()).filter(Boolean);
           items.forEach(item => fd.append(key, item));
         } else {
           fd.append(key, formData[key]);
         }
      }
      images.forEach(f => fd.append('images', f));

      await dispatch(updateProduct({ id: product.id || product._id, formData: fd })).unwrap();
      onClose(); // close modal on success
    } catch (err) {
      console.error('Update failed:', err);
      alert('Failed to update product: ' + err);
    } finally {
      setLoading(false);
    }
  };

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">Edit Product</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700 bg-slate-100 px-3 py-1 rounded-md">Close</button>
        </div>
        
        <form onSubmit={handleSave} className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Product Name</label>
              <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border-slate-300 rounded-md text-sm p-2 bg-slate-50 border focus:bg-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Series/Collection</label>
              <input type="text" name="series" value={formData.series} onChange={handleChange} className="w-full border-slate-300 rounded-md text-sm p-2 bg-slate-50 border focus:bg-white" />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Price</label>
              <input required type="number" name="price" value={formData.price} onChange={handleChange} className="w-full border-slate-300 rounded-md text-sm p-2 bg-slate-50 border focus:bg-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Discount</label>
              <input type="number" name="discount" value={formData.discount} onChange={handleChange} className="w-full border-slate-300 rounded-md text-sm p-2 bg-slate-50 border focus:bg-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Quantity</label>
              <input required type="number" name="quantity" value={formData.quantity} onChange={handleChange} className="w-full border-slate-300 rounded-md text-sm p-2 bg-slate-50 border focus:bg-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Material</label>
              <input type="text" name="material" value={formData.material} onChange={handleChange} className="w-full border-slate-300 rounded-md text-sm p-2 bg-slate-50 border focus:bg-white" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Colors (Comma separated)</label>
              <input type="text" name="colors" value={formData.colors} onChange={handleChange} className="w-full border-slate-300 rounded-md text-sm p-2 bg-slate-50 border focus:bg-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Sizes (Comma separated)</label>
              <input type="text" name="sizes" value={formData.sizes} onChange={handleChange} className="w-full border-slate-300 rounded-md text-sm p-2 bg-slate-50 border focus:bg-white" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Care Instructions</label>
            <input type="text" name="careInstructions" value={formData.careInstructions} onChange={handleChange} className="w-full border-slate-300 rounded-md text-sm p-2 bg-slate-50 border focus:bg-white" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="4" className="w-full border-slate-300 rounded-md text-sm p-2 bg-slate-50 border focus:bg-white" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Upload New Images (Overwrites existing)</label>
            <input type="file" multiple accept="image/*" onChange={handleFileChange} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
            {product.images?.length > 0 && <p className="text-xs text-slate-500 mt-2">Currently has {product.images.length} image(s). Uploading new ones will replace them.</p>}
          </div>

          <div className="border-t border-slate-200 pt-4 flex justify-end gap-2">
            <button type="button" onClick={onClose} disabled={loading} className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 text-sm font-medium hover:bg-slate-50">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium disabled:opacity-50">
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;
