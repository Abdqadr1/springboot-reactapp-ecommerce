import { Modal, Alert, Form, Button, FloatingLabel } from "react-bootstrap";
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import useAuth from "../custom_hooks/use-auth";
import { isTokenExpired, listFormData, SPINNERS_BORDER_HTML } from "../utilities";
import axios from "axios";

const BrandStorefront = ({data, setData, updateStorefront}) => {
    const obj = {...data.storefront};
    const [form, setForm] = useState({});
    const [brands, setBrands] = useState([]);
    const [selectedBrands, setSelectedBrands] = useState([]);
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
            const cats = obj.models.map(m => m.brand);
            setSelectedBrands([...cats]);
        }else{
            setSelectedBrands([])
        }
        
        setAlert(s => ({ ...s, show: false }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data.show]);
    
    useEffect(() => {
        alertRef.current && alertRef.current.focus()
    }, [alert, alertRef]);

    useEffect(()=> {
        const url = process.env.REACT_APP_SERVER_URL + "storefront/brands";
        axios.get(url, {
            headers: {
                "Authorization": `Bearer ${accessToken}`,
            }, 
            signal: abortController.current.signal
        })
            .then(response => {
                setBrands(response.data);
            })
            .catch(error => { 
                const response = error.response
                if(isTokenExpired(response)) navigate("/login/2")
                else setAlert({show:true, message: "could not fetch brands", variant: "danger"})
            })
    },[accessToken, navigate]);

    const addToForm = (data) =>{
        data.delete("selected")
        selectedBrands.forEach(v => {
            data.append("selected", v.id);
        });
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if(selectedBrands.length < 1) {
            setAlert(s => ({...s, show:true, message: "choose brands"}));
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
                const brand = brands.find(c => c.id === id);
                if(!selectedBrands.some(a => a.id === brand.id)){
                    selectedBrands.push(brand);
                }
            }
            setSelectedBrands(s => ([...s]));
        }
    }
    const handleDelete = () => {
        const select = selectedRef.current;
        if(select){
            const id = Number(select.value);
            const s = selectedBrands.filter(v => v.id !== id);
            setSelectedBrands([...s]);
        }
    }
    
    const handleMove = dir => {
        const select = selectedRef.current;
        if(select){
            const id = Number(select.value);
            const index = selectedBrands.findIndex(a => a.id === id);
            let newIndex = dir === "up" ? index - 1 : index + 1;
            if(newIndex < 0 || newIndex >= selectedBrands.length) return;
            const el = selectedBrands[index];
            const el1 = selectedBrands[newIndex];
            selectedBrands[index] = el1;
            selectedBrands[newIndex] = el;
            select.options.selectedIndex = newIndex;
            setSelectedBrands(s=> ([...s]));
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
                        ? `New Brand section` 
                        :`Edit Brand section`
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
                        <Form.Label className="form-label">Brands:</Form.Label>
                        <div className="form-input px-0">
                            <select ref={catsRef} className="form-control my-2" size="4" style={{ height: "300px" }} multiple>
                                <option value="" hidden>Select brands</option>
                                {brands.map((c, i) => <option key={i} value={c.id}>{c.name}</option>)}
                            </select>
                            <Button onClick={handleChoose} variant="secondary" className="fit-content my-2">Choose Category</Button>
                        </div>
                    </Form.Group>
                    <Form.Group className="my-4 row justify-content-center mx-0" controlId="selectedValue">
                        <Form.Label className="form-label">Chosen Brands:</Form.Label>
                        <div className="form-input px-0">
                            <select ref={selectedRef} className="form-control my-2" size="7" style={{ height: "200px" }}>
                                {selectedBrands.map((c, i) => <option key={i} data-index={i} value={c.id}>{c.name}</option>)}
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
 
export default BrandStorefront;