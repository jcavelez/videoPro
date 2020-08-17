import MediaPlayer from './MediaPlayer.js';
import AutoPlay from './AutoPlay.js'
import AutoPause from './AutoPause.js'

const video = document.querySelector('video')
const player = new MediaPlayer({
	element: video,
	plugins: [
		new AutoPlay(), 
		new AutoPause(),
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

function hideCarouselRecommendations(){
	$recommendationsCarousel.parentElement.classList.toggle('hiddenCarousel')
	 
	if($recommendationsCarousel.parentElement.classList.contains('hiddenCarousel')) {
	$recommendationsHeader.children[1].innerHTML = `
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -9 135 160" x="0px" y="0px">
		<defs>
			<style>.cls-1{fill:none;}</style>
		</defs>
		<g data-name="Layer 2">
			<g data-name="Layer 1">
				<path fill="#FFFFFF" d="M70.59,98a5.9,5.9,0,0,1-4.11-1.66L27,58.27a11.47,11.47,0,0,1,0-16.54L66.48,3.66a5.92,5.92,0,1,1,8.22,8.51L35.48,50,74.7,87.83A5.91,5.91,0,0,1,70.59,98Z"/>
				<rect class="cls-1" width="90" height="90"/>
			</g>
		</g>
	</svg>
`
//setTimeout(() => $recommendationsCarousel.parentElement.style.display = "none" , 250)

} else {
		$recommendationsHeader.children[1].innerHTML = `
		<svg  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 16 20" style="enable-background:new 0 0 16 16;" xml:space="preserve">
			<path fill="#FFFFFF" d="M2.8,4.9c-0.2-0.2-0.5-0.2-0.7,0s-0.2,0.5,0,0.7l5.5,5.5c0.2,0.2,0.5,0.2,0.7,0c0,0,0,0,0,0l5.5-5.5c0.2-0.2,0.2-0.5,0-0.7  s-0.5-0.2-0.7,0L8,10L2.8,4.9z"/>
		</svg>
		`

		//$recommendationsCarousel.parentElement.style.display = ""
	}

}


