// Fetches all movies and actors matching user's search query.
// It fetches videos as well when the 'play trailer' is clicked.

const BAERER_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2ZmYxNDI3YjYzOTU1MmM5MGYzNmQ5MDFjNDM1MDZiNiIsInN1YiI6IjY1ODAwNTc2MmY4ZDA5MDhkNWE3ZDZjYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.i8yvWWQKFntKixfhh9Mje57-z4XwDQPG-bB03OnN_ZM';
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${BAERER_KEY}`
  }
};

async function movieFetch(searchType, userInput) {
  let url;
  if(searchType === 'movie' || searchType === 'person') url = `https://api.themoviedb.org/3/search/${searchType}?query=${userInput}&include_adult=false&language=en-US&page=1`;
  else if(searchType === 'Top Rated') url = `https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1`;
  else if (searchType === 'Popular') url = `https://api.themoviedb.org/3/movie/popular?language=en-US&page=1`;
  else{ url = `https://api.themoviedb.org/3/trending/movie/day?language=en-US'`};
  
  const response = await fetch(url,options);
  const dataMovie = await response.json();

  if(response.ok && dataMovie.results.length !== 0){
    return dataMovie;
  }
  else if(searchType === 'movie' && dataMovie.results.length === 0){
    throw 'Movie Not Found';
  }
  else if(searchType === 'person' && dataMovie.results.length === 0){
    throw 'Actor Not Found';
  }
  else {response.status === 404
    throw 404;
  }  
}

async function videoFetch(movieId){
  let url = `https://api.themoviedb.org/3/movie/${movieId}/videos?language=en-US`
  const response = await fetch(url,options);
  const dataVideo = await response.json();
  return dataVideo;
}

export{movieFetch,videoFetch};