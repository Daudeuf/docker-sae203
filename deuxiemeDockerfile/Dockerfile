# Utiliser l'image debian officielle comme image parent
FROM debian:latest

# Mode non-interactif pour la configuration de phpMyAdmin
ENV DEBIAN_FRONTEND=noninteractive

# Installation des services et des packages requis
RUN apt update
RUN apt -y install apache2
RUN apt -y install mariadb-server
RUN apt -y install php
RUN apt -y install libapache2-mod-php
RUN apt -y install php-mysql
RUN apt -y install supervisor

RUN apt clean

# Exécuter les commandes SQL dans le fichier init.sql une fois que la base de données MariaDB est démarré
COPY init.sql /tmp/
RUN /etc/init.d/mariadb start && \
    mysql -uroot < /tmp/init.sql

# Installation de phpMyAdmin
RUN echo "phpmyadmin phpmyadmin/dbconfig-install boolean true" | debconf-set-selections && \
    echo "phpmyadmin phpmyadmin/mysql/admin-pass password Mrvq6Y0LzzHoTjXteG2nMKK1" | debconf-set-selections && \
    echo "phpmyadmin phpmyadmin/mysql/app-pass password Mrvq6Y0LzzHoTjXteG2nMKK1" | debconf-set-selections && \
    echo "phpmyadmin phpmyadmin/reconfigure-webserver multiselect apache2" | debconf-set-selections && \
    apt-get -y install phpmyadmin

# Copie des fichiers
COPY ./html/* /var/www/html/

# Configuration de supervisor pour démarer apache et mariadb en parallèle
RUN mkdir -p /var/log/supervisor
RUN mkdir -p /etc/supervisor/conf.d

ADD supervisor.conf /etc/supervisor.conf

# Exposer le port 80
EXPOSE 80

# Couper le serveur MariaDB (fin de l'initialisation de la base de données)
RUN /etc/init.d/mariadb stop && \
    rm /tmp/init.sql

# Lancement du service supervisor au démarrage du conteneur
CMD ["supervisord", "-c", "/etc/supervisor.conf"]
