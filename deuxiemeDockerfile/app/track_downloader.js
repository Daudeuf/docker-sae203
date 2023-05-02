// track_downloader.js
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function downloadSong(link) {
	// console.log('Lancement du navigateur...');
	const downloadFolder = "/var/www/html/tracks"; // dossier de téléchargement souhaité
	const browser = await puppeteer.launch({
  		executablePath: '/usr/bin/google-chrome',
  		//args: ['--no-sandbox', '--single-process'],
		headless: false
	});
	const page = await browser.newPage();

	// Définir l'emplacement de téléchargement
	const client = await page.target().createCDPSession();
	await client.send('Page.setDownloadBehavior', {
		behavior: 'allow',
		downloadPath: downloadFolder,
	});
	
	// console.log('Navigation vers la page...');
	await page.goto('https://spotifydown.com/fr');
	
	await new Promise(resolve => setTimeout(resolve, 1000));
	console.log(await page.content());

	// console.log('Remplissage du champ de texte...');
	await page.type('.searchInput', link);

	// console.log('Clic sur le bouton...');
	await page.click('#__next > div > button');

	// console.log('Attente de l\'élément...');
	// await page.waitForSelector('#__next > div > div.mt-5.m-auto.text-center > div:nth-child(5) > div > div > div.flex.items-center.justify-end > button');
	// await page.waitForXPath('//*[@id="__next"]/div/div[2]/div[1]/div/div[2]/button');
	await page.waitForSelector('#__next > div > div.mt-5.m-auto.text-center > div.mb-12.grid.grid-cols-1.gap-3.m-auto > div > div.flex.items-center.justify-end > button')

	// console.log('Clic sur le deuxième bouton...');
	await page.click('#__next > div > div.mt-5.m-auto.text-center > div.mb-12.grid.grid-cols-1.gap-3.m-auto > div > div.flex.items-center.justify-end > button');

	// console.log('Attente de l\'élément à scraper...');
	await page.waitForSelector('#__next > div > div.mt-5.m-auto.text-center > div.my-5.grid.sm\:grid-cols-2.gap-4.sm\:gap-2 > a:nth-child(1)');

	// console.log('Récupération des données...');
	const data = await page.evaluate(() => {
		const element = document.querySelector('#__next > div > div.mt-5.m-auto.text-center');
		return element.querySelector('div.my-5.grid.sm\:grid-cols-2.gap-4.sm\:gap-2 > a:nth-child(1)').href;
	});

	const artiste = await page.evaluate(() => {
		const element = document.querySelector('#__next > div > div.mt-5.m-auto.text-center > p.text-submain.my-1');
		return element.textContent;
	});

	const titre = await page.evaluate(() => {
		const element = document.querySelector('#__next > div > div.mt-5.m-auto.text-center > p.font-bold.text-main.mt-2');
		return element.textContent;
	});

	// console.log('Téléchargement du fichier blob...');
	await page.evaluate(async (data, artiste, titre) => {
		const link = document.createElement('a');
		link.href = data;
		link.download = `${artiste} - ${titre}.mp3`;
		document.body.appendChild(link);
		link.click();
		await new Promise(resolve => setTimeout(resolve, 1000));
		document.body.removeChild(link);
	}, data, artiste, titre);

	// console.log('Fichier blob téléchargé.');

	// console.log('Fermeture du navigateur...');
	await browser.close();

	return `${artiste} - ${titre}`;
}

module.exports = downloadSong;
