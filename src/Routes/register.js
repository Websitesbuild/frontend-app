import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;

    // Use deployed backend URL
    const response = await axios.post('https://new-backend-3jbn.onrender.com/register', { email, password });
    if (response.data.success) {
      // Optionally, you could auto-login here by requesting /login and storing the JWT
      // For now, just redirect to login
      navigate('/login');
    } else {
      alert('Error during registration: ' + response.data.message);
    }

    event.target.reset();
  }

  const togglePassword = () => setShowPassword(prev => !prev);

  return (
    <div className="register-container login-container">
      <h1>Register</h1>
      <div className="register-box login-box">
        <form onSubmit={handleSubmit}>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input type="email" className="form-control" id="email" placeholder="Enter your email" required />
          </div>

          <div className="mb-3 position-relative">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              id="password"
              placeholder="Enter your password"
              required
            />
            <span
              onClick={togglePassword}
              style={{
                position: "absolute",
                top: "45px",
                right: "10px",
                cursor: "pointer",
                color: "#666"
              }}
            >
              {showPassword ? <VisibilityOffIcon /> : <RemoveRedEyeIcon />}
            </span>
          </div>

          <button type="submit" className="btn btn-primary">Register</button>

          <p className="mt-3">
            Already have an account? <a href="/login">Login here</a>
          </p>
        </form>

        <hr />
        <div className="social-login">
          <h2>Or register with:</h2>
          <button
            className="btn btn-danger"
            onClick={() => {
              window.open("https://new-backend-3jbn.onrender.com/auth/google", "_blank", "width=500,height=600");
            }}
          >
            <i className="fab fa-google"></i> Google
          </button>

          <button
            className="btn btn-danger"
            onClick={() => {
              window.open("https://new-backend-3jbn.onrender.com/auth/github", "_blank", "width=500,height=600");
            }}
          >
            <i className="fab fa-github"></i> GitHub
          </button>

          <button
            className="btn btn-danger"
            onClick={() => {
              window.open("https://new-backend-3jbn.onrender.com/auth/discord", "_blank", "width=500,height=600");
            }}
          >
            <i className="fab fa-discord"></i> Discord
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;