import { useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import {AuthContext} from "./custom_hooks/use-auth";

const Logout = () => {
    const { setAuth } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        setAuth(null); navigate("/login");
        navigate("/login");
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
}
 
export default Logout;