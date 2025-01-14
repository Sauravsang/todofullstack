import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap
import "../style/Rigister.css"; //  custom CSS
import axios from "axios";
import toast, { useToaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { baseURL } from "../varibles";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission logic here
    try {
      let res = await axios.post(`${baseURL}/api/users/register`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else if (res.data.message === "User already exists") {
        toast.error(res.data.message);
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else {
        toast.success(res.data.message);
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="container">
      <div className="myCard">
        <div className="row">
          <div className="col-md-6">
            <div className="myLeftCtn">
              <form className="myForm text-center" onSubmit={handleSubmit}>
                <header>Create new account</header>

                <div className="form-group">
                  <i className="fas fa-user"></i>
                  <input
                    className="myInput"
                    type="text"
                    id="fullname"
                    name="fullName"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <i className="fas fa-user"></i>
                  <input
                    className="myInput"
                    id="username"
                    name="username"
                    placeholder="Enter a username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <i className="fas fa-envelope"></i>
                  <input
                    className="myInput"
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <i className="fas fa-lock"></i>
                  <input
                    className="myInput"
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Enter a password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <input type="submit" className="butt" value="CREATE ACCOUNT" />
                <p className="signup-prompt">
                  You have an account?<Link to="/login">Login</Link>
                </p>
              </form>
            </div>
          </div>

          <div className="col-md-6">
            <div className="myRightCtn">
              <div className="box">
                <header>Welcome to Your Personal To-Do Manager</header>
                <p>
                  Stay organized, boost productivity, and never miss a task
                  again! Our app helps you manage your daily goals with ease.
                  Whether it’s work deadlines, personal errands, or long-term
                  projects, we’ve got you covered. Start creating your to-do
                  list and experience a seamless way to track your tasks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
