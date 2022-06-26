import axios from "axios";
import {useEffect, useRef, useState } from "react";
import { Alert, Button, Form, Modal, Row } from "react-bootstrap";
import { Navigate, useNavigate } from "react-router-dom";
import { isTokenExpired, listFormData, SPINNERS_BORDER_HTML } from "../utilities";
import useAuth from "../custom_hooks/use-auth";
import useArray from "../custom_hooks/use-array";

const UpdateShippingRate = ({ updateRate, setUpdateRate, updatingRate, countries }) => {
    const navigate = useNavigate()
    const [{ accessToken }] = useAuth();
    const rate = updateRate.rate;
    const url = process.env.REACT_APP_SERVER_URL + "shipping_rate"
    const { array: states, setArray: setStates } = useArray();
    const [country, setCountry] = useState(null);

    const [form, setForm] = useState({...rate});
    const [alert, setAlert] = useState({ show: false, message: "", variant: "success" });
    const alertRef = useRef();
    const submitBtnRef = useRef();

    const toggleAlert = () => setAlert({ ...alert, show: !alert.show })
    
    const hideModal = () => {
        setUpdateRate({...updateRate, show: false})
    }

    const handleInput = (event) => {
        setForm({
            ...form,
            [event.target.id]: event.target.value
        })
    }
    const handleToggle = (event) => {
        setForm({
            ...form,
            [event.target.id]: event.target.checked
        })
    }


    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.target);

        setAlert((state) => ({ ...state, show: false }));
        listFormData(data)
        
        const button = submitBtnRef.current
        button.disabled=true
        button.innerHTML = SPINNERS_BORDER_HTML
        axios.post(`${url}/edit`, data, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        }).then(response => {
            setAlert({ show: true, message: "rate updated!" })
            updatingRate(response.data)
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
        setAlert(state => ({ ...state, show: false}));
        const currentRate = updateRate.rate;
        if (currentRate.id) {
            if (!form.id || currentRate.id) {
                setForm(() => {
                    let newState = { ...currentRate }
                    if (!currentRate.parent) newState.parent = ""
                    return newState;
                });
            }
        }
    }, [updateRate.rate, form.id])

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
        
    }, [country])

    
    useEffect(() => {
        if (!alert.show) return;
        alertRef.current && alertRef.current.focus()
    }, [alert])

     const handleSelect = (e, which) => {
        if (which === "c") {
            const id = Number(e.target.value);
            const country = countries.find(c => c.id === id);
            setCountry({ ...country })
            setForm(s => ({
                ...s, country
            }))
        } else if (which === "s") {
            const name = e.target.value;
            setForm(s => ({
                ...s, state:name
            }))
        }
    }
   

    if(!accessToken) return <Navigate to="/login/2" />
    return ( 
        <Modal show={updateRate.show} fullscreen={true} onHide={hideModal}>
            <Modal.Header closeButton>
                <Modal.Title>Edit rate (ID : {rate.id})</Modal.Title>
            </Modal.Header>
            <Modal.Body className="border modal-body">
                <Alert ref={alertRef} tabIndex={-1} variant={alert.variant} show={alert.show} dismissible onClose={toggleAlert}>
                    {alert.message}
                </Alert>
                <Form className="add-user-form" onSubmit={handleSubmit}>
                    <input name="id" type="hidden" value={form?.id ?? ""} />
                    <Form.Group className="mb-3 row justify-content-center" controlId="country">
                        <Form.Label className="data-label">Destination Country:</Form.Label>
                        <Form.Select value={form.country?.id ?? ""} onChange={e=>handleSelect(e,"c")} name="country" className="data-input" required>
                            <option value="" hidden>Select country</option>
                            {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3 row justify-content-center" controlId="state">
                        <Form.Label className="data-label">Destination State / Province:</Form.Label>
                        <Form.Control value={form?.state ?? ""} onChange={e=>handleSelect(e,"s")} list="statesList" name="state" className="data-input" required  maxLength="45"/>
                            <datalist id="statesList">
                                {states.map(s => <option key={s.id} value={s.name}/>)}
                            </datalist>
                    </Form.Group>
                    <Form.Group className="mb-3 row justify-content-center" controlId="rate">
                        <Form.Label className="data-label">Rate:</Form.Label>
                        <Form.Control onChange={handleInput} value={form?.rate ?? ""} name="rate" required className="data-input" type="number" step="0.01" />
                    </Form.Group>
                    <Form.Group className="mb-3 row justify-content-center" controlId="days">
                        <Form.Label className="data-label">Days to deliver:</Form.Label>
                        <Form.Control onChange={handleInput} value={form?.days ?? ""} name="days" required className="data-input" type="number" />
                    </Form.Group>
                    <Form.Group className="mb-3 row justify-content-center" controlId="cod">
                        <Form.Label className="data-label">COD Supported:</Form.Label>
                        <Form.Check onChange={handleToggle} checked={form?.cod ?? false} name="COD" className="data-input ps-0" type="checkbox" />
                    </Form.Group>
                    <Row className="justify-content-center">
                        <div className="w-25"></div>
                        <div className="data-input ps-0">
                            <Button ref={submitBtnRef} className="fit-content mx-1" variant="primary" type="submit">
                                Save
                            </Button>
                        </div>
                    </Row>
                    
                </Form>
            </Modal.Body>
        </Modal>

    );
}
 
export default UpdateShippingRate;