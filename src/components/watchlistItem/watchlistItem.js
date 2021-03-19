import React from "react";
import { Link } from "react-router-dom";
import { FiTrash as Delete, FiExternalLink } from "react-icons/fi";

//Styling
import "./watchlistItem.css";

const WatchlistItem = (props) => {
  return (
    <div className="watchlistitem">
      <Link
        className="movie-link"
        to={`/movie/${props.id}`}
        style={{ textDecoration: "inherit" }}
      >
        <p className="movie-title">{props.title} </p>
        <FiExternalLink size={"2.5vh"} />
      </Link>
      <p className="movie-duration">{props.duration}</p>
      <button className="delete-button" onClick={() => props.delete(props.id)}>
        <Delete size={"2.5vh"} />
      </button>
    </div>
  );
};

export default WatchlistItem;
