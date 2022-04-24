// constants
import Web3 from "web3";
import MetaPayment from "../../artifacts/contracts/MetaPayment.sol/MetaPayment.json";
// log
import { fetchData } from "../data/dataActions";


const connectRequest = () => {
  return {
    type: "CONNECTION_REQUEST",
  };
};

const connectSuccess = (payload) => {
  return {
    type: "CONNECTION_SUCCESS",
    payload: payload,
  };
};

const connectFailed = (payload) => {
  return {
    type: "CONNECTION_FAILED",
    payload: payload,
  };
};

const updateAccountRequest = (payload) => {
  return {
    type: "UPDATE_ACCOUNT",
    payload: payload,
  };
};

export const connect = () => {
  return async (dispatch) => {
    dispatch(connectRequest());
    if (window.ethereum) {
      let web3 = new Web3(window.ethereum);
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        
        // Get the network version aka network Id of the network that we are connected wit it in metamask
        const networkId = await window.ethereum.request({
          method: "net_version",
        });

        if (networkId == 1337) {
          const SmartContractObj = new web3.eth.Contract(
            MetaPayment.abi,
            "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853"
          );
          dispatch(
            connectSuccess({
              account: accounts[0],
              smartContract: SmartContractObj,
              web3: web3,
            })
          );
          
          // add the connection in the local storage to still connected on refresh
          localStorage.setItem("isWalletConnected", true);

          // Add listeners start
          window.ethereum.on("accountsChanged", (accounts) => {
            dispatch(updateAccount(accounts[0]));
          });
          window.ethereum.on("chainChanged", () => {
            window.location.reload();
          });
          // Add listeners end
        } else {
          dispatch(connectFailed("Change network to Polygon."));
        }
      } catch (err) {
        dispatch(connectFailed("Something went wrong."));
        localStorage.setItem("isWalletConnected", false);
      }
    } else {
      dispatch(connectFailed("Install Metamask."));
    }
  };
};

export const updateAccount = (account) => {
  return async (dispatch) => {
    dispatch(updateAccountRequest({ account: account }));
    dispatch(fetchData(account));
  };
};
