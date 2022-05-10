import { Pagination } from "react-bootstrap";

const MyPagination = ({ pageInfo, changePage }) => {
    let currentPage = pageInfo.currentPage;
    const maxPageShown = pageInfo.totalPages > 5 ? 5 : pageInfo.totalPages;
    const isPrev = currentPage <= 1
    const isNext = currentPage >= pageInfo.totalPages;

    const items = [];
    for (let i = 1; i <= maxPageShown; i++){
        items.push(
            <Pagination.Item onClick={() => changePage(i)} key={i} active={(i) === currentPage}>
                {i}
            </Pagination.Item>
        )
    }
    return ( 
        <Pagination className="justify-content-center">    
            {/* <Pagination.First /> */}
            <Pagination.Prev onClick={() => changePage(currentPage - 1)} disabled={isPrev} />
            {items}
            <Pagination.Next onClick={() => changePage(currentPage + 1)} disabled={isNext} />
            {/* <Pagination.Last /> */}
        </Pagination>
     );
}
 
export default MyPagination;