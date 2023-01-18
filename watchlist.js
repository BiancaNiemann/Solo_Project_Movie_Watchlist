const movieInfoList = document.getElementById('movie-info-list')
let watchList = JSON.parse(localStorage.getItem('movieInfo'))

//EVENT LISTENER FOR REMOVE BUTTON - WILL REMOVE SELECTED ITEM AND RE-RENDER PAGE AND IF NO MOVIES SELECTED WILL RENDER START PAGE
document.addEventListener('click', (e)=> {
    if(e.target.dataset.remove){
        removeFromLocal(e.target.dataset.remove)
        selectPage()
    }
})

//CHECKS IF ANY MOVIES SELECTED, IF NOT RENDERS START PAGE ELSE RENDERS MOVIE SELECTION
function selectPage(){
    if (watchList.length >= 1){
        renderWatchList()
    } else {
        renderStartPage()
    }
}
selectPage()

//HTML FOR THE WATCHLIST OF MOVIES SELECTED
function renderWatchList(){
    let html = ''
    for (movie of watchList){
        html += `
            <div class="movie-container">
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
                        <div class="remove-box">
                            <button id="remove-btn" class="remove-btn" data-remove=${movie.id}>- Remove</button>
                        </div>
                    </div>
                    <p class="plot">${movie.plot}</p>
                </div>
            </div>

        `      
        movieInfoList.innerHTML = html
    }
}

//FUNCTION FOR THE HTML FOR THE START PAGE IF NO MOVIES SELECTED
function renderStartPage(){
    let html = ''
    html += `
        <div class="start-page">
            <h4 class="start-text">Your watchlist is looking a little empty...</h4>
             <div class="add-movies">
                <a href="./index.html"><button class="lets-add-btn" >+</button></a>
                <h4 class="lets-add">Lets add some movies!</h4>
            </div>
        </div>
    `
    movieInfoList.innerHTML = html
}

//FUNCTION TO LOOP THROUGH MOVIES SELECTED AND DELETE ONE WITH MATCHING ID TO BUTTON CLICKED AND THEN UPDATE THE LOCAL STORAGE
function removeFromLocal(e){
    for (movie of watchList){
        if(e == movie.id){
            let movieIndex = watchList.indexOf(movie)
            let updatedSelection = watchList.splice(movieIndex, 1)
            localStorage.setItem('movieInfo', JSON.stringify(watchList))
        }
    }
}

