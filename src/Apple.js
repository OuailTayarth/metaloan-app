import React, { useEffect, useState} from "react";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "../src/styles/globalStyles";
import moment from 'moment';
import Web3 from "web3";


import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";



let web3 = new Web3(window.ethereum);


/*
  To get the tokenId I can add or initial a variable at 0 inside the smart contract 
  instead of array.length, so I can make a call for the tokenId from the contract
  TODOS: tracking the token ID
       : Create an nave with a router  
       : How to get the error from the smart contract;
*/

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  // const [status, setStatus] = useState("");
  // const [loading, setLoading] = useState(false);
  const [downPayment, setDownPayment] = useState("100000000000000");
  const [paymentMonthly, setPaymentMonthly] = useState("100000000000000");

  const [allPlans, setAllPlans] = useState([]);
  const [allLoans, setAllLoans] = useState([]);
  
  console.log(allPlans, allLoans);
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
      console.log("Your payment went successfully");
      dispatch(fetchData(blockchain.account));
    })
  }


  /* Fetch all Plans/read */
  async function fetchPlan() {
     const data = await blockchain.smartContract.methods.fetchPlan("0").call();
    console.log(data);

      let items = {
          monthlyPayment: data.monthlyPayment,
          upfrontPayment: data.upfrontPayment
      }

      setAllPlans(items);
  }

  

  /*Fetch all Loans */
  async function fetchMyLoan() {
    const data = await blockchain.smartContract.methods.fetchMyLoan("0").call();
    console.log("All loan data", data);

    const status = (data.activated).toString();
    let startDay = (moment.unix(data.start)).toString();
    let nextPayment = (moment.unix(data.nextPayment)).toString();

        let item = {
          borrower : data.borrower,
          startLoan: startDay,
          nextPayment: nextPayment,
          activated: status
        }
        console.log(data.activated);

    setAllLoans(item);
  }



  return (
    <s.Main>
        <>  
            <Navbar/>
            <Routes>
                <Route path="/" element={<Home/>}/>
            </Routes>
        </>
    </s.Main>
  );
}

export default App;
