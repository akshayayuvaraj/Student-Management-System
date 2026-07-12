import { useNavigate } from 'react-router-dom';

const Navbar = ({ userName }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login', { replace: true });
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="navbar-logo">🎓</span>
        <span className="navbar-title">Student Management System</span>
      </div>

      <div className="navbar-actions">
        {userName && <span className="navbar-user">Hi, {userName}</span>}
        <button className="btn btn-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;