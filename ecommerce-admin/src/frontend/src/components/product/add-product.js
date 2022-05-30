import axios from "axios";
import {useEffect, useRef, useState } from "react";
import { Alert, Button, Col, Form, Modal, Row, Tab, Tabs } from "react-bootstrap";
import { Navigate, useNavigate } from "react-router-dom";
import TextEditor from "../text_editor"
import { isFileValid, isTokenExpired, showThumbnail, SPINNERS_BORDER_HTML } from "../utilities";
import useAuth from "../custom_hooks/use-auth";

const AddProduct = ({ showAddProduct, setShowAddProduct, addingProduct, brands }) => {
    const [{accessToken}] = useAuth()
    const navigate = useNavigate()
    const submitBtnRef = useRef();
    const url = process.env.REACT_APP_SERVER_URL + "product/add"

    const initialForm = {product_images: [], details: []}
    const [images, setImages] = useState([]);
    const [form, setForm] = useState(initialForm);
    const [shortDescription, setShortDescription] = useState("");
    const [fullDescription, setFullDescription] = useState("");
    const [categories, setCategories] = useState([]);

    const [nameRef, valueRef, formRef] = [useRef(), useRef(), useRef()];

    const [alert, setAlert] = useState({ show: false, message: "", variant: "success" });
    const alertRef = useRef();
    const toggleAlert = () => {
        setAlert({...alert, show: !alert.show})
    }

    
    const isDescriptionSet = (data) => {
        if (fullDescription === "" || shortDescription === "") {
            setAlert({ show: true, message: "Write descriptions", variant: "danger" });
            return false;
        } else {
            data.set("fullDescription", fullDescription);
            data.set("shortDescription", shortDescription);
        }
        return true;
    }

    const isImageAdded = (data) => {
        const product_images = form.product_images
        if(product_images.length === 0){
            setAlert({ show: true, message: "Add image(s)", variant: "danger" });
            return false;
        } else {
            data.delete("image");
            data.delete("extra_image");
            product_images.forEach((file, i) => {
                if(i===0) {
                    data.append("image", file);
                }else {
                    data.append("extra_image", file);
                }
            })
        }
        return true;
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        const data = new FormData(formRef.current);

        if(!isDescriptionSet(data)) return;
        if(!isImageAdded(data)) return;

        
        // for(const pair of data.entries()){
        //     console.log(pair[0] + ", " + pair[1])
        // }
        setAlert((state) => ({ ...state, show: false }));

        const button = submitBtnRef.current
        button.disabled=true
        button.innerHTML = SPINNERS_BORDER_HTML
        axios.post(url, data, {
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

     const handleSelectImage = (event, id=form.product_images.length) => {
        const input = event.target;
        const file = input.files[0]
        if (isFileValid(file, input)) {
            setForm(state => {
                state.product_images[id] = file;
                return {...state}
            })
            showThumbnail(file, setImages, "product-image", id);
        }
         console.log(id,form)
    }
    const handleClearImage = (id) => {
        const formImages = form.product_images.filter((file, i) => i !== id);
        const imgs = images.filter((img, i) => i !== id);
        setForm(state => ({...state, product_images: [...formImages]}));
        setImages(state => ([...imgs]))
    }

    const handleAddDetail  = () => {
        const nameInput = nameRef.current;
        const valueInput = valueRef.current;
        if(nameInput.value.length === 0){
            nameInput.setCustomValidity("Required");
            return;
        }else {nameInput.setCustomValidity("")}
        if(valueInput.value.length === 0){
            valueInput.setCustomValidity("Required");
            return;
        }else {valueInput.setCustomValidity("")}
        
        form.details[form.details.length] = {
            name: nameInput.value, value: valueInput.value
        };
        setForm(state => ({
            ...state,
            details: [...state.details]
        }))
        nameInput.value =""; valueInput.value="";
    }
    const handleRemoveDetail = (id) => { 
        setForm((state) => ({
          ...state,
          details: state.details.filter((d, i) => i !== id),
        }));
        console.log("removing.. " + id);
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
                <Form ref={formRef} className="add-user-form" onSubmit={handleSubmit}>
                    <Tabs defaultActiveKey="overview" id="uncontrolled-tab-example" className="mb-3">
                        <Tab eventKey="overview" title="Overview">
                            <Form.Group className="mb-3 row justify-content-center" controlId="name">
                                <Form.Label className="form-label">Product Name:</Form.Label>
                                <Form.Control name="name" required className="form-input" 
                                type="name" placeholder="Enter product name" />
                            </Form.Group>
                            <Form.Group className="mb-3 row justify-content-center" controlId="alias">
                                <Form.Label className="form-label">Alias:</Form.Label>
                                <Form.Control name="alias" className="form-input" type="text" placeholder="Enter alias" />
                            </Form.Group>
                            <Form.Group className="mb-3 row justify-content-center" controlId="brand">
                                <Form.Label className="form-label">Brand:</Form.Label>
                                <Form.Select name="brand" defaultValue="" required className="form-input">
                                    <option disabled hidden value="">Choose Brand</option>
                                    {brands.map(brand => <option key={brand.name} value={brand.id} onClick= {() => getCategories(brand.id)} >{brand.name}</option>)}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3 row justify-content-center" controlId="category">
                                <Form.Label className="form-label">Category:</Form.Label>
                                <Form.Select name="category" defaultValue="" required className="form-input">
                                    <option disabled hidden value="">Choose a brand first</option>
                                    {categories.map(cat => <option key={cat.name} value={cat.id}>{cat.name}</option>)}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3 row justify-content-center" controlId="enabled">
                                <Form.Label className="form-label">Enabled:</Form.Label>
                                <Form.Check name="enabled" required className="form-input ps-0" type="checkbox"/>
                            </Form.Group>
                            <Form.Group className="mb-3 row justify-content-center" controlId="inStock">
                                <Form.Label className="form-label">In Stock:</Form.Label>
                                <Form.Check name="inStock" required className="form-input ps-0" type="checkbox"/>
                            </Form.Group>
                            <Form.Group className="mb-3 row justify-content-center" controlId="cost">
                                <Form.Label className="form-label">Cost:</Form.Label>
                                <Form.Control name="cost" required className="form-input" type="number" placeholder="Enter cost" />
                            </Form.Group>
                            <Form.Group className="mb-3 row justify-content-center" controlId="price">
                                <Form.Label className="form-label">Price:</Form.Label>
                                <Form.Control name="price" required className="form-input" type="number" placeholder="Enter price" />
                            </Form.Group>
                            <Form.Group className="mb-3 row justify-content-center" controlId="discount">
                                <Form.Label className="form-label">Discount:</Form.Label>
                                <Form.Control name="discount" className="form-input" type="number" placeholder="Enter discount" />
                            </Form.Group>
                        </Tab>
                        <Tab eventKey="description" title="Description">
                            <h4>Short description</h4>
                            <TextEditor text={shortDescription} setText={setShortDescription} placeholder ="Short description..." />

                            <h4>Full description</h4>
                            <TextEditor text={fullDescription} setText={setFullDescription} placeholder="Full description..." />
                        </Tab>
                        <Tab eventKey="images" title="Images">
                            <Row className="justify-content-start">
                                {images.map((image,i) => (
                                    <Col key={i} md={4} className="border py-2">
                                        <h5 className="px-1 text-center d-flex justify-content-between">
                                            <span>{(i===0) ? "Main Image" : `Extra Image #${i}`}</span>
                                           <i title={`Remove image`} className="bi bi-x-circle-fill text-danger" onClick={()=>handleClearImage(i)}></i>
                                        </h5>
                                        {image}
                                    </Col>
                                ))}
                                <Col md={4} className="border py-2 row align-items-end justify-content-center">
                                    <label htmlFor="image" className="image-span bg-secondary">
                                        <i className="bi bi-image-fill"></i>
                                    </label>
                                    <Form.Control onChange={handleSelectImage} className="select-file" type="file" 
                                        accept="image/jpg, image/png, image/jpeg" id="image" />
                                </Col> 
                            </Row>
                        </Tab>
                        <Tab eventKey="details" title="Details">
                            {
                                form.details.map((detail, i) => (
                                    <Row key={i} className="mt-3">
                                        <Form.Group className="col-5 row justify-content-center" controlId="name">
                                            <Form.Label className="form-label fw-bold">Name:</Form.Label>
                                            <Form.Control name="detail_name" defaultValue={detail?.name} required className="form-input" maxLength={255} />
                                        </Form.Group>
                                        <Form.Group className="col-6 row justify-content-center" controlId="value">
                                            <Form.Label className="form-label fw-bold">Value:</Form.Label>
                                            <Form.Control name="detail_value" defaultValue={detail?.value} required className="form-input" maxLength={255} />
                                        </Form.Group>
                                        <Col>
                                            <i title={`Remove detail`} className="bi bi-x-circle-fill rm-detail" 
                                                onClick={() => handleRemoveDetail(i)}></i>
                                        </Col>
                                    </Row>
                                ))
                            }
                            
                             <Row className="mt-5">
                                <Form.Group className="col-5 row justify-content-center" controlId="name">
                                    <Form.Label className="form-label fw-bold">Name:</Form.Label>
                                    <Form.Control name="detail_name" ref={nameRef}  className="form-input" />
                                </Form.Group>
                                <Form.Group className="col-6 row justify-content-center" controlId="value">
                                    <Form.Label className="form-label fw-bold">Value:</Form.Label>
                                    <Form.Control name="detail_value" ref={valueRef} className="form-input" />
                                </Form.Group>
                            </Row>
                            <button className="btn btn-secondary mt-3" onClick={handleAddDetail} >Add Product detail</button>
                        </Tab>
                        <Tab eventKey="shipping" title="Shipping">
                            <h5 className="mb-5">
                              The following information is important to calculate the shipping cost of the product <br/>
                              The dimension (L x W x H) is for the box that is used to package the product - not the product
                            </h5>
                            <Form.Group className="mb-3 row justify-content-center" controlId="length">
                                <Form.Label className="form-label">Length (inch):</Form.Label>
                                <Form.Control name="length"  required className="form-input" type="number" placeholder="Enter length" />
                            </Form.Group>
                            <Form.Group className="mb-3 row justify-content-center" controlId="width">
                                <Form.Label className="form-label">Width (inch):</Form.Label>
                                <Form.Control name="width" required className="form-input" type="number" placeholder="Enter width" />
                            </Form.Group>
                            <Form.Group className="mb-3 row justify-content-center" controlId="height">
                                <Form.Label className="form-label">Height (inch):</Form.Label>
                                <Form.Control name="height"  required className="form-input" type="number" placeholder="Enter height" />
                            </Form.Group>
                            <Form.Group className="mb-3 row justify-content-center" controlId="weight">
                                <Form.Label className="form-label">Weight (pound):</Form.Label>
                                <Form.Control name="weight"  required className="form-input" type="number" placeholder="Enter weight" />
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