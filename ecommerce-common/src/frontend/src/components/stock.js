import { InputGroup, FormControl, Button, Form, ToastContainer, Toast } from "react-bootstrap";
import { useState, useRef } from "react";
import useAuth from "./custom_hooks/use-auth";
import axios from "axios";
import { listFormData, isTokenExpired, SPINNERS_BORDER_HTML } from "./utilities";

const Stock = ({ product }) => {
    const url = `${process.env.REACT_APP_SERVER_URL}cart/add`;
    const [quantity, setQuantity] = useState(1);
    const [toast, setToast] = useState({ show: false, message: "" })
    const [btnRef] = [useRef()];
    const [auth,setAuth] = useAuth();

    const handleInput = e => {
        const number = Number(e.target.value)
        if (number < 1 || number > 5) {
            setToast(s => ({...s, show:true, message: "Quantity can not be less than 1 or more than 5"}))
            return;
        }
        setQuantity(number);
    }

    const add = val => {
        const number = quantity + val;
        if (number < 1 || number > 5) {
            setToast(s => ({...s, show:true, message: "Quantity can not be less than 1 or more than 5"}))
            return;
        }
        setQuantity(number);
    }

    const handleSubmit = e => {
        e.preventDefault();
        if (!auth?.accessToken) {
            setToast(s => ({ ...s, show: true, message: "You're not logged in" }))
            return;
        }
        const data = new FormData(e.target);
        listFormData(data)

        const btn = btnRef.current;
        btn.disabled = true;
        btn.innerHTML = SPINNERS_BORDER_HTML;
        axios.post(url,data, {
            headers: {
            "Authorization": `Bearer ${auth?.accessToken}`
            }
        })
        .then(response => {
          const data = response.data;
            setAuth({ ...auth, cart: data })
            window.location.reload();
        })
        .catch(res => {
          console.error(res)
          if (isTokenExpired(res.response)) {
              setAuth({})
                window.location.reload();
          }
        }).finally(() => {
          btn.disabled = false;
          btn.textContent = "Add to Cart";
        })
    }

    return (
        <>
        <p className="fw-bold text-success">In Stock</p>
        <Form onSubmit={handleSubmit}>
            <InputGroup className="mb-3 mx-auto" style={{"maxWidth": "110px"}} >
                <InputGroup.Text onClick={e=>add(-1)}>-</InputGroup.Text>
                <FormControl name="quantity" aria-label="Number" value={quantity} onChange={handleInput} className="text-center" maxLength="5" minLength="1" />
                <InputGroup.Text onClick={e=>add(1)}>+</InputGroup.Text>
            </InputGroup>
            <input name="product_id" type="hidden" value={product.id} />
            <Button ref={btnRef} variant="primary" type="submit">Add to Cart</Button> 
        </Form>
        
        <ToastContainer className="p-3" position="middle-center" style={{"zIndex": "5000"}}>
            <Toast animation={true} bg="dark" show={toast.show} onClose={()=>setToast(s => ({...s,show:false}))} delay={3000} autohide>
                <Toast.Body className="text-light fw-bold">{toast.message}</Toast.Body>
            </Toast>
        </ToastContainer>
        </>
    );
}
 
export default Stock;