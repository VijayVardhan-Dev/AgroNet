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
    ClipboardList
} from 'lucide-react';
import { useAuth } from "../../context/AuthContext";
import logo from '../../assets/images/logo.png';

// --- Nav items config ---
const NAV_ITEMS = [
    { route: 'HOME', icon: HomeIcon, label: 'Home' },
    { route: 'RENTALS', icon: Heart, label: 'Wishlist' },
    { route: 'CART', icon: ShoppingCart, label: 'Cart' },
    { route: 'ORDERS', icon: ClipboardList, label: 'Orders' },
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
    const shouldHideHeader = location.pathname === ROUTES.RENTALS || location.pathname === ROUTES.MAPS || location.pathname === ROUTES.CHAT || location.pathname === ROUTES.HOME;

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
                    <div className="space-y-1">
                        <SidebarItem to={ROUTES.MAPS} icon={<Map size={20} />} label="Maps" active={isActive(ROUTES.MAPS)} />
                        <SidebarItem to={ROUTES.CHAT} icon={<MessageSquare size={20} />} label="AI Assistant" active={isActive(ROUTES.CHAT)} />
                        <SidebarItem to={ROUTES.VOICE} icon={<Bell size={20} />} label="Voice" active={isActive(ROUTES.VOICE)} />
                    </div>

                    <div className="pt-6 pb-2">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 hidden lg:block">Market</p>
                        <SidebarItem to={ROUTES.HOME} icon={<Store size={20} />} label="Shop Crops" active={isActive(ROUTES.HOME)} />
                        <SidebarItem to={ROUTES.RENTALS} icon={<Key size={20} />} label="Rentals" active={isActive(ROUTES.RENTALS)} />
                        <SidebarItem to={ROUTES.ORDERS} icon={<ShoppingBag size={20} />} label="My Orders" active={isActive(ROUTES.ORDERS)} />
                        <SidebarItem to="#" icon={<Heart size={20} />} label="Wishlist" />
                    </div>

                    <div className="pt-6 pb-2">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 hidden lg:block">Work</p>
                        <SidebarItem to={ROUTES.FARMER_DASHBOARD} icon={<LayoutDashboard size={20} />} label="Farmer Dashboard" active={isActive(ROUTES.FARMER_DASHBOARD)} />
                        <SidebarItem to={ROUTES.DELIVERIES} icon={<Truck size={20} />} label="Deliveries (Driver)" active={isActive(ROUTES.DELIVERIES)} />
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



                {/* --- Desktop Header --- */}
                {!shouldHideHeader && (
                    <header className="hidden md:flex justify-between items-center px-8 py-5 bg-gray-50 sticky top-0 z-20">
                        <div className="flex-1 max-w-2xl">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="search"
                                    className="w-full bg-white border border-gray-200 py-2.5 pl-10 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                                />
                                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                            </div>
                        </div>
                        <div className="flex items-center gap-6 ml-4">
                            <Link to={ROUTES.CART} className="text-gray-600 hover:text-green-700">
                                <ShoppingBag size={22} />
                            </Link>
                            <button className="text-gray-600 hover:text-green-700"><User size={22} /></button>
                        </div>
                    </header>
                )}

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
