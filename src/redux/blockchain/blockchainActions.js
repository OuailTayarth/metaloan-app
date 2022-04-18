// constants
import Web3 from "web3";
import Web3EthContract from "web3-eth-contract";
import { fetchData } from "../data/dataActions";
import metaloanInterface from "../../../src/config/abi.json";
import config from "../../../src/config/config.json";

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

    const { ethereum } = window;
    const metamaskIsInstalled = ethereum && ethereum.isMetaMask;

    if (metamaskIsInstalled) {
      Web3EthContract.setProvider(ethereum);
      let web3 = new Web3(ethereum);
      try {
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        const networkId = await ethereum.request({
          method: "net_version",
        });
        if (networkId === config.NETWORK.ID) {
          const SmartContractObj = new Web3EthContract(
            metaloanInterface,
            config.CONTRACT_ADDRESS
          );

          dispatch(
            connectSuccess({
              account: accounts[0],
              smartContract: SmartContractObj,
              web3: web3,
              walletConnected: true,
            })
          );

          localStorage.setItem("isWalletConnected", true);

          // Add listeners
          ethereum.on("accountsChanged", (accounts) => {
            dispatch(updateAccount(accounts[0]));
          });

          ethereum.on("chainChanged", () => {
            window.location.reload();
          });
          // Add listeners end
        } else {
          dispatch(
            connectFailed(
              `Please connect to the ${config.NETWORK.NAME} network.`
            )
          );
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
