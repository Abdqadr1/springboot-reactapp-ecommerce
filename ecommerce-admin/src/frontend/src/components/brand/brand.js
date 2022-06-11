import { Badge, Col, Row } from "react-bootstrap";

const Brand = ({ brand, showUpdate, setDeleted, type }) => {
    const fileURI = process.env.REACT_APP_SERVER_URL+"brand-photos/";

    const brandCategories = brand.categories.map(cat => <Badge pill key={cat.id} bg="secondary" className="ms-1">{cat.name}</Badge>)

    function deleteBrand() {
        setDeleted({
            show:true, id: brand.id
        })
    }
    const photo = brand.photo && brand.photo !== "null" && brand.photo !== "default.png"
        ? <img loading="lazy" src={`${fileURI}${brand.id}/${brand.photo}`} alt="category-dp" className="table-dp" />
        :<span htmlFor="photo" className="avatar cursor-pointer bg-secondary">
            <i className="bi bi-image-fill"></i>
        </span>
    
    function tableItem() {
        return (
            <tr>
                <td>{brand.id}</td>
                <td>{photo}</td>
                <td>{brand.name}</td>
                <td className="hideable-col">{brandCategories}</td>
                <td className="d-flex justify-content-center">
                    <i className="bi bi-pencil-fill edit" title="edit category" onClick={()=> showUpdate(brand.id)}></i>
                    <i className="bi bi-archive-fill delete" title="delete category" onClick={deleteBrand}></i>
                
                </td>
            </tr>
        )
    }

    function rowItem() {
        return (
          <Row className="mt-2 justify-content-between">
            <Col xs="5">{photo}</Col>
            <Col xs="7">
              <span className="d-block mb-3">{brand.name}</span>
              <span className="d-block mb-3">{brandCategories}</span>
              <Row className="justify-content-start align-item-center">
                <Col xs="4">
                  <i
                    className="bi bi-pencil-fill edit fs-6"
                    title="edit category"
                    onClick={() => showUpdate(brand.id)}
                  ></i>
                </Col>
                  <Col xs="4">
                    <i
                      className="bi bi-archive-fill delete fs-6"
                      title="delete category"
                      onClick={deleteBrand}
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
 
export default Brand;