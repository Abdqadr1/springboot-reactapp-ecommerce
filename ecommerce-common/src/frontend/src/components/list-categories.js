import { useEffect } from "react";
import useSettings from "./use-settings";

import axios from "axios";
import { Col, Row } from "react-bootstrap";
import useArray from "./custom_hooks/use-array";
import { Link } from "react-router-dom";
import Search from "./search";
const ListCategories = () => {
    const fileURI = process.env.REACT_APP_SERVER_URL + "category-photos/";

    const { array: categories, setArray: setCategories } = useArray([]);
    
    const {SITE_NAME} = useSettings();
    useEffect(()=>{document.title = "Categories - " + SITE_NAME},[SITE_NAME])

    useEffect(() => {
        const url = process.env.REACT_APP_SERVER_URL + "c";
        axios.get(url, {})
        .then(res => {
            setCategories(res.data)
        }).catch(err => {
            console.warn(err)
        }).finally()
    }, [])

    function listCategories(){
        return categories.map(cat => {
            const photo = cat.photo && cat.photo !== "null"
            ? <img loading="lazy" src={`${fileURI}${cat.id}/${cat.photo}`} alt={cat.name} className="cat-dp" />
            :<span className="avatar">
                <i className="bi bi-image-fill"></i>
            </span>
            return (
                <Col className="my-3 mx-1" key={cat.name + cat.id} xs={6} md={3} lg={2}
                    as={Link} to={"/c/" + encodeURIComponent(cat.alias)}>
                        {photo}
                        <h5 className="my-2">{cat.name}</h5>
                </Col>
            )
    })
    }

    return (
        <>
            <Search />
            <Row className="mt-5 px-2 mx-0">
                {listCategories()}
            </Row> 
        </>
        
     );
}
 
export default ListCategories;