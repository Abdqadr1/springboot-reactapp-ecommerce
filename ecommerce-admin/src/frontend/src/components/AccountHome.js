import { Navigate } from "react-router";
import useAuth from "./custom_hooks/use-auth";
import useSettings from "./custom_hooks/use-settings";
import { useEffect } from "react";

const AccountHome = () => {

    const [{ roles, firstName, lastName }] = useAuth();
    const { SITE_NAME } = useSettings();
    useEffect(()=>{document.title = `${firstName} - ${SITE_NAME}`},[SITE_NAME, firstName])

    if(!roles || !firstName || !lastName) return <Navigate to="/login" />
    return ( 
        <div className="px-3 py-2">
            <h4>{firstName} {lastName}</h4> <h5>[{roles.map(role => role.name).toString()}]</h5>
        </div>
     );
}
 
export default AccountHome;