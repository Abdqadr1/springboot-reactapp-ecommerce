import useArray from "./custom_hooks/use-array";
import {AuthContext} from "./custom_hooks/use-auth";
import { useEffect, useState,useContext, useMemo, useCallback,useRef } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { getShortName, isTokenExpired,formatPrice,SPINNERS_BORDER } from "./utilities";
import Search from "./search";
import { Row, Col} from "react-bootstrap";
import {CartItemQuantity} from "./stock";
import useSettings from "./use-settings";
import DeleteModal from "./delete_modal";
import CustomToast from "./custom_toast";
import { Link } from "react-router-dom";

const ShoppingCart = () => {
    const navigate = useNavigate();
    const url = process.env.REACT_APP_SERVER_URL + "cart";
    const viewURL = `${url}/view`;
    const deleteURL = `${url}/remove`;
    const [isLoading, setLoading] = useState(true);
    const {auth, setAuth} = useContext(AuthContext);
    const { array, setArray, filterArray } = useArray([]);
    const [variables, setVariables] = useState({usePrimaryAddress: false, addressSupported: false})
    const [showDelete, setShowDelete] = useState({show:false, id:-1})
    const [toast, setToast] = useState({ show: false, message: "" })
    let abortController = useRef(new AbortController()); 
    const { CURRENCY_SYMBOL, CURRENCY_SYMBOL_POSITION, DECIMAL_DIGIT, THOUSANDS_POINT_TYPE, SITE_NAME } = useSettings();

    useEffect(()=>{document.title = `Shopping Cart - ${SITE_NAME}`},[SITE_NAME])
    function priceFormatter() {
        return (price) =>
            formatPrice(price, CURRENCY_SYMBOL, DECIMAL_DIGIT, THOUSANDS_POINT_TYPE, CURRENCY_SYMBOL_POSITION)
    }
    const loadCart = useCallback((abortController) => {
        setLoading(true);
        axios.get(viewURL, {
            headers: {
                "Authorization": `Bearer ${auth?.accessToken}`,
            },
            signal: abortController.signal
        })
            .then(response => {
                const { items, addressSupported, usePrimaryAddress } = response.data;
                setArray(items);
                setVariables({ addressSupported, usePrimaryAddress })
            })
            .catch(res => {
                if (isTokenExpired(res?.response)) {
                    setAuth(null); navigate("/login");
                }
                const message = res.response?.data.message ?? "Could not fetch cart items";
                setToast(s => ({ ...s, show: true, message }))
            }).finally(() => setLoading(false));
      },[auth?.accessToken, navigate, setArray, setAuth, viewURL],
    )
    
    useEffect(() => {
        abortController.current = new AbortController();
        loadCart(abortController.current);
        return () => {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            abortController.current?.abort();
        }
    }, [loadCart])


    const total = useMemo(() => {
        let total = 0;
        total = array.map(c => c.subtotal).reduce((tot, num) => tot + num, total);
        return total;
    }, [array])

    function handleDelete() {
        const index = showDelete.id
        const item = array[index];

         axios.delete(`${deleteURL}/${item.product.id}`, {
                headers: {
                    "Authorization": `Bearer ${auth?.accessToken}`
                },
                signal: abortController.current.signal
            })
            .then(response => {
                const data = response.data;
                setAuth({ ...auth, cart: --auth.cart })
                filterArray(index)
                setToast(s=> ({...s, show:true, message: data}))
            })
            .catch(res => {
                if (isTokenExpired(res.response)) {
                    setAuth(null); navigate("/login");
                }
                alert(res.response?.data.message)
            }).finally(() => setShowDelete(s=>({...s, show:false})))
    }


    function listCartItems() {
        const formatPrice = priceFormatter();
        return (
            <Row className="mx-0 justify-content-start">
                <Col md={8}>
                    {
                        array.map((c,i) =>
                            <Row className="mx-0 my-2 border rounded px-2 py-3" key={i}>
                                <Col>
                                    <div
                                        style={{ width: "7%" }}
                                        className="fw-bold"
                                        onClick={() => setShowDelete(s=>({show:true, id: i}))}
                                    >
                                        <span className="d-block">{i+1}</span>
                                        <i className="bi bi-trash3-fill text-danger d-block"></i>
                                    </div>
                                    <img src={c.product.mainImagePath} 
                                    alt="product" className="main-image" style={{maxHeight: "200px"}} />
                                </Col>
                                <Col className="text-start">
                                    <h5 className="mb-3">
                                        <Link to={"/p/" + c.product.alias}>
                                             {getShortName(c.product.name, 100)}
                                        </Link>
                                    </h5>
                                    <CartItemQuantity
                                        item={c}
                                        format={formatPrice}
                                        updateItem={setArray}
                                    />
                                </Col>
                            </Row>
                        )
                    }
                    
                </Col>
                <Col md={4} className="text-start text-md-center mt-4">
                    <div>Estimated Total :</div>
                    <h4 className="my-2 fw-bold">{formatPrice(total)}</h4>
                    {
                        (variables.addressSupported)
                            ? <Link to="/checkout" className="btn btn-danger my-2" variant="danger">Checkout</Link>
                            : <>
                                <p className="fw-bold text-warning">No shipping available for your location</p>
                                {
                                    (variables.usePrimaryAddress)
                                        ? <Link className="fw-bold " to="/addresses?r=shopping_cart">Update your address</Link>
                                        : <Link className="fw-bold " to="/addresses?r=shopping_cart">Use another shipping address</Link>
                                
                            }
                            </>
                    }
                    
                </Col>
            </Row>
        )
    }

    if (!auth?.accessToken) navigate("/login");
    return (
        <>
            {
                (isLoading)
                    ? <div className="mx-auto" style={{ height: "30vh", display: "grid" }}>{SPINNERS_BORDER}</div>
                    :  
                    <>
                        <Search />
                        <h3 className="my-2">Your Shopping Cart</h3>
                        {
                            (array.length > 0)
                            ? listCartItems()
                            : <div className="mt-5">
                                <h4 className="my-3 px-3">You have not chosen any product yet</h4>
                                <a href="/" className="d-block mx-auto my-3 fs-3">
                                    <i className="bi bi-cart-plus-fill text-secondary" style={{fontSize: "5em"}}></i><br/>
                                    Go shopping
                                </a>
                            </div>
                        }
                        <DeleteModal deleteObject={showDelete} setDeleteObject={setShowDelete} deletingFunc={handleDelete} type="Item" />
                        <CustomToast {...toast} setToast={setToast} position="bottom-end" />
                    </>
            }
        </>
     );
}
 
export default ShoppingCart;