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

INSERT INTO `tracks` (`titre`, `artiste`, `lien`) VALUES 
('Flowers', 'Miley Cyrus', 'https://open.spotify.com/track/0yLdNVWF3Srea0uzk55zFn'),
('Me Gustas Tu', 'Manu Chao', 'https://open.spotify.com/track/6b37xrsNCWYIUphFBazqD6'),
('Ramenez la coupe à la maison', 'Vegedream', 'https://open.spotify.com/track/45eY7Qi2PDUs8WJEhjGWdN'),
('Party Rock Anthem', 'LMFAO', 'https://open.spotify.com/track/7mitXLIMCflkhZiD34uEQI'),
('Pump It', 'Black Eyed Peas', 'https://open.spotify.com/track/2ygMBIctKIAfbEBcT9065L'),
('Turn Down For What', 'Dj Snake, Lil Jon', 'https://open.spotify.com/track/67awxiNHNyjMXhVgsHuIrs'),
('Bâtiment', 'Niska', 'https://open.spotify.com/track/7FF6HRsQlc0CtfAbLmrEGX'),
('Burgers', 'Les Jones', 'https://open.spotify.com/track/6KuGgTwvTa7A5WEKubUD4g'),
('Cette année-là', 'Claude François', 'https://open.spotify.com/track/3R4rbnUNQKpKo588EFOqTl'),
('Thriller', 'Michael Jackson', 'https://open.spotify.com/track/3S2R0EVwBSAVMd5UMgKTL0'),
('Akimbo', 'Ziak', 'https://open.spotify.com/track/4Btg1zMSYU2iJ0mQGQGokv');