# docker-sae203

Ceci est une image Docker qui permet d'héberger une application qui permet de chercher des titres de chansons à partir d'une suite de mots. Cette application utilise Node.js et Puppeteer pour naviguer sur un site web et trouver les titres de chansons pertinents. Elle inclut également l'environnement graphique Xvfb pour permettre l'utilisation de Puppeteer sans affichage graphique. Une fois le titre de la chanson trouvé, l'application télécharge le fichier audio et le rend disponible à l'utilisateur.

En plus de cela, cette image Docker inclut un serveur web pour accéder à une page web mettant à disposition l'application.

## Installation

1. Assurez-vous d'avoir Docker installé sur votre machine. Si vous ne l'avez pas, vous pouvez le télécharger [ici](https://www.docker.com/products/docker-desktop).

2. Clonez le repository de l'application à partir de GitHub :

```
git clone https://github.com/Daudeuf/docker-sae203.git
```

3. Accédez au répertoire de l'application :

```
cd utilisation-docker-sae203
```

4. Compilez l'image Docker à l'aide de la commande suivante :

```
docker build --platform linux/amd64 -t <nom-de-votre-image> .
```

Assurez-vous de remplacer `<nom-de-votre-image>` par le nom que vous souhaitez donner à votre image.

## Utilisation

Pour lancer un conteneur à partir de votre image Docker, exécutez la commande suivante :

```
docker run --rm --cap-add=SYS_ADMIN -p 80:80 -p 3000:3000 -d <nom-de-votre-image>
```

Assurez-vous de remplacer `<nom-de-votre-image>` par le nom que vous avez donné à votre image lors de la compilation.

Cette commande lance un conteneur Docker à partir de l'image `<nom-de-votre-image>`, en lui donnant accès à certaines fonctionnalités système via l'option `--cap-add=SYS_ADMIN`, en exposant le port 80 du conteneur sur le port 80 de l'hôte via l'option `-p 80:80`, ainsi que le port 3000 du conteneur sur le port 3000 de l'hôte via l'option `-p 3000:3000`. De plus, elle permet d'accéder à la page web hébergeant l'application. Le paramètre `-d` permet de lancer le conteneur en mode détaché (en arrière-plan).

## Problèmes potentiels

Lors de l'utilisation de cette application, il est possible que le chargement de la page web soit très long en raison de la connexion nécessaire pour télécharger les titres de chansons. De plus, il est possible que le logiciel soit instable sur certains systèmes, en particulier sur les machines Windows et Mac.

Il est également important de noter que lors de la mise en place de Docker pendant la SAE, nous avons rencontré des problèmes importants qui ont empêché l'utilisation de Docker à son potentiel maximum.