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
#RUN wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add -
#RUN echo "deb [arch=amd64 signed-by=/usr/share/keyrings/googlechrome-linux-keyring.gpg] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list

# Installez le dernier package de développement Chrome et les polices pour prendre en charge les principaux jeux de caractères (chinois, japonais, arabe, hébreu, thaï et quelques autres)
#RUN apt update
#RUN apt install -y google-chrome-stable libxss1 --no-install-recommends
# RUN rm -rf /var/lib/apt/lists/*

RUN apt-get update && apt-get install -y \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libatspi2.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libcurl3-gnutls \
    libcurl3-nss \
    libcurl4 \
    #libcurl3 \
    libdbus-1-3 \
    libdrm2 \
    libexpat1 \
    libgbm1 \
    libglib2.0-0 \
    libgtk-3-0 \
    #libgtk-4-1 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libvulkan1 \
    libx11-6 \
    libxcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxkbcommon0 \
    libxrandr2

RUN apt-get install -y wget
RUN wget -q https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
RUN apt-get install ./google-chrome-stable_current_amd64.deb

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
