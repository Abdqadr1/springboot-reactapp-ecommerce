import { Row, Col,Form, Button, Navbar, Nav, Container, Modal, Alert } from "react-bootstrap";
import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
const Search = () => {
  const keywordRef =  useRef();
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
      <>
        <Row className="justify-content-start px-3 mx-0 bg-light">
          <Col md={4}>
            <Form className="my-2 col-12" onSubmit={handleSubmit}>
                <Row>
                    <Col xs={9} md={9}>
                      <Form.Control ref={keywordRef} placeholder="keyword" required minLength="2" />
                    </Col>
                    <Col xs={2} md={2}>
                      <Button variant="success" type="submit">Search</Button>
                    </Col>
                </Row>
            </Form>
          </Col>
        </Row>
         
      </>
     
  );
}
 
export default Search;