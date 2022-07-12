import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { Alert, Button, Col, Form, Row } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import "../css/login.css";
import useAuth from './custom_hooks/use-auth';
import { getFormData, SPINNERS_BORDER_HTML } from './utilities';
import useSettings from './custom_hooks/use-settings';

const Login = () => {
    const loginUrl = process.env.REACT_APP_SERVER_URL+"login";
    const { SITE_LOGO } = useSettings();
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

    useEffect(()=>{document.title = `Login`},[])

    useEffect(() => {
        const type = Number(out)
        if (type === 1) setParam({ show: ' text-warning', message: "You logged out" })
        if(type === 2) setParam({ show: ' text-warning', message: "You've been logged out" })
    }, [out])

    return ( 
        <Row className="login-body p-3 justify-content-center mx-0">
            <Col xs={12} md={8} lg={6} className="h-fit-content my-auto">
                <img className='login-logo' alt="logo" src={SITE_LOGO} />
                <h4 className={`text-center py-3` + param.show}>{param.message}</h4>
                <Form className="border pt-2 pb-5 px-3 rounded" onSubmit={handleSubmit}>
                    <h5 className={`text-center py-3`}>Access to QShop Control Panel</h5>
                    <Alert ref={alertRef} className="text-center" tabIndex={-1} variant="danger" show={alert.show} dismissible onClose={toggleAlert}>
                        {alert.msg}
                    </Alert>
                    <Form.Group className="mb-3" controlId="email">
                        <Form.Label className="mb-2">Email address:</Form.Label>
                        <Form.Control value={form.email} onInput={handleInput} required type="email" placeholder="Enter email address" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="password">
                        <Form.Label className="mb-2">Password:</Form.Label>
                        <Form.Control value={form.password} onInput={handleInput} required type="password" />
                    </Form.Group>
                    <Button ref={buttonRef} variant="primary" type="submit" className="mx-auto d-block">
                        Log In
                    </Button>
                </Form>
            </Col>
        </Row>
     );
}
 
export default Login;