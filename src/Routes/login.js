import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye"; // import the eye icon from MUI

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // state for toggling password visibility

  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post(
  "https://new-backend-3jbn.onrender.com/login", // <- change this
  { email, password },
  { withCredentials: true }
);

    if (response.data.success) {
      console.log("Login successful:", response.data.message);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("isLoggedIn", "true");
      navigate("/homepage");
    } else {
      console.error("Error during login:", response.data.message);
      alert(response.data.message);
    }
  } catch (error) {
    console.error("Login failed:", error);
    alert("Invalid Credentials. Please try again.");
  } finally {
    setEmail("");
    setPassword("");
  }
};

const handleGoogleLogin = () => {
  const popup = window.open(
    "https://new-backend-3jbn.onrender.com/auth/google",
    "_blank",
    "width=500,height=600"
  );

  const receiveMessage = async (event) => {
    if (event.origin !== "https://new-backend-3jbn.onrender.com") return;

    if (event.data.success) {
      try {
        const response = await axios.get("https://new-backend-3jbn.onrender.com/auth/user", {
          withCredentials: true
        });

        if (response.data.success && response.data.user) {
          localStorage.setItem("user", JSON.stringify(response.data.user));
          localStorage.setItem("isLoggedIn", "true");
          navigate("/homepage");
        } else {
          navigate("/login");
        }
      } catch (error) {
        navigate("/login");
      } finally {
        window.removeEventListener("message", receiveMessage);
        popup.close();
      }
    }
  };

  window.addEventListener("message", receiveMessage);
};



  return (
    <div className="login-container">
      <h1>Login</h1>
      <div className="login-box">
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-3" style={{ position: "relative" }}>
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                
              }}
              aria-label={showPassword ? "Hide password" : "Show password"}
              title={showPassword ? "Hide password" : "Show password"}
            >
              <RemoveRedEyeIcon />
            </span>
          </div>

          <button type="submit" className="btn btn-primary">
            Login
          </button>

          <p className="mt-3">
            Don't have an account? <a href="/register">Register here</a>
          </p>
        </form>

        <hr />
        <div className="social-login">
          <h2>Or login with:</h2>

          <button
            className="btn btn-danger"
            onClick={handleGoogleLogin}
          >
            <i className="fab fa-google"></i> Google
          </button>

          <button
            className="btn btn-danger"
            onClick={() => {
              window.open(
    "https://new-backend-3jbn.onrender.com/auth/github",
    "_self" // or "_blank" if you prefer new tab
  );
            }}
          >
            <i className="fab fa-github"></i> GitHub
          </button>

          <button
            className="btn btn-danger"
            onClick={() => {
              window.open(
    "https://new-backend-3jbn.onrender.com/auth/discord",
    "_self" // or "_blank" if you prefer new tab
  );
            }}
          >
            <i className="fab fa-discord"></i> Discord
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
