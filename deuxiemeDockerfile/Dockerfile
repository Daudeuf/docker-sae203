# Utiliser l'image debian officielle comme image parent
FROM debian:latest

# Installer des services et des packages
RUN apt update
RUN apt install -y apache2
RUN apt install -y mariadb-server
RUN apt install -y php libapache2-mod-php php-mysql

RUN apt clean

# Copier les fichiers de l'hôte vers l'image
COPY ./startup.sh /

# COPY ./html /var/www/html
# COPY ./mariadb_install.sql /home/debian

ENTRYPOINT ["/startup.sh"]

# Exposer le port 80
EXPOSE 80

# Lancer le service apache au démarrage du conteneur
CMD ["/usr/sbin/apache2ctl","-DFOREGROUND"]
