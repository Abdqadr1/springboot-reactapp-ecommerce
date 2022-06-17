import { InputGroup, FormControl, Button, Form, ToastContainer, Toast } from "react-bootstrap";
import { useState, useRef,useEffect, useContext } from "react";
import {AuthContext} from "./custom_hooks/use-auth";
import axios from "axios";
import { useNavigate } from "react-router";
import { isTokenExpired, SPINNERS_BORDER_HTML, getDiscountPrice } from "./utilities";

const Stock = ({ id, quantity }) => {
    const url = `${process.env.REACT_APP_SERVER_URL}cart/add`;
    const [btnRef] = [useRef()];
    const {auth, setAuth} = useContext(AuthContext);
    const [showToast, setShowToast] = useState(null)
    const navigate = useNavigate();


    const handleSubmit = e => {
        e.preventDefault();
        if (!auth?.accessToken) {
            setShowToast(s => ({ ...s, show: true, message: "You're not logged in" }))
            return;
        }
        const data = new FormData(e.target);

        const btn = btnRef.current;
        btn.disabled = true;
        btn.innerHTML = SPINNERS_BORDER_HTML;
        axios.post(url,data, {
            headers: {
            "Authorization": `Bearer ${auth?.accessToken}`
            }
        })
        .then(() => {
            const cart = auth.cart > 0 ? auth.cart : auth.cart + 1;
            setAuth({ ...auth, cart })
            setShowToast(s => ({ ...s, show: true, message: "items added to shopping cart" }))
        })
        .catch(res => {
            console.error(res)
            if (isTokenExpired(res.response)) {
              setAuth(null); navigate("/login");
              return;
            }
            setShowToast(s => ({ ...s, show: true, message: res.response?.data.message }))
        }).finally(() => {
          btn.disabled = false;
          btn.textContent = "Add to Cart";
        })
    }

    return (
        <>
            <p className="fw-bold text-success">In Stock</p>
            <Form onSubmit={handleSubmit}>
                <QuantityNumber number={quantity} w="v" show={showToast} />
                <input name="product_id" type="hidden" value={id} />
                <Button ref={btnRef} variant="primary" type="submit">Add to Cart</Button> 
            </Form>
        </>
    );
}

const QuantityNumber = ({ number, w, show, fn }) => {
    const [quantity, setQuantity] = useState(number ?? 1);
    const [toast, setToast] = useState({ show: false, message: "" })

    useEffect(() => {
        setToast(s => ({ ...s, ...show }))
        if(number) setQuantity(number)
    }, [show, number])

    const add = (e, val) => {
        const number = quantity + val;
        if (number < 1 || number > 5) {
            setToast(s => ({...s, show:true, message: "Quantity can not be less than 1 or more than 5"}))
            return;
        }
        setQuantity(number);
        fn && fn(e, number);
    }
    return (
        <>
            <InputGroup className={`mb-3 ${w==='c' ? 'mx-0' : 'mx-auto'}`} style={{"maxWidth": "110px"}} >
                <InputGroup.Text onClick={e=>add(e,-1)}>-</InputGroup.Text>
                <FormControl name="quantity" aria-label="Number" value={quantity} onChange={null} className="text-center" maxLength="5" minLength="1" readOnly/>
                <InputGroup.Text onClick={e=>add(e,1)}>+</InputGroup.Text>
            </InputGroup>
            
            <ToastContainer className="p-3" position="middle-center" style={{"zIndex": "5000"}}>
                <Toast animation={true} bg="dark" show={toast.show} onClose={()=>setToast(s => ({...s,show:false}))} delay={3000} autohide>
                    <Toast.Body className="text-light fw-bold">{toast.message}</Toast.Body>
                </Toast>
            </ToastContainer> 
        </>
        
    );
}

const CartItemQuantity = ({ item, format, updateItem }) => {
    const url = `${process.env.REACT_APP_SERVER_URL}cart/update`;
    const [number, setNumber] = useState(Number(item.quantity))
    const [showToast, setShowToast] = useState(null)
    const {auth, setAuth} = useContext(AuthContext);
    const {discountPrice : discount, price, id:productId} = item.product;
    const realPrice = (discount > 0) ? getDiscountPrice(discount, price) : price;
    const navigate = useNavigate();
    const abortController = new AbortController();

    useEffect(() => {
        return() => {
            abortController.abort();
        }
    })
    

    const addItem = (e, val) => {
        const data = new FormData();
        data.set("quantity", val);
        data.set("product_id", productId);
        const oldNumber = number;
        const el = e.target;

        el.disabled = true;
        axios.post(url,data, {
            headers: {
                "Authorization": `Bearer ${auth?.accessToken}`
            },
            signal: abortController.signal
        })
        .then((res) => {
            item.quantity = val;
            item.subTotal = Number(res.data);
            updateItem(s => ([...s]));
            setNumber(val);
        })
        .catch(res => {
            console.error(res)
            setNumber(oldNumber)
            if (isTokenExpired(res.response)) {
              setAuth(null); navigate("/login");
              return;
            }
            setShowToast(s => ({ ...s, show: true, message: res.response?.data.message }))
        }).finally(()=>el.disabled = false)
    }

    return (
        <>
            <QuantityNumber w="c" number={number} show={showToast} fn={addItem} />
            {   (discount > 0) ? 
                <>
                    <div className="my-2">
                        x <span className="text-danger ">{format(realPrice)}</span>&nbsp;
                        <del>{format(price)}</del>
                    </div>
                    <div> = {format(realPrice * number)}</div>  
                </> :
                 <>
                    <div className="my-2"> x &nbsp; {format(price)}</div>
                    <div> = {format(price * number)}</div>
                </>
            }
        
        </>
    )
}

export {Stock, QuantityNumber, CartItemQuantity};