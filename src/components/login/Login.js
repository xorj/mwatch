import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import * as Yup from "yup";
import axios from "axios";

const Login = (props) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState([]);
  const history = useHistory();
  const schema = Yup.object().shape({
    email: Yup.string().email("Invalid Email.").required("E-mail is required."),
    password: Yup.string().required("Password is required."),
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const goTo = (destiny) => {
    history.push(destiny);
  };

  const sendForm = () => {
    schema
      .validate(formData, { abortEarly: false })
      .then((valid) => {
        axios
          .post("https://mwatch-server.herokuapp.com/login", formData)
          .then((res) => {
            localStorage.setItem("SESSION", JSON.stringify(res.data));
            goTo("/");
            window.location.reload(false);
          })
          .catch((err) => {
            setErrors(["Incorrent email or password."]);
          });
        setErrors([]);
      })
      .catch((err) => {
        console.log(err);
        setErrors(err.errors);
      });
  };

  return (
    <>
      <h1 className="auth-title">Log In</h1>
      <label htmlFor="email" className="auth-label">
        Email
      </label>
      <input
        className="auth-input"
        type="email"
        name="email"
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
      <ul>
        {errors.map((error) => {
          return (
            <li key={error} className="auth-error">
              * {error}
            </li>
          );
        })}
      </ul>
      <button className="auth-button" onClick={sendForm}>
        Log In
      </button>
      <p>
        New here?{" "}
        <strong>
          <Link className="auth-link" to={"/signup"}>
            Sign Up
          </Link>
        </strong>
      </p>
    </>
  );
};

export default Login;
