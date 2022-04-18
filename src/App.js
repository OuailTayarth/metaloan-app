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

*/

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  // const [status, setStatus] = useState("");
  // const [loading, setLoading] = useState(false);
  const [payment, setPayment] = useState("1000000000000000");
  console.log(payment);
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
      console.log("Transaction was rejected!")
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
    .getLoan("3")
    .send({from : blockchain.account, value: payment})
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


  // // set Alert message
  // const showMessage = (msg) => {
  //   return setStatus(msg);
  // }

  /*Function to mint the NFT */
  // const mint = (_uri) =>  {
  //   blockchain.smartContract.methods
  //   .mint(blockchain.account, _uri)
  //   .send({from : blockchain.account})
  //   .once("error", (err)=> {
  //     console.log(err)
  //     setLoading(false);
  //     showMessage("MetaMask : transaction was rejected!");
  //   })
  //   .then((receipt)=> {
  //     console.log(receipt);
  //     setLoading(false);
  //     showMessage("Successfully minting your NFT...!");
  //     dispatch(fetchData(blockchain.account));
  //   });
  // }
  

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
        </>
      )}
      
    </s.Main>
  );
}

export default App;
