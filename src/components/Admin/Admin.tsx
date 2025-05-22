import React, { useState } from "react";
import Alert from "../Alert/Alert";
import "./Admin.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchData } from "../../redux/data/dataActions";
import { AdminProps } from "../../models/adminProps";
import { AppDispatch, RootState } from "../../redux/store";
import { BlockchainStates } from "../../models/blockchainStates";

const Admin: React.FC<AdminProps> = ({
  alert,
  showAlert,
  activePayment,
  setActivePayment,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const blockchain = useSelector<RootState, BlockchainStates>(
    (state) => state.blockchain
  );
  const [lenderAddress, setLenderAddress] = useState<string>("");
  const [USDTaddress, setUsdtAddress] = useState<string>("");
  const [downPayment, setDownPayment] = useState<string>("");
  const [monthlyPayment, setMonthlyPayment] = useState<string>("");

  /* Function to create a plan from the owner wallet | could be solve with inputs form */
  const createLoanPlan = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (!lenderAddress || !USDTaddress || !downPayment || !monthlyPayment) {
      showAlert(true, "Please fill out all form's field!");
      setActivePayment(false);
    } else {
      setActivePayment(true);
      let downPaymentFormatted = (parseFloat(downPayment) * 1000000).toString();
      let monthlyPaymentFormatted = (
        parseFloat(monthlyPayment) * 1000000
      ).toString();
      console.log(
        lenderAddress,
        downPaymentFormatted,
        USDTaddress,
        monthlyPaymentFormatted
      );
      blockchain.smartContract.methods
        .createPlan(
          lenderAddress,
          USDTaddress,
          downPaymentFormatted,
          monthlyPaymentFormatted
        )
        .send({
          from: blockchain.account,
          maxPriorityFeePerGas: null,
          maxFeePerGas: null,
        })
        .once("error", (err: any) => {
          console.log(err);
          setActivePayment(false);
          setLenderAddress("");
          setUsdtAddress("");
          setMonthlyPayment("");
          setDownPayment("");
          showAlert(true, "Something went wrong...!");
        })
        .then(() => {
          setLenderAddress("");
          setUsdtAddress("");
          setMonthlyPayment("");
          setDownPayment("");
          setActivePayment(false);
          dispatch(fetchData());
          showAlert(true, "Your loan plan has been created successfully!");
        });
    }
  };

  return (
    <section className="admin-container" id="admin">
      <div className="title">
        <h1>Welcome Admin!</h1>
        <p>Create a new loan plan</p>
      </div>

      <form
        className="book-form"
        onSubmit={createLoanPlan}
        aria-label="adminForm">
        <div className="inputBox">
          <label htmlFor="text">Lender wallet address</label>
          <input
            type="text"
            placeholder="Lender wallet address"
            value={lenderAddress}
            onChange={(e) => setLenderAddress(e.target.value)}
            required
          />
        </div>

        <div className="inputBox">
          <label htmlFor="text">USDT address</label>
          <input
            type="text"
            placeholder="USDT address"
            value={USDTaddress}
            onChange={(e) => setUsdtAddress(e.target.value)}
            required
          />
        </div>

        <div className="inputBox">
          <label htmlFor="text">Borrower down payment(USDT)</label>
          <input
            type="text"
            placeholder="Borrower down payment"
            value={downPayment}
            onChange={(e) => setDownPayment(e.target.value)}
            required
          />
        </div>

        <div className="inputBox">
          <label htmlFor="text">Borrower monthly payment(USDT)</label>
          <input
            type="text"
            placeholder="Borrower monthly payment"
            value={monthlyPayment}
            onChange={(e) => setMonthlyPayment(e.target.value)}
            required
          />
        </div>

        <div className="inputBox">
          <button type="submit" disabled={activePayment} className="btn-create">
            {activePayment ? "Busy.." : "Create plan"}
          </button>
        </div>

        {alert.show && <Alert {...alert} removeAlert={showAlert} />}
      </form>
    </section>
  );
};

export default Admin;
