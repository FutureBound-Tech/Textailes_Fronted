import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const TopNav = () => {
  const { items } = useSelector((s) => s.cart);
  const cartCount = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-2xl bg-white/80 border-b border-black/5">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        
        <Link to="/" className="flex items-center gap-2 z-10">
          <span className="text-xl font-black tracking-tighter bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            TEXTAIL.
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          <Link to="/" className="text-sm font-semibold text-slate-800 hover:text-indigo-600 transition-colors">Home</Link>
          <a href="/#catalog" className="text-sm font-semibold text-slate-800 hover:text-indigo-600 transition-colors">Drops</a>
          <a href="/#catalog" className="text-sm font-semibold text-slate-800 hover:text-indigo-600 transition-colors">Trending</a>
        </nav>

        <div className="flex items-center gap-2 z-10">
          <Link 
            to="/profile" 
            className="relative flex items-center justify-center h-10 w-10 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-900">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </Link>

          <Link 
            to="/cart" 
            className="relative flex items-center justify-center h-10 w-10 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-900">
              <path d="m5 11 4-7"></path>
              <path d="m19 11-4-7"></path>
              <path d="M2 11h20"></path>
              <path d="m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.7-7.4"></path>
              <path d="M9 16v1"></path>
              <path d="M15 16v1"></path>
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-violet-600 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
