const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const DB = require("../utils/db");

//*desc show all Movies
//*route /db/movie/all
//*access Protected
const movieAll = asyncHandler(async (req, res) => {
  console.log(req.user.user_id);
  const allMoviesOfUser = await DB.any("SELECT * FROM movies JOIN users_movies ON (movies.imdb_id=users_movies.imdb_id) WHERE users_movies.user_id=$1", [req.user.user_id]);
  res.json({ allMoviesOfUser });
});

//*desc show Movie info
//*route /db/movie/info:id
//*access Protected
const movieInfo = asyncHandler(async (req, res) => {
  res.send("Movie INFO");
});

//*desc edit Movie
//*route /db/movie/edit:id
//*access Protected
const movieEdit = asyncHandler(async (req, res) => {
  res.send("EDIT Movie");
});

//*desc delete Movie
//*route /db/movie/delete:id
//*access Protected
const movieDelete = asyncHandler(async (req, res) => {
  res.send("DELETE Movie");
});

module.exports = {
  movieAll,
  movieInfo,
  movieEdit,
  movieDelete,
};
