DROP TABLE IF EXISTS `Students`;
DROP TABLE IF EXISTS `Houses`;
DROP TABLE IF EXISTS `Professors`;
DROP TABLE IF EXISTS `Classes`;
DROP TABLE IF EXISTS `Enrolled`;

CREATE TABLE `Students` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fname` varchar(255) NOT NULL,
  `lname` varchar(255) DEFAULT NULL,
  `house` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `house` (`house`),
  CONSTRAINT `students_ibfk_1` FOREIGN KEY (`house`) REFERENCES `Houses` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE `Professors` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fname` varchar(255) NOT NULL,
  `lname` varchar(255) DEFAULT NULL,
  `house` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `house` (`house`),
  CONSTRAINT `professors_ibfk_1` FOREIGN KEY (`house`) REFERENCES `Houses` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE `Enrolled` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sid` int(11) NOT NULL,
  `cid` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `enrolled_ibfk_1` FOREIGN KEY (`sid`) REFERENCES `Students` (`id`) ON DELETE CASCADE,
  CONSTRAINT `enrolled_ibfk_2` FOREIGN KEY (`cid`) REFERENCES `Classes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE `Houses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

CREATE TABLE `Classes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `teacher` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `teacher` (`teacher`),
  CONSTRAINT `classes_ibfk_1` FOREIGN KEY (`teacher`) REFERENCES `Professors` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB;

INSERT INTO Houses (name)
VALUES ('Gryffindor'),
('Slytherin'),
('Hufflepuff'),
('Ravenclaw');

INSERT INTO Professors (fname, lname, house)
VALUES
('Minerva', 'McGonagall', (SELECT id FROM Houses WHERE name = 'Gryffindor')),
('Severus', 'Snape', (SELECT id FROM Houses WHERE name = 'Slytherin')),
('Pomona', 'Sprout', (SELECT id FROM Houses WHERE name = 'Hufflepuff')),
('Filius', 'Flitwick', (SELECT id FROM Houses WHERE name = 'Ravenclaw'));

INSERT INTO Students (fname, lname, house)
VALUES
('Harry', 'Potter', (SELECT id FROM Houses WHERE name = 'Gryffindor')),
('Ron', 'Weasley', (SELECT id FROM Houses WHERE name = 'Gryffindor')),
('Ginny', 'Weasley', (SELECT id FROM Houses WHERE name = 'Gryffindor')),
('Justin', 'Finch', (SELECT id FROM Houses WHERE name = 'Hufflepuff')),
('Draco', 'Malfoy', (SELECT id FROM Houses WHERE name = 'Slytherin')),
('Mandy', 'Brocklehurst', (SELECT id FROM Houses WHERE name = 'Ravenclaw'));

INSERT INTO Classes (name, teacher)
VALUES
('Potions', (SELECT id FROM Professors WHERE fname = 'Severus' AND lname = 'Snape')),
('Charms', (SELECT id FROM Professors WHERE fname = 'Filius' AND lname = 'Flitwick')),
('Transfiguration', (SELECT id FROM Professors WHERE fname = 'Minerva' AND lname = 'McGonagall')),
('Herbology', (SELECT id FROM Professors WHERE fname = 'Pomona' AND lname = 'Sprout'));

INSERT INTO Enrolled (sid, cid)
VALUES
((SELECT id FROM Students WHERE lname = 'Potter' AND fname = 'Harry'),(SELECT id FROM Classes WHERE name = 'Potions')),
((SELECT id FROM Students WHERE lname = 'Potter' AND fname = 'Harry'),(SELECT id FROM Classes WHERE name = 'Charms')),
((SELECT id FROM Students WHERE lname = 'Weasley' AND fname = 'Ron'),(SELECT id FROM Classes WHERE name = 'Potions')),
((SELECT id FROM Students WHERE lname = 'Weasley' AND fname = 'Ron'),(SELECT id FROM Classes WHERE name = 'Charms')),
((SELECT id FROM Students WHERE lname = 'Weasley' AND fname = 'Ginny'),(SELECT id FROM Classes WHERE name = 'Transfiguration'));