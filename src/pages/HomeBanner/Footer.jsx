import './HomeBanner.css';
import { Container } from 'react-bootstrap';
import {AiFillFacebook} from 'react-icons/ai'
import {AiOutlineInstagram} from 'react-icons/ai'
const Footer = () => {
    return (
        <div className="bg-dark text-white footerBottom mt-auto">
            <Container>
                <div className="copyRightDiv py-3">
                    <div className="Copyright">
                        <span>©2023 - Locallity</span> 
                    </div>
                    <div className="links">
                        <ul className="list-inline mb-0">
                            <li className="list-inline-item pl-3" ><a className="list-group-item-action linkFooter" href="https://www.instagram.com/locallity/">Términos&nbsp;y&nbsp;condiciones</a></li>
                            <li className="list-inline-item pl-3" ><a className="list-group-item-action" href="https://www.facebook.com/__"><AiFillFacebook/></a></li>
                            <li className="list-inline-item pl-3" ><a className="list-group-item-action" href="https://www.instagram.com/locallity.mx/" ><AiOutlineInstagram/></a></li>
                        </ul>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default Footer;