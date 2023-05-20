const form              = document.querySelector('form');
const textInput         = document.querySelector('#text-input');
const songInfo          = document.querySelector('#songInfo');
const audio             = document.querySelector('#audio');
const plays_btn         = document.querySelector('#plays_btn');
const back_btn          = document.querySelector('#prev_btn');
const next_btn          = document.querySelector('#next_btn');
const progressBar       = document.getElementById('progressBar');
const soundBar          = document.getElementById('soundBar');
const songBox           = document.querySelector('.songBox');
const mostViewedBox     = document.querySelector('.mostViewed');
const queueBox          = document.querySelector('.queue');

let isDragging = false;
let isPopup    = false;

var queue = [];

plays_btn.addEventListener("click", function() {
	var audio = document.getElementsByTagName("audio")[0];

	if (!audio.paused) {
		audio.pause();
		isPlaying(false);
	} else {
		audio.play();
		isPlaying(true);
	}
});

function isPlaying(is)
{
	var playBtn = document.getElementById("play_btn");
	var pauseBtn = document.getElementById("pause_btn");

	if (!is) {
		playBtn.style.display = "block";
		pauseBtn.style.display = "none";
	} else {
		playBtn.style.display = "none";
		pauseBtn.style.display = "block";
	}
}

back_btn.addEventListener("click", function() {
	audio.currentTime = 0;
});

next_btn.addEventListener("click", function() {
	if (queue.length >= 1)
	{
		const song = queue.shift();

		play(song);
		updateQueue();
	}
});

soundBar.addEventListener("input", () => {
	audio.volume = ( soundBar.value / 1000.0 );
	const colorLeft = '#A0204C';
	const colorRight = '#1d1d1d';
	soundBar.style.background = `linear-gradient(to right, ${colorLeft} ${soundBar.value/10}%, ${colorRight} ${soundBar.value/10}%)`;
});

function updateProgressbarColor(value)
{
	const colorLeft = '#2463EB';
	const colorRight = '#A0204C';
	progressBar.style.background = `linear-gradient(to right, ${colorLeft} ${value/100}%, ${colorRight} ${value/100}%)`;
}

audio.addEventListener("timeupdate", function() {
	var time = document.getElementById('time'),
		currentTime = parseInt(audio.currentTime),
		durationTime = parseInt(audio.duration),
		s, m, s2, m2;

	s = currentTime % 60;
	m = Math.floor(currentTime / 60);

	s2 = durationTime % 60;
	m2 = Math.floor(durationTime / 60);

	s = s < 10 ? "0" + s : s;
	m = m < 10 ? "0" + m : m;

	s2 = s2 < 10 ? "0" + s2 : s2;
	m2 = m2 < 10 ? "0" + m2 : m2;

	time.textContent = m + ":" + s + " / " + m2 + ":" + s2;

	var val = (audio.currentTime / audio.duration) * 10000;

	if (!isNaN(val) && !isDragging)
	{
		progressBar.value = val;
		updateProgressbarColor(val);
	}
});

audio.addEventListener("ended", function() {
	if (queue.length >= 1)
	{
		const song = queue.shift();

		play(song);
		updateQueue();
	}
});

progressBar.addEventListener("change", () => {
	if (!isNaN(audio.duration))
	{
		audio.currentTime = Math.round((progressBar.value / 10000) * audio.duration);
	}
});

progressBar.addEventListener("input", () => {
	updateProgressbarColor(progressBar.value);
});

progressBar.addEventListener('mousedown', () => {
	isDragging = true;
});

progressBar.addEventListener('mouseup', () => {
	isDragging = false;
});

document.onkeydown = function(evt){
	var keyCode = evt ? (evt.which ? evt.which : evt.keyCode) : event.keyCode;
	if(keyCode == 13)
	{
		event.preventDefault(); // empêcher l'envoi du formulaire
		const text = textInput.value;
		textInput.value = '';

		fetch('http://localhost:3000/loadTrack',
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ text })
		}).then(response => response.text()).then(data =>
		{
			const song = JSON.parse(data);

			updateSong();
			addToQueue(song);
		}).catch(error => console.error(`Erreur : ${error}`));
	}
}

function updateSong()
{
	fetch('http://localhost:3000/getAllTracks',
	{
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({})
	}).then(response => response.text()).then(jsonString =>
	{
		const data = JSON.parse(jsonString);

		songBox.innerHTML = '';

		data.forEach(async function(song) {
			songBox.insertAdjacentHTML('beforeend', formatBlock(song, true));
		});

		clickable();

	}).catch(error => console.error(`Erreur : ${error}`));
}

function updateMostViewed()
{
	fetch('http://localhost:3000/getMostViewed',
	{
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({})
	}).then(response => response.text()).then(jsonString =>
	{
		const data = JSON.parse(jsonString);

		mostViewedBox.innerHTML = '';

		data.forEach(async function(song) {
			mostViewedBox.insertAdjacentHTML('beforeend', formatBlock(song, false));
		});

		clickable();

	}).catch(error => console.error(error));
}

function formatBlock(song, doFirstTitle)
{
	let blockHTML = `
		<div class="block" data-song-id="${song.videoId}">
	`;

	if (doFirstTitle)
		blockHTML += `
			<p class="blockTitle">${song.titre}</p>
			<br>
		`;

	blockHTML += `
		<img src="${song.image}" alt="${song.titre}-cover" style="width: 140px; height: 140px; object-fit: cover;">
		<br>
		<p class="songTitle">${song.titre}</p>
		<p class="artist">${song.artiste}</p>
	</div>
	`;

	return blockHTML;
}

function addView(videoId)
{
	fetch('http://localhost:3000/addView',
	{
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({videoId})
	});
}

function addToQueue(song)
{
	if (audio.currentSrc == "" || audio.ended)
	{
		play(song);
	}
	else
	{
		queue.push(song);
		updateQueue();

		if (!isPopup)
		{
			isPopup = true;
			var popup = document.getElementById("popup");
			popup.classList.toggle("show");

			setTimeout(() => {
				popup.classList.toggle("hide");

				setTimeout(function() {
					popup.classList.toggle("show");
					popup.classList.toggle("hide");
					isPopup = false;
				}, 750);
			}, 2000);
		}
	}
}

function play(song)
{
	const videoId = song.videoId;

	fetch('http://localhost:3000/getTrackSound',
	{
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({videoId})
	}).then(response => response.text()).then(link =>
	{

		songInfo.innerHTML = `${song.artiste} - ${song.titre}`;
		audio.innerHTML = `<source src="${link}" type="audio/webm">`;

		audio.load();
		audio.play();

		isPlaying(true);

		addView(videoId);

	}).catch(error => console.error(`Erreur : ${error}`));
}

function clickable()
{
	const blockElements = document.querySelectorAll('.block');

	blockElements.forEach(function(blockElement) {
		blockElement.onclick = function() {
			const videoId = blockElement.getAttribute('data-song-id');

			fetch('http://localhost:3000/getTrack',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({videoId})
			}).then(response => response.text()).then(song =>
			{
				addToQueue(JSON.parse(song));
			}).catch(error => console.error(`Erreur : ${error}`));
		}
	});
}

function clickableQueue()
{
	const waitingElements = document.querySelectorAll('.waitingElement');

	waitingElements.forEach(function(waitingElement) {
		waitingElement.onclick = function() {
			const position  = parseInt(waitingElement.getAttribute('data-queue-position'));

			for (let i = 0; i < Math.min(queue.length, position); i++)
			{
				queue.shift()
			}

			play(queue.shift());
			updateQueue();
		}
	});
}

function updateQueue()
{
	queueBox.innerHTML = '';

	for (let i = 0; i < queue.length; i++) {
		queueBox.insertAdjacentHTML('beforeend', `<div class="waitingElement" data-queue-position="${i}"><p class="songTitleWaiting">${queue[i].titre}</p><p class="artistWaiting">${queue[i].artiste}</p></div>`);
	}

	clickableQueue();
}

// Appel initial lors de l'ouverture de la page
updateMostViewed();
updateSong();