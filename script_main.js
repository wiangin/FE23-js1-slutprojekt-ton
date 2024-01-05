// Kamonchai Ton Wiang In, Grit Academy FE23.

// Movies and actors database ( No tv series).
// Using TMDB API - https://www.themoviedb.org/
// User can search information about movies or actors by input.
// Users can also choose to view Top Rated and Most Popular by clicking.

import { 
  displayTenMovies,
  displaySearchMovie, 
  displaySearchActor, 
  displayError} from "./js/display_movies.js";
import { movieFetch}from "./js/fetch_movies.js";

const logoDiv = document.querySelector('#logoDiv');
logoDiv.addEventListener('click', () => {location.reload()});

const mainDiv = document.querySelector('#mainDiv');
const headingEl = document.querySelector('#heading');

headingEl.classList.add('headingText');
headingEl.innerHTML = 'Trending';
mainDiv.append(headingEl);

movieFetch()
  .then(displayTenMovies)
  .catch(displayError);

const topRatedText = document.querySelector('#topRatedText');
topRatedText.addEventListener('click' , () => {
  headingEl.innerHTML = 'Top Rated';
  headingEl.classList.remove('hide');
  mainDiv.append(headingEl);
  movieFetch('Top Rated')
    .then(displayTenMovies)
    .catch(displayError);
  })

const popularText = document.querySelector('#popularText');
popularText.addEventListener('click', () => {
  headingEl.innerHTML = 'Most Popular';
  headingEl.classList.remove('hide');
  mainDiv.append(headingEl);
  
  movieFetch('Popular')
  .then(displayTenMovies)
  .catch(displayError)});

const form = document.querySelector('form');
form.addEventListener('submit', event => {
    event.preventDefault();
    const userInput = document.querySelector('#userInput').value;
    const searchType = document.querySelector('input[type="radio"]:checked').value;

    if(searchType === 'movie'){
      movieFetch (searchType ,userInput)
        .then(displaySearchMovie)
        .catch(displayError); 
   }
   else if(searchType === 'person'){
      movieFetch(searchType ,userInput)
        .then(displaySearchActor)
        .catch(displayError);
    }

   form.reset();
})

anime({
  targets: '#logoDiv div',
  translateY: -30,
  direction: 'alternate',
  delay: anime.stagger(200,{easing: 'linear'}),
  color: [
    {value: 'hsl(100, 80%, 60%)', duration: 100, delay: 100,easing: 'linear'},
    {value: 'hsl(200, 80%, 60%)', duration: 100, delay: 100,easing: 'linear'},
    {value: 'hsl(300, 80%, 60%)', duration: 100, delay: 100,easing: 'linear'},
  ],
  loop: true
})
