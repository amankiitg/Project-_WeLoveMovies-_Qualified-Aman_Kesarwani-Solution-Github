const moviesService = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res) {
    const is_showing = req.query.is_showing;
    if(is_showing == 'true'){
      const data = await moviesService.list_showing();
      res.json({ data });
    } else{
      const data = await moviesService.list();
      res.json({ data });
    }
}

function movieExists(req, res, next) {
  moviesService
    .read(req.params.movieId)
    .then((movie) => {
      if (movie) {
        res.locals.product = movie;
        return next();
      }
      next({ status: 404, message: `Movie cannot be found.` });
    })
    .catch(next);
}

function read(req, res) {
  const { product: data } = res.locals;
  res.json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(movieExists), asyncErrorBoundary(read)],
  movieExists : asyncErrorBoundary(movieExists),
};