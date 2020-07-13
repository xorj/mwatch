import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import instance from "../../axios";

//Styling
import "./movieCard.css";
import imdb from "../../assets/images/imdb.svg";

const MovieCard = (props) => {
  const { id, path, title } = props;
  const [imdbRating, setImdbRating] = useState([]);
  const [year, setYear] = useState("");
  const getImdbId = () => {
    instance
      .get(
        `/movie/${id}/external_ids?api_key=${instance.tmdb}
      `
      )
      .then((response) => {
        const imdb_id = response.data.imdb_id;
        getInfo(imdb_id);
      });
  };

  const getInfo = (imdb) => {
    axios
      .get(`http://www.omdbapi.com/?i=${imdb}&apikey=${instance.omdb}`)
      .then((response) => {
        setYear(response.data["Year"]);
        setImdbRating(response.data.imdbRating);
      });
  };

  useEffect(getImdbId, []);

  return (
    <Link
      to={`movie/${id}`}
      className="movie-card"
      style={{ color: "inherit", textDecoration: "inherit" }}
    >
      <img src={path} alt={title} className="movie-poster" />
      <div className="info">
        <p>{year}</p>
        <div className="imdb">
          <img src={imdb} alt="IMDb" />
          <p>{imdbRating}</p>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
