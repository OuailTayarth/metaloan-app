import React, { useState } from "react";
import Alert from "../Alert/Alert";
import "./Admin.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchData } from "../../redux/data/dataActions";

const Admin = ({ alert, showAlert, activePayment, setActivePayment }) => {
  const dispatch = useDispatch();

  const blockchain = useSelector((state) => state.blockchain);
  const [lenderAddress, setLenderAddress] = useState("");
  const [USDTaddress, setUsdtAddress] = useState("");
  const [downtPayment, setDowntPayment] = useState("");
  const [monthlyPayment, setMonthlyPayment] = useState("");

  /* Function to create a plan from the owner wallet | could be solve with inputs form */
  const createloanPlan = (e) => {
    e.preventDefault();

    if (!lenderAddress || !USDTaddress || !downtPayment || !monthlyPayment) {
      console.alert("Please fill out all form's field!");
      setActivePayment(false);
    } else {
      setActivePayment(true);
      let downtPaymentFormated = downtPayment * 1000000;
      let monthlyPaymentFormated = monthlyPayment * 1000000;
      console.log(
        lenderAddress,
        downtPaymentFormated,
        USDTaddress,
        monthlyPaymentFormated
      );
      blockchain.smartContract.methods
        .createPlan(
          lenderAddress,
          USDTaddress,
          downtPaymentFormated,
          monthlyPaymentFormated
        )
        .send({
          from: blockchain.account,
          maxPriorityFeePerGas: null,
          maxFeePerGas: null,
        })
        .once("error", (err) => {
          console.log(err);
          setActivePayment(false);
          setLenderAddress("");
          setUsdtAddress("");
          setMonthlyPayment("");
          setDowntPayment("");
          showAlert(true, "Something went wrong...!");
        })
        .then((receipt) => {
          setLenderAddress("");
          setUsdtAddress("");
          setMonthlyPayment("");
          setDowntPayment("");
          setActivePayment(false);
          dispatch(fetchData(blockchain.account));
          showAlert(true, "Your loan plan has been created successfully!");
        });
    }
  };

  return (
    <section className="admin-container" id="admin">
      <div className="title">
        <h1>Welcome Omar!</h1>
        <p>Create a new loan plan</p>
      </div>

      <form className="book-form" onSubmit={createloanPlan}>
        <div className="inputBox">
          <label for="text">Lender wallet address</label>
          <input
            type="text"
            placeholder=" Lender wallet address"
            value={lenderAddress}
            onChange={(e) => setLenderAddress(e.target.value)}
            required
          />
        </div>

        <div className="inputBox">
          <label for="text">USDT address</label>
          <input
            type="text"
            placeholder="USDT address"
            value={USDTaddress}
            onChange={(e) => setUsdtAddress(e.target.value)}
            required
          />
        </div>

        <div className="inputBox">
          <label for="text">Borrower down payment(USDT)</label>
          <input
            type="text"
            placeholder="Borrower down payment"
            value={downtPayment}
            onChange={(e) => setDowntPayment(e.target.value)}
            required
          />
        </div>

        <div className="inputBox">
          <label for="text">Borrower monthly payment(USDT)</label>
          <input
            type="text"
            placeholder="Borrower monthly payment"
            value={monthlyPayment}
            onChange={(e) => setMonthlyPayment(e.target.value)}
            required
          />
        </div>

        <div className="inputBox">
          <button
            type="submit"
            disabled={activePayment ? 1 : 0}
            className="btn-create">
            {activePayment ? "Busy.." : "Create plan"}
          </button>
        </div>

        <>{alert.show && <Alert {...alert} showAlert={showAlert} />}</>
      </form>
    </section>
  );
};

export default Admin;
