import React from "react";
import { useNavigate } from 'react-router-dom';
import img from "../assets/logo.png"; // Adjust the path as necessary

function Header() {
    const navigate = useNavigate();
    
      function handleLogout() {
        localStorage.removeItem('isLoggedIn');
        navigate('/login', { replace: true });
      }
    return (
        <header className="text-white p-3 header">
        <div className="container">
            <a href="/" className="logo-link">
            <img src={img} alt="Logo" className="logo" />
            </a>
            <h1>My Work App</h1>
            <nav>
                <ul className="nav justify-content-center">
                    <li className="nav-item">
                        <a className="nav-link" href="/">Home</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="/about">About</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="/contact">Contact</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="/login" onClick={handleLogout}>Signout</a>
                    </li>
                </ul>
            </nav>


        </div>
        </header>
    );
    }
export default Header;