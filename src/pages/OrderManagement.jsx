import OrderTable from '../components/Admin/OrderTable';

const OrderManagement = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">Order Management</h1>
      <p className="text-sm text-slate-500">Track statuses, payments, and customer delivery details.</p>
    </div>
    <OrderTable />
  </div>
);

export default OrderManagement;
