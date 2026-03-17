import MetricCard from '../components/Admin/MetricCard';
import ProductTable from '../components/Admin/ProductTable';
import OrderTable from '../components/Admin/OrderTable';
import AISareeUpload from '../components/Admin/AISareeUpload';

const AdminDashboard = () => {
  const metrics = [
    { label: 'Total Products', value: '128', tone: 'indigo' },
    { label: 'Total Orders', value: '542', tone: 'emerald' },
    { label: 'Revenue (MoM)', value: '₹8.4L', tone: 'amber' },
    { label: 'Pending Orders', value: '23', tone: 'rose' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500">Quick view of products, orders, and revenue.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => (
          <MetricCard key={m.label} {...m} />
        ))}
      </div>
      
      {/* Add AI extractor */}
      <section className="my-8">
        <AISareeUpload />
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <ProductTable />
        <OrderTable />
      </div>
    </div>
  );
};

export default AdminDashboard;
