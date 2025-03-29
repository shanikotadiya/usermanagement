import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    setIsLoggedIn(!!token); 
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    setIsLoggedIn(false); 
    navigate('/login');
  };
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
    <div className="container-fluid">
      <Link className="navbar-brand" to="/">MyApp</Link>

      <div className="navbar-nav justify-content-center">
        <ul className="navbar-nav d-flex align-items-center">
          <li className="nav-item mx-2">
            <Link className="nav-link" to="/customerregister">
              <button className="btn btn-outline-primary px-4">Customer Register</button>
            </Link>
          </li>
          
          <li className="nav-item mx-2">
            <Link className="nav-link" to="/adminregister">
              <button className="btn btn-outline-success px-4">Admin Register</button>
            </Link>
          </li>
          
          {!isLoggedIn ? (
            <li className="nav-item mx-2">
              <Link className="nav-link" to="/login">
                <button className="btn btn-outline-dark px-4">Login</button>
              </Link>
            </li>
          ) : (
            <li className="nav-item mx-2">
              <button className="btn btn-outline-danger px-4" onClick={handleLogout}>Logout</button>
            </li>
          )}
        </ul>
      </div>
    </div>
  </nav>
  );
};

export default Navbar;
