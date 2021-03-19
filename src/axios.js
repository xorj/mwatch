import axios from "axios";

const instance = axios.create({
  baseURL: "https://api.themoviedb.org/3/",
});

instance.tmdb = "dadc2476e124ebf8affb6132f4bded39";
instance.omdb = "e5dd2fca";

export default instance;
