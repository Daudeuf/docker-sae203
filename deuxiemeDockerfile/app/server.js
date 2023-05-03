const express    = require('express');
const cors       = require('cors');
const bodyParser = require('body-parser');
const fs         = require('fs');

const track_finder     = require('./track_finder');
const track_downloader = require('./track_downloader');

const app = express();

app.use(cors()); // permettre les requêtes cross-origin
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/submit', async (req, res) => {
	// Récupération des termes à rechercher
	const text = req.body.text;
	console.log(`Les termes recherchés sont : ${text}`);

	// Utilisez le module pour trouver un titre Spotify
	const lien = await track_finder(text);
	console.log('Titre Spotify trouvé:', lien);

	// Utilisez le module pour télécharger le son Spotify
	const name = await track_downloader(lien);
	console.log('Titre téléchargé');

	res.send(name);
});

app.listen(3000, () => {
	console.log('Le serveur est en cours d\'exécution sur le port 3000.');
});
