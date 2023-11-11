import { getMovies, getMovieById, getMovieByTitleOMDB, deleteMovie,postMovie,searchMovieByTitleLocal,patchMovie,searchMoviesTMDB,latestMoviesList,showLoader,hideLoader,getMoviesNoLoader} from "./utils/movies.js"

// Function creates and adds movie card to DOM
export const renderModal = (movie) => {

    const modal = document.createElement('div');
    modal.classList.add('custom-modal');

    modal.innerHTML = `
        <div class="custom-modal-bg"></div>
        <div class="custom-modal-content">
            <span class="close" id="closeModal-two" data-bs-dismiss="modal">&times;</span>
            <h2>Edit ${movie.title}</h2>
            <form id="edit-movie-form">
                <label for="description-edit-form">Description:</label>
                <textarea type="text" id="description-edit-form">${movie.overview}</textarea>
                <button id="edit-form-submit-btn" type="submit">Update</button>
            </form>
        </div>
    `;
    const submitBtn = modal.querySelector('#edit-form-submit-btn');
    const closeBtn = modal.querySelector('.close');
    const modalBG = modal.querySelector('.custom-modal-bg');

    //event listener to edit movie form
    submitBtn.addEventListener('click', async (e)=>{
        e.preventDefault();
        const newDescription = modal.querySelector("#description-edit-form");
        const newDescValue = newDescription.value;
        const movieObj = {
            id: movie.id,
            overview: newDescValue
        }
        

        await patchMovie(movieObj).then(function () {

            getMoviesNoLoader().then((movies) =>{
    
                const target = document.querySelector(".movies-grid");
                console.log(target);
                console.log(movies);
                target.innerHTML = "";
                for (let movie of movies) {
                    console.log(movie);
    
                    renderMovie(movie, target);
    
                };
                modal.remove();
                console.log(movies);
            });
        });

        
    });

    closeBtn.addEventListener('click', ()=>{
       modal.remove();
    });
    modalBG.addEventListener('click', ()=>{
        modal.remove();
    });
    document.body.appendChild(modal);
}

const IMG_PATH = "https://image.tmdb.org/t/p/w500";
export const renderMovie = (movie, target) => {
    const movieCard = document.createElement("article");
    let moviePoster = (movie.poster_path === undefined) ? 'https://via.placeholder.com/400x600' : IMG_PATH + movie.poster_path;
    movieCard.classList.add("movie-card");
    // console.log(movie);
    movieCard.innerHTML = `
            <div class="title-year">
            <div class=" align-items center">
            <img src="${moviePoster}"  class="poster-img" alt="poster-img">
             <p class="movie-card-year">${movie.release_date.slice(0,4)}</p>
            ${movie.overview && `<p class="movie-card-description">${movie.overview}.</p>`}
            </div>
            </div>
            </div>
            <div class="rating d-flex align-items-center justify-content-between">
                <span class="movie-card-span">Rating</span>
                <span class="movie-card-rating">${movie.vote_average?.toFixed()}/10</span>
            </div>
            <meter class="movie-card-meter" min="0" max="10" value="${movie.vote_average}"></meter>
            <input type="hidden" value="${movie.id}">
            <div class="edit-delete-group">
            <button  class="edit-movie-btn" data-bs-toggle="modal" data-bs-target="#editModal${movie.id}"><span>Edit Movie</span></button>
            <button  class="delete-movie-btn"><span>Delete Movie</span></button></div>
            
        `;

    const editBtn = movieCard.querySelector('.edit-movie-btn');
    editBtn.addEventListener('click', ()=>{
        renderModal(movie);
    });
    const deleteBtn = movieCard.querySelector('.delete-movie-btn');
    deleteBtn.addEventListener('click', async ()=>{
        try {
            await deleteMovie(movie.id);
            movieCard.remove();
        } catch (e){
            console.log(e);
        }
    });

    target.appendChild(movieCard);
};

// Function accessing category based on data
export const renderCategories = (categories = []) => {
    // create a single HTML string made up of all the categories
    const categoriesHTML = categories?.map((category) => `<span class="movie-card-tag">${category}</span>`).join("");
    return categoriesHTML;
};

// Function to display movie posters on carousel
export const renderPoster = (movie, target) => {
    const posterCard = document.createElement("div");
    posterCard.classList.add("carousel-item");

    posterCard.innerHTML = `

           <img src="https://image.tmdb.org/t/p/w500${movie.backdrop_path}" class="poster-img-carousel" alt="poster-img">
            
        `;
    target.appendChild(posterCard);
};

