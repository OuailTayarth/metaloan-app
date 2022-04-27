import React from "react";
import { Link } from "react-router-dom";



const Navbar = () => {
    return (
        <div>
            <Link>Home</Link>
            <Link>About us</Link>
            <Link>Testimonials</Link>
            <Link>Launch</Link>
        </div>
    )
}


export default Navbar;