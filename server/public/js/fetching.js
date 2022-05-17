//buttons"
const btnSearch = document.getElementById("btnSearch");
//fields
const txtTitle = document.getElementById("txtTitle");
const txtYear = document.getElementById("txtYear");
const omdbMovieList = document.getElementById("omdbMovieList");

//link to OMDB:
const apiKey = "d0fc9723";
const urlOmdb = `http://www.omdbapi.com/?apikey=${apiKey}`;

console.log("TEST");
console.log(txtTitle.value);

//
async function getMovieList(title, year, page) {
  let url = `${urlOmdb}&y=${year}&s=${title}`;
  try {
    console.log(url);
    const res = await fetch(url);
    console.log(res);

    const movies = await res.json();

    console.log("%%%%%%%%%%");
    console.log(movies);
    console.log(movies.totalResults);

    return { movieList: movies.Search, totalResults: movies.totalResults };
  } catch (error) {
    // enter your logic for when there is an error (ex. error toast)
    console.log(error);
  }
}

async function getMovieInfo(id) {
  let url = `${urlOmdb}&i=${id}`;
  const res = await fetch(url);
  const movie = await res.json();
  console.log("+++++");
  console.log(movie);
  return movie;
}

async function postCopyToMyDb({ imdbID, Title, Year, Type, Genre, imdbRating, Director, Actors, Plot }) {
  let url = "http://localhost:3000/add";
  console.log("---------------");
  console.log({ imdbID, Title, Type, Genre, imdbRating, Director, Actors, Plot });
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },

    body: JSON.stringify({
      imdbID: imdbID,
      title: Title,
      year: Year,
      type: Type,
      genre: Genre,
      imdbRating: imdbRating,
      director: Director,
      actors: Actors,
      plot: Plot,
    }),
  });

  const data = await res.text();

  console.log("+++++++++++");

  console.log(data);
}

function removeSpaces(txt) {
  let noSpaces = txt.trim();
  return noSpaces.split(" ").join("+");
}

function displayMovies(movieArr) {
  console.log("^^^^^^^^^^^");
  console.log(movieArr);
  omdbMovieList.innerHTML = movieArr[0].Title;
  let newCard = movieArr.map((e) => {
    return `
        <li class="${e.imdbID}">
        <img src="${e.Poster}" alt="" class="movieThumb">
        <p class="movieTitle">${e.Title}</p>
        <p class="movieYear">${e.Year}</p>
        <button class="btnCopy" onclick="copyToMyDb('${e.imdbID}')" >Copy</button>
    </li>
    `;
  });
  omdbMovieList.innerHTML = newCard.join("");
}

function copyToMyDb(id) {
  console.log(".......");

  (async () => {
    let movie = await getMovieInfo(id);
    console.log("!!!!!!!");
    //.Genre res is string => make it as array
    //.Actors res is string => make it as array
    //save picture to the server and reference to DB

    postCopyToMyDb(movie);
  })();
}

btnSearch.addEventListener("click", async () => {
  let title = txtTitle.value;
  let year = txtYear.value;
  title = removeSpaces(title);

  console.log(title + year);

  const movieObj = await getMovieList(title, year);
  console.log("///////");
  console.log(movieObj);
  console.log(movieObj.totalResults);

  displayMovies(movieObj.movieList);
});
