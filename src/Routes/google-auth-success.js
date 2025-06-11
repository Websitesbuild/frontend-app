import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function GoogleAuthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // This endpoint returns logged in user info if session cookie is valid
        const response = await axios.get('https://new-backend-3jbn.onrender.com/auth/user', { withCredentials: true });

        if (response.data.success) {
          console.log('Google login successful:', response.data.user);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          localStorage.setItem('isLoggedIn', 'true');
          navigate('/homepage');
        } else {
          console.error('Not authenticated:', response.data.message);
          navigate('/login');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        navigate('/login');
      }
    };

    fetchUserData();
  }, [navigate]);

  return (
    <div>
      <h2>Logging you in...</h2>
    </div>
  );
}

export default GoogleAuthSuccess;
