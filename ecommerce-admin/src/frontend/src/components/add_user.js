import axios from "axios";
import {useEffect, useRef, useState } from "react";
import { Alert, Button, Form, Modal, Row } from "react-bootstrap";
import { getFormData, isFileValid, showThumbnail } from "./utilities";

const AddUser = ({ showAddUser, setShowAddUser, addingUser }) => {

    const url = process.env.REACT_APP_SERVER_URL + "user/add"
    const initialForm = {
        email:'', firstName:'', lastName:'', password:'', enabled: false, photo: null, roles: []
    }
    const [form, setForm] = useState(initialForm);
    const [image, setImage] = useState(<i className="bi bi-person-fill"></i>)
    const [alert, setAlert] = useState({ show: false, message: "", variant: "success" });
    const alertRef = useRef();
    const toggleAlert = () => {
        setAlert({...alert, show: !alert.show})
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
        const roleName = event.target.value
        if (event.target.checked) {
            if(roles.indexOf(roleName) === -1)roles.push(roleName)
        } else {
            form.roles = roles.filter((role) => role !== roleName)
        }
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        if (form.roles.length === 0) {
            setAlert({show:true, message:"no roles selected!", variant: "danger"})
            return;
        }
        const data = getFormData(form)

        axios.post(url, data)
            .then(response => {
                addingUser(response.data);
                setAlert({ show: true, message: "User saved!" })
            })
            .catch(error => {
                console.log(error.response);    
                setAlert({show:true, message: error.response.data.message, variant: "danger"})
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
    useEffect(() => {
        alertRef.current && alertRef.current.focus()
    }, [alert])

    const handleReset = () => {
        setForm(initialForm)
    }
    
    return ( 
        <Modal show={showAddUser} fullscreen={true} onHide={()=> setShowAddUser(!showAddUser)}>
            <Modal.Header closeButton>
                <Modal.Title>Add New User</Modal.Title>
            </Modal.Header>
            <Modal.Body className="border modal-body">
                <Alert ref={alertRef} tabIndex={-1} variant={alert.variant} show={alert.show} dismissible onClose={toggleAlert}>
                    {alert.message}
                </Alert>
                <Form className="add-user-form" onSubmit={handleSubmit} encType="multipart/form-data">
                    <Form.Group className="mb-3 row justify-content-center" controlId="email">
                        <Form.Label className="form-label">Email address:</Form.Label>
                        <Form.Control value={form.email} onInput={handleInput} required className="form-input" type="email" placeholder="Enter email" />
                    </Form.Group>
                    <Form.Group className="mb-3 row justify-content-center" controlId="firstName">
                        <Form.Label className="form-label">First Name:</Form.Label>
                        <Form.Control value={form.firstName} onInput={handleInput} required className="form-input" type="text" placeholder="Enter first name" />
                    </Form.Group>
                    <Form.Group className="mb-3 row justify-content-center" controlId="lastName">
                        <Form.Label className="form-label">Last Name:</Form.Label>
                        <Form.Control value={form.lastName} onInput={handleInput} required className="form-input" type="text" placeholder="Enter last name" />
                    </Form.Group>
                    <Form.Group className="mb-3 row justify-content-center" controlId="password">
                        <Form.Label className="form-label">Password:</Form.Label>
                        <Form.Control value={form.password} onInput={handleInput} required className="form-input" type="password" />
                    </Form.Group>
                    <Form.Group className="mb-3 row justify-content-center" controlId="roles">
                        <Form.Label className="form-label" style={{alignSelf: "start"}}>Roles:</Form.Label>
                        <div className="form-input ps-2">
                            <div className="form-check">
                                <input onChange={handleRoles} className="form-check-input" type="checkbox" value="5" id="admin"/>
                                <label className="form-check-label" htmlFor="admin">
                                    Admin - Manages everything
                                </label>
                            </div>
                            <div className="form-check">
                                <input onChange={handleRoles} className="form-check-input" type="checkbox" value="1" id="salesperson"/>
                                <label className="form-check-label" htmlFor="salesperson">
                                    Salesperson - Manages product price, customers, shipping, orders, and sales report
                                </label>
                            </div>
                            <div className="form-check">
                                <input onChange={handleRoles} className="form-check-input" type="checkbox" value="2" id="Editor"/>
                                <label className="form-check-label" htmlFor="Editor">
                                    Editor - Manages categories, brands, products, articles, and menus
                                </label>
                            </div>
                            <div className="form-check">
                                <input onChange={handleRoles} className="form-check-input" type="checkbox" value="3" id="Shipper"/>
                                <label className="form-check-label" htmlFor="Shipper">
                                    Shipper - View products, view orders, and update order status
                                </label>
                            </div>
                            <div className="form-check">
                                <input onChange={handleRoles} className="form-check-input" type="checkbox" value="4" id="Assistant"/>
                                <label className="form-check-label" htmlFor="Assistant">
                                    Assistant - Manages questions and reviews
                                </label>
                            </div>
                        </div>
                    </Form.Group>
                    <Form.Group className="mb-3 row justify-content-center" controlId="enabled">
                        <Form.Label className="form-label">Enabled:</Form.Label>
                        <Form.Check onChange={handleToggle} required className="form-input ps-0" type="checkbox"/>
                    </Form.Group>
                    <Form.Group className="mb-3 row justify-content-center" controlId="photo">
                        <Form.Label className="form-label"  style={{alignSelf: "start"}}>Photo:</Form.Label>
                        <div className="form-input d-flex">
                            <Form.Control onChange={handleSelectImage} className="w-50 h-fit-content"  style={{alignSelf: "center"}} type="file" accept="image/jpg, image/png, image/jpeg" />
                            <div className="w-50">
                                <label htmlFor="photo" className="person-span cursor-pointer bg-secondary">
                                    {image}
                                </label>
                            </div>
                        </div>
                    </Form.Group>
                    <Row className="justify-content-center">
                        <div className="w-25"></div>
                        <div className="form-input ps-0">
                            <Button className="fit-content mx-1" variant="primary" type="submit">
                                Add User
                            </Button>
                            <Button onClick={handleReset}  className="fit-content mx-1" variant="secondary" type="reset">
                                Clear
                            </Button>
                        </div>
                    </Row>
                    
                </Form>
            </Modal.Body>
      </Modal>
     );
}
 
export default AddUser;