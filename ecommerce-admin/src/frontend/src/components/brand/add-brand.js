import axios from "axios";
import {useEffect, useRef, useState } from "react";
import { Alert, Badge, Button, Form, Modal, Row } from "react-bootstrap";
import { Navigate, useNavigate } from "react-router-dom";
import useAuth from "../custom_hooks/use-auth";
import { getFormData, isFileValid, isTokenExpired, showThumbnail, SPINNERS_BORDER_HTML } from "../utilities";

const AddBrand = ({ showAddBrand, setShowAddBrand, addingBrand, categories }) => {
    const [{ accessToken }] = useAuth();
    const navigate = useNavigate()
    const submitBtnRef = useRef();
    const url = process.env.REACT_APP_SERVER_URL + "brand/add"
    const initialForm = {
        name:'', photo: null, categories: []
    }
    const [form, setForm] = useState(initialForm);
    const [image, setImage] = useState(<label htmlFor="photo" className="ms-0 w-50 person-span mt-3 cursor-pointer bg-secondary">
                                            <i className="bi bi-image-fill"></i>
                                        </label>);
    const [alert, setAlert] = useState({ show: false, message: "", variant: "success" });
    const alertRef = useRef();
    const categoriesRef = useRef();
    const [chosenCat, setChosenCat] = useState([]);
    const toggleAlert = () => {
        setAlert({...alert, show: !alert.show})
    }


    const handleInput = (event) => {
        const id = event.target.id;
        let value = event.target.value
        value = (id === "parent") ? Number(value) : value
        setForm({
            ...form,
            [id]: value
        })
    }
const handleSubmit = (event) => {
        event.preventDefault();
        setAlert((state) => ({ ...state, show: false }));
        const data = getFormData(form)

        const button = submitBtnRef.current
        button.disabled=true
        button.innerHTML = SPINNERS_BORDER_HTML
        axios.post(url, data, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        })
            .then(response => {
                addingBrand(response.data);
                setAlert({ show: true, message: "Brand saved!" })
            })
            .catch(error => { 
                const response = error.response
                if(isTokenExpired(response)) navigate("/login/2")
                else setAlert({show:true, message: response.data.message, variant: "danger"})
            }).finally(() => {
                button.disabled=false
                button.innerHTML = "Add Brand"
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
        alertRef.current && alertRef.current.focus()
    }, [alert])
    
    const handleReset = () => {
        setForm(initialForm)
    }

    const handleCategories = () => {
        const selectedOptions = [...categoriesRef.current.selectedOptions];
        const cats = []
        const selected = selectedOptions.map(option => {
            cats.push(option)
            return Number(option.value)
        })
        form.categories = [...selected];
        setChosenCat([...cats]);
    }
    
    if(!accessToken) return <Navigate to="/login/2" />
    return ( 
        <Modal show={showAddBrand} fullscreen={true} onHide={()=> setShowAddBrand(!showAddBrand)}>
            <Modal.Header closeButton>
                <Modal.Title>Add New Brand</Modal.Title>
            </Modal.Header>
            <Modal.Body className="border modal-body">
                <Alert ref={alertRef} tabIndex={-1} variant={alert.variant} show={alert.show} dismissible onClose={toggleAlert}>
                    {alert.message}
                </Alert>
                <Form className="add-user-form" onSubmit={handleSubmit}>
                    <Form.Group className="mb-3 row justify-content-center" controlId="name">
                        <Form.Label className="form-label">Name:</Form.Label>
                        <Form.Control value={form.name} onInput={handleInput} required className="form-input" type="name" placeholder="Enter brand name" />
                    </Form.Group>
                    <Form.Group className="mb-3 row justify-content-center" controlId="categories">
                        <Form.Label className="form-label">Categories:</Form.Label>
                        <Form.Select onChange={handleCategories} multiple required className="form-input" ref={categoriesRef}>
                            {categories.map(cat => <option key={cat.name} value={cat.id}>{cat.name}</option>)}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="my-4 row justify-content-center" controlId="chosenCat">
                        <Form.Label className="form-label"  style={{alignSelf: "start"}}>Chosen Category:</Form.Label>
                        <div className="form-input">
                            {chosenCat.map(option => <Badge className="ms-1" key={option.textContent} bg="secondary">{option.textContent.replace(/-/g, "")}</Badge>)}
                        </div>
                    </Form.Group>
                    <Form.Group className="mb-3 row justify-content-center" controlId="photo">
                        <Form.Label className="form-label"  style={{alignSelf: "start"}}>Photo:</Form.Label>
                        <div className="form-input row">
                            <Form.Control required onChange={handleSelectImage} className="col-10" type="file" accept="image/jpg, image/png, image/jpeg" />
                            {image}
                        </div>
                    </Form.Group>
                    <Row className="justify-content-center">
                        <div className="w-25"></div>
                        <div className="form-input ps-0">
                            <Button ref={submitBtnRef} className="fit-content mx-1" variant="primary" type="submit">
                                Add Brand
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
 
export default AddBrand;