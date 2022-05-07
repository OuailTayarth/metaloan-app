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
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import CreatePlan from "./components/CreatePlan/CreatePlan";
import HeroSection from "./components/HeroSection/HeroSection";

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
*/

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const [downPayment, setDownPayment] = useState("100000000000000");
  const [paymentMonthly, setPaymentMonthly] = useState("100000000000000");
  const [LoanData, setLoanData] = useState([]);
  const [BorrowersData, setBorrowersData] = useState([]);


  useEffect(() => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  }, [blockchain.smartContract, dispatch]);




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


  /* function to create a plan from the owner wallet*/
  function createPlan() {
    const upfrontPayment = web3.utils.toWei("0.0001", "ether");
    const monthlyPayment = web3.utils.toWei("0.00001", "ether");
    console.log(upfrontPayment,monthlyPayment);
    blockchain.smartContract.methods
    .createPlan(upfrontPayment,monthlyPayment)
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

  // // add the value that the user should send
  // // function to get a loan at a specific planId
  function getLoan() {
    blockchain.smartContract.methods
    .getLoan("0")
    .send({from : blockchain.account, value: downPayment})
    .once("error", (err)=> {
      console.log(err);
      console.log("Transaction was rejected");
    })
    .then((receipt)=> {
      console.log(receipt);
      console.log("Im so dress for success!");
      dispatch(fetchData(blockchain.account));
    });
  }


  // pay loan
  function payLoan() {
    blockchain.smartContract.methods
    .pay("0")
    .send({from: blockchain.account, value : paymentMonthly})
    .once("error", (err)=> {
      console.log(err);
      console.log("something went wrong");
    })
    .then((receipt)=> {
      console.log(receipt);
      console.log("Your payment went successfully");
      dispatch(fetchData(blockchain.account));
    })
  }


  // /* Fetch all Plans/read */
  // async function fetchPlan() {
  //    const data = await blockchain.smartContract.methods.fetchPlan("0").call();
  //   console.log(data);

  //     let items = {
  //         monthlyPayment: data.monthlyPayment,
  //         upfrontPayment: data.upfrontPayment
  //     }

  //     setAllPlans(items);
  // }

  

  // /*Fetch all Loans */
  async function fetchLoanData() {
    const account = await blockchain.account;
    console.log(account);
    const data = await blockchain.smartContract.methods.getLoan(account,"0").call();
    console.log(data);

    const status = (data.activated).toString();
    let startDay = (moment.unix(data.start)).toString();
    let nextPayment = (moment.unix(data.nextPayment)).toString();

      let item = {
        borrower : data.borrower,
        startLoan: startDay,
        nextPayment: nextPayment,
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
      
      let item = {
        borrower : el.borrower,
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
        {/* <button
           onClick={(e)=> {
             e.preventDefault()
             dispatch(connect())
           }}>
             Connect
           </button> */}
            <Navbar/>
            <HeroSection/>
            <Routes>
                <Route path="launchApp" 
                    element={<LaunchApp fetchLoanData={fetchLoanData} 
                                        fetchBorrowersData={fetchBorrowersData}/>}>
                    <Route path="submitLoan" 
                    element={<SubmitLoan getLoan={getLoan} />}/>
                    <Route path="payLoan" 
                    element={<PayLoan payLoan={payLoan}/>}/>
                    <Route path="fetchLoan" 
                    element={<FetchLoan LoanData={LoanData}/>}/>
                    <Route path="fetchBorrowers" 
                    element={<FetchBorrowers BorrowersData = {BorrowersData}/>}/> 
                    <Route path="createPlan"
                    element={<CreatePlan createPlan={createPlan}/>}/>
                </Route>
            </Routes> 
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