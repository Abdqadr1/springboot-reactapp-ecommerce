import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import useSettings from "./use-settings";
const Footer = ({menus}) => {
  const { COPYRIGHT } = useSettings();
const listMenus = () => {
  if(menus && menus.length > 0){
    return menus.map(m =>
      <Col xs={10} sm={6} md={3} lg={2} as={Link} key={m.id} className="nav-link text-light" to={`/m/` + m.article.alias}>
      {m.title}
    </Col>)
  }
}

    return ( 
        <footer className="bg-dark py-3 text-light fw-bold">
            <Row className="mx-0 justify-content-center my-2">
                {listMenus()}
            </Row>
            <div style={{fontSize: '.8em'}}>{COPYRIGHT ?? ""}</div>
        </footer>
     );
}
 
export default Footer;