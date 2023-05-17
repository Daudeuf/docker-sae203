SET NAMES 'utf8mb4';
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
	(' Flowers ', 'Miley Cyrus ', 'G7KNmW9a75Y', 'https://i.ytimg.com/vi/G7KNmW9a75Y/maxresdefault.jpg'),
	(' Me Gustas Tu ', 'Manu Chao ', 'rs6Y4kZ8qtw', 'https://i.ytimg.com/vi/rs6Y4kZ8qtw/sddefault.jpg'),
	(' RAMENEZ LA COUPE A LA MAISON', 'VEGEDREAM ', 'RHb5LKnnxLg', 'https://i.ytimg.com/vi/RHb5LKnnxLg/hqdefault.jpg?sqp=-oaymwEmCOADEOgC8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGGUgZShlMA8=&rs=AOn4CLCW9dfqxsXG5mfiJ5hLRBJ6h7R7Iw'),
	(' Party Rock Anthem ft. Lauren Bennett, GoonRock', 'LMFAO ', 'KQ6zr6kCPj8', 'https://i.ytimg.com/vi/KQ6zr6kCPj8/maxresdefault.jpg'),
	(' Pump It ', 'The Black Eyed Peas ', 'ZaI2IlHwmgQ', 'https://i.ytimg.com/vi/ZaI2IlHwmgQ/maxresdefault.jpg'),
	(' Turn Down for What', 'DJ Snake, Lil Jon ', 'HMUDVMiITOU', 'https://i.ytimg.com/vi/HMUDVMiITOU/maxresdefault.jpg'),
	(' Bâtiment ', 'Niska ', '1Jt9nLUA3KU', 'https://i.ytimg.com/vi/1Jt9nLUA3KU/maxresdefault.jpg'),
	(' BURGERS', 'LES JONES ', 'ws3WGmINlIg', 'https://i.ytimg.com/vi/ws3WGmINlIg/maxresdefault.jpg'),
	(' Cette année là  ', 'Claude François ', 'Oei7OKqadS8', 'https://i.ytimg.com/vi/Oei7OKqadS8/hqdefault.jpg'),
	(' Thriller ', 'Michael Jackson ', 'sOnqjkJTMaA', 'https://i.ytimg.com/vi/sOnqjkJTMaA/maxresdefault.jpg'),
	(' Akimbo ', 'Ziak ', 'cojoYPRcIJA', 'https://i.ytimg.com/vi/cojoYPRcIJA/maxresdefault.jpg');