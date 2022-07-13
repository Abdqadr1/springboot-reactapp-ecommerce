import { Form, Modal} from "react-bootstrap";

const ViewArticle = ({ data, setData }) => {
    const article = data.article;
    
    const hideModal = () => {
        setData({...data, show: false})
    }
    return ( 
        <Modal show={data.show} fullscreen={true} onHide={hideModal}>
            <Modal.Header closeButton>
                <Modal.Title>Article Details (ID : {article.id})</Modal.Title>
            </Modal.Header>
            <Modal.Body className="border article-modal-body">
                <fieldset disabled>
                    <Form.Group className="my-4 row justify-content-center mx-0" controlId="title">
                        <Form.Label className="form-label">Title:</Form.Label>
                        <Form.Control defaultValue={article?.title ?? ""} className="form-input"/>
                    </Form.Group>
                    <Form.Group className="my-4 row justify-content-center mx-0" controlId="alias">
                        <Form.Label className="form-label">Alias:</Form.Label>
                        <Form.Control defaultValue={article?.alias ?? ""} className="form-input"/>
                    </Form.Group>
                    <Form.Group className="my-4 row justify-content-center mx-0" controlId="content">
                        <Form.Label className="form-label">Content:</Form.Label>
                        <div className="form-input p-2 border rounded div-view"
                            dangerouslySetInnerHTML={{__html: article?.content ?? ""}}>
                        </div>
                    </Form.Group>
                    <Form.Group className="my-4 row justify-content-center mx-0" controlId="type">
                        <Form.Label className="form-label">Type:</Form.Label>
                        <div className="form-input ps-0">
                            {article?.articleType ?? ""}
                        </div>
                    </Form.Group>
                    <Form.Group className="my-4 row justify-content-center mx-0" controlId="type">
                        <Form.Label className="form-label">Published:</Form.Label>
                        <Form.Check defaultChecked={article?.published ?? ""} className="form-input ps-0"/>
                    </Form.Group>
                    <Form.Group className="my-4 row justify-content-center mx-0" controlId="">
                        <Form.Label className="form-label">Updated by:</Form.Label>
                        <div className="form-input ps-0">
                            {article.user?.fullName ?? ""}
                        </div>
                    </Form.Group>
                    <Form.Group className="my-4 row justify-content-center mx-0" controlId="updatedTime">
                        <Form.Label className="form-label">Updated Time:</Form.Label>
                        <div className="form-input ps-0">
                            {article?.formattedUpdatedTime ?? ""}
                        </div>
                    </Form.Group>
                </fieldset>
            </Modal.Body>
        </Modal>
     );
}
 
export default ViewArticle;