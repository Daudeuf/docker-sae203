GRANT ALL PRIVILEGES ON *.* TO 'phpmyadmin'@'localhost' IDENTIFIED BY 'Mrvq6Y0LzzHoTjXteG2nMKK1';
SET PASSWORD FOR 'root'@'localhost' = PASSWORD('hsU3NRLttuCf5lp0TWYQ905U');
FLUSH PRIVILEGES;

CREATE DATABASE IF NOT EXISTS blackmusic;
USE blackmusic;

CREATE TABLE IF NOT EXISTS tracks (
	id INT NOT NULL AUTO_INCREMENT,
	titre VARCHAR(255) NOT NULL,
	artiste VARCHAR(255) NOT NULL,
	lien LONGTEXT,
	PRIMARY KEY (id)
);

INSERT INTO `tracks` (`titre`, `artiste`, `lien`) VALUES ('Flowers', 'Miley Cyrus', 'https://open.spotify.com/track/0yLdNVWF3Srea0uzk55zFn');