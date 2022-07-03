import axios from "axios";
import {useEffect, useRef, useState } from "react";
import { Alert, Button, Form, Modal, Row } from "react-bootstrap";
import { Navigate, useNavigate } from "react-router-dom";
import useAuth from "../custom_hooks/use-auth";
import useArray from "../custom_hooks/use-array";
import { isTokenExpired, SPINNERS_BORDER_HTML, listFormData } from "../utilities";

const AddShippingRate = ({ show, setShow, addShippingRate, countries }) => {
    const [{ accessToken }] = useAuth();
    const navigate = useNavigate()
    const submitBtnRef = useRef();
    const url = process.env.REACT_APP_SERVER_URL + "shipping_rate"
    const { array: states, setArray: setStates } = useArray();
    const [state, setState] = useState("");
    const [country, setCountry] = useState(null);

    const [alert, setAlert] = useState({ show: false, message: "", variant: "success" });
    const alertRef = useRef();
    const toggleAlert = () => {
        setAlert({...alert, show: !alert.show})
    }

    useEffect(() => {
        if (country !== null) {
            axios.get(`${url}/states?id=${country.id}`,{
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


    const handleSubmit = (event) => {
        event.preventDefault();
        setAlert((state) => ({ ...state, show: false }));

        const data = new FormData(event.target);
        listFormData(data)

        const button = submitBtnRef.current
        button.disabled=true
        button.innerHTML = SPINNERS_BORDER_HTML
        axios.post(`${url}/add`, data, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        })
            .then(response => {
                addShippingRate(response.data);
                setAlert({ show: true, message: "Shipping rate added" })
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
   
    useEffect(() => {
        if (!alert.show) return;
        alertRef.current && alertRef.current.focus()
    }, [alert])

     const handleSelect = (e, which) => {
        if (which === "c") {
            const id = Number(e.target.value);
            const country = countries.find(c => c.id === id);
            setCountry({...country})
        } else if (which === "s") {
            const name = e.target.value;
            setState(name)
        }
    }
   

    const handleReset = () => {
        setAlert((state) => ({ ...state, show: false }));
    }
    
    if(!accessToken) return <Navigate to="/login/2" />
    return ( 
        <Modal show={show} fullscreen={true} onHide={()=> setShow(!show)}>
            <Modal.Header closeButton>
                <Modal.Title>Add New Shipping Rate</Modal.Title>
            </Modal.Header>
            <Modal.Body className="border modal-body">
                <Alert ref={alertRef} tabIndex={-1} variant={alert.variant} show={alert.show} dismissible onClose={toggleAlert}>
                    {alert.message}
                </Alert>
                <Form className="add-user-form" onSubmit={handleSubmit}>
                    <Form.Group className="mb-3 row justify-content-center" controlId="country">
                        <Form.Label className="data-label">Destination Country:</Form.Label>
                        <Form.Select value={country?.id ?? ""} onChange={e=>handleSelect(e,"c")} name="country" className="data-input" required>
                            <option value="" hidden>Select country</option>
                            {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3 row justify-content-center" controlId="state">
                        <Form.Label className="data-label">Destination State / Province:</Form.Label>
                        <Form.Control value={state ?? ""} onChange={e=>handleSelect(e,"s")} list="statesList" name="state" className="data-input" required  maxLength="45"/>
                            <datalist id="statesList">
                                {states.map(s => <option key={s.id} value={s.name}/>)}
                            </datalist>
                    </Form.Group>
                    <Form.Group className="mb-3 row justify-content-center" controlId="name">
                        <Form.Label className="data-label">Rate:</Form.Label>
                        <Form.Control name="rate" required className="data-input" type="number" step="0.01" />
                    </Form.Group>
                    <Form.Group className="mb-3 row justify-content-center" controlId="alias">
                        <Form.Label className="data-label">Days to deliver:</Form.Label>
                        <Form.Control name="days" required className="data-input" type="number" />
                    </Form.Group>
                    <Form.Group className="mb-3 row justify-content-center" controlId="enabled">
                        <Form.Label className="data-label">COD Supported:</Form.Label>
                        <Form.Check name="COD" className="data-input ps-0" type="checkbox"/>
                    </Form.Group>
                    <Row className="justify-content-center">
                        <div className="w-25"></div>
                        <div className="data-input ps-0">
                            <Button ref={submitBtnRef} className="fit-content mx-1" variant="primary" type="submit">
                                Save
                            </Button>
                            <Button onClick={handleReset}  className="fit-content mx-1" variant="secondary" type="reset">
                                Clear
                            </Button>
                        </div>
                    </Row>
                    
                </Form>
            </Modal.Body>
      </Modal>
     );
}
 
export default AddShippingRate;