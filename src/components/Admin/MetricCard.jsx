const MetricCard = ({ label, value, tone = 'indigo' }) => {
  const toneClass = {
    indigo: 'bg-indigo-200',
    emerald: 'bg-emerald-200',
    amber: 'bg-amber-200',
    rose: 'bg-rose-200',
  }[tone] || 'bg-slate-200';

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-slate-900">{value}</div>
      <div className={`mt-3 h-1 rounded-full ${toneClass}`}></div>
    </div>
  );
};

export default MetricCard;
