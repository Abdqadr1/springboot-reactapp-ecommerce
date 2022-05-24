import axios from "axios";
import {useEffect, useRef, useState } from "react";
import { Alert, Button, Form, Modal, Row, Tab, Tabs } from "react-bootstrap";
import { Navigate, useNavigate } from "react-router-dom";
import TextEditor from "../text_editor"
import { getAuth, getFormData, isFileValid, isTokenExpired, showThumbnail, SPINNERS_BORDER_HTML } from "../utilities";

const AddProduct = ({ showAddProduct, setShowAddProduct, addingProduct, brands }) => {
    const {accessToken} = getAuth()
    const navigate = useNavigate()
    const submitBtnRef = useRef();
    const url = process.env.REACT_APP_SERVER_URL + "product/add"
    const initialForm = {
        name:'', alias:'',shortDescription: '', fullDescription: '', brand:-1, 
        category:-1, enabled: false, inStock: false, cost: 0, price: 0, discount: 0,
        length: 0, width: 0, height: 0, weight: 0
    }
    const [form, setForm] = useState(initialForm);
    const [shortDescription, setShortDescription] = useState("");
    const [fullDescription, setFullDescription] = useState("");
    const [categories, setCategories] = useState([]);

    const [alert, setAlert] = useState({ show: false, message: "", variant: "success" });
    const alertRef = useRef();
    const toggleAlert = () => {
        setAlert({...alert, show: !alert.show})
    }

    const handleInput = (event) => {
        setForm({
            ...form,
            [event.target.id]: event.target.value
        })
    }
    const handleNumber = (event) => {
         setForm({
           ...form,
           [event.target.id]: Number(event.target.value),
         });
    }
    const handleToggle = (event) => {
        setForm({
            ...form,
            [event.target.id]: event.target.checked
        })
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        if(form.fullDescription === "" || form.shortDescription === ""){
            setAlert({show:true, message: "Write descriptions", variant: "danger"})
            return;
        }
        const data = getFormData(form)
        setAlert((state) => ({ ...state, show: false }));

        const button = submitBtnRef.current
        button.disabled=true
        button.innerHTML = SPINNERS_BORDER_HTML
        axios.post(url, form, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        })
            .then(response => {
                addingProduct(response.data);
                setAlert({ show: true, message: "Product saved!" })
            })
            .catch(error => { 
                const response = error.response
                if(isTokenExpired(response)) navigate("/login/2")
                else setAlert({show:true, message: response.data.message, variant: "danger"})
            }).finally(() => {
                button.disabled=false
                button.innerHTML = "Add Product"
            })
    }

    const getCategories = (id) => {
        const url = process.env.REACT_APP_SERVER_URL + "product/brand-cat/" + id;
        axios
          .get(url, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then((response) => {
              setCategories(response.data)
          })
          .catch((error) => {
            console.log(error.response);
          });
    };

    useEffect(() => {
        alertRef.current && alertRef.current.focus()
    }, [alert])

    const handleReset = () => {
        setForm(initialForm)
        setFullDescription("")
        setShortDescription("")
        setAlert(s => ({...s, show: false}));
    }
    
    if(!accessToken) return <Navigate to="/login/2" />
    return ( 
         
        <Modal show={showAddProduct} fullscreen={true} onHide={()=> setShowAddProduct(!showAddProduct)}>
            <Modal.Header closeButton>
                <Modal.Title>Add New Product</Modal.Title>
            </Modal.Header>
            <Modal.Body className="border product_modal_body">
                <Alert ref={alertRef} tabIndex={-1} variant={alert.variant} show={alert.show} dismissible onClose={toggleAlert}>
                    {alert.message}
                </Alert>
                <Form className="add-user-form" onSubmit={handleSubmit}>
                    <Tabs defaultActiveKey="overview" id="uncontrolled-tab-example" className="mb-3">
                        <Tab eventKey="overview" title="Overview">
                            <Form.Group className="mb-3 row justify-content-center" controlId="name">
                                <Form.Label className="form-label">Product Name:</Form.Label>
                                <Form.Control value={form.name} onInput={handleInput} required className="form-input" type="name" placeholder="Enter product name" />
                            </Form.Group>
                            <Form.Group className="mb-3 row justify-content-center" controlId="alias">
                                <Form.Label className="form-label">Alias:</Form.Label>
                                <Form.Control value={form.alias} onInput={handleInput} required className="form-input" type="text" placeholder="Enter alias" />
                            </Form.Group>
                            <Form.Group className="mb-3 row justify-content-center" controlId="brand">
                                <Form.Label className="form-label">Brand:</Form.Label>
                                <Form.Select defaultValue="0" required className="form-input" onChange={handleNumber}>
                                    <option disabled value="0">Choose Brand</option>
                                    {brands.map(brand => <option key={brand.name} value={brand.id} onClick= {() => getCategories(brand.id)} >{brand.name}</option>)}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3 row justify-content-center" controlId="category">
                                <Form.Label className="form-label">Category:</Form.Label>
                                <Form.Select defaultValue="0" required className="form-input" onChange={handleNumber}>
                                    <option disabled value="0">Choose a brand first</option>
                                    {categories.map(cat => <option key={cat.name} value={cat.id}>{cat.name}</option>)}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3 row justify-content-center" controlId="enabled">
                                <Form.Label className="form-label">Enabled:</Form.Label>
                                <Form.Check onChange={handleToggle} required className="form-input ps-0" type="checkbox"/>
                            </Form.Group>
                            <Form.Group className="mb-3 row justify-content-center" controlId="inStock">
                                <Form.Label className="form-label">In Stock:</Form.Label>
                                <Form.Check onChange={handleToggle} required className="form-input ps-0" type="checkbox"/>
                            </Form.Group>
                            <Form.Group className="mb-3 row justify-content-center" controlId="cost">
                                <Form.Label className="form-label">Cost:</Form.Label>
                                <Form.Control value={form.cost} onInput={handleNumber} required className="form-input" type="number" placeholder="Enter cost" />
                            </Form.Group>
                            <Form.Group className="mb-3 row justify-content-center" controlId="price">
                                <Form.Label className="form-label">Price:</Form.Label>
                                <Form.Control value={form.price} onInput={handleNumber} required className="form-input" type="number" placeholder="Enter price" />
                            </Form.Group>
                            <Form.Group className="mb-3 row justify-content-center" controlId="discount">
                                <Form.Label className="form-label">Discount:</Form.Label>
                                <Form.Control value={form.discount} onInput={handleNumber} required className="form-input" type="number" placeholder="Enter discount" />
                            </Form.Group>
                        </Tab>
                        <Tab eventKey="description" title="Description">
                            <h4>Short description</h4>
                            <TextEditor form={form} text={shortDescription} setText={setShortDescription}
                            name="shortDescription" placeholder ="Short description..." />

                            <h4>Full description</h4>
                            <TextEditor form={form} text={fullDescription} setText={setFullDescription} 
                            name="fullDescription" placeholder="Full description..." />
                        </Tab>
                        <Tab eventKey="images" title="Images">
                            <div>Images</div>
                        </Tab>
                        <Tab eventKey="details" title="Details">
                            <div>details</div>
                        </Tab>
                        <Tab eventKey="shipping" title="Shipping">
                            <h5 className="mb-5">
                              The following information is important to calculate the shipping cost of the product <br/>
                              The dimension (L x W x H) is for the box that is used to package the product - not the product
                            </h5>
                            <Form.Group className="mb-3 row justify-content-center" controlId="length">
                                <Form.Label className="form-label">Length (inch):</Form.Label>
                                <Form.Control value={form.length} onInput={handleNumber} required className="form-input" type="number" placeholder="Enter length" />
                            </Form.Group>
                            <Form.Group className="mb-3 row justify-content-center" controlId="width">
                                <Form.Label className="form-label">Width (inch):</Form.Label>
                                <Form.Control value={form.width} onInput={handleNumber} required className="form-input" type="number" placeholder="Enter width" />
                            </Form.Group>
                            <Form.Group className="mb-3 row justify-content-center" controlId="height">
                                <Form.Label className="form-label">Height (inch):</Form.Label>
                                <Form.Control value={form.height} onInput={handleNumber} required className="form-input" type="number" placeholder="Enter height" />
                            </Form.Group>
                            <Form.Group className="mb-3 row justify-content-center" controlId="weight">
                                <Form.Label className="form-label">Weight (pound):</Form.Label>
                                <Form.Control value={form.weight} onInput={handleNumber} required className="form-input" type="number" placeholder="Enter weight" />
                            </Form.Group>
                        </Tab>
                    </Tabs>
                    <Row className="justify-content-center">
                    <div className="w-25"></div>
                    <div className="form-input ps-0 my-3">
                        <Button ref={submitBtnRef} className="fit-content mx-1" variant="primary" type="submit">
                            Add Product
                        </Button>
                        <Button onClick={handleReset}  className="fit-content mx-1" variant="secondary" type="reset">
                            Clear
                        </Button>
                    </div>
                </Row>          
                </Form>
            </Modal.Body>
      </Modal>
     );
}
 
export default AddProduct;