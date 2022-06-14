import useArray from "./custom_hooks/use-array";
import useAuth from "./custom_hooks/use-auth";
import { useEffect } from "react";
import axios from "axios";
import { isTokenExpired } from "./utilities";

const ShoppingCart = () => {
    const url = `${process.env.REACT_APP_SERVER_URL}cart/view`;
    const [auth, setAuth] = useAuth();
    const { array, setArray } = useArray();

    useEffect(() => {
        if (auth.accessToken) {
            axios.get(url, {
                headers: {
                "Authorization": `Bearer ${auth?.accessToken}`
                }
            })
            .then(response => {
                const data = response.data;
                setArray(data);
            })
            .catch(res => {
            console.error(res)
            if (isTokenExpired(res.response)) {
                setAuth({})
                window.location.reload();
            }
            })
        }
    }, [auth?.accessToken])

    return ( 
        <>
            <div>shopping cart</div>
                {
                (array.length > 0)
                ? <div>items</div>
                : <div>No items in the cart</div>
            }
        </>
     );
}
 
export default ShoppingCart;