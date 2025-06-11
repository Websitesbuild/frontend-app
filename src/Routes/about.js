import React from "react";

function About() {
  return (
    <div className="about">
      <h1 className="display-3">About Us</h1>
      <hr />
      <p className="lead">
        Welcome to our Work App! We are dedicated to providing a platform that
        enhances collaboration and productivity.
      </p>
      <p className="lead">
        Our mission is to connect people and streamline workflows, making it
        easier for teams to achieve their goals.
      </p>
      <p className="lead">
        For more information, feel free to explore our{" "}
        <a href="/contact">Contact</a> page or return to the{" "}
        <a href="/">Home</a> page.
      </p>
    </div>
  );
}
export default About;