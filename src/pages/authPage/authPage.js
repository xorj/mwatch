import React from "react";
//Components
import Signup from "../../components/signup/Signup";
import Login from "../../components/login/Login";

//Styling
import "./authPage.css";
const Auth = (props) => {
  return (
    <div
      className="auth-wrapper"
      style={{
        backgroundImage: `url("https://image.tmdb.org/t/p/original//pCUdYAaarKqY2AAUtV6xXYO8UGY.jpg")`,
      }}
    >
      <div className="auth-form">
        {props.type === "login" ? <Login /> : ""}
        {props.type === "signup" ? <Signup /> : ""}
      </div>
    </div>
  );
};

export default Auth;
