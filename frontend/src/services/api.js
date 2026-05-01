import axios from 'axios';

const getBaseURL = () => {
    const envURL = import.meta.env.VITE_API_BASE_URL || 'https://ruralreach-backend.onrender.com';
    return envURL.endsWith('/api') ? envURL : `${envURL}/api`;
};

const api = axios.create({
    baseURL: getBaseURL(),
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor for tokens if needed
api.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user?.token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
