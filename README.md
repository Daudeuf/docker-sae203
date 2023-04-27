# docker-sae203

[Description courte de l'image Docker]

## Compilation

Pour compiler l'image Docker, exécutez la commande suivante :

```
docker build -t nom-de-l-image .
```

Assurez-vous de remplacer `nom-de-l-image` par le nom que vous souhaitez donner à votre image.

## Utilisation

Pour lancer un conteneur à partir de votre image Docker, exécutez la commande suivante :

```
docker run --rm --cap-add=SYS_ADMIN -p 80:80 nom-de-l-image
```

Assurez-vous de remplacer `nom-de-l-image` par le nom que vous avez donné à votre image lors de la compilation.

Cette commande lance un conteneur Docker à partir de l'image `nom-de-l-image`, en lui donnant accès à certaines fonctionnalités système via l'option `--cap-add=SYS_ADMIN`, et en exposant le port 80 du conteneur sur le port 80 de l'hôte via l'option `-p 80:80`. Le paramètre `--rm` indique à Docker de supprimer le conteneur lorsqu'il s'arrête.

## Licence

[Type de licence et éventuelles informations supplémentaires]
