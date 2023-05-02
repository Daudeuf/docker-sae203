const form = document.querySelector('form');
const textInput = document.querySelector('#text-input');
const songInfo = document.querySelector('#songInfo');
const audio = document.querySelector('#audio');
const plays_btn = document.querySelector('#plays_btn');

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

// function for timeline

audio.addEventListener("timeupdate", function() {
    var currentTime = audio.currentTime,
        duration = audio.duration,
        currentTimeMs = audio.currentTime * 1000;
    var progressbarRange = document.querySelector('.progressbar_range');
    
    progressbarRange.style.width = (currentTime + 0.25) / duration * 100 + '%';
});

// count function for timeleft

audio.addEventListener("timeupdate", function() {
    var timeleft = document.getElementById('timeleft'),
        duration = parseInt(audio.duration),
        currentTime = parseInt(audio.currentTime),
        timeLeft = duration - currentTime,
        s, m;
    
    s = timeLeft % 60;
    m = Math.floor(timeLeft / 60) % 60;
    
    s = s < 10 ? "0" + s : s;
    m = m < 10 ? "0" + m : m;
    
    timeleft.textContent = "-" + m + ":" + s;
});

document.onkeydown=function(evt){
    var keyCode = evt ? (evt.which ? evt.which : evt.keyCode) : event.keyCode;
    if(keyCode == 13)
    {
        console.log(textInput.value);
        event.preventDefault(); // empêcher l'envoi du formulaire
        const text = textInput.value;
        fetch('http://localhost:3000/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text })
        })
        .then(response => response.text())
        .then(data => {
            console.log(data);
            textInput.value = '';
            songInfo.innerHTML = `${data}`;

            audio.innerHTML = `<source src="tracks/${data}.mp3" type="audio/mpeg">`;
            audio.load();
            audio.play();
        })
        .catch(error => console.error(error));
    }
}

