import { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "./custom_hooks/use-auth";
import useArray from "./custom_hooks/use-array";
import CustomToast from "./custom_toast";
import { isTokenExpired } from "./utilities";
import Search from "./search";
import DeleteModal from "./delete_modal";
import { Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import AddAddressModal from "./add_address";
import EditAddressModal from "./edit_address";
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
    const [toast, setToast] = useState({ show: false, message: "" })
    const [showDelete, setShowDelete] = useState({show:false, id:-1})
    const [showEdit, setShowEdit] = useState({show:false, address:{}})
    const [showAdd, setShowAdd] = useState(false)
    // const abortController = new AbortController();

    useEffect(() => {
        const abortController = new AbortController();
        if (auth) {
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
                console.error(res)
                if (isTokenExpired(res?.response)) {
                    setAuth(null); navigate("/login");
                }
                const message = res.response.data?.message ?? "An error ocurred, Try again";
                setToast(s=>({...s, show:true, message }))
            })
        } else {
           navigate("/login") 
        }
        return () => {
            abortController.abort();
        }
    }, [auth])

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
                console.error(err)
                if (isTokenExpired(err?.response)) {
                    setAuth(null); navigate("/login");
                }
            })

        return () => {
            abortController.abort();
        }
    }, [])


    function handleDelete() {
        const id = showDelete.id
         axios.delete(`${deleteURL}/${id}`, {
                headers: {
                    "Authorization": `Bearer ${auth?.accessToken}`
                }
            })
            .then(response => {
                const data = response.data;
                filterWithId({id})
                setToast(s=> ({...s, show:true, message: data}))
            })
            .catch(res => {
                console.error(res)
                if (isTokenExpired(res.response)) {
                    setAuth(null); navigate("/login");
                }
                alert(res.response?.data.message)
            }).finally(() => setShowDelete(s=>({...s, show:false})))
    }
    function setDefaultAddress(id) {
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
            console.error(err)
            if (isTokenExpired(err?.response)) {
                setAuth(null); navigate("/login");
            }
            setToast(s=>({...s, show:true, message: "Could not set address as default"}))
        })
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

    
    return ( 
        <>
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
    );
}
 
export default Addresses;