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
    const [showEditInfo, setShowEditInfo] = useState(false);
    const [expand, setExpand] = useState(false);
    const handleLogout = (event) => {
        setAuth({});
    }
    const showInfo = (event) => {
        event.stopPropagation();
        event.preventDefault();
        setShowEditInfo(true);
        closeNav();
    }

    const expandNav = e => setExpand(e);
    const closeNav = e => setExpand(false);

    if(!auth || !auth?.accessToken) return <Navigate to="/login" />
    return (
        <>
            <Navbar sticky="top" bg="dark" className="navbar-dark" expand="md" onToggle={expandNav} expanded={expand}>
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
                    <Nav className="ms-auto" onClick={closeNav}>
                        {
                            (hasAnyAuthority(auth, ["Admin", "Salesperson"]))
                                ? 
                                <NavDropdown onClick={e=> e.stopPropagation()}  title="Users" id="basic-nav-dropdown" menuVariant="dark">
                                        {
                                            (hasAnyAuthority(auth, ["Admin"]))
                                                ? <Dropdown.Item as={Link} onClick={closeNav} className="dropdown-item" to="/account/users">Users</Dropdown.Item>
                                                : ""
                                        }
                                        {
                                            (hasAnyAuthority(auth, ["Admin", "Salesperson"]))
                                                ? <Dropdown.Item as={Link} onClick={closeNav} className="dropdown-item" to="/account/customers">Customers</Dropdown.Item>
                                                : ""
                                        }
                                    
                                </NavDropdown>
                                : ""
                        }
                        {
                            (hasAnyAuthority(auth, ["Admin", "Salesperson", "Editor", "Shipper"]))
                                ? 
                                    <NavDropdown onClick={e=> e.stopPropagation()}  title="Products" id="basic-nav-dropdown" menuVariant="dark">
                                        {
                                            (hasAnyAuthority(auth, ["Admin", "Salesperson", "Editor", "Shipper"]))
                                            ? <Dropdown.Item as={Link} onClick={closeNav} className="dropdown-item" to="/account/products">Products</Dropdown.Item>
                                            : ""
                                        }
                                        {
                                            (hasAnyAuthority(auth, ["Admin", "Assistant"]))
                                            ? <>
                                                <Dropdown.Item as={Link} onClick={closeNav} className="dropdown-item" to="/account/reviews">Reviews</Dropdown.Item>
                                                <Dropdown.Item as={Link} onClick={closeNav} className="dropdown-item" to="/account/questions">Questions</Dropdown.Item>
                                            </>
                                            : ""
                                        }
                                        {
                                            (hasAnyAuthority(auth, ["Admin", "Editor"]))
                                            ?  <><Dropdown.Item as={Link} onClick={closeNav} className="dropdown-item" to="/account/categories">Categories</Dropdown.Item>
                                                <Dropdown.Item as={Link} onClick={closeNav} className="dropdown-item" to="/account/brands">Brands</Dropdown.Item></>
                                            : ""
                                        }
                                        {
                                            (hasAnyAuthority(auth, ["Admin", "Salesperson"]))
                                            ?  <Dropdown.Item as={Link} onClick={closeNav} className="dropdown-item" to="/account/shipping_rate">Shipping</Dropdown.Item>
                                            : ""
                                        }
                                    </NavDropdown>
                                : ""
                        }
                        {
                            (hasAnyAuthority(auth, ["Admin", "Salesperson", "Shipper", "Editor"]))
                                ? 
                                    <NavDropdown onClick={e=> e.stopPropagation()}  title="Menu" id="basic-nav-dropdown" menuVariant="dark">
                                        {
                                            (hasAnyAuthority(auth, ["Admin", "Salesperson", "Shipper"]))
                                                ? <Dropdown.Item as={Link} onClick={closeNav} className="dropdown-item" to="/account/orders">Orders</Dropdown.Item>
                                                : ""
                                        }
                                        {
                                            (hasAnyAuthority(auth, ["Admin", "Salesperson"]))
                                                ? <Dropdown.Item as={Link} onClick={closeNav} className="dropdown-item" to="/account/sales_report">Sales Report</Dropdown.Item>
                                                : ""
                                        }
                                        {
                                            (hasAnyAuthority(auth, ["Admin", "Editor"]))
                                                ? <Dropdown.Item as={Link} onClick={closeNav} className="dropdown-item" to="/account/articles">Articles</Dropdown.Item>
                                                : ""
                                        }
                                        {
                                            (hasAnyAuthority(auth, ["Admin", "Editor"]))
                                                ? <Dropdown.Item as={Link} onClick={closeNav} className="dropdown-item" to="/account/menus">Menus</Dropdown.Item>
                                                : ""
                                        }
                                        {
                                            (hasAnyAuthority(auth, ["Admin", "Editor"]))
                                                ? <Dropdown.Item as={Link} onClick={closeNav} className="dropdown-item" to="/account/storefronts">Home page</Dropdown.Item>
                                                : ""
                                        }
                                    </NavDropdown>
                                : ""
                            }
                            {
                                (hasAnyAuthority(auth, ["Admin"]))
                                    ? 
                                        <Dropdown onClick={e=> e.stopPropagation()}>
                                            <Dropdown.Toggle data-toggle="dropdown" as={Link} to="#" className="nav-link border-0" variant="dark">
                                               Settings
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu variant="dark">
                                                <Dropdown.Item as={Link} onClick={closeNav} className="dropdown-item" to="settings/general">General</Dropdown.Item>
                                                <Dropdown.Item as={Link} onClick={closeNav} className="dropdown-item" to="settings/countries">Countries</Dropdown.Item>
                                                <Dropdown.Item as={Link} onClick={closeNav} className="dropdown-item" to="settings/states">States</Dropdown.Item>
                                                <Dropdown.Item as={Link} onClick={closeNav} className="dropdown-item" to="settings/mail-server">Mail Server</Dropdown.Item>
                                                <Dropdown.Item as={Link} onClick={closeNav} className="dropdown-item" to="settings/mail-template">Mail Template</Dropdown.Item>
                                                <Dropdown.Item as={Link} onClick={closeNav} className="dropdown-item" to="settings/payment">Payment</Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    : ""
                            }
                        <Dropdown onClick={e=> e.stopPropagation()}>
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
            <AccountDetails show={showEditInfo} setShow={setShowEditInfo} />
        </>
    );
}
 
export default MyNavbar;