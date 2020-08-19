import Advertiser from "./Advertiser.js"

class AdsPlugin {
	constructor() {
		this.ads = new Advertiser()
		this.handleTimeUpdate = this.handleTimeUpdate.bind(this)
		this.currentAd = ''

		this.adsContainer = document.createElement('div')
	}
	
	run(player) {
		this.player = player
		this.player.container.appendChild(this.adsContainer)
		this.media = this.player.media
		this.media.addEventListener('timeupdate', this.handleTimeUpdate)
		
	}	
	
	handleTimeUpdate() {
		const currentTime = Math.floor(this.media.currentTime)
		if(!this.lastTime) {
			this.lastTime = currentTime
		}
		if(currentTime % 20 === 0 && this.lastTime !== currentTime) {
			this.currentAd = ''
			this.lastTime = currentTime
			this.renderAd()
		}
	}
	
	renderAd(){
		if(this.currentAd) {
			return
		}
		const ad = this.ads.getAd()
		this.currentAd = ad

		this.adsContainer.innerHTML = `<div class="ads">
		<img class="ads__close" src="./assets/img/noun_Close_3483388.png" alt="close">
		<a class="ads__link" href="${ad.url}">
			<img class="ads__img" src="${ad.imageUrl}" alt="${ad.title}">
			<h5 class="ads__title">${ad.title}</h5>
			<p class="ads__desc">${ad.body}</p>
		</a>
	</div>`
	const $closeButton = document.querySelector('.ads__close')
	$closeButton.addEventListener('click', () => this.closeAd(this.adsContainer))
	//console.log(this.currentAd)

		setTimeout(() => this.closeAd(this.adsContainer) , 7000)
	}

	closeAd(adsContainer) {
		adsContainer.innerHTML = '' 
	}
}

export default AdsPlugin