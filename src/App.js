//Dependências
import React, { useState } from "react";
import { Route, NavLink, Link, useHistory, Switch } from "react-router-dom";
import { FiFilm as Logo, FiMenu as Menu } from "react-icons/fi";
import { FaSearch as Search, FaHeart as Heart } from "react-icons/fa";

//Components
import HomePage from "./pages/homePage/homePage";
import SearchPage from "./pages/searchPage/searchPage";
import MoviePage from "./pages/moviePage/moviePage";
import AuthPage from "./pages/authPage/authPage";

//Styling
import "./App.css";

function App(props) {
  const history = useHistory();

  const [searchQuery, setSearchQuery] = useState();

  const changeSearchValue = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
  };

  const goTo = (destiny) => {
    history.push(destiny);
  };

  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <Link to="/" className="logo">
          <Logo className="logo-svg" size={"4vh"} color={"#ca3140"} />

          <p>
            <span
              style={{
                color: "#ca3140",
                fontSize: "2.5vh",
              }}
            >
              m
            </span>
            WATCH
          </p>
        </Link>
        <label htmlFor="toggle">
          <Menu size={"4vh"} />
        </label>
        <input type="checkbox" id="toggle" />
        <ul className="menu">
          <li>
            <NavLink to="/asdasdb">Movies</NavLink>
          </li>
          <li className="">
            <NavLink to="/asdasda">TV Series</NavLink>
          </li>
          <li>
            <button
              className="btn login"
              onClick={() => {
                goTo("/login");
              }}
            >
              Log in
            </button>
          </li>
          <li>
            <button
              className="btn signup"
              onClick={() => {
                goTo("/signup");
              }}
            >
              {" "}
              Sign Up
            </button>
          </li>
        </ul>
        <div className="search-box">
          <input
            className="search-txt"
            type="text"
            value={searchQuery}
            onKeyPress={(event) =>
              event.key === "Enter" ? goTo(`/search?${searchQuery}`) : ""
            }
            onChange={(event) => changeSearchValue(event)}
            placeholder="Search..."
          />
          <button
            className="search-btn"
            onClick={
              searchQuery ? () => goTo(`/search?${searchQuery}`) : () => {}
            }
          >
            <Search size={"2vh"} className="search-icon" />
          </button>
        </div>
      </nav>

      <Switch>
        <Route path="/search" component={SearchPage} />
        <Route path="/movie/:id" component={MoviePage} />
        <Route path="/login" component={() => <AuthPage type="login" />} />
        <Route path="/signup" component={() => <AuthPage type="signup" />} />
        <Route exact path="/" component={HomePage} />
        <Route
          component={() => (
            <p
              style={{
                padding: "2vh",
              }}
            >
              404 - Page not found
            </p>
          )}
        />
      </Switch>

      <footer className="footer">
        <p>
          © 2020, made with <Heart color={"#ca3140"} /> by{" "}
          <a
            href="https://github.com/xorj"
            target="_blank"
            rel="noopener noreferrer"
          >
            xorj
          </a>
        </p>
      </footer>
    </>
  );
}

export default App;
