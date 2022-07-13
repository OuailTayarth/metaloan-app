import React, { useEffect, useState} from "react";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "../src/styles/globalStyles";
import moment from 'moment';
import Web3 from "web3";
import LaunchApp from "./components/LaunchApp/LaunchApp";
import SubmitLoan from "./components/UserPages/SubmitLoan/SubmitLoan";
import PayLoan from "./components/UserPages/PayLoan/PayLoan";
import FetchLoan from "./components/UserPages/FetchLoan/FetchLoan";
import FetchBorrowers from "./components/UserPages/FetchBorrowers/FetchBorrowers";
import { Routes, Route} from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import HeroSection from "./components/HeroSection/HeroSection";
import About from "./components/About/About";
import Footer from "./components/Footer/Footer";
import ContactForm from "./components/ContactForm/ContactForm";
import HowItoWorks from "./components/HowItWorks/HowItoWorks";
import ERC20ABI from "./ERC20ABI.json";
import FAQ from "./components/FAQ/FAQ";
import OurTeam from "./components/OurTeam/OurTeam";
let web3 = new Web3(window.ethereum);


  // Metaloan real smart contract : 0x6Eb3a9B8776BE1DdbAc473D2af5b403BA69320cb
function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const [loanId, setLoanId] = useState(0);
  // const [tokenPaymentAddress, setTokenPaymentAddress] = useState([]);

  const [LoanData, setLoanData] = useState([]);
  const [BorrowersData, setBorrowersData] = useState([]);
  const [alert, setAlert] = useState({show : false, msg: ""});
  const [activePayment, setActivePayment] = useState(false);
  const [isBorrowerAddress, setBorrowerAddress] = useState();

  
  useEffect(() => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  }, [blockchain.smartContract, dispatch]);


  // useEffect(()=> {
  //   navigate("/", {replace: true});
  // },[]);

  
  // ShowAlert
  function showAlert(show = false, msg = "") {
      setAlert({show:show, msg:msg});
  }


  // keep the user connected on page refresh
  useEffect(()=> {
    const onPageConnected = async () => {
      if (localStorage?.getItem('isWalletConnected') === 'true') {
        try{
          dispatch(connect());
        } catch(err) {
          console.log(err);
        }
      }
    }
    onPageConnected();
  },[])



  // Increment Loan Id
  function incrementLoanId() {
    let newLoanId = loanId + 1;
    if(newLoanId > 100) {
        newLoanId = 100;
    }
    setLoanId(newLoanId);
  }

  // Decrement Loan Id
  function decrementLoanId() {
    let newLoanId = loanId + 1;
    if(newLoanId > 0) {
        newLoanId = 0;
    }
    setLoanId(newLoanId);
  }


  // // /* Function to create a plan from the owner wallet | could be solve with inputs form */
  // function createPlan() {
  //   const upfrontPayment = web3.utils.toWei("20", "ether");
  //   const monthlyPayment = web3.utils.toWei("20", "ether");
  //   const lenderAddress = "0x68ec584C5f130319E71992bC9A8369111a07c5FA";
  //   const tokenPaymentAddress = "0x5B4c93B48A18F5DfA3e86Dcb3843477A82955cb5";
  //   console.log(upfrontPayment,monthlyPayment);
  //   blockchain.smartContract.methods
  //   .createPlan(lenderAddress, tokenPaymentAddress,upfrontPayment, monthlyPayment)
  //   .send({from : blockchain.account})
  //   .once("error", (err)=> {
  //     console.log(err);
  //     console.log("Transaction was rejected!");
  //   })
  //   .then((receipt)=> {
  //     console.log(receipt);
  //     dispatch(fetchData(blockchain.account));
  //   });

  // }


  // To request a Loan at a specific planId
  async function getLoan() {
    showAlert(true, "Welcome to MetaLoan, Your payment is processing...!");
    setActivePayment(true);

    /* Get Plan Information */
    let plan = await blockchain.smartContract.methods.idToPlan(loanId).call();
    let tokenPayment = plan.tokenPayment;
    let upfrontPayment = plan.upfrontPayment;

    /* Create Instance of USDC tokens */ 
    let USDTToken = new web3.eth.Contract(ERC20ABI, tokenPayment);

    const MetaLoanAddress = "0x6Eb3a9B8776BE1DdbAc473D2af5b403BA69320cb";

    /* We can't use to: because we are approving not transferring funds */
    USDTToken.methods
    .approve(MetaLoanAddress, upfrontPayment)
    .send({from : blockchain.account,
           maxPriorityFeePerGas: null,
           maxFeePerGas: null})
    .once("error", (err)=> {
      let error = err.toString();
      console.log(error);
      console.log(err);
      setActivePayment(false);
      showAlert(true, "Something went wrong...!");
    })
    .then((receipt)=> {
      blockchain.smartContract.methods.requestLoan(loanId)
      .send({from : blockchain.account,
             maxPriorityFeePerGas: null,
             maxFeePerGas: null
      })
      .once("error", (err) => {
        let error = err.toString();
        console.log(error);
        setActivePayment(false);
        showAlert(true, "Something went wrong...!");
      })
      .then((receipt)=> {
        console.log(receipt);
        setActivePayment(false);
        showAlert(true, "Congratulations, You loan has been submitted successfully!");
        dispatch(fetchData(blockchain.account));
      })
    })
  
  }


  /* To Pay for monthly Loan */
  async function payLoan() {
    setActivePayment(true);
    showAlert(true, "Happy to see you, Your payment is processing...!");  

    /* Get Plan Information */
    let plan = await blockchain.smartContract.methods.idToPlan(loanId).call();
    console.log(plan);
    let tokenPayment = plan.tokenPayment;
    let monthlyPayment = plan.monthlyPayment;
    
    /* Create Instance of USDC tokens */ 
    let USDTToken = new web3.eth.Contract(ERC20ABI, tokenPayment);

    const MetaLoanAddress = "0x6Eb3a9B8776BE1DdbAc473D2af5b403BA69320cb";
    
    USDTToken.methods
    .approve(MetaLoanAddress, monthlyPayment)
    .send({from : blockchain.account,
           maxPriorityFeePerGas: null,
           maxFeePerGas: null})
    .once("error", (err)=> {
      console.log(err);
      setActivePayment(false);
      showAlert(true, "Something went wrong...!");
    })
    .then((receipt)=> {
      blockchain.smartContract.methods.payLoan(loanId)
        .send({from: blockchain.account,
               maxPriorityFeePerGas: null,
               maxFeePerGas: null
        })
        .once("error", (error)=> {
          console.log(error);
          setActivePayment(false);
          showAlert(true, "Something went wrong...!");
        })
        .then((receipt)=> {
          console.log(receipt);
          setActivePayment(false);
          showAlert(true, "Congratulations, You monthly payment has been submitted successfully");
          dispatch(fetchData(blockchain.account));
        })
    })

  }

  
  

  /* Fetch loan per user */
  async function fetchLoanData() {
    /* User Account */
    const userAccount = await blockchain.account;

    /* Get Loan information */
    const data = await blockchain.smartContract.methods.fetchMyLoan(userAccount, loanId).call();

    /* Get the total Payment of each wallet */
    const paymentData = await blockchain.smartContract.methods.totalPaymentPerWallet(userAccount).call();
    const totalPaymentPerWallet =  (paymentData / 1000000);

    /* Loan information */
    const status = (data.activated).toString();
    let startDay = (moment.unix(data.start)).toString();
    let nextPayment = (moment.unix(data.nextPayment)).toString();
    let borrowerAddress = (data.borrower).toString();

    setBorrowerAddress(borrowerAddress.toLowerCase());

      let item = {
        borrower : borrowerAddress,
        startLoan: startDay,
        nextPayment: nextPayment,
        totalPayment: totalPaymentPerWallet,
        activated: status
      }

      setLoanData(item);
  
  }


  // fetch borrowers Data 
  async function fetchBorrowersData () {
    /* Get all borrowers */
    const data = await blockchain.smartContract.methods.fetchAllBorrowers().call();

    /* Fetch all borrowers */
    let items = await Promise.all(data.map(async (el) => {
      /* All borrowers information */
      const status = (el.activated).toString();
      let startDay = (moment.unix(el.start)).toString();
      let nextPayment = (moment.unix(el.nextPayment)).toString();
      let borrowerAddress = (el.borrower).toString();

      let item = {
        borrower : borrowerAddress,
        start: startDay,
        nextPayment: nextPayment,
        activated: status
      }

      return item;
      
    }));
    setBorrowersData(items);
  }


  return (
    <s.Main>
        <>  
            <Navbar/>
            <Routes>
                <Route path="/" element={<HeroSection/>}/>
                <Route path="/howItWorks" element={<HowItoWorks/>}/>
                <Route path="/about" element={<About/>}/>
                <Route path="/team" element={<OurTeam/>}/>
                {/* <Route path="/faq" element={<FAQ/>}/> */}
                <Route path="/launchApp"
                    element={<LaunchApp fetchLoanData={fetchLoanData} 
                                        fetchBorrowersData={fetchBorrowersData}/>}>
                
                    <Route path="submitLoan" 
                    element={<SubmitLoan getLoan={getLoan}
                                         incrementLoanId={incrementLoanId}
                                         decrementLoanId={decrementLoanId}
                                         loanId={loanId}
                                         alert = {alert}
                                         removeAlert = {showAlert}
                                         activePayment={activePayment}
                                         />}/>

                    <Route path="payLoan"
                    element={<PayLoan    payLoan={payLoan}
                                         alert = {alert}
                                         removeAlert = {showAlert}
                                         incrementLoanId={incrementLoanId}
                                         decrementLoanId={decrementLoanId}
                                         loanId={loanId}
                                         activePayment={activePayment}/>}/>

                    <Route path="fetchLoan" 
                    element={<FetchLoan LoanData={LoanData}
                                        isBorrowerAddress={isBorrowerAddress}/>}/>

                    <Route path="fetchBorrowers" 
                    element={<FetchBorrowers BorrowersData = {BorrowersData}/>}/>
                    

                    {/* <Route path="createPlan"
                    element={<CreatePlan createPlan={createPlan}/>}/> */}
                </Route>
            </Routes>
            <ContactForm removeAlert={showAlert}
                         alert={alert}/>
            <Footer/>
        </>
    </s.Main>
    
  );
}

export default App;










    