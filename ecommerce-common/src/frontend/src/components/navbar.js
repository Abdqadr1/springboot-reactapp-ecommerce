import {Navbar, Nav, Container, NavLink, Form, Modal, Button, Alert, Row, Dropdown} from 'react-bootstrap';
import useSettings from './use-settings';
import useAuth from "./custom_hooks/use-auth";
import { useState, useEffect,useRef } from 'react';
import useArray from './custom_hooks/use-array';
import axios from 'axios';

const NavBar = () => {
  const logoUrl = `${process.env.REACT_APP_SERVER_URL}site-logo/`;
  const { SITE_LOGO } = useSettings();

  
  const url = `${process.env.REACT_APP_SERVER_URL}customer`;
  const [submitBtnRef, alertRef] = [useRef(), useRef()];

  const [auth] = useAuth();
  const [showModal, setShowModal] = useState(false)
  const [alert, setAlert] = useState({ show: false, message: "", variant: "danger" })
  const [customer, setCustomer] = useState({});
  const { array: countries, setArray: setCountries } = useArray();
  const { array: states, setArray: setStates } = useArray();
  const [country, setCountry] = useState(null);
  const [state, setState] = useState(null);


  
  const toggleAlert = e => {
    setAlert(s => ({...s, show: false}))
  }

  useEffect(() => {
      if (!alert.show) return;
      alertRef.current && alertRef.current.focus()
  }, [alert])

  useEffect(() => {
    axios.get(`${url}/countries`)
        .then(response => {
            const data = response.data;
            setCountries(data)
        })
        .catch(err => {
            console.error(err)
        })
  }, [])

  useEffect(() => {
      if (country !== null) {
          axios.get(`${url}/states?id=${country.id}`)
          .then(response => {
              const data = response.data;
              setStates(data)
          })
          .catch(err => {
              console.error(err)
          })
        }
      
  }, [country])
  

   const handleSelect = (e, which) => {
        if (which === "c") {
            const id = Number(e.target.value);
            const index = countries.findIndex(c => c.id === id);
            setCountry({...countries[index]})
        } else if (which === "s") {
            const name = e.target.value;
            setState(name)
        }
    }

  const handleInput = e => {
    setCustomer(s => ({
      [e.target.id] : e.target.value
    }))
  }

  const handleSubmitEditInfo = e => {
    e.preventDefault();
    const btn = submitBtnRef.current;
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
              <Nav className="ms-auto text-end">
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
                  (auth?.firstName === undefined || auth?.firstName === null)
                  ? <>
                      <NavLink className="nav-link" href="/register">
                        Register
                      </NavLink>
                      <NavLink className="nav-link" href="/login">
                        Login
                      </NavLink>
                    </>
                    : <Dropdown>
                            <Dropdown.Toggle as={NavLink} className="border-0" split variant="dark" id="dropdown-split-basic">
                                <i className="bi bi-person-fill"></i> {auth?.firstName} {auth?.lastName} &nbsp;
                            </Dropdown.Toggle>
                            <Dropdown.Menu variant="dark" className="text-center">
                                <NavLink className="dropdown-item" data-rr-ui-dropdown-item="" href="#" onClick={()=>setShowModal(true)}>Account Info</NavLink>
                                <NavLink className="dropdown-item" data-rr-ui-dropdown-item="" href="/orders">Orders</NavLink>
                                <NavLink className="dropdown-item" data-rr-ui-dropdown-item="" href="/questions">Questions</NavLink>
                                <NavLink className="dropdown-item text-danger" href="/logout">Logout</NavLink>
                            </Dropdown.Menu>
                        </Dropdown>
                }
                
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <Modal show={showModal} fullscreen={true} onHide={()=>setShowModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Account Information</Modal.Title>
            </Modal.Header>
            <Modal.Body className="border modal-body">
                <Form className="form-input mx-auto" onSubmit={handleSubmitEditInfo}>
                        
                    <Alert ref={alertRef} tabIndex={-1} variant={alert.variant} show={alert.show} dismissible onClose={toggleAlert}>
                        {alert.message}
                    </Alert>
                      <Form.Group className="mb-3 row justify-content-center mx-0" controlId="auth?.firstName">
                          <Form.Label className="form-label">First Name:</Form.Label>
                          <Form.Control value={customer?.auth?.firstName ?? ""} onChange={handleInput}  name="auth?.firstName" className="form-input" placeholder="Enter first name" required maxLength="45"/>
                      </Form.Group>
                      <Form.Group className="mb-3 row justify-content-center mx-0" controlId="auth?.lastName">
                          <Form.Label className="form-label">Last Name:</Form.Label>
                          <Form.Control value={customer?.auth?.lastName ?? ""} onChange={handleInput}  name="auth?.lastName" className="form-input" placeholder="Enter last name" required maxLength="45"/>
                      </Form.Group>
                      <Form.Group className="mb-3 row justify-content-center mx-0" controlId="email">
                          <Form.Label className="form-label">Email:</Form.Label>
                          <Form.Control value={customer?.email ?? ""} onChange={handleInput}  name="email" type="email" className="form-input" placeholder="Enter email" required maxLength="64"/>
                      </Form.Group>
                      <Form.Group className="mb-3 row justify-content-center mx-0" controlId="password">
                          <Form.Label className="form-label">Password:</Form.Label>
                          <Form.Control value={customer?.password ?? ""} onChange={handleInput} name="password" className="form-input" placeholder="Enter password" minLength="8" maxLength="64"/>
                      </Form.Group>
                      <Form.Group className="mb-3 row justify-content-center mx-0" controlId="phoneNumber">
                          <Form.Label className="form-label">Phone Number:</Form.Label>
                          <Form.Control value={customer?.phoneNumber ?? ""} onChange={handleInput}  name="phoneNumber" className="form-input" placeholder="Enter phone number" required maxLength="15"/>
                      </Form.Group>
                      <Form.Group className="mb-3 row justify-content-center mx-0" controlId="enabled">
                          <Form.Label className="form-label">Enabled:</Form.Label>
                          <Form.Check name="enabled" className="form-input ps-0" type="checkbox" defaultChecked={customer?.enabled } />
                      </Form.Group>
                      <Form.Group className="mb-3 row justify-content-center mx-0" controlId="mainAddress">
                          <Form.Label className="form-label">Address 1:</Form.Label>
                          <Form.Control value={customer?.mainAddress ?? ""} onChange={handleInput} name="mainAddress" className="form-input" required maxLength="64"/>
                      </Form.Group>
                      <Form.Group className="mb-3 row justify-content-center mx-0" controlId="extraAddress">
                          <Form.Label className="form-label">Address 2 (Optional):</Form.Label>
                          <Form.Control value={customer?.extraAddress ?? ""} onChange={handleInput}  name="extraAddress" className="form-input"  maxLength="65"/>
                      </Form.Group>
                      <Form.Group className="mb-3 row justify-content-center mx-0" controlId="country">
                          <Form.Label className="form-label">Country:</Form.Label>
                          <Form.Select value={country?.id ?? ""} onChange={e=>handleSelect(e,"c")} name="country" className="form-input" required>
                              <option value="" hidden>Select country</option>
                              {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                          </Form.Select>
                      </Form.Group>
                      <Form.Group className="mb-3 row justify-content-center mx-0" controlId="state">
                          <Form.Label className="form-label">State:</Form.Label>
                          <Form.Control value={state ?? ""} onChange={e=>handleSelect(e,"s")} list="statesList" name="state" className="form-input" placeholder="Enter state" required  maxLength="45"/>
                              <datalist id="statesList">
                                  {states.map(s => <option key={s.id} value={s.name}/>)}
                              </datalist>
                      </Form.Group>
                      <Form.Group className="mb-3 row justify-content-center mx-0" controlId="city">
                          <Form.Label className="form-label">City:</Form.Label>
                          <Form.Control value={""} onChange={handleInput}  name="city" className="form-input" placeholder="Enter city" required  maxLength="45"/>
                      </Form.Group>
                      <Form.Group className="mb-3 row justify-content-center mx-0" controlId="postalCode">
                          <Form.Label className="form-label">Postal Code:</Form.Label>
                          <Form.Control value={""} onChange={handleInput}  name="postalCode" className="form-input" placeholder="Enter postal code" required  maxLength="15"/>
                      </Form.Group>
                     <Row className="justify-content-center">
                          <div className="w-25"></div>
                          <div className="form-input ps-0">
                              <Button ref={submitBtnRef} style={{width: "200px"}} className="fit-content mx-1" variant="primary" type="submit">
                                  Save
                              </Button>
                          </div>
                      </Row>
                </Form>
            </Modal.Body>
        </Modal>
      </>
    );
}
 
export default NavBar;