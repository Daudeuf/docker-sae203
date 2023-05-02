// track_finder.js
const puppeteer = require('puppeteer');

async function findSpotifyTitle(searchTerm) {
	// console.log('Lancement du navigateur...');
	const browser = await puppeteer.launch({
  		args: ['--no-sandbox', '--disable-setuid-sandbox'],
		headless: false
	});
	const page = await browser.newPage();

	// Construire l'URL de recherche avec les termes de recherche
	const searchUrl = `https://open.spotify.com/search/${encodeURIComponent(searchTerm)}`;

	// Accédez à la page de recherche de Spotify avec les termes de recherche inclus dans l'URL
	// console.log('Accès à la page de recherche de Spotify...');
	await page.goto(searchUrl);

	// Attendre que les résultats de recherche soient chargés
	// console.log('Attente des résultats de recherche...');
	try {
		// #searchPage > div > div > section.QVIrLvegL13F9cEdMqfT.EbZrO5qZMclA_AaI3NV8 > div.iKwGKEfAfW7Rkx2_Ba4E > div > div > div > div:nth-child(2) > div:nth-child(1) > div > div.gvLrgQXBFVW6m9MscfFA > div.iCQtmPqY0QvkumAOuCjr > a
		await page.waitForSelector('.t_yrXoUO3qGsJS4Y6iXX', { timeout: 10000 }); // Augmenter le délai d'attente à 10 000 ms (10 s)
	} catch (error) {
		console.error('Erreur : délai d\'attente dépassé en attendant les résultats de recherche.');
		await browser.close();
		throw error;
	}

	// Récupérer le premier titre de la liste des résultats
	// console.log('Récupération du premier titre...');
	const title = await page.evaluate(() => {
		const firstResult = document.querySelector('.t_yrXoUO3qGsJS4Y6iXX');
		return firstResult.href;
	});

	// console.log('Fermeture du navigateur...');
	await browser.close();

	return title;
}

module.exports = findSpotifyTitle;
