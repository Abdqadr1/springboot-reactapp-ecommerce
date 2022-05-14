import Navbar from "react-bootstrap/Navbar"
import Container from "react-bootstrap/Container"
import Nav from "react-bootstrap/Nav"
import NavDropdown from "react-bootstrap/NavDropdown"
import logo from "../images/logo.png"
import { Dropdown, NavLink } from "react-bootstrap"
import { getAuth, hasAnyAuthority, setAuth } from "./utilities"
import { useState } from "react"
import AccountDetails from "./account_details"
const MyNavbar = () => {
    const auth = getAuth()
    const [showEditInfo, SetShowEditInfo] = useState(false)
    const handleLogout = (event) => {
        setAuth({});
    }
    const showInfo = (event) => {
        event.preventDefault();
        SetShowEditInfo(true)
    }



    return (
        <>
            <Navbar sticky="top" bg="dark" className="navbar-dark" expand="lg">
            <Container>
                <Navbar.Brand href="/">
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
                        {
                            (hasAnyAuthority(auth, ["Admin", "Salesperson"]))
                                ? 
                                <NavDropdown title="Users" id="basic-nav-dropdown" menuVariant="dark">
                                        {
                                            (hasAnyAuthority(auth, ["Admin"]))
                                                ? <NavDropdown.Item href="/account/users">Users</NavDropdown.Item>
                                                : ""
                                        }
                                        {
                                            (hasAnyAuthority(auth, ["Admin", "Salesperson"]))
                                                ? <NavDropdown.Item href="/account/customers">Customers</NavDropdown.Item>
                                                : ""
                                        }
                                    
                                </NavDropdown>
                                : ""
                        }
                        {
                            (hasAnyAuthority(auth, ["Admin", "Salesperson", "Editor", "Shipper"]))
                                ? 
                                    <NavDropdown title="Products" id="basic-nav-dropdown" menuVariant="dark">
                                        {
                                            (hasAnyAuthority(auth, ["Admin", "Salesperson", "Editor", "Shipper"]))
                                            ? <NavDropdown.Item href="#action/3.1">Products</NavDropdown.Item>
                                            : ""
                                        }
                                        {
                                            (hasAnyAuthority(auth, ["Admin", "Editor"]))
                                            ?  <><NavDropdown.Item href="#action/3.2">Categories</NavDropdown.Item>
                                                <NavDropdown.Item href="#action/3.3">Brands</NavDropdown.Item></>
                                            : ""
                                        }
                                        {
                                            (hasAnyAuthority(auth, ["Admin", "Salesperson"]))
                                            ?  <NavDropdown.Item href="#action/3.4">Shipping</NavDropdown.Item>
                                            : ""
                                        }
                                    </NavDropdown>
                                : ""
                        }
                        {
                            (hasAnyAuthority(auth, ["Admin", "Salesperson", "Shipper", "Editor"]))
                                    ? 
                                        <NavDropdown title="Menu" id="basic-nav-dropdown" menuVariant="dark">
                                            {
                                                (hasAnyAuthority(auth, ["Admin", "Salesperson", "Shipper"]))
                                                    ? <NavDropdown.Item href="#action/3.2">Orders</NavDropdown.Item>
                                                    : ""
                                            }
                                            {
                                                (hasAnyAuthority(auth, ["Admin", "Salesperson"]))
                                                    ? <NavDropdown.Item href="#action/3.3">Sales Report</NavDropdown.Item>
                                                    : ""
                                            }
                                            {
                                                (hasAnyAuthority(auth, ["Admin", "Editor"]))
                                                    ? <NavDropdown.Item href="#action/3.1">Articles</NavDropdown.Item>
                                                    : ""
                                            }
                                            {
                                                (hasAnyAuthority(auth, ["Admin"]))
                                                    ? <NavDropdown.Item href="#action/3.4">Settings</NavDropdown.Item>
                                                    : ""
                                            }
                                        </NavDropdown>
                                    : ""
                        }
                        <Dropdown>
                            <Dropdown.Toggle as={NavLink} className="border-0" split variant="dark" id="dropdown-split-basic">
                                <i className="bi bi-person-fill"></i> {auth.firstName} &nbsp;
                            </Dropdown.Toggle>
                            <Dropdown.Menu variant="dark">
                                <Dropdown.Item href="#" onClick={showInfo}>Account Info</Dropdown.Item>
                                <Dropdown.Item href="/login/1" className="text-danger" onClick={handleLogout}>Logout</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
            </Navbar>
            <AccountDetails show={showEditInfo} setShow={SetShowEditInfo} />
        </>
    );
}
 
export default MyNavbar;