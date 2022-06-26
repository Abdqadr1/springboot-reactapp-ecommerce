import { Col, Row } from "react-bootstrap";

const Category = ({ category, showUpdate, setDeleted, toggleEnable, type }) => {

    function deleteCategory() {
        setDeleted({
            show:true, id: category.id
        })
    }

    const enabled = category.enabled
        ? <i className="bi bi-toggle-on text-success fs-3" onClick={() => toggleEnable(category.id, false)}></i>
        : <i className="bi bi-toggle-off text-secondary fs-3" onClick={() => toggleEnable(category.id, true)}></i>
    const photo = category.photo && category.photo !== "null"
        ? <img loading="lazy" src={category.imagePath} alt="category-dp" className="table-dp" />
        :<span htmlFor="photo" className="avatar cursor-pointer bg-secondary">
            <i className="bi bi-image-fill"></i>
        </span>
    
    function tableItem() {
        return (
            <tr>
                <td>{category.id}</td>
                <td>{photo}</td>
                <td>{category.name}</td>
                <td className="hideable-col">{category.alias}</td>
                <td>{enabled}</td>
                <td className="d-flex justify-content-center">
                    <i className="bi bi-pencil-fill edit" title="edit category" onClick={()=> showUpdate(category.id)}></i>
                    {
                        (category.parent)
                         ? <i className="bi bi-archive-fill delete" title="delete category" onClick={deleteCategory}></i>
                         : ""
                    }
                    
                </td>
            </tr>
        )
    }

    function rowItem() {
        return (
          <Row className="mt-2 justify-content-between mx-0">
            <Col xs="5">{photo}</Col>
            <Col xs="7">
              <span className="d-block mb-3">{category.name}</span>
              <span className="d-block mb-3">{category.alias}</span>
              <div className="justify-content-start d-flex">
                {enabled}
                
                  <i
                    className="bi bi-pencil-fill edit fs-6 ms-4 me-3"
                    title="edit category"
                    onClick={() => showUpdate(category.id)}
                  ></i>
                
                {category.parent ? (
                  
                    <i
                      className="bi bi-archive-fill delete fs-6 mx-3"
                      title="delete category"
                      onClick={deleteCategory}
                    ></i>
                  
                ) : (
                  ""
                )}
              </div>
            </Col>
          </Row>
        );
    }
    
    const item = (type === "detailed")
        ? tableItem() : rowItem()

    return item
}
 
export default Category;