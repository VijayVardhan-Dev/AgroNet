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
    Package,
    ClipboardList
} from 'lucide-react';
import { useAuth } from "../../context/AuthContext";
import { useState, useRef, useEffect, useCallback } from "react";
import logo from '../../assets/images/logo.png';

// --- Nav items config ---
const NAV_ITEMS = [
    { route: 'HOME', icon: HomeIcon, label: 'Home' },
    { route: 'RENTALS', icon: Heart, label: 'Wishlist' },
    { route: 'CART', icon: ShoppingCart, label: 'Cart' },
    { route: 'ORDERS', icon: ClipboardList, label: 'Orders' },
    { route: 'PROFILE', icon: User, label: 'Profile' },
];

// --- Floating Bottom Nav with sliding pill ---
const BottomNav = ({ currentPath }) => {
    const containerRef = useRef(null);
    const itemRefs = useRef([]);
    const [pillStyle, setPillStyle] = useState({ left: 0, width: 42, opacity: 0 });
    const [activeLabel, setActiveLabel] = useState('');
    const [showLabel, setShowLabel] = useState(false);
    const prevIndexRef = useRef(-1);

    const activeIndex = NAV_ITEMS.findIndex(item => ROUTES[item.route] === currentPath);

    const measureAndAnimate = useCallback(() => {
        if (activeIndex === -1 || !containerRef.current) return;
        const containerRect = containerRef.current.getBoundingClientRect();
        const el = itemRefs.current[activeIndex];
        if (!el) return;

        // First hide label, shrink pill to icon-only at target position
        setShowLabel(false);

        // Measure the icon-only position first for the slide
        const elRect = el.getBoundingClientRect();
        const iconOnlyWidth = 42;
        const left = elRect.left - containerRect.left + (elRect.width / 2) - (iconOnlyWidth / 2);

        setPillStyle({
            left,
            width: iconOnlyWidth,
            opacity: 1,
        });

        // After pill arrives, expand it with label
        const expandTimer = setTimeout(() => {
            setActiveLabel(NAV_ITEMS[activeIndex].label);
            // Measure expanded width: icon(20) + gap(8) + label text (~dynamic)
            // We use a generous estimate, then the CSS will handle overflow
            const labelWidths = { Home: 82, Wishlist: 94, Cart: 74, Orders: 88, Profile: 88 };
            const expandedWidth = labelWidths[NAV_ITEMS[activeIndex].label] || 88;

            const expandedLeft = elRect.left - containerRect.left + (elRect.width / 2) - (expandedWidth / 2);

            setPillStyle({
                left: Math.max(4, expandedLeft), // clamp to not overflow left
                width: expandedWidth,
                opacity: 1,
            });

            // Fade in label after expansion starts
            setTimeout(() => setShowLabel(true), 120);
        }, 480); // wait for slide to mostly finish

        prevIndexRef.current = activeIndex;
        return () => clearTimeout(expandTimer);
    }, [activeIndex]);

    useEffect(() => {
        const cleanup = measureAndAnimate();
        return cleanup;
    }, [measureAndAnimate]);

    // Recalculate on resize
    useEffect(() => {
        const handleResize = () => measureAndAnimate();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [measureAndAnimate]);

    return (
        <div
            ref={containerRef}
            className="md:hidden fixed bottom-5 left-1/2 -translate-x-1/2 w-[88%] max-w-sm bg-white/95 backdrop-blur-md h-[58px] rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.1)] flex items-center justify-around px-1.5 border border-gray-100/50 z-50"
            style={{ position: 'fixed' }}
        >
            {/* Sliding Pill Indicator */}
            <div
                className="absolute top-1/2 -translate-y-1/2 h-[42px] rounded-full bg-[#FF6B00] shadow-lg shadow-orange-200/50 flex items-center justify-center gap-1.5 pointer-events-none overflow-hidden"
                style={{
                    left: pillStyle.left,
                    width: pillStyle.width,
                    opacity: pillStyle.opacity,
                    transition: 'left 0.7s cubic-bezier(0.25, 1.2, 0.5, 1), width 0.4s cubic-bezier(0.25, 1.2, 0.5, 1), opacity 0.2s ease',
                    zIndex: 1,
                }}
            >
                {/* Icon inside pill */}
                {activeIndex !== -1 && (() => {
                    const IconComp = NAV_ITEMS[activeIndex].icon;
                    return <IconComp className="w-[18px] h-[18px] text-white" />;
                })()}
                {/* Label inside pill */}
                <span
                    className="font-bold text-[12px] text-white whitespace-nowrap"
                    style={{
                        opacity: showLabel ? 1 : 0,
                        transform: showLabel ? 'translateX(0)' : 'translateX(-6px)',
                        transition: 'opacity 0.25s ease, transform 0.25s ease',
                        maxWidth: showLabel ? '80px' : '0px',
                        overflow: 'hidden',
                    }}
                >
                    {activeLabel}
                </span>
            </div>

            {/* Nav Items */}
            {NAV_ITEMS.map((item, index) => {
                const IconComp = item.icon;
                const isItemActive = ROUTES[item.route] === currentPath;
                return (
                    <Link
                        key={item.route}
                        to={ROUTES[item.route]}
                        ref={el => itemRefs.current[index] = el}
                        className="relative flex items-center justify-center w-[40px] h-[40px] rounded-full z-10 transition-colors duration-300"
                        style={{ color: isItemActive ? 'transparent' : undefined }}
                    >
                        <IconComp
                            className="w-[18px] h-[18px] transition-all duration-300"
                            style={{
                                color: isItemActive ? 'transparent' : '#d1d5db',
                                transform: isItemActive ? 'scale(0)' : 'scale(1)',
                                transition: 'color 0.3s ease, transform 0.3s ease',
                            }}
                        />
                    </Link>
                );
            })}
        </div>
    );
};

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