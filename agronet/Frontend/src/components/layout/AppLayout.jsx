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
    Menu,
    Search,
    Bell,
    HelpCircle,
    Settings,
    LayoutDashboard,
    Sprout,
    Tractor,
    Heart,
    ShoppingCart,
    Store,
    Truck,
    Package
} from 'lucide-react';
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import logo from '../../assets/images/logo.png';

const AppLayout = ({ children }) => {
    const { logout } = useAuth();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const isActive = (path) => location.pathname === path;
    const shouldHideHeader = location.pathname === ROUTES.RENTALS || location.pathname === ROUTES.MAPS || location.pathname === ROUTES.CHAT;

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

                {/* --- Mobile Header --- */}
                {!shouldHideHeader && (
                    <header className="md:hidden flex justify-between items-center p-4 bg-white sticky top-0 z-20 transition-all shadow-sm">
                        <div className="w-8 h-8 flex items-center justify-center">
                            <img src={logo} alt="AgroNet" className="w-full h-full object-contain" />
                        </div>
                        <div className="flex gap-4 items-center">
                            <Link to={ROUTES.CART}>
                                <ShoppingBag className="w-6 h-6 text-gray-600" />
                            </Link>
                            <div className="relative">
                                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="focus:outline-none">
                                    <User className="w-6 h-6 text-gray-600" />
                                </button>
                                {isMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-100 z-50">
                                        <Link to={ROUTES.PROFILE} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>Profile</Link>
                                        <button onClick={() => { logout(); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 items-center gap-2">
                                            <LogOut size={14} /> Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </header>
                )}

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
                <main className="grow p-1 md:p-8 overflow-y-auto">
                    {children}
                </main>

                {/* --- Mobile Bottom Navigation --- */}
                <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-center z-20 pb-6">
                    <NavIcon to={ROUTES.HOME} icon={<HomeIcon size={24} />} active={isActive(ROUTES.HOME)} />
                    <NavIcon to={ROUTES.RENTALS} icon={<Key size={24} />} active={isActive(ROUTES.RENTALS)} />
                    <NavIcon to={ROUTES.MAPS} icon={<Map size={24} />} active={isActive(ROUTES.MAPS)} />
                    <NavIcon to={ROUTES.CHAT} icon={<MessageSquare size={24} />} active={isActive(ROUTES.CHAT)} />
                </nav>
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

const NavIcon = ({ icon, active, to }) => (
    <Link to={to} className={`${active ? 'text-gray-900' : 'text-gray-400'} flex flex-col items-center justify-center`}>
        {icon}
    </Link>
);

export default AppLayout;