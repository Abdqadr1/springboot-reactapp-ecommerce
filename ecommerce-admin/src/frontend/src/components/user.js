const User = ({ user }) => {


    const handleClick = (which) => {
            console.log(which)
        if (which === 'edit') {

        } else if (which === 'delete') {
            
        }
    }


    let roles = "";
    if (user.roles.length > 0) {
        if (user.roles.length === 1) roles = user.roles[0].name
        else {
            user.roles.forEach(element => {
                console.log(element)
                roles += "," + element.name
            });
        }
        
    }
    return ( 
        <tr>
            <td>{user.id}</td>
            <td>{user.photos}</td>
            <td>{user.email}</td>
            <td>{user.firstName}</td>
            <td>{user.lastName}</td>
            <td>[{roles}]</td>
            <td>{user.enabled + ""}</td>
            <td>
                <i className="bi bi-pencil-fill edit" title="edit user" onClick={()=> handleClick('edit')}></i>
                <i className="bi bi-archive-fill delete" title="delete user" onClick={()=> handleClick('delete')}></i>
            </td>
        </tr>
     );
}
 
export default User;