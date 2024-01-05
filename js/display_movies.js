// All functions to display movies, actors and video trailer.
// Function to display an error message in case of issues or incorrect user input."
// Function to display an image when movies or actors are missing their respective images.
// Fucntion to create elements.
// Function to get a movie ID,

import { videoFetch } from "./fetch_movies.js";

const mainDiv = document.querySelector('#mainDiv');
const headingEl = document.querySelector('#heading'); headingEl.classList.add('headingText');
const flexContainerDiv = document.querySelector('#flexContainer'); //Moviecards show here
const imageBaseUrl = `https://image.tmdb.org/t/p/w400/`;
const smallImageBaseUrl = `https://image.tmdb.org/t/p/w200/`;
let isPlaying = false; //This boolean handles the "Play Trailer" text when clicking.

function displayTenMovies(movie){
    const ulEL = document.createElement('ul');
    flexContainerDiv.innerHTML = '';
    
    for (let i = 0; i < 10; i++) {
        const movieAndActorInfoDiv = document.createElement('div');
        const liEl = document.createElement('li');
        const poster = movie.results[i].poster_path;
        
        createAndAppendElement('img',smallImageBaseUrl + poster, movieAndActorInfoDiv);
        createAndAppendElement('p',movie.results[i].title, movieAndActorInfoDiv).classList.add('fontWeight');
        createAndAppendElement('p',movie.results[i].release_date, movieAndActorInfoDiv);

        movieAndActorInfoDiv.classList.add('smallMovieCard');
        ulEL.append(liEl);
        liEl.append(movieAndActorInfoDiv);
        flexContainerDiv.append(liEl);
        mainDiv.append(flexContainerDiv);

        const playTrailerEl = document.createElement('p');
        playTrailerEl.innerText = 'Play Trailer';
        playTrailerEl.classList.add('playTrailerStyle');
        playTrailerEl.id = movie.results[i].id;
        movieAndActorInfoDiv.append(playTrailerEl);
       
        videoFetch(playTrailerEl.id)
            .then(video =>{
                const key = getVideoKey(video);
                playTrailerEl.addEventListener('click', (event)=>{
                    displayTrailer(key, movieAndActorInfoDiv);
                })        
            })   
    } 
}

function displaySearchMovie(movie){
    headingEl.classList.add('hide');
    flexContainerDiv.innerHTML = '';

    for (const movieList of movie.results) {
        const movieAndActorInfoDiv = document.createElement('div');
        const poster = movieList.poster_path;
        if(poster !== null){
            createAndAppendElement('img',imageBaseUrl + poster,movieAndActorInfoDiv);
        }
        else{
            const noImageFile = `./img/noImage.svg`;
            displayNoImage(movieAndActorInfoDiv, noImageFile);
        }

        createAndAppendElement('p',movieList.title,movieAndActorInfoDiv).classList.add('fontWeight');
        createAndAppendElement('p',movieList.overview,movieAndActorInfoDiv);
        createAndAppendElement('p',movieList.release_date,movieAndActorInfoDiv);

        movieAndActorInfoDiv.classList.add('bigMovieCard');
        flexContainerDiv.append(movieAndActorInfoDiv);

        const playTrailerEl = document.createElement('p');
        playTrailerEl.innerText = 'Play Trailer';
        playTrailerEl.classList.add('playTrailerStyle');
        playTrailerEl.id = movieList.id;
        movieAndActorInfoDiv.append(playTrailerEl);

        videoFetch(playTrailerEl.id)
        .then(video =>{
            const key = getVideoKey(video);
            playTrailerEl.addEventListener('click', (event)=>{
                displayTrailer(key, movieAndActorInfoDiv);
            })        
        })  
    }
}

function displayTrailer(videoKey){
    if(!isPlaying){
        const trailerDialogEl = document.querySelector('#dialogStyle'); //Video Trailer show here 
        trailerDialogEl.innerHTML = '';

        let youTubeEl = document.createElement('iframe');
        youTubeEl.allowFullscreen = 'allowFullscreen';
        youTubeEl.src = `https://www.youtube.com/embed/${videoKey}?si=6zzQmtaEqHfrYTIE`;
        isPlaying = true;

        const closeBtn = document.createElement('button');
        closeBtn.id = 'closeBtnStyle';
        closeBtn.innerText = 'Close';
        closeBtn.addEventListener('click', () => {
            youTubeEl.classList.add('removeVideo');
            closeBtn.classList.add('removeVideo');
            youTubeEl.remove();
            trailerDialogEl.close();
            isPlaying = false;
        });

        trailerDialogEl.append(youTubeEl, closeBtn);
        trailerDialogEl.showModal();
    }
}

function displaySearchActor(actor) {  
    headingEl.classList.add('hide');
    flexContainerDiv.innerHTML = '';

    for (const actorList of actor.results) {
        const movieAndActorInfoDiv = document.createElement('div');
        const actorPoster = actorList.profile_path;

        if(actorPoster !== null){
            createAndAppendElement('img',imageBaseUrl + actorPoster,movieAndActorInfoDiv);
        }
        else{
            const noImageFile = `./img/information.png`;
            displayNoImage(movieAndActorInfoDiv, noImageFile);
        }

        createAndAppendElement('p',actorList.name,movieAndActorInfoDiv).classList.add('fontWeight');
        createAndAppendElement('p',actorList.known_for_department,movieAndActorInfoDiv);

        movieAndActorInfoDiv.classList.add('bigMovieCard');
        flexContainerDiv.append(movieAndActorInfoDiv);

        for(const knowforList of actorList.known_for){
            if(knowforList.media_type === 'tv'){
                const knowForTvTitle = 'Tv : ';
                const knowForTvEl = document.createElement('p');

                knowForTvEl.innerText = knowForTvTitle + knowforList.original_name;
                movieAndActorInfoDiv.append(knowForTvEl);
            }
            if(knowforList.media_type === 'movie'){
                const knowForMovieTitle = 'Movie : ';
                const knowForMovieEl = document.createElement('p');

                knowForMovieEl.innerText = knowForMovieTitle + knowforList.title; 
                movieAndActorInfoDiv.append(knowForMovieEl);
            }
        }
    }
}

function getVideoKey(video){
    for(var videoList of video.results){
        if(videoList.type === 'Trailer'){
            return videoList.key;
        }    
    }
}

function createAndAppendElement(type, content, container){
    const element = document.createElement(type);
    container.append(element);

    if(type === 'img') element.src = content;
    else element.innerText = content;
    return element;
}

function displayNoImage(movieAndActorInfoDiv, noImageFile ){
    const noImageEl = document.createElement('img');
    noImageEl.src = noImageFile;
    noImageEl.classList.add('noPicstyle');
    movieAndActorInfoDiv.append(noImageEl);
}

function displayError(error){
    flexContainerDiv.innerHTML = '';
    const errorEl = document.createElement('h1');
    if(error === 'Movie Not Found' || error === 'Actor Not Found'){
        errorEl.innerText = error + '. Please try again.';
    }
    else{
        errorEl.innerText = 'Something went wrong. Please try again later.';
        
    }
    errorEl.classList.add('errorDiv')
    headingEl.classList.add('hide');   
    flexContainerDiv.append(errorEl);
}

export{
    displayTenMovies,
    displaySearchMovie,
    displaySearchActor,
    displayError};

