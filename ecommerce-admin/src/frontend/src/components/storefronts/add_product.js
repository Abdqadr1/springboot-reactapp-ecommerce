import { Modal, Alert, Form, Button, FloatingLabel } from "react-bootstrap";
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import useAuth from "../custom_hooks/use-auth";
import { isTokenExpired, listFormData, SPINNERS_BORDER_HTML,formatPrice } from "../utilities";
import useSettings from "../custom_hooks/use-settings";
import ProductSearchModal from "../orders/product_search_modal";
import axios from "axios";

const ProductStorefront = ({data, setData, updateStorefront}) => {
    const obj = {...data.storefront};
    const [form, setForm] = useState({});
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [showAddProduct, setShowAddProduct] = useState(false)
    const url = process.env.REACT_APP_SERVER_URL + "storefront/"+data.type?.toLowerCase();
    const [{ accessToken }] = useAuth();
    const navigate = useNavigate();
    const [alert, setAlert] = useState({ show: false, message: "", variant: "success" });
    const [alertRef] = [useRef()];
    const abortController = useRef(new AbortController());
    const toggleAlert = () => {
        setAlert({...alert, show: !alert.show})
    }

    useEffect(() => {
        if(obj.article) obj.article = obj.article.id;
        setForm(obj);
        if(obj?.models){
            const cats = obj.models.map(m => m.product);
            setSelectedProducts([...cats]);
        }else{
            setSelectedProducts([])
        }
        
        setAlert(s => ({ ...s, show: false }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data.show]);
         
    const { CURRENCY_SYMBOL, CURRENCY_SYMBOL_POSITION, DECIMAL_DIGIT, THOUSANDS_POINT_TYPE } = useSettings();

    function priceFormatter() {
        return (price) =>
            formatPrice(price, CURRENCY_SYMBOL, DECIMAL_DIGIT, THOUSANDS_POINT_TYPE, CURRENCY_SYMBOL_POSITION)
    }
    
    useEffect(() => {
        alertRef.current && alertRef.current.focus()
    }, [alert, alertRef]);

    const addToForm = (data) =>{
        data.delete("selected")
        selectedProducts.forEach(v => {
            data.append("selected", v.id);
        });
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if(selectedProducts.size < 1) {
            setAlert(s => ({...s, show:true, message: "choose products"}));
            return;
        }
        const target = event.target
        const formData = new FormData(target);
        addToForm(formData);
        
        listFormData(formData);

        setAlert(state => ({ ...state, show: false }));
        const button = target.querySelector("button#submit");
        button.disabled = true
        const text = button.textContent;
        button.innerHTML = SPINNERS_BORDER_HTML;
        const path = url + "/"+data.which;
        axios.post(path, formData, {
            headers: {
                "Authorization": `Bearer ${accessToken}`,
            }, 
            signal: abortController.current.signal
        })
            .then(response => {
                updateStorefront(response.data, data.type.toLowerCase());
                setAlert({ show: true, message: "Storefront saved!" })
            })
            .catch(error => { 
                const response = error.response
                if(isTokenExpired(response)) navigate("/login/2")
                else setAlert({show:true, message: response.data.message, variant: "danger"})
            }).finally(() => {
                button.disabled=false
                button.innerHTML = text;
            })
    }

    const handleInput  = e => {
        const id = e.target.id;
        let value = (id === "enabled") ? e.target.checked : e.target.value;
        setForm(s=> ({
            ...s, 
            [id]: value
        }))
    }
    const handleDelete = (id) => {
        const s = selectedProducts.filter(v => v.id !== id);
        setSelectedProducts([...s]);
    }
    const selectHandler = p => {
        setShowAddProduct(false);
        if(!selectedProducts.some(a => a.id === p.id)){
            setSelectedProducts(s=> ([...s, p]));
        }
    } 
    
    const handleMove = (index, dir) => {
        let newIndex = dir === "up" ? index - 1 : index + 1;
        if(newIndex < 0 || newIndex >= selectedProducts.length) return;
        const el = selectedProducts[index];
        const el1 = selectedProducts[newIndex];
        selectedProducts[index] = el1;
        selectedProducts[newIndex] = el;
        setSelectedProducts(s=>([...s]));
    }

    const hideModal = () => {
        setData({...data, show: false})
    }
     return ( 
        <>
        <Modal show={data.show} fullscreen={true} onHide={hideModal}>
            <Modal.Header closeButton>
                <Modal.Title>
                    {
                        (data.type === "New") 
                        ? `New Product section` 
                        :`Edit Product section`
                    }
                    
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="border article-modal-body">
                <Alert ref={alertRef} tabIndex={-1} variant={alert.variant} show={alert.show} dismissible onClose={toggleAlert}>
                    {alert.message}
                </Alert>
                <Form onSubmit={handleSubmit}>
                    {
                        (data.type !== "New") &&  <>
                            <input type="hidden" name="id" value={form?.id ?? ""}/>
                        </>
                    }
                    <Form.Group className="my-4 row justify-content-center mx-0" controlId="heading">
                        <Form.Label className="form-label">Heading:</Form.Label>
                        <Form.Control onChange={handleInput} value={form?.heading ?? ""} name="heading" required className="form-input"/>
                    </Form.Group>
                    <Form.Group className="my-4 row justify-content-center mx-0" controlId="description">
                        <Form.Label className="form-label">Description:</Form.Label>
                            <FloatingLabel
                                controlId="description"
                                className="mb-1 form-input px-0"
                            >
                                <Form.Control style={{ height: 'fit-content' }} className="py-1" as="textarea" 
                                name="description" value={form?.description ?? ""} onChange={handleInput} required/>
                            </FloatingLabel>
                    </Form.Group>
                    <Form.Group className="my-4 row justify-content-center mx-0" controlId="enabled">
                        <Form.Label className="form-label">Enabled:</Form.Label>
                        <Form.Check onChange={handleInput} checked={form?.enabled ?? ""} name="enabled" className="form-input ps-0"/>
                    </Form.Group>
                    <Form.Group className="my-4 row justify-content-center mx-0" controlId="heading">
                        <Form.Label className="form-label">Products:</Form.Label>
                        <div className="form-input px-0">
                            <Button onClick={()=>setShowAddProduct(true)} variant="success" className="fit-content my-2">Add Product</Button>
                        </div>
                    </Form.Group>
                    <div className="d-flex flex-wrap mt-2 px-0">
                        {selectedProducts.map((c, i) => (
                            <div className="px-0 my-1 mx-3" key={i} data-index={i} value={c.id}>
                                 <div className="d-flex flex-wrap justify-content-between px-2">
                                    <i onClick={()=>handleDelete(c.id)} className="bi bi-archive-fill fs-5 me-1" title="remove item"></i>
                                    <i onClick={()=>handleMove(i,'up')} className="bi bi-chevron-left fs-5 mx-2 fw-bold" title="move selected item up"></i>
                                    <i onClick={()=>handleMove(i,'down')} className="bi bi-chevron-right fs-5 mx-2 fw-bold" title="move selected item down"></i>
                                </div>
                                <img src={c.mainImagePath} alt={c.name}style={{width: '150px', aspectRatio: 1}} />
                                <div style={{maxWidth:'150px'}}>{c.name}</div>
                            </div>)
                        )}
                       
                    </div>
                    <div className="d-flex flex-wrap justify-content-center">
                        <Button id="submit" className="fit-content mx-auto" variant="primary" type="submit">
                            Save
                        </Button>
                    </div>
                    
                </Form>
            </Modal.Body>
        </Modal>
        <ProductSearchModal show={showAddProduct} setShow={setShowAddProduct} priceFunction={priceFormatter()} selectHandler={selectHandler} />
    </>
     );
}
 
export default ProductStorefront;