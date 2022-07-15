import {Navbar, Nav, Container, NavLink, Form, Modal, Button, Alert, Row, Dropdown} from 'react-bootstrap';
import useSettings from './use-settings';
import { AuthContext } from './custom_hooks/use-auth';
import { useState, useEffect,useRef, useContext } from 'react';
import useArray from './custom_hooks/use-array';
import axios from 'axios';
import {isTokenExpired, SPINNERS_BORDER_HTML} from './utilities'
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

const NavBar = ({menus}) => {
  const { SITE_LOGO } = useSettings();
  const navigate = useNavigate();
  
  const url = `${process.env.REACT_APP_SERVER_URL}customer`;
  const [submitBtnRef, alertRef, passRef, rPassRef] = [useRef(), useRef(), useRef(), useRef()];

  const {auth, setAuth} = useContext(AuthContext)
  const [showModal, setShowModal] = useState(false)
  const [alert, setAlert] = useState({ show: false, message: "", variant: "danger" })
  const [customer, setCustomer] = useState({});
  const { array: countries, setArray: setCountries } = useArray();
  const { array: states, setArray: setStates } = useArray();
  const [country, setCountry] = useState(null);
  const [state, setState] = useState(null);

  const [searchParams,] = useSearchParams();
  let redirectURL = searchParams.get("r");
  redirectURL = redirectURL ? "/" + redirectURL : redirectURL;
  
  const toggleAlert = e => {
    setAlert(s => ({...s, show: false}))
  }

  useEffect(() => {
      if (!alert.show) return;
      alertRef.current && alertRef.current.focus()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alert])

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
      
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country])


  useEffect(() => {
    if (auth?.accessToken) {

      if (countries.length < 1) {
         axios.get(`${url}/countries`)
          .then(response => {
              const data = response.data;
              setCountries(data)
          })
          .catch(err => {
              console.error(err)
          })
      }

       axios.get(`${url}/details`, {
        headers: {
          "Authorization": `Bearer ${auth?.accessToken}`
        }
      })
        .then(response => {
          const data = response.data;
          setCustomer(data)
          setState(data.state)
          setCountry(data.country)
        })
        .catch(res => {
          console.error(res)
          if (isTokenExpired(res.response)) {
            setAuth(null);
            navigate("/login");
          }
        })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth?.accessToken])

  

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
      ...s,
      [e.target.id] : e.target.value
    }))
  }

  const handleSubmitEditInfo = e => {
    e.preventDefault();
    const btn = submitBtnRef.current;
    const form = e.target;
    const action = form.getAttribute("data-action");
    const data = new FormData(form);
    const pass = passRef.current;
    const rePass = rPassRef.current;
    if (pass !== null && pass !== undefined) {
      if (pass.value !== rePass.value) {
          setAlert({show: true, message: "Confirm your password", variant: "danger" })
        return;
      }
    }
    btn.disabled = true;
    btn.innerHTML = SPINNERS_BORDER_HTML;
    
       axios.post(`${url}/${action}`, data, {
        headers: {
          "Authorization": `Bearer ${auth?.accessToken}`
        }
    })
        .then(res => {
          setAlert({ show: true, message: res.data, variant: "success" })
          if (redirectURL) navigate(redirectURL);
        })
        .catch(res => {
          const response = res.response;
          if (isTokenExpired(response)) {
            setAuth(null); navigate("/login");
          }
          setAlert({show: true, message: response.data.message, variant: "danger" })
        }).finally(() => {
          btn.disabled = false;
          btn.textContent = "Save";
        })
  }

const listMenus = () => {
  if(menus && menus.length > 0){
    return menus.map(m => <Link key={m.id} className="nav-link" to={`/m/`+m.alias}>{m.title}</Link>)
  }
}

    return (
      <AuthContext.Consumer>
        {({ auth }) => (
            <>
                  <Navbar sticky="top" bg="dark" className="navbar-dark" expand="lg">
                    <Container>
                      <Navbar.Brand href="/">
                        <img
                          src={SITE_LOGO}
                          width="30"
                          height="30"
                          className="d-inline-block align-top"
                          alt="QShop"
                        />
                      </Navbar.Brand>
                      <Navbar.Toggle aria-controls="basic-navbar-nav" />
                      <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto text-end">
                          {listMenus()}
                          <Link className="nav-link" to="/contact">
                            Contact
                          </Link>

                        {
                            (!auth)
                            ? <>
                                <Link className="nav-link" to="/register">
                                  Register
                                </Link>
                                <Link className="nav-link" to="/login">
                                  Login
                                </Link>
                              </>
                              : <>
                                  <Dropdown>
                                    <Dropdown.Toggle as={NavLink} className="border-0" split variant="dark" id="dropdown-split-basic">
                                      <i className="bi bi-person-fill"></i>&nbsp;
                                      {customer?.firstName ?? auth?.firstName}
                                      &nbsp;
                                      {customer?.lastName ?? auth?.lastName}
                                      &nbsp;
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu variant="dark">
                                        <span className="dropdown-item ps-4" data-rr-ui-dropdown-item="" to="#" onClick={()=>setShowModal(true)}>Account Info</span>
                                        <Link className="dropdown-item ps-4" data-rr-ui-dropdown-item="" to="/orders">Orders</Link>
                                        <Link className="dropdown-item ps-4" data-rr-ui-dropdown-item="" to="/addresses">Addresses</Link>
                                        <Link className="dropdown-item ps-4" data-rr-ui-dropdown-item="" to="/reviews">Reviews</Link>
                                        <Link className="dropdown-item ps-4" data-rr-ui-dropdown-item="" to="/questions">Questions</Link>
                                        <Link className="dropdown-item ps-4 text-danger" to="/logout">Logout</Link>
                                    </Dropdown.Menu>
                                  </Dropdown>
                                  <Link className="nav-link" to="/shopping_cart" title="Shopping cart">
                                    <i className="bi bi-cart4 fs-5 text-warning position-relative">
                                    {
                                      (Number(auth?.cart) > 0) &&
                                        <span style={{ fontSize: "x-small" }}
                                            className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
                                        </span>
                                    } 
                                    </i>
                                  </Link>
                              </>
                            
                          }
                          
                        </Nav>
                      </Navbar.Collapse>
                    </Container>
                  </Navbar>
              

              {
                  (auth) &&  <Modal show={showModal} fullscreen={true} onHide={()=>setShowModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Account Information</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="border my-modal-body">
                        <Form className="form-input mx-auto" onSubmit={handleSubmitEditInfo} data-action="update-customer">
                                
                            <Alert className="text-center" ref={alertRef} tabIndex={-1} variant={alert.variant} show={alert.show} dismissible onClose={toggleAlert}>
                                {alert.message}
                            </Alert>
                              <Form.Group className="mb-3 row justify-content-center mx-0" controlId="auth">
                                  <Form.Label className="form-label">Authentication Type:</Form.Label>
                                  <Form.Control value={customer?.authenticationType ?? ""} onChange={null} readOnly  className="form-input"/>
                              </Form.Group>
                              <input type="hidden" name="id" value={customer?.id ?? ""} />
                              <Form.Group className="mb-3 row justify-content-center mx-0" controlId="email">
                                  <Form.Label className="form-label">Email:</Form.Label>
                                  <Form.Control value={customer?.email ?? ""} onChange={handleInput} type="email" className="form-input" readOnly/>
                              </Form.Group>
                              <Form.Group className="mb-3 row justify-content-center mx-0" controlId="firstName">
                                  <Form.Label className="form-label">First Name:</Form.Label>
                                  <Form.Control value={customer?.firstName ?? ""} onChange={handleInput}  name="firstName" className="form-input" placeholder="Enter first name" required maxLength="45"/>
                              </Form.Group>
                              <Form.Group className="mb-3 row justify-content-center mx-0" controlId="lastName">
                                  <Form.Label className="form-label">Last Name:</Form.Label>
                                  <Form.Control value={customer?.lastName ?? ""} onChange={handleInput}  name="lastName" className="form-input" placeholder="Enter last name" required maxLength="45"/>
                              </Form.Group>
                              {
                                (customer?.authenticationType === "DATABASE")
                                ? 
                                <>
                                  <Form.Group className="mb-3 row justify-content-center mx-0" controlId="password">
                                      <Form.Label className="form-label">New Password:</Form.Label>
                                      <Form.Control ref={passRef} value={customer?.password ?? ""} onChange={handleInput} name="password" className="form-input" minLength="8" maxLength="64" type="password"/>
                                  </Form.Group>
                                  <Form.Group className="mb-3 row justify-content-center mx-0" controlId="password">
                                      <Form.Label className="form-label">Retype Password:</Form.Label>
                                      <Form.Control ref={rPassRef} className="form-input" placeholder="Confirm password" minLength="8" maxLength="64" type="password"/>
                                  </Form.Group>
                                </> : ""
                              }
                              
                              <Form.Group className="mb-3 row justify-content-center mx-0" controlId="phoneNumber">
                                  <Form.Label className="form-label">Phone Number:</Form.Label>
                                  <Form.Control value={customer?.phoneNumber ?? ""} onChange={handleInput}  name="phoneNumber" className="form-input" placeholder="Enter phone number" required maxLength="15"/>
                              </Form.Group>
                              <Form.Group className="mb-3 row justify-content-center mx-0" controlId="mainAddress">
                                  <Form.Label className="form-label">Address 1:</Form.Label>
                                  <Form.Control value={customer?.mainAddress ?? ""} onChange={handleInput} name="mainAddress" className="form-input" required maxLength="64"/>
                              </Form.Group>
                              <Form.Group className="mb-3 row justify-content-center mx-0" controlId="extraAddress">
                                  <Form.Label className="form-label">Address 2 (Optional):</Form.Label>
                                  <Form.Control value={customer?.extraAddress ?? ""} onChange={handleInput}  name="extraAddress" className="form-input" maxLength="65"/>
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
                                  <Form.Control value={customer?.city ?? ""} onChange={handleInput}  name="city" className="form-input" placeholder="Enter city" required  maxLength="45"/>
                              </Form.Group>
                              <Form.Group className="mb-3 row justify-content-center mx-0" controlId="postalCode">
                                  <Form.Label className="form-label">Postal Code:</Form.Label>
                                  <Form.Control value={customer?.postalCode ?? ""} onChange={handleInput}  name="postalCode" className="form-input" placeholder="Enter postal code" required  maxLength="15"/>
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
              }
            
            </>
          )}

      </AuthContext.Consumer>
    );
}
 
export default NavBar;