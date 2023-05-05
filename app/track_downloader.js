// track_downloader.js
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function downloadSong(link) {
	// Lancement du navigateur ...
	const downloadFolder = "/var/www/html/tracks"; // dossier de téléchargement souhaité

	const browser = await puppeteer.launch({ headless: false });
	const page = await browser.newPage();

	// Définir l'emplacement de téléchargement
	const client = await page.target().createCDPSession();
	await client.send('Page.setDownloadBehavior', {
		behavior: 'allow',
		downloadPath: downloadFolder,
	});
	
	// Affichage de la page
	await page.goto('https://spotifydown.com/fr');
	console.log("[DEBUG] -> 1");

	await new Promise(resolve => setTimeout(resolve, 3_000));
	console.log("[DEBUG] -> 2");

	// Champ de saisie
	await page.waitForXPath('//html/body/div/div/div[1]/input', {timeout: 15_000})
	await page.type('xpath//html/body/div/div/div[1]/input', link, {delay: 75});
	console.log("[DEBUG] -> 3");
	
	await new Promise(resolve => setTimeout(resolve, 3_000));
	console.log("[DEBUG] -> 4");
	
	// Premier bouton
	await page.waitForXPath('//html/body/div/div/button', {timeout: 15_000})
	await page.click('xpath//html/body/div/div/button');
	console.log("[DEBUG] -> 5");

	await new Promise(resolve => setTimeout(resolve, 3_000));
	console.log("[DEBUG] -> 6");

	// Deuxième bouton
	await page.waitForXPath('//html/body/div/div/div[2]/div[1]/div/div[2]/button', {timeout: 15_000})
	await page.click('xpath//html/body/div/div/div[2]/div[1]/div/div[2]/button');
	console.log("[DEBUG] -> 7");

	const elements = await page.$x('/html/body/div/div/div[2]/div[1]/div/div[2]/button');
	await elements[0].click();
	console.log("[DEBUG] -> 8");

	await new Promise(resolve => setTimeout(resolve, 3_000));
	console.log("[DEBUG] -> 9");

	// Attente lien et différents résultats
	await page.waitForSelector('xpath//html/body/div/div/div[2]/div[1]/a[1]', {timeout: 15_000});
	console.log("[DEBUG] -> 10");

	// Récupération des données ...
	const handleTitle = await page.$x('/html/body/div[1]/div/div[2]/p[1]');
	let title = await page.evaluate(el => el.innerText, handleTitle[0]);

	const handleArtist = await page.$x('/html/body/div[1]/div/div[2]/p[2]');
	let artist = await page.evaluate(el => el.innerText, handleArtist[0]);

	const handleLink = await page.$x('/html/body/div/div/div[2]/div[1]/a[1]');
	let songLink = await page.evaluate(el => el.href, handleLink[0]);

	// Téléchargement du fichier blob ...
	await page.evaluate(async (songLink, artist, title) =>
	{
		const linkBlob = document.createElement('a');
		linkBlob.href = songLink;
		linkBlob.download = `${artist} - ${title}.mp3`;
		document.body.appendChild(linkBlob);
		linkBlob.click();
		document.body.removeChild(linkBlob);
	}, songLink, artist, title);

	const downloadPath = `${downloadFolder}/${artist} - ${title}.mp3`;

	// Fichier blob téléchargé
	while (true)
	{
		try
		{
			await fs.promises.access(downloadPath, fs.constants.R_OK);
			break;
		}
		catch (error)
		{
			// Le fichier n'est pas encore disponible, attendez un peu et réessayez
			await new Promise(resolve => setTimeout(resolve, 250));
		}
	}

	// Fermeture du naviguateur
	await browser.close();

	return { artist, title };
}

module.exports = downloadSong;
