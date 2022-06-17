import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
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
    const url = process.env.REACT_APP_SERVER_URL + "address";
    const deleteURL = `${url}/remove`;
    const { auth, setAuth } = useContext(AuthContext)
    const { array, setArray, filterWithId, updateArray } = useArray();
    const [countries, setCountries] = useState([]);
    const [toast, setToast] = useState({ show: false, message: "" })
    const [showDelete, setShowDelete] = useState({show:false, id:-1})
    const [showEdit, setShowEdit] = useState({show:false, address:{}})
    const [showAdd, setShowAdd] = useState(false)
    const abortController = new AbortController();

    useEffect(() => {
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
                if (isTokenExpired(res.response)) {
                    setAuth(null); navigate("/login");
                }
                const message = res.response.data.message ?? "An error ocurred, Try again";
                setToast(s=>({...s, show:true, message }))
            })
        } else {
           navigate("/login") 
        }
        // return () => {
        //     abortController.abort();
        // }
    }, [auth])

    useEffect(() => {
        axios.get(`${url}/countries`,{
            headers: {
                "Authorization": `Bearer ${auth?.accessToken}`
            }
        })
            .then(response => {
                const data = response.data;
                setCountries(data)
            })
            .catch(err => {
                console.error(err)
            })
    }, [])


     function handleDelete() {
        const id = showDelete.id

         axios.delete(`${deleteURL}/${id}`, {
                headers: {
                    "Authorization": `Bearer ${auth?.accessToken}`
                },
                signal: abortController.signal
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


     function listAddresses() {
        return (
            <Row className="mx-0 justify-content-start mt-3">
                {
                    array.map((c,i) => 
                        <Col xs={11} md={6} key={c.id} className="my-2">
                            <Card bg={c.defaultAddress ? "warning" : ""} className="text-start">
                                <Card.Header className="p-3 d-flex justify-content-between">
                                    <span>
                                        <span className="fw-bold">{(c.id) ? `Address #${i + 1}` : "Your Primary Address"}</span>
                                        &nbsp;
                                        {c.defaultAddress ?
                                            <span className="text-danger">[Default]</span>
                                            : <span className="text-success">[Set as Default]</span>}
                                    </span>
                                    <span className="fs-5 fw-bold">
                                        {(c.id) && <>
                                            <i onClick={e=>setShowEdit(s=>({...s, show:true, address:c}))} className="bi bi-pencil-square mx-1 px-2" title="edit"></i>
                                            <i
                                            onClick={e => setShowDelete(s => ({...s, show:true, id:c.id})) } 
                                            className="bi bi-archive-fill mx-1 px-2" title="delete">
                                            </i></>}
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
            <h3 className="my-2">Your Addresses</h3>
            <div><Link className="fs-4 fw-bold my-2" to="#" onClick={e=>setShowAdd(true)}>Add Address</Link></div>
            {
                (array.length > 0)
                ? <>
                    {listAddresses()}
                        <EditAddressModal showEdit={showEdit} setShowEdit={setShowEdit} updateAddresses={updateArray} countries={countries} />
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