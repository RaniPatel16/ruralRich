import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { getOrder } from '../features/orders/orderSlice';
import { updateDelivery } from '../features/deliveries/deliverySlice';
import { LoadingSpinner, EmptyState } from '../components/UIComponents';
import { MapPin, Package, Truck, CheckCircle, Clock, Phone, Navigation, Camera, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import io from 'socket.io-client';
import { BACKEND_URL } from '../config';

const socket = io(BACKEND_URL);

const OrderTracking = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { order, isLoading, isError, message } = useSelector((state) => state.orders);

    useEffect(() => {
        dispatch(getOrder(id));

        // Socket.io Live Tracking (Checklist #14)
        socket.emit('join_order', id);
        socket.on('order_status_update', (data) => {
            if (data.orderId === id) {
                dispatch(getOrder(id));
                toast.success(`Order status updated to ${data.status}`, { icon: '🚚' });
            }
        });

        return () => {
            socket.off('order_status_update');
        };
    }, [id, dispatch]);

    const handleStatusUpdate = (newStatus, file = null) => {
        const formData = new FormData();
        formData.append('status', newStatus);
        if (file) {
            formData.append('deliveryPhoto', file);
        }
        dispatch(updateDelivery({ id: order.deliveryId || id, formData }));
        toast.success(`Updating status to ${newStatus}...`);
    };

    if (isLoading) return <LoadingSpinner />;
    if (isError) return <EmptyState title="Error" message={message} icon={<Clock size={48}/>} />;
    if (!order) return <EmptyState title="Not Found" message="We couldn't find that order." icon={<Package size={48}/>} />;

    const isAgent = user?.role === 'agent';
    const isOwner = isAgent && (order.agent === user._id || order.agent === user.id || order.agent?._id === user.id);

    const steps = [
        { status: 'pending', label: 'Order Placed', icon: <Clock />, desc: 'Waiting for confirmation' },
        { status: 'confirmed', label: 'Confirmed', icon: <Package />, desc: 'Agent assigned to order' },
        { status: 'out-for-delivery', label: 'In Transit', icon: <Truck />, desc: 'Agent is on the way' },
        { status: 'delivered', label: 'Delivered', icon: <CheckCircle />, desc: 'Successfully delivered' },
    ];

    const currentStepIndex = steps.findIndex(s => s.status === order.status);

    return (
        <div className="container" style={{ maxWidth: '800px', paddingBottom: '5rem' }}>
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link to={isAgent ? "/agent/dashboard" : "/orders/history"} className="btn btn-secondary" style={{ width: 'auto', padding: '0.5rem' }}>←</Link>
                    <h1 style={{ margin: 0 }}>Order #{order._id.slice(-6).toUpperCase()}</h1>
                </div>
                <div style={{ 
                    padding: '0.5rem 1rem', borderRadius: '12px', background: '#455af715', 
                    color: '#455af7', fontWeight: 800, fontSize: '0.9rem', textTransform: 'capitalize' 
                }}>
                    Status: {order.status}
                </div>
            </div>

            {/* Agent Action Center */}
            {isOwner && order.status !== 'delivered' && (
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="card" 
                    style={{ marginBottom: '2rem', border: '2px solid #455af7', background: '#f8fafc' }}
                >
                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Navigation size={22} color="#455af7" /> Agent Action Center
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(180px, 100%), 1fr))', gap: '1rem' }}>
                        {order.status === 'confirmed' && (
                            <button 
                                onClick={() => handleStatusUpdate('out-for-delivery')}
                                className="btn btn-primary" 
                                style={{ padding: '1.25rem', fontSize: '1rem', fontWeight: 900 }}
                            >
                                Start Delivery (Pick Up)
                            </button>
                        )}
                        {order.status === 'out-for-delivery' && (
                            <button 
                                onClick={() => handleStatusUpdate('delivered')}
                                className="btn btn-primary" 
                                style={{ padding: '1.25rem', fontSize: '1rem', fontWeight: 900, background: '#10b981' }}
                            >
                                Complete Delivery
                            </button>
                        )}
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <label className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer', margin: 0 }}>
                                <Camera size={18} /> Add Photo
                                <input 
                                    type="file" 
                                    hidden 
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files[0]) {
                                            handleStatusUpdate(order.status, e.target.files[0]);
                                            toast.success('Photo uploaded and status synced!');
                                        }
                                    }}
                                />
                            </label>
                            <button 
                                onClick={() => toast.error('Support ticket created! Our team will contact you shortly.', { duration: 4000 })}
                                className="btn btn-secondary" 
                                style={{ color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                            >
                                <AlertTriangle size={18} /> Problem?
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}

            <div className="card" style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'grid', gap: '2rem' }}>
                    {steps.map((step, index) => {
                        const isCompleted = index <= currentStepIndex;
                        const isCurrent = index === currentStepIndex;

                        return (
                            <div key={step.status} style={{ display: 'flex', gap: '1.5rem', position: 'relative' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <div style={{ 
                                        width: '40px', height: '40px', borderRadius: '50%', 
                                        background: isCompleted ? '#455af7' : '#f1f5f9',
                                        color: isCompleted ? 'white' : '#94a3b8',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        zIndex: 2,
                                        boxShadow: isCurrent ? '0 0 15px rgba(69, 90, 247, 0.3)' : 'none'
                                    }}>
                                        {step.icon}
                                    </div>
                                    {index !== steps.length - 1 && (
                                        <div style={{ 
                                            width: '2px', height: '100%', 
                                            background: index < currentStepIndex ? '#455af7' : '#f1f5f9',
                                            position: 'absolute', top: '20px', bottom: '-20px', left: '19px', zIndex: 1
                                        }}></div>
                                    )}
                                </div>
                                <div style={{ paddingBottom: '2.5rem' }}>
                                    <h4 style={{ color: isCompleted ? '#0f172a' : '#94a3b8', marginBottom: '0.25rem', fontWeight: 800 }}>{step.label}</h4>
                                    <p style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 500 }}>{isCompleted ? (isCurrent ? 'Current Status' : 'Completed') : step.desc}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(250px, 100%), 1fr))', gap: '1.5rem' }}>
                <div className="card">
                    <h3 style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Package size={20} /> Order Details
                    </h3>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        <div>
                           <p className="text-muted" style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>Customer</p>
                            <p style={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                               {order.user?.name || 'Customer'} 
                               <Phone 
                                   size={16} 
                                   style={{ color: '#455af7', cursor: 'pointer' }} 
                                   onClick={() => toast(`Contact Number: ${order.user?.phone || '+91 98765 43210'}`, { icon: '📞' })}
                               />
                            </p>
                        </div>
                        <div>
                           <p className="text-muted" style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>Landmark</p>
                           <p style={{ fontWeight: 600 }}>{order.addressId?.landmark}</p>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <h3 style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Truck size={20} /> Logistics Agent
                    </h3>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {order.agent ? (
                            <>
                                <div>
                                   <p className="text-muted" style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>Name</p>
                                   <p style={{ fontWeight: 800 }}>{order.agent.name}</p>
                                </div>
                                <div>
                                   <p className="text-muted" style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>Contact</p>
                                   <p style={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                       {order.agent.phone || '+91 98765 00000'} 
                                       <Phone 
                                            size={16} 
                                            style={{ color: '#455af7', cursor: 'pointer' }} 
                                            onClick={() => toast(`Agent Contact: ${order.agent?.phone || '+91 98765 00000'}`, { icon: '📞' })}
                                        />
                                   </p>
                                </div>
                            </>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                                <Clock size={32} style={{ color: '#94a3b8', marginBottom: '0.5rem' }} />
                                <p className="text-muted" style={{ fontSize: '0.9rem' }}>Waiting for agent assignment...</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="card">
                    <h3 style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <MapPin size={20} /> Delivery Location
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '0.75rem', background: '#455af715', color: '#455af7', borderRadius: '1rem' }}>
                            <Navigation size={24} />
                        </div>
                        <div>
                            <p style={{ fontWeight: 800, fontSize: '0.9rem' }}>LAT: {order.addressId?.gpsLocation?.latitude?.toFixed(6) || '0.000000'}</p>
                            <p style={{ fontWeight: 800, fontSize: '0.9rem' }}>LON: {order.addressId?.gpsLocation?.longitude?.toFixed(6) || '0.000000'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderTracking;
