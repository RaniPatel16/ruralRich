import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
    Home, MapPin, ShoppingBag, History,
    Users, Truck, Layout, LogOut, X, Menu,
    Package, Map as MapIcon, Wallet, Activity, Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = () => {
    const { user } = useSelector((state) => state.auth);
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    // Close sidebar on route change (mobile)
    useEffect(() => {
        setIsOpen(false);
    }, [location.pathname]);

    // Close sidebar on resize to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) setIsOpen(false);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const menuItems = {
        user: [
            { path: '/dashboard', label: 'Overview', icon: <Home size={20} /> },
            { path: '/marketplace', label: 'Marketplace', icon: <ShoppingBag size={20} /> },
            { path: '/addresses', label: 'My Addresses', icon: <MapPin size={20} /> },
            { path: '/orders/new', label: 'New Shipment', icon: <Package size={20} /> },
            { path: '/orders/history', label: 'Order History', icon: <History size={20} /> },
        ],
        agent: [
            { path: '/agent/dashboard', label: 'Work Hub', icon: <Home size={20} /> },
            { path: '/logistics', label: 'Delivery Map', icon: <MapIcon size={20} /> },
            { path: '/earnings', label: 'My Earnings', icon: <Wallet size={20} /> },
        ],
        admin: [
            { path: '/admin', label: 'Admin Hub', icon: <Layout size={20} /> },
            { path: '/admin/orders', label: 'Shipment Dispatch', icon: <Truck size={20} /> },
            { path: '/admin/agents', label: 'Global Agents', icon: <Users size={20} /> },
            { path: '/admin/users', label: 'Customer Base', icon: <Users size={20} /> },
        ]
    };

    const commonItems = [
        { path: '/profile', label: 'My Profile', icon: <Settings size={20} /> },
    ];

    const currentItems = menuItems[user?.role?.toLowerCase()] || menuItems.user;

    const NavLink = ({ item }) => {
        const isActive = location.pathname === item.path;
        return (
            <li>
                <Link
                    to={item.path}
                    className={`sidebar-link${isActive ? ' sidebar-link--active' : ''}`}
                >
                    <div className="sidebar-link__icon">
                        {item.icon}
                    </div>
                    <span>{item.label}</span>
                    {isActive && (
                        <motion.div
                            layoutId="activeIndicator"
                            className="sidebar-link__dot"
                        />
                    )}
                </Link>
            </li>
        );
    };

    const SidebarContent = () => (
        <>
            <Link to="/" className="sidebar-logo">
                <div className="sidebar-logo__icon">
                    <Truck color="white" size={20} />
                </div>
                RuralReach
            </Link>

            <nav className="sidebar-nav">
                <p className="sidebar-section-label">Menu</p>
                <ul className="sidebar-menu">
                    {currentItems.map((item) => (
                        <NavLink key={item.path} item={item} />
                    ))}
                </ul>

                <p className="sidebar-section-label" style={{ marginTop: '2.5rem' }}>Account</p>
                <ul className="sidebar-menu">
                    {commonItems.map((item) => (
                        <NavLink key={item.path} item={item} />
                    ))}
                </ul>
            </nav>

            <div className="sidebar-user">
                <div className="sidebar-user__avatar">
                    {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="sidebar-user__info">
                    <p className="sidebar-user__name">{user?.name}</p>
                    <p className="sidebar-user__role">{user?.role}</p>
                </div>
            </div>
        </>
    );

    return (
        <>
            {/* Mobile Hamburger Button */}
            <button
                className="sidebar-hamburger"
                onClick={() => setIsOpen(true)}
                aria-label="Open menu"
            >
                <Menu size={22} />
            </button>

            {/* Desktop Sidebar */}
            <aside className="sidebar sidebar--desktop">
                <SidebarContent />
            </aside>

            {/* Mobile Overlay + Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            key="overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="sidebar-overlay"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.aside
                            key="drawer"
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
                            className="sidebar sidebar--mobile"
                        >
                            <button
                                className="sidebar-close"
                                onClick={() => setIsOpen(false)}
                                aria-label="Close menu"
                            >
                                <X size={22} />
                            </button>
                            <SidebarContent />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default Sidebar;
