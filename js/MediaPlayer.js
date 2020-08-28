class MediaPlayer {
	constructor (config) {
		this.media = config.element
		this.plugins = config.plugins || []
		this._initAds()
		this._initPlugins()
	}

	_initPlugins() {
		const player = {
			play: () => this.play(),
			pause: () => this.pause(),
			media: this.media,
			container: this.container,
			get muted() {
				return this.media.muted
			},
			set muted(value) {
				this.media.muted = value
			}
		}
	
		this.plugins.forEach(plugin => {
			//console.log('Plugins:', plugin)
			plugin.run(player)
		})
	}

	_initAds() {
		// wraping video element in a new div to ad banners inside
		this.container = document.createElement('div')
		this.container.style.position = 'relative'
		const parentOfMedia = this.media.parentNode
		parentOfMedia.insertBefore(this.container, this.media)
		this.container.appendChild(this.media)	
	}

	play() {
		this.media.play()
	}
	
	pause() {
		this.media.pause()
	}
	
	togglePlay() {
		if (this.media.paused) {
			this.play()
		} else {
			this.pause()
		}
	}
	
	mute() {
		this.media.muted = true
	}
	
	unmute() {
		this.media.muted = false
	}
	
	toggleMute() {
		this.media.muted = !this.media.muted
	}
}

export default MediaPlayer