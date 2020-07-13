import React, { useState } from "react";
import { Link } from "react-router-dom";

//Styling
import "./authPage.css";
const Auth = (props) => {
  const types = {
    signup: {
      type: "Sign Up",
      link: "/login",
      message: "Already a user? Log In",
    },
    login: {
      type: "Log In",
      link: "/signup",
      message: "New here? Sign Up",
    },
  };
  const { type, link, message } = types[props.type];
  const [formData, setFormData] = useState({});
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div
      className="auth-wrapper"
      style={{
        backgroundImage: `url("https://image.tmdb.org/t/p/original//pCUdYAaarKqY2AAUtV6xXYO8UGY.jpg")`,
      }}
    >
      <form className="auth-form">
        <h1 className="auth-title">{type}</h1>
        <label htmlFor="email" className="auth-label">
          Email
        </label>
        <input
          className="auth-input"
          type="text"
          name="email"
          placeholder="example@domain.com"
          onChange={handleInputChange}
        />
        <label htmlFor="password" className="auth-label">
          Password
        </label>

        <input
          className="auth-input"
          type="password"
          name="password"
          onChange={handleInputChange}
        />
        {type === "Sign Up" ? (
          <>
            <label htmlFor="confirmpassword" className="auth-label">
              Confirm Password
            </label>
            <input
              className="auth-input"
              type="password"
              name="confirmpassword"
              onChange={handleInputChange}
            />
          </>
        ) : (
          ""
        )}
        <button className="auth-button" type="submit">
          {" "}
          Log In
        </button>
        <p>
          {message.split("?")[0]}?
          <strong>
            <Link className="auth-link" to={link}>
              {message.split("?")[1]}
            </Link>
          </strong>
        </p>
      </form>
    </div>
  );
};

export default Auth;
