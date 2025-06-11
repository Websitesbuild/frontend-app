import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

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

function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(""); // "", "register", "google", "github", "discord"

  async function handleSubmit(event) {
    event.preventDefault();
    setLoadingBtn("register");
    const email = event.target.email.value;
    const password = event.target.password.value;

    try {
      const response = await axios.post('https://new-backend-3jbn.onrender.com/register', { email, password });
      if (response.data.success) {
        navigate('/login');
      } else {
        alert('Error during registration: ' + response.data.message);
      }
    } catch (err) {
      alert('Error during registration: ' + err.message);
    } finally {
      event.target.reset();
      setLoadingBtn("");
    }
  }

  const togglePassword = () => setShowPassword(prev => !prev);

  // Social register with loader
  const handleOAuthPopup = (provider) => {
    setLoadingBtn(provider);
    const popup = window.open(
      `https://new-backend-3jbn.onrender.com/auth/${provider}`,
      "_blank",
      "width=500,height=600"
    );

    const receiveMessage = async (event) => {
      if (event.origin !== "https://new-backend-3jbn.onrender.com") return;

      if (event.data.success && event.data.token) {
        localStorage.setItem("token", event.data.token);
        localStorage.setItem("isLoggedIn", "true");
        try {
          const userRes = await axios.get(
            "https://new-backend-3jbn.onrender.com/auth/user",
            {
              headers: {
                Authorization: `Bearer ${event.data.token}`,
              },
            }
          );
          if (userRes.data.success) {
            localStorage.setItem("user", JSON.stringify(userRes.data.user));
            navigate("/homepage");
          } else {
            navigate("/login");
          }
        } catch (err) {
          navigate("/login");
        } finally {
          window.removeEventListener("message", receiveMessage);
          popup?.close();
          setLoadingBtn("");
        }
      } else {
        setLoadingBtn("");
      }
    };

    window.addEventListener("message", receiveMessage, { once: true });
  };

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
              disabled={loadingBtn === "register"}
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
              disabled={loadingBtn === "register"}
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

          <button type="submit" className="btn btn-primary" disabled={loadingBtn === "register"}>
            {loadingBtn === "register" ? (
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
            disabled={!!loadingBtn}
            style={{ minWidth: 120, marginBottom: 8 }}
          >
            {loadingBtn === "google" ? (
              <>
                <Loader />
                Please wait...
              </>
            ) : (
              <>
                <i className="fab fa-google"></i> Google
              </>
            )}
          </button>

          <button
            className="btn btn-danger"
            onClick={() => handleOAuthPopup("github")}
            disabled={!!loadingBtn}
            style={{ minWidth: 120, marginBottom: 8 }}
          >
            {loadingBtn === "github" ? (
              <>
                <Loader />
                Please wait...
              </>
            ) : (
              <>
                <i className="fab fa-github"></i> GitHub
              </>
            )}
          </button>

          <button
            className="btn btn-danger"
            onClick={() => handleOAuthPopup("discord")}
            disabled={!!loadingBtn}
            style={{ minWidth: 120 }}
          >
            {loadingBtn === "discord" ? (
              <>
                <Loader />
                Please wait...
              </>
            ) : (
              <>
                <i className="fab fa-discord"></i> Discord
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;