
const User = ({ user, showUpdate, setDeleteUser, toggleEnable}) => {

    let roles = "";
    if (user.roles.length > 0) {
        if (user.roles.length === 1) roles = user.roles[0].name
        else {
            user.roles.forEach((el, i) => {
                const del = i === 0 ? "" : ",";
                roles += del + el.name
            });
        }
        
    }

    function deleteUser() {
        setDeleteUser({
            show:true, id: user.id
        })
    }

    const enabled = user.enabled
        ? <i className="bi bi-toggle-on text-success fs-3" onClick={() => toggleEnable(user.id, false)}></i>
        : <i className="bi bi-toggle-off text-secondary fs-3" onClick={() => toggleEnable(user.id, true)}></i>
    const photo = user.photo ? user.photo
        :<span htmlFor="photo" className="avatar cursor-pointer bg-secondary">
            <i className="bi bi-person-fill"></i>
        </span>
    return ( 
        <tr>
            <td>{user.id}</td>
            <td>{photo}</td>
            <td>{user.email}</td>
            <td>{user.firstName}</td>
            <td>{user.lastName}</td>
            <td>[{roles}]</td>
            <td>{enabled}</td>
            <td className="d-flex justify-content-center">
                <i className="bi bi-pencil-fill edit" title="edit user" onClick={()=> showUpdate(user.id)}></i>
                <i className="bi bi-archive-fill delete" title="delete user" onClick={deleteUser}></i>
            </td>
        </tr>
     );
}
 
export default User;