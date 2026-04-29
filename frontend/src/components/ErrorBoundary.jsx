import React from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // Here you would typically log the error to a service like Sentry or Google Analytics
        console.error("Global ErrorBoundary caught an application crash:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // Polished Fallback UI for crashes
            return (
                <div style={{ 
                    height: '80vh', display: 'flex', flexDirection: 'column', 
                    alignItems: 'center', justifyContent: 'center', 
                    background: 'transparent', color: 'var(--text-main)' 
                }}>
                    <AlertTriangle size={64} color="#f59e0b" style={{ marginBottom: '1.5rem' }} />
                    <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
                        System Error Detected
                    </h1>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', textAlign: 'center', maxWidth: '500px', lineHeight: 1.6 }}>
                        We apologize, but a critical error occurred while rendering this module. 
                        Our team has been notified. Please refresh your dashboard to continue.
                    </p>
                    <button 
                        onClick={() => window.location.href = '/dashboard'}
                        style={{
                            background: '#0f172a', color: 'white', border: 'none',
                            padding: '1rem 2.5rem', borderRadius: '14px', fontSize: '1rem',
                            fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem',
                            boxShadow: '0 10px 20px -5px rgba(15, 23, 42, 0.2)'
                        }}
                    >
                        <RefreshCcw size={18} /> Return to Dashboard
                    </button>
                </div>
            );
        }

        return this.props.children; 
    }
}

export default ErrorBoundary;
