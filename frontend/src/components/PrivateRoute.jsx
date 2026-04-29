import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ roles }) => {
    const { user } = useSelector((state) => state.auth);

    if (!user) {
        return <Navigate to="/login" />;
    }

 feature/ui-architecture
    // Case-insensitive role check
    const userRole = user.role?.toLowerCase();
    const allowedRoles = roles?.map(r => r.toLowerCase());

    if (roles && !allowedRoles.includes(userRole)) {
    if (roles && !roles.includes(user.role)) {
 main
        return <Navigate to="/forbidden" />;
    }

    return <Outlet />;
};

export default PrivateRoute;
