import {Navbar, Nav, Container, NavLink} from 'react-bootstrap';
import useSettings from './use-settings';
import useAuth from "./custom_hooks/use-auth";

const NavBar = () => {
  const logoUrl = `${process.env.REACT_APP_SERVER_URL}site-logo/`;
  const { SITE_LOGO } = useSettings();

    const [{ firstName }] = useAuth();

    return (
      <>
        <Navbar sticky="top" bg="dark" className="navbar-dark" expand="lg">
          <Container>
            <Navbar.Brand href="/">
              <img
                src={`${logoUrl}${SITE_LOGO}`}
                width="30"
                height="30"
                className="d-inline-block align-top"
                alt="Shopping app logo"
              />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto">
                <NavLink className="nav-link" href="/careers">
                  Careers
                </NavLink>
                <NavLink className="nav-link" href="/payments">
                  Payments
                </NavLink>
                <NavLink className="nav-link" href="/shipping">
                  Shipping & Delivery
                </NavLink>
                <NavLink className="nav-link" href="/contact">
                  Contact
                </NavLink>
                {
                  (firstName === undefined || firstName === null)
                  ? <>
                    <NavLink className="nav-link" href="/register">
                      Register
                    </NavLink>
                    <NavLink className="nav-link" href="/login">
                      Login
                    </NavLink>
                  </> : ""
                }
                
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </>
    );
}
 
export default NavBar;