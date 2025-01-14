import React, { useEffect, useState } from "react";
import { Navbar, Nav, NavDropdown, Container, Dropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "../style/Header.css";
import toast from "react-hot-toast";
import axios from "axios";
import { baseURL } from "../varibles";

const Header = () => {
  const [username, setUsername] = useState(null); // State to store username

  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(true); // State to check if user is logged in

  // Fetch username from backend

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/users/token-verify`, {
        withCredentials: true,
      });

      if (response.data.valid) {
        setUsername(response.data.userInfo.username); // Set username
        setIsLoggedIn(false); // Set isLoggedIn to true
      }
    } catch (error) {
     
      setUsername(null); // Reset username on error
    }
  };

  useEffect(() => {
    fetchUser();
  }, [isLoggedIn]); // Fetch user when location changes

  // Logout handler
  const logout = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/users/logout`, {
        withCredentials: true,
      });

      if (response.data.success) {
        toast.success("Logged Out Successfully!");
        setUsername(null); // Clear username on logout
        setIsLoggedIn(true);
        navigate("/");
      }
    } catch (error) {
      toast.error("Failed to logout");
      console.error(error);
    }
  };

  return (
    <Navbar expand="lg" className="custom-navbar">
      <Container fluid>
        {/* Logo with Text */}
        <Navbar.Brand as={Link} to="/">
          <img
            src="./Todo List.png" // Replace with your logo URL
            alt="Logo"
          />
          <span>To-Do-List</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          {/* Navigation Links */}
          <Nav className="me-auto my-2 my-lg-0" navbarScroll>
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            {isLoggedIn && (
              <NavDropdown title="Sign Up/Sign In" id="navbarScrollingDropdown">
                <NavDropdown.Item as={Link} to="/login">
                  Login
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/register">
                  Register
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>

          {/* User Info */}
          {username && (
            <Dropdown align="end" className="user-dropdown">
              <Dropdown.Toggle variant="outline-primary" id="user-dropdown">
                {username}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={logout}>Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
