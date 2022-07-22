import axios from "axios";
import {useEffect, useRef, useState } from "react";
import { Alert, Button, Col, Form, Modal, Row, Tab, Tabs } from "react-bootstrap";
import { Navigate, useNavigate } from "react-router-dom";
import TextEditor from "../text_editor"
import { isFileValid, isTokenExpired, showThumbnail, SPINNERS_BORDER_HTML } from "../utilities";
import useAuth from "../custom_hooks/use-auth";

const UpdateProduct = ({ updateProduct, setUpdateProduct, updatingProduct, brands }) => {
    const product = updateProduct?.product;
    const [{accessToken}] = useAuth()
    const navigate = useNavigate()
    const submitBtnRef = useRef();
    const url = process.env.REACT_APP_SERVER_URL + "product/edit";

    const initialForm = {product_images: [], savedImages:[], details: product?.details ?? [], main_image: ""}
    const [form, setForm] = useState(initialForm);
    const [mainImage, setMainImage] = useState("");
    const [images, setImages] = useState([]);
    const [shortDescription, setShortDescription] = useState("");
    const [fullDescription, setFullDescription] = useState("");
    const [categories, setCategories] = useState([]);

    const [nameRef, valueRef, formRef] = [useRef(), useRef(), useRef()];

    const [alert, setAlert] = useState({ show: false, message: "", variant: "success" });
    const alertRef = useRef();
    const toggleAlert = () => {
        setAlert({...alert, show: !alert.show})
    }

    const hideModal = () => setUpdateProduct(state => ({...state, show:false}));

    
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
        data.delete("main_image");
        data.delete("extra_image");
        data.delete("saved_image");
        if(form.main_image instanceof File){
            data.set("main_image", form.main_image);
        }
        form.product_images.forEach(img => data.append("extra_image", img))
        form.savedImages.forEach(img => data.append("saved_image", `${img.id}<>${img.path}`))
        return true;
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        const data = new FormData(formRef.current);

        if(!isDescriptionSet(data)) return;
        if(!isImageAdded(data)) return;
        
        // listFormData(data);

        setAlert((state) => ({ ...state, show: false }));
        const button = submitBtnRef.current
        button.disabled = true
        const text = button.textContent;
        button.innerHTML = SPINNERS_BORDER_HTML
        axios.post(`${url}/${product.id}`, data, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        })
            .then(response => {
                updatingProduct(response.data);
                setAlert({ show: true, message: "Product saved!" })
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
        if(product){
            setAlert(state => ({...state, show: false}))
            setForm(state => ({
                product_images: [],
                main_image: "",
                details: product?.details,
                savedImages: product?.extraImages
            }));
            setShortDescription(product.shortDescription);
            setFullDescription(product.fullDescription); 
        }
    }, [product])

    useEffect(() => {
        alertRef.current && alertRef.current.focus()
    }, [alert])

    const handleReset = () => {
        formRef.current.reset();
        setForm(initialForm)
        setImages([])
        setFullDescription("")
        setShortDescription("")
        setAlert(s => ({...s, show: false}));
    }

    const handleSelectImage = (event, type) => {
        const input = event.target;
        const file = input.files[0]
        if(type === "m") {
            if (isFileValid(file, input)) {
              setForm((state) => {
                state.main_image = file;
                return { ...state };
              });
              showThumbnail(file, setMainImage, "thumbnail", null, "product-image");
            }
        } else {
            if (isFileValid(file, input)) {
                setForm(state => ({...state, product_images:[...state.product_images, file]}))
                showThumbnail(file, setImages, "product-image", images.length);
            }
        }
    }
    const handleClearImage = (type, id) => {
        if(type === "m"){
            setMainImage("");
            setForm(state => ({...state, main_image: ""}))
        }else if(type === "e") {
            const formImages = form.product_images.filter((file, i) => i !== id);
            const imgs = images.filter((img, i) => i !== id);
            setForm(state => ({...state, product_images: [...formImages]}));
            setImages([...imgs])
        } else {
            const imgs = form.savedImages.filter((f, i) => i !== id);
            setForm(state => ({...state, savedImages: [...imgs]}))
        }
       
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
    const handleDetail = (event, i) => {
        const value = event.target.value;
        const which = event.target.id;
        const detail = form.details[i];
        detail[which] = value;
        setForm(state => ({
            ...state, details: [...state.details]
        }))

    }
    const handleRemoveDetail = (id) => { 
        setForm((state) => ({
          ...state,
          details: state.details.filter((d, i) => i !== id),
        }));
        console.log("removing.. " + id);
    }

    const listExtraImages = () => {
        let saved=[]; let selected=[]
        if(form.savedImages.length > 0){
            saved = form.savedImages.map((img, i) => (
                <Col key={'saved'+i} md={4} className="border py-2">
                    <h5 className="px-1 text-center d-flex justify-content-between">
                        <span>{`Extra image #${i+1}`}</span>
                        <i title={`Remove image`} className="bi bi-x-circle-fill text-danger" onClick={()=>handleClearImage("s",i)}></i>
                    </h5>
                    <img src={img.imagePath}  alt="product" className="product-image" />
                </Col>
            ))
        }
        if(form.product_images.length > 0){
            selected =images.map((image,i) => (
                <Col key={'new_extra'+i} md={4} className="border py-2">
                    <h5 className="px-1 text-center d-flex justify-content-between">
                        <span>{`New image #${i+1}`}</span>
                        <i title={`Remove image`} className="bi bi-x-circle-fill text-danger" onClick={()=>handleClearImage("e",i)}></i>
                    </h5>
                    {image}
                </Col>
            ))
        }
        return [...saved, ...selected];
    }

    const listMainImage = () => {
        if(form.main_image instanceof File){
            return (<Col md={4} className="border py-2">
                    <h5 className="px-1 text-center d-flex justify-content-between">
                        <span>Main image</span>
                        <i title={`Remove image`} className="bi bi-x-circle-fill text-danger" onClick={()=>handleClearImage("m")}></i>
                    </h5>
                    {mainImage}
                </Col>)
        } else {
            return (
                <Col md={4} className="border py-2">
                    <h5 className="px-1 text-center">Main image</h5>
                    <img src={product?.mainImagePath}  alt="product" className="product-image" />
                </Col>)
        }
    }

    const listDetails = () => {
        return form.details.map((detail, i) => (
                <Row key={i} className="mt-3 justify-content-between">
                    <Form.Group className="col-11 col-md-5 row justify-content-center" controlId="name">
                        <Form.Label className="form-label fw-bold">Name:</Form.Label>
                        <Form.Control name="detail_name" value={detail?.name} onChange={e=>handleDetail(e, i)} required className="form-input" maxLength={255} />
                    </Form.Group>
                    <Form.Group className="col-10 col-md-5 row justify-content-center mt-2 mt-md-0" controlId="value">
                        <Form.Label className="form-label fw-bold">Value:</Form.Label>
                        <Form.Control name="detail_value" value={detail?.value} onChange={e=>handleDetail(e, i)} required className="form-input" maxLength={255} />
                    </Form.Group>
                    <Col>
                        <i title={`Remove detail`} className="bi bi-x-circle-fill rm-detail" 
                            onClick={() => handleRemoveDetail(i)}></i>
                    </Col>
                </Row>
            ))
    }
    
    if(!accessToken) return <Navigate to="/login/2" />
    return ( 
         
        <Modal show={updateProduct.show} fullscreen={true} onHide={hideModal}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Product (ID : {product?.id})</Modal.Title>
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
                                <Form.Control defaultValue={product?.name} name="name" required className="form-input" 
                                type="name" placeholder="Enter product name" />
                            </Form.Group>
                            <Form.Group className="mb-3 row justify-content-center" controlId="alias">
                                <Form.Label className="form-label">Alias:</Form.Label>
                                <Form.Control defaultValue={product?.alias} name="alias" className="form-input" type="text" placeholder="Enter alias" />
                            </Form.Group>
                            <Form.Group className="mb-3 row justify-content-center" controlId="brand">
                                <Form.Label className="form-label">Brand:</Form.Label>
                                <Form.Select name="brand" defaultValue={product?.brand.id} required className="form-input">
                                    {brands.map(brand => <option key={brand.name} value={brand.id} onClick= {() => getCategories(brand.id)} >{brand.name}</option>)}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3 row justify-content-center" controlId="category">
                                <Form.Label className="form-label">Category:</Form.Label>
                                <Form.Select defaultValue={product?.category.id} name="category" required className="form-input">
                                    <option value={product?.category.id}>{product?.category.name}</option>
                                    {categories.map(cat => <option key={cat.name} value={cat.id}>{cat.name}</option>)}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3 row justify-content-center" controlId="enabled">
                                <Form.Label className="form-label">Enabled:</Form.Label>
                                <Form.Check name="enabled" className="form-input ps-0" type="checkbox" defaultChecked={product?.enabled} />
                            </Form.Group>
                            <Form.Group className="mb-3 row justify-content-center" controlId="inStock">
                                <Form.Label className="form-label">In Stock:</Form.Label>
                                <Form.Check name="inStock" className="form-input ps-0" type="checkbox" defaultChecked={product?.inStock} />
                            </Form.Group>
                            <Form.Group className="mb-3 row justify-content-center" controlId="cost">
                                <Form.Label className="form-label">Cost:</Form.Label>
                                <Form.Control defaultValue={product?.cost} name="cost" step="0.01" required className="form-input" type="number" placeholder="Enter cost" />
                            </Form.Group>
                            <Form.Group className="mb-3 row justify-content-center" controlId="price">
                                <Form.Label className="form-label">Price:</Form.Label>
                                <Form.Control defaultValue={product?.price} name="price" step="0.01" required className="form-input" type="number" placeholder="Enter price" />
                            </Form.Group>
                            <Form.Group className="mb-3 row justify-content-center" controlId="discount">
                                <Form.Label className="form-label">Discount:</Form.Label>
                                <Form.Control defaultValue={product?.discountPrice} name="discountPrice" step="0.01" className="form-input" type="number" placeholder="Enter discount" />
                            </Form.Group>
                        </Tab>
                        <Tab eventKey="description" title="Description">
                            <h4>Short description</h4>
                            <TextEditor height="big-height" text={product?.shortDescription ?? ""} setText={setShortDescription} placeholder ="Short description..." />

                            <h4>Full description</h4>
                            <TextEditor height="big-height" text={product?.fullDescription ?? ""} setText={setFullDescription} placeholder="Full description..." />
                        </Tab>
                        <Tab eventKey="images" title="Images">
                            {/* main image row */}
                            <Row className="justify-content-start px-2 py-1 my-3 border-bottom">
                                {listMainImage()}
                                <Col md={4} className="border py-2 row align-items-end justify-content-center">
                                    <label htmlFor="main_image" className="image-span bg-secondary">
                                        <i className="bi bi-image-fill"></i>
                                    </label>
                                    <Form.Control onChange={e=>handleSelectImage(e,"m")} className="select-file" type="file" 
                                        accept="image/jpg, image/png, image/jpeg" id="main_image" />
                                </Col> 
                            </Row>
                                {/* extra images row */}
                            <Row className="justify-content-start px-2 my-3 py-1 border-bottom">
                                {listExtraImages()}

                                <Col md={4} className="border py-2 row align-items-end justify-content-center">
                                    <label htmlFor="extra_image" className="image-span bg-secondary">
                                        <i className="bi bi-image-fill"></i>
                                    </label>
                                    <Form.Control onChange={e=>handleSelectImage(e,"e")} className="select-file" type="file" 
                                        accept="image/jpg, image/png, image/jpeg" id="extra_image" />
                                </Col> 
                            </Row>
                        </Tab>
                        <Tab eventKey="details" title="Details">
                            {listDetails()}
                            
                             <Row className="mt-5">
                                <Form.Group className="col-12 col-md-6 row justify-content-center" controlId="name">
                                    <Form.Label className="form-label fw-bold">Name:</Form.Label>
                                    <Form.Control name="detail_name" ref={nameRef}  className="form-input" />
                                </Form.Group>
                                <Form.Group className="col-12 col-md-6 row justify-content-center" controlId="value">
                                    <Form.Label className="form-label fw-bold">Value:</Form.Label>
                                    <Form.Control name="detail_value" ref={valueRef} className="form-input" />
                                </Form.Group>
                            </Row>
                            <button type="button" className="btn btn-secondary my-3" onClick={handleAddDetail} >Add Product detail</button>
                        </Tab>
                        <Tab eventKey="shipping" title="Shipping">
                            <h5 className="mb-5">
                              The following information is important to calculate the shipping cost of the product <br/>
                              The dimension (L x W x H) is for the box that is used to package the product - not the product
                            </h5>
                            <Form.Group className="mb-3 row justify-content-center" controlId="length">
                                <Form.Label className="form-label">Length (inch):</Form.Label>
                                <Form.Control defaultValue={product?.length} name="length" step="0.01"  required className="form-input" type="number" placeholder="Enter length" />
                            </Form.Group>
                            <Form.Group className="mb-3 row justify-content-center" controlId="width">
                                <Form.Label className="form-label">Width (inch):</Form.Label>
                                <Form.Control defaultValue={product?.width} name="width" step="0.01" required className="form-input" type="number" placeholder="Enter width" />
                            </Form.Group>
                            <Form.Group className="mb-3 row justify-content-center" controlId="height">
                                <Form.Label className="form-label">Height (inch):</Form.Label>
                                <Form.Control defaultValue={product?.height} name="height" step="0.01"  required className="form-input" type="number" placeholder="Enter height" />
                            </Form.Group>
                            <Form.Group className="mb-3 row justify-content-center" controlId="weight">
                                <Form.Label className="form-label">Weight (pound):</Form.Label>
                                <Form.Control defaultValue={product?.weight} name="weight" step="0.01"  required className="form-input" type="number" placeholder="Enter weight" />
                            </Form.Group>
                        </Tab>
                    </Tabs>
                    <div className="d-flex flex-wrap justify-content-center mt-5">
                        <Button ref={submitBtnRef} className="fit-content mx-1" variant="primary" type="submit">
                            Save
                        </Button>
                        <Button onClick={handleReset}  className="fit-content mx-1" variant="secondary" type="reset">
                            Clear
                        </Button>
                    </div>   
                </Form>
            </Modal.Body>
      </Modal>
     );
}
 
export default UpdateProduct;