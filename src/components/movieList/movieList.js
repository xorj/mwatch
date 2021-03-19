import React, { useEffect, useState } from "react";
import { FiArrowLeft as Left, FiArrowRight as Right } from "react-icons/fi";
import instance from "../../axios";

//Components
import MovieCard from "../movieCard/movieCard";

//Styling
import "./movieList.css";

const MovieList = (props) => {
  const ref = React.createRef();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState();

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

  const [movieList, setMovieList] = useState([]);

  const loadMovieList = () => {
    instance
      .get(
        `movie/${props.type}?api_key=${instance.tmdb}&language=en-US&page=${currentPage}`
      )
      .then((response) => {
        setMovieList(response.data.results);
        setTotalPages(response.data.total_page);
      });
  };

  useEffect(loadMovieList, [currentPage]);

  return (
    <section className="wrapper-movielist" ref={ref}>
      <h3 className="title">{props.title}</h3>
      <div className="movie-list">
        {movieList.map((movie) => {
          return (
            <MovieCard
              key={movie.id}
              id={movie.id}
              path={"https://image.tmdb.org/t/p/w780/" + movie.poster_path}
              title={movie.title}
              rating={movie.vote_average}
            />
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
    </section>
  );
};

export default MovieList;
