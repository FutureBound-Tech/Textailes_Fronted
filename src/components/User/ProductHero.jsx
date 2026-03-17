import { withCDN } from '../../lib/cdn';

const ProductHero = ({ product }) => {
  const hasVideo = Boolean(product.video);
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">
      {hasVideo ? (
        <video
          src={withCDN(product.video)}
          className="h-[420px] w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        />
      ) : product.images?.length ? (
        <img src={withCDN(product.images[0])} alt={product.name} className="h-[420px] w-full object-cover" />
      ) : (
        <div className="flex h-[420px] items-center justify-center bg-slate-100 text-slate-400">No media</div>
      )}
      <div className="grid gap-3 border-t border-slate-100 p-4 sm:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">{product.series || 'Collection'}</p>
          <h1 className="text-2xl font-bold text-slate-900">{product.name}</h1>
          <p className="text-sm text-slate-600 line-clamp-2">{product.description}</p>
        </div>
        <div className="flex items-center justify-end gap-3">
          <div className="text-3xl font-extrabold text-slate-900">₹{product.final_price ?? product.price}</div>
          {product.discount ? <span className="text-sm text-rose-500">-{product.discount}</span> : null}
        </div>
      </div>
    </div>
  );
};

export default ProductHero;
