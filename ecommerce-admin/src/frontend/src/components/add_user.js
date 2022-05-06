import { useState } from "react";
import { Alert, Button, Form, Modal, Row } from "react-bootstrap";

const AddUser = ({ showAddUser, setShowAddUser }) => {
    
    const [user, setUser] = useState({
        email: "", firstName: "", lastName: "", password: "", enabled: false, roles: []
    });
    const handleInput = (event) => {
        setUser({
            ...user,
            [event.target.id]: event.target.value
        })
    }
    const handleToggle = (event) => {
        setUser({
            ...user,
            [event.target.id]: event.target.checked
        })
    }
    const handleRoles = (event) => {
        let roles = user.roles;
        const roleName = event.target.value
        if (event.target.checked) {
            if(roles.indexOf(roleName) === -1)roles.push(roleName)
        } else {
            user.roles = roles.filter((role) => role !== roleName)
        }
        console.log(user)
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        if (user.roles.length === 0) {
            console.error("no roles selected!")
            return;
        }
    }

    return ( 
        <Modal show={showAddUser} fullscreen={true} onHide={()=> setShowAddUser(!showAddUser)}>
            <Modal.Header closeButton>
                <Modal.Title>Add New User</Modal.Title>
            </Modal.Header>
            <Modal.Body className="border modal-body">
                <Alert variant="success" show={true} dismissible>
                    This is an alert—check it out!
                </Alert>
                <Form className="add-user-form" onSubmit={handleSubmit}>
                    <Form.Group className="mb-3 row justify-content-center" controlId="email">
                        <Form.Label className="form-label">Email address:</Form.Label>
                        <Form.Control value={user.email} onInput={handleInput} required className="form-input" type="email" placeholder="Enter email" />
                    </Form.Group>
                    <Form.Group className="mb-3 row justify-content-center" controlId="firstName">
                        <Form.Label className="form-label">First Name:</Form.Label>
                        <Form.Control value={user.firstName} onInput={handleInput} required className="form-input" type="text" placeholder="Enter first name" />
                    </Form.Group>
                    <Form.Group className="mb-3 row justify-content-center" controlId="lastName">
                        <Form.Label className="form-label">Last Name:</Form.Label>
                        <Form.Control value={user.lastName} onInput={handleInput} required className="form-input" type="text" placeholder="Enter last name" />
                    </Form.Group>
                    <Form.Group className="mb-3 row justify-content-center" controlId="password">
                        <Form.Label className="form-label">Password:</Form.Label>
                        <Form.Control value={user.password} onInput={handleInput} required className="form-input" type="password" />
                    </Form.Group>
                    <Form.Group className="mb-3 row justify-content-center" controlId="roles">
                        <Form.Label className="form-label" style={{alignSelf: "start"}}>Roles:</Form.Label>
                        <div className="form-input ps-2">
                            <div className="form-check">
                                <input onChange={handleRoles} className="form-check-input" type="checkbox" value="Admin" id="admin"/>
                                <label className="form-check-label" htmlFor="admin">
                                    Admin - Manages everything
                                </label>
                            </div>
                            <div className="form-check">
                                <input onChange={handleRoles} className="form-check-input" type="checkbox" value="Salesperson" id="salesperson"/>
                                <label className="form-check-label" htmlFor="salesperson">
                                    Salesperson - Manages product price, customers, shipping, orders, and sales report
                                </label>
                            </div>
                            <div className="form-check">
                                <input onChange={handleRoles} className="form-check-input" type="checkbox" value="Editor" id="Editor"/>
                                <label className="form-check-label" htmlFor="Editor">
                                    Editor - Manages categories, brands, products, articles, and menus
                                </label>
                            </div>
                            <div className="form-check">
                                <input onChange={handleRoles} className="form-check-input" type="checkbox" value="Shipper" id="Shipper"/>
                                <label className="form-check-label" htmlFor="Shipper">
                                    Shipper - View products, view orders, and update order status
                                </label>
                            </div>
                            <div className="form-check">
                                <input onChange={handleRoles} className="form-check-input" type="checkbox" value="Assistant" id="Assistant"/>
                                <label className="form-check-label" htmlFor="Assistant">
                                    Assistant - Manages questions and reviews
                                </label>
                            </div>
                        </div>
                    </Form.Group>
                    <Form.Group className="mb-3 row justify-content-center" controlId="enabled">
                        <Form.Label className="form-label">Enabled:</Form.Label>
                        <Form.Check onChange={handleToggle} className="form-input ps-0" type="checkbox"/>
                    </Form.Group>
                    <Form.Group className="mb-3 row justify-content-center" controlId="photo">
                        <Form.Label className="form-label"  style={{alignSelf: "start"}}>Photo:</Form.Label>
                        <div className="form-input d-flex">
                            <Form.Control className="w-50 h-fit-content"  style={{alignSelf: "center"}} type="file" />
                            <div className="w-50">
                                <label htmlFor="photo" className="person-span cursor-pointer bg-secondary">
                                    <i className="bi bi-person-fill"></i>
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
 
export default AddUser;