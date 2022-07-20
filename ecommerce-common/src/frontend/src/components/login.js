import { Row, Col, Form, Alert , Button} from "react-bootstrap";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "./custom_hooks/use-auth";
import { SPINNERS_BORDER_HTML } from "./utilities";
import axios from "axios";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import google from "../images/google.png";
import facebook from "../images/facebook.png";
import login from "../images/login.png";

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
            })
            .finally(() => {
                btn.textContent = "Submit";
                btn.disabled = false;
            })
    }

    return ( 
        <>
            <Row className="mx-0 justify-content-center bg-light content">
                <Col md="6" className="p-0 d-none d-sm-none d-md-flex">
                    <img style={{width: '100%', height: '100%'}} src={login} alt="login" />
                </Col>
                <Col md="6" sm={12} className="text-center px-auto py-3">
                    <Form className="mx-auto" style={{ width: "80%" }} onSubmit={handleSubmit}>
                        <h1 className="fw-bold text-primary mt-2">Log in</h1>
                        <div className="d-flex flex-wrap justify-content-center mt-4">
                            <a
                            href={`${oauthURL}/google?redirect_uri=${redirectUri}`}
                            className="oauth-a btn btn-light"
                            >
                                <img className="oauth-icon" src={google} alt="google" />
                            </a>&nbsp; &nbsp;
                            <a
                            href={`${oauthURL}/facebook?redirect_uri=${redirectUri}`}
                            className="oauth-a btn btn-light"
                            >
                            <img className="oauth-icon" src={facebook} alt="facebook" />  
                            </a>
                        </div>
                        <div className="d-flex flex-wrap justify-content-center align-items-center mt-3 text-secondary">
                            <span className="hr bg-secondary"></span>
                            <span className="with-email">Or Log in with Email</span>
                            <span className="hr bg-secondary"></span>
                        </div>
                        <Alert ref={alertRef} tabIndex={-1} variant={alert.variant} show={alert.show} dismissible
                            onClose={() => setAlert(s => ({ ...s, show: false }))} className="my-3">
                            {alert.message}
                        </Alert>
                        <Form.Group className="my-3" controlId="email">
                            <Form.Label className="text-start w-100 fw-bold">Email:</Form.Label>
                            <Form.Control className="input" name="email" type="email" placeholder="Enter email" required maxLength="64"/>
                        </Form.Group>
                        <Form.Group className="mt-3 mb-4" controlId="password">
                            <Form.Label className="text-start w-100 fw-bold">Password:</Form.Label>
                            <Form.Control className="input" name="password" type="password" placeholder="Enter password" minLength="5" required/>
                        </Form.Group>
                        <div className="text-end mt-2 fw-bold">
                            <Link style={{color: '#d63384'}} to="/forgot-password">Forgot Password?</Link>
                        </div>
                        <Button ref={btnRef} variant="primary" className="mt-3 mb-2 py-2 rounded-pill" style={{ width: "100%" }} type="submit">Log in</Button>
                        <br />
                        <hr className="my-3" />
                        <div className="mt-4">Don't have an account yet?
                            <Link style={{ color: '#d63384' }} to="/register" className="ps-3 fw-bold">Sign up</Link>
                        </div>
                    </Form>
                </Col>
            </Row>
        </>
     );
}
 
export default Login;