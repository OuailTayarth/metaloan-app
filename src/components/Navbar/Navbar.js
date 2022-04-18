import React, { useState } from "react";
import { Link } from "react-router-dom";
import { connect } from "../../redux/blockchain/blockchainActions";
import { useDispatch, useSelector } from "react-redux";
import { fetchData } from "../../redux/data/dataActions";
import "./Navbar.css";

const Navbar = () => {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const [click, setClick] = useState(false);
  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  return (
    <header>
      <Link to="/" className="logo" onClick={closeMobileMenu}>
        <span>MetaLoan</span>
      </Link>
      <div className="toggle-menu" onClick={handleClick}></div>
      <ul className={click ? "navigation active" : "navigation"}>
        <li>
          <Link to="/" onClick={closeMobileMenu}>
            Home
          </Link>
        </li>

        <li>
          <Link to="/howitWorks" onClick={closeMobileMenu}>
            How It Works
          </Link>
        </li>

        <li>
          <Link to="/about" onClick={closeMobileMenu}>
            About Us
          </Link>
        </li>

        <li>
          <Link to="/metateam" onClick={closeMobileMenu}>
            Our Team
          </Link>
        </li>

        <li id="lastchild">
          <Link to="/requestloan" onClick={closeMobileMenu}>
            Request a Loan
          </Link>
        </li>

        <li>
          <Link
            to="/launchApp/submitLoan"
            id="connect"
            onClick={closeMobileMenu}>
            Launch App
          </Link>
        </li>

        <li>
          {blockchain.account == 0xb8cea4b30758f65657287e3bdc2eac6bf9e68702 && (
            <Link to="/admin" id="connect" onClick={closeMobileMenu}>
              Admin
            </Link>
          )}
        </li>

        <li>
          <button
            className="btn"
            id="connect"
            onClick={(e) => {
              e.preventDefault();
              dispatch(connect());
              getData();
            }}>
            {blockchain.walletConnected === false ? (
              "connect wallet"
            ) : (
              <div id="address">{blockchain.account.substring(0, 12)}...</div>
            )}
          </button>
        </li>
      </ul>
    </header>
  );
};

export default Navbar;
