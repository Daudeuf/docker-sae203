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
	
	await page.goto('https://spotifydown.com/fr');
	console.log("oui 1");

	await new Promise(resolve => setTimeout(resolve, 2000));

	await page.type('xpath//html/body/div/div/div[1]/input', link, {delay: 50});
	console.log("oui 2");
	

	await new Promise(resolve => setTimeout(resolve, 2000));
	
	
	// Attente du bouton pour avoir le lien
	await page.waitForXPath('//html/body/div/div/button', {timeout: 100_000})
	console.log("oui 3");

	await page.click('xpath//html/body/div/div/button');
	console.log("oui 4");

	console.log("gg chacal");
	
	await new Promise(resolve => setTimeout(resolve, 10_000));
	
	await page.waitForXPath('//html/body/div/div/div[2]/div[1]/div/div[2]/button', {timeout: 100_000})
	
	console.log("oui 5");
	
	// Click sur le bouton pour avoir le lien
	await page.click('xpath//html/body/div/div/div[2]/div[1]/div/div[2]/button');
	console.log("oui 6")

	const elements = await page.$x('/html/body/div/div/div[2]/div[1]/div/div[2]/button');
	await elements[0].click();

	console.log("gg chacal 2");

	await new Promise(resolve => setTimeout(resolve, 2000));

	// Attente du lien
	await page.waitForSelector('xpath//html/body/div/div/div[2]/div[1]/a[1]', {timeout: 100_000});
	console.log("oui 7")

	// console.log('Récupération des données...');
	const handleTitle = await page.$x('/html/body/div[1]/div/div[2]/p[1]');
	let title = await page.evaluate(el => el.innerText, handleTitle[0]);
	console.log("oui 8")

	const handleArtist = await page.$x('/html/body/div[1]/div/div[2]/p[2]');
	let artist = await page.evaluate(el => el.innerText, handleArtist[0]);

	console.log("oui 9")

	const handleLink = await page.$x('/html/body/div/div/div[2]/div[1]/a[1]');
	let songLink = await page.evaluate(el => el.href, handleLink[0]);

	console.log("oui 10")

	// console.log('Téléchargement du fichier blob...');
	await page.evaluate(async (songLink, artist, title) => {
		const linkBlob = document.createElement('a');
		linkBlob.href = songLink;
		linkBlob.download = `${artist} - ${title}.mp3`;
		document.body.appendChild(linkBlob);
		linkBlob.click();
		document.body.removeChild(linkBlob);
	}, songLink, artist, title);

	const downloadPath = `${downloadFolder}/${artist} - ${title}.mp3`;

	// console.log('Fichier blob téléchargé');
	while (true) {
		try {
			await fs.promises.access(downloadPath, fs.constants.R_OK);
			break;
		} catch (error) {
			// Le fichier n'est pas encore disponible, attendez un peu et réessayez
			await new Promise(resolve => setTimeout(resolve, 250));
		}
	}

	// Fermeture du naviguateur
	await browser.close();

	return `${artist} - ${title}`;
}

module.exports = downloadSong;
