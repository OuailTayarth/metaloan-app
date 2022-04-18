import { configureStore, combineReducers } from "@reduxjs/toolkit";
import blockchainReducer from "./blockchain/blockchainReducer";
import dataReducer from "./data/dataReducer";

const rootReducer = combineReducers({
  blockchain: blockchainReducer,
  data: dataReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
