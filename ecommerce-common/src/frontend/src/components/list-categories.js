import { useEffect } from "react";

import axios from "axios";
import { Col, Row } from "react-bootstrap";
import useArray from "./custom_hooks/use-array";
import { Link } from "react-router-dom";
const ListCategories = () => {
    const fileURI = process.env.REACT_APP_SERVER_URL + "category-photos/";

    const {array: categories, setArray: setCategories} = useArray([]);

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
                <Col className="my-3" key={cat.name+cat.id} sm={6} md={4} lg={3} xlg={2}>
                    {photo}
                    <h5 className="my-2"><Link to={"c/"+cat.alias} >{cat.name}</Link></h5>
                </Col>
            )
    })
    }

    return ( 
        <Row className="mt-5 px-2 mx-0">
            {listCategories()}
        </Row>
     );
}
 
export default ListCategories;