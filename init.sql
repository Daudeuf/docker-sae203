GRANT ALL PRIVILEGES ON *.* TO 'phpmyadmin'@'localhost' IDENTIFIED BY 'Mrvq6Y0LzzHoTjXteG2nMKK1';
SET PASSWORD FOR 'root'@'localhost' = PASSWORD('hsU3NRLttuCf5lp0TWYQ905U');
FLUSH PRIVILEGES;

CREATE DATABASE IF NOT EXISTS blackmusic;
USE blackmusic;

CREATE TABLE IF NOT EXISTS tracks (
	id      INT NOT NULL AUTO_INCREMENT,
	titre   VARCHAR(255) NOT NULL,
	artiste VARCHAR(255) NOT NULL,
	videoId LONGTEXT,
	image   LONGTEXT,
	view    INT NOT NULL DEFAULT 0,

	PRIMARY KEY (id)
);

INSERT INTO `tracks` (`titre`, `artiste`, `videoId`, `image`) VALUES
	('Seinen', 'Ziak', 'CY5I7VUrWos', 'https://i.ytimg.com/vi/CY5I7VUrWos/maxresdefault.jpg'),
	('Shonen', 'Ziak', 'lUgNt0Azuls', 'https://i.ytimg.com/vi/lUgNt0Azuls/maxresdefault.jpg'),
	('Freestyle LVL UP 2', 'Ninho', '7ij8Qj4JLjI', 'https://i.ytimg.com/vi/7ij8Qj4JLjI/maxresdefault.jpg'),
	('Jolie Go', 'Shay', 'bc-614DU_sg', 'https://i.ytimg.com/vi/bc-614DU_sg/maxresdefault.jpg'),
	('Quatre', 'Ziak', 'PMnsFOebYPc', 'https://i.ytimg.com/vi/PMnsFOebYPc/maxresdefault.jpg'),
	('BAILAR CONTIGO', 'Black Eyed Peas', 'heihCpHHjbA', 'https://i.ytimg.com/vi/heihCpHHjbA/maxresdefault.jpg');