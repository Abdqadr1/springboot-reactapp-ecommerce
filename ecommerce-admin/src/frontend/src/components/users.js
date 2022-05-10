import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Col, Form, Row, Table, Button } from "react-bootstrap";
import NavbarCollapse from "react-bootstrap/esm/NavbarCollapse";
import '../users.css';
import AddUser from "./add_user";
import DeleteModal from "./delete_user";
import MyPagination from "./paging";
import UpdateUser from "./update_user";
import User from "./user";
import { alterArrayAdd, alterArrayDelete, alterArrayEnable, alterArrayUpdate, SPINNERS_BORDER_HTML } from "./utilities";

const Users = () => {
    const serverUrl = process.env.REACT_APP_SERVER_URL + "user/";
    const searchRef = useRef();
    const [users, setUsers] = useState([]);
    const [showAddUser, setShowAddUser] = useState(false);
    const [updateUser, setUpdateUser] = useState({show:false, id: -1, user: {}});
    const [deleteUser, setDeleteUser] = useState({show:false, id: -1});
    const showUpdate = (id) => {
        const user = users.filter(u => u.id === id)[0]
        setUpdateUser({ show: true, id, user})
    };
    const [pageInfo,  setPageInfo] = useState({number: 1, totalPages:2, startCount: 1, endCount: null, totalElements: null})
    const [sort, setSort] = useState({field:"firstName", dir: "asc"})
    
    useEffect(() => {
        changePage(pageInfo.currentPage, "")
    }, [sort])

    function changePage(number, keyword) {
        number = number ?? 1;
        keyword = keyword ?? ""
        axios.get(`${serverUrl}page/${number}?sortField=${sort.field}&dir=${sort.dir}&keyword=${keyword}`)
            .then(response => {
                const data = response.data
                setPageInfo({
                    currentPage: data.currentPage,
                    endCount: data.endCount,
                    startCount: data.startCount,
                    totalPages: data.totalPages,
                    totalElements: data.totalElements
                })
                setUsers(data.users)
            })
            .catch(err => console.log(err.response))
    }  
    
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
    function addingUser(user) {
        alterArrayAdd(users, user, setUsers)
    }

    function updatingUser(user) {
        alterArrayUpdate(users, user, setUsers)
    }

    function handleFilter(event) {
        event.preventDefault();
        const value = searchRef.current.value
        if (value) {
            const button = event.target
            button.disabled =true
            button.innerHTML = SPINNERS_BORDER_HTML
            changePage(null, value)
            button.disabled = false
            button.innerHTML = "Search"
        }
        
    }
    function clearFilter() {
        if (searchRef.current?.value) {
            searchRef.current.value = "";
            changePage(null)
        }
    }
    
    function isSort(name) {
        if (name === sort.field) {
           if(sort.dir === "asc") return (<i className="bi bi-caret-up-fill text-light"></i> )
           else return (<i className="bi bi-caret-down-fill text-light"></i> )
        }
        return ""
    }

    function handleSort(event) {
        const id = event.target.id;
        const dir = sort.dir === "asc" ? "desc": "asc"
        if (id === sort.field) setSort({ ...sort, dir })
        else setSort({ field: id, dir: "asc" })
    }

    return ( 
        <>
            <Row className="justify-content-between align-items-center p-3 mx-0">
                <Col xs={12} md={5} className="my-2">
                    <h3 className="">Manage Users</h3>
                    <div>
                        <span onClick={() => setShowAddUser(true)} className="text-primary cursor-pointer">Create User</span>
                        &nbsp;|&nbsp;
                        <a href={`${serverUrl}export/csv`} className="text-primary cursor-pointer">Export CSV</a>
                        &nbsp;|&nbsp;
                        <a href={`${serverUrl}export/excel`} className="text-primary cursor-pointer">Export Excel</a>
                        &nbsp;|&nbsp;
                        <a href={`${serverUrl}export/pdf`} className="text-primary cursor-pointer">Export PDF</a>
                    </div>
                </Col>
                <Col xs={12} md={7} className="my-2">
                    <Form className="row justify-content-between">
                        <Form.Group as={Row} className="mb-3" controlId="keyword">
                            <Col sm="2" md="2">
                                <label className="d-block text-end fs-5" htmlFor="keyword">Filter:</label>
                            </Col>
                            <Col sm="9" md="6">
                                <Form.Control ref={searchRef}  type="text" placeholder="keyword" />
                            </Col>
                            <Col sm="12" md="4">
                            <div>
                                <Button onClick={handleFilter} variant="primary" className="mx-1" type="button">search</Button>
                                <Button onClick={clearFilter} variant="secondary" className="mx-1"  type="button">Clear</Button>
                            </div>
                            </Col>
                        </Form.Group>
                    </Form> 
                </Col>
            </Row>
            <Table striped bordered responsive hover className="">
                <thead className="bg-dark text-light">
                    <tr>
                        <th onClick={handleSort} id="id" className="cursor-pointer">User ID {isSort("id")}</th>
                        <th>Photo</th>
                        <th onClick={handleSort} id="email" className="cursor-pointer">Email {isSort("email")}</th>
                        <th onClick={handleSort} id="firstName" className="cursor-pointer">First Name {isSort("firstName")}</th>
                        <th onClick={handleSort} id="lastName" className="cursor-pointer">Last Name {isSort("lastName")}</th>
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
                            : <tr><td colSpan={8} className="text-center" >No user found</td></tr>
                    }
                </tbody>
            </Table>
            {(users.length > 0) ? <MyPagination pageInfo={pageInfo} changePage={changePage} /> : ""}
            <AddUser showAddUser={showAddUser} setShowAddUser={setShowAddUser} addingUser={addingUser}/>
            <UpdateUser updateUser={updateUser} setUpdateUser={setUpdateUser} updatingUser={updatingUser} />
            <DeleteModal deleteUser={deleteUser} setDeleteUser={setDeleteUser}   deletingUser={deletingUser} />
        </>
     );
}
 
export default Users;