import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers } from '../features/admin/adminSlice';
import { getOrders } from '../features/orders/orderSlice';
import { Truck, Mail, ShieldCheck, BarChart3, Star, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const AgentManagement = () => {
    const dispatch = useDispatch();
    const { agents = [], isLoading } = useSelector((state) => state.admin);
    const { orders = [] } = useSelector((state) => state.orders);

    useEffect(() => {
        dispatch(getAllUsers());
        dispatch(getOrders());
    }, [dispatch]);

    const handleViewPerformance = (agent) => {
        const agentOrders = orders.filter(o => o.agentId === agent._id);
        const completed = agentOrders.filter(o => o.status === 'delivered').length;
        const pending = agentOrders.filter(o => o.status !== 'delivered').length;
        const rating = (4.5 + (completed * 0.1)).toFixed(1);
        
        toast.success(
            `${agent.name}'s Report: \n` +
            `✅ Completed: ${completed} \n` +
            `⏳ In Progress: ${pending} \n` +
            `⭐ Rating: ${rating}/5.0`,
            { duration: 5000, style: { minWidth: '300px', whiteSpace: 'pre-line' } }
        );
    };

    return (
        <div className="container" style={{ padding: '2rem' }}>
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ marginBottom: '3rem' }}
            >
                <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>Delivery Agent Network</h1>
                <p style={{ color: '#64748b', fontSize: '1.1rem', fontWeight: 500 }}>Manage and monitor your regional delivery staff.</p>
            </motion.div>

            {isLoading ? (
                <div style={{ textAlign: 'center', padding: '4rem' }}>
                    <p style={{ color: '#64748b', fontWeight: 600 }}>Loading agent network data...</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(340px, 100%), 1fr))', gap: '2rem' }}>
                    {agents && agents.map((agent, i) => (
                        <motion.div 
                            key={agent._id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="card" 
                            style={{ 
                                padding: '2rem', borderRadius: '32px', border: '1px solid #f1f5f9',
                                background: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                                display: 'flex', flexDirection: 'column', gap: '1.5rem'
                            }}
                        >
                            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                                <div style={{ 
                                    padding: '1rem', background: '#10b98110', color: '#10b981', 
                                    borderRadius: '1.25rem', display: 'flex' 
                                }}>
                                    <Truck size={28} />
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '1.25rem', fontWeight: 900, margin: 0, color: '#0f172a' }}>{agent.name}</h4>
                                    <p style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 700, marginTop: '0.2rem' }}>
                                        ID: {agent._id.slice(-8).toUpperCase()}
                                    </p>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gap: '0.75rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#64748b', fontWeight: 500, fontSize: '0.95rem' }}>
                                    <Mail size={18} style={{ color: '#455af7' }} /> {agent.email}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#10b981', fontWeight: 800, fontSize: '0.95rem' }}>
                                    <ShieldCheck size={18} /> Verified Delivery Agent
                                </div>
                            </div>

                            <button 
                                onClick={() => handleViewPerformance(agent)}
                                className="btn btn-secondary" 
                                style={{ 
                                    padding: '1rem', borderRadius: '16px', fontWeight: 800, 
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                                    background: '#f8fafc', border: '1px solid #f1f5f9', color: '#0f172a',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <BarChart3 size={18} /> View Delivery Performance
                            </button>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AgentManagement;
