# Docker SAÉ 2.03

Nous avons créé une plateforme permettant l'écoute de musique nommée Blackmusic. Ce projet a été réalisé par notre équipe avec pour objectif de fournir un service d'écoute de musique en utilisant l'API YouTube.

En plus de cela, cette image Docker inclut un serveur web pour accéder à une page web mettant à disposition l'application.
Séparément, il y a un accès à la base de données via phpMyAdmin.


## Installation

1. Assurez-vous d'avoir Docker installé sur votre machine. Si vous ne l'avez pas, vous pouvez le télécharger [ici](https://www.docker.com/products/docker-desktop).

2. Clonez le dépôt de l'application à partir de GitHub :

```shell
git clone https://github.com/Daudeuf/docker-sae203.git
```

3. Accédez au répertoire de l'application :

```shell
cd docker-sae203
```

4. Compilez l'image Docker à l'aide de la commande suivante :

```shell
docker build --platform linux/amd64 -t <nom-de-votre-image> .
```

Assurez-vous de remplacer `<nom-de-votre-image>` par le nom que vous souhaitez donner à votre image.

5. Pour lancer un conteneur à partir de votre image Docker, exécutez la commande suivante :

```shell
docker run --rm -p 80:80 -p 3000:3000 -d <nom-de-votre-image>
```

Assurez-vous de remplacer `<nom-de-votre-image>` par le nom que vous avez donné à votre image lors de la compilation.

Cette commande lance un conteneur Docker à partir de l'image `<nom-de-votre-image>`, en exposant le port 80 du conteneur sur le port 80 de l'hôte via l'option `-p 80:80`, ainsi que le port 3000 du conteneur sur le port 3000 de l'hôte via l'option `-p 3000:3000`. De plus, elle permet d'accéder à la page web hébergeant l'application. Le paramètre `-d` permet de lancer le conteneur en mode détaché (en arrière-plan) et le `-rm` permet de supprimer le conteneur lors de son arrêt.


|port|utilisation  |
|--|--|
| :80 | Apache |
| :3000 | Node js |
| :3306 | Mariadb |


## Utilisation

L'interface utilisateur de Blackmusic se compose des éléments suivants :

### Section Tendance
Cette section affiche les 4 titres les plus écoutés du moment. Elle met en avant les chansons populaires du moment et permet aux utilisateurs de découvrir les tendances musicales.

### File d'attente
La file d'attente affiche les titres en attente de lecture. Lorsque les utilisateurs ajoutent des chansons à la file d'attente, elles apparaissent ici. Cela permet aux utilisateurs de créer une liste de lecture personnalisée.

### Titres
Dans le reste de l'espace, tous les titres disponibles dans la bibliothèque de Blackmusic sont affichés. Les utilisateurs peuvent explorer cette section pour trouver de nouvelles chansons à écouter. Cela offre une vue d'ensemble de la collection musicale disponible sur la plateforme.

### Barre de recherche
La barre de recherche permet aux utilisateurs d'effectuer des recherches et d'ajouter de nouveaux titres à la file d'attente. Les utilisateurs peuvent saisir des mots-clés, des artistes ou des titres spécifiques pour trouver les chansons qu'ils souhaitent écouter.

### Lecteur média interactif
Blackmusic propose un lecteur média interactif qui permet aux utilisateurs de contrôler la lecture de la musique. Les fonctionnalités incluent la mise en pause, la reprise, la gestion du volume, etc. Les utilisateurs peuvent interagir avec le lecteur pour personnaliser leur expérience d'écoute.


## Remarque

Ce projet a été développé par notre équipe. Nous avons créé la plateforme Blackmusic pour offrir un service d'écoute de musique convivial en utilisant l'API YouTube. L'application Docker fournie ici permet de déployer et d'exécuter Blackmusic de manière efficace.

N'hésitez pas à personnaliser et à améliorer ce projet selon vos besoins.
Profitez pleinement de votre expérience d'écoute de musique avec Blackmusic !

Si vous avez des questions, n'hésitez pas à les poser.


## Problèmes potentiels

Lors de l'utilisation de cette application, il est possible que le chargement de la page web soit très long en raison de la connexion nécessaire pour accéder aux titres musicaux. De plus, il est possible que le logiciel soit instable sur certains systèmes, en particulier sur les machines Windows et Mac.

Il est également important de noter que lors de la mise en place de Docker pendant la SAÉ, nous avons rencontré des problèmes importants qui ont empêché l'utilisation de Docker à son potentiel maximum.
