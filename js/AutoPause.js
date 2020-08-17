class AutoPause {
	run(player) {
		this.player = player
		this.threshold = 0.25
		this.handleIntersection = this.handleIntersection.bind(this)
		this.handleVisibilityChange = this.handleVisibilityChange.bind(this)
		//un observador al que se le pasa una función a ejecutar y un umbral.
		//0.25 = 25% del viewport
		let optionsObserver = {
			root: null, //opcional. dafault: null == viewport
			rootMargin: '0px', //opcional. margen alrededor del root
			threshold: this.threshold, //% porcentaje de visibilidad que dispara el evento callback
		}
		
		let target = this.player.media
		const observer = new IntersectionObserver(this.handleIntersection, optionsObserver)
		//inicia el observador en el elemendo html pasado como arg
		//console.log(target)
		observer.observe(target)

		//evento cuando se cambia de tab
		document.addEventListener('visibilitychange', this.handleVisibilityChange)
	}


	//entries es un objeto que es enviado por parte del api
	//también puede recobir como segundo parámetro al observer
	handleIntersection(entries) {
		console.log(entries)
		const entry = entries[0]
		const isVisible = entry.intersectionRatio >= this.threshold
		if (isVisible) {
			this.player.play()
			//entry.target.controls = true	//
		} else {
			this.player.pause()
		}
	}

	handleVisibilityChange() {
		const isVisible = document.visibilityState === "visible"

		if (isVisible) {
			this.player.play()
		} else {
			this.player.pause()
		}

	}
}

export default AutoPause