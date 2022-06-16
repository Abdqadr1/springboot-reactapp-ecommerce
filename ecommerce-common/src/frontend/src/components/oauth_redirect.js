import { useSearchParams } from "react-router-dom";
import useAuth from "./custom_hooks/use-auth";
import { useEffect } from "react";

const OAuth2Redirect = () => {
    const [searchParams,] = useSearchParams();
    const [, setAuth] = useAuth();

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
            window.location.href = "/"
        } else if (error) {
            window.location.href = "/login?error=" + error;
        }
    }, [])

   

    return <div>Redirecting ... </div>
}
 
export default OAuth2Redirect;