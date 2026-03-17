import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../config/api';

const InstagramStories = ({ items = [] }) => {
  const navigate = useNavigate();
  // Assume a product has a video if video property is set or some image is a video
  const storyItems = items.filter(i => i.video);

  const [activeIndex, setActiveIndex] = useState(null);
  const videoRef = useRef(null);
  const [progress, setProgress] = useState(0);

  // If there are no video items, don't render stories
  if (!storyItems || storyItems.length === 0) return null;

  const currentStory = activeIndex !== null ? storyItems[activeIndex] : null;

  // Setup auto-advance and progress bar for video
  useEffect(() => {
    let interval;
    if (activeIndex !== null && videoRef.current) {
      const vid = videoRef.current;
      vid.currentTime = 0;
      vid.play().catch(e => console.log('Autoplay prevented:', e));
      setProgress(0);

      const updateProgress = () => {
        if (vid.duration) {
          const val = (vid.currentTime / vid.duration) * 100;
          setProgress(val);
        }
      };

      const handleEnded = () => {
        if (activeIndex < storyItems.length - 1) {
          setActiveIndex(activeIndex + 1);
        } else {
          setActiveIndex(null); // Close on last story ended
        }
      };

      vid.addEventListener('timeupdate', updateProgress);
      vid.addEventListener('ended', handleEnded);

      return () => {
        vid.removeEventListener('timeupdate', updateProgress);
        vid.removeEventListener('ended', handleEnded);
      };
    }
    return () => clearInterval(interval);
  }, [activeIndex, storyItems.length]);

  const handleNext = () => {
    if (activeIndex < storyItems.length - 1) {
      setActiveIndex(activeIndex + 1);
    } else {
      setActiveIndex(null);
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  const getMediaUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const baseUrl = API_BASE_URL;
    return `${baseUrl}${path}`;
  };

  return (
    <div className="w-full overflow-hidden my-4 px-4 bg-white py-4 border-b border-slate-100">
      <h3 className="text-sm font-bold text-slate-800 mb-3 px-1">Top Stories</h3>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
        {storyItems.map((item, idx) => (
          <button 
            key={item.id || item._id}
            onClick={() => setActiveIndex(idx)}
            className="snap-start flex flex-col items-center gap-2 group flex-shrink-0"
          >
            <div className={`rounded-full p-[2px] ${activeIndex === idx ? 'bg-slate-300' : 'bg-gradient-to-tr from-amber-500 via-rose-500 to-fuchsia-600'}`}>
              <div className="h-20 w-20 rounded-full border-2 border-white overflow-hidden relative bg-slate-100">
                <img 
                  src={getMediaUrl(item.images?.[0])} 
                  alt={item.name} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                />
              </div>
            </div>
            <span className="text-[11px] font-semibold text-slate-700 w-20 truncate text-center">{item.name}</span>
          </button>
        ))}
      </div>

      {/* Full Screen Story Modal */}
      {activeIndex !== null && currentStory && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col justify-center items-center">
          
          {/* Progress Bars */}
          <div className="absolute top-0 inset-x-0 p-4 pt-6 z-20 flex gap-1 w-full max-w-lg mx-auto">
            {storyItems.map((_, i) => (
              <div key={i} className="h-[3px] flex-1 bg-white/30 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-white transition-all ease-linear ${i < activeIndex ? 'w-full' : i === activeIndex ? '' : 'w-0'}`}
                  style={{ width: i === activeIndex ? `${progress}%` : undefined }}
                />
              </div>
            ))}
          </div>

          {/* User Info / Header */}
          <div className="absolute top-10 inset-x-0 p-4 z-20 flex justify-between items-center w-full max-w-lg mx-auto">
             <div className="flex items-center gap-3">
               <div className="h-8 w-8 rounded-full border border-white overflow-hidden">
                  <img src={getMediaUrl(currentStory.images?.[0])} alt="brand" className="w-full h-full object-cover" />
               </div>
               <span className="text-white text-sm font-semibold">{currentStory.series || 'Reel Collection'}</span>
             </div>
             <button onClick={() => setActiveIndex(null)} className="text-white p-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
             </button>
          </div>
          
          {/* Video Container */}
          <div className="relative w-full max-w-lg mx-auto h-[100dvh] md:h-full md:max-h-[85vh] md:rounded-xl overflow-hidden bg-zinc-900 group">
             <video 
                ref={videoRef}
                src={getMediaUrl(currentStory.video)}
                className="w-full h-full object-cover"
                playsInline
                autoPlay
                muted={false} // Maybe muted by default?
             />
             
             {/* Tap Zones for Prev / Next */}
             <div className="absolute inset-y-0 left-0 w-1/3 z-10" onClick={handlePrev} />
             <div className="absolute inset-y-0 right-0 w-2/3 z-10" onClick={handleNext} />
             
             {/* Bottom Product Action */}
             <div className="absolute bottom-6 inset-x-0 p-4 z-20 pointer-events-none">
                 <div className="bg-black/40 backdrop-blur-md rounded-2xl p-4 flex justify-between items-center border border-white/10 shadow-xl pointer-events-auto">
                    <div>
                       <h4 className="text-white font-bold text-sm line-clamp-1">{currentStory.name}</h4>
                       <p className="text-white/80 text-xs font-medium">₹{currentStory.price}</p>
                    </div>
                    <button 
                       onClick={(e) => { e.stopPropagation(); navigate(`/product/${currentStory.id || currentStory._id}`); setActiveIndex(null); }}
                       className="bg-white text-black px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wide flex-shrink-0 active:scale-95 transition-transform"
                    >
                       View Product
                    </button>
                 </div>
             </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default InstagramStories;
