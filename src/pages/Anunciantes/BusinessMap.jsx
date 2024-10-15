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
// import testImg from '../../assets/images/logo-4-01.jpg';

const fetchAllData = async () => {
    try {
        const response = await axios.get(`${config.base_URL}${config.selectAll}`);
        return response.data?.data || [];
    } catch (error) {
        console.error('Error fetching data:', error);
        return []; 
    }
};

const fetchFilteredData = async (categorie, subCategory, otherFilter) => {
    try {
        let data = new FormData();
        if (categorie) data.append('category', categorie);
        if (subCategory) data.append('subcategory', subCategory);
        if (otherFilter) data.append(otherFilter?.title, '1');

        const response = await axios.post(`${config.base_URL}${config.filter}`, data);
        return response.data?.data || [];
    } catch (error) {
        console.error('Error fetching filtered data:', error);
        return [];
    }
};

const BusinessMap = ({setCategorie, categorie, setSubCategory, subCategory, setOtherFilter, otherFilter, setShowSubCategories, random}) => {
    const [maindata, setMainData] = useState([]);
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
            let data;
            if (categorie || subCategory || otherFilter) {
                console.log("inside the fetchdata", categorie);
                data = await fetchFilteredData(categorie, subCategory, otherFilter);
            } else {
                console.log("inside the fetchdata and alldata", categorie);
                data = await fetchAllData();
            }
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
        setMainData([]);
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
            fetchData(paramsCategory, paramsSubCategory);
        }
        // Handle when category or subcategory is cleared
        console.log("category", categorie);
        console.log("paramcategory",paramsCategory);
        fetchData(categorie, subCategory, otherFilter);
    }, [categorie, subCategory, otherFilter, paramsCategory, paramsSubCategory, random]);


    // const generateData = () => {
    //     const data = [];
    //     for (let i = 1; i <= 100; i++) {
    //       const item = {
    //         id_business: i,
    //         name: `Business ${i}`,
    //         logo_url: testImg,
    //         description: `Description for Business ${i}`,
    //       };
    //       data.push(item);
    //     }
    //     return data;
    //   };
    // const testData = generateData();

    const dataPerPage = 10;
    const totalPage = Math.ceil(maindata?.length / dataPerPage);
    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPage) {
            setCurrentPage(page);
        }
    };
    
    const getPageData = () => {
        const startIndex = (currentPage - 1) * dataPerPage;
        const endIndex = startIndex + dataPerPage;
        const resData = maindata?.slice(startIndex, endIndex);
        return resData;
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
                    getPageData().map(item => (
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
