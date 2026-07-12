import { Navigate } from 'react-router-dom';

/**
 * Wraps private pages. Redirects unauthenticated users to /login.
 * Checks for the presence of a JWT token in localStorage.
 */
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;