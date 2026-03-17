import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import TopNav from '../components/User/TopNav';
import { fetchPublicProductById } from '../redux/slices/productSlice';
import { addToCart } from '../redux/slices/cartSlice';
import { API_BASE_URL } from '../config/api';

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentProduct: current, currentStatus } = useSelector((s) => s.products);
  
  const [selectedColor, setSelectedColor] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    dispatch(fetchPublicProductById(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (current && current.colors) {
      let colorsArray = Array.isArray(current.colors) ? current.colors : current.colors.split(',').map(c => c.trim()).filter(Boolean);
      if (colorsArray.length > 0) {
        setSelectedColor(colorsArray[0]);
      } else {
        setSelectedColor('');
      }
    }
    setActiveIndex(0); // reset active index on product change
  }, [current]);

  const getMediaUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const baseUrl = API_BASE_URL;
    return `${baseUrl}${path}`;
  };

  const handleAddToCart = () => {
    if (!current) return;
    dispatch(
      addToCart({
        id: current.id || current._id,
        name: current.name,
        price: current.price,
        images: current.images,
        qty: 1,
        selectedColor: selectedColor || null,
      })
    );
    navigate('/cart');
  };

  if (currentStatus === 'loading') {
    return (
       <div className="flex justify-center items-center h-[100dvh]">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
       </div>
    );
  }

  if (!current) {
    return (
       <div className="flex h-[100dvh] flex-col items-center justify-center bg-slate-50 p-6 space-y-4">
         <h1 className="text-3xl font-black text-slate-800 tracking-tighter">404 Vibe Not Found</h1>
         <Link to="/" className="bg-black text-white px-6 py-3 rounded-full font-bold">Back Home</Link>
       </div>
    );
  }

  const colors = Array.isArray(current.colors) ? current.colors : (current.colors ? current.colors.split(',').map(c => c.trim()).filter(Boolean) : []);
  
  // Combine video + images for the carousel
  const mediaList = [];
  if (current.video) mediaList.push({ type: 'video', url: getMediaUrl(current.video) });
  if (current.images?.length > 0) {
    current.images.forEach(img => mediaList.push({ type: 'image', url: getMediaUrl(img) }));
  }

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? mediaList.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === mediaList.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="bg-white min-h-[100dvh] pb-32 font-sans overflow-x-hidden relative">
      <TopNav />
      
      <div className="max-w-6xl mx-auto md:px-6 pt-4 md:pt-10 flex flex-col md:flex-row gap-10">
        
        {/* Left Column: Media Gallery */}
        <div className="w-full md:w-1/2 flex flex-col select-none">
          {/* Main Large Display */}
          <div className="relative aspect-[4/5] sm:aspect-square md:rounded-3xl overflow-hidden bg-slate-100 group shadow-[0_20px_50px_rgb(0,0,0,0.06)] border border-slate-200/50">
            {mediaList.length === 0 ? (
               <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold">No Image Available</div>
            ) : mediaList[activeIndex].type === 'video' ? (
               <video 
                 src={mediaList[activeIndex].url} 
                 autoPlay={isPlaying} 
                 loop 
                 muted 
                 playsInline 
                 className="w-full h-full object-cover transition-opacity duration-300" 
                 onClick={() => setIsPlaying(!isPlaying)}
               />
            ) : (
               <img 
                 src={mediaList[activeIndex].url} 
                 alt={current.name} 
                 className="w-full h-full object-cover transition-opacity duration-300" 
               />
            )}

            {/* Side Navigation Arrows (Desktop overlay & Mobile via buttons) */}
            {mediaList.length > 1 && (
               <>
                 <button 
                   onClick={handlePrev} 
                   className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur opacity-0 group-hover:opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all rounded-full flex items-center justify-center text-slate-800 shadow-md hover:bg-white hover:scale-105"
                 >
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"></path></svg>
                 </button>
                 <button 
                   onClick={handleNext} 
                   className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur opacity-0 group-hover:opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all rounded-full flex items-center justify-center text-slate-800 shadow-md hover:bg-white hover:scale-105"
                 >
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"></path></svg>
                 </button>
               </>
            )}

            {/* Video Badge */}
            {mediaList[activeIndex]?.type === 'video' && (
              <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md rounded-full px-3 py-1 text-xs font-bold text-white shadow-sm flex items-center gap-2">
                 {isPlaying ? (
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                 ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                 )}
                 {isPlaying ? 'PLAYING' : 'PAUSED'}
              </div>
            )}
            
            {/* Mobile View Indicators inside the image on small screens */}
            <div className="absolute bottom-4 left-0 right-0 flex md:hidden justify-center gap-2 z-10 pointer-events-none">
               {mediaList.map((_, idx) => (
                  <div 
                     key={idx} 
                     className={`w-2 h-2 rounded-full shadow-sm transition-all duration-300 ${activeIndex === idx ? 'bg-white scale-125' : 'bg-white/50'}`} 
                  />
               ))}
            </div>
          </div>

          {/* Thumbnails Row below main image */}
          {mediaList.length > 1 && (
             <div className="flex gap-3 mt-4 overflow-x-auto pb-2 scrollbar-hide px-4 md:px-0">
               {mediaList.map((m, idx) => (
                 <button 
                   key={idx} 
                   onClick={() => setActiveIndex(idx)}
                   className={`relative w-20 h-24 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${activeIndex === idx ? 'border-indigo-600 scale-[1.02] shadow-md ring-2 ring-indigo-600/20' : 'border-transparent opacity-60 hover:opacity-100'}`}
                 >
                   {m.type === 'video' ? (
                      <>
                        <video src={m.url} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="none"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                        </div>
                      </>
                   ) : (
                      <img src={m.url} alt="thumbnail" className="w-full h-full object-cover" />
                   )}
                 </button>
               ))}
             </div>
          )}
        </div>

        {/* Right Column: Details & Actions */}
        <div className="w-full md:w-1/2 flex flex-col px-6 md:px-0 md:py-4">
           
           <div className="mb-8">
              <div className="flex justify-between items-start mb-4">
                 {current.series && (
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 py-1.5 px-3 bg-indigo-50 border border-indigo-100 rounded-md">
                       {current.series}
                    </span>
                 )}
                 <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-md">
                    {current.material || 'Premium Fabric'}
                 </span>
              </div>
              
              <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight mb-4 tracking-tighter">
                {current.name}
              </h1>
              
              <div className="flex items-end gap-3">
                 <p className="text-3xl font-black text-slate-900 tracking-tighter">
                   ₹{current.price}
                 </p>
                 {Number(current.discount) > 0 && (
                   <>
                     <span className="text-xl text-slate-400 line-through font-semibold mb-0.5">
                       ₹{Number(current.price) + Number(current.discount)}
                     </span>
                     <span className="text-sm font-bold text-emerald-600 mb-1 ml-2 bg-emerald-50 px-2 py-1 rounded">
                       SAVE ₹{current.discount}
                     </span>
                   </>
                 )}
              </div>
           </div>

           {/* Color Selection */}
           {colors.length > 0 && (
              <div className="mb-8">
                 <div className="flex justify-between items-center mb-3">
                   <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900">Color</h3>
                   <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-sm">{selectedColor || 'Select one'}</span>
                 </div>
                 <div className="flex flex-wrap gap-2">
                    {colors.map((c) => {
                       return (
                          <button 
                             key={c}
                             onClick={() => setSelectedColor(c)}
                             className={`px-5 py-3 rounded-xl text-sm font-bold border-2 transition-all block ${selectedColor === c ? 'border-slate-900 bg-slate-900 text-white shadow-md' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}
                          >
                             {c}
                          </button>
                       );
                    })}
                 </div>
              </div>
           )}

           {/* Details Accordion / Info Box */}
           <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 space-y-6 border border-slate-100/50 mb-8 md:mb-0 relative">
              
              <div className="absolute top-0 right-8 -translate-y-1/2 w-16 h-16 bg-white shadow-xl rounded-full flex items-center justify-center border border-slate-100 hidden md:flex">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>
              </div>

              <div>
                 <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">The Details</h3>
                 <p className="text-slate-700 text-sm md:text-base leading-relaxed font-medium whitespace-pre-wrap">
                   {current.description || 'Step up your aesthetic with this stunning piece.'}
                 </p>
              </div>
              
              {current.care_instructions && (
                 <div className="pt-6 border-t border-slate-200/60">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Care Info</h3>
                    <p className="text-slate-600 text-sm font-medium">
                      {current.care_instructions}
                    </p>
                 </div>
              )}
           </div>

           {/* Mobile padding hack to prevent sticky overlap */}
           <div className="h-24 md:hidden"></div>
           
           {/* Desktop Add to Cart */}
           <div className="hidden md:flex flex-col mt-auto pt-8">
              <button 
                 onClick={handleAddToCart}
                 disabled={!current.quantity || current.quantity < 1}
                 className="w-full bg-slate-900 hover:bg-black text-white active:scale-[0.98] transition-all rounded-2xl py-5 text-sm font-black uppercase tracking-widest shadow-[0_10px_40px_-10px_rgb(0,0,0,0.5)] disabled:opacity-50 disabled:active:scale-100"
              >
                 {(!current.quantity || current.quantity < 1) ? 'Sold Out' : `Add To Bag • ₹${current.price}`}
              </button>
           </div>
        </div>
      </div>

      {/* Sticky Bottom Action bar for Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 pb-6 bg-white/90 backdrop-blur-xl z-30 border-t border-slate-200 shadow-[0_-10px_40px_rgba(0,0,0,0.08)]">
         <div className="max-w-lg mx-auto flex gap-4">
            <button 
               onClick={handleAddToCart}
               disabled={!current.quantity || current.quantity < 1}
               className="flex-1 bg-slate-900 text-white active:scale-95 transition-all rounded-2xl py-4 text-sm font-black uppercase tracking-widest shadow-xl disabled:opacity-50 disabled:active:scale-100"
            >
               {(!current.quantity || current.quantity < 1) ? 'Sold Out' : `Add To Bag • ₹${current.price}`}
            </button>
         </div>
      </div>
    </div>
  );
};

export default ProductDetail;
