import React from "react";
import { FiBookmark as Bookmark } from "react-icons/fi";
import { Link } from "react-router-dom";
//Styling
import "./resultCard.css";

const ResultCard = (props) => {
  return (
    <div className="card">
      <img
        className="poster"
        src={
          props.movie.poster_path
            ? "https://image.tmdb.org/t/p/w300/" + props.movie.poster_path
            : `https://via.placeholder.com/200x300.png?text=NO POSTER`
        }
        alt="Poster"
      />
      <div className="text-box">
        <h3 className="title">
          {props.movie.title}{" "}
          {`(${
            props.movie.release_date
              ? props.movie.release_date.split("-")[0]
              : ""
          })`}
        </h3>
        <p className="overview">
          {props.movie.overview}
          {props.movie.overview
            ? props.movie.overview
            : "Sorry, no overview available."}
        </p>
        <Link
          to={{
            pathname: `/movie/${props.id}`,
            movieProps: props.movie,
          }}
          className="button"
        >
          See more
          <Bookmark className="button-icon" size={"3vh"} />
        </Link>
      </div>
    </div>
  );
};

export default ResultCard;
