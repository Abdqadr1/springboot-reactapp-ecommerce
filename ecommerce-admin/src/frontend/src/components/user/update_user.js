import axios from "axios";
import {useEffect, useRef, useState } from "react";
import { Alert, Button, Form, Modal, Row } from "react-bootstrap";
import { Navigate, useNavigate } from "react-router-dom";
import { getFormData, isFileValid, isTokenExpired, showThumbnail, SPINNERS_BORDER_HTML } from "../utilities";
import useAuth from "../custom_hooks/use-auth";

const UpdateUser = ({ updateUser, setUpdateUser, updatingUser }) => {
    const navigate = useNavigate()
    const [{accessToken}] = useAuth();
    const user = updateUser.user;
    const url = process.env.REACT_APP_SERVER_URL + "user/edit/" + user.id;
    const initialForm = {
        id:'', email:'', firstName:'', lastName:'', password:'', enabled: false, photo: null, roles: []
    }
    const initialImage = <label htmlFor="photo" className="ms-0 person-span mt-3 cursor-pointer bg-secondary">
                                <i className="bi bi-person-fill"></i>
                            </label>
    const [form, setForm] = useState({...initialForm});
    const [alert, setAlert] = useState({ show: false, message: "", variant: "success" });
    const [image, setImage] = useState(initialImage)
    const alertRef = useRef();
    const submitBtnRef = useRef();
    const toggleAlert = () => setAlert({ ...alert, show: !alert.show })
    
    const hideModal = () => {
        setUpdateUser({...updateUser, show: false})
    }

    const handleInput = (event) => {
        setForm({
            ...form,
            [event.target.id]: event.target.value
        })
    }
    const handleToggle = (event) => {
        setForm({
            ...form,
            [event.target.id]: event.target.checked
        })
    }
    const handleRoles = (event) => {
        let roles = form.roles;
        const roleID = Number(event.target.value);
        if (event.target.checked) {
            if ((roles.findIndex(id => id === roleID)) === -1) roles.push(roleID);
        } else {
             roles = roles.filter((id) =>  id !== roleID )
        }
        setForm({...form, roles})
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        if (form.roles.length === 0) {
            setAlert({show:true, message:"no roles selected!", variant: "danger"})
            return;
        }
        const data = getFormData(form)
        setAlert((state) => ({ ...state, show: false }));
        
        const button = submitBtnRef.current
        button.disabled=true
        button.innerHTML = SPINNERS_BORDER_HTML
        axios.post(url, data, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        }).then(response => {
            setAlert({ show: true, message: "User updated!" })
            updatingUser(response.data)
        })
        .catch(error => { 
            const response = error.response
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
            setForm(state => ({...state, image:file}))
            showThumbnail(file, setImage);
        }
        
    }
    const isRole = (id) => form.roles && form.roles.findIndex(u => u === id) > -1
    
    useEffect(() => {
        setAlert((state) => ({ ...state, show: false }));
        const currentUser = updateUser.user;
        if (currentUser.id) {
            if (!form.id || currentUser.id) {
                const roles = currentUser.roles.map(role => role.id);
                setForm({ ...currentUser, roles });
                const fileURI = process.env.REACT_APP_SERVER_URL + "user-photos/"
                const img = currentUser.photo && currentUser.photo !== "null"
                    ? <img src={`${fileURI}${currentUser.id}/${currentUser.photo}`} alt="thumbnail" className="thumbnail" />
                    : <label htmlFor="photo" className="ms-0 person-span mt-3 cursor-pointer bg-secondary">
                        <i className="bi bi-person-fill"></i>
                    </label>
                setImage(img);
            }
        }
    }, [updateUser.user, form.id])

    useEffect(() => {
        alertRef.current && alertRef.current.focus();
    }, [alert])

    const handleReset = () => {
        setForm({...initialForm, id:form.id})
        setImage(initialImage)
    }

    if(!accessToken) return <Navigate to="/login/2" />
    return ( 
        <Modal show={updateUser.show} fullscreen={true} onHide={hideModal}>
            <Modal.Header closeButton>
                <Modal.Title>Edit User (ID : {user.id})</Modal.Title>
            </Modal.Header>
            <Modal.Body className="border modal-body">
                <Alert ref={alertRef} tabIndex={-1} variant={alert.variant} show={alert.show} dismissible onClose={toggleAlert}>
                    {alert.message}
                </Alert>
                <Form className="add-user-form" onSubmit={handleSubmit} encType="multipart/form-data">
                    <Form.Group className="mb-3 row justify-content-center" controlId="email">
                        <Form.Label className="form-label">Email address:</Form.Label>
                        <Form.Control value={form?.email} onInput={handleInput} required className="form-input" type="email" placeholder="Enter email" />
                    </Form.Group>
                    <Form.Group className="mb-3 row justify-content-center" controlId="firstName">
                        <Form.Label className="form-label">First Name:</Form.Label>
                        <Form.Control value={form?.firstName} onInput={handleInput} required className="form-input" type="text" placeholder="Enter first name" />
                    </Form.Group>
                    <Form.Group className="mb-3 row justify-content-center" controlId="lastName">
                        <Form.Label className="form-label">Last Name:</Form.Label>
                        <Form.Control value={form?.lastName} onInput={handleInput} required className="form-input" type="text" placeholder="Enter last name" />
                    </Form.Group>
                    <Form.Group className="mb-3 row justify-content-center" controlId="password">
                        <Form.Label className="form-label">Password:</Form.Label>
                        <Form.Control onInput={handleInput} className="form-input" type="text" />
                    </Form.Group>
                    <Form.Group className="mb-3 row justify-content-center" controlId="roles">
                        <Form.Label className="form-label" style={{alignSelf: "start"}}>Roles:</Form.Label>
                        <div className="form-input ps-2">
                            <div className="form-check">
                                <input checked={isRole(5)} onChange={handleRoles} className="form-check-input" type="checkbox" value="5" id="Admin"/>
                                <label className="form-check-label" htmlFor="admin">
                                    Admin - Manages everything
                                </label>
                            </div>
                            <div className="form-check">
                                <input checked={isRole(1)} onChange={handleRoles} className="form-check-input" type="checkbox" value="1" id="Aalesperson"/>
                                <label className="form-check-label" htmlFor="salesperson">
                                    Salesperson - Manages product price, customers, shipping, orders, and sales report
                                </label>
                            </div>
                            <div className="form-check">
                                <input checked={isRole(2)} onChange={handleRoles} className="form-check-input" type="checkbox" value="2" id="Editor"/>
                                <label className="form-check-label" htmlFor="Editor">
                                    Editor - Manages categories, brands, products, articles, and menus
                                </label>
                            </div>
                            <div className="form-check">
                                <input checked={isRole(3)} onChange={handleRoles} className="form-check-input" type="checkbox" value="3" id="Shipper"/>
                                <label className="form-check-label" htmlFor="Shipper">
                                    Shipper - View products, view orders, and update order status
                                </label>
                            </div>
                            <div className="form-check">
                                <input checked={isRole(4)} onChange={handleRoles} className="form-check-input" type="checkbox" value="4" id="Assistant"/>
                                <label className="form-check-label" htmlFor="Assistant">
                                    Assistant - Manages questions and reviews
                                </label>
                            </div>
                        </div>
                    </Form.Group>
                    <Form.Group className="mb-3 row justify-content-center" controlId="enabled">
                        <Form.Label className="form-label">Enabled:</Form.Label>
                        <Form.Check checked={form.enabled}  onChange={handleToggle} className="form-input ps-0" type="checkbox"/>
                    </Form.Group>
                    <Form.Group className="mb-3 row justify-content-center" controlId="photo">
                        <Form.Label className="form-label"  style={{alignSelf: "start"}}>Photo:</Form.Label>
                        <div className="form-input row">
                            <Form.Control onChange={handleSelectImage} className="col-10" type="file" accept="image/jpg, image/png, image/jpeg" />
                            {image}
                        </div>
                    </Form.Group>
                    <Row className="justify-content-center">
                        <div className="w-25"></div>
                        <div className="form-input ps-0">
                            <Button ref={submitBtnRef} className="fit-content mx-1" variant="primary" type="submit">
                                Update User
                            </Button>
                            <Button onClick={handleReset} className="fit-content mx-1" variant="secondary" type="reset">
                                Clear
                            </Button>
                        </div>
                    </Row>
                    
                </Form>
            </Modal.Body>
        </Modal>
     );
}
 
export default UpdateUser;