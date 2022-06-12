import { useEffect } from "react";
import useAuth from "./custom_hooks/use-auth";

const Logout = () => {
    const [, setAuth] = useAuth();

    useEffect(() => {
        setAuth({})
        window.location.href= "/login"
    },[])
}
 
export default Logout;