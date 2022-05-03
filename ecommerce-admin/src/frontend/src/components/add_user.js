import { Button, Form, Modal, Row } from "react-bootstrap";

const AddUser = ({showAddUser, setShowAddUser}) => {

    return ( 
        <Modal show={showAddUser} fullscreen={true} onHide={()=> setShowAddUser(!showAddUser)}>
            <Modal.Header closeButton>
                <Modal.Title>Add New User</Modal.Title>
            </Modal.Header>
            <Modal.Body className="border modal-body">
                <Form>
                    <Form.Group className="mb-3 row justify-content-center" controlId="email">
                        <Form.Label className="form-label">Email address:</Form.Label>
                        <Form.Control className="form-input" type="email" placeholder="Enter email" />
                    </Form.Group>
                    <Form.Group className="mb-3 row justify-content-center" controlId="firstName">
                        <Form.Label className="form-label">First Name:</Form.Label>
                        <Form.Control className="form-input" type="email" placeholder="Enter first name" />
                    </Form.Group>
                    <Form.Group className="mb-3 row justify-content-center" controlId="lastName">
                        <Form.Label className="form-label">Last Name:</Form.Label>
                        <Form.Control className="form-input" type="email" placeholder="Enter last name" />
                    </Form.Group>
                    <Form.Group className="mb-3 row justify-content-center" controlId="password">
                        <Form.Label className="form-label">Password:</Form.Label>
                        <Form.Control className="form-input" type="password" />
                    </Form.Group>
                    <Form.Group className="mb-3 row justify-content-center" controlId="roles">
                        <Form.Label className="form-label" style={{"align-self": "start"}}>Roles:</Form.Label>
                        <div className="form-input ps-2">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" value="Admin" id="admin"/>
                                <label class="form-check-label" for="admin">
                                    Admin - Manages everything
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" value="Salesperson" id="salesperson"/>
                                <label class="form-check-label" for="salesperson">
                                    Salesperson - Manages product price, customers, shipping, orders, and sales report
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" value="Editor" id="Editor"/>
                                <label class="form-check-label" for="Editor">
                                    Editor - Manages categories, brands, products, articles, and menus
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" value="Shipper" id="Shipper"/>
                                <label class="form-check-label" for="Shipper">
                                    Shipper - View products, view orders, and update order status
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" value="Assistant" id="Assistant"/>
                                <label class="form-check-label" for="Assistant">
                                    Assistant - Manages questions and reviews
                                </label>
                            </div>
                        </div>
                    </Form.Group>
                    <Form.Group className="mb-3 row justify-content-center" controlId="enabled">
                        <Form.Label className="form-label">Enabled:</Form.Label>
                        <Form.Check className="form-input ps-0" type="checkbox"/>
                    </Form.Group>
                    <Form.Group className="mb-3 row justify-content-center" controlId="photo">
                        <Form.Label className="form-label"  style={{"align-self": "start"}}>Photo:</Form.Label>
                        <div className="form-input d-flex">
                            <Form.Control className="w-50 h-fit-content"  style={{"align-self": "center"}} type="file" />
                            <div className="w-50">
                                <label htmlFor="photo" className="person-span cursor-pointer bg-secondary">
                                    <i class="bi bi-person-fill"></i>
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