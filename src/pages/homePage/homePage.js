import React, { useEffect } from "react";
import HeroContainer from "../../components/heroContainer/heroContainer";
import MovieList from "../../components/movieList/movieList";

const HomePage = (props) => {
  //Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <HeroContainer />
      {/* Latest Releases */}
      <MovieList title="Popular" type="popular" />
      {/* Movies List */}
      <MovieList title="Top Rated" type="top_rated" />
    </>
  );
};

export default HomePage;
