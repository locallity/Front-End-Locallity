import React, { Fragment, useState, useEffect} from 'react';
import './HomeBanner.css';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Container } from 'react-bootstrap';
import config from '../../config';
import axios from 'axios';
import { MdKeyboardDoubleArrowRight, MdKeyboardDoubleArrowLeft } from 'react-icons/md';

const HomeSlider = () => {
    const [data, setData] = useState([]);
    const [totalData, setTotalData] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${config.allLogos}?page=${currentPage}&limit=10`);
                setData(response.data.data);
                setTotalData(response.data.total_data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [currentPage]);
    

    const dataPerPage = 10;
    const totalPage = Math.ceil(totalData / dataPerPage);
    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPage) {
            setCurrentPage(page);
        }
    };

    const pagesToShow = 3;
    const getPageLinks = () => {
        const pageLinks = [];
        let startPage = Math.max(1, currentPage - Math.floor(pagesToShow / 2));
        const endPage = Math.min(startPage + pagesToShow - 1, totalPage);
    
        if (totalPage > pagesToShow) {
          if (endPage === totalPage) {
            startPage = Math.max(endPage - pagesToShow + 1, 1);
          } else if (startPage === 1) {
            startPage = 1;
          } else {
            startPage = currentPage - Math.floor(pagesToShow / 2);
          }
        }
    
        for (let page = startPage; page <= endPage; page++) {
          pageLinks.push(
            <span
              key={page}
              onClick={() => handlePageChange(page)}
              className={currentPage === page ? 'active' : ''}
            >
              {page}
            </span>
          );
        }
    
        if (totalPage > pagesToShow && endPage < totalPage) {
          pageLinks.push(<span key="ellipsis">...</span>);
        }
    
        return pageLinks;
      };

     if (loading) {
        return <div className="d-flex justify-content-center py-5 my-5">
            <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    }

    const responsive = {
        desktop: {
          breakpoint: { max: 3000, min: 1024 },
          items: 6,
          slidesToSlide: 1 // optional, default to 1.
        },
        tablet: {
          breakpoint: { max: 1024, min: 464 },
          items: 2,
          slidesToSlide: 2 // optional, default to 1.
        },
        mobile: {
          breakpoint: { max: 464, min: 0 },
          items: 2,
          slidesToSlide: 1 // optional, default to 1.
        }
      };
    
    return (
        <Fragment>
            <Container className="mt-5 slider-container"> 
                <Carousel responsive={responsive}
                    autoPlay={true}
                    autoPlaySpeed={2000}
                    infinite={true}
                >
                {
                    data.map((item, idx) => (
                        (item?.logo_url && item?.business_id !== "undefined" && item?.business_id) ? (
                            <div key={idx} className="Items">
                                <img className="images" src={item?.logo_url} alt={item?.business_id} />
                            </div>
                        ) : null
                    ))
                }
                </Carousel>
            {
                totalPage > 1 &&
                (<div className="paginate mt-5">
                <span onClick={() => handlePageChange(currentPage - 1)}><MdKeyboardDoubleArrowLeft /></span>
                {getPageLinks()}
                <span onClick={() => handlePageChange(currentPage + 1)}><MdKeyboardDoubleArrowRight /></span>
                </div>) 
            }
            </Container>
        </Fragment>
    );
};

export default HomeSlider;