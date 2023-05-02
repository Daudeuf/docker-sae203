const form = document.querySelector('form');
const textInput = document.querySelector('#text-input');
const submitButton = document.querySelector('#submit-button');
const h3 = document.querySelector('#text');
const audio = document.querySelector('#audio');

var audio = document.getElementById('audio');

// html5 function - toggle play/pause btn and audio

$("#plays_btn").click(function() {

    if (audio.paused == false) {
        audio.pause();
        $("#play_btn").show();
        $("#pause_btn").hide();
    } else {
        audio.play();
        $("#play_btn").hide();
        $("#pause_btn").show();
    }
});


// timeline

audio.addEventListener("timeupdate", function() {
    var currentTime = audio.currentTime,
        duration = audio.duration,
        currentTimeMs = audio.currentTime * 1000;
    $('.progressbar_range').stop(true, true).animate({'width': (currentTime + .25) / duration * 100 + '%'}, 250, 'linear');
});


// temps restant

audio.addEventListener("timeupdate", function() {
    var timeleft = document.getElementById('timeleft'),
        duration = parseInt( audio.duration ),
        currentTime = parseInt( audio.currentTime ),
        timeLeft = duration - currentTime,
        s, m;
    
    s = timeLeft % 60;
    m = Math.floor( timeLeft / 60 ) % 60;
    
    s = s < 10 ? "0"+s : s;
    m = m < 10 ? "0"+m : m;
    
    $('#timeleft').text("-"+m+":"+s);
    
});

document.onkeydown=function(evt){
    var keyCode = evt ? (evt.which ? evt.which : evt.keyCode) : event.keyCode;
    if(keyCode == 13)
    {
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
            h3.innerHTML = `Dernier son téléchargé : ${data}`;
            //var audio = new Audio(`tracks/${data}.mp3`);
            //audio.play();
            audio.innerHTML = `<source src="tracks/${data}.mp3" type="audio/mpeg">`;
            audio.load();
        })
        .catch(error => console.error(error));
    }
}

