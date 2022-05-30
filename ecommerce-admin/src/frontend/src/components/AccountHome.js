import useAuth from "./custom_hooks/use-auth";

const AccountHome = () => {

    const [{roles: allRoles, firstName, lastName}] = useAuth()
    const roles = allRoles.map(role => role.name);

    return ( 
        <div className="px-3 py-2">
            <h4>{firstName} {lastName}</h4> <h5>[{roles.toString()}]</h5>
        </div>
     );
}
 
export default AccountHome;