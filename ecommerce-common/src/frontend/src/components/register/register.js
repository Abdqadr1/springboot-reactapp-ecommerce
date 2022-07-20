import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { Form, Row, Col, Button, Alert } from "react-bootstrap";
import useArray from "../custom_hooks/use-array";
import { listFormData, SPINNERS_BORDER_HTML } from "../utilities";
import { useNavigate } from "react-router";

const Register = () => {
    const url = `${process.env.REACT_APP_SERVER_URL}customer`;
    const { array: countries, setArray: setCountries } = useArray();
    const { array: states, setArray: setStates } = useArray();
    const [country, setCountry] = useState(null);
    const [state, setState] = useState(null);
    const [btnRef, alertRef,rePassRef, passRef] = [useRef(), useRef(),useRef(), useRef()];
    const [alert, setAlert] = useState({ show: false, message: "", variant: 'danger' })

    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${url}/countries`)
            .then(response => {
                const data = response.data;
                setCountries(data)
            })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (country !== null) {
            axios.get(`${url}/states?id=${country.id}`)
            .then(response => {
                const data = response.data;
                setStates(data)
            })
         }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [country])

    useEffect(() => {
        if (!alert.show) return;
        alertRef.current && alertRef.current.focus()
    }, [alert, alertRef])

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

    const handleSubmit = e => {
        e.preventDefault();
        const pass = passRef.current.value;
        const rePass = rePassRef.current.value;
        if (pass !== rePass) {
            setAlert({ show: true, message: "Confirm your password", variant: "danger" })
            return;
        }
        setAlert(s => ({...s, show:false}))
        const btn = btnRef.current;
        btn.innerHTML = SPINNERS_BORDER_HTML;
        btn.disabled = true;
        let data = new FormData(e.target)
        listFormData(data)
        axios.post(`${url}/register`,data)
            .then(() => { 
                navigate("/register-success");
            })
            .catch(err => { 
                const data = err.response.data;
                const msg = data?.message;
                setAlert({show:true, message : msg ?? "Something went wrong, try again", variant: "danger"})
            })
            .finally(() => {
                btn.textContent = "Submit";
                btn.disabled = false;
            })
    }
    
    return ( 
        <>
            <Row className="mx-0 justify-content-center mt-3">
                <Col xs="11" md="8">
                    <h3>Customer Registration</h3>
                    <Alert ref={alertRef} tabIndex={-1} variant={alert.variant} show={alert.show} dismissible
                        onClose={() => setAlert(s => ({ ...s, show: false }))} className="my-3">
                        {alert.message}
                    </Alert>
                    <Form className="my-4" onSubmit={handleSubmit}>
                        <Form.Group className="mb-3 row justify-content-center mx-0" controlId="firstName">
                            <Form.Label className="form-label">First Name:</Form.Label>
                            <Form.Control name="firstName" className="form-input" placeholder="Enter first name" required maxLength="45"/>
                        </Form.Group>
                        <Form.Group className="mb-3 row justify-content-center mx-0" controlId="lastName">
                            <Form.Label className="form-label">Last Name:</Form.Label>
                            <Form.Control name="lastName" className="form-input" placeholder="Enter last name" required maxLength="45"/>
                        </Form.Group>
                        <Form.Group className="mb-3 row justify-content-center mx-0" controlId="email">
                            <Form.Label className="form-label">Email:</Form.Label>
                            <Form.Control name="email" type="email" className="form-input" placeholder="Enter email" required maxLength="64"/>
                        </Form.Group>
                        <Form.Group className="mb-3 row justify-content-center mx-0" controlId="password">
                            <Form.Label className="form-label">Password:</Form.Label>
                            <Form.Control ref={passRef} name="password" type="password" className="form-input" placeholder="Enter password" minLength="8" required/>
                        </Form.Group>
                        <Form.Group className="mb-3 row justify-content-center mx-0" controlId="re-password">
                            <Form.Label className="form-label">Retype Password:</Form.Label>
                            <Form.Control ref={rePassRef} name="re-password" type="password" className="form-input" placeholder="Enter password again" minLength="8" required/>
                        </Form.Group>
                        <Form.Group className="mb-3 row justify-content-center mx-0" controlId="phoneNumber">
                            <Form.Label className="form-label">Phone Number:</Form.Label>
                            <Form.Control name="phoneNumber" className="form-input" placeholder="Enter phone number" required maxLength="15"/>
                        </Form.Group>
                        <Form.Group className="mb-3 row justify-content-center mx-0" controlId="mainAddress">
                            <Form.Label className="form-label">Address 1:</Form.Label>
                            <Form.Control name="mainAddress" className="form-input" required maxLength="64"/>
                        </Form.Group>
                        <Form.Group className="mb-3 row justify-content-center mx-0" controlId="extraAddress">
                            <Form.Label className="form-label">Address 2 (Optional):</Form.Label>
                            <Form.Control name="extraAddress" className="form-input"  maxLength="65"/>
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
                            <Form.Control name="city" className="form-input" placeholder="Enter city" required  maxLength="45"/>
                        </Form.Group>
                        <Form.Group className="mb-3 row justify-content-center mx-0" controlId="postalCode">
                            <Form.Label className="form-label">Postal Code:</Form.Label>
                            <Form.Control name="postalCode" className="form-input" placeholder="Enter postal code" required  maxLength="15"/>
                        </Form.Group>
                        <Button ref={btnRef} variant="primary" className="py-2" style={{width: "200px"}} type="submit">Submit</Button>
                    </Form>
                </Col>
                
            </Row>             
        </>
     );
}
 
export default Register;