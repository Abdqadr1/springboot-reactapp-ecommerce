import { Pagination } from "react-bootstrap";

const MyPagination = ({ pageInfo, setPageInfo }) => {
    const handleClick = (number) => {
        console.log(number)
    }
    const items = [...Array(pageInfo.totalPages)].map((x, i) => (
        <Pagination.Item onClick={handleClick} key={i} active={(i+1) === pageInfo.number}>
            {i+1}
        </Pagination.Item>
    ))
    return ( 
            <Pagination className="justify-content-center">
                {items}
            </Pagination>
     );
}
 
export default MyPagination;