import React from "react";
import ReactDOM from "react-dom";
import Apple from "./Apple";
import store from "./redux/store";
import { Provider } from "react-redux";
import {BrowserRouter} from "react-router-dom";


ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Apple />
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);

