import { Skeleton, Box, Grid } from '@mui/material';

const SkeletonLoader = ({ type = 'card', count = 1 }) => {
    const renderSkeleton = () => {
        switch (type) {
            case 'table':
                return (
                    <Box sx={{ width: '100%' }}>
                        <Skeleton height={60} />
                        <Skeleton height={40} />
                        <Skeleton height={40} />
                        <Skeleton height={40} />
                        <Skeleton height={40} />
                    </Box>
                );
            case 'form':
                return (
                    <Box sx={{ display: 'grid', gap: 3 }}>
                        <Skeleton height={56} variant="rounded" />
                        <Skeleton height={56} variant="rounded" />
                        <Skeleton height={56} variant="rounded" />
                        <Skeleton height={80} variant="rounded" />
                    </Box>
                );
            case 'dashboard':
                return (
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}><Skeleton height={150} variant="rounded" /></Grid>
                        <Grid item xs={12} md={4}><Skeleton height={150} variant="rounded" /></Grid>
                        <Grid item xs={12} md={4}><Skeleton height={150} variant="rounded" /></Grid>
                        <Grid item xs={12}><Skeleton height={300} variant="rounded" /></Grid>
                    </Grid>
                );
            default: // card
                return (
                    <Box sx={{ p: 2, border: '1px solid #f1f5f9', borderRadius: '16px' }}>
                        <Skeleton variant="rectangular" height={180} sx={{ borderRadius: '12px', mb: 2 }} />
                        <Skeleton width="60%" height={30} />
                        <Skeleton width="40%" height={20} />
                    </Box>
                );
        }
    };

    return (
        <Box sx={{ width: '100%' }}>
            {[...Array(count)].map((_, i) => (
                <Box key={i} sx={{ mb: 3 }}>
                    {renderSkeleton()}
                </Box>
            ))}
        </Box>
    );
};

export default SkeletonLoader;
