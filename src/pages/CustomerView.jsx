import CustomerList from '../components/Admin/CustomerList';

const CustomerView = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">Customers</h1>
      <p className="text-sm text-slate-500">See who ordered, their contact info, and locations.</p>
    </div>
    <CustomerList />
  </div>
);

export default CustomerView;
