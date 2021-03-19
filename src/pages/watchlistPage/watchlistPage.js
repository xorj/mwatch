import React, { useState, useEffect } from "react";
import auth from "../../auth";
import instance from "../../axios";

//Components
import WatchlistItem from "../../components/watchlistItem/watchlistItem";
import Loading from "../../assets/UI/loading/loading";
//Styling
import "./watchlistPage.css";
const Watchlist = () => {
  const [idList, setIdList] = useState([]);
  const [moviesInfo, setMoviesInfo] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const getMovieList = () => {
    auth.get("/user/watchlist/").then((res) => {
      let list = res.data;
      setIdList(list);
    });
  };
  const getMoviesInfo = () => {
    idList.forEach((id) => getMovieInfo(id));
  };
  const getMovieInfo = async (id) => {
    let movie;
    await instance
      .get(`/movie/${id}?api_key=${instance.tmdb}`)
      .then((res) => {
        movie = {
          id: res.data.id,
          title: res.data.title,
          duration: `${parseInt(res.data.runtime / 60)} h ${
            res.data.runtime % 60
          } m`,
        };
      })
      .catch((error) => {
        console.log(error);
      });
    let movies = moviesInfo;
    movies.push(movie);
    setMoviesInfo([...movies]);
    setLoaded(true);
  };

  const deleteWatchlistItem = (id) => {
    auth
      .delete(`/user/watchlist/${id}`)
      .then((res) => {})
      .catch((error) => console.log(error));
    let movies = moviesInfo.filter((movie) => movie.id !== id);
    setMoviesInfo(movies);
  };

  useEffect(getMovieList, []);
  useEffect(getMoviesInfo, [idList]);

  let movies;
  if (moviesInfo) {
    movies = (
      <div className="watchlist">
        {moviesInfo.map((movie) => {
          return (
            <WatchlistItem
              key={movie.id}
              id={movie.id}
              title={movie.title}
              duration={movie.duration}
              delete={deleteWatchlistItem}
            />
          );
        })}
      </div>
    );
  }

  let content = "";
  if (loaded) {
    content = movies ? movies : <p>Sorry no movie avaliable.</p>;
  } else {
    content = <Loading />;
  }
  return <div className="watchlist-wrapper">{content}</div>;
};

export default Watchlist;
