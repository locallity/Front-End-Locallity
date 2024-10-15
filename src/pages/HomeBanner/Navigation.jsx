import React, { Fragment, useEffect, useRef, useState } from 'react';
import './HomeBanner.css';
import { Container, Nav, Navbar,NavDropdown } from 'react-bootstrap';
import localityLogo from '../../assets/_img/locallity-logo-full-white.svg'
import logoDark from '../../assets/icon/locallity-logo-full.svg';
import { useRedirect } from '../../hooks/useRedirect';
import pathname from '../../routes';
import { useLocation } from 'react-router-dom/dist';

const categoryWithSub = [
  {id: 1, lable: 'Comida',
      subCategories: [
          {id: 1, lable: 'Pasteles'},
          {id: 2, lable: 'Botanas'},
          {id: 3, lable: 'Catering'},
          {id: 4, lable: 'Panadería'},
      ]
  },
  {id: 2, lable: 'Infantil/Bebés',
      subCategories: [
          {id: 1, lable: 'Muebles'},
          {id: 2, lable: 'Accesorios'},
          {id: 3, lable: 'Letreros de Maternidad'},
          {id: 4, lable: 'Rentas'},
          {id: 5, lable: 'Clases'},
      ]
  },
  {id: 3, lable: 'Hogar',
      subCategories: [
          {id: 1, lable: 'Muebles'},
          {id: 2, lable: 'Fragancias'},
          {id: 3, lable: 'Decoración'},
          {id: 4, lable: 'Cocinas / Exterior'},
          {id: 5, lable: 'Diseño de Interiores'},
          {id: 6, lable: 'Concept Store'},
      ]
  },
  {id: 4, lable: 'Papelería',
      subCategories: [
          {id: 1, lable: 'Social'},
          {id: 2, lable: 'Impresiones'},
      ]
  },
  {id: 5, lable: 'Eventos',
      subCategories: [
          {id: 1, lable: 'Decoración'},
          {id: 2, lable: 'Caterings'},
          {id: 3, lable: 'Renta de mobiliario'},
          {id: 4, lable: 'Invitaciones'},
          {id: 5, lable: 'Shows'},
      ]
  },
  {id: 6, lable: 'Regalos',
      subCategories: [
          {id: 1, lable: 'Fragancias'},
          {id: 2, lable: 'Florerías'},
          {id: 3, lable: 'Mesas de regalo'},
          {id: 4, lable: 'Regalos Generales'},
          {id: 5, lable: 'Concept Store'},
      ]
  },
  {id: 7, lable: 'Bienestar',
      subCategories: [
          {id: 1, lable: 'Fragancias'},
          {id: 2, lable: 'Florerías'},
          {id: 3, lable: 'Mesas de regalo'},
          {id: 4, lable: 'Regalos Generales'},
          {id: 5, lable: 'Concept Store'},
      ]
  },
  {id: 8, lable: 'Shopping',
      subCategories: [
          {id: 1, lable: 'Zapatos'},
          {id: 2, lable: 'Ropa / Vestidos'},
          {id: 3, lable: 'Trajes de baño'},
          {id: 4, lable: 'Accesorios'},
          {id: 5, lable: 'Cosméticos'},
      ]
  }
]

const Navigation = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const mobileNavRef = useRef();

  const toggleMobileNav = () => {
    setMobileNavOpen((prevState) => !prevState);
   
  };

  useEffect(() => {
    const handleDocumentClick = (event) => {
      if (mobileNavOpen && mobileNavRef.current && !mobileNavRef.current.contains(event.target)) {
        setMobileNavOpen(false);
       
      }
    };

    const handleDocumentScroll = () => {
      if (mobileNavOpen) {
        setMobileNavOpen(false);
      }
    };

    document.addEventListener('click', handleDocumentClick);
    document.addEventListener('scroll', handleDocumentScroll);
    

    return () => {
      document.removeEventListener('click', handleDocumentClick);
      document.removeEventListener('scroll', handleDocumentScroll);
    };
  }, [mobileNavOpen]);
  
  const [showSubcategories, setShowSubcategories] = useState(null);
  const [color, setColor] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;
  useEffect(() => {
    if (currentPath !== '/') {
      setColor(false);
    } else {
      setColor(true);
    }
  }, [currentPath])

  const onCategoryHover = (category) => setShowSubcategories(category);
  const onCategoryLeave = () => setShowSubcategories(null);
  const navigate = useRedirect();

  const [category, setCategory] = useState('');
  const [subCategory, setsubCategory] = useState('');


  useEffect(() => {
    
    if (category && subCategory) {
      const onClickSubCategory = (subCategory) => navigate(`${pathname.anunciantes}?category=${category}&subcategory=${subCategory}`)
      onClickSubCategory(subCategory)
    }
    else if (category) {
      const onClickCategory = (category) => navigate(`${pathname.anunciantes}?category=${category}`)
      onClickCategory(category)
    }

  }, [category, subCategory, navigate]);

  function setCategoryAndSub(cate, subC) {
    if (cate) setCategory(cate);
    if (cate && subC) setsubCategory(subC);
  }

    return (
    <Fragment>
        <Container id="lg-nav">
          <Navbar expand="lg" className="bg-transparent mt-2">
            <Container fluid>
              <Navbar.Brand className="cursor-pointer" onClick={() => navigate(pathname.home)}><img height={28} src={color ? localityLogo : logoDark} alt="localityLogo" /></Navbar.Brand>
              <Navbar.Toggle aria-controls="navbarScroll" />
              <Navbar.Collapse id="navbarScroll">
                <Nav
                  className="my-2 my-lg-0 w-100 d-flex align-items-center justify-content-between"
                  navbarScroll
                >
                  <div className="d-flex">
                    <Nav.Link className={`navDesign ${color && 'text-white'}`} onClick={() => navigate(pathname.home)}>Inicio</Nav.Link>
                      <Nav.Link className={`navDesign ${color && 'text-white'}`}  href="/#about" >Nosotros</Nav.Link>
                      <Nav.Link className={`navDesign ${color && 'text-white'}`}  href="/#safety">Seguridad</Nav.Link>
                      <Nav.Link className={`navDesign ${color && 'text-white'}`} href="/#map">Mapa</Nav.Link>
                      {
                        currentPath !== "/anunciantes" &&
                        <NavDropdown 
                        id="dropdownMenu" 
                        title="Categorías"
                        onMouseEnter={onCategoryHover}
                        onMouseLeave={onCategoryLeave}
                      
                        className={`${color && 'text-custom-white'}`}
                        >
                          <div className="d-flex categoriesDiv">
                            <ul className="ul-categories">
                              <li className="--comida"
                              onMouseEnter={() => onCategoryHover('Comida')}
                              onClick={() => setCategory('Comida')}
                              >Comida</li>
                              <li className="--infantil-bebe"
                              onMouseEnter={() => onCategoryHover('Infantil/Bebés')}
                              onClick={() => setCategory('Infantil/Bebés')}
                              >Infantil&nbsp;/&nbsp;Bebés</li>
                              <li className="--hogar"
                              onMouseEnter={()=>onCategoryHover('Hogar')}
                              onClick={() => setCategory('Hogar')}
                              >Hogar</li>
                              <li className="--papeleria"
                              onMouseEnter={()=>onCategoryHover('Papelería')}
                              onClick={() => setCategory('Papelería')}
                              >Papelería</li>
                              <li className="--eventos"
                              onMouseEnter={()=>onCategoryHover('Eventos')}
                              onClick={() => setCategory('Eventos')}
                              >Eventos</li>
                              <li className="--regalos"
                                onMouseEnter={()=>onCategoryHover('Regalos')}
                                onClick={() => setCategory('Regalos')}
                              >Regalos</li>
                              <li className="--bienestar"
                              onMouseEnter={()=>onCategoryHover('Bienestar')}
                              onClick={() => setCategory('Bienestar')}
                              >Bienestar</li>
                              <li className="--shopping"
                                onMouseEnter={()=>onCategoryHover('Shopping')}
                                onClick={() => setCategory('Shopping')}
                              >Shopping</li>
                          </ul>
                          <ul className="ul-subcategories">
                              <li className="text-header-subcategories">Subcategorías</li>    
                              <hr className="mt-1 mb-2" />         
                              <div>
                                  <p className={`${showSubcategories === null ? '' : 'd-none'}`}>Elige una categoría para desplegar sus respectivas subcategorías.</p>
                              </div>
                              
                              {categoryWithSub.map((categoryItem) => (
                                <div key={categoryItem.id} className={`${showSubcategories === categoryItem.lable ? '' : 'd-none'}`}>
                                  {categoryItem.subCategories.map(subC => (
                                    <li key={subC.id} className='cursor-pointer' onClick={() => setCategoryAndSub(categoryItem.lable, subC.lable)}>
                                      {subC.lable}
                                    </li>
                                  ))}
                                </div>
                              ))}
                          </ul>
                          </div>
                          {/* <div className="bottomNav">
                            <div className="text-div">
                                <h4 className="mb-0 text-white">¡Date a conocer!</h4>
                                <p className="mb-0">Anuncia tu negocio en Locallity.com</p>
                            </div>
                            <div className="btn-div">
                              <p onClick={() => navigate(pathname.registration)} className='btn btn-outline-light border-1 rounded-1 py-2 px-3 fw-semibold'>Registrarme</p>
                            </div>
                          </div> */}

                        </NavDropdown>
                      }
                  </div>
                  {/* <div className='d-flex align-items-center gap-2'>
                    <Nav.Link className={`navDesign ${color && 'text-white'}`} onClick={() => navigate(pathname.registration)}>Registra tu marca</Nav.Link>
                  </div> */}
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </Container>
        <Container id="xs-nav" className="position-absolute">
          <Navbar expand="lg" className="bg-transparent">
            <Container>
            <Navbar.Brand onClick={() => navigate(pathname.home)}><img height={28} src={color ? localityLogo : logoDark} alt="localityLogo" /></Navbar.Brand>
              <Navbar.Toggle aria-controls="mbl-basic-navbar-nav" onClick={toggleMobileNav}/>
              {/*  */}
              {/* */}
              
              <Navbar.Collapse 
              id="mbl-basic-navbar-nav" 
              ref={mobileNavRef} 
              show={mobileNavOpen ? 'true' : undefined}
              className={mobileNavOpen ? 'show' : ''} >
              
              <Nav className="me-auto">

                <NavDropdown className="navDropDownXs" title="Categorías" id="mbl-basic-navbar-nav">
                  
                  {
                      categoryWithSub.map(cat => (
                        <ul key={cat.id} className="navbar-nav ml-auto">
                          <span className='text-white' onClick={() => setCategory(cat.lable)}>{cat.lable}</span>
                          {
                            cat.subCategories.map(subCat => (
                              <li key={subCat.id} className='text-white' onClick={() => setCategoryAndSub(cat.lable, subCat.lable)}>{subCat.lable}</li>
                            ))
                          }
                      </ul>
                    ))
                  }

                </NavDropdown>

                    <Nav.Link className="navDesignXs"  href="/#about" >Nosotros</Nav.Link>
                    <Nav.Link className="navDesignXs"  href="/#safety">Seguridad</Nav.Link>
                    <Nav.Link className="navDesignXs"  href="/#map">Mapa</Nav.Link>
                    {/* <Nav.Link className="navDesignXs" onClick={() => navigate(pathname.registration)}>Registra tu marca</Nav.Link> */}
                </Nav>
          </Navbar.Collapse>


        </Container>
      </Navbar>
        </Container>

        
      </Fragment>  

    );
};

export default Navigation;