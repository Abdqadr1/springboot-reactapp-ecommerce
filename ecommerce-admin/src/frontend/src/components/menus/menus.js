import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { Col, Row, Table } from "react-bootstrap";
import '../../css/users.css';
import DeleteModal from "../delete_modal";
import Menu from "./menu";
import { Navigate, useNavigate } from 'react-router-dom';
import useAuth from "../custom_hooks/use-auth";
import { isTokenExpired, SPINNERS_BORDER, hasAnyAuthority } from "../utilities";
import useThrottle from "../custom_hooks/use-throttle";
import useArray from "../custom_hooks/use-array";
import useSettings from "../custom_hooks/use-settings";
import EditMenu from "./edit_menu";
import MessageModal from "../message_modal";
import "../../css/articles.css";
import ViewArticle from "../articles/view_article";

const Menus = () => {
    const serverUrl = process.env.REACT_APP_SERVER_URL + "menu/";
    const [width, setWidth] = useState(window.innerWidth);
    const navigate = useNavigate();
    const [auth,] = useAuth();
    const {accessToken} = auth;
    const [isLoading, setLoading] = useState(true);
    const {array:menus, setArray:setMenus, filterWithId:removeMenu, updateArray, addToArray, updateItemProp} = useArray();
    const [updateMenu, setUpdateMenu] = useState({show:false, id: -1, menu: {}});
    const [viewArticle, setViewArticle] = useState({show:false, id: -1, article: {}});
    const [deleteMenu, setDeleteMenu] = useState({show:false, id: -1});
    const [message, setMessage] = useState({ show:false, message:"", title: ""});
    const abortController = useRef(new AbortController());
    const showUpdate = (type, id) => {
        const menu = menus.find(u => u.id === id)
        setUpdateMenu(s=> ({...s, type, show: true, id, menu}))
    };
     function showArticle(id) {
        const menu = menus.find(u => u.id === id);
        const article = menu.article;
        setViewArticle(s => ({ ...s, id, show: true, article }));
    }

    const sort = (a, b) => {
        const x = a.type.toLowerCase();
        const y = b.type.toLowerCase();
        if(x < y) return -1;
        if(x > y) return 1;
        return a.position - b.position;
    }

    const movePosition = (e, id, dir) => {
        const menu = menus.find(u => u.id === id);
        const data = {
            id, moveType: dir.toUpperCase(), menuType: menu.type
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
                    const menu = menus.find(m => m.id === d.id);
                    menu.position = d.position;
                })
                setMenus(menus.sort(sort))
                setMessage(s=> ({...s,show:true, title: "Move Menu", message:"Menu moved"}))
            })
            .catch(error => {
                const response = error?.response
                if(isTokenExpired(response)) navigate("/login/2")
                const message = response.data.message ?? "An error ocurred."
                setMessage(s=> ({...s,show:true, title: "Move Menu", message}))
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
                 setMenus(data.sort(sort));
             })
             .catch(error => {
                const response = error?.response
                if(isTokenExpired(response)) navigate("/login/2")
             })
             .finally(() => {
                 setLoading(false);
             })
    }, [serverUrl, accessToken, setMenus, navigate])
    
    const handleWindowWidthChange = useThrottle(() => setWidth(window.innerWidth), 500)
    const {SITE_NAME } = useSettings();
    
    useEffect(()=>{document.title = `Menus - ${SITE_NAME}`},[SITE_NAME])
    

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
    
    function deletingMenu() {
        const id = deleteMenu.id
        const url = serverUrl + "delete/" + id;
        axios.get(url, {
             headers: {
                 "Authorization": `Bearer ${accessToken}`
             },
             signal: abortController.current.signal
        })
            .then(() => {
                removeMenu({id})
                setDeleteMenu({ ...deleteMenu, show: false });
                setMessage(s=> ({...s,show:true, title: "Delete Menu", message: "Menu has been deleted."}))
            })
            .catch(error => {
                const response = error?.response
                if(isTokenExpired(response)) navigate("/login/2")
                setMessage(s=> ({...s,show:true, title: "Delete Menu", message: "An error ocurred."}))
        })
    }
    function updateMenuStatus(id, status) {
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
                const message = "Menu has been " + stat;
                setMessage(s=> ({...s,show:true, title: "Enable Menu", message}))
            })
            .catch(error => {
                const response = error?.response
                if(isTokenExpired(response)) navigate("/login/2")
                setMessage(s=> ({...s,show:true, title: "Enable Menu", message: "An error ocurred."}))
        })
    }

    function updatingMenu(menu, type) {
        if(type.toLowerCase() === "new"){
            addToArray(menu);
        } else {
            updateArray(menu);
        }
    }

    function listMenus(menus, type) {
        return (menus.length > 0)
            ? menus.map(menu => <Menu key={menu.id} type={type} menu={menu}
                showUpdate={showUpdate} setDeleteMenu={setDeleteMenu} movePosition={movePosition}
                updateStatus={updateMenuStatus} showArticle={showArticle}
            />)
            : ((type === 'detailed')
                ? <tr><td colSpan={8} className="text-center" >No menu found</td></tr>
                : <div className="text-center">No menu found</div>)
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
                                <h3 className="">Manage Menus</h3>
                                <div>
                                    <span onClick={()=>setUpdateMenu(s=> ({...s, type: "New", show: true, id:null, menu: {}}))} 
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
                                        <th>Title</th>
                                        <th>Type</th>
                                        <th className="hideable-col">Article</th>
                                        <th>Enabled</th>
                                        <th>Position</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody className="bg-light text-secondary">
                                    {listMenus(menus,"detailed")}
                                </tbody>
                            </Table> : ""
                        }
                    {
                        (width <= 768)
                            ? <div className="less-details p-2 mb-3">
                                {listMenus(menus, "less")}
                            </div> : ""
                    }
                <EditMenu data={updateMenu} setData={setUpdateMenu} updateMenu={updatingMenu} />
                <ViewArticle data={viewArticle} setData={setViewArticle}/>
                <MessageModal obj={message} setShow={setMessage} />
                <DeleteModal deleteObject={deleteMenu} setDeleteObject={setDeleteMenu} deletingFunc={deletingMenu} type="menu" />
            </>
        }
        
        </>
     );
}
 
export default Menus;