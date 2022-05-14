import { getAuth } from "./utilities";

const AccountHome = () => {

    const auth = getAuth()
    const roles = auth.roles.map(role => role.name);

    return ( 
        <div className="px-3 py-2">
            <h4>{auth.firstName} {auth.lastName}</h4> <h5>[{roles.toString()}]</h5>
        </div>
     );
}
 
export default AccountHome;