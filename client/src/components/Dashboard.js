import React from "react";
import { useSelector } from "react-redux";
import TopNavigation from "./TopNavigation";

function Dashboard() {
  let storeObj = useSelector((store) => {
    console.log(store);
    return store.loginReducer;
  });

  let onDeleteAccount = async () => {
    let reqOptions = {
      method: "DELETE",
    };

    let url = `${storeObj.loginDetails.email}`;

    let JSONData = await fetch(url, reqOptions);

    let JSOData = await JSONData.json();
    console.log(JSOData);
    alert(JSOData.msg);
  };

  return (
    <div>
      <TopNavigation />
      <h1>Dashboard</h1>
      <button
        onClick={() => {
          onDeleteAccount();
        }}
      >
        Delete Account
      </button>
      <h2>
        Welcome to {storeObj.loginDetails.firstName}{" "}
        {storeObj.loginDetails.lastName}
      </h2>
      <img src={`/${storeObj.loginDetails.profilePic}`}></img>
    </div>
  );
}

export default Dashboard;
