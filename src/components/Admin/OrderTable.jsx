import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '../../redux/slices/orderSlice';
import StatusBadge from './StatusBadge';
import { API_BASE_URL } from '../../config/api';

const OrderTable = () => {
  const dispatch = useDispatch();
  const { items, status } = useSelector((s) => s.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const getMediaUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const baseUrl = API_BASE_URL;
    return `${baseUrl}${path}`;
  };

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <div className="text-sm font-black text-slate-800 uppercase tracking-widest">Recent Orders</div>
        <div className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">{items.length} Records</div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50/50">
            <tr>
              <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Order ID</th>
              <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Date</th>
              <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Items</th>
              <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Total</th>
              <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
              <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Payment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {items.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-10 text-center text-slate-400 font-medium italic">No orders found.</td>
              </tr>
            ) : (
              items.map((o) => (
                <tr key={o.id || o._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-xs font-black text-slate-900 font-mono tracking-tighter">#{o.order_id || o.orderId}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold text-slate-500">
                      {new Date(o.created_at || o.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex -space-x-2">
                       {o.items?.slice(0, 3).map((item, idx) => (
                          <div key={idx} className="w-8 h-10 rounded-lg border-2 border-white overflow-hidden shadow-sm bg-slate-100">
                             <img 
                               src={getMediaUrl(item.images?.[0])} 
                               className="w-full h-full object-cover" 
                               alt="item" 
                             />
                          </div>
                       ))}
                       {o.items?.length > 3 && (
                          <div className="w-8 h-10 rounded-lg border-2 border-white bg-slate-100 flex items-center justify-center text-[8px] font-black text-slate-500 shadow-sm">
                             +{o.items.length - 3}
                          </div>
                       )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-black text-slate-900 tracking-tight">₹{o.total}</span>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge value={o.order_status || o.orderStatus} />
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${o.payment_status === 'completed' ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {o.payment_method || 'COD'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderTable;
