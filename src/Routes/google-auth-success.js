import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function GoogleAuthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Always use your deployed backend URL
        const response = await axios.get(
          'https://new-backend-3jbn.onrender.com/auth/user',
          { withCredentials: true }
        );

        if (response.data.success && response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
          localStorage.setItem('isLoggedIn', 'true');
          navigate('/homepage');
        } else {
          navigate('/login');
        }
      } catch (error) {
        // Optionally show a message or redirect
        navigate('/login');
      }
    };

    fetchUserData();
  }, [navigate]);

  return (
    <div style={{ textAlign: 'center', marginTop: '3rem' }}>
      <h2>Logging you in...</h2>
      <p>If you are not redirected, <a href="/login">click here</a>.</p>
    </div>
  );
}

export default GoogleAuthSuccess;