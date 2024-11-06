import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

function Login() {
  let emailInputRef = useRef();
  let passwordInputRef = useRef();
  let navigate = useNavigate();
  let dispatch = useDispatch();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      //validateToken();
    }
  }, []);

  let validateToken = async () => {
    let dataToSend = new FormData();
    dataToSend.append("token", localStorage.getItem("token"));

    let reqOptions = {
      method: "POST",
      body: dataToSend,
    };

    let JSONData = await fetch("/validateToken", reqOptions);

    let JSOData = await JSONData.json();
    console.log(JSOData);

    if (JSOData.status == "failure") {
      alert(JSOData.msg);
    } else {
      dispatch({ type: "login", data: JSOData.data });
      navigate("/dashboard");
    }
  };

  let onLoginUsingFD = async () => {
    let dataToSend = new FormData();

    dataToSend.append("email", emailInputRef.current.value);
    dataToSend.append("password", passwordInputRef.current.value);

    let reqOptions = {
      method: "POST",
      body: dataToSend,
    };

    let JSONData = await fetch("/login", reqOptions);

    let JSOData = await JSONData.json();

    console.log(JSOData);

    if (JSOData.status == "failure") {
      alert(JSOData.msg);
    } else {
      dispatch({ type: "login", data: JSOData.data });
      localStorage.setItem("token", JSOData.data.token);
      navigate("/dashboard");
    }
  };

  let onLogin = () => {
    return async () => {
      let dataToSend = new FormData();

      dataToSend.append("email", emailInputRef.current.value);
      dataToSend.append("password", passwordInputRef.current.value);

      let reqOptions = {
        method: "POST",
        body: dataToSend,
      };

      let JSONData = await fetch("/login", reqOptions);

      let JSOData = await JSONData.json();

      console.log(JSOData);

      if (JSOData.status == "failure") {
        alert(JSOData.msg);
      } else {
        dispatch({ type: "login", data: JSOData.data });
        localStorage.setItem("token", JSOData.data.token);
        navigate("/dashboard");
      }
    };
  };

  return (
    <div className="App">
      <form>
        <h2>Sign Up</h2>

        <div>
          <label>Email</label>
          <input ref={emailInputRef}></input>
        </div>
        <div>
          <label>Password</label>
          <input ref={passwordInputRef}></input>
        </div>

        <div>
          <button
            type="button"
            onClick={() => {
              // dispatch(onLoginUsingFD());
              dispatch(onLogin());
            }}
          >
            Login
          </button>
        </div>
      </form>
      <br></br>
      <br></br>
      <br></br>
      <Link to="/signup">Signup</Link>
    </div>
  );
}

export default Login;
