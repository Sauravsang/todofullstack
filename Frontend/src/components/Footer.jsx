import React from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../style/Footer.css";

const Footer = () => {
  return (
    <footer>
      <p>© 2024 To-Do-App . All rights reserved.</p>
      <p>
        Built with <span style={{ color: "red" }}>♥</span> by Saurav Sangwan
      </p>

      <div className="social-icons">
        <a href="https://www.instagram.com/sunny._.sangwan/">
          <i className="bi bi-instagram"></i>
        </a>

        <a href="https://www.linkedin.com/in/saurav-sangwan/">
          <i className="bi bi-linkedin"></i>
        </a>
        <a href="https://github.com/Sauravsang">
          <i className="bi bi-github"></i>
        </a>
      </div>
    </footer>
  );
};

export default Footer;
