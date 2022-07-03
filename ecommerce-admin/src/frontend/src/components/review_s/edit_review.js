import { Form, Modal, FloatingLabel, Row, Button, Alert } from "react-bootstrap";
import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import useAuth from "../custom_hooks/use-auth";
import { SPINNERS_BORDER_HTML, isTokenExpired } from "../utilities";
import axios from "axios";

const EditReview = ({ data, setData, updateReview }) => {
    const url = process.env.REACT_APP_SERVER_URL + "review/edit";
    const review = data.review;
    const [{ accessToken }] = useAuth();
    const navigate = useNavigate();
    const [alert, setAlert] = useState({ show: false, message: "", variant: "success" });
    const alertRef = useRef();
    const toggleAlert = () => {
        setAlert({...alert, show: !alert.show})
    }
    
    const hideModal = () => {
        setData({...data, show: false})
    }

    // const handleInput = (event) => {
    //     setForm({
    //         ...review,
    //         [event.target.id]: event.target.value
    //     })
    // }

    // const handleSelect = (e, which) => {
    //     if (which === "c") {
    //         const id = Number(e.target.value);
    //         const country = countries.find(c => c.id === id);
    //         setCountry({ ...country })
    //         setForm(s=>({...s, country}))
    //     } else if (which === "s") {
    //         const state = e.target.value;
    //         setState(state)
    //         setForm(s=>({...s, state}))
    //     }
    // }

    const handleSubmit = (event) => {
         event.preventDefault();
        const target = event.target
        const data = new FormData(target);
        
        // listFormData(data);

        setAlert((state) => ({ ...state, show: false }));
         const button = target.querySelector("button");
        button.disabled = true
        const text = button.textContent;
        button.innerHTML = SPINNERS_BORDER_HTML
        axios.post(`${url}/${review.id}`, data, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        })
            .then(response => {
                updateReview(response.data);
                setAlert({ show: true, message: "Product saved!" })
            })
            .catch(error => { 
                const response = error.response
                if(isTokenExpired(response)) navigate("/login/2")
                else setAlert({show:true, message: response.data.message, variant: "danger"})
            }).finally(() => {
                button.disabled=false
                button.innerHTML = text;
            })
    }

    const handleReset = () => {}
    return ( 
        <Modal show={data.show} fullscreen={true} onHide={hideModal}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Review (ID : {review.id})</Modal.Title>
            </Modal.Header>
            <Modal.Body className="border modal-body">
                <Alert ref={alertRef} tabIndex={-1} variant={alert.variant} show={alert.show} dismissible onClose={toggleAlert}>
                    {alert.message}
                </Alert>
                <Form  className="add-user-form" onSubmit={handleSubmit}>
                    <input value={review?.id ?? ""} type="hidden" name="id" />
                    <Form.Group className="my-3 row justify-content-center mx-0" controlId="lastName">
                        <Form.Label className="form-label">Product:</Form.Label>
                        <FloatingLabel
                            controlId="floatingTextarea"
                            className="mb-3 form-input px-0"
                        >
                            <Form.Control style={{ height: 'fit-content' }} className="py-1" as="textarea" readOnly value={review.product?.name ?? ""}  />
                        </FloatingLabel>
                    </Form.Group>
                    <Form.Group className="my-3 row justify-content-center mx-0" controlId="email">
                        <Form.Label className="form-label">Customer:</Form.Label>
                        <Form.Control readOnly value={review.customer?.fullName ?? ""}  name="email" type="email" className="form-input"/>
                    </Form.Group>
                    <Form.Group className="my-3 row justify-content-center mx-0" controlId="rating">
                        <Form.Label className="form-label">Rating:</Form.Label>
                        <Form.Control readOnly value={review?.rating ?? ""} name="password" className="form-input"/>
                    </Form.Group>
                    <Form.Group className="my-3 row justify-content-center mx-0">
                        <Form.Label className="form-label">Review Time:</Form.Label>
                        <div className="form-input">{review?.formattedTime ?? ""}</div>
                    </Form.Group>
                    <Form.Group className="my-3 row justify-content-center mx-0" controlId="password">
                        <Form.Label className="form-label">Headline:</Form.Label>
                        <Form.Control value={review?.headline ?? ""} name="password" className="form-input"/>
                    </Form.Group>
                    <Form.Group className="my-3 row justify-content-center mx-0" controlId="phoneNumber">
                        <Form.Label className="form-label">Comment:</Form.Label>
                        <FloatingLabel
                            controlId="floatingTextarea"
                            className="mb-3 form-input px-0"
                        >
                            <Form.Control style={{ height: 'fit-content' }} className="py-1" as="textarea" value={review?.comment ?? ""}  />
                        </FloatingLabel>
                    </Form.Group>
                    <Row className="justify-content-center">
                        <div className="w-25"></div>
                        <div className="form-input ps-0 my-3">
                            <Button className="fit-content mx-1" variant="primary" type="submit">
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
 
export default EditReview;