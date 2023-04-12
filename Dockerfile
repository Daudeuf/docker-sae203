# utiliser l'image de debian et installer apache, node js et npm

FROM debian:latest

RUN apt-get update && apt-get install -y apache2
RUN apt install -y mariadb-server

RUN apt-get -y install supervisor && \
  mkdir -p /var/log/supervisor && \
  mkdir -p /etc/supervisor/conf.d

# copy all files 
COPY ./app /var/www/html/

ADD supervisor.conf /etc/supervisor.conf

EXPOSE 80
EXPOSE 3306

# start apache & mariadb

CMD ["supervisord", "-c", "/etc/supervisor.conf"]






