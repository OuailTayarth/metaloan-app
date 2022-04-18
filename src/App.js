import React, { useEffect, useState } from "react";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "../src/styles/globalStyles";
import moment from "moment";
import LaunchApp from "./components/LaunchApp/LaunchApp";
import SubmitLoan from "./components/UserPages/SubmitLoan/SubmitLoan";
import PayLoan from "./components/UserPages/PayLoan/PayLoan";
import FetchLoan from "./components/UserPages/FetchLoan/FetchLoan";
import FetchBorrowers from "./components/UserPages/FetchBorrowers/FetchBorrowers";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import About from "./components/About/About";
import Footer from "./components/Footer/Footer";
import ContactForm from "./components/ContactForm/ContactForm";
import Admin from "./components/Admin/Admin";
import HowItoWorks from "./components/HowItWorks/HowItoWorks";
import ERC20ABI from "./ERC20ABI.json";
import OurTeam from "./components/OurTeam/OurTeam";
import Loader from "./components/Loader/Loader";
import Home from "./components/Home";
import config from "./config/config.json";
import metaloanInterface from "../src/config/abi.json";
import { ethers } from "ethers";
import Web3Modal from "web3modal";

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const [loanId, setLoanId] = useState(0);

  const [LoanData, setLoanData] = useState([]);
  const [BorrowersData, setBorrowersData] = useState([]);
  const [alert, setAlert] = useState({ show: false, msg: "" });
  const [activePayment, setActivePayment] = useState(false);
  const [isBorrowerAddress, setBorrowerAddress] = useState("");

  useEffect(() => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  }, [blockchain.smartContract]);

  // ShowAlert
  function showAlert(show = false, msg = "") {
    setAlert({ show: show, msg: msg });
  }

  // keep the user connected on page refresh
  useEffect(() => {
    const onPageConnected = async () => {
      if (localStorage?.getItem("isWalletConnected") === "true") {
        try {
          dispatch(connect());
        } catch (err) {
          console.log(err);
        }
      }
    };
    onPageConnected();
  }, []);

  // Increment loan Id
  function incrementLoanId() {
    let newLoanId = loanId + 1;
    if (newLoanId > 100) {
      newLoanId = 100;
    }
    setLoanId(newLoanId);
  }

  // Decrement loan Id
  function decrementLoanId() {
    let newLoanId = loanId + 1;
    if (newLoanId > 0) {
      newLoanId = 0;
    }
    setLoanId(newLoanId);
  }

  /**
   * Requests and activates a loan plan
   */
  async function getLoan() {
    showAlert(true, "Welcome to MetaLoan, your payment is processing...!");
    setActivePayment(true);

    try {
      // Connect with Web3Modal and get signer
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();

      // MetaLoan contract instance
      const metaloanContract = new ethers.Contract(
        config.CONTRACT_ADDRESS,
        metaloanInterface,
        signer
      );

      // Fetch plan details
      const plan = await metaloanContract.idToPlan(loanId);
      const tokenPayment = plan.tokenPayment;
      const upfrontPayment = plan.upfrontPayment;

      // ERC20 token contract instance
      const stableTokenContract = new ethers.Contract(
        tokenPayment,
        ERC20ABI,
        signer
      );

      // Approve MetaLoan to spend tokens
      const approveTx = await stableTokenContract.approve(
        config.CONTRACT_ADDRESS,
        upfrontPayment
      );
      await approveTx.wait();

      // Request the loan
      const requestLoanTx = await metaloanContract.requestLoan(loanId);
      await requestLoanTx.wait();

      // Success handling
      setActivePayment(false);
      showAlert(
        true,
        "Congratulations, your loan has been submitted successfully!"
      );
      // Uncomment and adjust if you have a data fetch function
      // dispatch(fetchData(await signer.getAddress()));
    } catch (err) {
      console.error(err);
      setActivePayment(false);
      showAlert(true, "Something went wrong...!");
    }
  }

  /**
   * Pay and records a monthly loan payment
   */
  async function payLoan() {
    setActivePayment(true);
    showAlert(true, "Happy to see you, your payment is processing...!");

    try {
      // Step 1: Connect to the user's wallet using Web3Modal
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();

      // Step 2: Create MetaLoan contract instance
      const metaloanContract = new ethers.Contract(
        config.CONTRACT_ADDRESS, // e.g., "0xA3b2C7cE6f2788148EBfc65BeB4Cb04cb3BDe46E"
        metaloanInterface,
        signer
      );

      // Step 3: Fetch plan details using loanId
      const plan = await metaloanContract.idToPlan(loanId);
      const tokenPayment = plan.tokenPayment; // Address of the ERC20 token (e.g., USDC)
      const monthlyPayment = plan.monthlyPayment; // Amount to pay

      // Step 4: Create ERC20 token contract instance
      const stableTokenContract = new ethers.Contract(
        tokenPayment,
        ERC20ABI,
        signer
      );

      // Step 5: Approve MetaLoan contract to spend tokens
      const approveTx = await stableTokenContract.approve(
        config.CONTRACT_ADDRESS,
        monthlyPayment
      );
      await approveTx.wait(); // Wait for transaction confirmation

      // Step 6: Execute the loan payment
      const payLoanTx = await metaloanContract.payLoan(loanId);
      await payLoanTx.wait(); // Wait for transaction confirmation

      // Step 7: Handle success
      setActivePayment(false);
      showAlert(
        true,
        "Congratulations, your monthly payment has been submitted successfully!"
      );
      dispatch(fetchData(await signer.getAddress())); // Update data if applicable
    } catch (err) {
      // Step 8: Handle errors
      console.error(err);
      setActivePayment(false);
      showAlert(true, "Something went wrong...!");
    }
  }

  /**
   * Fetches and loads the user's loan data from the blockchain.
   */
  async function fetchLoanData() {
    try {
      // Step 1: Connect to the user's wallet using Web3Modal
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const userAccount = await signer.getAddress(); // Get the user's account address
      console.log("user Acccount", userAccount);

      // Step 2: Create MetaLoan contract instance
      const metaloanContract = new ethers.Contract(
        config.CONTRACT_ADDRESS, // e.g., "0xA3b2C7cE6f2788148EBfc65BeB4Cb04cb3BDe46E"
        metaloanInterface,
        provider // Use provider for read-only calls
      );

      console.log("meta loan contract", metaloanContract);

      // Step 3: Fetch loan information for the user and loanId
      const data = await metaloanContract.fetchMyLoan(userAccount, loanId);

      // Step 4: Fetch total payment for the user's wallet
      const paymentData = await metaloanContract.totalPaymentPerWallet(
        userAccount
      );
      const totalPaymentPerWallet = ethers.utils.formatUnits(paymentData, 6); // Assuming 6 decimals for USDC/USDT

      // Step 5: Process loan data
      const startDay = moment.unix(data.start).toString();
      const nextPayment = moment.unix(data.nextPayment).toString();
      const borrowerAddress = data.borrower.toString().toLowerCase();

      setBorrowerAddress(borrowerAddress.toLowerCase());

      const item = {
        borrower: borrowerAddress,
        startLoan: startDay,
        nextPayment: nextPayment,
        totalPayment: totalPaymentPerWallet,
        activated: "Active", // Assuming 'activated' is a boolean or string in the contract
      };

      setLoanData(item);
    } catch (err) {
      console.error("Error fetching loan data:", err);
    }
  }

  /**
   * Fetches and loads all borrowers' data from the blockchain.
   */
  async function fetchBorrowersData() {
    try {
      // Set up the provider
      const provider = new ethers.providers.JsonRpcProvider(
        `https://sepolia.infura.io/v3/${process.env.INFURA_SEPOLIA_PROJECT_ID}`
      );

      // create contract's instance
      const metaloanContract = new ethers.Contract(
        config.CONTRACT_ADDRESS,
        metaloanInterface,
        provider
      );

      console.log("contract address", config.CONTRACT_ADDRESS);
      console.log("abi", metaloanInterface);
      console.log("metaloan Contract", metaloanContract);

      // fetch all borrowers from the contract
      const data = await metaloanContract.fetchAllBorrowers();

      console.log("data", data);

      /* Fetch all borrowers */
      const items = await Promise.all(
        data.map(async (el) => {
          /* All borrowers information */
          // const status = (el.activated).toString();
          let startDay = moment.unix(el.start).toString();
          let nextPayment = moment.unix(el.nextPayment).toString();
          let borrowerAddress = el.borrower.toString();

          let item = {
            borrower: borrowerAddress,
            start: startDay,
            nextPayment: nextPayment,
            activated: "Active",
          };

          return item;
        })
      );
      setBorrowersData(items);
    } catch (err) {
      console.error("Error fetching borrowers data:", err);
    }
  }

  return (
    <>
      <s.Main>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/howitWorks" element={<HowItoWorks />} />
          <Route path="/about" element={<About />} />
          <Route path="/metateam" element={<OurTeam />} />
          <Route
            path="/requestloan"
            element={<ContactForm removeAlert={showAlert} alert={alert} />}
          />
          <Route
            path="/admin"
            element={
              <Admin
                showAlert={showAlert}
                alert={alert}
                activePayment={activePayment}
                setActivePayment={setActivePayment}
              />
            }
          />
          <Route
            path="/launchApp"
            element={
              <LaunchApp
                fetchLoanData={fetchLoanData}
                fetchBorrowersData={fetchBorrowersData}
              />
            }>
            <Route
              path="submitLoan"
              element={
                <SubmitLoan
                  getLoan={getLoan}
                  incrementLoanId={incrementLoanId}
                  decrementLoanId={decrementLoanId}
                  loanId={loanId}
                  alert={alert}
                  removeAlert={showAlert}
                  activePayment={activePayment}
                />
              }
            />

            <Route
              path="payLoan"
              element={
                <PayLoan
                  payLoan={payLoan}
                  alert={alert}
                  removeAlert={showAlert}
                  incrementLoanId={incrementLoanId}
                  decrementLoanId={decrementLoanId}
                  loanId={loanId}
                  activePayment={activePayment}
                />
              }
            />

            <Route
              path="fetchLoan"
              element={
                <FetchLoan
                  LoanData={LoanData}
                  isBorrowerAddress={isBorrowerAddress}
                />
              }
            />
            <Route
              path="borrowers"
              element={<FetchBorrowers BorrowersData={BorrowersData} />}
            />
          </Route>
        </Routes>
        <Footer />
      </s.Main>
    </>
  );
}
export default App;
