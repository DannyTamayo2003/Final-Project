import { useState, useEffect } from "react";
import '../style/NavBarStyle.css'
import { Navbar, Nav, Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import logo from '../assets/ProvaLogo.png'
import userImg from '../assets/userimg.jpg'

export default function NavBarComponent({ menuOpen, setMenuOpen }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("userId");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <Navbar expand="lg" className="bg-body-tertiary fixed-top">
      <Container id="navbarContainer" fluid>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center logoContainer">
          <img id='Logo' src={logo} alt="ProvaLogo" />
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          onClick={() => setMenuOpen(open => !open)}
        />
        <Navbar.Collapse
          id="basic-navbar-nav"
          className={menuOpen ? "show" : ""}
        >
          <Nav className="linkContainer">
            <Nav.Link as={Link} to="/" className="nav-link-red">Home</Nav.Link>
            <Nav.Link as={Link} to="/contacts" className="nav-link-red">Contacts</Nav.Link>
            <Nav.Link as={Link} to="/favorite" className={`navLinkOrange ${!isLoggedIn ? "disabled-link" : ""}`}
              onClick={(e) => {
                if (!isLoggedIn) e.preventDefault(); // blocca il click se non loggato
              }}>Favorite</Nav.Link>
            {isLoggedIn ? (
              <Nav.Link as={Link} to="/account" className="nav-link-red d-lg-none navLinkLogin">Account</Nav.Link>
            ) : (
              <Nav.Link as={Link} to="/login" className="nav-link-red d-lg-none navLinkLogin">Login</Nav.Link>
            )}
            <Nav.Link as={Link} to={isLoggedIn ? "/createevent" : "#"}
              className={`nav-link-red navLinkCreateEvent ${!isLoggedIn ? "disabled-link" : ""}`}
              onClick={(e) => {
                if (!isLoggedIn) e.preventDefault(); // blocca il click se non loggato
              }}
            >Create Event</Nav.Link>
          </Nav>

          <div className="loginUser d-none d-lg-flex">
            <Link to={isLoggedIn ? "/account" : "/login"}>
              <img
                src={userImg}
                alt="User Icon"
                className="user-icon-img"
                id="userImg"
                style={{ cursor: 'pointer' }}
              />
            </Link>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}