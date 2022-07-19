import { Link } from "react-router-dom";
import useSettings from "./use-settings";
const Footer = ({menus}) => {
  const { COPYRIGHT } = useSettings();
const listMenus = () => {
  if(menus && menus.length > 0){
    return menus.map(m => <Link key={m.id} className="nav-link text-light" to={`/m/`+m.article.alias}>{m.title}</Link>)
  }
}

    return ( 
        <footer className="bg-dark py-3 text-light fw-bold">
            <div className="ms-md-3 d-flex flew-wrap justify-content-center justify-content-md-start my-2">
                {listMenus()}
            </div>
            <div style={{fontSize: '.8em'}}>{COPYRIGHT ?? ""}</div>
        </footer>
     );
}
 
export default Footer;