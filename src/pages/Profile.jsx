import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import TopNav from '../components/User/TopNav';
import { fetchUserOrders } from '../redux/slices/orderSlice';
import { phoneLogin, logout } from '../redux/slices/authSlice';
import { API_BASE_URL } from '../config/api';

const Profile = () => {
  const { user } = useSelector((s) => s.auth);
  const { items, status } = useSelector((s) => s.orders);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [authPhone, setAuthPhone] = useState('');
  const [authName, setAuthName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      dispatch(fetchUserOrders());
    }
  }, [user, dispatch]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (authPhone.length < 10) return alert('Enter a valid 10-digit mobile number');
    
    setLoading(true);
    const result = await dispatch(phoneLogin({ phone: authPhone, name: authName }));
    if (!phoneLogin.fulfilled.match(result)) {
      alert(result.payload || 'Login failed');
    }
    setLoading(false);
  };

  const getMediaUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const baseUrl = API_BASE_URL;
    return `${baseUrl}${path}`;
  };

  if (!user) {
    return (
      <div className="bg-slate-50 min-h-[100dvh] font-sans pb-20">
        <TopNav />
        <div className="max-w-xl mx-auto px-6 py-12">
           <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 flex flex-col items-center text-center">
             <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
             </div>
             <h1 className="text-2xl font-black tracking-tighter text-slate-900 mb-2">My Account</h1>
             <p className="text-sm font-medium text-slate-500 mb-8 max-w-sm">
                Enter your mobile number to view your orders and track shipments.
             </p>
             
             <form onSubmit={handleLogin} className="w-full space-y-4">
                <input 
                   type="text" 
                   required
                   placeholder="Enter Your Name" 
                   className="w-full bg-slate-100 border-none rounded-2xl px-4 py-4 text-base font-bold text-slate-900 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                   value={authName}
                   onChange={(e) => setAuthName(e.target.value)}
                />
                <div className="relative flex items-center text-left">
                   <div className="absolute left-4 font-bold text-slate-900">+91</div>
                   <input 
                      type="tel" 
                      required
                      placeholder="Enter Mobile Number" 
                      className="w-full bg-slate-100 border-none rounded-2xl pl-14 pr-4 py-4 text-lg font-bold text-slate-900 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                      maxLength={10}
                      value={authPhone}
                      onChange={(e) => setAuthPhone(e.target.value.replace(/\D/g, ''))}
                   />
                </div>
                <button 
                  type="submit" 
                  disabled={loading || authPhone.length < 10}
                  className="w-full bg-[#0070FF] hover:bg-[#005BCC] text-white py-4 rounded-2xl font-black uppercase tracking-widest active:scale-95 transition-all shadow-[0_8px_30px_rgba(0,112,255,0.3)] disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center h-[56px]"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Login with Truecaller'
                  )}
                </button>
             </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-[100dvh] pb-20 font-sans">
      <TopNav />
      
      <div className="max-w-4xl mx-auto px-6 py-8">
         <div className="flex flex-col md:flex-row items-center md:items-start justify-between mb-10 gap-6">
            <div className="flex items-center gap-4">
               <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-black text-3xl shadow-inner border border-indigo-200">
                  {user.name?.charAt(0) || 'U'}
               </div>
               <div>
                 <h1 className="text-3xl font-black text-slate-900 tracking-tighter mb-1">{user.name}</h1>
                 <p className="text-sm font-bold text-slate-500 font-mono tracking-widest">+91 {user.phone}</p>
               </div>
            </div>
            <button 
               onClick={() => {
                  dispatch(logout());
                  navigate('/');
               }}
               className="bg-red-50 text-red-600 hover:bg-red-100 font-bold px-6 py-2 rounded-full transition-colors text-sm uppercase tracking-widest"
            >
               Sign Out
            </button>
         </div>

         <div className="space-y-6">
            <h2 className="text-xl font-black tracking-tighter text-slate-900 border-b border-slate-200 pb-3">My Orders</h2>

            {status === 'loading' && (
               <div className="flex justify-center py-10">
                 <div className="w-8 h-8 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
               </div>
            )}

            {status === 'succeeded' && items.length === 0 && (
               <div className="text-center py-12 bg-white rounded-3xl border border-slate-100 shadow-sm">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mx-auto mb-4">
                     <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"></path><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"></path><path d="M2 7h20"></path><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7"></path></svg>
                  </div>
                  <h3 className="text-lg font-black text-slate-800 tracking-tight">No orders yet</h3>
                  <p className="text-sm font-medium text-slate-500 mt-1 mb-6">You haven't purchased any drops.</p>
                  <button onClick={() => navigate('/')} className="bg-black text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-md hover:bg-zinc-800 transition-colors">Start Shopping</button>
               </div>
            )}

            {status === 'succeeded' && items.map((order) => (
               <div key={order.id || order._id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-6">
                  
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 border-b border-slate-100 pb-4 gap-4">
                     <div>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Order Placed On</p>
                       <p className="text-sm font-black text-slate-800 tracking-tight">
                         {new Date(order.created_at || order.createdAt).toLocaleDateString('en-IN', {
                            year: 'numeric', month: 'short', day: 'numeric'
                         })}
                       </p>
                     </div>
                     <div>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Amount</p>
                       <p className="text-base font-black text-slate-800 tracking-tight">₹{order.total}</p>
                     </div>
                     <div className="flex flex-col sm:items-end">
                       <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-1 max-w-max ${
                          order.order_status === 'pending' ? 'bg-amber-100 text-amber-700' :
                          order.order_status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                          order.order_status === 'delivered' ? 'bg-emerald-100 text-emerald-700' :
                          'bg-slate-100 text-slate-700'
                       }`}>
                         {order.order_status}
                       </span>
                       <p className="text-[10px] font-bold text-slate-400 font-mono tracking-widest">
                         #{order.order_id}
                       </p>
                     </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-6">
                     <div className="flex-1 space-y-4">
                        {(order.items || []).map((item, idx) => (
                           <div key={idx} className="flex gap-4">
                             <div className="w-16 h-20 bg-slate-100 rounded-xl overflow-hidden shadow-sm border border-slate-50 flex-shrink-0">
                                <img src={getMediaUrl(item.images?.[0])} alt={item.name} className="w-full h-full object-cover" />
                             </div>
                             <div className="flex flex-col justify-center">
                                <h4 className="text-sm font-black text-slate-900 leading-tight mb-1">{item.name}</h4>
                                {item.selectedColor && (
                                   <div className="inline-block text-[10px] font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-sm mb-1 max-w-max">
                                      {item.selectedColor}
                                   </div>
                                )}
                                <p className="text-xs font-bold text-slate-500">Qty: {item.qty} × ₹{item.price}</p>
                             </div>
                           </div>
                        ))}
                     </div>
                     
                     <div className="md:w-64 bg-slate-50 rounded-2xl p-4 border border-slate-100">
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 border-b border-slate-200 pb-1">Delivery Address</h4>
                        {order.shipping_address ? (
                           <p className="text-xs font-bold text-slate-700 leading-relaxed">
                             {order.shipping_address.doorNumber}, {order.shipping_address.streetName}<br />
                             {order.shipping_address.area}, {order.shipping_address.village}<br />
                             {order.shipping_address.district}, {order.shipping_address.state} - {order.shipping_address.pincode}
                           </p>
                        ) : (
                           <p className="text-xs font-bold text-slate-400">Address not detailed</p>
                        )}
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-4 border-b border-slate-200 pb-1">Payment Method</h4>
                        <p className="text-xs font-bold text-slate-700 mt-1">{order.payment_method}</p>
                     </div>
                  </div>

               </div>
            ))}

         </div>
      </div>
    </div>
  );
};

export default Profile;
