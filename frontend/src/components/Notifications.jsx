import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Bell, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { getOrders } from '../features/orders/orderSlice';

const Notifications = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const { orders = [] } = useSelector((state) => state.orders);
    
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [seenOrders, setSeenOrders] = useState([]);
    const isFirstRun = useRef(true);

    // Periodically fetch orders to check for new assignments
    useEffect(() => {
        const interval = setInterval(() => {
            dispatch(getOrders());
        }, 5000); // Check every 5 seconds
        return () => clearInterval(interval);
    }, [dispatch]);

    useEffect(() => {
        if (!user || user.role !== 'agent') return;

        // Find orders assigned to this agent with 'confirmed' status
        const myNewOrders = orders.filter(o => 
            (o.agentId === user._id || o.agentId === user.id) && 
            o.status === 'confirmed' && 
            !seenOrders.includes(o._id)
        );

        if (myNewOrders.length > 0) {
            // Update seen orders
            setSeenOrders(prev => [...prev, ...myNewOrders.map(o => o._id)]);

            // Don't show toast on the very first load of existing orders
            if (!isFirstRun.current) {
                myNewOrders.forEach(o => {
                    const newNotif = {
                        id: Date.now() + Math.random(),
                        text: `New Assignment: Order #${o._id.slice(-6).toUpperCase()} is ready for dispatch!`,
                        type: "alert",
                        time: "Just now"
                    };
                    setNotifications(prev => [newNotif, ...prev]);
                    toast.success(
                        (t) => (
                            <div onClick={() => { navigate(`/orders/${o._id}`); toast.dismiss(t.id); }} style={{ cursor: 'pointer' }}>
                                🚀 New order assigned! <b>Click to view</b>
                            </div>
                        ),
                        {
                            icon: '📦',
                            style: { borderRadius: '15px', background: '#0f172a', color: '#fff', fontWeight: 700 },
                            duration: 6000
                        }
                    );
                });
            }
        }
        isFirstRun.current = false;
    }, [orders, user, seenOrders, navigate]);

    const remove = (id) => setNotifications(n => n.filter(item => item.id !== id));

    return (
        <div style={{ position: 'relative' }}>
            <motion.button 
                whileHover={{ y: -3, scale: 1.05 }}
                onClick={() => setIsOpen(!isOpen)}
                style={{ 
                    width: '52px', height: '52px', border: 'none', 
                    background: 'white', borderRadius: '18px', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    color: '#64748b', cursor: 'pointer', 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                    position: 'relative'
                }}
            >
                <Bell size={22} color={isOpen ? '#455af7' : '#64748b'} />
                {notifications.length > 0 && (
                    <span style={{ 
                        position: 'absolute', top: '12px', right: '12px', background: '#ef4444', 
                        color: 'white', fontSize: '9px', fontWeight: 900, borderRadius: '6px', 
                        minWidth: '16px', height: '16px', display: 'flex', alignItems: 'center', 
                        justifyContent: 'center', border: '2px solid white',
                        boxShadow: '0 2px 5px rgba(239, 68, 68, 0.3)'
                    }}>
                        {notifications.length}
                    </span>
                )}
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        style={{ 
                            position: 'absolute', top: '120%', right: 0, width: '340px', 
                            zIndex: 1000, padding: '1.5rem',
                            background: 'white', borderRadius: '24px',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.1), 0 0 0 1px #f1f5f9'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, color: '#0f172a' }}>Recent Notifications</h4>
                            <X size={18} onClick={() => setIsOpen(false)} style={{ cursor: 'pointer', color: '#94a3b8' }} />
                        </div>

                        {notifications.length > 0 ? (
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                {notifications.map(n => (
                                    <div key={n.id} style={{ 
                                        padding: '1rem', background: '#f8fafc', 
                                        borderRadius: '16px', border: '1px solid #f1f5f9',
                                        transition: 'all 0.2s'
                                    }}>
                                        <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', fontWeight: 700, color: '#334155', lineHeight: '1.5' }}>{n.text}</p>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8' }}>{n.time}</span>
                                            <button 
                                                onClick={() => remove(n.id)} 
                                                style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#ef4444', fontSize: '0.75rem', fontWeight: 800 }}
                                            >
                                                Dismiss
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <button style={{ width: '100%', padding: '0.8rem', background: 'transparent', border: '1px solid #f1f5f9', borderRadius: '14px', fontSize: '0.85rem', fontWeight: 800, color: '#455af7', cursor: 'pointer', marginTop: '0.5rem' }}>
                                    View All Activity
                                </button>
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                                <div style={{ width: '60px', height: '60px', borderRadius: '20px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: '#cbd5e1' }}>
                                    <Bell size={24} />
                                </div>
                                <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: '#64748b' }}>Your inbox is empty</p>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Notifications;
