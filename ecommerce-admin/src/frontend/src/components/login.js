import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { Alert, Button, Col, Form, Row } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import "../css/login.css";
import useAuth from './custom_hooks/use-auth';
import { getFormData, SPINNERS_BORDER_HTML } from './utilities';
import settings from "../images/settings.png";

const Login = () => {
    const loginUrl = process.env.REACT_APP_SERVER_URL+"login";
    const alertRef = useRef();
    const buttonRef = useRef();
    const navigate = useNavigate();
    const [param, setParam] = useState({show: "d-none", message: ""})
    const { out } = useParams();

    const [form, setForm] = useState({ email: '', password: '' })
    const [alert, setAlert] = useState({msg: '', show:false})
    const [, setAuth] = useAuth();

    const toggleAlert = () => setAlert({...alert, show:false})

    const handleSubmit = (event) => {
        event.preventDefault();
        const button = buttonRef.current;
        button.disabled=true
        button.innerHTML = ""
        button.innerHTML = SPINNERS_BORDER_HTML
        axios.post(loginUrl, getFormData(form))
            .then(response => {
                setAuth(response.data)
                navigate("/account")
            })
            .catch(error => {
                const data = error.response.data;
                setAlert({ ...alert, msg: data.message, show: true })
            }).finally(() => {
                button.disabled=false
                button.innerHTML = "Log In"
            })
    }
    const handleInput = (event) => {
        setForm({
            ...form,
            [event.target.id]: event.target.value
        })
    }

    useEffect(()=>{
        document.title = `Login`;
        setAuth(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    useEffect(() => {
        const type = Number(out)
        if (type === 1) setParam({ show: ' text-warning', message: "You logged out" })
        if(type === 2) setParam({ show: ' text-warning', message: "You've been logged out" })
    }, [out])

    return (
        <> 
            <Row className="mx-0 px-md-5 bg-light parent">
                <div className="ring bottom-left"><div className="inner bg-light"></div></div>
                <div className="ring top-right"><div className="inner bg-light"></div></div>
                <Col md="5" lg="7" className="p-0 d-none d-sm-none d-md-flex col">
                    <img className="mx-auto img-fluid" src={settings} alt="login" />
                </Col>
                <Col md="7" lg={5} sm={12} className="text-center px-auto col" style={{'height': '80%'}}>
                    <Form className="mx-auto shadow rounded px-5 bg-light py-5" onSubmit={handleSubmit} style={{'height': '100%'}}>
                        <h2 className="mt-2 mb-4">ADMIN LOGIN</h2>
                        <h4 className={`text-center py-3` + param.show}>{param.message}</h4>
                        <Alert ref={alertRef} className="text-center" tabIndex={-1} variant="danger" show={alert.show}
                            dismissible onClose={toggleAlert}>
                            {alert.msg}
                        </Alert>
                        <Form.Group className="my-3" controlId="email">
                            <Form.Label className="text-start w-100 fw-bold">Email:</Form.Label>
                            <Form.Control value={form.email} onInput={handleInput} className="input bg-light" name="email" type="email" placeholder="Enter email" required maxLength="64"/>
                        </Form.Group>
                        <Form.Group className="mt-3 mb-4" controlId="password">
                            <Form.Label className="text-start w-100 fw-bold">Password:</Form.Label>
                            <Form.Control value={form.password} onInput={handleInput} className="input bg-light" name="password" type="password" placeholder="Enter password" minLength="5" required/>
                        </Form.Group>
                        <Button ref={buttonRef} variant="primary" className="mt-3 mb-2 py-3 btn-gradient" style={{ width: "100%" }}
                            type="submit">Log in</Button>
                    </Form>
                </Col>
            </Row>
        </> 
     );
}
 
export default Login;