import axios from "axios";
import { useEffect, useState } from "react";
import { Col, Form, Row, Table, Button } from "react-bootstrap";
import '../users.css';
import User from "./user";

const Users = (props) => {
    
    const [users, setUsers] = useState([]);
    const serverUrl = process.env.REACT_APP_SERVER_URL;

    useEffect(() => {
        axios.get(serverUrl)
            .then(response => setUsers(response.data))
            .catch(err => console.log(err.response))
    }, [serverUrl])
    

    return ( 
        <>
            <Row className="justify-content-between p-3">
                <Col xs={12} md={5} className="my-2">
                    <h3 className="">Manage Users</h3> 
                    <div><span className="text-primary">Create User</span></div>
                </Col>
                <Col xs={12} md={7} className="my-2">
                    <Form className="row justify-content-between">
                        <div className="col-12 col-md-8 px-0">
                            <label htmlFor="keyword" className="me-2 fs-4">Filter:</label>
                            <input type="text" className="form-control" id="keyword" placeholder="keyword" />
                        </div>
                        <div className="col-12 col-md-4 px-0 py-md-0 py-2">
                            <Button variant="primary" className="mx-1" type="submit">search</Button>
                            <Button variant="secondary" className="mx-1"  type="button">Clear</Button>
                        </div>
                    </Form> 
                </Col>
            </Row>
            <Table striped bordered responsive hover className="">
                <thead className="bg-dark text-light">
                    <tr>
                    <th>User ID</th>
                    <th>Photo</th>
                    <th>Email</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Roles</th>
                    <th>Enabled</th>
                    <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        users.length > 0
                            ? users.map(user => <User key={user.id} user={user} />)
                            : <tr><td colSpan={8} >No user found</td></tr>
                    }
                </tbody>
            </Table>
        </>
     );
}
 
export default Users;