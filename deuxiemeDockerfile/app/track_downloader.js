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
	
	// TEST
	const handle1 = await page.$x('/html/body/div/div/div[1]/input');
	const res1 = await page.evaluate(el => el.innerHTML, handle1[0]);
	console.log(await res1.jsonValue());

	const handle2 = await page.$x('/html/body/div/div/button');
	const res2 = await page.evaluate(el => el.innerHTML, handle2[0]);
	console.log(await res2.jsonValue());
	// TEST

	await page.type('xpath//html/body/div/div/div[1]/input', link);
	await page.click('xpath//html/body/div/div/button');
	
	await new Promise(resolve => setTimeout(resolve, 15_000));
	
	// TEST
	const handle1 = await page.$x('/html/body/div/div/div[1]/input');
	const res1 = await page.evaluate(el => el.innerHTML, handle1[0]);
	console.log(await res1.jsonValue());

	const handle2 = await page.$x('/html/body/div/div/button');
	const res2 = await page.evaluate(el => el.innerHTML, handle2[0]);
	console.log(await res2.jsonValue());
	// TEST

	// Attente du bouton pour avoir le lien
	await page.waitForSelector('xpath//html/body/div/div/div[2]/div[1]/div/div[2]/button', {timeout: 100_000});
	
	// Click sur le bouton pour avoir le lien
	await page.click('xpath//html/body/div/div/div[2]/div[1]/div/div[2]/button');

	// Attente du lien
	await page.waitForSelector('xpath//html/body/div/div/div[2]/div[1]/a[1]', {timeout: 100_000});

	// console.log('Récupération des données...');
	const handleTitle = await page.$x('/html/body/div[1]/div/div[2]/p[1]');
	let title = await page.evaluate(el => el.innerText, handleTitle[0]);

	const handleArtist = await page.$x('/html/body/div[1]/div/div[2]/p[2]');
	let artist = await page.evaluate(el => el.innerText, handleArtist[0]);

	const handleLink = await page.$x('/html/body/div/div/div[2]/div[1]/a[1]');
	let songLink = await page.evaluate(el => el.href, handleLink[0]);

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

	// console.log('Fermeture du navigateur...');
	await browser.close();

	return `${artist} - ${title}`;
}

module.exports = downloadSong;
