import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/slices/cartSlice';
import { API_BASE_URL } from '../../config/api';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  let colors = Array.isArray(product.colors) ? product.colors : (product.colors ? [product.colors] : []);
  colors = colors.filter(Boolean).map(c => c.trim());

  const getMediaUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const baseUrl = API_BASE_URL;
    return `${baseUrl}${path}`;
  };

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Default to first color if available for quick add
    const selectedColor = colors.length > 0 ? colors[0] : null;
    
    dispatch(addToCart({
      id: product.id || product._id,
      name: product.name,
      price: product.price,
      images: product.images,
      qty: 1,
      selectedColor: selectedColor
    }));
    
    // Add visual feedback
    const btn = e.currentTarget;
    const originalText = btn.innerHTML;
    btn.innerHTML = 'Added ✔';
    btn.classList.add('bg-black', 'text-white');
    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.classList.remove('bg-black', 'text-white');
    }, 1500);
  };

  return (
    <Link 
      to={`/product/${product.id || product._id}`} 
      className="group relative flex flex-col overflow-hidden bg-white border border-slate-100 rounded-2xl md:rounded-3xl hover:shadow-xl transition-all duration-300"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-slate-100">
        <img 
          src={getMediaUrl(product.images?.[0]) || 'https://via.placeholder.com/400x500?text=Saree'} 
          alt={product.name}
          className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500"
          loading="lazy"
        />
        {/* Play Icon if video is attached */}
        {product.video && (
           <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md rounded-full p-2 border border-white/20 shadow-md">
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="none"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
           </div>
        )}
      </div>
      
      <div className="flex flex-col flex-1 p-3 md:p-5 gap-2">
         {/* Small sub header */}
         {product.series ? (
           <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-indigo-500 truncate">{product.series}</span>
         ) : (
           <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-400">Classic</span>
         )}

         <h3 className="text-sm md:text-base font-black text-slate-900 leading-snug line-clamp-2">
            {product.name}
         </h3>

         <div className="flex items-end justify-between mt-auto pt-2">
            <span className="text-sm md:text-lg font-black text-slate-900 tracking-tight">₹{product.price}</span>
            <button 
              onClick={handleQuickAdd}
              className="bg-slate-100 text-slate-900 hover:bg-black hover:text-white rounded-full p-2 md:px-4 md:py-2 flex items-center justify-center transition-colors shadow-sm active:scale-95"
            >
              <span className="hidden md:block text-xs font-bold uppercase tracking-wider">Quick Add</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="md:hidden">
                 <path d="M5 12h14"></path>
                 <path d="M12 5v14"></path>
              </svg>
            </button>
         </div>
      </div>
    </Link>
  );
};

export default ProductCard;
