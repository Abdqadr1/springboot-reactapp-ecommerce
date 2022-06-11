import { useEffect, useState } from "react";
import { Carousel, Modal } from "react-bootstrap";

const MyCarousel = ({showCarousel: show, setShowCarousel: setShow, items, id, imageIndex}) => {
    const fileUrl = process.env.REACT_APP_SERVER_URL + "product-images/"+id+"/";

    const [index, setIndex] = useState(0);
    const handleSelect = (selectedIndex, e) => {
        setIndex(selectedIndex);
    };

    useEffect(()=> {
        setIndex(imageIndex)
    },[imageIndex])

    const items_array = items.map((item, i) => {
        const url = (i===0) ? `${fileUrl}` : `${fileUrl}extras/`;
        return (
          <Carousel.Item key={i}>
            <img className="carousel-img" src={`${url}${item}`} alt={item} />
          </Carousel.Item>
        );
    })
    return (
      <Modal size="lg" show={show} fullscreen={false} onHide={() => setShow(!show)} centered>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body className="border modal-body">
          <Carousel variant="dark" interval={2000} activeIndex={index} onSelect={handleSelect}>
            {items_array}
          </Carousel>
        </Modal.Body>
      </Modal>
    );
}
 
export default MyCarousel;