function AutoPlay() {

}

AutoPlay.prototype.run = function (player) {
	//console.log('muted:', player)
	if (!player.muted) {
		player.muted = true
	}
	player.play()
	
}

export default AutoPlay