import axios from "axios";
import {useEffect, useRef, useState } from "react";
import { Alert, Button, Form, Modal, Row } from "react-bootstrap";
import { Navigate, useNavigate } from "react-router-dom";
import { isFileValid, isTokenExpired, showThumbnail, SPINNERS_BORDER_HTML } from "../utilities";
import useAuth from "../custom_hooks/use-auth";

const UpdateCategory = ({ updateCategory, setUpdateCategory, updatingCategory, hierarchies }) => {
    const navigate = useNavigate()
    const [{ accessToken }] = useAuth();
    const category = updateCategory.category;
    const url = process.env.REACT_APP_SERVER_URL + "category/edit/" + category.id;
    const initialForm = {
        id:'', name:'', alias:'', parent:"", enabled: false, photo: null
    }
    const initialImage = <label htmlFor="photo" className="ms-0 person-span mt-3 cursor-pointer bg-secondary">
                                <i className="bi bi-image-fill"></i>
                            </label>

    const [form, setForm] = useState({...initialForm});
    const [alert, setAlert] = useState({ show: false, message: "", variant: "success" });
    const [image, setImage] = useState(initialImage)
    const alertRef = useRef();
    const submitBtnRef = useRef();
    const formRef = useRef();

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
        const data = new FormData(event.target);
        if(form.parent?.id) form.parent = form.parent.id

        setAlert((state) => ({ ...state, show: false }));
        
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
        setAlert(state => ({ ...state, show: false}));
        const currentCategory = updateCategory.category;
        if (currentCategory.id) {
            if (!form.id || currentCategory.id) {
                setForm(() => {
                    let newState = { ...currentCategory }
                    if (!currentCategory.parent) newState.parent = ""
                    return newState;
                });
                const img = currentCategory.photo && currentCategory.photo !== "null"
                    ? <img src={currentCategory.imagePath} alt="thumbnail" className="thumbnail" />
                    : <label htmlFor="photo" className="ms-0 person-span mt-3 cursor-pointer bg-secondary">
                                <i className="bi bi-image-fill"></i>
                            </label>
                setImage(img);
            }
        }
    }, [updateCategory.category, form.id])

    useEffect(() => {
        alertRef.current && alertRef.current.focus();
    }, [alert])

    const handleReset = () => {
        setForm({...initialForm, id:form.id})
        setImage(initialImage)
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
                <Form ref={formRef} className="add-user-form" onSubmit={handleSubmit}>
                    <Form.Group className="mb-3 row justify-content-center" controlId="name">
                        <Form.Label className="form-label">Name:</Form.Label>
                        <Form.Control name="name" value={form?.name} onInput={handleInput} required className="form-input" type="name" placeholder="Enter name" />
                    </Form.Group>
                    <Form.Group className="mb-3 row justify-content-center" controlId="alias">
                        <Form.Label className="form-label">Alias:</Form.Label>
                        <Form.Control name="alias" value={form?.alias} onInput={handleInput} required className="form-input" type="text" placeholder="Enter alias" />
                    </Form.Group>
                    <Form.Group className="mb-3 row justify-content-center" controlId="parent">
                        <Form.Label className="form-label">Parent Category:</Form.Label>
                        <Form.Select name="parent" value={form?.parent ?? ""} onInput={handleInput} className="form-input">
                            <option value={form.parent?.id ?? ""} hidden>{form.parent?.name ?? "No parent"}</option>
                            {hierarchies.map(cat => <option key={cat.name} value={cat.id}>{cat.name}</option>)}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3 row justify-content-center" controlId="enabled">
                        <Form.Label className="form-label">Enabled:</Form.Label>
                        <Form.Check name="enabled" checked={form.enabled}  onChange={handleToggle} className="form-input ps-0" type="checkbox"/>
                    </Form.Group>
                    <Form.Group className="mb-3 row justify-content-center" controlId="photo">
                        <Form.Label className="form-label"  style={{alignSelf: "start"}}>Photo:</Form.Label>
                        <div className="form-input row">
                            <Form.Control name="image" onChange={handleSelectImage} className="col-10" type="file" accept="image/jpg, image/png, image/jpeg" />
                            {image}
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