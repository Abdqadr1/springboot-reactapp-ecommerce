import axios from "axios";
import {useEffect, useRef, useState } from "react";
import { Alert, Button, Form, Modal, Row, Badge } from "react-bootstrap";
import { Navigate, useNavigate } from "react-router-dom";
import useAuth from "../custom_hooks/use-auth";
import { getFormData, isFileValid, isTokenExpired, showThumbnail, SPINNERS_BORDER_HTML } from "../utilities";

const UpdateBrand = ({ updateBrand, setUpdateBrand, updatingBrand, categories }) => {
    const navigate = useNavigate()
    const brand = updateBrand.brand;
    const url = process.env.REACT_APP_SERVER_URL + "brand/edit/" + brand.id;
    const initialForm = {
        name:'', photo: null, categories: []
    }

    const [{ accessToken }] = useAuth();

    const [form, setForm] = useState({...initialForm});
    const [alert, setAlert] = useState({ show: false, message: "", variant: "success" });
    const [image, setImage] = useState(<label htmlFor="photo" className="ms-0 w-50 person-span mt-3 cursor-pointer bg-secondary">
                                            <i className="bi bi-image-fill"></i>
                                        </label>);
    const alertRef = useRef();
    const submitBtnRef = useRef();
    const categoriesRef = useRef();
    const [chosenCat, setChosenCat] = useState([]);
    const toggleAlert = () => setAlert({ ...alert, show: !alert.show })
    
    const hideModal = () => {
        setUpdateBrand({...updateBrand, show: false})
    }

    const handleInput = (event) => {
        setForm({
            ...form,
            [event.target.id]: event.target.value
        })
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        const data = getFormData(form)
        setAlert(state => ({...state, show:false}))
        
        const button = submitBtnRef.current
        button.disabled=true
        button.innerHTML = SPINNERS_BORDER_HTML
        axios.post(url, data, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        }).then(response => {
            setAlert({ show: true, message: "brand updated!" })
            updatingBrand(response.data)
        })
        .catch(error => { 
            const response = error.response
            if(isTokenExpired(response)) navigate("/login/2")  
            else setAlert({show:true, message: response.data.message, variant: "danger"})
        }).finally(() => {  
            button.disabled=false
            button.innerHTML = "Update Brand"
        })
    }

    const handleSelectImage = (event) => {
        const input = event.target;
        const file = input.files[0]
        if (isFileValid(file, input)) {
            setForm(state => ({...state, image:file}))
            showThumbnail(file, setImage);
        }
        
    }
    
    useEffect(() => {
        const currentBrand = updateBrand.brand;
        if (currentBrand.id) {
            if (!form.id || currentBrand.id) {
                setForm(() => {
                    let newState = { ...currentBrand }
                    newState.categories = currentBrand.categories.map(b => b.id);
                    return newState;
                });
                setChosenCat(() => {
                    return currentBrand.categories.map(cat => cat.name);
                })
                const fileURI = process.env.REACT_APP_SERVER_URL + "brand-photos/";
                const img = currentBrand.photo && currentBrand.photo !== "null" && currentBrand.photo !== "default.png"
                    ? <img src={`${fileURI}${currentBrand.id}/${currentBrand.photo}`} alt="thumbnail" className="thumbnail" />
                    : <label htmlFor="photo" className="ms-0 w-50 person-span mt-3 cursor-pointer bg-secondary">
                        <i className="bi bi-image-fill"></i>
                    </label>
                setImage(img);
            }
        }
    }, [updateBrand.brand, form.id])

    useEffect(() => {
        alertRef.current && alertRef.current.focus()
    }, [alert])

   const handleCategories = () => {
        const selectedOptions = [...categoriesRef.current.selectedOptions];
        const cats = [];
        const selected = selectedOptions.map((option) => {
          cats.push(option.textContent);
          return Number(option.value);
        });
        form.categories = [...selected];
        setChosenCat([...cats]);
    }

    const handleReset = () => {
        setForm({...initialForm, id:form.id})
    }

    if(!accessToken) return <Navigate to="/login/2" />
    return ( 
        <Modal show={updateBrand.show} fullscreen={true} onHide={hideModal}>
            <Modal.Header closeButton>
                <Modal.Title>Edit brand (ID : {brand.id})</Modal.Title>
            </Modal.Header>
            <Modal.Body className="border modal-body">
                <Alert ref={alertRef} tabIndex={-1} variant={alert.variant} show={alert.show} dismissible onClose={toggleAlert}>
                    {alert.message}
                </Alert>
                <Form className="add-user-form" onSubmit={handleSubmit}>
                    <Form.Group className="mb-3 row justify-content-center" controlId="name">
                        <Form.Label className="form-label">Name:</Form.Label>
                        <Form.Control value={form?.name} onInput={handleInput} required className="form-input" type="name" placeholder="Enter name" />
                    </Form.Group>
                    <Form.Group className="mb-3 row justify-content-center" controlId="categories">
                        <Form.Label className="form-label">Categories:</Form.Label>
                        <Form.Select onChange={handleCategories} multiple required className="form-input" ref={categoriesRef} value={form.categories}>
                            {categories.map(cat => <option key={cat.name} value={cat.id}>{cat.name}</option>)}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="my-4 row justify-content-center" controlId="chosenCat">
                        <Form.Label className="form-label"  style={{alignSelf: "start"}}>Chosen Category:</Form.Label>
                        <div className="form-input">
                            {chosenCat.map(option => <Badge className="ms-1" key={option} bg="secondary">{option.replace(/-/g, "")}</Badge>)}
                        </div>
                    </Form.Group>
                    <Form.Group className="mb-3 row justify-content-center" controlId="photo">
                        <Form.Label className="form-label"  style={{alignSelf: "start"}}>Photo:</Form.Label>
                        <div className="form-input row">
                            <Form.Control onChange={handleSelectImage} className="col-10" type="file" accept="image/jpg, image/png, image/jpeg" />
                            {image}
                        </div>
                    </Form.Group>
                    <Row className="justify-content-center">
                        <div className="w-25"></div>
                        <div className="form-input ps-0">
                            <Button ref={submitBtnRef} className="fit-content mx-1" variant="primary" type="submit">
                                Update Brand
                            </Button>
                            <Button onClick={handleReset} className="fit-content mx-1" variant="secondary" type="reset">
                                Clear
                            </Button>
                        </div>
                    </Row>
                    
                </Form>
            </Modal.Body>
        </Modal>
     );
}
 
export default UpdateBrand;