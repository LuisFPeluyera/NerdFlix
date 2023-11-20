import { getMovies, getMovieById, getMovieByTitleOMDB, deleteMovie,postMovie,searchMovieByTitleLocal,patchMovie,searchMoviesTMDB,latestMoviesList,showLoader,hideLoader,getMoviesNoLoader} from "./utils/movies.js"
import {renderModal, renderMovie, renderCategories, renderPoster} from "./renderFunctions.js";

// variable for preloader
const loader = document.getElementById("preloader");
// THIS IS FOR ADD A MOVIE BUTTON FORM
// Get the modal and button elements
const addMovieModal = document.getElementById("addMovieModal");
//button to open the add movie form
const addMovieButton = document.getElementById("addMovieButton");
//button to close modal form
const closeModal = document.getElementById("closeModal");

//button to search movies from API
const searchMovieBtn = document.getElementById("search-movie-btn");
//search iput
const searchInput = document.getElementById("search-movie-input");
//captures value of search input
// let searchInputValue = document.getElementById("search-movie-input").value;
// below 4 variables capture values from add movie form
const addMovieForm = document.getElementById("movie-form");
let addMovieFormTitle = document.getElementById("title").value;
let addMovieFormrating = document.getElementById("rating").value;
//button to submit the add movie form
const addMovieBtn = document.getElementById("add-movie-btn");
//variable to capture value of add movie form
let newMovieObj;

//event to Show the modal when the button is clicked
addMovieButton.addEventListener("click", () => {
    addMovieModal.style.display = "block";
});

// Close the modal when the close button is clicked
//event to close the add movie form
closeModal.addEventListener("click", () => {
    addMovieModal.style.display = "none";
});

// Close the modal when clicking outside the modal
window.addEventListener("click", (event) => {
    if (event.target === addMovieModal) {
        addMovieModal.style.display = "none";
    }
});
//////////////////////////////// ADD MOVIE

// event to add movie to favorites when btn clicked
addMovieBtn.addEventListener("click", (e)=>{
    e.preventDefault();

    const modal = document.getElementById("addMovieModal");
    newMovieObj = {
        title: addMovieForm[0].value,
        release_date: addMovieForm[1].value,
        overview: addMovieForm[2].value,
        vote_average: Number(addMovieForm[3].value)
    };
    console.log(newMovieObj);
    
    postMovie(newMovieObj).then(function (){

        getMoviesNoLoader().then((movies) =>{
    
            const target = document.querySelector(".movies-grid");
            console.log(target);
            console.log(movies);
            target.innerHTML = "";
            for (let movie of movies) {
                console.log(movie);
    
                renderMovie(movie, target);

            }
            modal.remove();
        });
    });
    
});

//////////////////////////DELETE MOVIE
// function to delete movie
let deleteMovieBtn = document.getElementsByClassName("delete-movie-btn");

for (let i = 0; i < deleteMovieBtn.length; i++) {

    deleteMovieBtn[i].addEventListener("click", async (e)=>{

        console.log(e.target);
        deleteMovie(e.target.previousElementSibling.value);
        console.log(e.target.previousElementSibling.value);


    });

};

////////////////////////SEARCH FUNCTIONALITY

const searchList = document.getElementById("search-list")
function findMovie () {
    let searchTerm = document.getElementById("search-movie-input").value.trim();

    if (searchTerm.length > 0){
        searchList.classList.remove("hide-search-list");
        getMovieByTitleOMDB(searchTerm).then(movies => {
            console.log(movies.Search);
            movies.Search.map((movie) =>{
                searchList.appendChild(movie.Poster)
            })
        });

        
    } else {
        searchList.classList.add("hide-search-list")
    }
}

searchInput.addEventListener("keyup",findMovie);

//////////////////////////////////////////////////
//////// MAIN METHOD
(async () => {


    /////////////////////ON LOAD///////////////////
    //// displays card on load
    const movies = await getMovies();
    console.log(movies);
    for (let movie of movies) {
        const target = document.querySelector(".movies-grid");
        renderMovie(movie, target);
    };


    ///// displays latest movies carousel
    const posters = await latestMoviesList();
    for (let poster of posters.results) {
        const target = document.querySelector("#carousel");
        renderPoster(poster, target);
    };



    
})();
// poster https://image.tmdb.org/t/p/w500 + poster path



/////////////////ADD MOVIES MANUALY
// let newMovie= await searchMoviesTMDB("space jam");
// console.log(newMovie.results[0]);
//
// postMovie(newMovie.results[0]);