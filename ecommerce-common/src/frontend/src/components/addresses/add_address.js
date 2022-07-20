import { Modal, Form, Alert, Button, Row } from "react-bootstrap";
import { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../custom_hooks/use-auth";
import { SPINNERS_BORDER_HTML, isTokenExpired } from "../utilities";

import useArray from "../custom_hooks/use-array";
import { useNavigate } from "react-router";

const AddAddressModal = ({ countries, show, setShow,setAdd }) => {
    const navigate = useNavigate();
    const url = process.env.REACT_APP_SERVER_URL + "address";
    const { array: states, setArray: setStates } = useArray();
    const [state, setState] = useState("");
    const [country, setCountry] = useState(null);
    const [alert, setAlert] = useState({ show: false, message: "", variant: "success" });
    const alertRef = useRef();
    const submitBtnRef = useRef();
    const {auth} = useContext(AuthContext)

    const toggleAlert = () => setAlert({ ...alert, show: !alert.show })

    useEffect(() => {
        const abortController = new AbortController();
        if (country !== null) {
            axios.get(`${url}/states?id=${country.id}`,{
            headers: {
                "Authorization": `Bearer ${auth?.accessToken}`
            }
        })
            .then(response => {
                const data = response.data;
                setStates(data)
            })
         }
          return () => {
            abortController.abort();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [country])

    
    useEffect(() => {
        if (!alert.show) return;
        alertRef.current && alertRef.current.focus()
    }, [alert])

    
    const handleSubmit = (event) => {
        event.preventDefault();
        setAlert((state) => ({ ...state, show: false }));

        const data = new FormData(event.target);

        const button = submitBtnRef.current
        button.disabled=true
        button.innerHTML = SPINNERS_BORDER_HTML
        axios.post(`${url}/add`, data, {
            headers: {
                "Authorization": `Bearer ${auth?.accessToken}`
            }
        })
            .then(response => {
                setAdd(s=>([...s, response.data]));
                setAlert({ show: true, message: "Address added" })
            })
            .catch(error => { 
                const response = error.response
                if(isTokenExpired(response)) navigate("/login/2")
                else setAlert({show:true, message: response.data.message, variant: "danger"})
            }).finally(() => {
                button.disabled=false
                button.innerHTML = "Save"
            })
    }

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

    return ( 
        <>
         <Modal show={show} fullscreen={true} onHide={()=> setShow(!show)}>
            <Modal.Header closeButton>
                <Modal.Title>Add New Shipping Rate</Modal.Title>
            </Modal.Header>
            <Modal.Body className="border my-modal-body">
                <Alert ref={alertRef} tabIndex={-1} variant={alert.variant} show={alert.show} dismissible onClose={toggleAlert}>
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
                        
                        <Row className="justify-content-center">
                            <div className="w-25"></div>
                            <div className="form-input ps-0">
                                <Button ref={submitBtnRef} variant="primary" className="py-2" style={{ width: "200px" }} type="submit">Save</Button>
                            </div>
                        </Row>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
     );
}
 
export default AddAddressModal;