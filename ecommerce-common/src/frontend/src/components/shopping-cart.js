import useArray from "./custom_hooks/use-array";
import useAuth from "./custom_hooks/use-auth";
import { useEffect, useState } from "react";
import { Navigate } from "react-router";
import axios from "axios";
import { getShortName, isTokenExpired,formatPrice } from "./utilities";
import Search from "./search";
import { Row, Col, Button} from "react-bootstrap";
import {CartItemQuantity} from "./stock";
import useSettings from "./use-settings";

const ShoppingCart = () => {
    const url = process.env.REACT_APP_SERVER_URL + "cart";
    const viewURL = `${url}/view`;
    const deleteURL = `${url}/delete`
    const fileUrl = process.env.REACT_APP_SERVER_URL + "product-images/";
    const [auth, setAuth] = useAuth();
    const { array, setArray } = useArray();
    const [total, setTotal] = useState(0);

    
    const { CURRENCY_SYMBOL, CURRENCY_SYMBOL_POSITION, DECIMAL_DIGIT, THOUSANDS_POINT_TYPE, SITE_NAME } = useSettings();

    
    useEffect(()=>{document.title = `Shopping Cart - ${SITE_NAME}`},[SITE_NAME])

    function priceFormatter() {
        return (price) =>
            formatPrice(price, CURRENCY_SYMBOL, DECIMAL_DIGIT, THOUSANDS_POINT_TYPE, CURRENCY_SYMBOL_POSITION)
    }

    useEffect(() => {
        if (auth.accessToken) {
            axios.get(viewURL, {
                headers: {
                "Authorization": `Bearer ${auth?.accessToken}`
                }
            })
            .then(response => {
                const data = response.data;
                setArray(data.items);
                setTotal(data.total)
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

    function handleDelete(e) {
        console.log(e.target);
         axios.get(`${deleteURL}`, {
                headers: {
                    "Authorization": `Bearer ${auth?.accessToken}`
                }
            })
            .then(response => {
                const data = response.data;
                setArray(data.items);
                setTotal(data.total)
            })
            .catch(res => {
            console.error(res)
            if (isTokenExpired(res.response)) {
                setAuth({})
                window.location.reload();
            }
            })
    }


    function listCartItems() {
        const formatPrice = priceFormatter();
        return (
            <Row className="mx-0">
                <Col md={8}>
                    {
                        array.map((c,i) =>
                            <Row className="mx-0 my-2 border rounded px-2 py-3" key={i}>
                                <Col>
                                    <img src={`${fileUrl}${c.product.id}/${c.product.mainImage}`} 
                                    alt="product" className="main-image" style={{maxHeight: "200px"}} />
                                </Col>
                                <Col className="text-start">
                                    <h5 className="mb-3">
                                        <a href={"/p/" + c.product.alias}>
                                             {getShortName(c.product.name, 100)}
                                        </a>
                                    </h5>
                                    <CartItemQuantity
                                        quantity={c.quantity}
                                        price={c.product.price}
                                        discount={c.product.discountPrice}
                                        id={c.product.id}
                                        format={formatPrice}
                                        updateTotal={setTotal}
                                    />
                                </Col>
                            </Row>
                        )
                    }
                    
                </Col>
                <Col md={4}>
                    Checkout here
                    Estimated Total {formatPrice(total)}
                </Col>
            </Row>
        )
    }

    if(!auth?.accessToken) return <Navigate to="/login" />
    return ( 
        <>
            <Search />
            <h3 className="my-2">Your Shopping Cart</h3>
            {
                (array.length > 0)
                ? listCartItems()
                : <div>No items in the cart</div>
            }
        </>
     );
}
 
export default ShoppingCart;