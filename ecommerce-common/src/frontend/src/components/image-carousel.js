import { useEffect, useState } from "react";
import { Carousel, Modal } from "react-bootstrap";

const MyCarousel = ({showCarousel: show, setShowCarousel: setShow, items, imageIndex}) => {

    const [index, setIndex] = useState(0);
    const handleSelect = (selectedIndex, e) => {
        setIndex(selectedIndex);
    };

    useEffect(()=> {
        setIndex(imageIndex)
    },[imageIndex])

    const items_array = items.map((item, i) => {
        return (
          <Carousel.Item key={i}>
            <img className="carousel-img" src={item} alt={item} />
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