import MediaPlayer from './MediaPlayer.js';
import AutoPlay from './AutoPlay.js'
import AutoPause from './AutoPause.js'
import AdsPlugin from './Ads/AdsPlugin.js'

const video = document.querySelector('video')
const player = new MediaPlayer({
	element: video,
	plugins: [
		new AutoPlay(), 
		new AutoPause(),
		new AdsPlugin(),
	]
})

video.addEventListener('click', player.togglePlay.bind(player))
// player.media.controls = true

const $muteIcon = document.querySelector('.movie__icon')
$muteIcon.addEventListener('click', () => { 
	player.toggleMute.call(player)
	$muteIcon.classList.toggle('mute')
})

let $videoRelatedContainer = document.getElementById('recommendations')
let $recommendationsCarousel = createRecommendations($videoRelatedContainer)
//enviar cada id en cache a getData
//recibir 4 peliculas (API funciona asi)
//enviarlas a render item

let id = 1255
getRecommendationsSingleId(id).then((recommendedMovies) => {
	emptyHTMLCollection($recommendationsCarousel)
	recommendedMovies.forEach((movie) => {
		let movieTemplate = createCarouselItemTemplate(movie)
		insertHTML($recommendationsCarousel, movieTemplate)
	})
})

$recommendationsCarousel.parentElement.classList.add('hiddenCarousel')
//$recommendationsCarousel.parentElement.style.display = "none"

async function getRecommendationsSingleId(movieId) {
  const movies = await getData(`${RECOMMENDATIONS_URL}movie_id=${movieId}`)
	return movies
}


let $recommendationsHeader = document.querySelector('.recommendations .categories__header')

$recommendationsHeader.addEventListener('click', hideCarouselRecommendations)




