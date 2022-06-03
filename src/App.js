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
import CreatePlan from "./components/CreatePlan/CreatePlan";
import HeroSection from "./components/HeroSection/HeroSection";
import About from "./components/About/About";
import Testimonials from "./components/Testimonials/Testimonials";
import Footer from "./components/Footer/Footer";
import ContactForm from "./components/ContactForm/ContactForm";
import HowItoWorks from "./components/HowItWorks/HowItoWorks";
let web3 = new Web3(window.ethereum);






/*
  To get the tokenId I can add or initial a variable at 0 inside the smart contract 
  instead of array.length, so I can make a call for the tokenId from the contract
  TODOS: tracking the token ID
       : Create an nave with a router  
       : How to get the error from the smart contract;
       : Smart the instance if the smart contract is not activated
       : Create a plan navbar
       : If I don't connect dispatch connect I will not be able to see the smart contract
       : I got stuck on returning all the borrowers
       : add the animation of developer/designer/trust
       : background animated video metaverse
       : merging the function of NFt minter dapp with the current dapp
       : return array of arrays and store it inside an array.
       : convert arrays inside array to object= TODOS
       : data.response the error cause Promise.all should be await as well as the
       call
       make payment input;
       based on the address I should display The Tokens logo
       fix the problem of when I click on borrowers I need to to click twice on the connect
       wallet smart contract twice????????
       How should I get the abi of USDC abi on polygon network
*/


function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const [loanId, setLoanId] = useState(0);
  const [tokenPaymentAddress, setTokenPaymentAddress] = useState([]);
  console.log(tokenPaymentAddress);
  const [LoanData, setLoanData] = useState([]);
  const [BorrowersData, setBorrowersData] = useState([]);
  const [alert, setAlert] = useState({show : false, msg: ""});
  const [activePayment, setActivePayment] = useState(false);
  
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


  // /* Function to create a plan from the owner wallet | could be solve with inputs form */
  function createPlan() {
    const upfrontPayment = web3.utils.toWei("20", "ether");
    const monthlyPayment = web3.utils.toWei("20", "ether");
    const lenderAddress = "0x68ec584C5f130319E71992bC9A8369111a07c5FA";
    const tokenPaymentAddress = "0x5B4c93B48A18F5DfA3e86Dcb3843477A82955cb5";
    console.log(upfrontPayment,monthlyPayment);
    blockchain.smartContract.methods
    .createPlan(lenderAddress, tokenPaymentAddress,upfrontPayment, monthlyPayment)
    .send({from : blockchain.account})
    .once("error", (err)=> {
      console.log(err);
      console.log("Transaction was rejected!");
    })
    .then((receipt)=> {
      console.log(receipt);
      dispatch(fetchData(blockchain.account));
    });

  }


  // function to get a loan at a specific planId
  function getLoan() {
    showAlert(true, "Welcome to MetaLoan, Your payment is processing...!");
    setActivePayment(true);
    blockchain.smartContract.methods.requestLoan(loanId).send({from : blockchain.account})
    .once("error", (err)=> {
      let error = err.toString();
      console.log(error);
      console.log(err);
      setActivePayment(false);
      showAlert(true, "Something went wrong");
    })
    .then((receipt)=> {
      console.log(receipt);
      setActivePayment(false);
      showAlert(true, "Congratulations, You loan has been submitted successfully!");
      dispatch(fetchData(blockchain.account));
    });
  }

  // pay loan
  function payLoan() {
    setActivePayment(true);
    showAlert(true, "Happy to see you, Your payment is processing...!");  
    blockchain.smartContract.methods.payLoan(loanId).send({from: blockchain.account})
    .once("error", (err)=> {
      console.log(err);
      setActivePayment(false);
      showAlert(true, "Something went wrong...!");
    })
    .then((receipt)=> {
      console.log(receipt);
      setActivePayment(false);
      showAlert(true, "Congratulations, You monthly payment has been submitted successfully");
      dispatch(fetchData(blockchain.account));
    })
  }

  
  

  // /*Fetch all Loans */
  async function fetchLoanData() {
    const userAccount = await blockchain.account;
    const data = await blockchain.smartContract.methods.fetchMyLoan(userAccount,"0").call();
    const paymentData = await blockchain.smartContract.methods.totalPaymentTracker(userAccount).call();
    const totalPaymentPerWallet = web3.utils.fromWei(paymentData, "ether");
    console.log(totalPaymentPerWallet);
    const status = (data.activated).toString();
    let startDay = (moment.unix(data.start)).toString();
    let nextPayment = (moment.unix(data.nextPayment)).toString();
    let borrowerAddress = (data.borrower).toString();
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
    const data = await blockchain.smartContract.methods.fetchAllBorrowers().call();
    
    let items = await Promise.all(data.map(async (el) => {
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
      console.log(item);
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
                    element={<FetchLoan LoanData={LoanData}/>}/>

                    <Route path="fetchBorrowers" 
                    element={<FetchBorrowers BorrowersData = {BorrowersData}/>}/>

                    <Route path="createPlan"
                    element={<CreatePlan createPlan={createPlan}/>}/>
                </Route>
            </Routes>
            <ContactForm/>
            <Footer/>
        </>
    </s.Main>
    
  );
}

export default App;











{/* <s.Main>
      {blockchain.account === "" || blockchain.smartContract === null ? (
        <>
          <s.title>MetaLoan Welcome</s.title>
          <s.Button 
          onClick={(e)=> {
            e.preventDefault()
            dispatch(connect())
          }}>
            Connect
          </s.Button>
        </>
      ):
      
      (
        <>
        <s.title>Get a loan with US</s.title>
         <s.Button 
         onClick={(e)=> {
           e.preventDefault();
           createPlan();
         }}
         >
            Create plan
         </s.Button>

         <s.Button
         onClick={(e)=> {
           e.preventDefault();
           getLoan();
         }}> 
           Get a loan
          </s.Button>

          <s.Button
         onClick={(e)=> {
           e.preventDefault();
           payLoan();
         }}> 
           Pay
          </s.Button>

          <s.Button
         onClick={(e)=> {
           e.preventDefault();
           fetchPlan();
         }}> 
           fetchPlans
          </s.Button>

          <s.Button
         onClick={(e)=> {
           e.preventDefault();
           fetchMyLoan();
         }}> 
           fetchLoans
          </s.Button>

          <>
          <h1>{allPlans.upfrontPayment}</h1>
          <h1>{allPlans.monthlyPayment}</h1>
      
      
          {/* {allPlans.map((plan, i)=> {
            return (
              <div key={i}>
                <h1>{plan.loanDuration}</h1>
                <h2>{plan.monthlyPayment}</h2>
                <h2>30</h2>
                <h2>1%</h2>
              </div>
            )
          })} */}
          // </>

          // <h1>{allLoans.borrower}</h1>
          // <h1>{allLoans.startLoan}</h1>
          // <h1>{allLoans.nextPayment}</h1>
          // <h1>{allLoans.activated}</h1>


          
          {/* {allLoans.map((loan, i)=> {
            return (
              <div key={i}>
                <h1>{loan.borrower}</h1>
                <h2>{loan.start}</h2>
                <h2>{loan.nextPayment}</h2>
                <h1>{loan.activated}</h1>
              
              </div>
            )
    //       })}   */}

    //     </>

       
      // )}
      
    // </s.Main> */}



    