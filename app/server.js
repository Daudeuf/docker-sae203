const express	= require('express');
const cors	   = require('cors');
const bodyParser = require('body-parser');
const fs		 = require('fs');
const mariadb	= require('mariadb');

const track_finder	 = require('./track_finder');
const track_downloader = require('./track_downloader');

const pool = mariadb.createPool({
	host: 'localhost',
	user: 'root',
	password: 'hsU3NRLttuCf5lp0TWYQ905U',
	database: 'blackmusic',
	connectionLimit: 5
});

const app = express();

app.use(cors()); // permettre les requêtes cross-origin
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/submit', async (req, res) => {
	if (req.body.submit_code == "download")
	{
		// Récupération des termes à rechercher
		const text = req.body.text;
		console.log(`Les termes recherchés sont : ${text}`);

		// Utilisez le module pour trouver un titre Spotify
		const lien = await track_finder(text);
		console.log('Titre Spotify trouvé:', lien);

		// Vérification de la présence du titre dans la base de données
		if (await isInDatabase(lien))
		{
			console.log("Titre déjà existant");
		}
		else
		{
			console.log("Titre non existant");

			// Utilisez le module pour télécharger le son Spotify
			const result = await track_downloader(lien);
			console.log('Titre téléchargé');

			await addSong(lien, result.title, result.artist);
		}

		var data = await getData(lien);

		res.send(`${data.artiste} - ${data.titre}`);
	}
	else // donc get_all_song
	{
		try {
			const rows = await databaseQuery(`SELECT * FROM tracks`);
			res.send(rows);
		} catch (error) {
			console.error('[5] Erreur lors de la vérification de la présence du lien dans la base de données :', error);
			res.send({});
		}
	}
});

app.listen(3000, () => {
	console.log('Le serveur est en cours d\'exécution sur le port 3000.');
});

async function isInDatabase(lien) {
	try {
		const rows = await databaseQuery(`SELECT * FROM tracks WHERE lien = '${lien}'`);
		return rows.length > 0;
	} catch (error) {
		console.error('[1] Erreur lors de la vérification de la présence du lien dans la base de données :', error);
		return false;
	}
}

async function getData(lien) {
	try {
		const rows = await databaseQuery(`SELECT * FROM tracks WHERE lien = '${lien}'`);
		return rows[0];
	} catch (error) {
		console.error('[2] Erreur lors de la vérification de la présence du lien dans la base de données :', error);
		return {};
	}
}

async function addSong(lien, titre, artiste) {
	try {
		await databaseQuery(`INSERT INTO tracks (titre, artiste, lien) VALUES ('${titre}', '${artiste}', '${lien}')`);
	} catch (error) {
		console.error('[3] Erreur lors de l\'insertion de la ligne dans la base de données :', error);
	}
}

// Méthode pour simplifier les requêtes vers la base de données
async function databaseQuery(query)
{
	let conn;
	try {
		conn = await pool.getConnection();
		return await conn.query(query);
	} catch (error) {
		console.error(`[4] Erreur lors de l'insertion de la ligne dans la base de données :\n\n${query}\n\nErreur :`, error);
	} finally {
		if (conn) conn.release();
	}
}