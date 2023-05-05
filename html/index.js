const form = document.querySelector('form');
const textInput = document.querySelector('#text-input');
const songInfo = document.querySelector('#songInfo');
const audio = document.querySelector('#audio');
const plays_btn = document.querySelector('#plays_btn');
const progressBar = document.getElementById('progressBar');
const soundBar = document.getElementById('soundBar');
const songBox = document.querySelector('.songBox');

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

progressBar.addEventListener("change", () => {
	if (!isNaN(audio.duration)) audio.currentTime = (progressBar.value / 10000) * audio.duration;
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
		const submit_code = "download";
		textInput.value = '';

		fetch('http://localhost:3000/submit',
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ text, submit_code })
		}).then(response => response.text()).then(data =>
		{
			console.log(`Fichier : ${data}.mp3`);

			songInfo.innerHTML = `${data}`;
			audio.innerHTML = `<source src="tracks/${data}.mp3" type="audio/mpeg">`;

			audio.load();
			audio.play();

			updateSong();
		}).catch(error => console.error(`Erreur : ${error}`));
	}
}

function updateSong()
{
	const submit_code = "get_all_song";

	fetch('http://localhost:3000/submit',
	{
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ submit_code })
	}).then(response => response.text()).then(jsonString =>
	{
		const data = JSON.parse(jsonString);

		songBox.innerHTML = '';

		data.forEach(async function(song) {
			const imageDataUrl = await getSongImage(`${song.artiste} - ${song.titre}.mp3`);
			const blockHTML = `
				<div class="block" data-song-id="${song.id}">
					<p class="blockTitle">${song.titre} - ${song.artiste}</p>
					<img src="${imageDataUrl}" alt="${song.titre}-cover" style="width: 160px; height: 140px;">
					<p class="songTitle">${song.titre}</p><br />
					<p class="artist">${song.artiste}</p>
				</div>
			`;

			songBox.insertAdjacentHTML('beforeend', blockHTML);
		});

	}).catch(error => console.error(`Erreur : ${error}`));
}

function getSongImage(filename)
{
	return new Promise(async (resolve, reject) => {
		const mp3Blob = await createMp3Blob(`tracks/${filename}`);

		jsmediatags.read(mp3Blob, {
			onSuccess: function(tag) {
				var tags = tag;

				var picture = tags.tags.picture; // create reference to track art
				var base64String = "";
				for (var i = 0; i < picture.data.length; i++) {
					base64String += String.fromCharCode(picture.data[i]);
				}
				var imageUri = "data:" + picture.format + ";base64," + window.btoa(base64String);

				resolve(imageUri)
			}, 
			onError: function(error) {
				reject(error)
			}
		});
	});
}

async function createMp3Blob(filename) {
	try {
		const response = await fetch(filename);
		if (!response.ok) {
		throw new Error(`HTTP error! Status: ${response.status}`);
		}
		const mp3Blob = await response.blob();
		return mp3Blob;
	} catch (error) {
		console.error("Une erreur est survenue lors de la création du blob MP3 :", error);
		throw error;
	}
}

// Appel initial lors de l'ouverture de la page
updateSong();