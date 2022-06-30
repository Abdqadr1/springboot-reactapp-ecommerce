import Navbar from "react-bootstrap/Navbar"
import Container from "react-bootstrap/Container"
import Nav from "react-bootstrap/Nav"
import NavDropdown from "react-bootstrap/NavDropdown"
import { Dropdown, NavLink } from "react-bootstrap"
import { hasAnyAuthority } from "./utilities"
import { useState } from "react"
import AccountDetails from "./account_details"
import { Link, Navigate } from "react-router-dom"
import useAuth from "./custom_hooks/use-auth"
import useSettings from "./custom_hooks/use-settings"
const MyNavbar = () => {
    
    const [auth, setAuth] = useAuth();
    const { SITE_LOGO } = useSettings();
    const [showEditInfo, SetShowEditInfo] = useState(false)
    const handleLogout = (event) => {
        setAuth({});
    }
    const showInfo = (event) => {
        event.preventDefault();
        SetShowEditInfo(true)
    }

    if(!auth || !auth?.accessToken) return <Navigate to="/login" />
    return (
        <>
            <Navbar sticky="top" bg="dark" className="navbar-dark" expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/account">
                    <img
                        src={SITE_LOGO}
                        width="30"
                        height="30"
                        className="d-inline-block align-top"
                        alt="Shopping logo"
                    />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        {
                            (hasAnyAuthority(auth, ["Admin", "Salesperson"]))
                                ? 
                                <NavDropdown title="Users" id="basic-nav-dropdown" menuVariant="dark">
                                        {
                                            (hasAnyAuthority(auth, ["Admin"]))
                                                ? <Link data-rr-ui-dropdown-item="" className="dropdown-item" to="/account/users">Users</Link>
                                                : ""
                                        }
                                        {
                                            (hasAnyAuthority(auth, ["Admin", "Salesperson"]))
                                                ? <Link data-rr-ui-dropdown-item="" className="dropdown-item" to="/account/customers">Customers</Link>
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
                                            ? <Link data-rr-ui-dropdown-item="" className="dropdown-item" to="/account/products">Products</Link>
                                            : ""
                                        }
                                        {
                                            (hasAnyAuthority(auth, ["Admin", "Editor"]))
                                            ?  <><Link data-rr-ui-dropdown-item="" className="dropdown-item" to="/account/categories">Categories</Link>
                                                <Link data-rr-ui-dropdown-item="" className="dropdown-item" to="/account/brands">Brands</Link></>
                                            : ""
                                        }
                                        {
                                            (hasAnyAuthority(auth, ["Admin", "Salesperson"]))
                                            ?  <Link className="dropdown-item" to="/account/shipping_rate">Shipping</Link>
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
                                                ? <Link data-rr-ui-dropdown-item="" className="dropdown-item" to="/account/orders">Orders</Link>
                                                : ""
                                        }
                                        {
                                            (hasAnyAuthority(auth, ["Admin", "Salesperson"]))
                                                ? <Link data-rr-ui-dropdown-item="" className="dropdown-item" to="/account/sales">Sales Report</Link>
                                                : ""
                                        }
                                        {
                                            (hasAnyAuthority(auth, ["Admin", "Editor"]))
                                                ? <Link data-rr-ui-dropdown-item="" className="dropdown-item" to="/account/articles">Articles</Link>
                                                : ""
                                        }
                                    </NavDropdown>
                                : ""
                            }
                            {
                                (hasAnyAuthority(auth, ["Admin"]))
                                    ? 
                                        <Dropdown>
                                            <Dropdown.Toggle data-toggle="dropdown" as={Link} to="#" className="nav-link border-0" variant="dark">
                                               Settings
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu variant="dark">
                                                <Link data-rr-ui-dropdown-item="" className="dropdown-item" to="settings/general">General</Link>
                                                <Link data-rr-ui-dropdown-item="" className="dropdown-item" to="settings/countries">Countries</Link>
                                                <Link data-rr-ui-dropdown-item="" className="dropdown-item" to="settings/states">States</Link>
                                                <Link data-rr-ui-dropdown-item="" className="dropdown-item" to="settings/mail-server">Mail Server</Link>
                                                <Link data-rr-ui-dropdown-item="" className="dropdown-item" to="settings/mail-template">Mail Template</Link>
                                                <Link data-rr-ui-dropdown-item="" className="dropdown-item" to="settings/payment">Payment</Link>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    : ""
                            }
                        <Dropdown>
                            <Dropdown.Toggle as={NavLink} className="border-0" split variant="dark" id="dropdown-split-basic">
                                <i className="bi bi-person-fill"></i> {auth.firstName} &nbsp;
                            </Dropdown.Toggle>
                            <Dropdown.Menu variant="dark">
                                <Link className="dropdown-item" data-rr-ui-dropdown-item="" to="#" onClick={showInfo}>Account Info</Link>
                                <Link className="dropdown-item text-danger" to="/login/1" onClick={handleLogout}>Logout</Link>
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