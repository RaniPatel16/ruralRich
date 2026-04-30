import { useSelector } from 'react-redux';

export const useAuth = () => {
    const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

    return {
        user,
        isLoading,
        isError,
        isSuccess,
        message,
        isAdmin: user?.role === 'admin',
        isAgent: user?.role === 'agent',
        isCustomer: user?.role === 'user',
        isAuthenticated: !!user,
    };
};

export default useAuth;
