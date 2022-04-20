/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState} from "react";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "../src/styles/globalStyles";

import Web3 from "web3";

let web3 = new Web3(window.ethereum);


/*
  To get the tokenId I can add or initial a variable at 0 inside the smart contract 
  instead of array.length, so I can make a call for the tokenId from the contract
  TODO: tracking the token ID
       : if the payment hasn't been paid the first month we deactivate the loan as well as the     access;
       : How to calculate the monthly payment;
       : How to calculate the payment when the user take;
       : bear NFT collection calculation (could be good to learn from);
       : How to get the error from the smart contract;
*/

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  // const [status, setStatus] = useState("");
  // const [loading, setLoading] = useState(false);
  const [downPayment, setDownPayment] = useState("1000000000000000");
  const [paymentMonthly, setPaymentMonthly] = useState("100000000000000");
  const [onGoingLoan, setOnGoingLoan] = useState({});
  console.log(onGoingLoan);
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


  /* function to create a plan from the owner wallet*/
  function createPlan() {
  
    const upfrontPayment = web3.utils.toWei("0.001", "ether");
    const monthlyPayment = web3.utils.toWei("0.0001", "ether");
    const loanDuration = 30;
    const interestRate = 1;

    blockchain.smartContract.methods
    .createPlan(blockchain.account, upfrontPayment,loanDuration,interestRate,monthlyPayment)
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

  // add the value that the user should send
  // function to get a loan at a specific planId
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
      console.log("You payment went successfully");
      dispatch(fetchData(blockchain.account));
    })
  }


  function cancelLoan() {
    blockchain.smartContract.methods
    .cancelLoan("0")
    .send({from : blockchain.account})
    .once("error", (err)=> {
      console.log(err);
      console.log("Something went wrong with canceling loan")
    }).then((receipt)=> {
      console.log(receipt);
      console.log("You Loan has been Cancel successfully...");
      dispatch(fetchData(blockchain.account));
    });
  }


  /* Fetch On Going loans */
   async function fetchOnGoingLoan() {
     const data =  await blockchain.smartContract.methods.getPlan("0").call();
     console.log(data);

     let item = {
       lender : data.lender,
       LoanDuration: data.loanDuration,
       monthlyPayment: data.monthlyPayment,
       upfrontPayment: data.upfrontPayment,
       interestRate: data.interestRate
      }
      setOnGoingLoan(item);
  }




  return (
    <s.Main>
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
           cancelLoan();
         }}> 
           Cancel Loan
          </s.Button>

          <s.Button
         onClick={(e)=> {
           e.preventDefault();
           fetchOnGoingLoan();
         }}> 
           fetch
          </s.Button>
        </>
      )}
      
    </s.Main>
  );
}

export default App;
