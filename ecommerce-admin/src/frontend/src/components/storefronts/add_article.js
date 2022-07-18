import { Modal, Alert, Form, Button, FloatingLabel } from "react-bootstrap";
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import useAuth from "../custom_hooks/use-auth";
import { isTokenExpired, listFormData, SPINNERS_BORDER_HTML } from "../utilities";
import axios from "axios";

const ArticleStorefront = ({data, setData, updateStorefront}) => {
    const obj = {...data.storefront};
    const [form, setForm] = useState({});
    const [articles, setArticles] = useState([]);
    const [selectedArticles, setSelectedArticles] = useState([]);
    const url = process.env.REACT_APP_SERVER_URL + "storefront/"+data.type?.toLowerCase();
    const [{ accessToken }] = useAuth();
    const navigate = useNavigate();
    const [alert, setAlert] = useState({ show: false, message: "", variant: "success" });
    const [alertRef, catsRef, selectedRef] = [useRef(), useRef(), useRef()];
    const abortController = useRef(new AbortController());
    const toggleAlert = () => {
        setAlert({...alert, show: !alert.show})
    }

    
    useEffect(() => {
        if(obj.article) obj.article = obj.article.id;
        setForm(obj);
        if(obj?.models){
            const cats = obj.models.map(m => m.article);
            setSelectedArticles([...cats]);
        }else{
            setSelectedArticles([])
        }
        
        setAlert(s => ({ ...s, show: false }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data.show]);
    
    useEffect(() => {
        alertRef.current && alertRef.current.focus()
    }, [alert, alertRef]);

    useEffect(()=> {
        const url = process.env.REACT_APP_SERVER_URL + "storefront/articles";
        axios.get(url, {
            headers: {
                "Authorization": `Bearer ${accessToken}`,
            }, 
            signal: abortController.current.signal
        })
            .then(response => {
                setArticles(response.data);
            })
            .catch(error => { 
                const response = error.response
                if(isTokenExpired(response)) navigate("/login/2")
                else setAlert({show:true, message: "could not fetch articles", variant: "danger"})
            })
    },[accessToken, navigate]);

    const addToForm = (data) =>{
        data.delete("selected")
        selectedArticles.forEach(v => {
            data.append("selected", v.id);
        });
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if(selectedArticles.size < 1) {
            setAlert(s => ({...s, show:true, message: "choose articles"}));
            return;
        }
        const target = event.target
        const formData = new FormData(target);
        addToForm(formData);
        
        listFormData(formData);

        setAlert(state => ({ ...state, show: false }));
        const button = target.querySelector("button#submit");
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
    const handleChoose = e => {
        const select = catsRef.current;
        if(select){
            const selected = select.selectedOptions;
            for (let i = 0; i < selected.length; i++) {
                const id = Number(selected[i].value);
                const article = articles.find(c => c.id === id);
                if(!selectedArticles.some(a => a.id === article.id)){
                    selectedArticles.push(article);
                }
            }
            setSelectedArticles(s => ([...s]));
        }
    }
    const handleDelete = () => {
        const select = selectedRef.current;
        if(select){
            const id = Number(select.value);
            const s = selectedArticles.filter(v => v.id !== id);
            setSelectedArticles([...s]);
        }
    }
    
    const handleMove = dir => {
        const select = selectedRef.current;
        if(select){
            const id = Number(select.value);
            const index = selectedArticles.findIndex(a => a.id === id);
            let newIndex = dir === "up" ? index - 1 : index + 1;
            if(newIndex < 0 || newIndex >= selectedArticles.length) return;
            const el = selectedArticles[index];
            const el1 = selectedArticles[newIndex];
            selectedArticles[index] = el1;
            selectedArticles[newIndex] = el;
            select.options.selectedIndex = newIndex;
            setSelectedArticles(s => ([...s]));
        }
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
                        ? `New Article section` 
                        :`Edit Article section`
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
                            <FloatingLabel
                                controlId="description"
                                className="mb-1 form-input px-0"
                            >
                                <Form.Control style={{ height: 'fit-content' }} className="py-1" as="textarea" 
                                name="description" value={form?.description ?? ""} onChange={handleInput} required/>
                            </FloatingLabel>
                    </Form.Group>
                    <Form.Group className="my-4 row justify-content-center mx-0" controlId="enabled">
                        <Form.Label className="form-label">Enabled:</Form.Label>
                        <Form.Check onChange={handleInput} checked={form?.enabled ?? ""} name="enabled" className="form-input ps-0"/>
                    </Form.Group>
                    <Form.Group className="my-4 row justify-content-center mx-0" controlId="heading">
                        <Form.Label className="form-label">Articles:</Form.Label>
                        <div className="form-input px-0">
                            <select ref={catsRef} className="form-control my-2" size="4" style={{ height: "300px" }} multiple>
                                <option value="" hidden>Select articles</option>
                                {articles.map((c, i) => <option key={i} value={c.id}>{c.title}</option>)}
                            </select>
                            <Button onClick={handleChoose} variant="secondary" className="fit-content my-2">Choose Article</Button>
                        </div>
                    </Form.Group>
                    <Form.Group className="my-4 row justify-content-center mx-0" controlId="selectedValue">
                        <Form.Label className="form-label">Chosen Articles:</Form.Label>
                        <div className="form-input px-0">
                            <select ref={selectedRef} className="form-control my-2" size="7" style={{ height: "200px" }}>
                                {selectedArticles.map((c, i) => <option key={i} data-index={i} value={c.id}>{c.title}</option>)}
                            </select>
                            <div className="d-flex flex-wrap px-2">
                                <i onClick={handleDelete} className="bi bi-archive-fill fs-5 me-1"></i>
                                <i onClick={()=>handleMove('up')} className="bi bi-chevron-up fs-5 mx-2 fw-bold" title="move selected item up"></i>
                                <i onClick={()=>handleMove('down')} className="bi bi-chevron-down fs-5 mx-2 fw-bold" title="move selected item down"></i>
                            </div>
                        </div>
                    </Form.Group>
                    <div className="d-flex flex-wrap justify-content-center">
                        <Button id="submit" className="fit-content mx-auto" variant="primary" type="submit">
                            Save
                        </Button>
                    </div>
                    
                </Form>
            </Modal.Body>
        </Modal>
     );
}
 
export default ArticleStorefront;