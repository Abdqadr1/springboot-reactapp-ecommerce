import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { Col, Form, Row, Table, Button } from "react-bootstrap";
import '../../css/users.css';
import DeleteModal from "../delete_modal";
import MyPagination from "../paging";
import Menu from "./menu";
import { Navigate, useNavigate } from 'react-router-dom';
import useAuth from "../custom_hooks/use-auth";
import { isTokenExpired, SEARCH_ICON, SPINNERS_BORDER_HTML, SPINNERS_BORDER, hasAnyAuthority } from "../utilities";
import useThrottle from "../custom_hooks/use-throttle";
import useArray from "../custom_hooks/use-array";
import useSettings from "../custom_hooks/use-settings";
import ViewMenu from "./view_menu";
import EditMenu from "./edit_menu";
import MessageModal from "../message_modal";
import "../../css/articles.css";

const Menus = () => {
    const serverUrl = process.env.REACT_APP_SERVER_URL + "menu/";
    const [width, setWidth] = useState(window.innerWidth);
    const navigate = useNavigate();
    const [auth,] = useAuth();
    const {accessToken} = auth;
    const [keyword, setKeyword] = useState("");
    const searchBtnRef = useRef();
    const [isLoading, setLoading] = useState(true);
    const {array:menus, setArray:setMenus, filterWithId:removeMenu, updateArray, addToArray, updateItemProp} = useArray();
    const [updateMenu, setUpdateMenu] = useState({show:false, id: -1, menu: {}});
    const [viewMenu, setViewMenu] = useState({show:false, id: -1, menu: {}});
    const [deleteMenu, setDeleteMenu] = useState({show:false, id: -1});
    const [message, setMessage] = useState({ show:false, message:"", title: ""});
    const abortController = useRef(new AbortController());
    const showUpdate = (type, id) => {
        const menu = menus.filter(u => u.id === id)[0]
        setUpdateMenu(s=> ({...s, type, show: true, id, menu}))
    };
    const [pageInfo, setPageInfo] = useState({
        number: 1, totalPages: 1, startCount: 1,
        endCount: null, totalElements: null,numberPerPage: 1
    })
    const [sort, setSort] = useState({ field: "title", dir: "asc" })
    
    const changePage = useCallback(function (number, search, button) {
        number = number ?? 1;
         const keyword = (search) ? encodeURIComponent(search) : "";
        setLoading(true);
         if (button) {
            button.disabled = true
            button.innerHTML = SPINNERS_BORDER_HTML
         }
         axios.get(`${serverUrl}page/${number}?sortField=${sort.field}&dir=${sort.dir}&keyword=${keyword}`, {
             headers: {
                 "Authorization": `Bearer ${accessToken}`
             },
             signal: abortController.current.signal
         })
             .then(response => {
                 const data = response.data;
                 setPageInfo(state => ({
                     ...state,
                     endCount: data.endCount,
                     startCount: data.startCount,
                     totalPages: data.totalPages,
                     totalElements: data.totalElements,
                     numberPerPage: data.numberPerPage
                 }));
                 setMenus(data.menus);
             })
             .catch(error => {
                const response = error?.response
                if(isTokenExpired(response)) navigate("/login/2")
             })
             .finally(() => {
                 setLoading(false);
                 if (button) {
                    button.disabled = false
                    button.innerHTML = SEARCH_ICON;
                }
             })
    }, [serverUrl, sort.field, sort.dir, accessToken, setMenus, navigate])
    
    const handleWindowWidthChange = useThrottle(() => setWidth(window.innerWidth), 500)
    const {SITE_NAME } = useSettings();
    
    useEffect(()=>{document.title = `Menus - ${SITE_NAME}`},[SITE_NAME])
    

    useEffect(() => {
        abortController.current = new AbortController();
        changePage(pageInfo.number, keyword)

        return ()=> {
            abortController.current.abort();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [changePage, pageInfo?.number])
    
    useEffect(() => {
        window.addEventListener("resize", handleWindowWidthChange)
        return () => {
            window.removeEventListener("resize", handleWindowWidthChange)
        }
    
    })
    
    function showMenu(id) {
        const menu = menus.find(u => u.id === id);
        setViewMenu(s => ({ ...s, id, show: true, menu }));
    }
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
                updateItemProp(id, "published", status);
                const stat = status ? "published" : "unpublished";
                const message = "Menu has been " + stat;
                setMessage(s=> ({...s,show:true, title: "Publish Menu", message}))
            })
            .catch(error => {
                setMessage(s=> ({...s,show:true, title: "Publish Menu", message: "An error ocurred."}))
        })
    }

    function updatingMenu(menu, type) {
        if(type.toLowerCase() === "new"){
            addToArray(menu);
        } else {
            updateArray(menu);
        }
    }

    function handleFilter(event) {
        event.preventDefault();
        pageInfo.number = 1;
        changePage(null, keyword, searchBtnRef.current)
    }
    function clearFilter() {
       if (keyword.length > 1) {
            setKeyword("")
            pageInfo.number = 1;
            changePage(null, "")
        }
    }
    
    function isSort(name) {
        if (name === sort.field) {
           if(sort.dir === "asc") return (<i className="bi bi-caret-up-fill text-light"></i> )
           else return (<i className="bi bi-caret-down-fill text-light"></i> )
        }
        return ""
    }

    function handleSort(event) {
        const id = event.target.id;
        const field = (id === sort.field) ? sort.field : id;
        const dir = (sort.dir === "asc" && field === sort.field) ? "desc" : "asc";
        setSort({ field, dir })
    }

    function listMenus(menus, type) {
        return (menus.length > 0)
            ? menus.map(menu => <Menu key={menu.id} type={type} menu={menu}
                showUpdate={showUpdate} setDeleteMenu={setDeleteMenu} showMenu={showMenu}
                updateStatus={updateMenuStatus}
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
                                    <span onClick={()=>setUpdateMenu(s=> ({...s, type: "New", show: true, id:null, menu: {}}))} className="text-secondary cursor-pointer">
                                        <i title="New menu" className="bi bi-folder-plus fs-2"></i>
                                    </span>
                                </div>
                            </Col>
                            <Col xs={12} md={7} className="my-2">
                                <Form className="row justify-content-between" onSubmit={handleFilter}>
                                    <Form.Group as={Row} className="mb-3" controlId="keyword">
                                        <Col sm="2" md="2">
                                            <label className="d-block text-start text-md-end fs-5" htmlFor="keyword">Filter:</label>
                                        </Col>
                                        <Col sm="9" md="6">
                                            <Form.Control value={keyword} onChange={e=>setKeyword(e.target.value)} type="text" placeholder="keyword" required />
                                        </Col>
                                        <Col sm="12" md="4">
                                        <div className="mt-md-0 mt-2">
                                            <Button ref={searchBtnRef} variant="primary" className="mx-1" type="submit">
                                                <i title="search keyword" className="bi bi-search"></i>   
                                            </Button>
                                            <Button onClick={clearFilter} variant="secondary" className="mx-1" type="button" alt="clear search">
                                                <i title="clear keyword" className="bi bi-eraser"></i>
                                            </Button>
                                        </div>
                                        </Col>
                                    </Form.Group>
                                </Form> 
                            </Col>
                        </Row>
                        {
                            (width >= 769) ?
                                <Table bordered responsive hover className="more-details">
                                <thead className="bg-dark text-light">
                                    <tr>
                                        <th onClick={handleSort} id="id" className="cursor-pointer">ID {isSort("id")}</th>
                                        <th onClick={handleSort} id="title" className="cursor-pointer">Title {isSort("title")}</th>
                                        <th onClick={handleSort} id="menuType" className="cursor-pointer">Type {isSort("menuType")}</th>
                                        <th onClick={handleSort} id="user" className="cursor-pointer  hideable-col">Created by {isSort("user")}</th>
                                        <th onClick={handleSort} id="updatedTime" className="cursor-pointer">Updated Time {isSort("updatedTime")}</th>
                                        <th>Published</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
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
                {(menus.length > 0) ? <MyPagination pageInfo={pageInfo} setPageInfo={setPageInfo} /> : ""}
                <EditMenu data={updateMenu} setData={setUpdateMenu} updateMenu={updatingMenu} />
                <ViewMenu data={viewMenu} setData={setViewMenu}/>
                <MessageModal obj={message} setShow={setMessage} />
                <DeleteModal deleteObject={deleteMenu} setDeleteObject={setDeleteMenu} deletingFunc={deletingMenu} type="menu" />
            </>
        }
        
        </>
     );
}
 
export default Menus;