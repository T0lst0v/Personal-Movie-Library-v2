// const path = require("path"); //may needed to get full path combined with __dirname(path.join(__dirname,"../views"))
const expressFn = require("express");
const express = expressFn();
const session = require("express-session");
const pgp = require("pg-promise")(); //to use DB

const hbs = require("hbs"); //hbs - is handlebars(superset of mustache) for express
hbs.registerPartials("./views/partials"); //setting default location fpr partials

//link to elephantSQL
const urlMyDb = "postgres://zmufyotq:OVosX0Zglc4acF_x__zubx-naWcgldat@castor.db.elephantsql.com/zmufyotq";

//connecting DB
const db = pgp(urlMyDb);

express.use(expressFn.static("public")); //establish root directory for static files
express.use(expressFn.urlencoded({ extended: true })); //extended part is needed to avoid error: body-parser deprecated undefined extended:

express.use(expressFn.json()); //

express.set("view engine", "hbs"); // for inserts in to html from js {{variable}}
express.set("views", "./views"); //for inserts in to html for js  {{variable}}

// express.use(
//   session({
//     secret: "keyboard warrior",
//     resave: true,
//     saveUninitialized: true,
//     // cookie: { secret: true },
//   })
// );

//getting info from DB
express.get("/db", (req, res) => {
  db.one("Select user_id, first_name, last_name, is_employee from users Where user_id =1") //any will return array

    .then((user) => {
      res.send(user);
    });
});

//sending info to DB

//receiving data from client
express.post("/add", (req, res) => {
  const imdbID = req.body.imdbID;
  const title = req.body.title;
  const year = req.body.year;
  const type = req.body.type;
  const genre = req.body.Genre;
  const imdbRating = req.body.imdbRating;
  const director = req.body.director;
  const actors = req.body.actors;
  const plot = req.body.plot;

  db.none("INSERT INTO movies (imdb_id,m_title, m_year, m_type, m_genere, imdb_raiting) VALUES ($1,$2,$3,$4,$5,$6)", [imdbID, title, year, type, genre, imdbRating]);
  db.none("INSERT INTO directors (imdb_id, m_fname ) VALUES ($1,$2)", [imdbID, director]);
  db.none("INSERT INTO actors (imdb_id, m_fname ) VALUES ($1,$2)", [imdbID, actors]);

  const movie = {
    imdbID,
    title,
    type,
    genre,
    imdbRating,
    director,
    actors,
    plot,
  };
  js;

  res.send("index", { movie }); //pass though hbs to index display
});

express.get("/add", (req, res) => {
  res.render("add", {});
});

express.get("/", (req, res) => {
  let test = "test";
  res.render("index", { test });
});

express.get("/genre", (req, res) => {
  res.render("genre", {
    title: "Movie Name",
    type: "Movie/Show",
    genre: "Comedy",
    year: 2002,
    director: "Directors name",
  });
});

// creating new routs based on user link input (the structure of the link becomes a form of request)
// using this input(variables) to process this request(using it as API request or render site in a specific way)
express.get("/movies/:g/:y", (req, res) => {
  const g = req.params.g;
  const y = req.params.y;

  res.json({ genre: g, year: y });
});

express.listen(8000, () => console.log("Server is running.."));
