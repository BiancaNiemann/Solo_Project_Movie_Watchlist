let movieArr = []
let searchName = ''
let selectedMovieArray
let selectedMovie
let movieDataArray

let alpha = false
let rate = false

const movieInfo = document.getElementById("movies-container")
const searchBar = document.getElementById("search-bar")

//EVENT LISTENERS FOR SEARCH BUTTON TO GET INPUT VALUE AND RUN THE FUNCTION TO FETCH API, AND FOR WATCHLIST BUTTON TO RUN THE FUNCTION TO SAVE TO LOCAL STORAGE
document.addEventListener('click', function(e){
    if(e.target.id === "search-button"){
        searchName = searchBar.value
        fetchApi()
    } else if(e.target.dataset.watch){
        saveToLocal(e.target.dataset.watch)
    } else if(e.target.id === "drop-btn"){
        document.getElementById("my-dropdown").classList.toggle("show")
    } else if(e.target.id === "alpha"){
        alpha = true
        sortAlpha()
    } else if(e.target.id === "rate"){
        rate = true
        sortRate()
    }
})

//WILL SIMULATE A CLICK ON THE SEARCH BUTTON WHEN ENTER IS PRESSED
searchBar.addEventListener('keypress', (event)=>{
    if(event.key === "Enter"){
        document.getElementById("search-button").click()
    }
})

//WILL SORT MOVIE ARRAY IN ALPHABETICAL ORDER IF SELECTED
function sortAlpha(){
    movieArr.sort(function (a, b) {
        if (a.title < b.title) {
            return -1
        }
        if (a.title > b.title) {
            return 1
        }
        return 0
        })
    renderHtml()
}

//WILL SORT MOVIE ARRAY IN RATINGS ORDER IF SELECTED
function sortRate(){
    movieArr.sort((a,b) => b.rated - a.rated)
    renderHtml()
}

//FUNCTION FIRSTS FETCHES THE IMDB NUMBER FOR THE MOVIE NAME SEARCHED FOR THEN USES THAT NUMBER TO FETCH ALL INFO ON THE SELECTED MOVIE NAME & RUNS FUNCTION TO SAVE EACH MOVIE TO NEW OBJECT


//IF NO MOVES MATCH SHOWS ERROR MESSSAGE
function fetchApi(){
    fetch(`https://www.omdbapi.com/?s=${searchName}&&apikey=88275857`)
    .then(res => res.json())
    .then(data => {
        movieDataArray = data.Search

        fetchMovieData()
    })
    .catch(error => {
            let errorMsg = ''
            errorMsg += `
                <div class="start-page">
                    <h4 class="error-text">Unable to find what you???re looking for. Please try another search.</h4>
                </div>
            `      
            movieInfo.innerHTML = errorMsg
    })
}

//USES IMDB ID TO FIRST FETCH TO FETCH ALL MOVIE INFO NEEDED AND SAVES EACH ONE TO A NEW OBJECT
//CHECKS IF MOVIE ARRAY NEEDS TO BE SORTED
//RUNS THE RENDER HTML FUNCTION
function fetchMovieData(){
    let movieDetails = {}
        movieDataArray.forEach(movies => {
            if (movies.Poster !== "N/A"){
                fetch(`https://www.omdbapi.com/?i=${movies.imdbID}&&apikey=88275857`)
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
                        sortAlpha()
                        sortRate()
                        renderHtml()
                })
            }
        })
    movieArr=[]
}

//LOOPS THROUGH MOVIE ARRAY AND RENDERS THE HTML TO SCREEN
function renderHtml(){
    let html = ''
    movieArr.forEach(movie => {
    html += `
        <div class="movie-card">
            <img src=${movie.poster} alt="movie-poster" class="movie-img"/>
            <div class="movie-info-box">
                <div class="movie-title-box">
                    <h3 class="movie-name">${movie.title}</h3>
                    <img src="./star-icon.png" alt="star-icon" class="star-icon"/>
                    <h5 class="movie-rated">${movie.rated}</h5>
                </div>
                <div class="movie-info-inner">
                    <h5 class="movie-min">${movie.runtime}</h5>
                    <h5 class="movie-type">${movie.genre}</h5> 
                    <button id="watchlist-btn" class="watchlist-btn" data-watch=${movie.id}>+ Watchlist</button>
                </div>
                <p class="plot">${movie.plot}</p>
            </div>
        </div>
        `      
    })
    movieInfo.innerHTML = html
}

//WHEN + BUTTON CLICKED, SETS ISDUPLICATE TO FALSE & GETS ARRAY SAVED TO LOCAL STORAGE, IF NOTHING SAVED CREATES EMPTY ARRAY, 
//LOOPS THROUGH MOVIES DIPLAYED TILL ID MATCHES CLICK ID AND SAVES FILM OBJECT TO VARIABLE
//CHECKS IF THIS FILM ALREADY SAVED TO LOCAL STORAGE, IF IT IS THEN CHANGES ISDUPLICATE TO TRUE AND SHOWS ALERT
//IF ISDUPLICATE SET TO FALSE WILL ADD THE MOVIES TO ARRAY AND UPDATE LOCAL STORAGE

function saveToLocal(e){

    let isDuplicate = false
    selectedMovieArray = JSON.parse(localStorage.getItem('movieInfo'))
    if (selectedMovieArray === null){         
        selectedMovieArray = []
    }
         
    movieArr.forEach(film =>{
        if (e == film.id){
            selectedMovie = film
        } 
    })    

    if(selectedMovieArray.length >= 1) {
        selectedMovieArray.forEach(movie => {
                if(movie.title === selectedMovie.title){
                    isDuplicate = true   
                    alert('You already have this movie saved to your watchlist')
                } 
            }
        )
    }
         
    if(isDuplicate === false) {
        selectedMovieArray.push(selectedMovie)
    }
           
    localStorage.setItem('movieInfo', JSON.stringify(selectedMovieArray))
}  
