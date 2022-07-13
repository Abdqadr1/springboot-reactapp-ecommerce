import { useEffect,useState, useRef } from "react";
import { Form, Modal, Alert,Button} from "react-bootstrap";
import { useNavigate } from "react-router";
import useAuth from "../custom_hooks/use-auth";
import { listFormData, isTokenExpired, SPINNERS_BORDER_HTML } from "../utilities";
import axios from "axios";
import TextEditor from "../text_editor";

const EditArticle = ({ data, setData, updateArticle }) => {
    const article = data.article;
    const url = process.env.REACT_APP_SERVER_URL + "article/"+data.type?.toLowerCase();
    const [{ accessToken }] = useAuth();
    const navigate = useNavigate();
    const [alert, setAlert] = useState({ show: false, message: "", variant: "success" });
    const [content, setContent] = useState("");
    const [alertRef] = [useRef(), useRef()];
    const toggleAlert = () => {
        setAlert({...alert, show: !alert.show})
    }
    useEffect(() => {
        setAlert(s => ({ ...s, show: false }));
        if(article){
            setContent(article.content);
        }
    }, [article, data.show]);

    useEffect(() => {
        alertRef.current && alertRef.current.focus()
    }, [alert, alertRef])

     const handleSubmit = (event) => {
        event.preventDefault();
        const target = event.target
        const formData = new FormData(target);
        
        listFormData(formData);

        setAlert((state) => ({ ...state, show: false }));
         const button = target.querySelector("button");
        button.disabled = true
        const text = button.textContent;
        button.innerHTML = SPINNERS_BORDER_HTML
        axios.post(url, formData, {
            headers: {
                "Authorization": `Bearer ${accessToken}`,
            }
        })
            .then(response => {
                updateArticle(response.data, data.type);
                setAlert({ show: true, message: "Article saved!" })
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


    
    const hideModal = () => {
        setData({...data, show: false})
    }
    return ( 
        <Modal show={data.show} fullscreen={true} onHide={hideModal}>
            <Modal.Header closeButton>
                <Modal.Title>
                    {
                        (data.type === "New") ? "New Article" :`Article Details (ID : ${article?.id ?? ""})`
                    }
                    
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="border article-modal-body">
                <Alert ref={alertRef} tabIndex={-1} variant={alert.variant} show={alert.show} dismissible onClose={toggleAlert}>
                    {alert.message}
                </Alert>
                <Form onSubmit={handleSubmit}>
                    <input type="hidden" name="id" value={article?.id ?? ""} />
                    <Form.Group className="my-4 row justify-content-center mx-0" controlId="title">
                        <Form.Label className="form-label">Title:</Form.Label>
                        <Form.Control defaultValue={article?.title ?? ""} name="title" required className="form-input"/>
                    </Form.Group>
                    <Form.Group className="my-4 row justify-content-center mx-0" controlId="alias">
                        <Form.Label className="form-label">Alias:</Form.Label>
                        <Form.Control defaultValue={article?.alias ?? ""} name="alias" className="form-input"/>
                    </Form.Group>
                    <Form.Group className="my-4 row justify-content-center mx-0" controlId="content">
                        <Form.Label className="form-label">Content:</Form.Label>
                        <TextEditor text={article?.content ?? ""} setText={setContent} width="form-input" height="big-height"/>
                        <input type="hidden" name="content" value={content} required />
                    </Form.Group>
                    <Form.Group className="my-4 row justify-content-center mx-0" controlId="type">
                        <Form.Label className="form-label">Type:</Form.Label>
                        <Form.Select  defaultValue={article?.articleType ?? ""} className="form-input" name="articleType" required>
                            <option value="FREE">Free Article</option>
                            <option value="MENU_BOUND">Menu-Bound Article</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="my-4 row justify-content-center mx-0" controlId="published">
                        <Form.Label className="form-label">Published:</Form.Label>
                        <Form.Check  defaultChecked={article?.published ?? ""} name="published" className="form-input ps-0"/>
                    </Form.Group>
                    <div className="d-flex flex-wrap justify-content-center">
                        <Button className="fit-content mx-auto" variant="primary" type="submit">
                            Save
                        </Button>
                    </div>
                    
                </Form>
            </Modal.Body>
        </Modal>
     );
}
 
export default EditArticle;