import { Col, Row } from "react-bootstrap";
import useAuth from "../custom_hooks/use-auth";
import { hasAnyAuthority } from "../utilities";

const Product = ({ product, showUpdate, setDeleted, toggleEnable, type, showView }) => {
    const fileURI = process.env.REACT_APP_SERVER_URL+"product-images/";

    function deleteProduct() {
        setDeleted({
            show:true, id: product.id
        })
    }

    const [auth] = useAuth();

    const enabled = product.enabled
        ? <i className="bi bi-toggle-on text-success fs-3" onClick={() => toggleEnable(product.id, false)}></i>
        : <i className="bi bi-toggle-off text-secondary fs-3" onClick={() => toggleEnable(product.id, true)}></i>
    const photo = product.mainImage && product.mainImage !== "null"
        ? <img loading="lazy" src={`${fileURI}${product.id}/${product.mainImage}`} alt="product-dp" className="table-dp" />
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
            {
              hasAnyAuthority(auth, ["Admin", "Editor", "Salesperson"])
              ? <td>{enabled}</td>  : "" 
            }
            <td className="d-flex justify-content-center">
              {
                hasAnyAuthority(auth, ["Admin", "Editor", "Salesperson", "Shipper"]) 
                ? <i 
                    className="bi bi-journal-text view"
                    title="view details"
                    onClick={() => showView(product.id)}
                  ></i> : "" 
              }
                {
                  hasAnyAuthority(auth, ["Admin", "Editor", "Salesperson"])
                 ? <i
                      className="bi bi-pencil-fill edit"
                      title="edit product"
                      onClick={() => showUpdate(product.id)}
                    ></i> : ""
                }
              {
                hasAnyAuthority(auth, ["Admin", "Editor"])
                ? (
                    <i
                      className="bi bi-archive-fill delete"
                      title="delete product"
                      onClick={deleteProduct}
                    ></i> 
                  ) : ""
            }
            </td>
            
            
           
          </tr>
        );
    }

    function rowItem() {
        return (
          <Row className="mt-2 justify-content-between">
            <Col xs="5">{photo}</Col>
            <Col xs="7">
              <span className="d-block mb-3">{product.name}</span>
              <span className="d-block mb-3">{product.brand.name}</span>
              <Row className="justify-content-start align-item-center">
                {
                  hasAnyAuthority(auth, ["Admin", "Editor", "Salesperson", "Shipper"]) 
                  ?  
                  <Col xs="3">
                      <i 
                        className="bi bi-journal-text view fs-4"
                        title="view details"
                        onClick={() => showView(product.id)}
                      ></i>
                  </Col>: "" 
                }
                {
                    hasAnyAuthority(auth, ["Admin", "Editor"])
                    ? (
                        <>
                        <Col xs="3">{enabled}</Col>
                          
                          <Col xs="3">
                            <i
                              className="bi bi-archive-fill delete fs-6"
                              title="delete product"
                              onClick={deleteProduct}
                            ></i>
                          </Col>
                      </>
                      ) : ""
                }
                {
                  hasAnyAuthority(auth, ["Admin", "Editor", "Salesperson"])
                 ? <Col xs="3">
                      <i
                        className="bi bi-pencil-fill edit fs-6"
                        title="edit product"
                        onClick={() => showUpdate(product.id)}
                      ></i>
                  </Col>  : ""
                }
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
