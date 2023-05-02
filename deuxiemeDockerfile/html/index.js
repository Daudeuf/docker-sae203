const form = document.querySelector('form');
const textInput = document.querySelector('#text-input');
const submitButton = document.querySelector('#submit-button');
const h3 = document.querySelector('#text');
const audio = document.querySelector('#audio');

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

