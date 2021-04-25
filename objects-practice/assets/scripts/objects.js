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
    //checks if info property exists in movie. alternative to movie.info === undefined
    // if(!("info" in movie)){
    //   console.log("info property doesn't exist");
    // }

    //destructuring 
    const {info} = movie;
    //destructuring and giving property a new name for convinience
    // const {title: movieTitle} = movie.info; //movie.info or info;
    const newMovie = document.createElement("li");

    //destructuring and binding a shorthand method to movie object
    let {getFormattedTitle} = movie;
    // getFormattedTitle = getFormattedTitle.bind(movie);

    let text = getFormattedTitle.call(movie) + " - ";

    //dynamic access to object keys via forin loop
    for (const key in info) {
      if (key !== "title" && key !== "_title") {
        text += ` ${key}: ${info[key]}`;
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
  let title = titleInput.value;
  let extraName = isValidString(extraNameInput.value);
  let extraValue = isValidString(extraValueInput.value);

  if (extraName && extraValue) {
    //when property name matches argument name or key name matches value name
    //title: title, can be changed to a single word title, it will get mapped and work
    //[extraName is a dynamically added key name]
    const newMovie = {
      info: {
        //creating getter and setter
        set title(val){
          if(val.trim()===''){
            this._title = "DEFAULT_TITLE";
            return;
          }
          this._title = val;
        },
        get title(){
          return this._title;
        },
        //dynamic property name setting 'extraName'
        [extraName]: extraValue,
      },
      id: (Math.random() * 150 * 15).toString(),
      //method shorthand
      getFormattedTitle(){
        return this.info.title.toUpperCase();
      }
    };
    //using setter to set title
    newMovie.info.title = title.toUpperCase();
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
  const userInput = searchByTitleValue.value.toUpperCase();
  updateMovieList(userInput);
};

addMovieBtn.addEventListener("click", addMovieHandler);
searchMovieBtn.addEventListener("click", searchForMovieHandler);