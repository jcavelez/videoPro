const RECOMMENDATIONS_URL = 'https://yts.mx/api/v2/movie_suggestions.json?'

//sessionStorage de prueba CAMBIAR POR LOCAL
//sessionStorage.idRecommendations = [18322, 18232, 18342]

if(recommendationBuffer > 0)
{
  setTimeout(() => {
    let $recommendationsCarousel = createRecommendations($listsContainer)
    //enviar cada id en cache a getData
    //recibir 4 peliculas (API funciona asi)
    //enviarlas a render item
    getRecommendationsFromCache().then((recommendedMovies) => {
      emptyHTMLCollection($recommendationsCarousel)
      recommendedMovies.forEach( (movie) => {
        let movieTemplate = createCarouselItemTemplate(movie)
        insertHTML($recommendationsCarousel, movieTemplate)
      })
    })
  },
    500)
}


async function getRecommendationsFromCache()
{
  
  let recommendedMovies = []
  // let cacheList = localStorage.getItem('idRecommendations').split(',')
  
  for (let i = 1; i <= localStorage.length; i++)
  {
    const recommendedId = localStorage[`rec${1}`]
    const movies = await getData(`${RECOMMENDATIONS_URL}movie_id=${recommendedId}`)
    recommendedMovies = recommendedMovies.concat(movies)
  }
  //console.log(recommendedMovies);
  return recommendedMovies
}



function createRecommendations($listsContainer)
{
  let carouselTemplate  = createCarouselTemplate('recommendations')
  prependHTML($listsContainer, carouselTemplate)
  prependHTML($listsContainer, 
  `<div class="categories__header">
    <h2 class="categories__title">Recomendados</h2>
      <span class="carousel__icon">
        <svg  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 16 20" style="enable-background:new 0 0 16 16;" xml:space="preserve">
          <path fill="#FFFFFF" d="M2.8,4.9c-0.2-0.2-0.5-0.2-0.7,0s-0.2,0.5,0,0.7l5.5,5.5c0.2,0.2,0.5,0.2,0.7,0c0,0,0,0,0,0l5.5-5.5c0.2-0.2,0.2-0.5,0-0.7  s-0.5-0.2-0.7,0L8,10L2.8,4.9z"/>
        </svg>
      </span>
  </div>`)
  const $recommendationsCarousel = document.getElementById('recommendations-list')
  //emptyHTMLCollection($recommendationsCarousel)
  return $recommendationsCarousel
}
