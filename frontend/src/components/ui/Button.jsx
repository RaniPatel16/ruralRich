import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false, ...props }) => {
    const baseStyle = {
        padding: '0.8rem 1.5rem',
        borderRadius: '12px',
        fontWeight: '700',
        cursor: disabled ? 'not-allowed' : 'pointer',
        border: 'none',
        opacity: disabled ? 0.6 : 1,
        transition: 'all 0.2s ease',
    };

    const variants = {
        primary: { background: '#455af7', color: 'white' },
        secondary: { background: '#f1f5f9', color: '#0f172a' },
        danger: { background: '#ef4444', color: 'white' },
        outline: { background: 'transparent', color: '#455af7', border: '2px solid #455af7' }
    };

    return (
        <motion.button
            whileHover={!disabled ? { scale: 1.02 } : {}}
            whileTap={!disabled ? { scale: 0.98 } : {}}
            onClick={onClick}
            disabled={disabled}
            className={className}
            style={{ ...baseStyle, ...variants[variant] }}
            {...props}
        >
            {children}
        </motion.button>
    );
};

export default Button;
