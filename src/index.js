import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import store from "./redux/store";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
// import "./components/HeroSection/HeroSection.css";
// import "./App.css";
// import "./../src/styles/globalStyles.js";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
