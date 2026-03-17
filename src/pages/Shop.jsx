import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPublicProducts } from '../redux/slices/productSlice';
import ProductGrid from '../components/User/ProductGrid';
import TopNav from '../components/User/TopNav';
import InstagramStories from '../components/User/InstagramStories';
import { Link } from 'react-router-dom';

const Shop = () => {
  const dispatch = useDispatch();
  const { publicItems, publicStatus } = useSelector((s) => s.products);

  // We map state directly here because your productSlice creates .items 
  // Let's ensure compatibility.
  const items = useSelector(s => s.products.items) || [];
  const status = useSelector(s => s.products.status) || 'idle';

  useEffect(() => {
    dispatch(fetchPublicProducts());
  }, [dispatch]);

  // Video items for Gen Z Instagram Story mode
  const videoItems = items.filter(i => i.video);

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 pb-20 font-sans">
      <TopNav />

      {videoItems.length > 0 && (
         <InstagramStories items={videoItems} />
      )}

      {/* Catalog */}
      <div className="px-4 max-w-6xl mx-auto">

        <div id="catalog" className="pt-4 text-center sm:text-left">
           <div className="flex items-end justify-between mb-6">
              <h3 className="text-2xl font-black text-slate-900">New Arrivals</h3>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{items.length} items</span>
           </div>
           
           <ProductGrid items={items} status={status} />
        </div>
      </div>
    </div>
  );
};

export default Shop;
