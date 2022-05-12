import axios from 'axios';
import { useContext, useRef, useState } from 'react';
import { Alert, Button, Col, Form, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../login.css'
import logo from '../logo.svg'
import { AuthContext } from './context';
import { getFormData } from './utilities';

const Login = () => {
    const loginUrl = process.env.REACT_APP_SERVER_URL+"login";
    const alertRef = useRef();
    const navigate = useNavigate();

    const {setAuth} = useContext(AuthContext);

    const [form, setForm] = useState({ email: '', password: '' })
    const [alert, setAlert] = useState({msg: '', show:false})

    const toggleAlert = () => setAlert({...alert, show:false})

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post(loginUrl, getFormData(form))
            .then(response => {
                console.log(response.data)
                setAuth(response.data)
                navigate("/account")
            })
            .catch(error => {
                const data = error.response.data;
                console.error(data)
                setAlert({ ...alert, msg: data.message, show: true })
            })
    }
    const handleInput = (event) => {
        setForm({
            ...form,
            [event.target.id]: event.target.value
        })
    }

    return ( 
        <Row className="login-body p-3 justify-content-center">
            <Col xs={12} md={8} lg={6} className="h-fit-content my-auto">
                <img className='login-logo' alt="logo" src={logo} />
                <Form className="border p-4 rounded" onSubmit={handleSubmit} encType="multipart/form-data">
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
                    <Button variant="secondary" type="submit">
                        Log In
                    </Button>
                </Form>
            </Col>
        </Row>
     );
}
 
export default Login;