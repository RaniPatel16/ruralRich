const Skeleton = ({ width, height, borderRadius = '0.5rem', marginBottom = '0', className = '' }) => {
    const style = {
        width: width || '100%',
        height: height || '1rem',
        borderRadius,
        marginBottom,
        background: 'linear-gradient(90deg, var(--bg-card) 25%, var(--border) 50%, var(--bg-card) 75%)',
        backgroundSize: '200% 100%',
        animation: 'skeleton-loading 1.5s infinite linear',
    };

    return (
        <div className={`skeleton ${className}`} style={style}>
            <style>{`
                @keyframes skeleton-loading {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
            `}</style>
        </div>
    );
};

export const CardSkeleton = () => (
    <div className="card" style={{ padding: '1.5rem', marginBottom: '1rem' }}>
        <Skeleton width="40%" height="1.5rem" marginBottom="1rem" />
        <Skeleton width="80%" height="1rem" marginBottom="0.5rem" />
        <Skeleton width="60%" height="1rem" />
    </div>
);

export default Skeleton;
