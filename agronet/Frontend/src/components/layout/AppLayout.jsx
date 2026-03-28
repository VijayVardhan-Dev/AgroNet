import { Link, useLocation } from "react-router-dom";
import { ROUTES } from "../../routing/routes";
import {
    ShoppingBag,
    User,
    Home as HomeIcon,
    Key,
    Map,
    MessageSquare,
    LogOut,
    Search,
    Bell,
    HelpCircle,
    LayoutDashboard,
    Heart,
    ShoppingCart,
    Store,
    Truck,
    ClipboardList,
    Mic
} from 'lucide-react';
import { useAuth } from "../../context/AuthContext";
import logo from '../../assets/images/logo.png';

// --- Nav items config ---
const NAV_ITEMS = [
    { route: 'HOME', icon: HomeIcon, label: 'Home' },
    { route: 'RENTALS', icon: Key, label: 'Rentals' },
    { route: 'MAPS', icon: Map, label: 'Maps' },
    { route: 'CHAT', icon: MessageSquare, label: 'Chat Bot' },
    { route: 'PROFILE', icon: User, label: 'Profile' },
];

// --- Mobile Bottom Nav ---
const BottomNav = ({ currentPath }) => {
    return (
        <div className="md:hidden fixed inset-x-0 bottom-0 z-50 border-t border-slate-200/80 bg-white/95 backdrop-blur-md">
            <nav
                className="mx-auto grid max-w-md grid-cols-5 gap-1 px-2 pt-1"
                style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
            >
                {NAV_ITEMS.map((item) => {
                    const IconComp = item.icon;
                    const isItemActive = ROUTES[item.route] === currentPath;
                    return (
                        <Link
                            key={item.route}
                            to={ROUTES[item.route]}
                            className={`flex flex-col items-center justify-center rounded-xl py-1.5 transition-colors ${isItemActive
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                                }`}
                            aria-label={item.label}
                        >
                            <IconComp className="w-[18px] h-[18px]" />
                            <span className="mt-1 text-[10px] font-semibold leading-none">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
};

const AppLayout = ({ children }) => {
    const { logout } = useAuth();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <div className="bg-gray-50 min-h-screen font-sans text-gray-800 flex">

            {/* --- Desktop Sidebar --- */}
            {/* --- Desktop Sidebar --- */}
            <aside className="hidden md:flex flex-col md:w-20 lg:w-64 bg-white h-screen sticky top-0 border-r border-gray-100 md:p-3 lg:p-6 shrink-0 z-30 transition-all duration-300">
                {/* Logo */}
                <div className="flex items-center gap-2 mb-10 justify-center lg:justify-start">
                    <div className="w-8 h-8 flex items-center justify-center">
                        <img src={logo} alt="AgroNet" className="w-full h-full object-contain" />
                    </div>
                    <span className="font-bold text-xl text-green-800 tracking-tight hidden lg:block">AGRONET</span>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 space-y-1 overflow-y-auto pr-2 no-scrollbar">
                    <div className="pb-2">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 hidden lg:block">Market</p>
                        <SidebarItem to={ROUTES.HOME} icon={<HomeIcon size={20} />} label="Home Page" active={isActive(ROUTES.HOME)} />
                        <SidebarItem to={ROUTES.RENTALS} icon={<Key size={20} />} label="Rentals" active={isActive(ROUTES.RENTALS)} />
                        <SidebarItem to={ROUTES.ORDERS} icon={<ShoppingBag size={20} />} label="My Orders" active={isActive(ROUTES.ORDERS)} />
                        <SidebarItem to="#" icon={<Heart size={20} />} label="Wishlist" />
                    </div>

                    <div className="pt-6 pb-2">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 hidden lg:block">Resources</p>
                        <SidebarItem to={ROUTES.MAPS} icon={<Map size={20} />} label="Maps" active={isActive(ROUTES.MAPS)} />
                        <SidebarItem to={ROUTES.CHAT} icon={<MessageSquare size={20} />} label="AI Chatbot" active={isActive(ROUTES.CHAT)} />
                        <SidebarItem to={ROUTES.VOICE} icon={<Mic size={20} />} label="Voice" active={isActive(ROUTES.VOICE)} />
                        <SidebarItem to="#" icon={<Bell size={20} />} label="Notifications" />
                    </div>

                    <div className="pt-6 pb-2">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 hidden lg:block">Work</p>
                        <SidebarItem to={ROUTES.FARMER_DASHBOARD} icon={<LayoutDashboard size={20} />} label="Farmer Dashboard" active={isActive(ROUTES.FARMER_DASHBOARD)} />
                        <SidebarItem to={ROUTES.DELIVERIES} icon={<Truck size={20} />} label="Deliveries" active={isActive(ROUTES.DELIVERIES)} />
                    </div>
                </nav>

                {/* Bottom Actions */}
                <div className="pt-6 border-t border-gray-100 space-y-1">
                    <SidebarItem to="#" icon={<MessageSquare size={20} />} label="Feedback" />
                    <SidebarItem to="#" icon={<HelpCircle size={20} />} label="Help" />

                    <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-between mt-4 pt-4 gap-4 lg:gap-0">
                        <div className="flex items-center gap-2">
                            <User className="w-8 h-8 p-1 bg-gray-100 rounded-full text-gray-600" />
                        </div>
                        <button onClick={() => logout()} className="text-gray-400 hover:text-red-600 transition-colors" title="Logout">
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </aside>

            {/* --- Main Content Wrapper --- */}
            <div className="flex-1 flex flex-col min-w-0">



                {/* --- Main Content --- */}
                <main className="grow    overflow-y-auto">
                    {children}
                </main>

                {/* --- Floating Mobile Bottom Navigation --- */}
                <BottomNav currentPath={location.pathname} />
            </div>
        </div>
    );
};

const SidebarItem = ({ to, icon, label, active }) => (
    <Link
        to={to}
        className={`flex items-center justify-center lg:justify-start gap-3 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${active
            ? 'bg-green-50 text-green-700'
            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
            }`}
        title={label}
    >
        {icon}
        <span className="hidden lg:block">{label}</span>
    </Link>
);

export default AppLayout;
