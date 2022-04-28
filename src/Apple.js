import React, { useEffect, useState} from "react";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "../src/styles/globalStyles";
// import moment from 'moment';
import Web3 from "web3";
import LaunchApp from "./components/LaunchApp/LaunchApp";
import SubmitLoan from "./components/UserPages/SubmitLoan/SubmitLoan";
import PayLoan from "./components/UserPages/PayLoan/PayLoan";
import FetchLoan from "./components/UserPages/FetchLoan/FetchLoan";
import FetchBorrowers from "./components/UserPages/FetchBorrowers/FetchBorrowers";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import CreatePlan from "./components/CreatePlan/CreatePlan";



let web3 = new Web3(window.ethereum);


/*
  TODOS: tracking the token ID
       : How to get the error from the smart contract;
       : Create an nave with a router x 
       : styles the main navbar for the website
*/

function Apple() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const [downPayment, setDownPayment] = useState("100000000000000");
  const [paymentMonthly, setPaymentMonthly] = useState("100000000000000");

  
  console.log(blockchain.smartContract);

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


  

  // // add the value that the user should send
  // // function to get a loan at a specific planId
  // function getLoan() {
  //   blockchain.smartContract.methods
  //   .getLoan("0")
  //   .send({from : blockchain.account, value: downPayment})
  //   .once("error", (err)=> {
  //     console.log(err);
  //     console.log("Transaction was rejected");
  //   })
  //   .then((receipt)=> {
  //     console.log(receipt);
  //     console.log("Im so dress for success!");
  //     dispatch(fetchData(blockchain.account));
  //   });
  // }


  // // pay loan
  // function payLoan() {
  //   blockchain.smartContract.methods
  //   .pay("0")
  //   .send({from: blockchain.account, value : paymentMonthly})
  //   .once("error", (err)=> {
  //     console.log(err);
  //     console.log("something went wrong");
  //   })
  //   .then((receipt)=> {
  //     console.log(receipt);
  //     console.log("Your payment went successfully");
  //     dispatch(fetchData(blockchain.account));
  //   })
  // }


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
  // async function fetchMyLoan() {
  //   const data = await blockchain.smartContract.methods.fetchMyLoan("0").call();
  //   console.log("All loan data", data);

  //   const status = (data.activated).toString();
  //   let startDay = (moment.unix(data.start)).toString();
  //   let nextPayment = (moment.unix(data.nextPayment)).toString();

  //       let item = {
  //         borrower : data.borrower,
  //         startLoan: startDay,
  //         nextPayment: nextPayment,
  //         activated: status
  //       }
  //       console.log(data.activated);

  //   setAllLoans(item);
  // }



  return (
    <s.Main>
        <>  
            <Navbar/>
            <Routes>
                <Route path="launchApp" element={<LaunchApp/>}>
                  <Route path="submitLoan" element={<SubmitLoan/>}/>
                  <Route path="payLoan" element={<PayLoan/>}/>
                  <Route path="fetchLoan" element={<FetchLoan/>}/>
                  <Route path="fetchBorrowers" element={<FetchBorrowers/>}/> 
                  <Route path="createPlan" element={<CreatePlan/>}/>
                </Route>
            </Routes> 
            <button onClick={()=> }>CreatePlan</button>
        </>
    </s.Main>
  );
}

export default Apple;
