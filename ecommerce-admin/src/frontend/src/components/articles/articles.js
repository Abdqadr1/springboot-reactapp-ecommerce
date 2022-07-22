import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { Col, Form, Row, Table, Button } from "react-bootstrap";
import '../../css/users.css';
import DeleteModal from "../delete_modal";
import MyPagination from "../paging";
import Article from "./article";
import { Navigate, useNavigate } from 'react-router-dom';
import useAuth from "../custom_hooks/use-auth";
import { isTokenExpired, SEARCH_ICON, SPINNERS_BORDER_HTML, SPINNERS_BORDER, hasAnyAuthority } from "../utilities";
import useThrottle from "../custom_hooks/use-throttle";
import useArray from "../custom_hooks/use-array";
import useSettings from "../custom_hooks/use-settings";
import ViewArticle from "./view_article";
import EditArticle from "./edit_article";
import MessageModal from "../message_modal";
import "../../css/articles.css";

const Articles = () => {
    const serverUrl = process.env.REACT_APP_SERVER_URL + "article/";
    const [width, setWidth] = useState(window.innerWidth);
    const navigate = useNavigate();
    const [auth,] = useAuth();
    const {accessToken} = auth;
    const [keyword, setKeyword] = useState("");
    const searchBtnRef = useRef();
    const [isLoading, setLoading] = useState(true);
    const {array:articles, setArray:setArticles, filterWithId:removeArticle, updateArray, addToArray, updateItemProp} = useArray();
    const [updateArticle, setUpdateArticle] = useState({show:false, id: -1, article: {}});
    const [viewArticle, setViewArticle] = useState({show:false, id: -1, article: {}});
    const [deleteArticle, setDeleteArticle] = useState({show:false, id: -1});
    const [message, setMessage] = useState({ show:false, message:"", title: ""});
    const abortController = useRef(new AbortController());
    const showUpdate = (type, id) => {
        const article = articles.filter(u => u.id === id)[0]
        setUpdateArticle(s=> ({...s, type, show: true, id, article}))
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
                 setArticles(data.articles);
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
    }, [serverUrl, sort.field, sort.dir, accessToken, setArticles, navigate])
    
    const handleWindowWidthChange = useThrottle(() => setWidth(window.innerWidth), 500)
    const {SITE_NAME } = useSettings();
    
    useEffect(()=>{document.title = `Articles - ${SITE_NAME}`},[SITE_NAME])
    

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
    
    function showArticle(id) {
        const article = articles.find(u => u.id === id);
        setViewArticle(s => ({ ...s, id, show: true, article }));
    }
    function deletingArticle() {
        const id = deleteArticle.id
        const url = serverUrl + "delete/" + id;
        axios.get(url, {
             headers: {
                 "Authorization": `Bearer ${accessToken}`
             },
             signal: abortController.current.signal
        })
            .then(() => {
                removeArticle({id})
                setDeleteArticle({ ...deleteArticle, show: false });
                setMessage(s=> ({...s,show:true, title: "Delete Article", message: "Article has been deleted."}))
            })
            .catch(error => {
                const response = error?.response
                if(isTokenExpired(response)) navigate("/login/2")
                setMessage(s=> ({...s,show:true, title: "Delete Article", message: "An error ocurred."}))
        })
    }
    function updateArticleStatus(id, status) {
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
                const message = "Article has been " + stat;
                setMessage(s=> ({...s,show:true, title: "Publish Article", message}))
            })
            .catch(error => {
                const response = error?.response
                if(isTokenExpired(response)) navigate("/login/2")
                setMessage(s=> ({...s,show:true, title: "Publish Article", message: "An error ocurred."}))
        })
    }

    function updatingArticle(article, type) {
        if(type.toLowerCase() === "new"){
            addToArray(article);
        } else {
            updateArray(article);
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
           if(sort.dir === "asc") return (<i className="bi bi-caret-up-fill text-dark"></i> )
           else return (<i className="bi bi-caret-down-fill text-dark"></i> )
        }
        return ""
    }

    function handleSort(event) {
        const id = event.target.id;
        const field = (id === sort.field) ? sort.field : id;
        const dir = (sort.dir === "asc" && field === sort.field) ? "desc" : "asc";
        setSort({ field, dir })
    }

    function listArticles(articles, type) {
        return (articles.length > 0)
            ? articles.map(article => <Article key={article.id} type={type} article={article}
                showUpdate={showUpdate} setDeleteArticle={setDeleteArticle} showArticle={showArticle}
                updateStatus={updateArticleStatus}
            />)
            : ((type === 'detailed')
                ? <tr><td colSpan={8} className="text-center" >No article found</td></tr>
                : <div className="text-center">No article found</div>)
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
                                <h3 className="">Manage Articles</h3>
                                <div>
                                    <span onClick={()=>setUpdateArticle(s=> ({...s, type: "New", show: true, id:null, article: {}}))} className="text-secondary cursor-pointer">
                                        <i title="New article" className="bi bi-folder-plus fs-2"></i>
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
                                <thead className="bg-light text-secondary">
                                    <tr>
                                        <th onClick={handleSort} id="id" className="cursor-pointer">ID {isSort("id")}</th>
                                        <th onClick={handleSort} id="title" className="cursor-pointer">Title {isSort("title")}</th>
                                        <th onClick={handleSort} id="articleType" className="cursor-pointer">Type {isSort("articleType")}</th>
                                        <th onClick={handleSort} id="user" className="cursor-pointer  hideable-col">Created by {isSort("user")}</th>
                                        <th onClick={handleSort} id="updatedTime" className="cursor-pointer">Updated Time {isSort("updatedTime")}</th>
                                        <th>Published</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody className="bg-light text-secondary">
                                    {listArticles(articles,"detailed")}
                                </tbody>
                            </Table> : ""
                        }
                    {
                        (width <= 768)
                            ? <div className="less-details p-2 mb-3">
                                {listArticles(articles, "less")}
                            </div> : ""
                    }
                {(articles.length > 0) ? <MyPagination pageInfo={pageInfo} setPageInfo={setPageInfo} /> : ""}
                <EditArticle data={updateArticle} setData={setUpdateArticle} updateArticle={updatingArticle} />
                <ViewArticle data={viewArticle} setData={setViewArticle}/>
                <MessageModal obj={message} setShow={setMessage} />
                <DeleteModal deleteObject={deleteArticle} setDeleteObject={setDeleteArticle} deletingFunc={deletingArticle} type="article" />
            </>
        }
        
        </>
     );
}
 
export default Articles;