import { Col, Row } from "react-bootstrap";

const Product = ({ product, showUpdate, setDeleted, toggleEnable, type }) => {
    const fileURI = process.env.REACT_APP_SERVER_URL+"product-images/";

    function deleteProduct() {
        setDeleted({
            show:true, id: product.id
        })
    }

    const enabled = product.enabled
        ? <i className="bi bi-toggle-on text-success fs-3" onClick={() => toggleEnable(product.id, false)}></i>
        : <i className="bi bi-toggle-off text-secondary fs-3" onClick={() => toggleEnable(product.id, true)}></i>
    const photo = product.mainImage && product.mainImage !== "null"
        ? <img loading="lazy" src={`${fileURI}${product.id}/main-image/${product.mainImage}`} alt="product-dp" className="table-dp" />
        :<span className="avatar cursor-pointer bg-secondary">
            <i className="bi bi-image-fill"></i>
        </span>
    
    function tableItem() {
        return (
            <tr>
                <td>{product.id}</td>
                <td>{photo}</td>
                <td>{product.name}</td>
                <td className="hideable-col">{product.brand.name}</td>
                <td className="hideable-col">{product.category.name}</td>
                <td>{enabled}</td>
                <td className="d-flex justify-content-center">
                    <i className="bi bi-pencil-fill edit" title="edit product" onClick={()=> showUpdate(product.id)}></i>
                    <i className="bi bi-archive-fill delete" title="delete product" onClick={deleteProduct}></i>
                </td>
            </tr>
        )
    }

    function rowItem() {
        return (
          <Row className="mt-2 justify-content-between">
            <Col xs="5">{photo}</Col>
            <Col xs="7">
              <span className="d-block mb-3">{product.name}</span>
              <span className="d-block mb-3">{product.brand.name}</span>
              <Row className="justify-content-start align-item-center">
                <Col xs="3">{enabled}</Col>
                <Col xs="4">
                  <i
                    className="bi bi-pencil-fill edit fs-6"
                    title="edit product"
                    onClick={() => showUpdate(product.id)}
                  ></i>
                </Col>
                  <Col xs="4">
                    <i
                      className="bi bi-archive-fill delete fs-6"
                      title="delete product"
                      onClick={deleteProduct}
                    ></i>
                  </Col>
              </Row>
            </Col>
          </Row>
        );
    }
    
    const item = (type === "detailed")
        ? tableItem() : rowItem()

    return item
}
 
export default Product;