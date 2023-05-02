# Utiliser l'image debian officielle comme image parent
FROM debian:latest

# Mode non-interactif pour la configuration de phpMyAdmin
ENV DEBIAN_FRONTEND=noninteractive

# Définir la variable d'environnement DISPLAY
ENV DISPLAY=:0

# Installation des services et des packages requis
RUN apt update
RUN apt -y install apache2
RUN apt -y install mariadb-server
RUN apt -y install php
RUN apt -y install libapache2-mod-php
RUN apt -y install php-mysql
RUN apt -y install gnupg
RUN apt -y install curl
RUN apt -y install wget
RUN apt -y install xvfb
RUN apt -y install supervisor

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
COPY ./html /var/www/html/

# Télécharger la clé GPG de Node.js et ajouter le référentiel de Node.js puis le télécharger
RUN curl -sL https://deb.nodesource.com/setup_18.x | bash -
RUN apt -y install nodejs

# Ajouter la clé GPG de Google pour leur référentiel APT
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor -o /usr/share/keyrings/googlechrome-linux-keyring.gpg
RUN echo "deb [arch=amd64 signed-by=/usr/share/keyrings/googlechrome-linux-keyring.gpg] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list

# Installez le dernier package de développement Chrome et les polices pour prendre en charge les principaux jeux de caractères (chinois, japonais, arabe, hébreu, thaï et quelques autres)
RUN apt update && \
    apt install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-khmeros fonts-kacst fonts-freefont-ttf libxss1 --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

RUN apt clean

# Préparation du serveur node.js
RUN groupadd -r nodeuser && useradd -rm -g nodeuser -G audio,video nodeuser
COPY ./app  /home/nodeuser/app/
COPY ./track_server.sh  /home/nodeuser/
RUN mkdir /var/www/html/tracks
RUN chown -R nodeuser:nodeuser /home/nodeuser && \
    chmod -R 777 /home/nodeuser && \
    chown -R nodeuser:nodeuser /var/www && \
    chmod -R g+w /var/www
USER nodeuser
RUN cd /home/nodeuser/app && npm install
USER root

# Configuration de supervisor pour démarer apache et mariadb en parallèle
RUN mkdir -p /var/log/supervisor
RUN mkdir -p /etc/supervisor/conf.d

ADD supervisor.conf /etc/supervisor.conf

# Exposer le port 80
EXPOSE 80
EXPOSE 3000

# Couper le serveur MariaDB (fin de l'initialisation de la base de données)
RUN /etc/init.d/mariadb stop && \
    rm /tmp/init.sql

# Lancement du service supervisor au démarrage du conteneur
CMD ["supervisord", "-c", "/etc/supervisor.conf"]
