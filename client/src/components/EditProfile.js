import React, { useEffect, useRef, useState } from "react";
import TopNavigation from "./TopNavigation";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function EditProfile() {
  let firstNameInputRef = useRef();
  let lastNameInputRef = useRef();
  let ageInputRef = useRef();
  let emailInputRef = useRef();
  let passwordInputRef = useRef();
  let mobileNoInputRef = useRef();
  let profilePicInputRef = useRef();

  let storeObj = useSelector((store) => {
    return store.loginReducer;
  });

  useEffect(() => {
    assignUserValues();
  }, []);

  let assignUserValues = () => {
    firstNameInputRef.current.value = storeObj.loginDetails.firstName;
    lastNameInputRef.current.value = storeObj.loginDetails.lastName;
    ageInputRef.current.value = storeObj.loginDetails.age;
    emailInputRef.current.value = storeObj.loginDetails.email;
    mobileNoInputRef.current.value = storeObj.loginDetails.mobileNo;
    setSelectedImage(`/${storeObj.loginDetails.profilePic}`);
  };

  let [selectedImage, setSelectedImage] = useState("./images/noImage.png");

  let onUpdateProfile = async () => {
    let dataToSend = new FormData();
    dataToSend.append("firstName", firstNameInputRef.current.value);
    dataToSend.append("lastName", lastNameInputRef.current.value);
    dataToSend.append("age", ageInputRef.current.value);
    dataToSend.append("email", emailInputRef.current.value);
    dataToSend.append("password", passwordInputRef.current.value);
    dataToSend.append("mobileNo", mobileNoInputRef.current.value);

    for (let i = 0; i < profilePicInputRef.current.files.length; i++) {
      dataToSend.append("profilePic", profilePicInputRef.current.files[i]);
    }

    let reqOptions = {
      method: "PUT",
      body: dataToSend,
    };

    let JSONData = await fetch("/updateProfile", reqOptions);

    let JSOData = await JSONData.json();

    console.log(JSOData);
    alert(JSOData.msg);
  };

  return (
    <div className="App">
      <TopNavigation />
      <form>
        <h2>Edit Profile</h2>
        <div>
          <label>First Name</label>
          <input ref={firstNameInputRef}></input>
        </div>
        <div>
          <label>Last Name</label>
          <input ref={lastNameInputRef}></input>
        </div>
        <div>
          <label>Age</label>
          <input ref={ageInputRef}></input>
        </div>
        <div>
          <label>Email</label>
          <input ref={emailInputRef} readOnly></input>
        </div>
        <div>
          <label>Password</label>
          <input ref={passwordInputRef}></input>
        </div>
        <div>
          <label>Mobile No</label>
          <input ref={mobileNoInputRef}></input>
        </div>
        <div>
          <label>Profile Pic</label>
          <input
            ref={profilePicInputRef}
            type="file"
            onChange={(e) => {
              let selectedImageURL = URL.createObjectURL(e.target.files[0]);
              setSelectedImage(selectedImageURL);
            }}
          ></input>
          <br></br>
          <img src={selectedImage} className="profilePicPreview"></img>
        </div>
        <div>
          <button
            type="button"
            onClick={() => {
              onUpdateProfile();
            }}
          >
            Update Profile
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProfile;
