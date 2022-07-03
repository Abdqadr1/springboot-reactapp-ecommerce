import axios from "axios";
import {useEffect, useRef, useState } from "react";
import { Alert, Button, Form, Modal, Row, Tab, Tabs, NavLink } from "react-bootstrap";
import { Navigate, useNavigate } from "react-router-dom";
import { isTokenExpired, SPINNERS_BORDER_HTML } from "../utilities";
import useAuth from "../custom_hooks/use-auth";
import useArray from "../custom_hooks/use-array";

const ViewCustomer = ({ data, setData, updatingCustomer }) => {
    const navigate = useNavigate()
    const [{accessToken}] = useAuth();
    const customer = data.customer;
    const url = process.env.REACT_APP_SERVER_URL + "customer";
    const serverUrl = url + "/edit/" + customer.id;
    const { array: countries, setArray: setCountries } = useArray();
    const { array: states, setArray: setStates } = useArray();
    const [country, setCountry] = useState(null);
    const [, setState] = useState(null);
    const [form, setForm] = useState();
    const [alert, setAlert] = useState({ show: false, message: "", variant: "success" });
    const alertRef = useRef();
    const submitBtnRef = useRef();
    const toggleAlert = () => setAlert({ ...alert, show: !alert.show })
    
    const hideModal = () => {
        setData({...data, show: false})
    }

    const handleInput = (event) => {
        setForm({
            ...form,
            [event.target.id]: event.target.value
        })
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.target)

        setAlert((state) => ({ ...state, show: false }));
        
        const button = submitBtnRef.current
        button.disabled=true
        button.innerHTML = SPINNERS_BORDER_HTML
        axios.post(serverUrl, data, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        }).then(response => {
            setAlert({ show: true, message: "Customer updated!" })
            updatingCustomer(response.data)
        })
        .catch(error => { 
            const response = error.response
            if(isTokenExpired(response)) navigate("/login/2")  
            else setAlert({show:true, message: response.data.message, variant: "danger"})
        }).finally(() => {  
            button.disabled=false
            button.innerHTML = "Update customer"
        })
    }

    useEffect(() => {
        axios.get(`${url}/countries`, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        })
            .then(response => {
                const data = response.data;
                setCountries(data)
            })
            .catch(err => {
                console.error(err)
            })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (country !== null) {
            axios.get(`${url}/states?id=${country.id}`, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        })
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
        setAlert((state) => ({ ...state, show: false }));
        const currentCustomer = data.customer;
        if (currentCustomer.id) {
            if (currentCustomer.id) {
                setForm({ ...currentCustomer });
            }
        }
    }, [data.customer])

    const handleSelect = (e, which) => {
        if (which === "c") {
            const id = Number(e.target.value);
            const country = countries.find(c => c.id === id);
            setCountry({ ...country })
            setForm(s=>({...s, country}))
        } else if (which === "s") {
            const state = e.target.value;
            setState(state)
            setForm(s=>({...s, state}))
        }
    }

    useEffect(() => {
        if (!alert.show) return;
        alertRef.current && alertRef.current.focus()
    }, [alert])


    if(!accessToken) return <Navigate to="/login/2" />
    return ( 
        <Modal show={data.show} fullscreen={true} onHide={hideModal}>
            <Modal.Header closeButton>
                <Modal.Title>{data.type} Customer (ID : {customer.id})</Modal.Title>
            </Modal.Header>
            <Modal.Body className="border modal-body">
                <Form className="add-customer-form" onSubmit={handleSubmit}>
                        
                    <Alert ref={alertRef} tabIndex={-1} variant={alert.variant} show={alert.show} dismissible onClose={toggleAlert}>
                        {alert.message}
                    </Alert>
                    
                    <Tabs defaultActiveKey="general" id="uncontrolled-tab-example" className="mb-3"> 
                        <Tab as={NavLink} eventKey="general" title="General" className="px-2" disabled={false}>
                            <fieldset disabled={data.type === "View"}>
                                <Form.Group className="mb-3 row justify-content-center mx-0" controlId="firstName">
                                    <Form.Label className="form-label">First Name:</Form.Label>
                                    <Form.Control value={form?.firstName ?? ""} onChange={handleInput}  name="firstName" className="form-input" placeholder="Enter first name" required maxLength="45"/>
                                </Form.Group>
                                <Form.Group className="mb-3 row justify-content-center mx-0" controlId="lastName">
                                    <Form.Label className="form-label">Last Name:</Form.Label>
                                    <Form.Control value={form?.lastName ?? ""} onChange={handleInput}  name="lastName" className="form-input" placeholder="Enter last name" required maxLength="45"/>
                                </Form.Group>
                                <Form.Group className="mb-3 row justify-content-center mx-0" controlId="email">
                                    <Form.Label className="form-label">Email:</Form.Label>
                                    <Form.Control value={form?.email ?? ""} onChange={handleInput}  name="email" type="email" className="form-input" placeholder="Enter email" required maxLength="64"/>
                                </Form.Group>
                                <Form.Group className="mb-3 row justify-content-center mx-0" controlId="password">
                                    <Form.Label className="form-label">Password:</Form.Label>
                                    <Form.Control value={form?.password ?? ""} onChange={handleInput} name="password" className="form-input" placeholder="Enter password" minLength="8" maxLength="64"/>
                                </Form.Group>
                                <Form.Group className="mb-3 row justify-content-center mx-0" controlId="phoneNumber">
                                    <Form.Label className="form-label">Phone Number:</Form.Label>
                                    <Form.Control value={form?.phoneNumber ?? ""} onChange={handleInput}  name="phoneNumber" className="form-input" placeholder="Enter phone number" required maxLength="15"/>
                                </Form.Group>
                                <Form.Group className="mb-3 row justify-content-center mx-0" controlId="enabled">
                                    <Form.Label className="form-label">Enabled:</Form.Label>
                                    <Form.Check name="enabled" className="form-input ps-0" type="checkbox" defaultChecked={customer?.enabled } />
                                </Form.Group>
                                <Form.Group className="mb-3 row justify-content-center mx-0">
                                    <Form.Label className="form-label">Created Time:</Form.Label>
                                    <div className="form-input">{form?.createdTime ?? ""}</div>
                                </Form.Group>
                            </fieldset>
                        </Tab>
                        <Tab as={NavLink} eventKey="address" title="Address" className="px-2" disabled={false}>
                            <fieldset disabled={data.type === "View"}>
                                <Form.Group className="mb-3 row justify-content-center mx-0" controlId="mainAddress">
                                    <Form.Label className="form-label">Address 1:</Form.Label>
                                    <Form.Control value={form?.mainAddress ?? ""} onChange={handleInput} name="mainAddress" className="form-input" required maxLength="64"/>
                                </Form.Group>
                                <Form.Group className="mb-3 row justify-content-center mx-0" controlId="extraAddress">
                                    <Form.Label className="form-label">Address 2 (Optional):</Form.Label>
                                    <Form.Control value={form?.extraAddress ?? ""} onChange={handleInput}  name="extraAddress" className="form-input"  maxLength="65"/>
                                </Form.Group>
                                <Form.Group className="mb-3 row justify-content-center mx-0" controlId="country">
                                    <Form.Label className="form-label">Country:</Form.Label>
                                    <Form.Select value={form?.country.id ?? ""} onChange={e=>handleSelect(e,"c")} name="country" className="form-input" required>
                                        <option value="" hidden>Select country</option>
                                        {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3 row justify-content-center mx-0" controlId="state">
                                    <Form.Label className="form-label">State:</Form.Label>
                                    <Form.Control value={form?.state ?? ""} onChange={e=>handleSelect(e,"s")} list="statesList" name="state" className="form-input" placeholder="Enter state" required  maxLength="45"/>
                                        <datalist id="statesList">
                                            {states.map(s => <option key={s.id} value={s.name}/>)}
                                        </datalist>
                                </Form.Group>
                                <Form.Group className="mb-3 row justify-content-center mx-0" controlId="city">
                                    <Form.Label className="form-label">City:</Form.Label>
                                    <Form.Control value={form?.city ?? ""} onChange={handleInput}  name="city" className="form-input" placeholder="Enter city" required  maxLength="45"/>
                                </Form.Group>
                                <Form.Group className="mb-3 row justify-content-center mx-0" controlId="postalCode">
                                    <Form.Label className="form-label">Postal Code:</Form.Label>
                                    <Form.Control value={form?.postalCode ?? ""} onChange={handleInput}  name="postalCode" className="form-input" placeholder="Enter postal code" required  maxLength="15"/>
                                </Form.Group>
                            </fieldset>
                        </Tab>
                    </Tabs>
                    {
                        (data.type === "Edit")
                            ?   <Row className="justify-content-center">
                                    <div className="w-25"></div>
                                    <div className="form-input ps-0">
                                        <Button ref={submitBtnRef} className="fit-content mx-1" variant="primary" type="submit">
                                            Update Customer
                                        </Button>
                                    </div>
                                </Row> : ""
                    }
                </Form>
            </Modal.Body>
        </Modal>
     );
}
 
export default ViewCustomer;