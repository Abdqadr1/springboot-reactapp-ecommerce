import { Row, Col, Form, Alert , Button} from "react-bootstrap";
import { useEffect, useRef, useState } from "react";
import useAuth from "./custom_hooks/use-auth";
import { SPINNERS_BORDER_HTML } from "./utilities";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

const Login = () => {
    const url = `${process.env.REACT_APP_SERVER_URL}customer/login`;
    const oauthURL = process.env.REACT_APP_OAUTH2_URL;
    const keys = (process.env.NODE_ENV === "production") ? require('./oauth_config/prod') : require('./oauth_config/prod');
    const redirectUri = keys.redirectUrl;
    const [searchParams,] = useSearchParams();
    const error = searchParams.get("error");

    const [alertRef, btnRef] = [useRef(), useRef()];
    const [alert, setAlert] = useState({ show: (error) ? true :false, message: error ?? "", variant: 'danger' })
    const [, setAuth] = useAuth();

    useEffect(() => {
        if (!alert.show) return;
        alertRef.current && alertRef.current.focus()
    }, [alert])

    const handleSubmit = e => {
        e.preventDefault();
        setAlert(s => ({...s, show:false}))
        const data = new FormData(e.target);
        
        const btn = btnRef.current;
        btn.innerHTML = SPINNERS_BORDER_HTML;
        btn.disabled = true;
        axios.post(url,data)
            .then((res) => { 
                setAuth(res.data);
                window.location.href="/";
            })
            .catch(err => { 
                const data = err.response.data;
                const msg = data?.message;
                setAlert({show:true, message : msg ?? "Something went wrong, try again", variant: "danger"})
                console.error(err)
            })
            .finally(() => {
                btn.textContent = "Submit";
                btn.disabled = false;
            })
    }

    return ( 
        <>
            <Row className="mx-0 justify-content-center mt-3">
                <Col xs="11" md="5">
                    <Form className="my-4 border p-4 rounded" onSubmit={handleSubmit}>
                        <h3>Customer Login</h3>
                        <Alert ref={alertRef} tabIndex={-1} variant={alert.variant} show={alert.show} dismissible
                            onClose={() => setAlert(s => ({ ...s, show: false }))} className="my-3">
                            {alert.message}
                        </Alert>
                        <Form.Group className="mb-3" controlId="email">
                            <Form.Label className="text-start w-100">Email:</Form.Label>
                            <Form.Control name="email" type="email" placeholder="Enter email" required maxLength="64"/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label className="text-start w-100">Password:</Form.Label>
                            <Form.Control name="password" type="password" placeholder="Enter password" minLength="5" required/>
                        </Form.Group>
                        <Button ref={btnRef} variant="primary" className="py-2" style={{width: "100%"}} type="submit">Login</Button>
                        <a
                            href={`${oauthURL}/google?redirect_uri=${redirectUri}`}
                            className="py-2 my-2 btn btn-success"
                            style={{ width: "100%" }}
                        ><i className="bi bi-google text-warning"></i> &nbsp; Continue with google</a>
                    </Form>
                </Col>
            </Row>
        </>
     );
}
 
export default Login;