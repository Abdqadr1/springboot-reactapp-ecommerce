import { useEffect,useState, useRef } from "react";
import { Form, Modal, Alert,Button} from "react-bootstrap";
import { useNavigate } from "react-router";
import useAuth from "../custom_hooks/use-auth";
import { listFormData, isTokenExpired, SPINNERS_BORDER_HTML } from "../utilities";
import axios from "axios";

const EditMenu = ({ data, setData, updateMenu }) => {
    const menu = {...data.menu};
    const [form, setForm] = useState({});
    const url = process.env.REACT_APP_SERVER_URL + "menu/"+data.type?.toLowerCase();
    const [{ accessToken }] = useAuth();
    const navigate = useNavigate();
    const [alert, setAlert] = useState({ show: false, message: "", variant: "success" });
    const [articles, setArticles] = useState([]);
    const [alertRef] = [useRef(), useRef()];
    const abortController = useRef(new AbortController());
    const toggleAlert = () => {
        setAlert({...alert, show: !alert.show})
    }
    useEffect(()=>{
        abortController.current = new AbortController();
        const url = process.env.REACT_APP_SERVER_URL + "menu/articles";
        axios.get(url, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }, 
            signal: abortController.current.signal
        })
        .then(response => setArticles(response.data))
        .catch(error => { 
            const response = error.response
            if(isTokenExpired(response)) navigate("/login/2")
            else setAlert({show:true, message: response.data.message, variant: "danger"})
        })
        return () => abortController.current.abort();
    },[accessToken, navigate])
    useEffect(() => {
        if(menu.article) menu.article = menu.article.id;
        setForm(menu);
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
        button.innerHTML = SPINNERS_BORDER_HTML
        axios.post(url, formData, {
            headers: {
                "Authorization": `Bearer ${accessToken}`,
            }, 
            signal: abortController.current.signal
        })
            .then(response => {
                updateMenu(response.data, data.type);
                setAlert({ show: true, message: "Menu saved!" })
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

    
    const hideModal = () => {
        setData({...data, show: false})
    }
    return ( 
        <Modal show={data.show} fullscreen={true} onHide={hideModal}>
            <Modal.Header closeButton>
                <Modal.Title>
                    {
                        (data.type === "New") ? "New Menu" :`Edit Menu (ID : ${menu?.id ?? ""})`
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
                            <input type="hidden" name="id" value={form?.id ?? ""} />
                            <input type="hidden" name="position" value={form?.position ?? ""} />
                        </>
                    }
                    <Form.Group className="my-4 row justify-content-center mx-0" controlId="title">
                        <Form.Label className="form-label">Title:</Form.Label>
                        <Form.Control onChange={handleInput} value={form?.title ?? ""} name="title" required className="form-input"/>
                    </Form.Group>
                    <Form.Group className="my-4 row justify-content-center mx-0" controlId="alias">
                        <Form.Label className="form-label">Alias:</Form.Label>
                        <Form.Control onChange={handleInput} value={form?.alias ?? ""} name="alias" className="form-input"/>
                    </Form.Group>
                    <Form.Group className="my-4 row justify-content-center mx-0" controlId="article">
                        <Form.Label className="form-label">Article:</Form.Label>
                        <Form.Select onChange={handleInput} value={form?.article ?? ""} className="form-input" name="article" required>
                            <option value="">Choose Article</option>
                            {
                                articles.map(a => <option key={a.id} value={a.id}>{a.title}</option>)
                            }
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="my-4 row justify-content-center mx-0" controlId="type">
                        <Form.Label className="form-label">Type:</Form.Label>
                        <Form.Select  onChange={handleInput} value={form?.type ?? ""} className="form-input" name="type" required>
                            <option value="">Choose Menu Type</option>
                            <option value="HEADER_MENU">Header Menu</option>
                            <option value="FOOTER_MENU">Footer Menu</option>
                        </Form.Select>
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
 
export default EditMenu;