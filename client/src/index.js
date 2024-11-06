import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { applyMiddleware, combineReducers, createStore } from "redux";
import { Provider } from "react-redux";
import { thunk } from "redux-thunk";

let initialStore = {
  loginDetails: {},
};

let loginReducer = (latestStore = initialStore, dispatchedObj) => {
  if (dispatchedObj.type == "login") {
    return { ...latestStore, loginDetails: dispatchedObj.data };
  }

  return latestStore;
};

let tasksReducer = (latestStore = initialStore, dispatchedObj) => {
  if (dispatchedObj.type == "addTask") {
    return { ...latestStore, loginDetails: dispatchedObj.data };
  } else if (dispatchedObj.type == "deleteTask") {
    return { ...latestStore, loginDetails: dispatchedObj.data };
  } else if (dispatchedObj.type == "approveTask") {
    return { ...latestStore, loginDetails: dispatchedObj.data };
  } else if (dispatchedObj.type == "rejectTask") {
    return { ...latestStore, loginDetails: dispatchedObj.data };
  }

  return latestStore;
};

let leavesReducer = (latestStore = initialStore, dispatchedObj) => {
  if (dispatchedObj.type == "applyLeave") {
    return { ...latestStore, loginDetails: dispatchedObj.data };
  } else if (dispatchedObj.type == "approveLeave") {
    return { ...latestStore, loginDetails: dispatchedObj.data };
  } else if (dispatchedObj.type == "rejectLeave") {
    return { ...latestStore, loginDetails: dispatchedObj.data };
  } else if (dispatchedObj.type == "cancelLeave") {
    return { ...latestStore, loginDetails: dispatchedObj.data };
  }

  return latestStore;
};

let store = createStore(
  combineReducers({ loginReducer, leavesReducer, tasksReducer }),
  applyMiddleware(thunk)
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
