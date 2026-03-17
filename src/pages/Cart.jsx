import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart, updateQty, clearCart } from '../redux/slices/cartSlice';
import { Link, useNavigate } from 'react-router-dom';
import TopNav from '../components/User/TopNav';
import { API_BASE_URL } from '../config/api';

// We want to group items by `cartItemId` and show the selectedColor
const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((s) => s.cart);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  const getMediaUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const baseUrl = API_BASE_URL;
    return `${baseUrl}${path}`;
  };

  const handleQtyChange = (cartItemId, newQty) => {
    if (newQty < 1) {
      dispatch(removeFromCart(cartItemId));
    } else {
      dispatch(updateQty({ cartItemId, qty: newQty }));
    }
  };

  return (
    <div className="bg-slate-50 min-h-[100dvh] text-slate-900 pb-20 font-sans">
      <TopNav />

      <div className="max-w-lg md:max-w-3xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-black tracking-tighter">Your Bag</h1>
          {items.length > 0 && (
            <button 
              onClick={() => dispatch(clearCart())}
              className="text-xs font-bold text-slate-500 hover:text-red-500 uppercase tracking-widest transition-colors"
            >
              Clear
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center shadow-sm border border-slate-100 flex flex-col items-center gap-4">
            <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-300">
               <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><path d="M3 6h18"></path><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
            </div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">Your bag is empty</h2>
            <p className="text-slate-500 text-sm font-medium">Looks like you haven't added anything yet.</p>
            <Link 
              to="/" 
              className="mt-4 bg-black text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors shadow-[0_4px_14px_0_rgb(0,0,0,0.39)]"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-4 md:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
               <ul className="divide-y divide-slate-100">
                  {items.map((item) => (
                    <li key={item.cartItemId} className="py-5 flex gap-4 md:gap-6">
                      <Link to={`/product/${item.id}`} className="min-w-fit flex-shrink-0">
                         <div className="h-24 w-20 md:h-32 md:w-28 bg-slate-100 rounded-2xl overflow-hidden border border-slate-100 relative group">
                           <img 
                             src={getMediaUrl(item.images?.[0]) || 'https://via.placeholder.com/150'} 
                             alt={item.name} 
                             className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                           />
                         </div>
                      </Link>
                      
                      <div className="flex-1 flex flex-col pt-1">
                          <div className="flex justify-between items-start gap-2 mb-2">
                             <h3 className="text-sm md:text-lg font-black leading-tight text-slate-900 tracking-tight line-clamp-2 pr-4">{item.name}</h3>
                             <button
                               onClick={() => dispatch(removeFromCart(item.cartItemId))}
                               className="text-slate-400 hover:text-red-500 p-1 -mr-1"
                             >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                             </button>
                          </div>
                          
                          <div className="text-xs md:text-sm font-bold text-slate-500">₹{item.price}</div>
                          {item.selectedColor && (
                             <div className="mt-1 text-xs font-bold uppercase tracking-widest text-indigo-500 bg-indigo-50 inline-block px-2 py-1 rounded-md max-w-max">
                                {item.selectedColor}
                             </div>
                          )}
                          
                          <div className="mt-auto pt-4 flex items-center justify-between">
                            <div className="inline-flex items-center gap-4 border border-slate-200 rounded-full px-1 py-1 bg-white">
                               <button 
                                  onClick={() => handleQtyChange(item.cartItemId, item.qty - 1)}
                                  className="w-7 h-7 flex flex-col justify-center items-center rounded-full bg-slate-50 text-slate-600 hover:bg-slate-200 active:scale-95 transition-all text-xs border border-slate-100"
                               >-</button>
                               <span className="text-xs font-black min-w-[1.2rem] text-center">{item.qty}</span>
                               <button 
                                  onClick={() => handleQtyChange(item.cartItemId, item.qty + 1)}
                                  className="w-7 h-7 flex flex-col justify-center items-center rounded-full bg-slate-50 text-slate-600 hover:bg-slate-200 active:scale-95 transition-all text-xs border border-slate-100"
                               >+</button>
                            </div>
                            <div className="text-sm font-black text-slate-900 justify-end flex tracking-tight">
                              ₹{item.price * item.qty}
                            </div>
                          </div>
                      </div>
                    </li>
                  ))}
               </ul>
            </div>

            {/* Order Summary */}
            <div className="bg-slate-900 rounded-3xl p-6 md:p-8 shadow-2xl text-white">
               <h3 className="text-lg font-black tracking-tighter mb-6">Total Summary</h3>
               
               <div className="flex justify-between text-sm font-medium text-slate-400 mb-3">
                 <span>Subtotal</span>
                 <span className="text-white">₹{subtotal}</span>
               </div>
               <div className="flex justify-between text-sm font-medium text-slate-400 mb-6 pb-6 border-b border-white/10">
                 <span>Taxes & Shipping</span>
                 <span className="text-white">Calculated at checkout</span>
               </div>
               
               <div className="flex justify-between text-xl font-black mb-8">
                 <span>Total</span>
                 <span>₹{subtotal}</span>
               </div>

               <button 
                 onClick={() => {
                   navigate('/checkout');
                 }}
                 className="w-full bg-white text-black py-4 rounded-full text-xs font-black uppercase tracking-widest hover:bg-indigo-50 active:scale-95 transition-all shadow-[0_0_20px_rgb(255,255,255,0.2)]"
               >
                 Go To Checkout ➔
               </button>
            </div>
            
            <div className="text-center pt-2">
              <Link to="/" className="text-xs font-bold text-slate-500 uppercase tracking-widest hover:text-black border-b border-transparent hover:border-black transition-colors pb-1">
                 Or Continue Shopping
              </Link>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
