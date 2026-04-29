import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers, deleteUser } from '../features/admin/adminSlice';
import { Users, Mail, Shield, User, Trash2, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const AdminUserManagement = () => {
    const dispatch = useDispatch();
    const { users, isLoading } = useSelector((state) => state.admin);
    const { user: currentUser } = useSelector((state) => state.auth);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        dispatch(getAllUsers());
    }, [dispatch]);

    const handleDelete = (id, name) => {
        if (id === currentUser.id) {
            return toast.error("You cannot delete your own admin account!");
        }
        if (window.confirm(`Are you sure you want to delete ${name}?`)) {
            dispatch(deleteUser(id));
            toast.success("User deleted successfully");
        }
    };

    const filteredUsers = users.filter(u => 
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.5rem' }}>User Management</h1>
                    <p style={{ color: '#64748b', fontWeight: 500 }}>View and manage all registered users in the platform.</p>
                </div>
                
                <div style={{ position: 'relative', width: '300px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input 
                        type="text"
                        placeholder="Search by email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ 
                            width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', 
                            borderRadius: '12px', border: '2px solid #f1f5f9', 
                            background: 'white', fontSize: '0.9rem', fontWeight: 500,
                            outline: 'none', transition: 'border-color 0.2s'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#455af7'}
                        onBlur={(e) => e.target.style.borderColor = '#f1f5f9'}
                    />
                </div>
            </div>

            <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', textAlign: 'left', borderBottom: '1px solid #f1f5f9' }}>
                            <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>User</th>
                            <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</th>
                            <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Role</th>
                            <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center', padding: '4rem' }}>
                                    <p style={{ color: '#64748b', fontWeight: 600 }}>Loading users...</p>
                                </td>
                            </tr>
                        ) : filteredUsers.length > 0 ? (
                            filteredUsers.map((u) => (
                                <motion.tr 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    key={u._id} 
                                    style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }}
                                >
                                    <td style={{ padding: '1.25rem 1.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ 
                                                width: '40px', height: '40px', borderRadius: '12px', 
                                                background: '#455af710', color: '#455af7',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                                            }}>
                                                <User size={20} />
                                            </div>
                                            <span style={{ fontWeight: 700, color: '#1e293b' }}>{u.name}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.25rem 1.5rem', color: '#64748b', fontWeight: 500 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Mail size={16} />
                                            {u.email}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.25rem 1.5rem' }}>
                                        <div style={{ 
                                            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                                            padding: '0.35rem 0.75rem', borderRadius: '20px',
                                            fontSize: '0.75rem', fontWeight: 800,
                                            background: u.role === 'admin' ? '#ef444410' : (u.role === 'agent' ? '#f59e0b10' : '#455af710'),
                                            color: u.role === 'admin' ? '#ef4444' : (u.role === 'agent' ? '#f59e0b' : '#455af7'),
                                            textTransform: 'capitalize'
                                        }}>
                                            {u.role === 'admin' ? <Shield size={14} /> : <User size={14} />}
                                            {u.role}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.25rem 1.5rem' }}>
                                        <button 
                                            onClick={() => handleDelete(u._id, u.name)}
                                            style={{ 
                                                background: 'none', border: 'none', color: '#94a3b8', 
                                                cursor: 'pointer', transition: 'color 0.2s'
                                            }}
                                            onMouseOver={(e) => e.currentTarget.style.color = '#ef4444'}
                                            onMouseOut={(e) => e.currentTarget.style.color = '#94a3b8'}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </motion.tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center', padding: '4rem' }}>
                                    <p style={{ color: '#64748b', fontWeight: 600 }}>No users found.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminUserManagement;
