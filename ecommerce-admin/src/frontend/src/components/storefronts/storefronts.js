import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { Col, Row, Table } from "react-bootstrap";
import '../../css/users.css';
import DeleteModal from "../delete_modal";
import Storefront from "./storefront";
import { Navigate, useNavigate } from 'react-router-dom';
import useAuth from "../custom_hooks/use-auth";
import { isTokenExpired, SPINNERS_BORDER, hasAnyAuthority } from "../utilities";
import useThrottle from "../custom_hooks/use-throttle";
import useArray from "../custom_hooks/use-array";
import useSettings from "../custom_hooks/use-settings";
import MessageModal from "../message_modal";
import "../../css/articles.css";

const Storefronts = () => {
    const serverUrl = process.env.REACT_APP_SERVER_URL + "storefront/";
    const [width, setWidth] = useState(window.innerWidth);
    const navigate = useNavigate();
    const [auth,] = useAuth();
    const {accessToken} = auth;
    const [isLoading, setLoading] = useState(true);
    const {array:storefronts, setArray:setStorefronts, filterWithId:removeStorefront, updateItemProp} = useArray();
    const [updateStorefront, setUpdateStorefront] = useState({show:false, id: -1, storefront: {}});
    const [deleteStorefront, setDeleteStorefront] = useState({show:false, id: -1});
    const [message, setMessage] = useState({ show:false, message:"", title: ""});
    const abortController = useRef(new AbortController());
    const showUpdate = (type, id) => {
        const storefront = storefronts.find(u => u.id === id)
        setUpdateStorefront(s=> ({...s, type, show: true, id, storefront}))
    };

    const sort = (a, b) => {
        return a.position - b.position;
    }

    const movePosition = (e, id, dir) => {
        const storefront = storefronts.find(u => u.id === id);
        const data = {
            id, moveType: dir.toUpperCase(), menuType: storefront.type
        }
        const url = serverUrl + "move";
        axios.post(url, data, {
             headers: {
                 "Authorization": `Bearer ${accessToken}`
             },
             signal: abortController.current.signal
        })
            .then((res) => {
                const data = res.data;
                data.forEach(d => {
                    const storefront = storefronts.find(m => m.id === d.id);
                    storefront.position = d.position;
                })
                setStorefronts(storefronts.sort(sort))
                setMessage(s=> ({...s,show:true, title: "Move Storefront", message:"Storefront moved"}))
            })
            .catch(error => {
                const response = error?.response
                if(isTokenExpired(response)) navigate("/login/2")
                const message = response.data.message ?? "An error ocurred."
                setMessage(s=> ({...s,show:true, title: "Move Storefront", message}))
        })
    }
    
    const changePage = useCallback(function () {
        setLoading(true);
         axios.get(`${serverUrl}page`, {
             headers: {
                 "Authorization": `Bearer ${accessToken}`
             },
             signal: abortController.current.signal
         })
             .then(response => {
                 const data = response.data;
                 setStorefronts(data.sort(sort));
             })
             .catch(error => {
                const response = error?.response
                if(isTokenExpired(response)) navigate("/login/2")
             })
             .finally(() => {
                 setLoading(false);
             })
    }, [serverUrl, accessToken, setStorefronts, navigate])
    
    const handleWindowWidthChange = useThrottle(() => setWidth(window.innerWidth), 500)
    const {SITE_NAME } = useSettings();
    
    useEffect(()=>{document.title = `Storefronts - ${SITE_NAME}`},[SITE_NAME])
    

    useEffect(() => {
        abortController.current = new AbortController();
        changePage()

        return ()=> {
            abortController.current.abort();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [changePage])
    
    useEffect(() => {
        window.addEventListener("resize", handleWindowWidthChange)
        return () => {
            window.removeEventListener("resize", handleWindowWidthChange)
        }
    
    })
    
    function deletingStorefront() {
        const id = deleteStorefront.id
        const url = serverUrl + "delete/" + id;
        axios.get(url, {
             headers: {
                 "Authorization": `Bearer ${accessToken}`
             },
             signal: abortController.current.signal
        })
            .then(() => {
                removeStorefront({id})
                setDeleteStorefront({ ...deleteStorefront, show: false });
                setMessage(s=> ({...s,show:true, title: "Delete Storefront", message: "Storefront has been deleted."}))
            })
            .catch(error => {
                const response = error?.response
                if(isTokenExpired(response)) navigate("/login/2")
                setMessage(s=> ({...s,show:true, title: "Delete Storefront", message: "An error ocurred."}))
        })
    }
    function updateStorefrontStatus(id, status) {
        const url = serverUrl + id+ "/enable/" +  status;
        axios.get(url, {
             headers: {
                 "Authorization": `Bearer ${accessToken}`
             },
             signal: abortController.current.signal
        })
            .then(() => {
                updateItemProp(id, "enabled", status);
                const stat = status ? "enabled" : "disabled";
                const message = "Storefront has been " + stat;
                setMessage(s=> ({...s,show:true, title: "Enable Storefront", message}))
            })
            .catch(error => {
                const response = error?.response
                if(isTokenExpired(response)) navigate("/login/2")
                setMessage(s=> ({...s,show:true, title: "Enable Storefront", message: "An error ocurred."}))
        })
    }

    function updatingStorefront(storefront, type) {
        if(type.toLowerCase() === "new"){
            storefronts.push(storefront)
        } else {
            const index = storefronts.findIndex(arr => arr.id === storefront.id);
            storefronts[index] = storefront;
        }
        setStorefronts(storefronts.sort(sort))
    }

    function listStorefronts(storefronts, type) {
        return (storefronts.length > 0)
            ? storefronts.map(storefront => <Storefront key={storefront.id} type={type} storefront={storefront}
                showUpdate={showUpdate} setDeleteStorefront={setDeleteStorefront} movePosition={movePosition}
                updateStatus={updateStorefrontStatus}
            />)
            : ((type === 'detailed')
                ? <tr><td colSpan={8} className="text-center" >No items found</td></tr>
                : <div className="text-center">No items found</div>)
    }

    if(!accessToken) return <Navigate to="/login/2" />
    if(!hasAnyAuthority(auth, ["Admin", "Editor"])) return <Navigate to="/403" />
    return ( 
          <>
            {
                (isLoading)
                    ? <div className="mx-auto" style={{ height: "40vh", display: "grid" }}>{SPINNERS_BORDER}</div>
                        :<>
                        <Row className="justify-content-between align-items-center p-3 mx-0">
                            <Col xs={12} md={5} className="my-2">
                                <h3 className="">Manage Storefronts</h3>
                                <div>
                                    <span onClick={()=>setUpdateStorefront(s=> ({...s, type: "New", show: true, id:null, storefront: {}}))} 
                                        className="text-secondary cursor-pointer">
                                        <i title="New article" className="bi bi-folder-plus fs-2"></i>
                                    </span>
                                </div>
                            </Col>
                            <Col xs={12} md={7} className="my-2">
                            </Col>
                        </Row>
                        {
                            (width >= 769) ?
                                <Table bordered responsive hover className="more-details">
                                <thead className="bg-light text-secondary">
                                    <tr>
                                        <th>ID</th>
                                        <th>Heading</th>
                                        <th>Type</th>
                                        <th>Position</th>
                                        <th>Enabled</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody className="bg-light text-secondary">
                                    {listStorefronts(storefronts,"detailed")}
                                </tbody>
                            </Table> : ""
                        }
                    {
                        (width <= 768)
                            ? <div className="less-details p-2 mb-3">
                                {listStorefronts(storefronts, "less")}
                            </div> : ""
                    }
                {/* <EditStorefront data={updateStorefront} setData={setUpdateStorefront} updateStorefront={updatingStorefront} /> */}
                <MessageModal obj={message} setShow={setMessage} />
                <DeleteModal deleteObject={deleteStorefront} setDeleteObject={setDeleteStorefront} deletingFunc={deletingStorefront} type="storefront" />
            </>
        }
        
        </>
     );
}
 
export default Storefronts;