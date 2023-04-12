# Utiliser l'image debian officielle comme image parent
FROM debian:latest

# Installer des services et des packages
RUN apt update
RUN apt install -y apache2
RUN apt install -y mariadb-server
RUN apt install -y php libapache2-mod-php php-mysql

RUN apt-get -y install supervisor && \
  mkdir -p /var/log/supervisor && \
  mkdir -p /etc/supervisor/conf.d

RUN apt clean

# Copie des fichiers
# COPY startup.sh startup.sh

# supervisor base configuration 
ADD supervisor.conf /etc/supervisor.conf

# Exposer le port 80
EXPOSE 80

# Lancer le service apache au démarrage du conteneur
# CMD ["/usr/sbin/apache2ctl","-DFOREGROUND"]

# Lancer le service supervisor au démarrage du conteneur
CMD ["supervisord", "-c", "/etc/supervisor.conf"]
