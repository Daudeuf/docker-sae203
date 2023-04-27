# docker-sae203

Image Docker pour un site internet ressemblant à Spotify permettant de chercher des titres de chansons à partir d'une suite de mots. Cette application utilise Node.js et Puppeteer pour naviguer sur le site de Spotify et trouver les titres de chansons pertinents. Elle inclut également l'environnement graphique Xvfb pour permettre l'utilisation de Puppeteer sans affichage graphique. Une fois le titre de la chanson trouvé, l'application télécharge le fichier audio et le rend disponible à l'utilisateur. Cette image est destinée à être utilisée comme conteneur Docker pour héberger l'application.

## Compilation

Pour compiler l'image Docker, exécutez la commande suivante :

```
docker build -t nom-de-l-image .
```

Assurez-vous de remplacer `nom-de-l-image` par le nom que vous souhaitez donner à votre image.

## Utilisation

Pour lancer un conteneur à partir de votre image Docker, exécutez la commande suivante :

```
docker run --rm --cap-add=SYS_ADMIN -p 80:80 -p 3000:3000 nom-de-l-image
```

Assurez-vous de remplacer `nom-de-l-image` par le nom que vous avez donné à votre image lors de la compilation.

Cette commande lance un conteneur Docker à partir de l'image `nom-de-l-image`, en lui donnant accès à certaines fonctionnalités système via l'option `--cap-add=SYS_ADMIN`, en exposant le port 80 du conteneur sur le port 80 de l'hôte via l'option `-p 80:80`, ainsi que le port 3000 du conteneur sur le port 3000 de l'hôte via l'option `-p 3000:3000`. Le paramètre `--rm` indique à Docker de supprimer le conteneur lorsqu'il s'arrête.
