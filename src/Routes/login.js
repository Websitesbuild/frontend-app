import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";

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
if (!document.getElementById("login-spinner-style")) {
  const style = document.createElement("style");
  style.id = "login-spinner-style";
  style.innerHTML = `
  @keyframes spin {
    0% { transform: rotate(0deg);}
    100% { transform: rotate(360deg);}
  }`;
  document.head.appendChild(style);
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(""); // "", "login", "google", "github", "discord"

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoadingBtn("login");
    try {
      const response = await axios.post(
        "https://new-backend-3jbn.onrender.com/login",
        { email, password }
      );

      if (response.data.success && response.data.token) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("token", response.data.token); // Store JWT
        navigate("/homepage");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      alert("Login failed. Try again.");
    } finally {
      setEmail("");
      setPassword("");
      setLoadingBtn("");
    }
  };

 const handleOAuthPopup = (provider) => {
  setLoadingBtn(provider);

  const popup = window.open(
    `https://new-backend-3jbn.onrender.com/auth/${provider}`,
    "_blank",
    "width=500,height=600"
  );

  if (!popup || popup.closed || typeof popup.closed === "undefined") {
    alert("Popup blocked! Please allow popups for this site.");
    setLoadingBtn("");
    return;
  }

  const timeout = setTimeout(() => {
    alert("Login timed out. Please try again.");
    setLoadingBtn("");
    popup?.close();
  }, 100000); // 10 seconds timeout for safety

 const allowedOrigins = [
  "https://new-backend-3jbn.onrender.com",
  "http://localhost:5000", // add your backend dev URL if needed
];

const receiveMessage = async (event) => {
  // DEBUG: See what origin is sending the message
  console.log("OAuth message from:", event.origin, event.data);

  if (!allowedOrigins.includes(event.origin)) return;

  clearTimeout(timeout);
  window.removeEventListener("message", receiveMessage);
  popup?.close();

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
        setLoadingBtn("");
        navigate("/homepage");
      } else {
        setLoadingBtn("");
        navigate("/login");
      }
    } catch (err) {
      setLoadingBtn("");
      navigate("/login");
    }
  } else {
    setLoadingBtn("");
  }
};

  window.addEventListener("message", receiveMessage, { once: true });
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
              disabled={loadingBtn === "login"}
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
              disabled={loadingBtn === "login"}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: 10,
                top: 38,
                cursor: "pointer",
                color: "#888"
              }}
              aria-label={showPassword ? "Hide password" : "Show password"}
              title={showPassword ? "Hide password" : "Show password"}
            >
              <RemoveRedEyeIcon />
            </span>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loadingBtn === "login"}
            style={{ minWidth: 120 }}
          >
            {loadingBtn === "login" ? (
              <>
                <Loader />
                Please wait...
              </>
            ) : (
              "Login"
            )}
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

export default Login;