const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");
const reduceProperties = require("../utils/reduce-properties");

const reduceMovies = reduceProperties("name", {
  movie_id: ["movies", null, "movie_id"],
  runtime_in_minutes: ["movies", null, "runtime_in_minutes"],
  title: ["movies", null, "title"],
  rating: ["movies", null, "rating"],
  is_showing: ["movies", null, "is_showing"],
  image_url: ["movies", null, "image_url"],
});

function list() {
   return knex("theaters as t")
    .join("movies_theaters as mt", "t.theater_id", "mt.theater_id")
    .join("movies as m", "mt.movie_id", "m.movie_id")
.select("t.theater_id","t.name","t.address_line_1","t.address_line_2","t.city","t.state","t.zip","mt.is_showing","m.image_url","m.movie_id","m.title","m.runtime_in_minutes","m.rating")
  .then((theaters) => {
     const theaterValues = theaters.map( (value) => value.name).filter( (value, index, _arr) => _arr.indexOf(value) == index);
     return theaterValues.map((tid) => reduceMovies(theaters.filter((theater) => theater.name == tid))).flat();
   })         
}

function list_movie(movieId) {
  return knex("movies_theaters as mt")
    .join("theaters as t", "mt.theater_id", "t.theater_id")
    .select("t.*","mt.*")
    .where({ "mt.movie_id": movieId })
    .distinct();
}

module.exports = {
  list,
  list_movie,
};