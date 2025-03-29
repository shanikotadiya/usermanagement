import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const VerifySuccess = () => {
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const status = queryParams.get('status');

    if (status === 'success') {
      setMessage('Your email has been successfully verified!');
      setIsSuccess(true);
    } else if (status === 'failure') {
      setMessage('Verification failed. The link may have expired or is invalid.');
      setIsSuccess(false);
    } else {
      setMessage('Invalid request');
      setIsSuccess(false);
    }

    setTimeout(() => {
      navigate('/login');  
    }, 5000);  
  }, [location.search, navigate]);

  return (
    <div className="container" style={{ paddingTop: '50px' }}>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm mt-5">
            <div className="card-body text-center">
              <h3 className={isSuccess ? 'text-success' : 'text-danger'}>
                {isSuccess ? 'Verification Successful!' : 'Verification Failed'}
              </h3>
              <p className="lead">{message}</p>
              <div className="alert mt-3" style={{ backgroundColor: isSuccess ? '#28a745' : '#dc3545', color: '#fff' }}>
                <strong>{isSuccess ? 'Thank you for verifying your email!' : 'Oops! Something went wrong!'}</strong>
              </div>

              <div className="mt-3">
                <button className="btn btn-primary" onClick={() => navigate('/login')}>
                  Go to Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifySuccess;
