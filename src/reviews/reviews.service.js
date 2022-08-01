const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

function hasOnlyValidProperties(req, res, next) {
  const { data = {} } = req.body;

  const invalidFields = Object.keys(data).filter(
    (field) => !VALID_PROPERTIES.includes(field)
  );

  if (invalidFields.length) {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  }
  next();
}

const addCritic = mapProperties({
  critic_id: "critic.critic_id",
  preferred_name: "critic.preferred_name",
  surname: "critic.surname",
  organization_name: "critic.organization_name",
  created_at: "critic.created_at",
  updated_at: "critic.updated_at",
});

const addCriticSnap = mapProperties({
  preferred_name: "critic.preferred_name",
  surname: "critic.surname",
  organization_name: "critic.organization_name",
});

function list() {
  return knex("reviews as r").select("*");
}

function list_movie(movieId) {
  return knex("reviews as r")
    .join("critics as c", "r.critic_id", "c.critic_id")
    .select("r.*","c.*")
    .where({ "r.movie_id": movieId })
    .then((reviews) => reviews.map((review) => addCritic(review)));
}

function read(reviewId) {
  return knex("reviews").select("*").where({ review_id: reviewId }).first();
}

function read_update(reviewId) {
  return knex("reviews as r")
    .join("critics as c", "r.critic_id", "c.critic_id")
    .select("r.*","c.*")
    .where({ "r.review_id": reviewId })
    .first()
    .then(addCriticSnap);
}

function create(review) {
  return knex("reviews")
    .insert(review)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}

function update(updatedReview) {
  return knex("reviews")
    .select("*")
    .where({ review_id: updatedReview.review_id })
    .update(updatedReview, "*");
}

function destroy(review_id) {
  return knex("reviews").where({ review_id }).del();
}

module.exports = {
  list,
  list_movie,
  read,
  read_update,
  create,
  update,
  destroy,
};