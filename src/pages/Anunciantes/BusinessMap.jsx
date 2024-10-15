/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import { useRedirect } from '../../hooks/useRedirect';
import axios from 'axios';
import config from '../../config';
import { MdKeyboardDoubleArrowRight, MdKeyboardDoubleArrowLeft } from 'react-icons/md';
import pathname from '../../routes';
// import { toast } from 'react-toastify';

const BusinessMap = ({setCategorie, categorie, setSubCategory, subCategory, setOtherFilter, otherFilter, setShowSubCategories}) => {
    const [maindata, setMainData] = useState([]);
    const [sliceData, setSliceData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const navigate = useRedirect();
    const isInitialRender = useRef(true);
    // const isFetching = useRef(false); // Prevent redundant fetching

    const fetchData = async (fdata) => {
        // if (isFetching.current) return; // Block repeated fetching
        // isFetching.current = true;

        setLoading(true);
        try {
            console.log("fdata", fdata);
            let response;
            if (fdata) {
                response = await axios.post(`${config.base_URL}${config.filter}`, fdata);
            } else {
                response = await axios.post(`${config.base_URL}${config.filter}`);
            }
            console.log("Fetched Data: ", response.data?.data); // Log fetched data
            setMainData(response.data?.data || []);
        } catch (error) {
            console.log('Error fetching data:', error);
            setMainData([]);
        } finally {
            setLoading(false);
            // isFetching.current = false; // Reset fetching flag
        }
    };
    // Effect to trigger data fetching based on category, subcategory, or filters
    useEffect(() => {
        if (isInitialRender.current) {
            isInitialRender.current = false;
        }
        
        // Handle when category or subcategory is cleared
        let fdata = new FormData();
        if (categorie) fdata.append('category', categorie);
        if (subCategory) fdata.append('subcategory', subCategory);
        if (otherFilter) fdata.append(otherFilter?.title, '1');
        fetchData(fdata);
    }, [categorie, subCategory, otherFilter]);

    const dataPerPage = 10;
    const totalPage = Math.ceil(maindata?.length / dataPerPage);
    useEffect(() => {
        console.log('Slice Maindata: ', maindata); // Log maindata updates
        const startIndex = (currentPage - 1) * dataPerPage;
        const endIndex = startIndex + dataPerPage;
        setSliceData(maindata.slice(startIndex, endIndex));
    }, [maindata, currentPage]);

    

    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPage) {
            setCurrentPage(page);
        }
    };
    const pagesToShow = 5;
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
        return (
        <div className="d-flex justify-content-center py-5 my-5">
            <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
        )
    }
    return (
        <>
            <p className="fs-6 fw-medium mt-1">{maindata?.length} anunciantes</p>
            <div className='row' style={{ gap: '5px' }}>
                {
                    maindata?.length === 0 &&
                    <div className="text-center mt-5 pt-5">
                        <p className="fs-3">No Data Found!</p>
                    </div>
                }
                {
                    sliceData?.map(item => (
                        <div key={item.id_business} onClick={()=>navigate(`${pathname.negocio}/${item.id_business}`)} className='text-center cursor-pointer col-6 col-sm-4 col-xl-3 px-2 px-sm-2 mb-5 anuncian-card'>
                            <img src={item.logo_url} className="card-img-top" alt={item.name} />
                            <div>
                                <p className='my-1 card-fs-1 fw-medium'>{item.name}</p>
                                {/* <p className='mb-0 card-fs-2'>{item.description.length < 40 ? item.description : item.description.slice(0, 35)}</p> */}
                            </div>
                        </div>
                    ))
                }
            </div>
            {
                totalPage > 1 &&
                (<div className="paginate mt-5 pt-5">
                <span onClick={() => handlePageChange(currentPage - 1)}><MdKeyboardDoubleArrowLeft /></span>
                {getPageLinks()}
                <span onClick={() => handlePageChange(currentPage + 1)}><MdKeyboardDoubleArrowRight /></span>
                </div>) 
            }
             
        </>
    );
};

export default BusinessMap;
