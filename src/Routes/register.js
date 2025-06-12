import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        'https://new-backend-3jbn.onrender.com/register',
        { email, password }
      );
      if (response.data.success) {
        navigate('/login');
      } else {
        alert('Error during registration: ' + response.data.message);
      }
    } catch (err) {
      alert('Error during registration: ' + err.message);
    }
    setLoading(false);
    setEmail("");
    setPassword("");
    event.target.reset();
  }

  const togglePassword = () => setShowPassword(prev => !prev);

  // Social register with JWT handling
  const handleOAuthPopup = (provider) => {
    const popup = window.open(
      `https://new-backend-3jbn.onrender.com/auth/${provider}`,
      "_blank",
      "width=500,height=600"
    );

    const allowedOrigins = [
      "https://frontend-app-inky-three.vercel.app",
      "https://new-backend-3jbn.onrender.com",
      "http://localhost:3000",
      "http://localhost:5000"
    ];

    const receiveMessage = async (event) => {
      if (
        !allowedOrigins.includes(event.origin) ||
        !event.data ||
        event.data.source === "react-devtools-bridge" ||
        event.data.source === "react-devtools-content-script" ||
        !event.data.success ||
        !event.data.token
      ) {
        return;
      }

      window.removeEventListener("message", receiveMessage);
      popup?.close();

      try {
        localStorage.setItem("token", event.data.token);
        localStorage.setItem("isLoggedIn", "true");

        const response = await axios.get(
          "https://new-backend-3jbn.onrender.com/auth/user",
          {
            headers: {
              Authorization: `Bearer ${event.data.token}`,
            },
          }
        );

        if (response.data.success) {
          localStorage.setItem("user", JSON.stringify(response.data.user));
          navigate("/homepage");
        } else {
          navigate("/login");
        }
      } catch (err) {
        navigate("/login");
      }
    };

    window.addEventListener("message", receiveMessage, { once: true });
  };

  // Loader spinner component
  function Loader() {
    return (
      <span
        style={{
          display: "inline-block",
          width: 18,
          height: 18,
          border: "2px solid #fff",
          borderTop: "2px solid #007bff",
          borderRadius: "50%",
          marginRight: 8,
          verticalAlign: "middle",
          animation: "spin 1s linear infinite",
        }}
      />
    );
  }

  // Add keyframes for loader animation (only once)
  if (!document.getElementById("register-spinner-style")) {
    const style = document.createElement("style");
    style.id = "register-spinner-style";
    style.innerHTML = `
    @keyframes spin {
      0% { transform: rotate(0deg);}
      100% { transform: rotate(360deg);}
    }`;
    document.head.appendChild(style);
  }

  return (
    <div className="register-container login-container">
      <h1>Register</h1>
      <div className="register-box login-box">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="mb-3 position-relative">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              id="password"
              placeholder="Enter your password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={loading}
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

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <>
                <Loader />
                Please wait...
              </>
            ) : (
              "Register"
            )}
          </button>

          <p className="mt-3">
            Already have an account? <a href="/login">Login here</a>
          </p>
        </form>

        <hr />
        <div className="social-login">
          <h2>Or register with:</h2>
          <button
            className="btn btn-danger"
            onClick={() => handleOAuthPopup("google")}
          >
            <i className="fab fa-google"></i> Google
          </button>

          <button
            className="btn btn-danger"
            onClick={() => handleOAuthPopup("github")}
          >
            <i className="fab fa-github"></i> GitHub
          </button>

          <button
            className="btn btn-danger"
            onClick={() => handleOAuthPopup("discord")}
          >
            <i className="fab fa-discord"></i> Discord
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;