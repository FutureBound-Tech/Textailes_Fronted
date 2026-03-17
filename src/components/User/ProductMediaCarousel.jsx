import { useEffect, useMemo, useRef, useState } from 'react';
import { withCDN } from '../../lib/cdn';

const AUTO_IMAGE_MS = 5000;
const AUTO_VIDEO_MS = 8000;

const ProductMediaCarousel = ({ images = [], video, price, onPrimary }) => {
  const media = useMemo(() => {
    const items = [];
    if (video) items.push({ type: 'video', src: video });
    images.forEach((img) => items.push({ type: 'image', src: img }));
    return items;
  }, [images, video]);

  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!media.length) return undefined;
    if (timerRef.current) clearTimeout(timerRef.current);
    const current = media[index];
    const delay = current.type === 'video' ? AUTO_VIDEO_MS : AUTO_IMAGE_MS;
    timerRef.current = setTimeout(() => setIndex((i) => (i + 1) % media.length), delay);
    return () => timerRef.current && clearTimeout(timerRef.current);
  }, [media, index]);

  if (!media.length)
    return <div className="flex h-96 items-center justify-center rounded-3xl bg-slate-100 text-slate-400">No media</div>;

  const current = media[index];
  const next = () => setIndex((i) => (i + 1) % media.length);
  const prev = () => setIndex((i) => (i - 1 + media.length) % media.length);

  return (
    <div className="flex gap-3">
      {media.length > 1 && (
        <div className="hidden w-16 flex-col gap-2 overflow-y-auto sm:flex">
          {media.map((m, i) => (
            <button
              key={m.src}
              onClick={() => setIndex(i)}
              className={`aspect-square overflow-hidden rounded-xl border ${
                i === index ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-slate-200'
              }`}
            >
              {m.type === 'video' ? (
                <div className="flex h-full w-full items-center justify-center bg-slate-900 text-[10px] font-semibold text-white">Vid</div>
              ) : (
                <img src={withCDN(m.src)} alt="" className="h-full w-full object-cover" />
              )}
            </button>
          ))}
        </div>
      )}

      <div className="flex-1 space-y-3">
        <div className="relative overflow-hidden rounded-3xl bg-slate-900">
          {current.type === 'video' ? (
            <video
              key={current.src}
              src={withCDN(current.src)}
              className="h-[420px] w-full object-cover sm:h-[520px]"
              autoPlay
              muted
              loop
              controls
              playsInline
            />
          ) : (
            <img key={current.src} src={withCDN(current.src)} alt="" className="h-[420px] w-full object-cover sm:h-[520px]" />
          )}

          {(price || onPrimary) && (
            <div className="absolute bottom-4 left-4 flex items-center gap-3 rounded-full bg-black/60 px-4 py-2 text-white backdrop-blur">
              {price ? <span className="text-lg font-bold">?{price}</span> : null}
              {onPrimary ? (
                <button
                  onClick={onPrimary}
                  className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-900 hover:-translate-y-0.5 transition"
                >
                  View product
                </button>
              ) : null}
            </div>
          )}

          {media.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-slate-900 shadow"
              >
                ‹
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-slate-900 shadow"
              >
                ›
              </button>
            </>
          )}
        </div>

        {media.length > 1 ? (
          <div className="flex gap-2 overflow-x-auto pb-1 sm:hidden">
            {media.map((m, i) => (
              <button
                key={m.src}
                onClick={() => setIndex(i)}
                className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded-2xl border ${
                  i === index ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-slate-200'
                }`}
              >
                {m.type === 'video' ? (
                  <div className="flex h-full w-full items-center justify-center bg-slate-900 text-[10px] font-semibold text-white">Vid</div>
                ) : (
                  <img src={withCDN(m.src)} alt="" className="h-full w-full object-cover" />
                )}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ProductMediaCarousel;
