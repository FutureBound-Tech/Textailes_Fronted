import AIProductUpload from '../components/Admin/AIProductUpload';
import ProductTable from '../components/Admin/ProductTable';

const ProductUpload = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">Product Upload</h1>
      <p className="text-sm text-slate-500">Add sarees with images, video, and rich metadata. Use AI to pre-fill details.</p>
    </div>

    <AIProductUpload />
    <ProductTable />
  </div>
);

export default ProductUpload;
