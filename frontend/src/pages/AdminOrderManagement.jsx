import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getOrders } from '../features/orders/orderSlice';
import { getAllUsers } from '../features/admin/adminSlice';
import { assignAgent } from '../features/deliveries/deliverySlice';
import { Truck, CheckCircle } from 'lucide-react';

const AdminOrderManagement = () => {
    const dispatch = useDispatch();
    const { orders = [] } = useSelector((state) => state.orders);
    const { agents = [] } = useSelector((state) => state.admin);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedAgent, setSelectedAgent] = useState('');

    useEffect(() => {
        dispatch(getOrders());
        dispatch(getAllUsers());
    }, [dispatch]);

    const handleAssign = (e) => {
        e.preventDefault();
        if (!selectedOrder || !selectedAgent) return;
        
        dispatch(assignAgent({ orderId: selectedOrder._id, agentId: selectedAgent }));
        setSelectedOrder(null);
        setSelectedAgent('');
        // Refresh orders
        setTimeout(() => dispatch(getOrders()), 1000);
    };

    return (
        <div className="container">
            <h1 style={{ marginBottom: '2rem' }}>Order Management</h1>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
                <div>
                    <div className="card">
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                                    <th style={{ padding: '1rem' }}>Order ID</th>
                                    <th style={{ padding: '1rem' }}>Customer</th>
                                    <th style={{ padding: '1rem' }}>Shipment Details</th>
                                    <th style={{ padding: '1rem' }}>Assigned Agent</th>
                                    <th style={{ padding: '1rem' }}>Status</th>
                                    <th style={{ padding: '1rem' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders && orders.map(order => (
                                    <tr key={order._id} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '1rem', fontWeight: 800 }}>#{order._id.slice(-6).toUpperCase()}</td>
                                        <td style={{ padding: '1rem', fontWeight: 600 }}>{order.userId?.name || 'Guest'}</td>
                                        <td style={{ padding: '1rem', maxWidth: '200px' }}>
                                            <div style={{ 
                                                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                                fontSize: '0.85rem', color: '#64748b', fontWeight: 500
                                            }} title={order.items}>
                                                {order.items || 'No details provided'}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            {order.agentId ? (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#455af7' }}></div>
                                                    <span style={{ fontWeight: 700 }}>{order.agentId.name}</span>
                                                </div>
                                            ) : (
                                                <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Not Assigned</span>
                                            )}
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{ 
                                                fontSize: '0.7rem', 
                                                fontWeight: 900,
                                                padding: '0.3rem 0.75rem', 
                                                borderRadius: '100px',
                                                textTransform: 'uppercase',
                                                background: 
                                                    order.status === 'pending' ? '#f8717115' : 
                                                    order.status === 'confirmed' ? '#455af715' :
                                                    order.status === 'out-for-delivery' ? '#fbbf2415' : '#10b98115',
                                                color: 
                                                    order.status === 'pending' ? '#f87171' : 
                                                    order.status === 'confirmed' ? '#455af7' :
                                                    order.status === 'out-for-delivery' ? '#fbbf24' : '#10b981'
                                            }}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            {order.status === 'pending' ? (
                                                <button 
                                                    className="btn btn-primary" 
                                                    style={{ padding: '0.5rem 1rem', width: 'auto', fontSize: '0.8rem', fontWeight: 800, borderRadius: '12px' }}
                                                    onClick={() => setSelectedOrder(order)}
                                                >
                                                    Assign Agent
                                                </button>
                                            ) : (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontWeight: 800, fontSize: '0.85rem' }}>
                                                    <CheckCircle size={18} /> Active
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div>
                    <div className="card" style={{ position: 'sticky', top: '2rem' }}>
                        <h3>Assign Agent</h3>
                        {selectedOrder ? (
                            <form onSubmit={handleAssign} style={{ marginTop: '1.5rem' }}>
                                <p className="text-muted" style={{ marginBottom: '1rem' }}>Assigning agent for Order <strong>#{selectedOrder._id.slice(-6).toUpperCase()}</strong></p>
                                
                                <div className="form-group">
                                    <label>Select Delivery Agent</label>
                                    <select 
                                        className="form-control" 
                                        value={selectedAgent} 
                                        onChange={(e) => setSelectedAgent(e.target.value)}
                                        style={{ appearance: 'auto' }}
                                        required
                                    >
                                        <option value="">-- Choose Agent --</option>
                                        {agents && agents.map(agent => (
                                            <option key={agent._id} value={agent._id}>{agent.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <button type="submit" className="btn btn-primary">Confirm Assignment</button>
                                <button type="button" className="btn btn-secondary" style={{ marginTop: '0.5rem' }} onClick={() => setSelectedOrder(null)}>Cancel</button>
                            </form>
                        ) : (
                            <div style={{ marginTop: '1.5rem', textAlign: 'center', padding: '2rem 0' }}>
                                <Truck size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
                                <p className="text-muted">Select a pending order to assign an agent.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminOrderManagement;
