const theatersService = require("./theaters.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res) {
  const { movieId } = req.params;
  if(movieId){
    const data = await theatersService.list_movie(movieId);
    res.json({ data });
  } else{
    const data = await theatersService.list();
    res.json({ data });
  }
}

module.exports = {
  list: asyncErrorBoundary(list),
};