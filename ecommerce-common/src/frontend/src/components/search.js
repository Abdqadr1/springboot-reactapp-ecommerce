import { Row, Col,Form, Button, Navbar, Nav, Container, Modal, Alert } from "react-bootstrap";
import { useRef,useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "./custom_hooks/use-auth";
import axios from "axios";
import useArray from "./custom_hooks/use-array";
const Search = () => {
  const url = `${process.env.REACT_APP_SERVER_URL}customer`;
  const [keywordRef,submitBtnRef, alertRef] = [useRef(), useRef(), useRef()];
  const navigate = useNavigate();

  const [{ firstName, lastName }] = useAuth();
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
    
  const handleSubmit = (e) => {
    e.preventDefault();
    const input = keywordRef.current;
    const keyword = input.value.trim();
    if (keyword.length >= 2) {
      navigate("/p/search/"+keyword);
    } 
  }

  return ( 
      <>
        <Row className="justify-content-start px-3 mx-0 bg-light">
          <Col md={4}>
            <Form className="my-2 col-12" onSubmit={handleSubmit}>
                <Row>
                    <Col xs={9} md={9}>
                      <Form.Control ref={keywordRef} placeholder="keyword" required minLength="2" />
                    </Col>
                    <Col xs={2} md={2}>
                      <Button variant="success" type="submit">Search</Button>
                    </Col>
                </Row>
            </Form>
          </Col>
          <Col md={8}>
            {
              (firstName === undefined || firstName === null)
                ? "" : 
                  <Navbar sticky="top" bg="light" className="navbar-light" style={{zIndex: 1}} expand="sm">
                    <Container>
                        <Nav className="ms-auto">
                          <Link className="nav-link fw-bold text-primary" to="#" onClick={()=>setShowModal(true)}>
                            {firstName} {lastName}
                          </Link>
                          <Link className="nav-link" to="/orders">
                            Orders
                          </Link>
                          <Link className="nav-link" to="/questions">
                            Questions
                          </Link>
                          <Link className="nav-link" to="/reviews">
                            Reviews
                          </Link>
                          <Link className="nav-link text-danger" to="/logout">
                            Logout
                          </Link>
                        </Nav>
                    </Container>
                  </Navbar>
            }
          </Col> 
        </Row>
            <Modal show={showModal} fullscreen={true} onHide={()=>setShowModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Account Information</Modal.Title>
            </Modal.Header>
            <Modal.Body className="border modal-body">
                <Form className="form-input mx-auto" onSubmit={handleSubmitEditInfo}>
                        
                    <Alert ref={alertRef} tabIndex={-1} variant={alert.variant} show={alert.show} dismissible onClose={toggleAlert}>
                        {alert.message}
                    </Alert>
                      <Form.Group className="mb-3 row justify-content-center mx-0" controlId="firstName">
                          <Form.Label className="form-label">First Name:</Form.Label>
                          <Form.Control value={customer?.firstName ?? ""} onChange={handleInput}  name="firstName" className="form-input" placeholder="Enter first name" required maxLength="45"/>
                      </Form.Group>
                      <Form.Group className="mb-3 row justify-content-center mx-0" controlId="lastName">
                          <Form.Label className="form-label">Last Name:</Form.Label>
                          <Form.Control value={customer?.lastName ?? ""} onChange={handleInput}  name="lastName" className="form-input" placeholder="Enter last name" required maxLength="45"/>
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
 
export default Search;