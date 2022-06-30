import { useNavigate, useSearchParams } from "react-router-dom";
import {AuthContext} from "./custom_hooks/use-auth";
import { useEffect,useContext } from "react";
import { SPINNERS_BORDER } from "./utilities";

const OAuth2Redirect = () => {
    const [searchParams,] = useSearchParams();
    const { setAuth } = useContext(AuthContext);
    const navigate = useNavigate();

    const accessToken = searchParams.get("accessToken")
    const refreshToken = searchParams.get("refreshToken")
    const firstName = searchParams.get("firstName")
    const lastName = searchParams.get("lastName");
    const cart = searchParams.get("cart");
    const error = searchParams.get("error");

    useEffect(() => {
        if (accessToken && refreshToken && firstName && lastName) {
            setAuth({
                accessToken, refreshToken, firstName, lastName, cart
            })
            navigate("/"); 
        } else if (error) {
            navigate("/login?error=" + error)
        }
        else {
            navigate("/"); 
        }
    }, [accessToken, cart, error, firstName, lastName, navigate, refreshToken, setAuth])

   

    return SPINNERS_BORDER;
}
 
export default OAuth2Redirect;