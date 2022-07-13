import axios from "axios";
import {useEffect, useRef, useState } from "react";
import { Alert, Button, Col, Form, Row, Tab, Tabs, Toast, ToastContainer } from "react-bootstrap";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import "../css/settings.css";
import { isFileValid, isTokenExpired, showThumbnail,listFormData, SPINNERS_BORDER_HTML, hasAnyAuthority } from "./utilities";
import useAuth from "./custom_hooks/use-auth";
import useArray from "./custom_hooks/use-array";
import TextEditor from "./text_editor";
import useSettings from "./custom_hooks/use-settings";

const SettingsPage = () => {
    const [auth, ] = useAuth();   
    const {accessToken} = auth;
    const abortController = useRef(new AbortController());

    const navigate = useNavigate()
    const { which } = useParams();
    const url = process.env.REACT_APP_SERVER_URL + "set";
    const countriesUrl = process.env.REACT_APP_SERVER_URL + "countries";
    const statesUrl = process.env.REACT_APP_SERVER_URL + "states";

    const [alert, setAlert] = useState({ show: false, message: "okay", variant: "success" });
    const [currencies, setCurrencies] = useState([]);
    const [settings, setSettings] = useState({});
    const [alertRef] = [useRef()];
    const [logo, setLogo] = useState();

    const [toast, setToast] = useState({show:false, message:""})

    const { array: countries, setArray, addToArray: aCountry, updateArray: uCountries, filterWithId: fCountries} = useArray();
    const { array: states, setArray: setStates, addToArray: aState, updateArray: uState, filterWithId: fState} = useArray();
    const [sC, setSC] = useState(null);
    const [stateC, setStateC] = useState(null)
    const [sS, setSS] = useState(null);
    const [countriesRef, newCRef, newSRef, sFormRef, cFormRef] = [useRef(), useRef(), useRef(), useRef(), useRef()];
    const toggleAlert = () => {
        setAlert({...alert, show: !alert.show})
    }

    const setVerifyMailContent = (content) => setSettings(s=> ({...s, CUSTOMER_VERIFY_CONTENT : content}))
    const setOrderMailContent = (content) => setSettings(s=> ({...s, ORDER_CONFIRMATION_CONTENT : content}))
    
    useEffect(() => {
        abortController.current = new AbortController();
        axios.get(`${url}/get`, {
             signal: abortController.current.signal
            })
             .then(response => {
                 const data = response.data
                 setCurrencies(data.currencies);
                 data.settings.forEach(el => {
                     settings[el.key] = el.value;
                 });
                 setLogo(<img src={settings.SITE_LOGO ?? ''} alt="site-logo" className="site-logo" />)
             })
            .catch(error => {
                 const response = error.response
                if(isTokenExpired(response)) navigate("/login/2")
             })
        return ()=> {
            abortController.current.abort();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    
    const {SITE_NAME } = useSettings();

    useEffect(()=>{document.title = `${which ?? 'Settings'} - ${SITE_NAME}`},[SITE_NAME, which])

    useEffect(() => {
        if (!alert.show) return;
        alertRef.current && alertRef.current.focus()
    }, [alert, alertRef])

    useEffect(() => {
        if (stateC != null) {
           axios.post(`${statesUrl}/list`,stateC, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                },
                              signal: abortController.current.signal
            })
            .then(response => {
                const data = response.data;
                setStates(data)
                setToast(s=> ({...s, show:true, message: "Stated Loaded"}))
            })
            .catch(error => {
                const response = error.response
                console.log(response)
                if (isTokenExpired(response)) navigate("/login/2");
                setToast(s=> ({...s, show:true, message: response?.data.message}))
            }) 
        }
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stateC, accessToken])

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.target;
        const action = form.getAttribute("data-action");
        const data = new FormData(form);
        
        listFormData(data);

        setAlert((state) => ({ ...state, show: false }));
        const button = form.querySelector("button");
        button.disabled = true
        const text = button.textContent;
        button.innerHTML = SPINNERS_BORDER_HTML
        axios.post(`${url}/${action}`, data, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            },
                          signal: abortController.current.signal
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
                button.innerHTML = text;
            })
    }


    const handleChange = (e, which = "s") => {
        if (which === "s") {
            const key = e.target.id;
            const value = e.target.value;
            setSettings(state => ({
                ...state,
                [key]: value
            }))
        } else if (which === "c") {
            setSC(state => ({
                ...state,
                [e.target.id] : e.target.value
            }))
        } else if (which === "state") {
            setSS(state => ({
                ...state,
                [e.target.id] : e.target.value
            }))
        }
        
    }

    const handleSelectImage = (event, type) => {
        const input = event.target;
        const file = input.files[0]
        if (isFileValid(file, input)) {
            showThumbnail(file, setLogo, "logo thumbnail", null, "site-logo");
        }
    }

    const getCountries = () => {
        const btn = countriesRef.current;
        btn.disabled = true;
        btn.innerHTML = SPINNERS_BORDER_HTML;
         axios.get(`${countriesUrl}/list`,{
                    headers: {
                        "Authorization": `Bearer ${accessToken}`
                    },
                                  signal: abortController.current.signal
                })
             .then(response => {
                 const data = response.data
                 setArray(data);
                 newCRef.current.textContent = "New";
                setToast(s=> ({...s, show:true, message: "All countries loaded"}))
             })
            .catch(error => {
                 const response = error.response
                if(isTokenExpired(response)) navigate("/login/2")
            })
             .finally(() => {
                 btn.textContent = "Refresh Country List"
                 btn.disabled = false;
             })
    }
    const handlesC = (e, type = "country") => {
        const id = Number(e.target.value);
        const country = countries.find(c => c.id === id);
        if (type === "country") {
            setSC({ ...country });
        } else if (type === "state") {
            setStateC({ ...country });
            setSS(s => ({ ...s, country }))
        }
    }
    const handleSS = (e) => {
        const id = Number(e.target.value);
        const state = states.find(c => c.id === id);
        setSS({...state})
        newSRef.current.textContent = "New";
    }
    const validate = (type) => {
        let form = (type === "country") ? cFormRef.current : sFormRef.current;

        if (!form.checkValidity()) {
            form.reportValidity();
            return false;
        } 
        return true;
    }
    const handleNewC = (e, type = "country") => {
        const text = e.target.textContent;
        if (text === "New") {
            (type === "country") ? setSC(null) : setSS(s => ({country:s?.country}));
            e.target.textContent ="Add"
        } else if (text === "Add") {
            if (validate(type)) {
                const btn = e.target;
                const f = (type === "country") ? aCountry : aState;
                saveC(btn, f, "Add", type);
            } else {
                const message = (type === "country") ? `Invalid country name or code` : "Invalid state name";
                setToast(s=> ({...s, show:true, message}))
            }
        }
    }
    const handleDeleteC = (e, type = "country") => {
        const country = { ...sC };
        const state = { ...sS };
        const c = type === "country" ? country : state;
        const url = type === "country" ? `${countriesUrl}/delete/${country.id}` : `${statesUrl}/delete/${state.id}`
        if (c?.id !== undefined) {
            axios.delete(url,{
                    headers: {
                        "Authorization": `Bearer ${accessToken}`
                    },
                                  signal: abortController.current.signal
                })
                .then(() => {
                    type==="country" ? fCountries(country) : fState(state)
                    setToast(s=> ({...s, show:true, message: `${type} deleted`}))
                })
                .catch(error => {
                    const response = error.response
                    console.log(response)
                    if (isTokenExpired(response)) navigate("/login/2");
                    setToast(s=> ({...s, show:true, message: response?.data.message}))
                })
        } else {
            setToast(s=> ({...s, show:true, message: `Select a ${type} to delete`}))
        }
    }
    const handleUpdateC = (e, which = "country") => {
        let pass = validate(which);
        if (pass) {
            const btn = e.target;
            const f = which === "country" ? uCountries : uState;
            saveC(btn, f, "Update", which);
        } else {
            const message = (which === "country") ? `Invalid country name or code` : "Invalid state name";
            setToast(s=> ({...s, show:true, message}))
        }
    }
    const saveC = (btn, f, type, which) => {
        const data = which === "country" ? sC : sS;
        const url = which === "country" ? `${countriesUrl}/save` : `${statesUrl}/save`;
        const str = type === "Update" ? "Updated" : "Added";
        btn.disabled = true;
        btn.innerHTML = SPINNERS_BORDER_HTML
         axios.post(url,data, {
                    headers: {
                        "Authorization": `Bearer ${accessToken}`
                    },
                                  signal: abortController.current.signal
                })
                .then(response => {
                    const data = response.data;
                    f(data)
                    setToast(s=> ({...s, show:true, message: `Country ${str}`}))
                })
                .catch(error => {
                    const response = error.response
                    console.log(response)
                    if (isTokenExpired(response)) navigate("/login/2");
                    setToast(s=> ({...s, show:true, message: response?.data.message}))
                })
                    .finally(() => {
                        btn.disabled = false;
                        btn.textContent = type;
                    })
    }

    
    if(!accessToken) return <Navigate to="/login/2" />
    if(!hasAnyAuthority(auth, ["Admin"])) return <Navigate to="/403" />

    return ( 
        <Row className="justify-content-center mx-0">
            <Col md={10} className="border p-4">
                <ToastContainer className="p-3" position="bottom-end">
                    <Toast bg="secondary" show={toast.show} onClose={()=>setToast(s => ({...s,show:false}))} delay={3000} autohide>
                        <Toast.Body className="text-light">{toast.message}</Toast.Body>
                    </Toast>
                </ToastContainer>
                <Alert ref={alertRef} tabIndex={-1} variant={alert.variant} show={alert.show} dismissible onClose={toggleAlert}>
                    {alert.message}
                </Alert>
                
                <Tabs defaultActiveKey={which?.toLowerCase() ?? "general"} id="uncontrolled-tab-example" className="mb-3">
                    <Tab eventKey="general" title="General" className="px-2">
                        <Form className="add-user-form" onSubmit={handleSubmit} data-action="save_general">
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
                                    <Button className="fit-content mx-1" variant="primary" type="submit">
                                        Save
                                    </Button>
                                </div>
                            </Row>          
                        </Form>
                    </Tab>
                    <Tab eventKey="countries" title="Countries">
                        <p>Use this page to manage countries which will be displayed in the customer registration form.
                            Click Button to load country list first</p>
                        <Button ref={countriesRef} variant="success" className="my-2" onClick={getCountries} title="load countries">Load Country List</Button>
                        <select onChange={handlesC} value={sC?.id ?? ""} className="form-control my-2" size="4" style={{ height: "300px" }}>
                            <option value="" hidden>Select country</option>
                            {countries.map((c, i) => <option key={i} value={c.id}>{c.name}</option>)}
                        </select>
                        <Form ref={cFormRef}>
                            <Form.Group className="row my-2">
                                <Col md={6} className="mt-2">
                                    <Form.Group className="mb-3 row justify-content-center" controlId="name">
                                        <Form.Label className="form-label">Country Name</Form.Label>
                                        <Form.Control onChange={(e)=>handleChange(e,"c")} value={sC?.name ?? ""} className="form-input" minLength="3" maxLength="50" required />
                                    </Form.Group>
                                </Col>
                                
                                <Col md={3} className="mt-2">
                                    <Form.Group className="mb-3 row justify-content-center" controlId="code">
                                        <Form.Label className="form-label">Code</Form.Label>
                                        <Form.Control onChange={(e)=>handleChange(e,"c")} value={sC?.code ?? ""} className="form-input"  minLength="2" maxLength="5" required/>
                                    </Form.Group>
                                </Col>
                                <Col md={3} className="mt-2">
                                    <Button onClick={handleNewC} ref={newCRef} type="button" variant="secondary" >Add</Button>
                                    <Button onClick={handleUpdateC} type="button" variant="secondary" disabled={sC?.id === undefined} className="ms-2">Update</Button>
                                    <Button onClick={handleDeleteC} type="button" variant="secondary" disabled={sC?.id === undefined} className="ms-2">Delete</Button>
                                </Col>
                            </Form.Group>
                        </Form>
                        
                    </Tab>
                    <Tab eventKey="states" title="States">
                        <p>Use this page to manage countries' states which will be displayed in the customer registration form.
                            Click Button to load country list first</p>
                        <Button ref={countriesRef} variant="success" className="my-2" onClick={getCountries} title="load countries">Load Country List</Button>
                        <Form.Select onChange={e=>handlesC(e, "state")} value={stateC?.id ?? ""}>
                            <option value="" hidden>Select country</option>
                            {countries.map((c, i) => <option key={i} value={c.id}>{c.name}</option>)}
                        </Form.Select>
                        <select onChange={handleSS}  className="form-control my-2" size="4" style={{height: "300px"}}>
                            <option value="" hidden>Select state</option>
                            {states.map((s, i) => <option key={i} value={s.id}>{s.name}</option>)}
                        </select>
                        <Form ref={sFormRef}>
                            <Form.Group className="row my-2">
                                <Col md={6} className="mt-2">
                                    <Form.Group className="mb-3 row justify-content-center" controlId="name">
                                        <Form.Label className="form-label">State Name</Form.Label>
                                        <Form.Control onChange={(e)=>handleChange(e,"state")} value={sS?.name ?? ""} className="form-input" maxLength="50" minLength="3" required/>
                                    </Form.Group>
                                </Col>
                                <Col md={3} className="mt-2">
                                    <Button onClick={e => handleNewC(e,"state")} ref={newSRef} type="button" variant="secondary" >Add</Button>
                                    <Button onClick={e=>handleUpdateC(e, "state")} type="button" variant="secondary" disabled={sS?.id === undefined} className="ms-2">Update</Button>
                                    <Button onClick={e=>handleDeleteC(e, "state")} type="button" variant="secondary" disabled={sS?.id === undefined} className="ms-2">Delete</Button>
                                </Col>
                            </Form.Group>
                        </Form>
                        
                    </Tab>
                    <Tab eventKey="mail-server" title="Mail Server">
                       <Form className="add-user-form" onSubmit={handleSubmit} data-action="save_mail_server">
                            <Form.Group className="mb-3 row justify-content-center" controlId="MAIL_HOST">
                                <Form.Label className="form-label">SMTP Server Host Name:</Form.Label>
                                <Form.Control onChange={handleChange} value={settings.MAIL_HOST ?? ""} name="MAIL_HOST" className="form-input" type="name"/>
                            </Form.Group>
                            <Form.Group className="mb-3 row justify-content-center" controlId="MAIL_PORT">
                                <Form.Label className="form-label">Port Number:</Form.Label>
                                <Form.Control onChange={handleChange} value={settings.MAIL_PORT ?? ""} name="MAIL_PORT" className="form-input" type="text"/>
                            </Form.Group>
                            <Form.Group className="mb-3 row justify-content-center" controlId="MAIL_USERNAME">
                                <Form.Label className="form-label">Username:</Form.Label>
                                <Form.Control onChange={handleChange} value={settings.MAIL_USERNAME ?? ""} name="MAIL_USERNAME" className="form-input" type="text"/>
                            </Form.Group>
                            <Form.Group className="mb-3 row justify-content-center" controlId="MAIL_PASSWORD">
                                <Form.Label className="form-label">Password:</Form.Label>
                                <Form.Control onChange={handleChange} value={settings.MAIL_PASSWORD ?? ""} name="MAIL_PASSWORD" required className="form-input"/>
                            </Form.Group>
                            <Form.Group className="mb-3 row justify-content-center" controlId="SMTP_AUTH">
                                <Form.Label className="form-label">Server Authentication Required:</Form.Label>
                                <Form.Select onChange={handleChange} value={settings.SMTP_AUTH ?? ""} name="SMTP_AUTH" className="form-input">
                                    <option value="true">true</option>
                                    <option value="false">false</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3 row justify-content-center" controlId="SMTP_SECURED">
                                <Form.Label className="form-label">Server Required Secure Connection (TLS):</Form.Label>
                                <Form.Select onChange={handleChange} value={settings.SMTP_SECURED ?? ""} name="SMTP_SECURED" className="form-input">
                                    <option value="true">true</option>
                                    <option value="false">false</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3 row justify-content-center" controlId="MAIL_FROM">
                                <Form.Label className="form-label">From Email Address:</Form.Label>
                                <Form.Control onChange={handleChange} value={settings.MAIL_FROM ?? ""} name="MAIL_FROM" className="form-input" type="text"/>
                            </Form.Group>
                            <Form.Group className="mb-3 row justify-content-center" controlId="MAIL_SENDER_NAME">
                                <Form.Label className="form-label">Sender Name:</Form.Label>
                                <Form.Control onChange={handleChange} value={settings.MAIL_SENDER_NAME ?? ""} name="MAIL_SENDER_NAME" className="form-input" type="text"/>
                            </Form.Group>
                            <Row className="justify-content-center">
                                <div className="w-25"></div>
                                <div className="form-input ps-0 my-3">
                                    <Button className="fit-content mx-1" variant="primary" type="submit">
                                        Save Mail Settings
                                    </Button>
                                </div>
                            </Row> 
                        </Form>
                    </Tab>
                    <Tab eventKey="mail-template" title="Mail Template">
                        <Tabs defaultActiveKey={"customer_verification"} id="uncontrolled-tab-example" className="mb-3">
                            <Tab eventKey="customer_verification" title="Customer Verification" className="px-2">
                                <Form className="add-user-form" onSubmit={handleSubmit} data-action="save_verify_template">
                                    <Form.Group className="mb-3 row justify-content-center" controlId="CUSTOMER_VERIFY_SUBJECT">
                                        <Form.Label className="form-label">Email Subject:</Form.Label>
                                        <Form.Control onChange={handleChange} value={settings.CUSTOMER_VERIFY_SUBJECT ?? ""} name="CUSTOMER_VERIFY_SUBJECT" className="form-input" type="name"/>
                                    </Form.Group>
                                    <Form.Group className="mb-3 row justify-content-center" controlId="CUSTOMER_VERIFY_CONTENT">
                                        <Form.Label className="form-label">Email Content:</Form.Label>
                                        <TextEditor text={settings.CUSTOMER_VERIFY_CONTENT ?? ""} setText={setVerifyMailContent} width="form-input" height="big-height"/>
                                    </Form.Group>
                                    <Form.Control value={settings.CUSTOMER_VERIFY_CONTENT ?? ""} name="CUSTOMER_VERIFY_CONTENT" type="hidden" />
                                    <Row className="justify-content-center">
                                        <div className="w-25"></div>
                                        <div className="form-input ps-0 my-3">
                                            <Button className="fit-content mx-1" variant="primary" type="submit">
                                                Save
                                            </Button>
                                        </div>
                                    </Row>
                                </Form>
                            </Tab>
                            <Tab eventKey="order_confirmation" title="Order Confirmation" className="px-2">
                                 <Form className="add-user-form" onSubmit={handleSubmit} data-action="save_order_template">
                                    <Form.Group className="mb-3 row justify-content-center" controlId="ORDER_CONFIRMATION_SUBJECT">
                                        <Form.Label className="form-label">Email Subject:</Form.Label>
                                        <Form.Control onChange={handleChange} value={settings.ORDER_CONFIRMATION_SUBJECT ?? ""} name="ORDER_CONFIRMATION_SUBJECT" className="form-input" type="name"/>
                                    </Form.Group>
                                    <Form.Group className="mb-3 row justify-content-center" controlId="ORDER_CONFIRMATION_CONTENT">
                                        <Form.Label className="form-label">Email Content:</Form.Label>
                                        <TextEditor text={settings.ORDER_CONFIRMATION_CONTENT ?? ""} setText={setOrderMailContent} width="form-input" height="big-height"/>
                                    </Form.Group>
                                    <Form.Control value={settings.ORDER_CONFIRMATION_CONTENT ?? ""} name="ORDER_CONFIRMATION_CONTENT" type="hidden" />
                                    <Row className="justify-content-center">
                                        <div className="w-25"></div>
                                        <div className="form-input ps-0 my-3">
                                            <Button className="fit-content mx-1" variant="primary" type="submit">
                                                Save
                                            </Button>
                                        </div>
                                    </Row>
                                </Form>
                            </Tab>
                        </Tabs>
                    </Tab>
                    <Tab eventKey="payment" title="Payment">
                        <Form className="add-user-form" onSubmit={handleSubmit} data-action="save_payment">
                            <Form.Group className="mb-3 row justify-content-center" controlId="PAYPAL_API_BASE_URL">
                                <Form.Label className="form-label">Paypal Api Base URL:</Form.Label>
                                <Form.Control onChange={handleChange} value={settings.PAYPAL_API_BASE_URL ?? ""} name="PAYPAL_API_BASE_URL" className="form-input"/>
                            </Form.Group>
                            <Form.Group className="mb-3 row justify-content-center" controlId="PAYPAL_API_CLIENT_ID">
                                <Form.Label className="form-label">Paypal Api Client ID:</Form.Label>
                                <Form.Control onChange={handleChange} value={settings.PAYPAL_API_CLIENT_ID ?? ""} name="PAYPAL_API_CLIENT_ID" className="form-input"/>
                            </Form.Group>
                            <Form.Group className="mb-3 row justify-content-center" controlId="PAYPAL_API_CLIENT_SECRET">
                                <Form.Label className="form-label">Paypal Api Client Secret:</Form.Label>
                                <Form.Control onChange={handleChange} value={settings.PAYPAL_API_CLIENT_SECRET ?? ""} name="PAYPAL_API_CLIENT_SECRET" className="form-input"/>
                            </Form.Group>
                            <Row className="justify-content-center">
                                <div className="w-25"></div>
                                <div className="form-input ps-0 my-3">
                                    <Button className="fit-content mx-1" variant="primary" type="submit">
                                        Save
                                    </Button>
                                </div>
                            </Row> 
                        </Form>
                    </Tab>
                </Tabs>
            </Col>
            
        </Row>   
     );
}
 
export default SettingsPage;