const addModal = document.getElementById("add-modal");
const addMovieBtn = document
  .getElementsByTagName("header")[0]
  .getElementsByTagName("button")[0];
const addModalCancelBtn = addModal.getElementsByClassName("btn--passive")[0];
const addModalAddBtn = addModalCancelBtn.nextElementSibling;
const backDrop = document.getElementById("backdrop");
const movieDbSection = document.getElementById("entry-text");
const movieListUl = document.getElementById("movie-list");
const deleteModal = document.getElementById("delete-modal");


const modalInput = document.getElementById("title");
const modalImageUrl = document.getElementById("image-url");
const modalRating = document.getElementById("rating");
const modalInputs = addModal.getElementsByTagName("input");

const movies = [];

// console.dir(modalInput);

//if movie list is empty show empty movie db box
const updateUI = () => {
  if (movies.length === 0) {
    movieDbSection.style.display = "block";
  } else if (movies.length > 0) {
    movieDbSection.style.display = "none";
  }
};

const deleteModalHandler = (movieId) => {
    deleteModal.classList.add("visible");
    useBackdrop();
    let confirmDelete = deleteModal.querySelectorAll("button")[1];
    const cancelDelete = deleteModal.querySelector(".btn--passive");


    //some hacky mindfuckery
    //replacing with a copy. recreating old deletion button to remove all old event listeners
    confirmDelete.replaceWith(confirmDelete.cloneNode(true));
    //accessing the new cloned deletion button that has no event listeners
    confirmDelete = deleteModal.querySelectorAll("button")[1];
    confirmDelete.addEventListener("click", deleteMovie.bind(null, movieId));

    //need to remove added event listeners before adding the same ones to reuse modal on all items
    cancelDelete.removeEventListener("click", removeBackDropHandler);
    cancelDelete.addEventListener("click", removeBackDropHandler);
}

const deleteMovie = (movieId) => {
  let movieIndex = 0;
  for (const movie of movies) {
    if (movie.id === movieId) {
      //stopping nearest loop when id is found
      break;
    }
    movieIndex++;
  }
  //removes elements from an array at set index (movieIndex)
  movies.splice(movieIndex, 1);
  //old approach working on every browser
  movieListUl.removeChild(movieListUl.children[movieIndex]);
  //newer approach
  // movieListUl.children[movieIndex].remove();
  updateUI();
  removeBackDropHandler();
};

const addAMovie = (id, title, imageUrl, rating) => {
  const newMovieElement = document.createElement("li");
  newMovieElement.className = "movie-element";
  newMovieElement.insertAdjacentHTML(
    "afterbegin",
    `<div class="movie-element__image">
        <img src="${imageUrl}" alt="${title}">
    </div>
    <div>
        <h2>${title}</h2>
        <p>${rating}/5 stars</p>
    </div>`
  );
  //passing in movieId to deleteMovieHandler
  newMovieElement.addEventListener("click", deleteModalHandler.bind(null, id));
  movieListUl.appendChild(newMovieElement);
};

const clearModalInputs = () => {
  for (const input of modalInputs) {
    input.value = "";
  }
};

const closeMovieModal = () => {
    addModal.classList.remove("visible");
    clearModalInputs();
    useBackdrop();
}

const showMovieModalHandler = () => {
  addModal.classList.add("visible");
  useBackdrop();
};

//dimming effect for modal appearence
const useBackdrop = () => {
  backDrop.classList.toggle("visible");
};

const removeBackDropHandler = () => {
  addModal.classList.remove("visible");
  deleteModal.classList.remove("visible");
  backDrop.classList.toggle("visible");
  clearModalInputs();
};

const checkIfInputValid = (input) => {
  //trim() removes white space before and after the string
  const inputTrimmed = input.trim();
  if (inputTrimmed) {
    if (inputTrimmed.length > 0 && inputTrimmed.length <= 255) {
      return inputTrimmed;
    }
  }
  return false;
};

const addMovieHandler = () => {
  const titleInput = checkIfInputValid(modalInput.value);
  const imgUrlInput = checkIfInputValid(modalImageUrl.value);
  const ratingInput = modalRating.value;
  if (titleInput && imgUrlInput && ratingInput >= 1 && ratingInput < 6) {
    let newMovieEntry = {
      id: Math.random() * Math.random().toString(),
      title: titleInput,
      imageUrl: imgUrlInput,
      rating: ratingInput,
    };
    movies.push(newMovieEntry);
    closeMovieModal();
    clearModalInputs();
    updateUI();
    addAMovie(
      newMovieEntry.id,
      newMovieEntry.title,
      newMovieEntry.imageUrl,
      newMovieEntry.rating
    );
  } else {
    alert("Please enter valid values.");
  }
};

addMovieBtn.addEventListener("click", showMovieModalHandler);
addModalCancelBtn.addEventListener("click", closeMovieModal);
backDrop.addEventListener("click", removeBackDropHandler);
addModalAddBtn.addEventListener("click", addMovieHandler);
