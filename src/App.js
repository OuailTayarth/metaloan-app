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

       var time = moment.unix(1331300839)
       time.toString();
*/

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  // const [status, setStatus] = useState("");
  // const [loading, setLoading] = useState(false);
  const [downPayment, setDownPayment] = useState("10000000000000000");
  const [paymentMonthly, setPaymentMonthly] = useState("100000000000000");
  const [onGoingLoan, setOnGoingLoan] = useState({});
  const [allPlans, setAllPlans] = useState([]);
  const [allLoans, setAllLoans] = useState([]);

  console.log(allPlans, allLoans);
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
  
    const upfrontPayment = web3.utils.toWei("0.0001", "ether");
    const monthlyPayment = web3.utils.toWei("0.00001", "ether");
    const loanDuration = 90;
    const interestRate = 1;
    console.log(upfrontPayment,monthlyPayment,interestRate,loanDuration);
    blockchain.smartContract.methods
    .createPlan(upfrontPayment,loanDuration,interestRate,monthlyPayment)
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


  // /* Fetch On Going loans */
  //  async function fetchOnGoingLoan() {
  //    const data =  await blockchain.smartContract.methods.getPlan("0").call();
  //    console.log(data);

  //    let item = {
  //      lender : data.lender,
  //      LoanDuration: data.loanDuration,
  //      monthlyPayment: data.monthlyPayment,
  //      upfrontPayment: data.upfrontPayment,
  //      interestRate: data.interestRate
  //     }
  //     setOnGoingLoan(item);
  // }


  /* Fetch all Plans/read */
  async function fetchAllPlan() {
     const data = await blockchain.smartContract.methods.getAllPlans().call();
     const fetchPlans = await Promise.all(data.map(async i => {
      let item = {
        loanDuration: i.loanDuration,
        monthlyPayment: i.monthlyPayment,
        upfrontPayment: i.upfrontPayment,
        interestRate: i.interestRate
      }

      return (item);

     }));

     setAllPlans(fetchPlans);

  }


  /*Fetch all Loans */
  async function fetAllLoans() {
    const data = await blockchain.smartContract.methods.getAllLoans().call();
    console.log(data);

    const allLoans = await Promise.all(data.map(async i => {

        let item = {
          borrower : i.borrower,
          startLoan: i.start,
          nextPayment: i.nextPayment,
          activated: i.activated
        }

        return(item);
    }));

    setAllLoans(allLoans);
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
           fetchAllPlan();
         }}> 
           fetchPlans
          </s.Button>

          <s.Button
         onClick={(e)=> {
           e.preventDefault();
           fetAllLoans();
         }}> 
           fetchLoans
          </s.Button>

          <>
          {allPlans.map((plan, i)=> {
            return (
              <div key={i}>
                <h1>{plan.loanDuration}</h1>
                <h2>{plan.monthlyPayment}</h2>
                <h2>{plan.upfrontPayment}</h2>
                <h2>{plan.interestRate}</h2>
              </div>
            )
          })}
          </>


          {allLoans.map((loan, i)=> {
            return (
              <div key={i}>
                <h1>{loan.borrower}</h1>
                <h2>{loan.start}</h2>
                <h2>{loan.nextPayment}</h2>
                <h1>{loan.activated}</h1>
              
              </div>
            )
          })}  

        </>

       
      )}
      
    </s.Main>
  );
}

export default App;
