import { Row, Col, Form, Alert , Button} from "react-bootstrap";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "./custom_hooks/use-auth";
import { SPINNERS_BORDER_HTML } from "./utilities";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";

const Login = () => {
    const url = `${process.env.REACT_APP_SERVER_URL}customer/login`;
    const oauthURL = process.env.REACT_APP_SERVER_URL + "oauth2/authorize";
    const redirectUri = encodeURIComponent(window.location.origin +"/#/o2");
    const [searchParams,] = useSearchParams();
    const error = searchParams.get("error");

    const [alertRef, btnRef] = [useRef(), useRef()];
    const [alert, setAlert] = useState({ show: (error) ? true :false, message: error ?? "", variant: 'danger' })
    const { setAuth } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Login";
    }, [])

    useEffect(() => {
        if (!alert.show) return;
        alertRef.current && alertRef.current.focus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                navigate("/")
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
            <Row className="mx-0 justify-content-center mt-5">
                <Col xs="11" md="5" className="p-4 my-4 border rounded">
                    <Form onSubmit={handleSubmit}>
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
                        <Button ref={btnRef} variant="success" className="py-2" style={{ width: "100%" }} type="submit">Login</Button>
                    </Form>
                    <h6 className="my-3">Or</h6>
                    <a
                        href={`${oauthURL}/google?redirect_uri=${redirectUri}`}
                        className="py-2 btn  border-secondary"
                        style={{ width: "100%" }}
                    ><i className="bi bi-google text-warning"></i> &nbsp; Log In with Google</a>
                        <a
                        href={`${oauthURL}/facebook?redirect_uri=${redirectUri}`}
                        className="py-2 my-2 btn btn-primary"
                        style={{ width: "100%" }}
                    ><i className="bi bi-facebook"></i> &nbsp; Log In with Facebook</a>
                    <div className="text-end my-2"><a href="/forgot-password">Forgot Password ?</a></div>
                    <div className="mt-2">Don't have an account yet? <a href="/register" className="fw-bold">Sign UP</a></div>
                </Col>
            </Row>
        </>
     );
}
 
export default Login;