import { Pagination } from "react-bootstrap";

const MyPagination = ({ pageInfo, setPageInfo }) => {
    let currentPage = pageInfo.number;
    const maxPageShown = pageInfo.totalPages > 25 ? 25 : pageInfo.totalPages;
    const isPrev = currentPage <= 1
    const isNext = currentPage >= pageInfo.totalPages;

    const handleClick = (i) => {
        setPageInfo(state => ({
            ...state,
            number: i
        }))
    }

    const items = [];
    for (let i = 1; i <= maxPageShown; i++){
        items.push(
            <Pagination.Item onClick={() => handleClick(i)} key={i} active={(i) === currentPage}>
                {i}
            </Pagination.Item>
        )
    }
    return ( 
        <Pagination className="justify-content-center mx-0">    
            {/* <Pagination.First /> */}
            <Pagination.Prev onClick={() => handleClick(currentPage - 1)} disabled={isPrev} />
            {items}
            <Pagination.Next onClick={() => handleClick(currentPage + 1)} disabled={isNext} />
            {/* <Pagination.Last /> */}
        </Pagination>
     );
}
 
export default MyPagination;