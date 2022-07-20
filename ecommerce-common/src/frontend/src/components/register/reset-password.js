import { Row, Col, Form, Alert, Button } from "react-bootstrap";
import { useRef, useState } from "react";
import axios from "axios";
import { Navigate, useSearchParams } from "react-router-dom";
import { listFormData, SPINNERS_BORDER_HTML } from "../utilities";
const ResetPassword = () => {
    
    const [searchParams,] = useSearchParams();
    const token = searchParams.get("token");
    
    const url = `${process.env.REACT_APP_SERVER_URL}reset-password`;
    const [alertRef, btnRef] = [useRef(), useRef()];
    const [alert, setAlert] = useState({ show: false, message: "", variant: 'danger' })

    if (!token) {
        return <Navigate to="/login" />;
    }
    const handleSubmit = e => {
        e.preventDefault();
         setAlert(s => ({ ...s, show: false }))
         const data = new FormData(e.target);
        const btn = btnRef.current;
        listFormData(data)
        if (data.get("password") !== data.get("re_password")) {
            setAlert({show:true, message : "Confirm your password", variant: "warning"})
            return;
        }
        btn.innerHTML = SPINNERS_BORDER_HTML;
        btn.disabled = true;
        axios.post(`${url}/${token}`,data)
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
                        <h3>Reset Password</h3>
                        <Alert ref={alertRef} tabIndex={-1} variant={alert.variant} show={alert.show} dismissible
                            onClose={() => setAlert(s => ({ ...s, show: false }))} className="my-3">
                            {alert.message}
                        </Alert>
                        <Form.Group className="mb-3 mt-5 row justify-content-center" controlId="password">
                            <Form.Label className="text-start form-label">New Password</Form.Label>
                            <Form.Control className="form-input" name="password" type="password" placeholder="Enter password" required maxLength="64"/>
                        </Form.Group>
                        <Form.Group className="mb-3 row justify-content-center" controlId="re_password">
                            <Form.Label className="text-start form-label">Retype Password</Form.Label>
                            <Form.Control className="form-input" name="re_password" type="password" placeholder="Confirm password" required maxLength="64"/>
                        </Form.Group>
                        <Button ref={btnRef} variant="primary" className="py-2" style={{ width: "200px" }} type="submit">Login</Button>
                    </Form>
                </Col>
            </Row>
        </>
     );
}
 
export default ResetPassword;