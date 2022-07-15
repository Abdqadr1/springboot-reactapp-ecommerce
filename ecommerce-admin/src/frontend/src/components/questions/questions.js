import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { Col, Form, Row, Table, Button } from "react-bootstrap";
import '../../css/users.css';
import DeleteModal from "../delete_modal";
import MyPagination from "../paging";
import Question from "./question";
import { Navigate, useNavigate } from 'react-router-dom';
import useAuth from "../custom_hooks/use-auth";
import { isTokenExpired, SEARCH_ICON, SPINNERS_BORDER_HTML, SPINNERS_BORDER, hasAnyAuthority } from "../utilities";
import useThrottle from "../custom_hooks/use-throttle";
import useArray from "../custom_hooks/use-array";
import useSettings from "../custom_hooks/use-settings";
import ViewCustomer from "../customers/view_customer";
import ViewProduct from "../product/view-product";
import ViewQuestion from "./view_question";
import EditQuestion from "./edit_question";
import MessageModal from "../message_modal";

const Questions = () => {
    const serverUrl = process.env.REACT_APP_SERVER_URL + "question/";
    const [width, setWidth] = useState(window.innerWidth);
    const navigate = useNavigate();
    const [auth, ] = useAuth();    
    const {accessToken} = auth;

    const abortController = useRef(new AbortController());
    const [keyword, setKeyword] = useState("");
    const searchBtnRef = useRef();
    const [isLoading, setLoading] = useState(true);
    const {array:questions, setArray:setQuestions, filterWithId:removeQuestion, updateArray} = useArray();
    const [updateQuestion, setUpdateQuestion] = useState({show:false, id: -1, question: {}});
    const [viewQuestion, setViewQuestion] = useState({show:false, id: -1, question: {}});
    const [showCustomer, setShowCustomer] = useState({ show: false, id: -1, type: "View", customer: {} });
    const [viewProduct, setViewProduct] = useState({show:false, id: -1, product: null});
    const [deleteQuestion, setDeleteQuestion] = useState({show:false, id: -1});
    const [message, setMessage] = useState({ show:false, message:"", title: ""});
    const showUpdate = (type, id) => {
        const question = questions.filter(u => u.id === id)[0]
        setUpdateQuestion(s=> ({...s, type, show: true, id, question}))
    };
    const [pageInfo, setPageInfo] = useState({
        number: 1, totalPages: 1, startCount: 1,
        endCount: null, totalElements: null,numberPerPage: 1
    })
    const [sort, setSort] = useState({ field: "askTime", dir: "desc" })
    
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
                 setQuestions(data.questions);
             })
             .catch(error => {
                const response = error.response
                if(isTokenExpired(response)) navigate("/login/2")
             })
             .finally(() => {
                 setLoading(false);
                 if (button) {
                    button.disabled = false
                    button.innerHTML = SEARCH_ICON;
                }
             })
    }, [serverUrl, sort.field, sort.dir, accessToken, setQuestions, navigate])
    
    const handleWindowWidthChange = useThrottle(() => setWidth(window.innerWidth), 500)
    const {SITE_NAME } = useSettings();
    
    useEffect(()=>{document.title = `Questions - ${SITE_NAME}`},[SITE_NAME])
    

    useEffect(() => {
        abortController.current = new AbortController();
        changePage(pageInfo.number, keyword);
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

    const viewCustomer = id => {
        const question = questions.find(u => u.id === id);
        const customer = question.asker;
        setShowCustomer(s => ({ ...s, id, show: true, customer }));
    }
    
    const showProduct = (id) => {
        const question = questions.find((u) => u.id === id);
        const product = question.product;
        setViewProduct({ show: true, id, product });
    }
    
    function showQuestion(id) {
        const question = questions.find(u => u.id === id);
        setViewQuestion(s => ({ ...s, id, show: true, question }));
    }
    function deletingQuestion() {
        const id = deleteQuestion.id
        const url = serverUrl + "delete/" + id;
        axios.get(url, {
             headers: {
                 "Authorization": `Bearer ${accessToken}`
             },
             signal: abortController.current.signal
        })
            .then(() => {
                removeQuestion({id})
                setDeleteQuestion({ ...deleteQuestion, show: false });
                setMessage(s=> ({...s,show:true, title: "Delete Question", message: "Question has been deleted."}))
            })
            .catch(error => {
                setMessage(s=> ({...s,show:true, title: "Delete Question", message: "An error ocurred."}))
        })
    }

    function updatingQuestion(question) {
        updateArray(question);
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

    function listQuestions(questions, type) {
        return (questions.length > 0)
            ? questions.map(question => <Question key={question.id} type={type} question={question}
                showUpdate={showUpdate} setDeleteQuestion={setDeleteQuestion} showCustomer={viewCustomer}
                showProduct={showProduct} showQuestion={showQuestion}
            />)
            : ((type === 'detailed')
                ? <tr><td colSpan={8} className="text-center" >No question found</td></tr>
                : <div className="text-center">No question found</div>)
    }

    if(!accessToken) return <Navigate to="/login/2" />
    if(!hasAnyAuthority(auth, ["Admin", "Assistant"])) return <Navigate to="/403" />
    return ( 
          <>
            {
                (isLoading)
                    ? <div className="mx-auto" style={{ height: "40vh", display: "grid" }}>{SPINNERS_BORDER}</div>
                        :<>
                        <Row className="justify-content-between align-items-center p-3 mx-0">
                            <Col xs={12} md={5} className="my-2">
                                <h3 className="">Manage Questions</h3>
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
                                        <th>Product</th>
                                        <th onClick={handleSort} id="questionContent" className="cursor-pointer">Question {isSort("questionContent")}</th>
                                        <th onClick={handleSort} id="asker" className="cursor-pointer  hideable-col">Asker {isSort("asker")}</th>
                                        <th onClick={handleSort} id="askTime" className="cursor-pointer">Ask Time {isSort("askTime")}</th>
                                        <th>Approved</th>
                                        <th>Answered</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody className="bg-light text-secondary">
                                    {listQuestions(questions,"detailed")}
                                </tbody>
                            </Table> : ""
                        }
                    {
                        (width <= 768)
                            ? <div className="less-details p-2 mb-3">
                                {listQuestions(questions, "less")}
                            </div> : ""
                    }
                {(questions.length > 0) ? <MyPagination pageInfo={pageInfo} setPageInfo={setPageInfo} /> : ""}
                <EditQuestion data={updateQuestion} setData={setUpdateQuestion} updateQuestion={updatingQuestion} />
                <ViewQuestion data={viewQuestion} setData={setViewQuestion}/>
                <ViewCustomer data={showCustomer} setData={setShowCustomer} />
                <ViewProduct viewProduct={viewProduct} setViewProduct={setViewProduct} />
                <MessageModal obj={message} setShow={setMessage} />
                <DeleteModal deleteObject={deleteQuestion} setDeleteObject={setDeleteQuestion} deletingFunc={deletingQuestion} type="question" />
            </>
        }
        
        </>
     );
}
 
export default Questions;