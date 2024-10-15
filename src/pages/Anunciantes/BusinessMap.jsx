/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import { useRedirect } from '../../hooks/useRedirect';
import axios from 'axios';
import config from '../../config';
import { MdKeyboardDoubleArrowRight, MdKeyboardDoubleArrowLeft } from 'react-icons/md';
import pathname from '../../routes';
// import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import { category } from './Anunciantes';

const BusinessMap = ({setCategorie, categorie, setSubCategory, subCategory, setOtherFilter, otherFilter, setShowSubCategories}) => {
    const [maindata, setMainData] = useState([]);
    const [sliceData, setSliceData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    let paramsCategory = searchParams.get('category');
    let paramsSubCategory = searchParams.get('subcategory');
    const navigate = useRedirect();
    const isInitialRender = useRef(true);

    const fetchData = async (categorie, subCategory, otherFilter) => {
        setLoading(true);
        try {
            let fdata = new FormData();
            if (categorie) fdata.append('category', categorie);
            if (subCategory) fdata.append('subcategory', subCategory);
            if (otherFilter) fdata.append(otherFilter?.title, '1');

            // const response = await axios.post(`${config.base_URL}${config.filter}`, fdata);
            const response = await axios.post(`http://localhost:5000/api/v1/filter`, fdata);
            const data = response.data?.data || [];
            setMainData(data);
            setLoading(false);
        } catch (error) {
            console.log('Error fetching data:', error);
            setMainData([]);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };
    // Effect to trigger data fetching based on category, subcategory, or filters
    useEffect(() => {
        if (isInitialRender.current) {
            isInitialRender.current = false;
            if (paramsCategory) {
                const foundCategory = category.find(cat => cat.lable === paramsCategory);
                
                if (foundCategory) {
                    setShowSubCategories(foundCategory.subCategories);
                    setCategorie(foundCategory.lable);
                    if (paramsSubCategory) {
                        setSubCategory(paramsSubCategory);
                    }
                }
            }
            const newUrl = location.pathname;
            searchParams.delete("category");
            searchParams.delete("subcategory");
            window.history.replaceState(null, '', newUrl);
        }
        // Handle when category or subcategory is cleared
        console.log("category", categorie);
        console.log("paramcategory",paramsCategory);
        fetchData(categorie, subCategory, otherFilter);
    }, [categorie, subCategory, otherFilter, paramsCategory, paramsSubCategory]);

    const dataPerPage = 10;
    let totalPage = Math.ceil(maindata?.length / dataPerPage);
    useEffect(() => { 
        setLoading(true);
        totalPage = Math.ceil(maindata?.length / dataPerPage);
        const getPageData = () => {
            const startIndex = (currentPage - 1) * dataPerPage;
            const endIndex = startIndex + dataPerPage;
            const resData = maindata?.slice(startIndex, endIndex);
            setSliceData(resData);
        };
        getPageData();
        setLoading(false);
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
        return <div className="d-flex justify-content-center py-5 my-5">
            <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
            </div>
        </div>
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
                    loading ? <p>...</p> :
                    sliceData.map(item => (
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
