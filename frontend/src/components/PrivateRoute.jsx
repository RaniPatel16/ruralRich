import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ roles }) => {
    const { user } = useSelector((state) => state.auth);

    if (!user) {
        return <Navigate to="/login" />;
    }

    // Role-based access control
    if (roles && !roles.includes(user.role)) {
        return <Navigate to="/forbidden" />;
    }

    return <Outlet />;
};

export default PrivateRoute;
