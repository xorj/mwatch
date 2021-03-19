import React, { useState, useEffect } from "react";
import auth from "../../auth";
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
  FiCheck as Added,
  FiX as CantAdd,
} from "react-icons/fi";
import imdb from "../../assets/images/imdb.svg";
import userImage from "../../assets/images/user-image.png";

//Styling
import "./moviePage.css";

import { Redirect } from "react-router";
const MoviePage = (props) => {
  const [isLogged, setIsLogged] = useState(false);
  const [added, setAdded] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5.0 });
  const addToWatchList = () => {
    auth.put(`/user/watchlist/${id}`).then((res) => {
      setAdded(true);
    });
  };
  const checkWatchlist = () => {
    auth
      .get("/user/watchlist")
      .then((res) => {
        if (res.data.includes(Number(id))) {
          setAdded(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //Scroll to top on page change
  useEffect(checkWatchlist, [setAdded]);

  //Check if user is logged
  useEffect(() => {
    if (localStorage.getItem("SESSION")) {
      setIsLogged(true);
    }
  }, [isLogged]);

  //Review form change handler
  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setReviewForm({
      ...reviewForm,
      [name]: value,
    });
  };

  const ref = React.createRef();

  const [movieInfoTmdb, setmovieInfoTmdb] = useState({
    genres: [],
  });
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);
  const [movieCast, setMovieCast] = useState([]);
  const [reviews, setReviews] = useState([]);
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
        `https://www.omdbapi.com/?i=${imdb}&apikey=${instance.omdb}&plot=short`
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
  const getReviews = () => {
    auth
      .get(`/reviews/${id}`)
      .then((res) => {
        setReviews(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const sendReview = () => {
    auth
      .post(`/user/reviews/${id}`, reviewForm)
      .then((res) => {
        window.location.reload(false);
      })
      .catch((err) => console.log(err));
  };

  const getAlreadyReviewed = () => {
    let reviewsList = reviews;
    reviewsList = reviewsList.filter(
      (review) =>
        JSON.parse(localStorage.getItem("SESSION")).user.id === review.user_id
    );

    setAlreadyReviewed(reviewsList.length > 0);
  };
  useEffect(getImdbId, []);
  useEffect(getTmdbInfo, []);
  useEffect(getReviews, []);
  useEffect(getAlreadyReviewed, [reviews]);
  var formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });
  let buttonState;
  if (!isLogged) {
    buttonState = (
      <>
        Login to add to watchlist
        <CantAdd
          size={"3vh"}
          style={{
            marginLeft: "1vh",
          }}
        />
      </>
    );
  } else if (added) {
    buttonState = (
      <>
        Added to watchlist
        <Added
          size={"3vh"}
          style={{
            marginLeft: "1vh",
          }}
        />
      </>
    );
  } else {
    buttonState = (
      <>
        Add to watchlist
        <Add
          size={"3vh"}
          style={{
            marginLeft: "1vh",
          }}
        />
      </>
    );
  }

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
                  ? "https://image.tmdb.org/t/p/w780/" +
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
              <button
                className="add-watchlist"
                onClick={!(added || !isLogged) ? addToWatchList : null}
                disable={(added || !isLogged).toString()}
              >
                {buttonState}
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
            <h2 className="moviepage-title">REVIEWS</h2>
            <div className="reviews">
              {reviews.length > 0 ? (
                reviews.map((review) => {
                  return (
                    <div key={review.id} className="review">
                      <img
                        src={userImage}
                        alt="User profile"
                        className="user-image"
                      />
                      <div className="review-info">
                        <div className="review-title">
                          <h3>
                            {review.user_name} - {review.title}
                          </h3>
                          <p>
                            <Star size={"2.5vh"} /> {review.rating}
                          </p>
                        </div>
                        <p className="review-text">{review.text}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <h3
                  style={{
                    padding: "2vh",
                  }}
                >
                  Sorry, no reviews avaliable.
                </h3>
              )}
            </div>
          </div>
          {isLogged && !alreadyReviewed ? (
            <div className="section">
              <div className="add-review" onSubmit={null}>
                <h2 className="moviepage-title">ADD NEW REVIEW</h2>
                <fieldset className="review-inputs">
                  <label htmlFor="title" className="review-label">
                    <h3>Review Title</h3>
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    className="review-input-text title"
                    onChange={handleInputChange}
                  />
                  <label htmlFor="title" className="review-label">
                    <h3>Review Text</h3>
                  </label>
                  <textarea
                    type="text"
                    name="text"
                    id="text"
                    className="review-input-text text"
                    onChange={handleInputChange}
                  />
                  <label htmlFor="title" className="review-label">
                    <h3>Rating</h3>
                  </label>
                  <div className="rating-range">
                    <input
                      type="range"
                      name="rating"
                      min="0"
                      max="10"
                      step="0.5"
                      className="review-rating"
                      value={reviewForm.rating}
                      onChange={handleInputChange}
                    />
                    <Star />
                    <p className="rating">
                      {Number(reviewForm.rating).toFixed(1)}
                    </p>
                  </div>
                </fieldset>
                <button className="review-button" onClick={sendReview}>
                  Send Review
                </button>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }

  return <>{content}</>;
};

export default MoviePage;
