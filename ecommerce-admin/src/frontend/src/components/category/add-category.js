import axios from "axios";
import {useEffect, useRef, useState } from "react";
import { Alert, Button, Form, Modal, Row } from "react-bootstrap";
import { Navigate, useNavigate } from "react-router-dom";
import useAuth from "../custom_hooks/use-auth";
import {getFormData, isFileValid, isTokenExpired, showThumbnail, SPINNERS_BORDER_HTML } from "../utilities";

const AddCategory = ({ showAddCategory, setShowAddCategory, addingCategory, hierarchies }) => {
    const [{ accessToken }] = useAuth();
    const navigate = useNavigate()
    const submitBtnRef = useRef();
    const url = process.env.REACT_APP_SERVER_URL + "category/add"
    const initialForm = {
        name:'', alias:'', parent:'', enabled: false, photo: null
    }
    const initialImage = <i className="bi bi-person-fill"></i>;
    const [form, setForm] = useState(initialForm);
    const [image, setImage] = useState(initialImage)
    const [alert, setAlert] = useState({ show: false, message: "", variant: "success" });
    const alertRef = useRef();
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
    const handleToggle = (event) => {
        setForm({
            ...form,
            [event.target.id]: event.target.checked
        })
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        const data = getFormData(form)
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
                addingCategory(response.data);
                setAlert({ show: true, message: "Category saved!" })
            })
            .catch(error => { 
                const response = error.response
                if(isTokenExpired(response)) navigate("/login/2")
                else setAlert({show:true, message: response.data.message, variant: "danger"})
            }).finally(() => {
                button.disabled=false
                button.innerHTML = "Add Category"
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
        setImage(initialImage)
        setAlert((state) => ({ ...state, show: false }));
    }
    
    if(!accessToken) return <Navigate to="/login/2" />
    return ( 
        <Modal show={showAddCategory} fullscreen={true} onHide={()=> setShowAddCategory(!showAddCategory)}>
            <Modal.Header closeButton>
                <Modal.Title>Add New Category</Modal.Title>
            </Modal.Header>
            <Modal.Body className="border modal-body">
                <Alert ref={alertRef} tabIndex={-1} variant={alert.variant} show={alert.show} dismissible onClose={toggleAlert}>
                    {alert.message}
                </Alert>
                <Form className="add-user-form" onSubmit={handleSubmit}>
                    <Form.Group className="mb-3 row justify-content-center" controlId="name">
                        <Form.Label className="form-label">Name:</Form.Label>
                        <Form.Control value={form.name} onInput={handleInput} required className="form-input" type="name" placeholder="Enter name" />
                    </Form.Group>
                    <Form.Group className="mb-3 row justify-content-center" controlId="alias">
                        <Form.Label className="form-label">Alias:</Form.Label>
                        <Form.Control value={form.alias} onInput={handleInput} required className="form-input" type="text" placeholder="Enter alias" />
                    </Form.Group>
                    <Form.Group className="mb-3 row justify-content-center" controlId="parent">
                        <Form.Label className="form-label">Parent Category:</Form.Label>
                        <Form.Select value={form.parent?.id} onInput={handleInput} required className="form-input">
                            <option value={null}>No parent</option>
                            {hierarchies.map(cat => <option key={cat.name} value={cat.id}>{cat.name}</option>)}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3 row justify-content-center" controlId="enabled">
                        <Form.Label className="form-label">Enabled:</Form.Label>
                        <Form.Check onChange={handleToggle} required className="form-input ps-0" type="checkbox"/>
                    </Form.Group>
                    <Form.Group className="mb-3 row justify-content-center" controlId="photo">
                        <Form.Label className="form-label"  style={{alignSelf: "start"}}>Photo:</Form.Label>
                        <div className="form-input row">
                            <Form.Control onChange={handleSelectImage} className="col-10" type="file" accept="image/jpg, image/png, image/jpeg" />
                            <label htmlFor="photo" className="ms-0 person-span mt-3 cursor-pointer bg-secondary">
                                {image}
                            </label>
                        </div>
                    </Form.Group>
                    <Row className="justify-content-center">
                        <div className="w-25"></div>
                        <div className="form-input ps-0">
                            <Button ref={submitBtnRef} className="fit-content mx-1" variant="primary" type="submit">
                                Add Category
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
 
export default AddCategory;