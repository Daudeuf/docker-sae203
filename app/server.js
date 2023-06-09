const express         = require('express');
const cors            = require('cors');
const bodyParser      = require('body-parser');
const mariadb         = require('mariadb');
const ytSearch        = require('yt-search');
const youtubedl       = require('youtube-dl-exec')

const pool = mariadb.createPool({
	host: 'localhost',
	user: 'root',
	password: 'hsU3NRLttuCf5lp0TWYQ905U',
	database: 'blackmusic',
	connectionLimit: 5,
	charset: 'utf8mb4'
});

const app = express();

app.use(cors()); // permettre les requêtes cross-origin
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/loadTrack', async (req, res) => {
	const query = req.body.text;
	console.log(`Les termes recherchés sont : ${query}`);

	// Récupération du videoId
	const { videos } = await ytSearch(query);
	const videoId = videos[0].videoId;

	// Récupération des information du titre
	youtubedl(`https://youtube.com/watch?v=${videoId}`, {
		dumpSingleJson: true,
		noCheckCertificates: true,
		noWarnings: true,
		preferFreeFormats: true,
		addHeader: [
			'referer:youtube.com',
			'user-agent:googlebot'
		]
	}).then(async output => {
		var parts     = removeContentInBrackets(output.title).split('-');
		var thumbnail = output.thumbnail;
		var artiste   = parts[0];
		var title     = "";

		for (let i = 1; i < parts.length; i++) {
			title += parts[i];
		}

		// Vérification de la présence du titre dans la base de données
		if (await isInDatabase(videoId)) {
			console.log("Titre déjà existant");
		} else {
			console.log("Titre non existant, ajout en cour . . .");
			await addSong(videoId, title, artiste, thumbnail);
		}

		res.send(JSON.stringify(await getData(videoId)));
	})
});

app.post('/getAllTracks', async (req, res) => {
	try {
		const rows = await databaseQuery(`SELECT * FROM tracks ORDER BY id DESC`);
		res.send(rows);
	} catch (error) {
		console.error('[5] Erreur lors de la vérification de la présence du videoId dans la base de données :', error);
		res.send({});
	}
});

app.post('/getMostViewed', async (req, res) => {
	try {
		const rows = await databaseQuery(`SELECT * FROM tracks ORDER BY view DESC LIMIT 4`);
		res.send(rows);
	} catch (error) {
		console.error('[5] Erreur lors de la vérification de la présence du videoId dans la base de données :', error);
		res.send({});
	}
});

app.post('/getTrackSound', async (req, res) => {
	youtubedl(`https://youtube.com/watch?v=${req.body.videoId}`, {
		dumpSingleJson: true,
		noCheckCertificates: true,
		noWarnings: true,
		preferFreeFormats: true,
		addHeader: [
			'referer:youtube.com',
			'user-agent:googlebot'
		]
	}).then(output => {
		output.requested_formats.forEach(element => {
			if (element.resolution == 'audio only') {
				res.send(element.url);
			}
		});
	})
});

app.post('/getTrack', async (req, res) => {
	res.send(await getData(req.body.videoId));
});

app.post('/addView', async (req, res) => {
	try {
		const videoId = req.body.videoId;
		await databaseQuery(`UPDATE tracks SET view = view + 1 WHERE videoId = ?`, [videoId]);
	} catch (error) {
		console.error('[5] Erreur lors de la vérification de la présence du videoId dans la base de données :', error);
	}
});

app.listen(3000, () => {
	console.log('Le serveur est en cours d\'exécution sur le port 3000.');
});

async function isInDatabase(videoId) {
	try {
		const rows = await databaseQuery(`SELECT * FROM tracks WHERE videoId = ?`, [videoId]);
		return rows.length > 0;
	} catch (error) {
		console.error('[1] Erreur lors de la vérification de la présence du videoId dans la base de données :', error);
		return false;
	}
}

async function getData(videoId) {
	try {
		const rows = await databaseQuery(`SELECT * FROM tracks WHERE videoId = ?`, [videoId]);
		return rows[0];
	} catch (error) {
		console.error('[2] Erreur lors de la vérification de la présence du videoId dans la base de données :', error);
		return {};
	}
}

async function addSong(videoId, titre, artiste, image) {
	try {
		const values = [titre, artiste, videoId, image];
		await databaseQuery(`INSERT INTO tracks (titre, artiste, videoId, image) VALUES (?, ?, ?, ?)`, values);
	} catch (error) {
		console.error('[3] Erreur lors de l\'insertion de la ligne dans la base de données :', error);
	}
}

// Méthode pour simplifier les requêtes vers la base de données
async function databaseQuery(query, values)
{
	let conn;
	try {
		conn = await pool.getConnection();
		return await conn.query(query, values);
	} catch (error) {
		console.error(`[4] Erreur lors de l'insertion de la ligne dans la base de données :\n\n${query}\n\nErreur :`, error);
	} finally {
		if (conn) conn.release();
	}
}

function removeContentInBrackets(inputString) {
	let outputString = "";
	let stack = [];
  
	for (let i = 0; i < inputString.length; i++) {
	  const char = inputString[i];
  
	  if (char === '(' || char === '[' || char === '{') {
		stack.push(char);
	  } else if (char === ')' || char === ']' || char === '}') {
		stack.pop();
	  } else if (stack.length === 0) {
		outputString += char;
	  }
	}
  
	return outputString;
  }