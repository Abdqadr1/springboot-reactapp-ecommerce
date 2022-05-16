import axios from "axios";
import {useEffect, useRef, useState } from "react";
import { Alert, Button, Form, Modal, Row } from "react-bootstrap";
import { Navigate, useNavigate } from "react-router-dom";
import { getAuth, getFormData, isFileValid, isTokenExpired, showThumbnail, SPINNERS_BORDER_HTML } from "../utilities";

const UpdateCategory = ({ updateCategory, setUpdateCategory, updatingCategory, hierarchies }) => {
    const navigate = useNavigate()
    const category = updateCategory.category;
    const url = process.env.REACT_APP_SERVER_URL + "category/edit/" + category.id;
    const initialForm = {
        id:'', name:'', alias:'', parent:'', enabled: false, photo: null
    }

    const { accessToken } = getAuth();

    const [form, setForm] = useState({...initialForm});
    const [alert, setAlert] = useState({ show: false, message: "", variant: "success" });
    const [image, setImage] = useState(<i className="bi bi-person-fill"></i>)
    const alertRef = useRef();
    const submitBtnRef = useRef();
    const toggleAlert = () => setAlert({ ...alert, show: !alert.show })
    
    const hideModal = () => {
        setUpdateCategory({...updateCategory, show: false})
    }

    const handleInput = (event) => {
        setForm({
            ...form,
            [event.target.id]: event.target.value
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
        if(form.parent instanceof Object) form.parent = form.parent.id
        const data = getFormData(form)
        
        const button = submitBtnRef.current
        button.disabled=true
        button.innerHTML = SPINNERS_BORDER_HTML
        axios.post(url, data, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        }).then(response => {
            setAlert({ show: true, message: "category updated!" })
            updatingCategory(response.data)
        })
        .catch(error => { 
            const response = error.response
            if(isTokenExpired(response)) navigate("/login/2")  
            else setAlert({show:true, message: response.data.message, variant: "danger"})
        }).finally(() => {  
            button.disabled=false
            button.innerHTML = "Update Category"
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
        const currentCategory = updateCategory.category;
        if (currentCategory.id) {
            if (!form.id || currentCategory.id) {
                setForm({ ...currentCategory });
                const fileURI = process.env.REACT_APP_FILE_URI;
                const img = currentCategory.photo && currentCategory.photo !== "null"
                    ? <img src={`${fileURI}${currentCategory.id}/${currentCategory.photo}`} alt="thumbnail" className="thumbnail" />
                    : <i className="bi bi-person-fill"></i>
                setImage(img);
            }
        }
    }, [alert, updateCategory.category, form.id])

    const handleReset = () => {
        setForm({...initialForm, id:form.id})
    }

    if(!accessToken) return <Navigate to="/login/2" />
    return ( 
        <Modal show={updateCategory.show} fullscreen={true} onHide={hideModal}>
            <Modal.Header closeButton>
                <Modal.Title>Edit category (ID : {category.id})</Modal.Title>
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
                    <Form.Group className="mb-3 row justify-content-center" controlId="alias">
                        <Form.Label className="form-label">Alias:</Form.Label>
                        <Form.Control value={form?.alias} onInput={handleInput} required className="form-input" type="text" placeholder="Enter alias" />
                    </Form.Group>
                    <Form.Group className="mb-3 row justify-content-center" controlId="parent">
                        <Form.Label className="form-label">Parent Category:</Form.Label>
                        <Form.Select value={form.parent?.id} onInput={handleInput} required className="form-input">
                            <option value={form.parent?.id} hidden>{form.parent?.name ?? "No parent"}</option>
                            {hierarchies.map(cat => <option key={cat.name} value={cat.id}>{cat.name}</option>)}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3 row justify-content-center" controlId="enabled">
                        <Form.Label className="form-label">Enabled:</Form.Label>
                        <Form.Check checked={form.enabled}  onChange={handleToggle} className="form-input ps-0" type="checkbox"/>
                    </Form.Group>
                    <Form.Group className="mb-3 row justify-content-center" controlId="photo">
                        <Form.Label className="form-label"  style={{alignSelf: "start"}}>Photo:</Form.Label>
                        <div className="form-input d-flex">
                            <Form.Control onChange={handleSelectImage} className="w-50 h-fit-content"  style={{alignSelf: "center"}} type="file" accept="image/jpg, image/png, image/jpeg" />
                            <div className="w-50">
                                <label htmlFor="photo" className="person-span cursor-pointer bg-secondary">
                                    {image}
                                </label>
                            </div>
                        </div>
                    </Form.Group>
                    <Row className="justify-content-center">
                        <div className="w-25"></div>
                        <div className="form-input ps-0">
                            <Button ref={submitBtnRef} className="fit-content mx-1" variant="primary" type="submit">
                                Update Category
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
 
export default UpdateCategory;