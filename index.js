let movieArr = []
let searchName = ""
let SelectedMovieArray
let selectedMovie
const movieInfo = document.getElementById("movie-info")

//EVENT LISTENERS FOR SEARCH BUTTON TO GET INPUT VALUE AND RUN THE FUNCTION TO FETCH API, AND FOR WATCHLIST BUTTON TO RUN THE FUNCTION TO SAVE TO LOCAL STORAGE
document.addEventListener('click', function(e){
    if(e.target.id === "search-button"){
        searchName =  document.getElementById("search-bar").value
        fetchApi()
    } else if(e.target.dataset.watch){
        saveToLocal(e.target.dataset.watch)
    }
})

//FUNCTION FIRSTS FETCHES THE IMDB NUMBER FOR THE MOVIE NAME SEARCHED FOR THEN USES THAT NUMBER TO FETCH ALL INFO ON THE SELECTED NAME
//THEN SAVES MOVIE INFO REQUIRED IN AN OBJECT WITH AN ID NUMBER INCLUDED TO HELP WITH BUTTON CLICKS IN AN ARRAY
//LOOPS THROUGH THE ARRAY OF NEW OBJECTS CREATED TO RENDER HTML TO SCREEN OF ALL MOVIES FOUND
//IF NO MOVES MATCH SHOWS ERROR MESSSAGE
function fetchApi(){
    fetch(`https://www.omdbapi.com/?s=${searchName}&&apikey=88275857`)
    .then(res => res.json())
    .then(data => {
        const movieSearch = data.Search
        let html = '' 
        let movieDetails = {}
        for (movie of movieSearch){
            if(movie.Poster !== "N/A"){
                fetch(`https://www.omdbapi.com/?i=${movie.imdbID}&&apikey=88275857`)
                    .then(res => res.json())
                    .then(movies => {
                        movieDetails = {
                            poster: movies.Poster,
                            title: movies.Title,
                            runtime: movies.Runtime,
                            genre: movies.Genre,
                            plot: movies.Plot,
                            rated: (movies.Ratings[0].Value).substring(0, 3),
                            id: Math.floor(Math.random()*1000000)
                        }
                        
                        movieArr.push(movieDetails)
                        
                        html += `
                            <div class="movie-container">
                                <img src=${movieDetails.poster} alt="movie-poster" class="movie-img"/>
                                <div class="movie-info-box">
                                    <div class="movie-title-box">
                                        <h3 class="movie-name">${movieDetails.title}</h3>
                                        <img src="./star-icon.png" alt="star-icon" class="star-icon"/>
                                        <h5 class="movie-rated">${movieDetails.rated}</h5>
                                    </div>
                                        <div class="movie-info-inner">
                                            <h5 class="movie-min">${movieDetails.runtime}</h5>
                                            <h5 class="movie-type">${movieDetails.genre}</h5> 
                                            <div class="watchlist-box">
                                                <button id="watchlist-btn" class="watchlist-btn" data-watch=${movieDetails.id}>+</button>
                                                <h5>Watchlist</h5>
                                            </div>   
                                        </div>
                                    <p class="plot">${movieDetails.plot}</p>
                                </div>
                            </div>
                        `      
                        movieInfo.innerHTML = html
                    })
                }
            }
        })
        .catch(error => {
            let errorMsg = ''
            errorMsg += `
                <div class="start-page">
                    <h4 class="error-text">Unable to find what you’re looking for. Please try another search.</h4>
                </div>
            `      
                    movieInfo.innerHTML = errorMsg
    })
}

//WHEN + BUTTON CLICKED, SETS ISDUPLICATE TO FALSE & GETS ARRAY SAVED TO LOCAL STORAGE, IF NOTHING SAVED CREATES EMPTY ARRAY, 
//LOOPS THROUGH MOVIES DIPLAYED TILL ID MATCHES CLICK ID AND SAVES FIMLM OBJECT TO VARIABLE
//CHECKS IF THIS FILM ALREADY SAVED TO LOCAL STORAGE, IF IT IS THEN CHANGES ISDUPLICATE TO TRUE AND SHOWS ALERT
//IF ISDUPLICATE SET TO FALSE WILL ADD THE MOVIES TO ARRAY AND UPDATE LOCAL STORAGE

function saveToLocal(e){
    let isDuplicate = false
    SelectedMovieArray = JSON.parse(localStorage.getItem('movieInfo'))
    if (SelectedMovieArray === null){         
        SelectedMovieArray = []
    }
                
    for (film of movieArr){
        if (e == film.id){
            selectedMovie = film
        } 
    }    

    if(SelectedMovieArray.length >= 1) {
        for(movie of SelectedMovieArray){
                if(movie.title === selectedMovie.title){
                    isDuplicate = true   
                    alert('You already have this movie saved to your watchlist')              
            } 
        }
    } 
         
    if(isDuplicate === false) {
        SelectedMovieArray.push(selectedMovie)
    }
           
    localStorage.setItem('movieInfo', JSON.stringify(SelectedMovieArray))
}  
