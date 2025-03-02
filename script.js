'use strict';
const apiKey = 'ae3b9e77';

const searchInput = document.querySelector('.search-input');
const searchIcon = document.querySelector('.search-icon');
const filmReelDiv = document.querySelector('.film-reel-div');

const moviesSection = document.querySelector('.movies-section');
const movieDetailsSection = document.querySelector('.movie-details-section');
const searchFunction = function () {
  if (searchInput === '') {
    alert('Please enter a movie name!');
  } else {
    getMovieData(searchInput.value);
    searchInput.value = '';
    filmReelDiv.classList.add('hidden');
    movieDetailsSection.innerHTML = ``;
    moviesSection.classList.remove('hidden');
  }
};

searchIcon.addEventListener('click', searchFunction);
searchInput.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    searchFunction();
  }
});

const getMovieData = function (movie) {
  fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=${movie}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Greška');
      }
      return response.json();
    })
    .then(data => {
      moviesSection.innerHTML = '';
      if (!data.Search) {
        alert('No movies found!');
        return;
      }
      data.Search.forEach(element => {
        creatingMovieDiv(element);
      });
      enteringEachMovie();
    });

  const creatingMovieDiv = function (element) {
    if (element.Poster !== 'N/A') {
      const eachMovie = document.createElement('div');
      eachMovie.classList.add('movie-div');
      eachMovie.innerHTML = `
      <img class="movie-img" src="${element.Poster}" />
      <h2 class="movie-title">${element.Title}</h2>
      <p class="type-p">${element.Type}</p>
      <p class="year-p">${element.Year}</p>
      `;
      moviesSection.appendChild(eachMovie);
    }
  };

  const enteringEachMovie = function () {
    document.querySelectorAll('.movie-div').forEach(movie => {
      movie.addEventListener('click', function () {
        const title = movie.querySelector('.movie-title').textContent;
        fetch(`https://www.omdbapi.com/?apikey=${apiKey}&t=${title}`)
          .then(response => response.json())
          .then(selectedMovie => {
            console.log(selectedMovie);
            moviesSection.classList.add('hidden');
            movieDetailsSection.innerHTML = ` <div class="movie-details-inner-div" id="${
              selectedMovie.imdbID
            }">
            <img src="${selectedMovie.Poster}" class="movie-detail-img" />
          <div class="movie-details-right-div" >
            <div class="flex">
               <h3 class="movie-detail-title">${selectedMovie.Title}</h3>
               <img src="favorites.png" class="favorites-img">
            </div>
            <p class="movie-detail-spec-line">
              ${selectedMovie.Year} • ${
              selectedMovie.Country
            } • <span class="un-italic">⭐</span><span class="bold">${
              selectedMovie.imdbRating
            }</span>/10
            </p>
            <p class="movie-detail-actors">
              <span class="bold">Actors: </span
              ><span class="movie-detail-actors-span"
                >${selectedMovie.Actors}</span
              >
            </p>
            <p class="movie-detail-genre">
              <span class="bold">Genre: </span
              ><span class="movie-detail-genre-span">${
                selectedMovie.Genre
              }</span>
            </p>
            <p class="movie-detail-release-date">
              <span class="bold">Relese date: </span
              ><span class="movie-detail-release-date-span">${
                selectedMovie.Released
              }</span>
            </p>
            <p class="movie-detail-runtime">
              <span class="bold">Movie Runtime: </span
              ><span class="movie-detail-runtime-span">${
                selectedMovie.Runtime
              }</span>
            </p>
            <p class="movie-detail-plot">${selectedMovie.Plot}
            </p>
            ${
              selectedMovie.Awards !== 'N/A'
                ? `<p class="movie-detail-awards"><span class="un-italic">🏆</span> <span class="movie-detail-awards-span">${selectedMovie.Awards}</span></p>`
                : ''
            }
          </div>
        </div>`;
          });
      });
    });
  };
};
