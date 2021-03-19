import React, { useState, useEffect } from "react";
import instance from "../../axios";

//Components
import Loading from "../../assets/UI/loading/loading";
import ResultCard from "../../components/resultCard/resultCard";

//Styling
import "./searchPage.css";

const SearchPage = (props) => {
  const [loaded, setLoaded] = useState(false);
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState("");

  //Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const getMovieSearch = () => {
    instance
      .get(
        `search/movie?api_key=${instance.tmdb}&language=en-US&query=${props.location.search}&page=1&include_adult=false`
      )
      .then((response) => {
        setResults(response.data.results);
        setLoaded(true);
        const searchQuery = props.location.search
          .replace("%20", " ")
          .substr(1, props.location.search.length - 1)
          .trim();

        if (response.data.results.length < 1) {
          setMessage(`No results for "${searchQuery}"`);
        } else {
          setMessage(
            `${props.location.search.length} results for "${searchQuery}"`
          );
        }
      })
      .catch((error) => {
        console.log({ error });
      });
  };

  useEffect(getMovieSearch, [props.location.search]);

  let content = <Loading />;
  if (loaded) {
    content = (
      <>
        <h2 className="results-title"> {message} </h2>
        {results.map((movie) => {
          return <ResultCard key={movie.id} id={movie.id} movie={movie} />;
        })}
      </>
    );
  }
  return <div className="wrapper">{content}</div>;
};

export default SearchPage;
