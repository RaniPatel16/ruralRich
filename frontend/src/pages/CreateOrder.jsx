import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAddresses } from '../features/addresses/addressSlice';
import { createOrder, reset } from '../features/orders/orderSlice';
import { LoadingSpinner } from '../components/UIComponents';
import { MapPin, ShoppingBag, Plus, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const CreateOrder = () => {
    const location = useLocation();
    const prefilledItem = location.state?.prefilledItem || '';

    const [selectedAddress, setSelectedAddress] = useState(null);
    const [items, setItems] = useState(() => {
        return prefilledItem || sessionStorage.getItem('order_items') || '';
    });
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { addresses, isLoading: addrLoading } = useSelector(state => state.addresses);
    const { isLoading, isSuccess, isError, message } = useSelector(state => state.orders);

    useEffect(() => {
        dispatch(getAddresses());
        dispatch(reset());
    }, [dispatch]);

    useEffect(() => {
        sessionStorage.setItem('order_items', items);
    }, [items]);

    const handlePlaceOrder = async () => {
        if (!selectedAddress || !items.trim()) {
            toast.error('Please select an address and describe items');
            return;
        }
        
        try {
            await dispatch(createOrder({ addressId: selectedAddress, items })).unwrap();
            sessionStorage.removeItem('order_items'); // Clear after success
            toast.success('Order placed successfully!');
            navigate('/orders/history');
        } catch (error) {
            toast.error(message || 'Failed to place order');
        }
    };

    if (addrLoading) return <LoadingSpinner />;

    return (
        <div className="container" style={{ maxWidth: '600px' }}>
            <h1 style={{ marginBottom: '2rem' }}>New Shipment</h1>
            
            <div className="card" style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ShoppingBag size={20} color="#455af7" /> What are you sending?
                </h3>
                <textarea 
                    placeholder="Describe items (e.g., 5kg Wheat Seeds, Garden Tools...)"
                    className="form-control"
                    style={{ minHeight: '120px', padding: '1rem', marginBottom: '1rem' }}
                    value={items}
                    onChange={(e) => setItems(e.target.value)}
                />
            </div>

            <div className="card">
                <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MapPin size={20} color="#455af7" /> Delivery Address
                </h3>
                
                <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
                    {addresses && addresses.length > 0 ? addresses.map((addr) => (
                        <div 
                            key={addr._id}
                            onClick={() => setSelectedAddress(addr._id)}
                            style={{ 
                                padding: '1rem', borderRadius: '12px', border: `2px solid ${selectedAddress === addr._id ? '#455af7' : '#f1f5f9'}`,
                                background: selectedAddress === addr._id ? '#455af705' : 'white',
                                cursor: 'pointer', transition: 'all 0.2s'
                            }}
                        >
                            <p style={{ fontWeight: 800, marginBottom: '0.25rem' }}>{addr.landmark}</p>
                            <p className="text-muted" style={{ fontSize: '0.85rem' }}>
                                Lat: {addr.gpsLocation?.latitude?.toFixed(4)}, Lon: {addr.gpsLocation?.longitude?.toFixed(4)}
                            </p>
                        </div>
                    )) : (
                        <div style={{ textAlign: 'center', padding: '2rem', background: '#f8fafc', borderRadius: '12px' }}>
                            <p className="text-muted" style={{ marginBottom: '1rem' }}>No addresses found.</p>
                            <button onClick={() => navigate('/addresses')} className="btn btn-secondary">Add Address First</button>
                        </div>
                    )}
                </div>

                <button 
                    onClick={handlePlaceOrder}
                    disabled={isLoading || !selectedAddress || !items.trim()}
                    className="btn btn-primary"
                    style={{ padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}
                >
                    {isLoading ? 'Processing...' : (
                        <>Place Shipment Order <ArrowRight size={20} /></>
                    )}
                </button>
            </div>
        </div>
    );
};

export default CreateOrder;
