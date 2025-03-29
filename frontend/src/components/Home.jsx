import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {    
    const token = localStorage.getItem('userToken');
    if (token) {
      setIsLoggedIn(true);
    }
    else {
      setIsLoggedIn(false);
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    setIsLoggedIn(false);
    navigate('/home');
  };
  return (
    <div className="container" style={{ paddingTop: '50px' }}>
    <div className="row justify-content-center">
      <div className="col-md-8">
        <div className="card shadow-sm mt-5">
          <div className="card-body text-center">
            <h1>Welcome to the Home Page Admin!</h1>            
            <div className="mt-4">
              {!isLoggedIn ? (
                <>
                  <Link to="/register" className="btn btn-primary mx-2">Register</Link>
                  <Link to="/login" className="btn btn-secondary mx-2">Login</Link>
                </>
              ) : (
                <button onClick={handleLogout} className="btn btn-danger mx-2">Logout</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default Home;
