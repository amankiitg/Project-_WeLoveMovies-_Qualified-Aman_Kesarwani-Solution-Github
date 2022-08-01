const knex = require("../db/connection");

function list() {
  return knex("movies").select("*");
}

function list_showing() {
  return knex("movies as m")
    .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
    .select("m.*","mt.is_showing")
    .where({ "mt.is_showing": true })
    .distinct()
}

function read(movieId) {
  return knex("movies").select("*").where({ movie_id: movieId }).first();
}

module.exports = {
  list,
  list_showing,
  read,
};