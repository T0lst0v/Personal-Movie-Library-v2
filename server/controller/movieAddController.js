const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const DB = require("../utils/db");

//*desc add new MOvie
//*route /db/movie/add
//*access Protected
const movieAdd = asyncHandler(async (req, res) => {
  try {
    const movie = ({ imdbID, title, year, imdbRating, director, plot, genres, actors, img_url } = req.body);
    //  genres and actors are string of genres need to be parsed to array

    if (!imdbID || !title || !year || !imdbRating || !director || !plot || !genres || !actors) {
      res.json({ message: "All fields need to be field in" });
      return;
    }
    console.log(req.user);

    //checking if movie is not in a table already
    const userHasMovie = await DB.any("SELECT * FROM users_movies WHERE user_id=$1 and imdb_id=$2", [req.user.user_id, imdbID]);

    if (userHasMovie.length === 0) {
      console.log("not in a library");

      const movieInDB = await DB.any("SELECT imdb_id FROM movies WHERE imdb_id=($1)", [imdbID]);

      if (movieInDB.length === 0) {
        //add Director to the director table if wasn't there before
        const directorInDB = await DB.any("SELECT d_name FROM directors Where d_name=($1)", [director]);
        if (directorInDB.length === 0) {
          await DB.none(`INSERT INTO directors(d_name) VAlUES($1)`, [director]);
        }

        //  add to movie to movies Table
        await DB.none("INSERT INTO movies(imdb_id, m_title, m_year, imdb_rating, director, plot, img_url, genres, actors) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)", [
          imdbID,
          title,
          year,
          imdbRating,
          director,
          plot,
          img_url,
          genres,
          actors,
        ]);
        message = `movie added`;

        await DB.none("INSERT INTO users_movies (user_id, imdb_id) VALUES ($1, $2)", [req.user.user_id, imdbID]);

        // if actors not exist already in a table then  add actors to actors Table  and joint table movies_actors
        const actorsArr = actors.split(", ");
        const actorsInDB = await DB.any("SELECT a_name FROM actors");

        //checking each actor if they not in Db yet
        actorsArr.forEach(async (actor) => {
          const actorInDB = actorsInDB.some((actorInDB) => actorInDB.a_name === actor);

          if (!actorInDB) {
            await DB.none(`INSERT INTO actors(a_name) VAlUES($1)`, [actor]);
          }

          //adding Movie ID and Actor to movies_actors join table
          await DB.none("INSERT INTO movies_actors(imdb_id, actor) VALUES($1, $2)", [imdbID, actor]);
        });

        // if genre not exist already in a table then  add genre to genres Table and joint table movies_genre
        const genresArr = genres.split(", ");
        const existingGenres = await DB.any("SELECT genre FROM genres");

        //checking each genre if they not in Db yet
        genresArr.forEach(async (genre) => {
          const genreInDB = existingGenres.some((existingGenre) => existingGenre.genre === genre);
          if (!genreInDB) {
            await DB.none(`INSERT INTO genres(genre) VAlUES($1)`, [genre]);
          }

          //adding Movie ID and Genre to genre join table
          await DB.none("INSERT INTO movies_genres(imdb_id, genre) VALUES($1, $2)", [imdbID, genre]);
        });
        res.json({ message: `movie Added to DB and to user_movie` });
        // await DB.none("INSERT INTO users_movies (user_id, imdb_id) VALUES ($1, $2)", [req.user.user_id, imdbID]);
      } else {
        res.json({ message: `movie DB already has this movie` });
      }
    } else {
      console.log("adding to the library");
      res.json({ message: "User Already has this movie", movie });
    }
  } catch (error) {
    res.json({ error });
  }
});

module.exports = { movieAdd };
