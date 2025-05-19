// React and Hooks
import React, { useEffect, useState } from "react"; // Core React library with useEffect and useState hooks
import { useDispatch, useSelector } from "react-redux"; // Redux hooks for dispatching actions and selecting state

// CSS Import
import "./App.css"; // Stylesheet for the App component

// Custom Actions
import { connect } from "./redux/blockchain/blockchainActions"; // Custom action for blockchain connection
import { fetchData } from "./redux/data/dataActions"; // Custom action for fetching data

// Custom Styles
import * as s from "./styles/globalStyles";

// Utility Libraries
import moment from "moment"; // Library for date and time manipulation

// Custom Components
import LaunchApp from "./components/LaunchApp/LaunchApp";
import SubmitLoan from "./components/UserPages/SubmitLoan/SubmitLoan";
import PayLoan from "./components/UserPages/PayLoan/PayLoan";
import FetchLoan from "./components/UserPages/FetchLoan/FetchLoan";
import FetchBorrowers from "./components/UserPages/FetchBorrowers/FetchBorrowers";
import Navbar from "./components/Navbar/Navbar";
import About from "./components/About/About";
import Footer from "./components/Footer/Footer";
import ContactForm from "./components/ContactForm/ContactForm";
import Admin from "./components/Admin/Admin";
import HowItoWorks from "./components/HowItWorks/HowItoWorks";
import OurTeam from "./components/OurTeam/OurTeam";
import Home from "./components/Home";
import CubeLoader from "./components/Loaders/cubeLoader";

// Routing
import { Routes, Route } from "react-router-dom";

// Blockchain-related
import ERC20ABI from "./ERC20ABI.json"; // ABI for ERC20 token contract
import metaloanInterface from "./config/abi.json"; // ABI for a custom loan contract
import { ethers } from "ethers";
import Web3Modal from "web3modal";

// Configuration
import config from "./config/config.json";
import { AppDispatch, RootState } from "./redux/store";
import { BlockchainStates } from "./models/blockchainStates";
import { LoanDataType } from "./models/loanData";
import { BorrowerDataType } from "./models/borrowerData";
import { AlertType } from "./models/alert";

const App = (): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const blockchain = useSelector<RootState, BlockchainStates>(
    (state) => state.blockchain
  );
  const [loanId, setLoanId] = useState<number>(0);
  const [LoanData, setLoanData] = useState<LoanDataType | null>(null);
  const [BorrowersData, setBorrowersData] = useState<BorrowerDataType[]>([]);
  const [alert, setAlert] = useState<AlertType | null>({
    show: false,
    msg: "",
  });
  const [activePayment, setActivePayment] = useState<boolean>(false);
  const [isBorrowerAddress, setIsBorrowerAddress] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData());
    }
  }, [blockchain.smartContract]);

  /**
   * Delays setting the loading state to false after 3 seconds and clears the timeout on cleanup.
   */
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    timer = setTimeout(() => {
      setIsLoading(false);
    }, 4000);
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);

  // ShowAlert
  function showAlert(show = false, msg = ""): void {
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
  function incrementLoanId(): void {
    let newLoanId = loanId + 1;
    if (newLoanId > 100) {
      newLoanId = 100;
    }
    setLoanId(newLoanId);
  }

  // Decrement loan Id
  function decrementLoanId(): void {
    let newLoanId = loanId - 1;
    if (newLoanId < 0) {
      newLoanId = 0;
    }
    setLoanId(newLoanId);
  }

  /**
   * Requests and activates a loan plan
   */
  async function getLoan(): Promise<void> {
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
        signer as any
      );

      // Fetch plan details
      const plan = await metaloanContract.idToPlan(loanId);
      const tokenPayment = plan.tokenPayment;
      const upfrontPayment = plan.upfrontPayment;

      // ERC20 token contract instance
      const stableTokenContract = new ethers.Contract(
        tokenPayment,
        ERC20ABI,
        signer as any
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
  async function payLoan(): Promise<void> {
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
        signer as any
      );

      // Step 3: Fetch plan details using loanId
      const plan = await metaloanContract.idToPlan(loanId);
      const tokenPayment = plan.tokenPayment; // Address of the ERC20 token (e.g., USDC)
      const monthlyPayment = plan.monthlyPayment; // Amount to pay

      // Step 4: Create ERC20 token contract instance
      const stableTokenContract = new ethers.Contract(
        tokenPayment,
        ERC20ABI,
        signer as any
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
      dispatch(fetchData()); // Update data if applicable
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
  async function fetchLoanData(): Promise<void> {
    try {
      // Step 1: Connect to the user's wallet using Web3Modal
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const userAccount = await signer.getAddress(); // Get the user's account address

      // Step 2: Create MetaLoan contract instance
      const metaloanContract = new ethers.Contract(
        config.CONTRACT_ADDRESS, // e.g., "0xA3b2C7cE6f2788148EBfc65BeB4Cb04cb3BDe46E"
        metaloanInterface,
        provider as any // Use provider for read-only calls
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

      setIsBorrowerAddress(borrowerAddress.toLowerCase());

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
  async function fetchBorrowersData(): Promise<void> {
    try {
      // Set up the provider
      const provider = new ethers.providers.JsonRpcProvider(
        `https://sepolia.infura.io/v3/${process.env.INFURA_SEPOLIA_PROJECT_ID}`
      );

      // create contract's instance
      const metaloanContract = new ethers.Contract(
        config.CONTRACT_ADDRESS,
        metaloanInterface,
        provider as any
      );

      // fetch all borrowers from the contract
      const data = await metaloanContract.fetchAllBorrowers();

      /* Fetch all borrowers */
      const items = await Promise.all(
        data.map(async (el: any): Promise<BorrowerDataType> => {
          /* All borrowers information */
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
      {isLoading ? (
        <CubeLoader />
      ) : (
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
                  alert={alert}
                  showAlert={showAlert}
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
      )}
    </>
  );
};
export default App;
