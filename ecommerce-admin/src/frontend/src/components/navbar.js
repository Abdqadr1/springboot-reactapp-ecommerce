import Navbar from "react-bootstrap/Navbar"
import Container from "react-bootstrap/Container"
import Nav from "react-bootstrap/Nav"
import NavDropdown from "react-bootstrap/NavDropdown"
import logo from "../images/logo.png"
const MyNavbar = (props) => {
    return (
        <Navbar sticky="top" bg="dark" className="navbar-dark" expand="lg">
            <Container>
                <Navbar.Brand href="#home">
                    <img
                        src={logo}
                        width="30"
                        height="30"
                        className="d-inline-block align-top"
                        alt="Shopping logo"
                    />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto w-100 justify-content-end">
                        <NavDropdown title="Users" id="basic-nav-dropdown">
                            <NavDropdown.Item href="#action/3.1">Users</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.2">Customers</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="Products" id="basic-nav-dropdown">
                            <NavDropdown.Item href="#action/3.1">Products</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.2">Categories</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.3">Brands</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#action/3.4">Shipping</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="Menu" id="basic-nav-dropdown">
                            <NavDropdown.Item href="#action/3.2">Orders</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.3">Sales Report</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.1">Articles</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#action/3.4">Settings</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
 
export default MyNavbar;