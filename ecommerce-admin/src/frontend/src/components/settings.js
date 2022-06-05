import axios from "axios";
import {useEffect, useRef, useState } from "react";
import { Alert, Button, Col, Form, Row, Tab, Tabs } from "react-bootstrap";
import { Navigate, useNavigate } from "react-router-dom";
import TextEditor from "./text_editor"
import { isFileValid, isTokenExpired, showThumbnail,listFormData, SPINNERS_BORDER_HTML } from "./utilities";
import useAuth from "./custom_hooks/use-auth";

const SettingsPage = () => {
    const [{accessToken}] = useAuth()
    const navigate = useNavigate()
    const submitBtnRef = useRef();
    const url = process.env.REACT_APP_SERVER_URL + "set";
    const logoUrl = `${process.env.REACT_APP_SERVER_URL}site-logo/`;

    const [alert, setAlert] = useState({ show: false, message: "okay", variant: "success" });
    const [currencies, setCurrencies] = useState([]);
    const [settings, setSettings] = useState({});
    const [alertRef] = [useRef()];
    const [logo, setLogo] = useState();
    const toggleAlert = () => {
        setAlert({...alert, show: !alert.show})
    }
    
    useEffect(() => {
        axios.get(`${url}/get`)
             .then(response => {
                 const data = response.data
                 setCurrencies(data.currencies);
                 data.settings.forEach(el => {
                     settings[el.key] = el.value;
                 });
                 setLogo(<img src={`${logoUrl}${settings.SITE_LOGO ?? ''}`} alt="site-logo" className="site-logo" />)
             })
            .catch(error => {
                 const response = error.response
                if(isTokenExpired(response)) navigate("/login/2")
             })
        
    }, [])

    useEffect(() => {
        if (!alert.show) return;
        alertRef.current && alertRef.current.focus()
    }, [alert])

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.target;
        const action = form.getAttribute("data-action");

        const data = new FormData(form);
        
        // listFormData(data);

        setAlert((state) => ({ ...state, show: false }));
        const button = submitBtnRef.current
        button.disabled=true
        button.innerHTML = SPINNERS_BORDER_HTML
        axios.post(`${url}/${action}`, data, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        })
            .then(response => {
                console.log(response.data)
                setAlert({ show: true, message: "Settings saved" })
            })
            .catch(error => { 
                const response = error.response
                if(isTokenExpired(response)) navigate("/login/2")
                else setAlert({show:true, message: response.data.message, variant: "danger"})
            }).finally(() => {
                button.disabled=false
                button.innerHTML = "Save"
            })
    }

    

    const handleReset = (e) => {
        setAlert(s => ({ ...s, show: false }));
        e.preventDefault()
    }

    const handleChange = (e) => {
        const key = e.target.id;
        const value = e.target.value;
        setSettings(state => ({
            ...state,
            [key]: value
        }))
    }

    const handleSelectImage = (event, type) => {
        const input = event.target;
        const file = input.files[0]
        if (isFileValid(file, input)) {
            showThumbnail(file, setLogo, "logo thumbnail", null, "site-logo");
        }
    }
    
    if(!accessToken) return <Navigate to="/login/2" />
    return ( 
        <Row className="justify-content-center mx-0">
            <Col md={10} className="border p-4">
                <Tabs defaultActiveKey="general" id="uncontrolled-tab-example" className="mb-3">
                    <Tab eventKey="general" title="General" className="px-2">
                        <Form className="add-user-form" onSubmit={handleSubmit} data-action="save_general">
                            <Alert ref={alertRef} tabIndex={-1} variant={alert.variant} show={alert.show} dismissible onClose={toggleAlert}>
                                {alert.message}
                            </Alert>
                            <Form.Group className="mb-3 row justify-content-center" controlId="SITE_NAME">
                                <Form.Label className="form-label">Site Name:</Form.Label>
                                <Form.Control onChange={handleChange} value={settings.SITE_NAME ?? ""} name="SITE_NAME" className="form-input" type="name"/>
                            </Form.Group>
                            <Form.Group className="mb-3 row justify-content-center" controlId="COPYRIGHT">
                                <Form.Label className="form-label">Copyright:</Form.Label>
                                <Form.Control onChange={handleChange} value={settings.COPYRIGHT ?? ""} name="COPYRIGHT" className="form-input" type="text"/>
                            </Form.Group>
                            <Form.Group className="mb-3 row justify-content-center" controlId="fileImage">
                                <Form.Label className="form-label">Site Logo:</Form.Label>
                                <section className ="form-input my-1">
                                    <div className="w-25 d-inline-block">{logo}</div>
                                    <Form.Control onChange={handleSelectImage} name="fileImage" type="file" className="w-75 d-inline-block">
                                    </Form.Control>
                                </section>
                            </Form.Group>
                            <Form.Group className="mb-3 row justify-content-center" controlId="CURRENCY_ID">
                                <Form.Label className="form-label">Currency Type:</Form.Label>
                                <Form.Select onChange={handleChange} value={settings.CURRENCY_ID ?? ""} name="CURRENCY_ID" required className="form-input">
                                    {currencies.map((c, i) => <option key={i} value={c.id}>{c.name} - {c.symbol}</option>)}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3 row justify-content-center" controlId="CURRENCY_SYMBOL_POSITION">
                                <Form.Label className="form-label">Currency Symbol Position:</Form.Label>
                                <Form.Select onChange={handleChange} value={settings.CURRENCY_SYMBOL_POSITION ?? ""} name="CURRENCY_SYMBOL_POSITION" className="form-input ps-0">
                                    <option value="BEFORE PRICE">BEFORE PRICE</option>
                                    <option value="AFTER PRICE">AFTER PRICE</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3 row justify-content-center" controlId="DECIMAL_POINT_TYPE">
                                <Form.Label className="form-label">Decimal Point Type:</Form.Label>
                                <Form.Select onChange={handleChange} value={settings.DECIMAL_POINT_TYPE ?? ""} name="DECIMAL_POINT_TYPE" className="form-input ps-0">
                                    <option value="COMMA">COMMA(,)</option>
                                    <option value="POINT">POINT(.)</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3 row justify-content-center" controlId="DECIMAL_DIGIT">
                                <Form.Label className="form-label">Decimal Digit:</Form.Label>
                                <Form.Select onChange={handleChange} value={settings.DECIMAL_DIGIT ?? ""} name="DECIMAL_DIGIT" required className="form-input">
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3 row justify-content-center" controlId="THOUSANDS_POINT_TYPE">
                                <Form.Label className="form-label">Thousands Point Type:</Form.Label>
                                <Form.Select onChange={handleChange} value={settings.THOUSANDS_POINT_TYPE ?? ""} name="THOUSANDS_POINT_TYPE" required className="form-input">
                                    <option value="COMMA">COMMA(,)</option>
                                    <option value="POINT">POINT(.)</option>
                                </Form.Select>
                            </Form.Group>
                            <Row className="justify-content-center">
                                <div className="w-25"></div>
                                <div className="form-input ps-0 my-3">
                                    <Button ref={submitBtnRef} className="fit-content mx-1" variant="primary" type="submit">
                                        Save
                                    </Button>
                                    <Button onClick={handleReset}  className="fit-content mx-1" variant="secondary" type="reset">
                                        Clear
                                    </Button>
                                </div>
                            </Row>          
                        </Form>
                    </Tab>
                    <Tab eventKey="countries" title="Countries">
                        <h4>Countries</h4>
                    </Tab>
                    <Tab eventKey="states" title="States">
                    </Tab>
                    <Tab eventKey="Mail Server" title="Mail Server">
                        
                            <Row className="mt-5">
                            <Form.Group className="col-5 row justify-content-center" controlId="name">
                                <Form.Label className="form-label fw-bold">Name:</Form.Label>
                                <Form.Control name="detail_name"  className="form-input" />
                            </Form.Group>
                            <Form.Group className="col-6 row justify-content-center" controlId="value">
                                <Form.Label className="form-label fw-bold">Value:</Form.Label>
                                <Form.Control name="detail_value" className="form-input" />
                            </Form.Group>
                        </Row>
                    </Tab>
                    <Tab eventKey="Mail Template" title="Mail Template">
                    </Tab>
                </Tabs>
            </Col>
            
        </Row>   
     );
}
 
export default SettingsPage;