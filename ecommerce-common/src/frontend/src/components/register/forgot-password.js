import { Row, Col, Form, Alert, Button } from "react-bootstrap";
import { useRef, useState } from "react";
import axios from "axios";
import { SPINNERS_BORDER_HTML } from "../utilities";
const ForgotPassword = () => {
    const url = `${process.env.REACT_APP_SERVER_URL}forgot-password`;
    const [alertRef, btnRef] = [useRef(), useRef()];
    const [alert, setAlert] = useState({ show: false, message: "", variant: 'danger' })

     const handleSubmit = e => {
        e.preventDefault();
         setAlert(s => ({ ...s, show: false }))
         const data = new FormData(e.target);
         data.set("redirect_uri", window.location.origin)
        const btn = btnRef.current;
        btn.innerHTML = SPINNERS_BORDER_HTML;
        btn.disabled = true;
        axios.post(url,data)
            .then((res) => {
                setAlert({show:true, message : res.data, variant: "success"})
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
            <Row className="mx-0 justify-content-center mt-5">
                <Col xs="11" md="6" className="p-4 my-4 border rounded">
                    <Form onSubmit={handleSubmit}>
                        <h3>Forgot Password</h3>
                        <Alert ref={alertRef} tabIndex={-1} variant={alert.variant} show={alert.show} dismissible
                            onClose={() => setAlert(s => ({ ...s, show: false }))} className="my-3">
                            {alert.message}
                        </Alert>
                        <Form.Group className="mb-3 mt-5" controlId="email">
                            <Form.Label className="text-start w-100">We will be sending a reset password link to your email.</Form.Label>
                            <Form.Control name="email" type="email" placeholder="Enter email" required maxLength="64"/>
                        </Form.Group>
                        <Button ref={btnRef} variant="primary" className="py-2" style={{ width: "200px" }} type="submit">Login</Button>
                    </Form>
                </Col>
            </Row>
        </>
     );
}
 
export default ForgotPassword;