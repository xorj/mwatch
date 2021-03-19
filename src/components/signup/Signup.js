import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import * as Yup from "yup";
import axios from "axios";
const Signup = (props) => {
  const history = useHistory();

  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState([]);
  const schema = Yup.object().shape({
    name: Yup.string()
      .required("Name is required.")
      .min(6, "Name has to be at least 6 characters."),
    email: Yup.string()
      .email("E-mail is not valid.")
      .required("E-mail is required."),
    password: Yup.string()
      .min(6, "Password has to be at least 6 characters.")
      .required("Password is required."),
    confirmpassword: Yup.string()
      .required("Password confirmation is required.")
      .oneOf([formData.password], "Passwords are not the same."),
  });

  const goTo = (destiny) => {
    history.push(destiny);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const sendForm = () => {
    schema
      .validate(formData, { abortEarly: false })
      .then((valid) => {
        axios
          .post("https://mwatch-server.herokuapp.com/signup", formData)
          .then((res) => {
            console.log(res);
            goTo("/");
            window.location.reload(false);
          })
          .catch((err) => {
            console.log(err);
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
      <h1 className="auth-title">Sign Up</h1>
      <label htmlFor="email" className="auth-label">
        Email
      </label>
      <input
        className="auth-input"
        type="text"
        name="email"
        onChange={handleInputChange}
      />

      <label htmlFor="name" className="auth-label">
        Name
      </label>
      <input
        className="auth-input"
        type="name"
        name="name"
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
      <label htmlFor="confirmpassword" className="auth-label">
        Confirm Password
      </label>
      <input
        className="auth-input"
        type="password"
        name="confirmpassword"
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
        Sign Up
      </button>
      <p>
        Already a User?{" "}
        <strong>
          <Link className="auth-link" to={"/login"}>
            Log In
          </Link>
        </strong>
      </p>
    </>
  );
};

export default Signup;
