import { Row, Col,Form, Button } from "react-bootstrap";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
const Search = () => {

  const keywordRef = useRef();
  const navigate = useNavigate();
    
  const handleSubmit = (e) => {
    e.preventDefault();
    const input = keywordRef.current;
    const keyword = input.value.trim();
    if (keyword.length >= 2) {
      navigate("/p/search/"+keyword);
    } 
  }

    return ( 
        
        <Row className="justify-content-start px-3 mx-0">
          <Form className="my-2 col-11 col-md-7" onSubmit={handleSubmit}>
              <Row>
                  <Col xs={9} md={5}>
                    <Form.Control ref={keywordRef} placeholder="keyword" required minLength="2" />
                  </Col>
                  <Col xs={2} md={2}>
                    <Button variant="success" type="submit">Search</Button>
                  </Col>
              </Row>
          </Form>
        </Row>
     );
}
 
export default Search;