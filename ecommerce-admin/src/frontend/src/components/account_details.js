import axios from "axios";
import {useCallback, useEffect, useRef, useState } from "react";
import { Alert, Button, Form, Modal, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useAuth from "./custom_hooks/use-auth";
import { getAccessToken, getFormData, isAuthValid, isFileValid, isTokenExpired, showThumbnail, SPINNERS_BORDER_HTML } from "./utilities";

const AccountDetails = ({show, setShow}) => {
    const navigate = useNavigate()
    const [auth] = useAuth();
    const [initPassword, setInitPassword] = useState("")
    const url = process.env.REACT_APP_SERVER_URL + "account/edit/" + auth.id;
    const fileURI = process.env.REACT_APP_SERVER_URL + "user-photos/";
    const initialForm = {
        id: '', email: '', firstName: '', lastName: '', password: '',
        enabled: false, photo: null, roles: [], 'confirm-password': "", "new-password": ""
    }
    const [form, setForm] = useState({...initialForm});
    const [alert, setAlert] = useState({ show: false, message: "", variant: "success" });
    const [image, setImage] = useState(<i className="bi bi-person-fill"></i>)
    const alertRef = useRef();
    const submitBtnRef = useRef();
    const toggleAlert = () => setAlert({ ...alert, show: !alert.show })

    const handleInput = (event) => {
        const id = event.target.id
        const value = event.target.value
        const accepted = ["confirm-password", "new-password", "lastName", "firstName"]
        if (accepted.some((name) => name === id)) {
            setForm({
                ...form,
                [id] : value
            })
        }
    }
    const handleSubmit = (event) => {
        toggleAlert();
        event.preventDefault();
        if (form["new-password"] !== form['confirm-password']) {
            console.log(form["new-password"], " ", form['confirm-password'])
            setAlert({show:true, message:"confirm your password", variant: "warning"})
            return;
        }
        if (form["new-password"] === "") form.password = initPassword
        else form.password = form["new-password"]

        console.log(form)
        const data = getFormData(form)
        
        const button = submitBtnRef.current
        button.disabled=true
        button.innerHTML = SPINNERS_BORDER_HTML
        axios.post(url, data, {
            headers: {
                "Authorization": `Bearer ${getAccessToken()}`
            }
        }).then(response => {
            setAlert({ show: true, message: "User updated!" })
        })
        .catch(error => {
            const response = error.response;
            console.log(response)
            if(isTokenExpired(response)) navigate("/login/2")
            else setAlert({show:true, message: response.data.message, variant: "danger"})
        }).finally(() => {  
            button.disabled=false
            button.innerHTML = "Update user"
        })
    }

    const handleSelectImage = (event) => {
        const input = event.target;
        const file = input.files[0]
        if (isFileValid(file, input)) {
            setForm({...form, image:file})
            showThumbnail(file, setImage);
        }
        
    }

    const listRoles = () => form.roles.map(role => role.name).toString()

    const getAccountDetails = useCallback(() => {
        if (auth.id !== Number(form.id)) {
            const url = process.env.REACT_APP_SERVER_URL + "account/"
            const data = new FormData()
            data.append("id", auth.id)
             axios.post(url, data, {
                headers: {
                    "Authorization": `Bearer ${auth.accessToken}`
                }
            })
            .then(response => {
                const data = response.data;
                setInitPassword(data.password)
                setForm({ ...form, ...data })
                setImage(
                    <img src={`${fileURI}${data.id}/${data.photo}`} alt="thumbnail" className="thumbnail" />
                )
            })
            .catch(error => {
                const response = error.response
                if(isTokenExpired(response)) navigate("/login/2")
            })
            .finally()
        }
    },[auth, form, fileURI, navigate])

    useEffect(() => {
        if (!isAuthValid(auth)) {
            navigate("/login/2")
        } else {
            getAccountDetails()
        }
        alertRef.current && alertRef.current.focus()
    }, [alert, auth, navigate, getAccountDetails])

    return ( 
        <Modal show={show} fullscreen={true} onHide={()=>setShow(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Account Information</Modal.Title>
            </Modal.Header>
            <Modal.Body className="border modal-body">
                <Alert ref={alertRef} tabIndex={-1} variant={alert.variant} show={alert.show} dismissible onClose={toggleAlert}>
                    {alert.message}
                </Alert>
                <Form className="add-user-form" onSubmit={handleSubmit} encType="multipart/form-data">
                    <Form.Group className="mb-3 row justify-content-center" controlId="username">
                        <Form.Label className="form-label">Email address:</Form.Label>
                        <Form.Control value={form?.email} className="form-input" type="email" placeholder="Enter email" disabled/>
                    </Form.Group>
                    <Form.Group className="mb-3 row justify-content-center" controlId="firstName">
                        <Form.Label className="form-label">First Name:</Form.Label>
                        <Form.Control value={form?.firstName} onInput={handleInput} required className="form-input" type="text" placeholder="Enter first name" />
                    </Form.Group>
                    <Form.Group className="mb-3 row justify-content-center" controlId="lastName">
                        <Form.Label className="form-label">Last Name:</Form.Label>
                        <Form.Control value={form?.lastName} onInput={handleInput} required className="form-input" type="text" placeholder="Enter last name" />
                    </Form.Group>
                    <Form.Group className="mb-3 row justify-content-center" controlId="new-password">
                        <Form.Label className="form-label">New Password:</Form.Label>
                        <Form.Control defaultValue={""} onInput={handleInput} className="form-input" type="password" minLength={8} maxLength={50}/>
                    </Form.Group>
                    <Form.Group className="mb-3 row justify-content-center" controlId="confirm-password">
                        <Form.Label className="form-label">Confirm Password:</Form.Label>
                        <Form.Control onInput={handleInput} className="form-input" type="password" minLength={8} maxLength={50} />
                    </Form.Group>
                    <Form.Group className="mb-3 row justify-content-center" controlId="roles">
                        <Form.Label className="form-label" style={{alignSelf: "start"}}>Roles:</Form.Label>
                        <div className="form-input ps-2">
                            [{listRoles()}]
                        </div>
                    </Form.Group>
                    <Form.Group className="mb-3 row justify-content-center" controlId="enabled">
                        <Form.Label className="form-label">Enabled:</Form.Label>
                        <Form.Check disabled checked={form.enabled} className="form-input ps-0" type="checkbox"/>
                    </Form.Group>
                    <Form.Group className="mb-3 row justify-content-center" controlId="photo">
                        <Form.Label className="form-label"  style={{alignSelf: "start"}}>Photo:</Form.Label>
                        <div className="form-input row">
                            <Form.Control onChange={handleSelectImage} className="col-10" type="file" accept="image/jpg, image/png, image/jpeg" />
                            <label htmlFor="photo" className="ms-0 w-50 person-span mt-3 cursor-pointer bg-secondary">
                                {image}
                            </label>
                        </div>
                    </Form.Group>
                    <Row className="justify-content-center">
                        <div className="w-25"></div>
                        <div className="form-input ps-0">
                            <Button ref={submitBtnRef} className="fit-content mx-1" variant="primary" type="submit">
                                Edit Information
                            </Button>
                        </div>
                    </Row>
                    
                </Form>
            </Modal.Body>
        </Modal>
     );
}
 
export default AccountDetails;