import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import SkeletonLoader from './components/SkeletonLoader';
import SEO from './components/SEO';

const MainLayout = lazy(() => import('./layouts/MainLayout'));
const PrivateRoute = lazy(() => import('./components/PrivateRoute'));
const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const CreateAddress = lazy(() => import('./pages/CreateAddress'));
const AddressList = lazy(() => import('./pages/AddressList'));
const CreateOrder = lazy(() => import('./pages/CreateOrder'));
const OrderHistory = lazy(() => import('./pages/OrderHistory'));
const OrderTracking = lazy(() => import('./pages/OrderTracking'));
const Marketplace = lazy(() => import('./pages/Marketplace'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminOrderManagement = lazy(() => import('./pages/AdminOrderManagement'));
const AgentManagement = lazy(() => import('./pages/AgentManagement'));
const AdminUserManagement = lazy(() => import('./pages/AdminUserManagement'));
const Forbidden = lazy(() => import('./pages/Forbidden'));
const SmartLogistics = lazy(() => import('./pages/SmartLogistics'));
const AgentEarnings = lazy(() => import('./pages/AgentEarnings'));
const AgentDashboard = lazy(() => import('./pages/AgentDashboard'));
const Profile = lazy(() => import('./pages/Profile'));


function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}



function App() {
  return (
    <Router>
      <SEO />
      <ScrollToTop />
      <Toaster position="top-center" reverseOrder={false} />
      <MainLayout>
        <Suspense fallback={<SkeletonLoader type="dashboard" />}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forbidden" element={<Forbidden />} />
            
            {/* Protected Main Routes */}
            <Route element={<PrivateRoute roles={['user', 'admin', 'agent']} />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/addresses/new" element={<CreateAddress />} />
              <Route path="/addresses" element={<AddressList />} />
              <Route path="/orders/new" element={<CreateOrder />} />
              <Route path="/orders/history" element={<OrderHistory />} />
              <Route path="/orders/:id" element={<OrderTracking />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            {/* Logistics Routes */}
            <Route element={<PrivateRoute roles={['admin', 'agent']} />}>
              <Route path="/logistics" element={<SmartLogistics />} />
            </Route>

            <Route element={<PrivateRoute roles={['agent']} />}>
              <Route path="/agent/dashboard" element={<AgentDashboard />} />
              <Route path="/earnings" element={<AgentEarnings />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<PrivateRoute roles={['admin']} />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/orders" element={<AdminOrderManagement />} />
              <Route path="/admin/agents" element={<AgentManagement />} />
              <Route path="/admin/users" element={<AdminUserManagement />} />
            </Route>
          </Routes>
        </Suspense>
      </MainLayout>
    </Router>
  );
}

export default App;
