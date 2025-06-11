import React from "react";
import img from "../assets/logo.png"; // Adjust the path as necessary
function Home(){
    return (
        <div className="home">
            <img src={img} alt="Home" />
            <h1 class="display-3">Work App</h1>
            <hr/>
            <p class="lead">Join us to collaborate and achieve more.</p>
            <p class="lead">Create an account or login to get started.</p>
            <div className="btn-group" role="group" aria-label="Basic example">
                <a href="/register" className="btn btn-primary">Register</a>
                <a href="/login" className="btn btn-secondary">Login</a>
            </div>
            <p class="lead">Or explore our <a href="/about">About</a> and <a href="/contact">Contact</a> pages.</p>
        </div>
    );
}

export default Home;