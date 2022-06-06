import {Navbar, Nav, Container, Form, Row, Col, Button} from 'react-bootstrap';
import { Link, useNavigate } from "react-router-dom";
import { useRef } from "react";
import useSettings from './use-settings';

const NavBar = () => {
  const keywordRef = useRef();
  const navigate = useNavigate();
  const logoUrl = `${process.env.REACT_APP_SERVER_URL}site-logo/`;
  const { SITE_LOGO } = useSettings();

  const handleSubmit = (e) => {
    e.preventDefault();
    const input = keywordRef.current;
    const keyword = input.value.trim();
    if (keyword.length >= 2) {
      navigate("p/search/"+keyword);
    } 
  }

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
                <Link className="nav-link" to="#home">
                  Careers
                </Link>
                <Link className="nav-link" to="#link">
                  Payments
                </Link>
                <Link className="nav-link" to="#link">
                  Shipping & Delivery
                </Link>
                <Link className="nav-link" to="#link">
                  Contact
                </Link>
                <Link className="nav-link" to="#link">
                  Register
                </Link>
                <Link className="nav-link" to="/login">
                  Login
                </Link>
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
        <Row className="justify-content-start px-3 mx-0">
          <Form className="my-2 col-7" onSubmit={handleSubmit}>
              <Row>
                  <Col md={5}>
                    <Form.Control ref={keywordRef} placeholder="keyword" required minLength="2" />
                  </Col>
                  <Col md={2}>
                    <Button variant="success" type="submit">Search</Button>
                  </Col>
              </Row>
          </Form>
        </Row>
      </>
    );
}
 
export default NavBar;