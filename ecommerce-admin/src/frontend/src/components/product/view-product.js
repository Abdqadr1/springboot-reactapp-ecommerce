import { Col, Form, Modal, Row, Tab, Tabs } from "react-bootstrap";
import TextEditor from "../text_editor"

const ViewProduct = ({ viewProduct, setViewProduct }) => {
    const product = viewProduct?.product;

    const hideModal = () => setViewProduct(state => ({...state, show:false}));

    const listExtraImages = () => {
        let saved=[];
        if(product?.extraImages.length > 0){
            saved = product.extraImages.map((img, i) => (
                <Col key={'saved'+i} md={4} className="border py-2">
                    <h5 className="px-1 text-center d-flex justify-content-between">
                        <span>{`Extra image #${i+1}`}</span>
                    </h5>
                    <img src={(img.imagePath)}  alt="product" className="product-image" />
                </Col>
            ))
        }
        return [...saved];
    }

    const listMainImage = () => {
        return (
            <Col md={4} className="border py-2">
                <h5 className="px-1 text-center">Main image</h5>
                <img src={product?.mainImagePath}  alt="product" className="product-image" />
            </Col>)
    }

    const listDetails = () => {
        return product?.details.map((detail, i) => (
                <Row key={i} className="mt-3">
                    <Form.Group className="col-12 col-md-6 row justify-content-center" controlId="name">
                        <Form.Label className="form-label fw-bold">Name:</Form.Label>
                        <Form.Control disabled value={detail?.name} onChange={null} className="form-input"/>
                    </Form.Group>
                    <Form.Group className="col-12 col-md-6 row justify-content-center mt-2 mt-md-0" controlId="value">
                        <Form.Label className="form-label fw-bold">Value:</Form.Label>
                        <Form.Control disabled value={detail?.value} onChange={null} className="form-input"/>
                    </Form.Group>
                </Row>
            ))
    }
    
    return ( 
         
        <Modal show={viewProduct.show} fullscreen={true} onHide={hideModal}>
            <Modal.Header closeButton>
                <Modal.Title>View Product (ID : {product?.id})</Modal.Title>
            </Modal.Header>
            <Modal.Body className="border product_modal_body">
                <Form className="add-user-form"  disabled>
                    <Tabs defaultActiveKey="overview" id="uncontrolled-tab-example" className="mb-3">
                        <Tab eventKey="overview" title="Overview">
                            <Form.Group className="mb-3 row justify-content-center" controlId="name">
                                <Form.Label className="form-label">Product Name:</Form.Label>
                                <Form.Control disabled onChange={null} value={product?.name} className="form-input" 
                                type="name" placeholder="Enter product name" />
                            </Form.Group>
                            <Form.Group className="mb-3 row justify-content-center" controlId="alias">
                                <Form.Label className="form-label">Alias:</Form.Label>
                                <Form.Control disabled onChange={null} value={product?.alias} className="form-input" type="text" />
                            </Form.Group>
                            <Form.Group className="mb-3 row justify-content-center" controlId="brand">
                                <Form.Label className="form-label">Brand:</Form.Label>
                                <Form.Select disabled onChange={null} value={product?.brand.id} className="form-input">
                                    <option value={product?.brand.id}>{product?.brand.name}</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3 row justify-content-center" controlId="category">
                                <Form.Label className="form-label">Category:</Form.Label>
                                <Form.Select disabled onChange={null} value={product?.category.id} className="form-input">
                                    <option value={product?.category.id}>{product?.category.name}</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3 row justify-content-center" controlId="enabled">
                                <Form.Label className="form-label">Enabled:</Form.Label>
                                <Form.Check disabled className="form-input ps-0" type="checkbox" defaultChecked={product?.enabled} />
                            </Form.Group>
                            <Form.Group className="mb-3 row justify-content-center" controlId="inStock">
                                <Form.Label className="form-label">In Stock:</Form.Label>
                                <Form.Check disabled className="form-input ps-0" type="checkbox" defaultChecked={product?.inStock} />
                            </Form.Group>
                            <Form.Group className="mb-3 row justify-content-center" controlId="cost">
                                <Form.Label className="form-label">Cost:</Form.Label>
                                <Form.Control disabled onChange={null} value={product?.cost} className="form-input" type="text" />
                            </Form.Group>
                            <Form.Group className="mb-3 row justify-content-center" controlId="price">
                                <Form.Label className="form-label">Price:</Form.Label>
                                <Form.Control disabled onChange={null} value={product?.price} className="form-input" type="text" />
                            </Form.Group>
                            <Form.Group className="mb-3 row justify-content-center" controlId="discount">
                                <Form.Label className="form-label">Discount:</Form.Label>
                                <Form.Control disabled onChange={null} value={product?.discountPrice} className="form-input" type="text" />
                            </Form.Group>
                        </Tab>
                        <Tab eventKey="description" title="Description">
                            <h4>Short description</h4>
                            <TextEditor height="big-height" disabled={true} text={product?.shortDescription} setText={null} />

                            <h4>Full description</h4>
                            <TextEditor height="big-height" disabled={true} text={product?.fullDescription} setText={null}/>
                        </Tab>
                        <Tab eventKey="images" title="Images">
                            {/* main image row */}
                            <Row className="justify-content-start px-2 py-1 my-3 border-bottom">
                                {listMainImage()}
                            </Row>
                                {/* extra images row */}
                            <Row className="justify-content-start px-2 my-3 py-1 border-bottom">
                                {listExtraImages()}
                            </Row>
                        </Tab>
                        <Tab eventKey="details" title="Details">
                            {listDetails()}
                        </Tab>
                        <Tab eventKey="shipping" title="Shipping">
                            <h5 className="mb-5">
                              The following information is important to calculate the shipping cost of the product <br/>
                              The dimension (L x W x H) is for the box that is used to package the product - not the product
                            </h5>
                            <Form.Group className="mb-3 row justify-content-center" controlId="length">
                                <Form.Label className="form-label">Length (inch):</Form.Label>
                                <Form.Control disabled onChange={null} value={product?.length}  className="form-input" type="text" />
                            </Form.Group>
                            <Form.Group className="mb-3 row justify-content-center" controlId="width">
                                <Form.Label className="form-label">Width (inch):</Form.Label>
                                <Form.Control disabled onChange={null} value={product?.width} className="form-input" type="text" />
                            </Form.Group>
                            <Form.Group className="mb-3 row justify-content-center" controlId="height">
                                <Form.Label className="form-label">Height (inch):</Form.Label>
                                <Form.Control disabled onChange={null} value={product?.height}  className="form-input" type="text"/>
                            </Form.Group>
                            <Form.Group className="mb-3 row justify-content-center" controlId="weight">
                                <Form.Label className="form-label">Weight (pound):</Form.Label>
                                <Form.Control disabled onChange={null} value={product?.weight}  className="form-input" type="text"/>
                            </Form.Group>
                        </Tab>
                    </Tabs>         
                </Form>
            </Modal.Body>
      </Modal>
     );
}
 
export default ViewProduct;