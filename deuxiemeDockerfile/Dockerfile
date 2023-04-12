# Utiliser l'image debian officielle comme image parent
FROM debian:latest

# Installer des services et des packages
RUN apt update
RUN apt install -y apache2
RUN apt install -y mariadb-server
RUN apt clean
#RUN /etc/init.d/mariadb start

# Copier les fichiers de l'hôte vers l'image
# COPY ./html /var/www/html
#COPY ./mariadb_install.sql /home/debian

# Exposer le port 80
EXPOSE 80

# Lancer le service apache au démarrage du conteneur
CMD ["/etc/init.d/mariadb", "start;/usr/sbin/apache2ctl","-DFOREGROUND"]
