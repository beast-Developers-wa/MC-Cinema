import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = () => {
  const { authenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // You can customize this loader or use a spinner component
    return (
      <div
        role="alert"
        aria-busy="true"
        aria-live="polite"
        style={{ textAlign: 'center', padding: '2rem' }}
      >
        Loading...
      </div>
    );
  }

  if (!authenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return <Outlet />;
};

export default PrivateRoute;
