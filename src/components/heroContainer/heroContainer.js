import React, { useState, useEffect } from "react";
import { FiBookmark as Bookmark } from "react-icons/fi";
import { Link } from "react-router-dom";
import axios from "axios";

import instance from "../../axios";
import imdb from "../../assets/images/imdb.svg";

//Styling
import "./heroContainer.css";

const HeroContainer = () => {
  const [movieInfo, setMovieInfo] = useState({
    backdrop_path: "",
  });
  const [omdbInfo, setOmdbInfo] = useState({});

  const randomNumber = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  };

  const chooseMovie = () => {
    instance
      .get(
        `/movie/top_rated?api_key=${
          instance.tmdb
        }&language=en-US&page=${randomNumber(1, 3)}`
      )
      .then((response) => {
        const selectedMovie = response.data.results[randomNumber(0, 19)];
        if (selectedMovie.backdrop_path) {
          setMovieInfo(selectedMovie);
          getImdbId();
        } else {
          chooseMovie();
        }
      })
      .catch((err) => {
        console.log({
          error: err,
        });
      });
  };
  const getImdbId = () => {
    if (movieInfo.id) {
      instance
        .get(
          `/movie/${movieInfo.id}/external_ids?api_key=${instance.tmdb}
`
        )
        .then((response) => {
          const { imdb_id } = response.data;
          getOmdbInfo(imdb_id);
        });
    }
  };

  const getOmdbInfo = (imdb) => {
    axios
      .get(`http://www.omdbapi.com/?i=${imdb}&apikey=${instance.omdb}`)
      .then((response) => {
        setOmdbInfo(response.data);
      });
  };

  useEffect(chooseMovie, []);
  useEffect(getImdbId, [movieInfo]);
  return (
    <section
      className="hero-section"
      style={{
        backgroundImage: movieInfo.backdrop_path
          ? `url(https://image.tmdb.org/t/p/original/${movieInfo.backdrop_path}`
          : "",
      }}
    >
      <div className="hero-overlay">
        <div className="hero-text">
          <div className="movie-critics">
            <h3>{movieInfo.title}</h3>
            <img src={imdb} alt="IMDb" />
            <p> {omdbInfo.imdbRating}</p>
          </div>
          <p>
            {movieInfo.overview}
            <br />
          </p>
          <br />
          <div className="hero-atr">
            <p>
              <strong>Director:</strong> {omdbInfo["Director"]}
            </p>

            <p>
              <strong>Writers:</strong> {omdbInfo["Writer"]}
            </p>

            <p>
              <strong>Actors:</strong> {omdbInfo["Actors"]}
            </p>

            <p>
              <strong>Release Date:</strong> {omdbInfo["Released"]}
            </p>

            <p>
              <strong>Genre(s):</strong> {omdbInfo["Genre"]}
            </p>

            <p>
              <strong>Country:</strong> {omdbInfo["Country"]}
            </p>
          </div>
        </div>

        <Link
          to={`/movie/${movieInfo.id}`}
          className="hero-button"
          style={{ color: "inherit", textDecoration: "inherit" }}
        >
          See more
          <Bookmark className="button-icon" size={"3vh"} />
        </Link>
      </div>
    </section>
  );
};

export default HeroContainer;
