//Dependências
import React, { useState, useEffect } from "react";
import { Route, NavLink, Link, useHistory, Switch } from "react-router-dom";
import { FiFilm as Logo, FiMenu as Menu } from "react-icons/fi";
import { FaSearch as Search, FaHeart as Heart } from "react-icons/fa";

//Components
import HomePage from "./pages/homePage/homePage";
import SearchPage from "./pages/searchPage/searchPage";
import MoviePage from "./pages/moviePage/moviePage";
import AuthPage from "./pages/authPage/authPage";
import Watchlist from "./pages/watchlistPage/watchlistPage";

//Styling
import "./App.css";

function App(props) {
  const history = useHistory();
  const [searchQuery, setSearchQuery] = useState();
  const [isLogged, setIsLogged] = useState(false);
  const changeSearchValue = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
  };

  const goTo = (destiny) => {
    history.push(destiny);
  };
  const logOut = () => {
    localStorage.clear();
    setIsLogged(false);
    goTo("/");
    window.location.reload(false);
  };
  useEffect(() => {
    if (localStorage.getItem("SESSION")) {
      setIsLogged(true);
    }
  }, [isLogged]);
  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <Link to="/" className="logo">
          <Logo className="logo-svg" size={"4vh"} color={"#e50914"} />

          <p>
            <span
              style={{
                color: "#e50914",
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
          {isLogged ? (
            <>
              <li>
                <NavLink to="/watchlist">Watchlist</NavLink>
              </li>

              <li>
                <button className="btn login" onClick={logOut}>
                  Log Out
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <button className="btn login" onClick={() => goTo("/login")}>
                  Log In
                </button>
              </li>
              <li>
                <button className="btn signup" onClick={() => goTo("/signup")}>
                  Sign Up
                </button>
              </li>
            </>
          )}
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
        <Route path="/login" component={() => <AuthPage type="login" />} />
        <Route path="/signup" component={() => <AuthPage type="signup" />} />
        <Route path="/watchlist" component={Watchlist} />
        <Route path="/movie/:id" component={MoviePage} />
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
          © 2020, made with <Heart color={"#e50914"} /> by{" "}
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
