import React, { useState, useEffect } from "react";
import instance from "../../axios";
import axios from "axios";
import {
  FiCalendar as Calendar,
  FiClock as Clock,
  FiDollarSign as Budget,
  FiBarChart as Revenue,
  FiAward as Award,
  FiPlus as Add,
  FiBriefcase as Director,
  FiArrowLeft as Left,
  FiArrowRight as Right,
  FiStar as Star,
} from "react-icons/fi";
import imdb from "../../assets/images/imdb.svg";
import userImage from "../../assets/images/user-image.png";
import userImage2 from "../../assets/images/user-image2.png";

//Styling
import "./moviePage.css";

import { Redirect } from "react-router";
const MoviePage = (props) => {
  //Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const ref = React.createRef();

  const [movieInfoTmdb, setmovieInfoTmdb] = useState({
    genres: [],
  });
  const [movieCast, setMovieCast] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState();
  const [movieInfoOmdb, setMovieInfoOmdb] = useState({});
  const { id } = props.match.params;
  const [error, setError] = useState();

  const getImdbId = () => {
    instance
      .get(
        `/movie/${id}/external_ids?api_key=${instance.tmdb}
         `
      )
      .then((response) => {
        const { imdb_id } = response.data;
        getMovieInfo(imdb_id);
        getMovieCast();
      })
      .catch((error) => {
        setError(error.response.status);
      });
  };

  const getTmdbInfo = () => {
    instance
      .get(
        `/movie/${props.match.params.id}?api_key=${instance.tmdb}&language=en-US
         `
      )
      .then((response) => {
        setmovieInfoTmdb(response.data);
      });
  };

  const getMovieInfo = (imdb) => {
    axios
      .get(
        `http://www.omdbapi.com/?i=${imdb}&apikey=${instance.omdb}&plot=short`
      )
      .then((response) => {
        setMovieInfoOmdb(response.data);
      });
  };

  const getMovieCast = () => {
    instance
      .get(`movie/${id}/credits?api_key=${instance.tmdb}`)
      .then((response) => {
        setMovieCast(response.data.cast);
        setTotalPages(response.data.cast.length / 7);
      });
  };

  const previousPage = () => {
    setCurrentPage(currentPage - 1);
    window.scrollTo({
      top: ref.current.offsetTop,
      behavior: "smooth",
    });
  };
  const nextPage = () => {
    setCurrentPage(currentPage + 1);
    window.scrollTo({
      top: ref.current.offsetTop,
      behavior: "smooth",
    });
  };

  useEffect(getImdbId, []);
  useEffect(getTmdbInfo, []);

  var formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  let content;
  if (error) {
    content = (
      <Redirect
        to={{
          pathname: "/",
        }}
      />
    );
  } else {
    content = (
      <div
        className="wrapper-moviepage"
        style={{
          backgroundImage: movieInfoTmdb.backdrop_path
            ? `url(https://image.tmdb.org/t/p/original/${movieInfoTmdb.backdrop_path})`
            : "",
        }}
      >
        <div className="content">
          <div className="main-content">
            <img
              className="movie-poster"
              src={
                movieInfoTmdb.poster_path
                  ? "http://image.tmdb.org/t/p/w780/" +
                    movieInfoTmdb.poster_path
                  : `https://via.placeholder.com/200x300.png?text=NO POSTER`
              }
              alt="Poster"
            />
            <div className="movie-info">
              <div className="title-rating-tagline">
                <div className="title-rating">
                  <h2>{movieInfoTmdb.title}</h2>

                  <img src={imdb} alt="IMDb" id="imdb" />
                  <p
                    style={{
                      fontWeight: "600",
                    }}
                  >
                    {" "}
                    {movieInfoOmdb.imdbRating}
                  </p>
                </div>
                <h3 className="tagline">{movieInfoTmdb.tagline}</h3>
              </div>

              <p className="plot">{movieInfoOmdb["Plot"]}</p>

              <div className="genres">
                <p>Genres: </p>
                {movieInfoTmdb
                  ? movieInfoTmdb.genres.map((genre) => (
                      <p key={genre.name} className="genre-card">
                        {genre.name}
                      </p>
                    ))
                  : ""}
              </div>
              <button className="add-watchlist">
                Add to watchlist
                <Add
                  size={"3vh"}
                  style={{
                    marginLeft: "1vh",
                  }}
                />
              </button>
            </div>
          </div>
          <div className="section">
            <h2 className="moviepage-title">INFO</h2>
            <div className="card-list">
              <p className="info-card">
                <Director color={"#ca3140"} size={"3vh"} />
                Director: {movieInfoOmdb["Director"]}
              </p>
              <p className="info-card">
                <Calendar color={"#ca3140"} size={"3vh"} />
                Release Day: {movieInfoOmdb["Released"]}
              </p>
              <p className="info-card">
                <Clock color={"#ca3140"} size={"3vh"} />
                Duration: {(movieInfoTmdb.runtime / 60) | 0} h{" "}
                {movieInfoTmdb.runtime % 60} m
              </p>

              <p className="info-card">
                {" "}
                <Budget color={"#ca3140"} size={"3vh"} />
                Budget: {formatter.format(movieInfoTmdb.budget)}
              </p>
              <p className="info-card">
                <Revenue color={"#ca3140"} size={"3vh"} />
                Revenue: {formatter.format(movieInfoTmdb.revenue)}
              </p>
              <p className="info-card">
                <Award color={"#ca3140"} size={"3vh"} />
                Awards: {movieInfoOmdb["Awards"]}
              </p>
            </div>
          </div>

          <div className="section" ref={ref}>
            <h2 className="moviepage-title">CAST</h2>
            <div className="cast-cards">
              {movieCast
                .slice((currentPage - 1) * 7, currentPage * 7)
                .map((person) => {
                  return (
                    <div key={person.cast_id} className="cast-card">
                      <img
                        src={
                          person.profile_path
                            ? "https://image.tmdb.org/t/p/w500/" +
                              person.profile_path
                            : "https://via.placeholder.com/200x300.png?text=NO PROFILE"
                        }
                        alt=""
                      />
                      <p>
                        {person.name} as {person.character}
                      </p>
                    </div>
                  );
                })}
            </div>
            <div className="pagination">
              <button
                className="page-button"
                onClick={previousPage}
                disabled={currentPage <= 1}
              >
                <Left />
              </button>
              <p className="current-page">{currentPage}</p>
              <button
                className="page-button"
                onClick={nextPage}
                disabled={currentPage >= totalPages}
              >
                <Right />
              </button>
            </div>
          </div>
          <div className="section">
            {/* Criar um componente chamados reviews que recebe o id do filme e fazer uma requisição para a API,
            Ex.: "get localhost:3000/reviews/122" */}
            <h2 className="moviepage-title">REVIEWS</h2>
            <div className="reviews">
              <div className="review">
                <img
                  src={userImage}
                  alt="User profile"
                  className="user-image"
                />
                <div className="review-info">
                  <div className="review-title">
                    <h3>LoR Hater - This movie sucks.</h3>
                    <p>
                      <Star size={"2.5vh"} /> 1.0
                    </p>
                  </div>
                  <p className="review-text">
                    It's was so boring a started sleeping after 10 minutes. I
                    don't give shit about those rings.It's was so boring a
                    started sleeping after 10 minutes. I don't give shit about
                    those rings.It's was so boring a started sleeping after 10
                    minutes. I don't give shit about those rings.It's was so
                    boring a started sleeping after 10 minutes. I don't give
                    shit about those rings.It's was so boring a started sleeping
                    after 10 minutes. I don't give shit about those rings.It's
                    was so boring a started sleeping after 10 minutes. I don't
                    give shit about those rings.It's was so boring a started
                    sleeping after 10 minutes. I don't give shit about those
                    rings.It's was so boring a started sleeping after 10
                    minutes. I don't give shit about those rings.It's was so
                    boring a started sleeping after 10 minutes. I don't give
                    shit about those rings.It's was so boring a started sleeping
                    after 10 minutes. I don't give shit about those rings.
                  </p>
                </div>
              </div>
              <div className="review">
                <img
                  src={userImage2}
                  alt="User profile"
                  className="user-image"
                />

                <div className="review-info">
                  <div className="review-title">
                    <h3>Literaly a Robot - BIP BIP BUP</h3>
                    <p>
                      <Star size={"2.5vh"} />
                      5.0
                    </p>
                  </div>
                  <p className="review-text">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Aliquam vel lorem tellus. Integer luctus eleifend ligula.
                    Nunc eu fermentum tellus. Donec non vulputate nisl. Morbi
                    ultricies auctor consectetur. Duis a viverra velit. Vivamus
                    et varius tellus. Nulla metus justo, ullamcorper at est sit
                    amet, tincidunt luctus libero. Morbi consectetur laoreet
                    neque, blandit convallis massa vestibulum eu. Ut at aliquet
                    arcu. Vestibulum ante ipsum primis in faucibus orci luctus
                    et ultrices posuere cubilia curae; Vestibulum ante ipsum
                    primis in faucibus orci luctus et ultrices posuere cubilia
                    curae; Aenean pharetra sapien ac enim viverra, et pulvinar
                    felis gravida. Quisque mollis ipsum at interdum lobortis.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{content}</>;
};

export default MoviePage;
