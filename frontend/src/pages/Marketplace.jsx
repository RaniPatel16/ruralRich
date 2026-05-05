import { useState } from 'react';
import { Package, Truck, Zap, Info, Shield, MapPin, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Marketplace = () => {
    const navigate = useNavigate();
    const [packageType, setPackageType] = useState('box');
    const [weight, setWeight] = useState('');
    const [speed, setSpeed] = useState('standard');

    const handleContinue = () => {
        // Build a prefilled item description based on their choices
        const description = `Courier: ${packageType.toUpperCase()}, ${weight || 'Unknown'} kg, ${speed.toUpperCase()} delivery.`;
        navigate('/orders/new', { state: { prefilledItem: description } });
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ paddingBottom: '4rem', maxWidth: '1000px', margin: '0 auto' }}
        >
            <div style={{ marginBottom: '3rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#455af7', fontSize: '0.9rem', fontWeight: 800, marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    <Truck size={16} />
                    RuralReach Express
                </div>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem', color: '#0f172a', letterSpacing: '-0.02em' }}>
                    Send a Parcel
                </h1>
                <p style={{ color: '#64748b', fontSize: '1.1rem', fontWeight: 500 }}>
                    Fast, secure, and smart logistics for rural destinations. Tell us what you're sending.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))', gap: '3rem', alignItems: 'start' }}>
                
                {/* Left Side: Input Form */}
                <div style={{ display: 'grid', gap: '2rem' }}>
                    
                    {/* Package Type Selection */}
                    <div className="card" style={{ padding: '2rem' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.5rem', color: '#0f172a' }}>1. Package Type</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))', gap: '1rem' }}>
                            {[
                                { id: 'document', icon: <Search size={24} />, label: 'Document' },
                                { id: 'box', icon: <Package size={24} />, label: 'Standard Box' },
                                { id: 'cargo', icon: <Truck size={24} />, label: 'Heavy Cargo' }
                            ].map((type) => (
                                <div 
                                    key={type.id}
                                    onClick={() => setPackageType(type.id)}
                                    style={{
                                        border: `2px solid ${packageType === type.id ? '#455af7' : '#e2e8f0'}`,
                                        background: packageType === type.id ? '#eef2ff' : 'white',
                                        padding: '1.5rem 1rem',
                                        borderRadius: '16px',
                                        cursor: 'pointer',
                                        textAlign: 'center',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <div style={{ color: packageType === type.id ? '#455af7' : '#64748b', marginBottom: '0.5rem' }}>
                                        {type.icon}
                                    </div>
                                    <p style={{ fontWeight: 700, fontSize: '0.9rem', color: packageType === type.id ? '#455af7' : '#334155' }}>
                                        {type.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Weight & Dimensions */}
                    <div className="card" style={{ padding: '2rem' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.5rem', color: '#0f172a' }}>2. Weight & Speed</h3>
                        
                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.5rem', color: '#334155' }}>Estimated Weight (kg)</label>
                            <input 
                                type="number" 
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                                placeholder="E.g., 5.5"
                                style={{ 
                                    width: '100%', padding: '1rem', borderRadius: '12px', border: '2px solid #e2e8f0', 
                                    fontSize: '1.1rem', outline: 'none'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#455af7'}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontWeight: 700, marginBottom: '1rem', color: '#334155' }}>Delivery Speed</label>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div 
                                    onClick={() => setSpeed('standard')}
                                    style={{ 
                                        display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', 
                                        borderRadius: '12px', border: `2px solid ${speed === 'standard' ? '#455af7' : '#e2e8f0'}`,
                                        cursor: 'pointer', background: speed === 'standard' ? '#eef2ff' : 'white'
                                    }}
                                >
                                    <Truck color={speed === 'standard' ? '#455af7' : '#64748b'} />
                                    <div>
                                        <p style={{ fontWeight: 800, color: '#0f172a' }}>Standard Ground</p>
                                        <p style={{ fontSize: '0.85rem', color: '#64748b' }}>3-5 business days to rural zones</p>
                                    </div>
                                </div>
                                <div 
                                    onClick={() => setSpeed('express')}
                                    style={{ 
                                        display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', 
                                        borderRadius: '12px', border: `2px solid ${speed === 'express' ? '#455af7' : '#e2e8f0'}`,
                                        cursor: 'pointer', background: speed === 'express' ? '#eef2ff' : 'white'
                                    }}
                                >
                                    <Zap color={speed === 'express' ? '#f59e0b' : '#64748b'} />
                                    <div>
                                        <p style={{ fontWeight: 800, color: '#0f172a' }}>Priority Express (+ ₹250)</p>
                                        <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Next day delivery via priority fleet</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Right Side: Quick Quote */}
                <div style={{ position: 'sticky', top: '2rem' }}>
                    <div style={{ background: '#0f172a', borderRadius: '24px', padding: '2rem', color: 'white', boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.4)' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Shield size={20} color="#455af7" /> Coverage Guarantee
                        </h3>
                        
                        <div style={{ display: 'grid', gap: '1.5rem', marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <MapPin color="#94a3b8" />
                                <div>
                                    <p style={{ fontWeight: 700 }}>Village Penetration</p>
                                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5 }}>Delivering to unmapped roads and zero-pincode zones.</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <Shield color="#94a3b8" />
                                <div>
                                    <p style={{ fontWeight: 700 }}>Insured Transport</p>
                                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5 }}>Every package is secured up to ₹10,000 automatically.</p>
                                </div>
                            </div>
                        </div>

                        <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '16px', marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ color: '#94a3b8' }}>Base Rate</span>
                                <span style={{ fontWeight: 700 }}>₹50.00</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#94a3b8' }}>Weight Surcharge</span>
                                <span style={{ fontWeight: 700 }}>{weight ? `₹${(weight * 10).toFixed(2)}` : '--'}</span>
                            </div>
                            <hr style={{ borderColor: '#334155', margin: '1rem 0' }} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontWeight: 800 }}>Estimated Quote</span>
                                <span style={{ fontWeight: 900, fontSize: '1.5rem', color: '#455af7' }}>
                                    {weight ? `₹${(50 + (weight * 10) + (speed === 'express' ? 250 : 0)).toFixed(2)}` : '₹--'}
                                </span>
                            </div>
                        </div>

                        <button 
                            onClick={handleContinue}
                            disabled={!weight}
                            style={{ 
                                width: '100%', padding: '1.25rem', borderRadius: '16px', 
                                background: weight ? '#455af7' : '#334155', color: 'white', 
                                fontWeight: 900, fontSize: '1.1rem', border: 'none',
                                cursor: weight ? 'pointer' : 'not-allowed',
                                transition: 'all 0.2s',
                                boxShadow: weight ? '0 10px 25px -5px rgba(69, 90, 247, 0.4)' : 'none'
                            }}
                        >
                            Select Destination →
                        </button>
                        {!weight && <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#94a3b8', marginTop: '1rem' }}>Enter package weight to continue</p>}
                    </div>
                </div>

            </div>
        </motion.div>
    );
};

export default Marketplace;
