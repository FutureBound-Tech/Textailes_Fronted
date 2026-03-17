import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import TopNav from '../components/User/TopNav';
import { clearCart } from '../redux/slices/cartSlice';
import { phoneLogin } from '../redux/slices/authSlice';
import { createOrder } from '../redux/slices/orderSlice';

const Checkout = () => {
  const { items } = useSelector((s) => s.cart);
  const { user, status: authStatus } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');

  // Auto-skip login if already verified
  useEffect(() => {
    if (user && step === 1) {
      setStep(2);
    }
  }, [user, step]);

  const [address, setAddress] = useState({
    doorNumber: '',
    streetName: '',
    area: '',
    village: '',
    mandal: '',
    district: '',
    state: '',
    pincode: ''
  });

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleAuth = async (e) => {
    e.preventDefault();
    if (phone.length < 10) return alert('Enter a valid 10-digit mobile number');
    
    setLoading(true);
    const result = await dispatch(phoneLogin({ phone, name }));
    if (phoneLogin.fulfilled.match(result)) {
      setStep(2);
    } else {
      alert(result.payload || 'Login failed');
    }
    setLoading(false);
  };

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    const orderPayload = {
      items,
      subtotal,
      total: subtotal,
      shippingAddress: address,
      paymentMethod: 'Cash On Delivery',
      paymentId: null,
    };

    const result = await dispatch(createOrder(orderPayload));

    if (createOrder.fulfilled.match(result)) {
      dispatch(clearCart());
      setStep(3);
    } else {
      alert('Failed to place order. Try again.');
    }
    setLoading(false);
  };

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ];

  if (items.length === 0 && step !== 3) {
    return (
      <div className="bg-slate-50 min-h-[100dvh] font-sans">
        <TopNav />
        <div className="flex flex-col items-center justify-center p-10 h-[60vh]">
          <h2 className="text-2xl font-black text-slate-800 mb-4">Cart is Empty</h2>
          <button onClick={() => navigate('/')} className="bg-black text-white px-8 py-3 rounded-full font-bold shadow-xl">Return to Shop</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-[100dvh] pb-20 font-sans">
      <TopNav />
      
      <div className="max-w-xl mx-auto px-6 py-8">
        
        {step === 1 && !user && (
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 flex flex-col items-center text-center">
             <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
             </div>
             <h1 className="text-2xl font-black tracking-tighter text-slate-900 mb-2">Secure Login</h1>
             <p className="text-sm font-medium text-slate-500 mb-8 max-w-sm">
                Enter your mobile number to sign in via Truecaller. No passwords needed.
             </p>
             
             <form onSubmit={handleAuth} className="w-full space-y-4">
                <input 
                   type="text" 
                   required
                   placeholder="Enter Your Name" 
                   className="w-full bg-slate-100 border-none rounded-2xl px-4 py-4 text-base font-bold text-slate-900 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                   value={name}
                   onChange={(e) => setName(e.target.value)}
                />
                <div className="relative flex items-center text-left">
                   <div className="absolute left-4 font-bold text-slate-900">+91</div>
                   <input 
                      type="tel" 
                      required
                      placeholder="Enter Mobile Number" 
                      className="w-full bg-slate-100 border-none rounded-2xl pl-14 pr-4 py-4 text-lg font-bold text-slate-900 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                   />
                </div>
                <button 
                  type="submit" 
                  disabled={loading || phone.length < 10}
                  className="w-full bg-[#0070FF] hover:bg-[#005BCC] text-white py-4 rounded-2xl font-black uppercase tracking-widest active:scale-95 transition-all shadow-[0_8px_30px_rgba(0,112,255,0.3)] disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center h-[56px]"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Verify with Truecaller'
                  )}
                </button>
             </form>
          </div>
        )}

        {step === 2 && user && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100">
             <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-100">
                <div className="w-12 h-12 bg-[#0070FF] text-white rounded-full flex items-center justify-center font-bold text-lg shadow-sm">
                   {user.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 tracking-tight leading-tight">{user.name}</h3>
                  <p className="text-xs font-bold text-slate-400 font-mono tracking-wider">+91 {user.phone}</p>
                </div>
                <div className="ml-auto">
                   <span className="bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md">Verified</span>
                </div>
             </div>
             
             <h2 className="text-xl font-black text-slate-900 tracking-tighter mb-6">Delivery Details</h2>
             
             <form onSubmit={placeOrder} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1 ml-1">Door Number</label>
                    <input required type="text" name="doorNumber" value={address.doorNumber} onChange={handleAddressChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-colors" placeholder="e.g. 1-23/A" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1 ml-1">Street Name</label>
                    <input required type="text" name="streetName" value={address.streetName} onChange={handleAddressChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-colors" placeholder="e.g. MG Road" />
                  </div>
                </div>

                <div>
                   <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1 ml-1">Area / Locality</label>
                   <input required type="text" name="area" value={address.area} onChange={handleAddressChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-colors" placeholder="e.g. Banjara Hills" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1 ml-1">Village/City</label>
                    <input required type="text" name="village" value={address.village} onChange={handleAddressChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-colors" placeholder="e.g. Hyderabad" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1 ml-1">Mandal</label>
                    <input required type="text" name="mandal" value={address.mandal} onChange={handleAddressChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-colors" placeholder="e.g. Khairatabad" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1 ml-1">District</label>
                    <input required type="text" name="district" value={address.district} onChange={handleAddressChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-colors" placeholder="e.g. Hyderabad" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1 ml-1">Pincode</label>
                    <input required type="text" name="pincode" maxLength={6} pattern="[0-9]{6}" value={address.pincode} onChange={handleAddressChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-colors" placeholder="e.g. 500034" />
                  </div>
                </div>

                <div>
                   <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1 ml-1">State (India Only)</label>
                   <select required name="state" value={address.state} onChange={handleAddressChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-colors appearance-none text-slate-700">
                      <option value="" disabled>Select State</option>
                      {indianStates.map(state => <option key={state} value={state}>{state}</option>)}
                   </select>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                   <div className="text-left">
                     <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Amount</p>
                     <p className="text-xl font-black text-slate-900 tracking-tighter">₹{subtotal}</p>
                   </div>
                   <button 
                     type="submit" 
                     disabled={loading}
                     className="bg-black hover:bg-slate-800 text-white px-8 py-4 rounded-full font-black uppercase text-xs tracking-widest shadow-[0_8px_30px_rgba(0,0,0,0.15)] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center min-w-[160px]"
                   >
                     {loading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                     ) : 'Place Order'}
                   </button>
                </div>
             </form>

          </div>
        )}

        {step === 3 && (
           <div className="bg-white rounded-3xl p-10 shadow-xl border border-slate-100 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                 <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><path d="m9 11 3 3L22 4"></path></svg>
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tighter mb-4">You're All Set!</h1>
              <p className="text-slate-500 font-medium text-sm leading-relaxed mb-8 max-w-xs">
                 Your beautiful saree is officially being prepared for dispatch. We will deliver it securely to your door.
              </p>
              
              <div className="w-full bg-slate-50 rounded-2xl p-4 text-left mb-8 border border-slate-100">
                 <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Delivering To</h4>
                 <p className="text-xs font-bold text-slate-800 leading-relaxed">
                   {user?.name} <br />
                   {address.doorNumber}, {address.streetName}, {address.area}<br />
                   {address.village}, {address.mandal}, {address.district}<br />
                   {address.state} - {address.pincode}
                 </p>
              </div>

              <div className="flex gap-4 w-full">
                <button 
                  onClick={() => navigate('/profile')}
                  className="flex-1 bg-black text-white py-4 rounded-full font-black uppercase text-xs tracking-widest active:scale-95 transition-transform"
                >
                  View Orders
                </button>
                <button 
                  onClick={() => navigate('/')}
                  className="flex-1 bg-slate-100 text-slate-900 border border-slate-200 hover:bg-slate-200 py-4 rounded-full font-black uppercase text-xs tracking-widest active:scale-95 transition-transform"
                >
                  Keep Shopping
                </button>
              </div>
           </div>
        )}

      </div>
    </div>
  );
};

export default Checkout;
