import React,{useState} from 'react'; 
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
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
                   <Link to="/" onClick={closeMobileMenu}>About</Link> 
                </li>

                <li>
                    <Link to="/" onClick={closeMobileMenu}>Testimonials</Link> 
                </li>

                <li>
                    <Link to="/launchApp" onClick={closeMobileMenu}>Launch App</Link>     
                </li> 
                                
            </ul>
       </header>
    )
}

export default Navbar;