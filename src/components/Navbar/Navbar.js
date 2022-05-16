import React,{useState} from 'react'; 
import { Link } from 'react-router-dom';
import { connect } from "../../redux/blockchain/blockchainActions";
import { useDispatch} from "react-redux";
import './Navbar.css';

const Navbar = () => {

    const dispatch = useDispatch();

    const [click, setClick] = useState(false);

    const handleClick = () => setClick(!click);
    const closeMobileMenu = () => setClick(false);

    return (
       <header> 
           <Link to="/" className="logo" onClick={closeMobileMenu}> <span>MetaLoan</span></Link>
           <div className="toggle-menu" onClick={handleClick}></div>
            <ul className={click ? "navigation active" : "navigation"}>

                 <li>
                   <Link to="/" onClick={closeMobileMenu}>Home</Link> 
                </li>

                <li>
                   <Link to="/about" onClick={closeMobileMenu}>About</Link> 
                </li>

                <li>
                    <Link to="/testimonials" onClick={closeMobileMenu}>Testimonials</Link> 
                </li>

                <li>
                    <Link to="/contactUs" onClick={closeMobileMenu}>Contact</Link>     
                </li>

                <li>
                    <Link to="/launchApp" id="connect" onClick={closeMobileMenu}>Launch App</Link>     
                </li>
                
                <li>
                    <button className='btn'
                            id="connect"
                            onClick={(e)=> {
                                e.preventDefault()
                                dispatch(connect())
                            }}>Connect Wallet</button>
                </li>               
            </ul>
       </header>
    )
}

export default Navbar;



