const API_URL = 'https://yts.mx/api/v2/list_movies.json?with_images=true&'
const MOVIE_DETAILS_URL = 'https://yts.mx/api/v2/movie_details.json?'

const GENRES = {
              comedy: 'Comedia',
              action: 'Acción',
              history: 'Historia',
              thriller: 'Suspenso',
              }
// Caché list: comedyCacheList, actionCacheList, historyCacheList, thrillerCacheList
//Lista de recomendaciones
let recommendationsList

const $listsContainer = document.getElementById('lists')
const $overlay = document.getElementById('overlay')
const $modal = document.getElementById('modal')

const MAX_RECOMMENDATIONS = 3
let recommendationBuffer = localStorage.length

//Render de carrouseles
for (let genre in GENRES)
{
  let templateTitles = 
  `<div class="categories__header">
  <h2 class="categories__title">Películas de ${GENRES[genre]}</h2>
    <span class="carousel__icon">
      <svg  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 16 20" style="enable-background:new 0 0 16 16;" xml:space="preserve">
        <path fill="#FFFFFF" d="M2.8,4.9c-0.2-0.2-0.5-0.2-0.7,0s-0.2,0.5,0,0.7l5.5,5.5c0.2,0.2,0.5,0.2,0.7,0c0,0,0,0,0,0l5.5-5.5c0.2-0.2,0.2-0.5,0-0.7  s-0.5-0.2-0.7,0L8,10L2.8,4.9z"/>
      </svg>
    </span>
  </div>`

  let templateCarousel = `
  <section class="carousel">
    <div class="carousel__container" id="${genre}-list">
      <img src="assets/img/loader.gif" width="50" height="50" alt="">
    </div>
  </section>
  `
  //
  //crea una variable tipo documento html
  let html = document.implementation.createHTMLDocument()
  //agrega los template de lista de generos carrusel
  html.body.innerHTML = templateTitles
  //agregar el temprate al final del elemento con id 'list'
  $listsContainer.append(html.body.children[0])
  let header = $listsContainer.lastChild
  html.body.innerHTML = templateCarousel
  $listsContainer.append(html.body.children[0])

  header.addEventListener('click' , hideCarousel.bind(this, $listsContainer.lastChild))


}

//Render de item de cada carrusel
for (let genre in GENRES)
{
  async function fillCarousel()
  {
    async function getMovies(genre)
    {
      let movies
      const listName = `${genre}CacheList`
      let cacheList = sessionStorage.getItem(listName)

      if (cacheList)
      {
        console.log('Hay caché');
        return JSON.parse(cacheList)
      }
      else
      {
        try
        {
          const response = await fetch(`${API_URL}genre=${genre}`)
          movies = await response.json()
          console.log(`Llegaron las pelis de ${genre} por async await`, movies.data)
          cacheList = movies.data.movies
          sessionStorage.setItem(listName, JSON.stringify(cacheList))
          return cacheList
        } catch (e)
        {
          console.log(e)
          movies = [{id: 'undefined', title: 'Not found', medium_cover_image: './assets/img/404-error-page-not-found-miss-paper-with-white-vector.jpg'}]
          return movies
        }
      }

    }

    const MOVIES = await getMovies(genre)
    console.log(MOVIES);
    const $carousel = document.getElementById(genre+'-list')
    $carousel.children[0].remove()
    MOVIES.forEach((movie) => {
      let movieElement
      const templateItem = `
      <div class="carousel-item" data-id="${movie.id}">
        <img class="carousel-item__img" src="${movie.medium_cover_image}" alt="${movie.title}">
        <div class="carousel-item__details">
          <div>
            <img class="carousel-item__details--img play-button" src="./assets/img/play-icon.png" alt="Reproducir">
            <img class="carousel-item__details--img" src="./assets/img/plus-icon.png" alt="Agregar">
          </div>
          <p class="carousel-item__details--title">${movie.title}</p>
          <p class="carousel-item__details--subtitle">${movie.year} ‧ ${movie.genres} ‧ Rating ${movie.rating}</p>
        </div>
      </div>
      `

      const html = document.implementation.createHTMLDocument()
      html.body.innerHTML = templateItem
      movieElement = html.body.children[0]
      $carousel.append(movieElement)
      const $imageMovieElement = movieElement.querySelector('.carousel-item__img')
      $imageMovieElement.addEventListener('load', () => { $imageMovieElement.classList.add('fadeIn')} )
      movieElement.addEventListener('click', showModal.bind(this, movieElement.dataset.id))
      
      let play = movieElement.querySelector('.play-button')
      play.removeEventListener('click', showModal.bind(this, movieElement.dataset.id))
     // play.addEventListener('click', playMovie.bind(this, movieId))
      
      //addEventListener('click', playMovie.bind(this, movie.id))
    })
  }

  fillCarousel()
}

async function showModal(movieId)
{
  $overlay.classList.add('active');

  console.log(`Vamos a mostrar la pelicula ID ${movieId}`)

  const $modalContent = document.querySelector('.modal-content')
  let movieData
  let movieElement

  movieData = await getMovieDetails(`${MOVIE_DETAILS_URL}movie_id=${movieId}`)

  //Guardo ID en el localStorage para crear recomendaciones personalizas

  const movieModalTemplate = createModalTemplate(movieData)
  const movieHTMLCollection = document.implementation.createHTMLDocument()
  movieHTMLCollection.body.innerHTML = movieModalTemplate
  movieElement = movieHTMLCollection.body.children[0]

  let sizeModalContent = $modalContent.children.length
  for (let i = 0; i < sizeModalContent; i++)
  {
    $modalContent.children[0].remove()
  }

  $modalContent.append(movieElement)

  $modal.style.animation = 'modalIn .8s forwards';

  const $closeModal = document.getElementById('closeModal')
  $closeModal.addEventListener('click', hideModal)
  $overlay.addEventListener('click', hideModal)

  //guardamos en el localstorage el id de la peli para después crear
  //recomendaciones basados en estos ids

  let save = true

  for(let i = 1 ; i <= MAX_RECOMMENDATIONS; i++) {
    console.log(localStorage.getItem(`rec${i}`) , " ", movieId)
    if(localStorage.getItem(`rec${i}`) == movieId) {
      save = false
    }
  }
  if(save) {
    recommendationBuffer = recommendationBuffer < MAX_RECOMMENDATIONS ? recommendationBuffer+1 : 1
    localStorage.setItem(`rec${recommendationBuffer}`, movieId)
  }
}

function hideModal() {
  $overlay.classList.remove('active');
  $modal.style.animation = 'modalOut .5s forwards';
}

function setAttributes($element, attributes)
{
  for(let attr in attrbutes)
  {
    $element.setAttributes(attr, attributes[key])
  }
}

function createModalTemplate(movie)
{
  let movieGenres = ''

  for(genre in movie.genres)
  {
    movieGenres = `${movie.genres[genre]}, ${movieGenres}`
  }

  console.log(movieGenres)

  return `
  <div class="modal-content">
    <div class="modal-header">
      <button type="button" class="close" data-dismiss="modal" aria-label="Close" id="closeModal">
        <span aria-hidden="true">&times;</span>
      </button>
      <h4 class="modal-title" id="myModalLabel">${movie.title}</h4>
    </div>
    <div class="modal-main">
      <img class="modal-img" src="${movie.medium_cover_image}" alt="">
      <p class="modal-desc">${movie.description_full}
      </p>
    </div>
    <div class="modal-details info">
        <span class="sub">Géneros: </span> <span>${movieGenres}</span>
        <span class="sub">Idioma: </span> <span>${movie.language}</span>
        <span class="sub">Año: </span> <span>${movie.year}</span>
        <span class="sub">Rating IMBd: </span> <span>${movie.rating}</span>
    </div>
  </div>
  `
}

function hideCarousel($Carousel){
  $Carousel.classList.toggle('hiddenCarousel')
  
  let $Header = $Carousel.previousSibling
  $Header.querySelector('.carousel__icon').classList.toggle('hiddenCarousel')

	// if($Carousel.classList.contains('hiddenCarousel')) {
    
  //   $Header.children[1].innerHTML = `
  //   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -9 135 160" x="0px" y="0px">
  //     <defs>
  //       <style>.cls-1{fill:none;}</style>
  //     </defs>
  //     <g data-name="Layer 2">
  //       <g data-name="Layer 1">
  //         <path fill="#FFFFFF" d="M70.59,98a5.9,5.9,0,0,1-4.11-1.66L27,58.27a11.47,11.47,0,0,1,0-16.54L66.48,3.66a5.92,5.92,0,1,1,8.22,8.51L35.48,50,74.7,87.83A5.91,5.91,0,0,1,70.59,98Z"/>
  //         <rect class="cls-1" width="90" height="90"/>
  //       </g>
  //     </g>
  //   </svg>
  // `
  // } else {
  //     $Header.children[1].innerHTML = `
  //     <svg  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 16 20" style="enable-background:new 0 0 16 16;" xml:space="preserve">
  //       <path fill="#FFFFFF" d="M2.8,4.9c-0.2-0.2-0.5-0.2-0.7,0s-0.2,0.5,0,0.7l5.5,5.5c0.2,0.2,0.5,0.2,0.7,0c0,0,0,0,0,0l5.5-5.5c0.2-0.2,0.2-0.5,0-0.7  s-0.5-0.2-0.7,0L8,10L2.8,4.9z"/>
  //     </svg>
  //     `
  //   }
}

function playMovie() {

}