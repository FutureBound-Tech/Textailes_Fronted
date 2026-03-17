import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createProduct } from '../../redux/slices/productSlice';

const ProductUploadForm = ({ initialData = {} }) => {
  const dispatch = useDispatch();
  const { status, error } = useSelector((s) => s.products);
  const [form, setForm] = useState({
    name: '',
    series: '',
    description: '',
    price: '',
    discount: 0,
    quantity: 0,
    material: '',
    colors: '',
    sizes: '',
    careInstructions: '',
  });
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);

  useEffect(() => {
    if (!initialData || Object.keys(initialData).length === 0) return;
    setForm((prev) => ({
      ...prev,
      name: initialData.itemName || prev.name,
      series: initialData.clothType || prev.series,
      description: initialData.description || prev.description,
      price: initialData.pricing?.suggestedPrice ?? prev.price,
      material: initialData.fabric || prev.material,
      colors: Array.isArray(initialData.colors) ? initialData.colors.join(', ') : prev.colors,
      sizes: Array.isArray(initialData.sizes) ? initialData.sizes.join(', ') : prev.sizes,
      careInstructions: initialData.careInstructions || prev.careInstructions,
    }));
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price),
      discount: Number(form.discount),
      quantity: Number(form.quantity),
      colors: form.colors ? form.colors.split(',').map((c) => c.trim()) : [],
      sizes: form.sizes ? form.sizes.split(',').map((s) => s.trim()) : [],
    };
    const media = [...images];
    if (video) media.push(video);
    if (media.length) payload.media = media;
    dispatch(createProduct(payload));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm font-medium text-slate-700">
          Product name
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-200 px-3 py-2"
            required
          />
        </label>
        <label className="space-y-2 text-sm font-medium text-slate-700">
          Series / Collection
          <input
            name="series"
            value={form.series}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-200 px-3 py-2"
          />
        </label>
        <label className="space-y-2 text-sm font-medium text-slate-700">
          Price (INR)
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-200 px-3 py-2"
            required
          />
        </label>
        <label className="space-y-2 text-sm font-medium text-slate-700">
          Discount
          <input
            type="number"
            name="discount"
            value={form.discount}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-200 px-3 py-2"
          />
        </label>
        <label className="space-y-2 text-sm font-medium text-slate-700">
          Quantity
          <input
            type="number"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-200 px-3 py-2"
          />
        </label>
        <label className="space-y-2 text-sm font-medium text-slate-700">
          Material
          <input
            name="material"
            value={form.material}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-200 px-3 py-2"
          />
        </label>
        <label className="space-y-2 text-sm font-medium text-slate-700">
          Colors (comma separated)
          <input
            name="colors"
            value={form.colors}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-200 px-3 py-2"
          />
        </label>
        <label className="space-y-2 text-sm font-medium text-slate-700">
          Sizes (comma separated)
          <input
            name="sizes"
            value={form.sizes}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-200 px-3 py-2"
          />
        </label>
      </div>
      <label className="space-y-2 text-sm font-medium text-slate-700 block">
        Description
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-200 px-3 py-2"
          rows={3}
        />
      </label>
      <label className="space-y-2 text-sm font-medium text-slate-700 block">
        Care instructions
        <textarea
          name="careInstructions"
          value={form.careInstructions}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-200 px-3 py-2"
          rows={2}
        />
      </label>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm font-medium text-slate-700">
          Images (multiple)
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setImages(Array.from(e.target.files))}
            className="w-full"
          />
        </label>
        <label className="space-y-2 text-sm font-medium text-slate-700">
          Video (optional)
          <input type="file" accept="video/*" onChange={(e) => setVideo(e.target.files[0])} className="w-full" />
        </label>
      </div>
      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-white shadow-sm hover:bg-indigo-700"
        disabled={status === 'loading'}
      >
        {status === 'loading' ? 'Uploading...' : 'Upload product'}
      </button>
      {error && <p className="text-sm text-rose-600">{error}</p>}
    </form>
  );
};

export default ProductUploadForm;
