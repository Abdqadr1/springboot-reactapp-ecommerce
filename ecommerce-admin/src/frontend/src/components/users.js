import axios from "axios";
import { useEffect, useState } from "react";
import { Col, Form, Row, Table, Button } from "react-bootstrap";
import '../users.css';
import AddUser from "./add_user";
import DeleteModal from "./delete_user";
import UpdateUser from "./update_user";
import User from "./user";
import { alterArrayDelete, alterArrayEnable, alterArrayUpdate } from "./utilities";

const Users = (props) => {
    
    const [users, setUsers] = useState([]);
    const [showAddUser, setShowAddUser] = useState(false);
    const [updateUser, setUpdateUser] = useState({show:false, id: -1, user: {}});
    const [deleteUser, setDeleteUser] = useState({show:false, id: -1});
    const showUpdate = (id) => {
        const user = users.filter(u => u.id === id)[0]
        setUpdateUser({ show: true, id, user})
    };
    const serverUrl = process.env.REACT_APP_SERVER_URL + "user/";

    useEffect(() => {
        axios.get(serverUrl)
            .then(response => setUsers(response.data))
            .catch(err => console.log(err.response))
    }, [serverUrl])
    
    function toggleEnable(id, status) {
        const url = serverUrl + `${id}/enable/${status}`;
        axios.get(url)
            .then((response) => {
                alterArrayEnable(users, id, status, setUsers)
                alert(response.data)
            })
            .catch(error => {
                console.log(error)
            }) 
    }
    function deletingUser() {
        const id = deleteUser.id
        const url = serverUrl + "delete/" + id;
        axios.get(url)
            .then(() => {
                alterArrayDelete(users, id, setUsers)
                setDeleteUser({...deleteUser, show:false})
                alert("User deleted!")
            })
            .catch(error => {
            console.log(error.response)
        })
    }

    function updatingUser(user) {
        alterArrayUpdate(users, user, setUsers)
    }

    return ( 
        <>
            <Row className="justify-content-between p-3 mx-0">
                <Col xs={12} md={5} className="my-2">
                    <h3 className="">Manage Users</h3> 
                    <div>
                        <span onClick={() => setShowAddUser(true)} className="text-primary cursor-pointer">Create User</span>
                    </div>
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
                            ? users.map(user => <User key={user.id} user={user} toggleEnable={toggleEnable}
                                showUpdate={showUpdate} setDeleteUser={setDeleteUser} />)
                            : <tr><td colSpan={8} >No user found</td></tr>
                    }
                </tbody>
            </Table>
            <AddUser showAddUser={showAddUser} setShowAddUser={setShowAddUser} />
            <UpdateUser updateUser={updateUser} setUpdateUser={setUpdateUser} updatingUser={updatingUser} />
            <DeleteModal deleteUser={deleteUser} setDeleteUser={setDeleteUser}   deletingUser={deletingUser} />
        </>
     );
}
 
export default Users;