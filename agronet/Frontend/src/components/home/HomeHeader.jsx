import { Bell, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const HomeHeader = ({ userName = 'Guest User', avatarUrl }) => {
  const avatarFallback = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userName || 'Guest')}`;

  return (
    <div className="pt-5 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-emerald-50 ring-1 ring-emerald-100 overflow-hidden shrink-0">
          <img
            src={avatarUrl || avatarFallback}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="min-w-0">
          <h1 className="text-[17px] sm:text-[19px] font-extrabold text-slate-900 leading-tight">Welcome Back</h1>
          <p className="text-[12px] sm:text-[13px] text-slate-500 font-medium truncate">{userName}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <Link
          to="/cart"
          className="w-10 h-10 sm:w-11 sm:h-11 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-center hover:border-slate-300 hover:shadow-md transition"
        >
          <ShoppingBag className="w-5 h-5 text-slate-700" />
        </Link>
        <button className="w-10 h-10 sm:w-11 sm:h-11 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-center relative hover:border-slate-300 hover:shadow-md transition">
          <Bell className="w-5 h-5 text-slate-700" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white"></span>
        </button>
      </div>
    </div>
  );
};

export default HomeHeader;
