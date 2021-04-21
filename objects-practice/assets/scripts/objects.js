const addMovieBtn = document.getElementById("add-movie-btn");
const searchMovieBtn = document.getElementById("search-btn");
const searchByTitleValue = document.getElementById("filter-title");
const titleInput = document.getElementById("title");
const extraNameInput = document.getElementById("extra-name");
const extraValueInput = document.getElementById("extra-value");
const movieListElement = document.getElementById("movie-list");

const movieList = [];

// hacky resource heavy, lazy way of recreating the list on every change, just to practice objects
// filter a default value for the argument
const updateMovieList = (filter = "") => {
  if (movieList.length != 0) {
    movieListElement.classList.add("visible");
  } else {
    movieListElement.classList.remove("visible");
  }
  movieListElement.innerHTML = "";

  //returns a filtered array if filter is set otherwise returns initial movieList
  const filteredMovies = !filter
    ? movieList
    : movieList.filter(movie => movie.info.title.includes(filter));

  filteredMovies.forEach((movie) => {
    const newMovie = document.createElement("li");
    let text = movie.info.title + " - ";


    //dynamic access to object keys via forin loop
    for (const key in movie.info) {
      if (key !== "title") {
        text += ` ${key}: ${movie.info[key]}`;
      }
    }
    newMovie.textContent = text;
    movieListElement.appendChild(newMovie);
  });
};

const isValidString = (stringInput) => {
  let input = stringInput.trim();
  if (input.length > 0) {
    return input;
  }
  return false;
};

const clearInputs = () => {
  titleInput.value = "";
  extraNameInput.value = "";
  extraValueInput.value = "";
};

const addMovieHandler = () => {
  let title = isValidString(titleInput.value);
  let extraName = isValidString(extraNameInput.value);
  let extraValue = isValidString(extraValueInput.value);

  if (title && extraName && extraValue) {
    //when property name matches argument name or key name matches value name
    //title: title, can be changed to a single word title, it will get mapped and work
    //[extraName is a dynamically added key name]
    const newMovie = {
      info: {
        title,
        [extraName]: extraValue,
      },
      id: Math.random() * 150 * 15,
    };
    movieList.push(newMovie);
    clearInputs();
    console.log(movieList);
    updateMovieList();
  } else {
    alert("Please enter valid values.");
    return;
  }
};

const searchForMovieHandler = () => {
  const userInput = searchByTitleValue.value;
  updateMovieList(userInput);
};

addMovieBtn.addEventListener("click", addMovieHandler);
searchMovieBtn.addEventListener("click", searchForMovieHandler);