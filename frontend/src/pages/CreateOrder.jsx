import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getAddresses } from '../features/addresses/addressSlice';
import { createOrder, reset } from '../features/orders/orderSlice';
import { 
    Package, MapPin, Truck, ChevronRight, 
    CheckCircle2, Info, Loader2, AlertTriangle,
    Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CreateOrder = () => {
    const location = useLocation();
    const prefilledItem = location.state?.prefilledItem || '';

    const [selectedAddress, setSelectedAddress] = useState(null);
    const [items, setItems] = useState(prefilledItem);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { addresses, isLoading: addrLoading } = useSelector(state => state.addresses);
    const { isLoading, isSuccess, isError, message } = useSelector(state => state.orders);

    useEffect(() => {
        dispatch(getAddresses());
    }, [dispatch]);

    useEffect(() => {
        dispatch(getAddresses());
        dispatch(reset());
    }, [dispatch]);

    const handlePlaceOrder = async () => {
        if (!selectedAddress || !items.trim()) return;
        
        try {
            await dispatch(createOrder({ addressId: selectedAddress, items })).unwrap();
            navigate('/orders/history');
        } catch (error) {
            // Error is handled by Redux state and displayed in the UI
            console.error('Failed to create order', error);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ maxWidth: '1000px' }}
        >
            <div style={{ marginBottom: '4rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#455af7', fontSize: '0.9rem', fontWeight: 800, marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    <Package size={16} />
                    Shipment Fulfillment
                </div>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem', color: '#0f172a', letterSpacing: '-0.02em' }}>
                    Create New Shipment
                </h1>
                <p style={{ color: '#64748b', fontSize: '1.1rem', fontWeight: 500 }}>Select a collection point to initiate your delivery request.</p>
            </div>

            {addrLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '6rem' }}>
                    <Loader2 className="animate-spin" color="#455af7" size={48} />
                </div>
            ) : (!addresses || addresses.length === 0) ? (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{ 
                        background: 'white', padding: '6rem 2rem', borderRadius: '32px', 
                        border: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', 
                        alignItems: 'center', textAlign: 'center',
                        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.03)'
                    }}
                >
                    <div style={{ width: '80px', height: '80px', background: '#e0e7ff', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
                        <MapPin size={40} color="#455af7" />
                    </div>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem', color: '#0f172a', letterSpacing: '-0.03em' }}>Missing Collection Point</h2>
                    <p style={{ color: '#64748b', fontSize: '1.2rem', maxWidth: '500px', marginBottom: '2.5rem', lineHeight: 1.6 }}>
                        To ensure seamless and accurate deliveries, you need to register a verified GPS location before placing any orders.
                    </p>
                    <Link to="/addresses/new" className="btn btn-primary" style={{ padding: '1.25rem 2.5rem', fontSize: '1.1rem', borderRadius: '18px', textDecoration: 'none', display: 'inline-block' }}>
                        Register Location Now →
                    </Link>
                </motion.div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '3rem', alignItems: 'start' }}>
                    {/* Left Column: Form Steps */}
                    <div>
                        {/* Address Selection */}
                        <div style={{ display: 'grid', gap: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem' }}>Step 1: Select Collection Point</h3>
                            
                            {addresses.map((addr) => (
                                <motion.div 
                                    key={addr._id}
                                    whileHover={{ scale: 1.01 }}
                                    onClick={() => setSelectedAddress(addr._id)}
                                    style={{ 
                                        padding: '1.5rem', borderRadius: '24px', background: 'white',
                                        border: `2px solid ${selectedAddress === addr._id ? '#455af7' : '#f1f5f9'}`,
                                        cursor: 'pointer', transition: 'all 0.2s',
                                        boxShadow: selectedAddress === addr._id ? '0 10px 25px -5px rgba(69, 90, 247, 0.1)' : 'none',
                                        display: 'flex', gap: '1.25rem', alignItems: 'center'
                                    }}
                                >
                                    <div style={{ 
                                        width: '48px', height: '48px', borderRadius: '14px', 
                                        background: selectedAddress === addr._id ? '#455af7' : '#f8fafc',
                                        color: selectedAddress === addr._id ? 'white' : '#94a3b8',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        <MapPin size={22} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontWeight: 800, fontSize: '1rem', color: selectedAddress === addr._id ? '#0f172a' : '#64748b' }}>{addr.landmark}</p>
                                        <p style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>ID: {addr.addressId}</p>
                                    </div>
                                    {selectedAddress === addr._id && (
                                        <div style={{ color: '#455af7' }}><CheckCircle2 size={24} /></div>
                                    )}
                                </motion.div>
                            ))}
                        </div>

                        {/* Shipment Details Input */}
                        <div style={{ display: 'grid', gap: '1.5rem', marginTop: '3rem' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>Step 2: Shipment Details</h3>
                            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '24px', border: '2px solid #f1f5f9' }}>
                                <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 700, color: '#334155' }}>
                                    What are you sending or ordering? *
                                </label>
                                <textarea 
                                    value={items}
                                    onChange={(e) => setItems(e.target.value)}
                                    placeholder="e.g., 2 bags of fertilizer, Medical supplies, 5kg seeds..."
                                    style={{ 
                                        width: '100%', padding: '1rem', borderRadius: '12px', 
                                        border: '2px solid #e2e8f0', minHeight: '100px', 
                                        outline: 'none', fontSize: '1rem', color: '#0f172a',
                                        resize: 'vertical'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#455af7'}
                                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Summary & Confirmation */}
                    <div style={{ position: 'sticky', top: '2rem' }}>
                        <div style={{ background: '#0f172a', borderRadius: '32px', padding: '2.5rem', color: 'white', boxShadow: '0 30px 60px -15px rgba(15, 23, 42, 0.3)' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '2rem' }}>Shipment Summary</h3>
                            
                            <div style={{ display: 'grid', gap: '1.5rem', marginBottom: '3rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: 600 }}>Platform Fee</span>
                                    <span style={{ fontWeight: 800 }}>$0.00 (BETA)</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: 600 }}>Logistics Handling</span>
                                    <span style={{ fontWeight: 800 }}>Calculated at Hub</span>
                                </div>
                                <div style={{ paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>Total Payable</span>
                                    <span style={{ fontWeight: 900, fontSize: '1.25rem', color: '#455af7' }}>$0.00</span>
                                </div>
                            </div>

                            <div style={{ background: 'rgba(69, 90, 247, 0.1)', border: '1px solid rgba(69, 90, 247, 0.2)', padding: '1.25rem', borderRadius: '20px', display: 'flex', gap: '1rem', marginBottom: '2.5rem' }}>
                                <Shield color="#455af7" size={20} />
                                <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5 }}>Our **Community Shield** protects your shipment until it reaches the final agent.</p>
                            </div>

                            <motion.button 
                                disabled={!selectedAddress || !items.trim() || isLoading}
                                whileHover={(selectedAddress && items.trim()) ? { scale: 1.02 } : {}}
                                whileTap={(selectedAddress && items.trim()) ? { scale: 0.98 } : {}}
                                onClick={handlePlaceOrder}
                                style={{ 
                                    width: '100%', padding: '1.25rem', borderRadius: '18px', 
                                    background: (selectedAddress && items.trim()) ? '#455af7' : '#1e293b', 
                                    color: (selectedAddress && items.trim()) ? 'white' : '#64748b', 
                                    border: 'none', fontWeight: 900, fontSize: '1.1rem',
                                    cursor: (selectedAddress && items.trim()) ? 'pointer' : 'not-allowed',
                                    transition: 'all 0.2s',
                                    boxShadow: (selectedAddress && items.trim()) ? '0 20px 40px -10px rgba(69, 90, 247, 0.4)' : 'none'
                                }}
                            >
                                {isLoading ? <Loader2 className="animate-spin" /> : 'Confirm Shipment'}
                            </motion.button>
                            
                            {isError && (
                                <p style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '1rem', textAlign: 'center', fontWeight: 600 }}>{message}</p>
                            )}
                        </div>

                        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                            <p style={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: 500 }}>
                                Need specialized cargo? <Link to="/support" style={{ color: '#455af7', fontWeight: 700, textDecoration: 'none' }}>Contact Logistics</Link>
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default CreateOrder;
