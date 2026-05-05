import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { logout, reset } from '../features/auth/authSlice';
import { BACKEND_URL } from '../config';
import { LogOut, Search, HelpCircle, Bell } from 'lucide-react';
import Notifications from './Notifications';
import { motion } from 'framer-motion';

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const onLogout = () => {
        dispatch(logout());
        dispatch(reset());
        navigate('/');
    };

    return (
        <nav className="navbar">
            {/* Search Bar */}
            <div className="navbar__search">
                <Search size={18} className="navbar__search-icon" />
                <input
                    type="text"
                    placeholder="Search anything..."
                    className="navbar__search-input"
                />
            </div>

            {/* Right Actions */}
            <div className="navbar__actions">
                <div className="navbar__icon-group">
                    <motion.button
                        whileHover={{ y: -2, scale: 1.05 }}
                        className="navbar__icon-btn"
                        title="Help"
                    >
                        <HelpCircle size={20} />
                    </motion.button>
                    <Notifications />
                </div>

                <div className="navbar__divider" />

                {/* Profile */}
                <Link to="/profile" className="navbar__profile">
                    <motion.div
                        whileHover={{ x: 2 }}
                        className="navbar__profile-inner"
                    >
                        <div className="navbar__profile-text">
                            <p className="navbar__profile-name">{user?.name}</p>
                            <p className="navbar__profile-sub">Account Settings</p>
                        </div>
                        <div className="navbar__avatar">
                            {user?.profilePhoto && user.profilePhoto !== 'default-avatar.png' ? (
                                <img
                                    src={`${BACKEND_URL}${user.profilePhoto}`}
                                    alt="User"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            ) : (
                                user?.name?.charAt(0)
                            )}
                        </div>
                    </motion.div>
                </Link>

                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onLogout}
                    className="navbar__logout"
                    title="Logout Session"
                >
                    <LogOut size={20} />
                </motion.button>
            </div>
        </nav>
    );
};

export default Navbar;
