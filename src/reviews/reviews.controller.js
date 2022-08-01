const reviewsService = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");
const hasRequiredProperties = hasProperties("content","score",);

const VALID_PROPERTIES = [
  "content",
  "score",
  "critic_id",
  "movie_id",
];

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

async function list(req, res) {
  const { movieId } = req.params;
  if(movieId){
    const data = await reviewsService.list_movie(movieId);
    res.json({ data });
  } else{
    const data = await reviewsService.list();
    res.json({ data });
  }
}

function reviewExists(req, res, next) {
  reviewsService
    .read(req.params.reviewId)
    .then((review) => {
      if (review) {
        res.locals.review = review;
        return next();
      }
      next({ status: 404, message: `Review cannot be found.` });
    })
    .catch(next);
}

function read(req, res) {
  const { product: data } = res.locals;
  res.json({ data });
}

function create(req, res, next) {
  reviewsService
    .create(req.body.data)
    .then((data) => res.status(201).json({ data }))
    .catch(next);
}

async function update(req, res, next) {
  const updatedReview = {
    ...req.body.data,
    review_id: res.locals.review.review_id,
  };
  const output = await reviewsService.update(updatedReview);
  const data = await reviewsService.read_update(res.locals.review.review_id);
  res.json({ data });
}

function destroy(req, res, next) {
  reviewsService
    .destroy(res.locals.review.review_id)
    .then(() => res.sendStatus(204))
    .catch(next);
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(read)],
  create: [hasOnlyValidProperties, hasRequiredProperties, asyncErrorBoundary(create)],
  update: [asyncErrorBoundary(reviewExists), hasOnlyValidProperties, asyncErrorBoundary(update)],
  delete: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)],
};