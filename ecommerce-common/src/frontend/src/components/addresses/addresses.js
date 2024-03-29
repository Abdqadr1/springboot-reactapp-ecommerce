import { useContext, useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../custom_hooks/use-auth";
import useArray from "../custom_hooks/use-array";
import CustomToast from "../custom_toast";
import { isTokenExpired, SPINNERS_BORDER } from "../utilities";
import Search from "../search";
import DeleteModal from "../delete_modal";
import { Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import AddAddressModal from "./add_address";
import EditAddressModal from "./edit_address";
import useSettings from "../use-settings";
const Addresses = () => {
    const navigate = useNavigate();
    const [searchParams,] = useSearchParams();
    let redirectURL = searchParams.get("r");
    let head = "Your Addresses", select="Set as Default", defaultSelect="Default";
    if (redirectURL === "checkout") {
        head = "Choose your shipping address";
        defaultSelect = "Currently Selected";
        select = "Choose";
    }
    redirectURL = redirectURL ? "/" + redirectURL : redirectURL;

    const url = process.env.REACT_APP_SERVER_URL + "address";
    const deleteURL = `${url}/remove`;
    const { auth, setAuth } = useContext(AuthContext)
    const { array, setArray, filterWithId, updateArray } = useArray();
    const [countries, setCountries] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [toast, setToast] = useState({ show: false, message: "" })
    const [showDelete, setShowDelete] = useState({show:false, id:-1})
    const [showEdit, setShowEdit] = useState({show:false, address:{}})
    const [showAdd, setShowAdd] = useState(false)
    const [abortController, loadRef] = [useRef(new AbortController()), useRef()];

    
    const {SITE_NAME} = useSettings();
    useEffect(() => {
        document.title = `Addresses - ${SITE_NAME}`;
        loadRef?.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [SITE_NAME])

     const loadAddresses = useCallback((abortController) => {
       setLoading(true);
        axios.get(url, {
            headers: {
                "Authorization": `Bearer ${auth?.accessToken}`,
            },
            signal: abortController.signal
        })
            .then(response => {
                setArray(response.data);
            })
            .catch(res => {
                if (isTokenExpired(res?.response)) {
                    setAuth(null); navigate("/login");
                }
                const message = res.response?.data?.message ?? "Could not fetch addresses";
                setToast(s => ({ ...s, show: true, message }))
            }).finally(() => setLoading(false))
      },[auth?.accessToken, navigate, setArray, setAuth, url],
    )

    useEffect(() => {
        abortController.current = new AbortController();
        loadAddresses(abortController.current);
        return () => {
            abortController.current.abort();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loadAddresses])

    useEffect(() => {
        const abortController = new AbortController();
        axios.get(`${url}/countries`,{
            headers: {
                "Authorization": `Bearer ${auth?.accessToken}`
            },
            signal: abortController.signal
        })
            .then(response => {
                const data = response.data;
                setCountries(data)
            })
            .catch(err => {
                if (isTokenExpired(err?.response)) {
                    setAuth(null); navigate("/login");
                }
            })

        return () => {
            abortController.abort();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    function handleDelete() {
        const id = showDelete.id
         axios.delete(`${deleteURL}/${id}`, {
                headers: {
                    "Authorization": `Bearer ${auth?.accessToken}`
             },
             signal: abortController.current.signal
            })
            .then(response => {
                const data = response.data;
                filterWithId({id})
                setToast(s=> ({...s, show:true, message: data}))
            })
            .catch(res => {
                if (isTokenExpired(res.response)) {
                    setAuth(null); navigate("/login");
                }
                alert(res.response?.data.message)
            }).finally(() => setShowDelete(s=>({...s, show:false})))
    }
    function setDefaultAddress(id) {
        setLoading(true);
         axios.get(`${url}/default/${id}`,{
            headers: {
                "Authorization": `Bearer ${auth?.accessToken}`
            }
        })
        .then(() => {
            const newArray = array.map(a => {
                a.defaultAddress = (a.id === id);
                return a;
            })
            setArray([...newArray])
            if (redirectURL) navigate(redirectURL);
        })
        .catch(err => {
            if (isTokenExpired(err?.response)) {
                setAuth(null); navigate("/login");
            }
            setToast(s=>({...s, show:true, message: "Could not set address as default"}))
        }).finally(()=>setLoading(false))
    }


     function listAddresses() {
        return (
            <Row className="mx-0 justify-content-center justify-content-md-start mt-3">
                {
                    array.map((c,i) => 
                        <Col xs={11} md={6} key={c.id} className="my-2">
                            <Card bg={c.defaultAddress ? "warning" : ""} className="text-start">
                                <Card.Header className="py-3 px-2 d-flex justify-content-between">
                                    <span>
                                        <span className="fw-bold">{(c.id) ? `Address #${i + 1}` : "Your Primary Address"}</span>
                                        &nbsp;
                                        {c.defaultAddress ?
                                            <span className="text-danger">[{defaultSelect}]</span>
                                            : <span onClick={e=>setDefaultAddress(c.id)} className="text-success action">[{select}]</span>}
                                    </span>
                                    <span className="fs-6 fw-bold">
                                        {(c.id > 0) && <>
                                                <i onClick={e=>setShowEdit(s=>({...s, show:true, address:c}))} 
                                                    className="bi bi-pencil-square px-2 action text-primary" title="edit"
                                                ></i>
                                                <i
                                            onClick={e => setShowDelete(s => ({...s, show:true, id:c.id})) } 
                                            className="bi bi-archive-fill px-2 text-danger action" title="delete">
                                            </i>
                                        </>}
                                    </span>
                                </Card.Header>
                                <Card.Body className="px-3 pb-5">
                                    <Card.Text>
                                        {`${c.firstName} ${c.lastName}, ${c.mainAddress}, ${c.extraAddress}, 
                                        ${c.city}, ${c.state}, ${c.country.name}, Postal Code: ${c.postalCode}, 
                                        Phone Number: ${c.phoneNumber}`}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    )
                }
            </Row>
        )
    }

    if (!auth) navigate("/login");
    return ( 
         <>
            <div className="loadRef" tabIndex="22" ref={loadRef}></div>
            {
                (isLoading)
                    ? <div className="mx-auto" style={{ height: "30vh", display: "grid" }}>{SPINNERS_BORDER}</div>
                    :  <>
                        <Search />
                        <h3 className="my-2">{head}</h3>
                        <div><Link className="fs-4 fw-bold my-2" to="#" onClick={e=>setShowAdd(true)}>Add Address</Link></div>
                        {
                            (array.length > 0)
                            ? <>
                                {listAddresses()}
                                    <EditAddressModal showEdit={showEdit} setShowEdit={setShowEdit} updateAddresses={updateArray} countries={countries} redirect={redirectURL} />
                                <DeleteModal deleteObject={showDelete} setDeleteObject={setShowDelete} deletingFunc={handleDelete} type="Address" />
                            </>
                            :<div className="mt-5">
                                <h4 className="my-3">You have not added any addresses yet</h4>
                            </div>
                        }
                        <CustomToast {...toast} setToast={setToast} position="bottom-end" />
                        <AddAddressModal show={showAdd} setShow={setShowAdd} countries={countries} setAdd={setArray} />
                    </>
            }
            </>
       
    );
}
 
export default Addresses;