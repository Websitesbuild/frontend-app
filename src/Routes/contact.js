import React from "react";

function Contact() {
  return (
    <div className="contact">
      <h1 className="display-3">Contact Us</h1>
      <hr />
      <p className="lead">We would love to hear from you!</p>
      <p className="lead">For any inquiries, please reach out to us at:</p>
      <p className="lead">
        <strong>Email: </strong>
        <a href="mailto: " className="text-decoration-none" style={{ color: 'inherit' }}>nro0343042@gmail.com</a>
            </p>
      <p className="lead">
        <strong>Phone:</strong> +91 (876) 623-2343
      </p>
      <p className="lead">
        <strong>Address:</strong> Building 35, Street 27, Kaushik Enclave, Burari, Delhi, India, 110084
      </p>
      
      <p className="lead">
        We appreciate your feedback and look forward to connecting with you!
      </p>
      <p className="lead">
        For more information, feel free to explore our{" "}
        <a href="/about">About</a> page or return to the{" "}
        <a href="/">Home</a> page.
      </p>
    </div>
  );
}   
export default Contact;