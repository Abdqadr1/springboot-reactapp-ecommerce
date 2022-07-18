import { Modal, Alert, Form, Button } from "react-bootstrap";
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import useAuth from "../custom_hooks/use-auth";
import { isTokenExpired, listFormData, SPINNERS_BORDER_HTML } from "../utilities";
import axios from "axios";
import TextEditor from "../text_editor";

const AddAll = ({data, setData, updateStorefront}) => {
    const obj = {...data.storefront};
    const [form, setForm] = useState({});
    const url = process.env.REACT_APP_SERVER_URL + "storefront/"+data.type?.toLowerCase();
    const [{ accessToken }] = useAuth();
    const navigate = useNavigate();
    const [alert, setAlert] = useState({ show: false, message: "", variant: "success" });
    const [alertRef] = [useRef(), useRef()];
    const abortController = useRef(new AbortController());
    const toggleAlert = () => {
        setAlert({...alert, show: !alert.show})
    }

    
    useEffect(() => {
        if(obj.article) obj.article = obj.article.id;
        setForm(obj);
        setAlert(s => ({ ...s, show: false }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data.show]);
    
    useEffect(() => {
        alertRef.current && alertRef.current.focus()
    }, [alert, alertRef])

    const handleSubmit = (event) => {
        event.preventDefault();
        const target = event.target
        const formData = new FormData(target);
        
        listFormData(formData);

        setAlert((state) => ({ ...state, show: false }));
        const button = target.querySelector("button");
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
    const setDesc = txt => {
        setForm(s=> ({...s, description: txt}))
    }

    const hideModal = () => {
        setData({...data, show: false})
    }
     return ( 
        <Modal show={data.show} fullscreen={true} onHide={hideModal}>
            <Modal.Header closeButton>
                <Modal.Title>
                    {
                        (data.type === "New") 
                        ? `New ${data.which.toLowerCase()} section` 
                        :`Edit ${data.which.toLowerCase()} section`
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
                        <input type="hidden" name="description" value={form?.description} required />
                        <TextEditor text={obj?.description ?? ""} setText={setDesc} width="form-input" height="big-height"/>
                    </Form.Group>
                    <Form.Group className="my-4 row justify-content-center mx-0" controlId="enabled">
                        <Form.Label className="form-label">Enabled:</Form.Label>
                        <Form.Check onChange={handleInput} checked={form?.enabled ?? ""} name="enabled" className="form-input ps-0"/>
                    </Form.Group>
                    <div className="d-flex flex-wrap justify-content-center">
                        <Button className="fit-content mx-auto" variant="primary" type="submit">
                            Save
                        </Button>
                    </div>
                    
                </Form>
            </Modal.Body>
        </Modal>
     );
}
 
export default AddAll;