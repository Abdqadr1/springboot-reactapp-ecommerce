import axios from "axios";
import {useEffect, useRef, useState } from "react";
import { Alert, Button, Form, Modal, Row } from "react-bootstrap";
import { showThumbnail } from "./utilities";

const UpdateUser = ({ updateUser, setUpdateUser}) => {
    const user = updateUser.user;
    const url = process.env.REACT_APP_SERVER_URL + "user/edit/" + user.id;
    const [form, setForm] = useState({
        id:'', email:'', firstName:'', lastName:'', password:'', enabled: false, photos: null, roles: []
    });
    const [alert, setAlert] = useState({ show: false, message: "", variant: "success" });
    const [image, setImage] = useState(<i className="bi bi-person-fill"></i>)
    const alertRef = useRef();
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
        console.log(event.target.value, event.target.id)
        let roles = [...form.roles];
        const roleName = event.target.id;
        const roleID = Number(event.target.value);
        const role = {id: roleID, name: roleName}
        if (event.target.checked) {
            if ((roles.findIndex(role => role.id === roleID)) === -1) roles.push(role);
        } else {
             roles = roles.filter((role) =>  role.id !== roleID )
        }
        console.log(roles)
        setForm({...form, roles})
    }
    const handleSubmit = (event) => {
        toggleAlert();
        event.preventDefault();
        if (form.roles.length === 0) {
            setAlert({show:true, message:"no roles selected!", variant: "danger"})
            return;
        }
        axios.post(url, form).then(response => {
            console.log(response)
            setAlert({ show: true, message: "User updated!" })
        })
            .catch(error => {
                console.log(error.response);    
                setAlert({show:true, message: error.response.data.message, variant: "danger"})
            })
    }

    const handleSelectImage = (event) => {
        const input = event.target;
        const file = input.files[0]
        if (file.size > 1048576) {
            input.setCustomValidity("Image size should not be larger than 1MB");
            input.reportValidity();
            return;
        }
        if (file.type !== "image/png" && file.type !== "image/jpg" && file.type !== "image/jpeg") {
            input.setCustomValidity("File type not supported, Use png, jpg or jpeg");
            input.reportValidity();
            return;
        }
        setForm({...form, photo:file})
        showThumbnail(file, setImage);
    }
    const isRole = (id) => form.roles && form.roles.findIndex(u => u.id === id) > -1
    
    useEffect(() => {
        alertRef.current && alertRef.current.focus()
        if (updateUser.user.id) {
            if(!form.id || form.id !== updateUser.user.id) setForm({ ...updateUser.user });
        }
    }, [alert, updateUser.user, form.id])

    return ( 
        <Modal show={updateUser.show} fullscreen={true} onHide={hideModal}>
            <Modal.Header closeButton>
                <Modal.Title>Edit User</Modal.Title>
            </Modal.Header>
            <Modal.Body className="border modal-body">
                <Alert ref={alertRef} tabIndex={-1} variant={alert.variant} show={alert.show} dismissible onClose={toggleAlert}>
                    {alert.message}
                </Alert>
                <Form className="add-user-form" onSubmit={handleSubmit} encType="multipart/form-data">
                    <Form.Group className="mb-3 row justify-content-center" controlId="email">
                        <Form.Label className="form-label">Email address:</Form.Label>
                        <Form.Control defaultValue={user.email} onInput={handleInput} required className="form-input" type="email" placeholder="Enter email" />
                    </Form.Group>
                    <Form.Group className="mb-3 row justify-content-center" controlId="firstName">
                        <Form.Label className="form-label">First Name:</Form.Label>
                        <Form.Control defaultValue={user.firstName} onInput={handleInput} required className="form-input" type="text" placeholder="Enter first name" />
                    </Form.Group>
                    <Form.Group className="mb-3 row justify-content-center" controlId="lastName">
                        <Form.Label className="form-label">Last Name:</Form.Label>
                        <Form.Control defaultValue={user.lastName} onInput={handleInput} required className="form-input" type="text" placeholder="Enter last name" />
                    </Form.Group>
                    <Form.Group className="mb-3 row justify-content-center" controlId="password">
                        <Form.Label className="form-label">Password:</Form.Label>
                        <Form.Control defaultValue={user.password} onInput={handleInput} required className="form-input" type="text" />
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
                        <Form.Check checked={form.enabled}  onChange={handleToggle} required className="form-input ps-0" type="checkbox"/>
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
                            <Button  className="fit-content mx-1" variant="secondary" type="reset">
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