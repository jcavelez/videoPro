
// Render comments
const $comments = document.querySelector('.comments')

let comments = [
	{
		UrlPhoto: '/assets/img/user_1.png',
		name: 'Alexandra Smirnov',
		comment: 'La mejor película de todos los tiempos. Es genial, me encantó. 5 estrellas.',
	},
	{
		UrlPhoto: '/assets/img/user_1.png',
		name: 'Vladimir Putin',
		comment: 'Terrible!!! dos horas perdidas.',
	},
	{
		UrlPhoto: '/assets/img/user_1.png',
		name: 'Mohamed Adjuatmed Assala',
		comment: 'The best movie and I was in my tears while watching and all I was looking at Sushant Singh Rajput.',
	},
	{
		UrlPhoto: '/assets/img/user_1.png',
		name: 'Anne Hdoz',
		comment: 'This is the only Indian movie which made me cry..... You need to be emotionally strong specially after the dismissal of the Sushant Singh Rajput..',
	},
	{
		UrlPhoto: '/assets/img/user_1.png',
		name: 'Shalam Shalom',
		comment: 'e of the finest acting Ive ever seen.I suggest you to please watch this. I think this is far better than movies originated from nepotism.',
	},
	{
		UrlPhoto: '/assets/img/user_1.png',
		name: 'Isabella Santodomingo',
		comment: 'A must watch movie... ',
	},
	{
		UrlPhoto: '/assets/img/user_1.png',
		name: 'Suyroa Aide',
		comment: 'Dont know what to write just after the watching the movie but watch this without even a second thought. Love SSR!',
	},
	{
		UrlPhoto: '/assets/img/user_1.png',
		name: 'Herefo Beest',
		comment: 'fter watching the movie. I could only say it touched the heart and emotions in the movie make us learn many things in life',
	},
]

//borro el comentario de prueba
$comments.children[1].remove()

renderComments(comments)

function renderComments(comments) {
	comments.forEach((comment) => {
		let template = createCommentTemplate(comment)
		insertHTML($comments, template)
	})
}

function createCommentTemplate(comment) {
	return `
	<div class="comment">
			<img class="comment__photo" src="${comment.UrlPhoto}"></img>
			<div class="comment__name">${comment.name}</div>
			<div class="comment__content">${comment.comment}</div>
		</div>`
}

