import React from 'react';

const Input = ({ label, type = 'text', value, onChange, placeholder, required = false, ...props }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
            {label && (
                <label style={{ fontWeight: '600', fontSize: '0.9rem', color: '#334155' }}>
                    {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
                </label>
            )}
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                style={{
                    padding: '0.8rem 1rem',
                    borderRadius: '10px',
                    border: '2px solid #e2e8f0',
                    background: '#f8fafc',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                }}
                onFocus={(e) => e.target.style.borderColor = '#455af7'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                {...props}
            />
        </div>
    );
};

export default Input;
