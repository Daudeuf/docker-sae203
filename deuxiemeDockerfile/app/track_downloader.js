// track_downloader.js
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function downloadSong(link) {
	// console.log('Lancement du navigateur...');
	const downloadFolder = "/var/www/html/tracks"; // dossier de téléchargement souhaité
	const browser = await puppeteer.launch({ headless: false });
	const page = await browser.newPage();

	// Définir l'emplacement de téléchargement
	const client = await page.target().createCDPSession();
	await client.send('Page.setDownloadBehavior', {
		behavior: 'allow',
		downloadPath: downloadFolder,
	});
	
	// console.log('Navigation vers la page...');
	await page.goto('https://spotifydown.com/fr');

	// console.log('Remplissage du champ de texte...');
	await page.type('xpath//html/body/div/div/div[1]/input', link);

	// console.log('Clic sur le bouton...');
	await page.click('xpath//html/body/div/div/button');

	// console.log('Attente de l\'élément...');
	await page.waitForSelector('xpath//html/body/div/div/div[2]/div[1]/div/div[2]/button');
	
	// console.log('Clic sur le deuxième bouton...');
	await page.click('xpath//html/body/div/div/div[2]/div[1]/div/div[2]/button');

	// console.log('Attente de l\'élément à scraper...');
	await page.waitForSelector('xpath//html/body/div/div/div[2]/div[1]/a[1]');

	// console.log('Récupération des données...');
	const handleLink = await page.$x('/html/body/div/div/div[2]/div[1]/a[1]');
	let songLink = await page.evaluate(el => el.href, handleLink[0]);

	const handleTitle = await page.$x('/html/body/div[1]/div/div[2]/p[1]');
	let title = await page.evaluate(el => el.innerText, handleTitle[0]);

	const handleArtist = await page.$x('/html/body/div[1]/div/div[2]/p[2]');
	let artist = await page.evaluate(el => el.innerText, handleArtist[0]);

	// console.log('Téléchargement du fichier blob...');
	await page.evaluate(async (data, artist, title) => {
		const link = document.createElement('a');
		link.href = data;
		link.download = `${artist} - ${title}.mp3`;
		document.body.appendChild(link);
		link.click();
		await new Promise(resolve => setTimeout(resolve, 1000));
		document.body.removeChild(link);
	}, songLink, artist, title);

	const downloadPath = `${downloadFolder}/${artist} - ${title}.mp3`; // Ajustez le chemin en fonction de votre configuration
	while (true) {
		try {
			await fs.promises.access(downloadPath, fs.constants.R_OK);
			break;
		} catch (error) {
			// Le fichier n'est pas encore disponible, attendez un peu et réessayez
			await new Promise(resolve => setTimeout(resolve, 250));
		}
	}
	// console.log('Fichier blob téléchargé.');

	// console.log('Fermeture du navigateur...');
	await browser.close();

	return `${artist} - ${title}`;
}

module.exports = downloadSong;
