import { Col, Row } from "react-bootstrap";

const User = ({ user, showUpdate, setDeleteUser, toggleEnable, type }) => {
    const fileURI = process.env.REACT_APP_SERVER_URL + "user-photos/";
    let roles = user?.roles.map((role)=> role.name).toString()

    function deleteUser() {
        setDeleteUser({
            show:true, id: user.id
        })
    }

    const enabled = user.enabled
        ? <i className="bi bi-toggle-on text-success fs-3" onClick={() => toggleEnable(user.id, false)}></i>
        : <i className="bi bi-toggle-off text-secondary fs-3" onClick={() => toggleEnable(user.id, true)}></i>
    const photo = user.photo ?<img loading="lazy" src={`${fileURI}${user.id}/${user.photo}`} alt="user-dp" className="table-dp" />
        :<span htmlFor="photo" className="avatar cursor-pointer bg-secondary">
            <i className="bi bi-person-fill"></i>
        </span>
    
    function tableItem() {
        return (
            <tr>
                <td className="hideable-col">{user.id}</td>
                <td>{photo}</td>
                <td className="hideable-col">{user.email}</td>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>[{roles}]</td>
                <td>{enabled}</td>
                <td className="d-flex justify-content-center">
                    <i className="bi bi-pencil-fill edit" title="edit user" onClick={()=> showUpdate(user.id)}></i>
                    <i className="bi bi-archive-fill delete" title="delete user" onClick={deleteUser}></i>
                </td>
            </tr>
        )
    }

    function rowItem() {
        return (
            <Row className="mt-2 justify-content-between">
                <Col xs="5">
                    {photo}
                </Col>
                <Col xs="7">
                    <span className="d-block mb-3">{user.firstName} {user.lastName}</span>
                    <span className="d-block mb-3 word-break">[{roles}]</span>
                    <Row className="justify-content-start align-item-center">
                        <Col xs="3">{enabled}</Col>
                        <Col xs="4"><i className="bi bi-pencil-fill edit fs-6" title="edit user" onClick={()=> showUpdate(user.id)}></i></Col>
                        <Col xs="4"><i className="bi bi-archive-fill delete fs-6" title="delete user" onClick={deleteUser}></i></Col>
                    </Row>
                </Col>
            </Row>
        )
    }
    
    const item = (type === "detailed")
        ? tableItem() : rowItem()

    return item
}
 
export default User;