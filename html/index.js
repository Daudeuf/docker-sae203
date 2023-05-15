const form        = document.querySelector('form');
const textInput   = document.querySelector('#text-input');
const songInfo    = document.querySelector('#songInfo');
const audio       = document.querySelector('#audio');
const plays_btn   = document.querySelector('#plays_btn');
const progressBar = document.getElementById('progressBar');
const soundBar    = document.getElementById('soundBar');
const songBox     = document.querySelector('.songBox');

var jsmediatags = window.jsmediatags;

let isDragging = false;

document.getElementById("plays_btn").addEventListener("click", function() {
	var audio = document.getElementsByTagName("audio")[0];
	var playBtn = document.getElementById("play_btn");
	var pauseBtn = document.getElementById("pause_btn");

	if (!audio.paused) {
		audio.pause();
		playBtn.style.display = "block";
		pauseBtn.style.display = "none";
	} else {
		audio.play();
		playBtn.style.display = "none";
		pauseBtn.style.display = "block";
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


// count function for time

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

audio.addEventListener('canplaythrough', function() {
	console.log('Le fichier audio peut être lu jusqu\'à la fin.');
});

audio.addEventListener('canplay', function() {
	console.log('Le flux audio est prêt à être joué.');
});

progressBar.addEventListener("change", () => {
	if (!isNaN(audio.duration))
	{
		console.log(audio.currentTime);
		var time = Math.round((progressBar.value / 10000) * audio.duration);
		audio.currentTime = time;
		console.log(audio.currentTime, time);
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

document.onkeydown=function(evt){
	var keyCode = evt ? (evt.which ? evt.which : evt.keyCode) : event.keyCode;
	if(keyCode == 13)
	{
		console.log(`Termes recherchés : ${textInput.value}`);
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
			play(song);
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
			const blockHTML = `
				<div class="block" data-song-id="${song.videoId}">
					<p class="blockTitle">${song.titre}</p>
					<img src="${song.image}" alt="${song.titre}-cover" style="width: 140px; height: 140px; object-fit: cover;">
					<p class="songTitle">${song.titre}</p><br />
					<p class="artist">${song.artiste}</p>
				</div>
			`;

			songBox.insertAdjacentHTML('beforeend', blockHTML);
		});

	}).catch(error => console.error(`Erreur : ${error}`));
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

	}).catch(error => console.error(`Erreur : ${error}`));
}

// Appel initial lors de l'ouverture de la page
updateSong();