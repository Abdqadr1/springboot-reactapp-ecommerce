import logo from "./images/logo.png";
import {Navbar, Nav, Container} from 'react-bootstrap';
import { Link } from "react-router-dom";

const NavBar = () => {
    return (
      <Navbar sticky="top" bg="dark" className="navbar-dark" expand="lg">
        <Container>
          <Navbar.Brand href="/">
            <img
              src={logo}
              width="30"
              height="30"
              className="d-inline-block align-top"
              alt="Shopping app logo"
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Link className="nav-link" to="#home">Careers</Link>
              <Link className="nav-link" to="#link">Payments</Link>
              <Link className="nav-link" to="#link">Shipping & Delivery</Link>
              <Link className="nav-link" to="#link">Contact</Link>
              <Link className="nav-link" to="#link">Register</Link>
              <Link className="nav-link" to="/login">Login</Link>
              {/* <NavDropdown title="Dropdown" id="basic-nav-dropdown" menuVariant="dark" >
                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
              </NavDropdown> */}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
}
 
export default NavBar;