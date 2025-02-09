-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 09, 2025 at 05:09 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `insurancedb`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `DropPhoneIndexes` ()   BEGIN
    DECLARE i INT DEFAULT 14;
    DECLARE index_name VARCHAR(50);

    WHILE i <= 21 DO
        SET index_name = CONCAT('phone_', i);
        SET @sql = CONCAT('ALTER TABLE `user` DROP INDEX `', index_name, '`');
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
        SET i = i + 1;
    END WHILE;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `accusation`
--

CREATE TABLE `accusation` (
  `id` int(11) NOT NULL,
  `justification` int(11) NOT NULL,
  `description` int(11) NOT NULL,
  `status` enum('approved','rejected','pending') NOT NULL DEFAULT 'pending',
  `date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `user` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id`, `user`) VALUES
(1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `claim`
--

CREATE TABLE `claim` (
  `id` int(11) NOT NULL,
  `client` int(11) NOT NULL,
  `medicalservice` int(11) NOT NULL,
  `insurer` int(11) DEFAULT NULL,
  `status` enum('pending','approved','rejected','paid') DEFAULT 'pending',
  `closed` tinyint(1) DEFAULT 0,
  `claim_amount` varchar(255) NOT NULL,
  `region` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `claim`
--

INSERT INTO `claim` (`id`, `client`, `medicalservice`, `insurer`, `status`, `closed`, `claim_amount`, `region`) VALUES
(1, 1, 1, 1, 'paid', 0, '5000', 2),
(3, 1, 1, 2, 'rejected', 1, '10000', 2),
(4, 4, 1, NULL, 'pending', 0, '100', 2),
(5, 4, 2, NULL, 'pending', 0, '1000', 3),
(6, 4, 3, NULL, 'pending', 0, '20000', 1);

-- --------------------------------------------------------

--
-- Table structure for table `client`
--

CREATE TABLE `client` (
  `id` int(11) NOT NULL,
  `user` int(11) NOT NULL,
  `age` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `job` varchar(255) NOT NULL,
  `married` tinyint(1) DEFAULT 0,
  `policy` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `client`
--

INSERT INTO `client` (`id`, `user`, `age`, `address`, `job`, `married`, `policy`) VALUES
(1, 4, '22', 'Quartier DJR N3', 'student', 0, 1),
(2, 5, '22', 'Quartier Birkhadem N42', 'student', 0, 2),
(4, 9, '31', 'gjhdhc', 'bhcfj', 1, 3);

-- --------------------------------------------------------

--
-- Table structure for table `document`
--

CREATE TABLE `document` (
  `id` int(11) NOT NULL,
  `claim` int(11) NOT NULL,
  `name` varchar(55) NOT NULL,
  `date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `grade`
--

CREATE TABLE `grade` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `exclusions` enum('secure','confidential','unclassified') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `grade`
--

INSERT INTO `grade` (`id`, `name`, `exclusions`) VALUES
(1, 'A', 'confidential'),
(2, 'B', 'unclassified');

-- --------------------------------------------------------

--
-- Table structure for table `insurer`
--

CREATE TABLE `insurer` (
  `id` int(11) NOT NULL,
  `user` int(11) NOT NULL,
  `grade` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `insurer`
--

INSERT INTO `insurer` (`id`, `user`, `grade`) VALUES
(1, 2, 1),
(2, 3, 2);

-- --------------------------------------------------------

--
-- Table structure for table `justification`
--

CREATE TABLE `justification` (
  `id` int(11) NOT NULL,
  `claim` int(11) NOT NULL,
  `description` text NOT NULL,
  `accused` tinyint(1) NOT NULL DEFAULT 0,
  `date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `justification`
--

INSERT INTO `justification` (`id`, `claim`, `description`, `accused`, `date`) VALUES
(1, 3, 'rejected your claim because you are not providing the necessary documents', 0, '2025-02-09 13:41:22');

-- --------------------------------------------------------

--
-- Table structure for table `medicalservice`
--

CREATE TABLE `medicalservice` (
  `id` int(11) NOT NULL,
  `user` int(11) NOT NULL,
  `type` enum('doctor','pharmacy','organisation') NOT NULL DEFAULT 'organisation',
  `location` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `medicalservice`
--

INSERT INTO `medicalservice` (`id`, `user`, `type`, `location`) VALUES
(1, 6, 'doctor', 'Ouled aiche N43'),
(2, 7, 'pharmacy', 'Rue d\'alger N43'),
(3, 8, 'organisation', 'Rue d\'alger N43');

-- --------------------------------------------------------

--
-- Table structure for table `observation`
--

CREATE TABLE `observation` (
  `id` int(11) NOT NULL,
  `fullname` varchar(55) NOT NULL,
  `age` varchar(55) NOT NULL,
  `description` text NOT NULL,
  `payment` varchar(55) NOT NULL,
  `date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payment`
--

CREATE TABLE `payment` (
  `id` int(11) NOT NULL,
  `claim` int(11) NOT NULL,
  `amount` varchar(255) NOT NULL,
  `validation` tinyint(1) DEFAULT 0,
  `date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payment`
--

INSERT INTO `payment` (`id`, `claim`, `amount`, `validation`, `date`) VALUES
(1, 1, '1000', 0, '2025-02-09 13:42:47'),
(2, 1, '1000', 0, '2025-02-09 13:43:16'),
(3, 1, '1000', 0, '2025-02-09 13:43:18'),
(6, 1, '1000', 0, '2025-02-09 13:48:16'),
(7, 1, '1000', 0, '2025-02-09 13:48:18');

-- --------------------------------------------------------

--
-- Table structure for table `policy`
--

CREATE TABLE `policy` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `limit` decimal(10,0) NOT NULL,
  `co_pay` decimal(10,0) NOT NULL,
  `exclusions` text NOT NULL,
  `date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `policy`
--

INSERT INTO `policy` (`id`, `name`, `limit`, `co_pay`, `exclusions`, `date`) VALUES
(1, 'Basic Health Insurance Plan', 15000, 20, 'Prescription medication', '2025-02-09 02:36:36'),
(2, 'Premium Health Insurance Plan', 50000, 10, 'Experimental treatments, prescription medication, non-prescription medication', '2025-02-09 02:37:21'),
(3, 'Family Plan', 100000, 20, 'Experimental treatments, non-prescription medication.', '2025-02-09 02:39:46');

-- --------------------------------------------------------

--
-- Table structure for table `region`
--

CREATE TABLE `region` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `region`
--

INSERT INTO `region` (`id`, `name`) VALUES
(1, 'Alger'),
(2, 'Blida'),
(3, 'Medea');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `fullname` varchar(255) NOT NULL,
  `region` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `username`, `password`, `phone`, `fullname`, `region`) VALUES
(1, 'zynocodes', '$2b$10$4MIvpragNPncW.6UO6nCaeznNlAunQcUFhFv0PyFzJ8laokidy/FW', '0778295266', 'Zineeddine Boumrar', 3),
(2, 'codebykhaldi', '$2b$10$yf.6JL2zSmasbEwf4bQHt.O46/9GiH0tjsxnkIyx07tD1BOlUvGW2', '0563825360', 'Abdelmoumen Khaldi', 1),
(3, 'yassine2003', '$2b$10$E9iEjEoy48lN8uo98TH39uCdj0FKPdwmHwegq89G42vh60PyluMMu', '0643187659', 'Yassine Hakem', 2),
(4, 'hind22', '$2b$10$ToSTeeuVIJp7URFSXzWDJeumMGAb3lNxymV.pYDtHw3tI3aSIUgua', '0756321198', 'Benkssiour Hind', 2),
(5, 'amira22', '$2b$10$HJODWEHAyNFSLJdO7NAJOO1MajgYOdUR19mEFJjg483hi9TYXFO4G', '0543678294', 'Said Abdessameud Amira', 1),
(6, 'Dryassine22', '$2b$10$CTsz793H7OasrTbZIBdT9e9/Syh17tj0xtNAVJE4DwhBYhF9S17.i', '0765342984', 'Dr Yassine Hakem', 2),
(7, 'Drloukmane23', '$2b$10$haBVlYFlXA486/.NC8YK0uv2/Q4KtZNu5aAIsrFm39wA/vUZTlDeS', '0564328734', 'Dr Loukmane Nouar', 3),
(8, 'hopitalA1', '$2b$10$eY.J3tqW/YJjuLf2l1fiBOAhkScRUcbjhrJYPJsSCbuRwjZrPo6z6', '0654382976', 'Hopital A', 1),
(9, 'zino31', '$2b$10$sy7s.Xd8GxjedMiqDGRf9u0VnWYx.QHjpwjSVGLqdKMQLNCzEhh7q', '078532589', 'ZINE EDDINE BOUMRAR', 3);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accusation`
--
ALTER TABLE `accusation`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_accusation_ujustification` (`justification`);

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_admin_user` (`user`);

--
-- Indexes for table `claim`
--
ALTER TABLE `claim`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_claim_client` (`client`),
  ADD KEY `idx_claim_insurer` (`insurer`),
  ADD KEY `idx_claim_medicalservice` (`medicalservice`),
  ADD KEY `idx_claim_region` (`region`);

--
-- Indexes for table `client`
--
ALTER TABLE `client`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_client_user` (`user`),
  ADD KEY `policy` (`policy`);

--
-- Indexes for table `document`
--
ALTER TABLE `document`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_document_claim` (`claim`);

--
-- Indexes for table `grade`
--
ALTER TABLE `grade`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `insurer`
--
ALTER TABLE `insurer`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_insurer_user` (`user`),
  ADD KEY `idx_insurer_grade` (`grade`);

--
-- Indexes for table `justification`
--
ALTER TABLE `justification`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_justification_claim` (`claim`);

--
-- Indexes for table `medicalservice`
--
ALTER TABLE `medicalservice`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_medicalservice_user` (`user`);

--
-- Indexes for table `observation`
--
ALTER TABLE `observation`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `payment`
--
ALTER TABLE `payment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_payment_claim` (`claim`);

--
-- Indexes for table `policy`
--
ALTER TABLE `policy`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `region`
--
ALTER TABLE `region`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `password` (`password`),
  ADD UNIQUE KEY `phone` (`phone`),
  ADD KEY `idx_user_region` (`region`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accusation`
--
ALTER TABLE `accusation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `claim`
--
ALTER TABLE `claim`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `client`
--
ALTER TABLE `client`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `document`
--
ALTER TABLE `document`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `grade`
--
ALTER TABLE `grade`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `insurer`
--
ALTER TABLE `insurer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `justification`
--
ALTER TABLE `justification`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `medicalservice`
--
ALTER TABLE `medicalservice`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `observation`
--
ALTER TABLE `observation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payment`
--
ALTER TABLE `payment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `policy`
--
ALTER TABLE `policy`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `region`
--
ALTER TABLE `region`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `accusation`
--
ALTER TABLE `accusation`
  ADD CONSTRAINT `fk_accusation_justification` FOREIGN KEY (`justification`) REFERENCES `justification` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `admin`
--
ALTER TABLE `admin`
  ADD CONSTRAINT `admin_ibfk_1` FOREIGN KEY (`user`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `claim`
--
ALTER TABLE `claim`
  ADD CONSTRAINT `claim_ibfk_1267` FOREIGN KEY (`client`) REFERENCES `client` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `claim_ibfk_1268` FOREIGN KEY (`medicalservice`) REFERENCES `medicalservice` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `claim_ibfk_1269` FOREIGN KEY (`insurer`) REFERENCES `insurer` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `claim_ibfk_1270` FOREIGN KEY (`region`) REFERENCES `region` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `client`
--
ALTER TABLE `client`
  ADD CONSTRAINT `client_ibfk_991` FOREIGN KEY (`user`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `client_ibfk_992` FOREIGN KEY (`policy`) REFERENCES `policy` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `document`
--
ALTER TABLE `document`
  ADD CONSTRAINT `fk_document_claim` FOREIGN KEY (`claim`) REFERENCES `claim` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `insurer`
--
ALTER TABLE `insurer`
  ADD CONSTRAINT `insurer_ibfk_695` FOREIGN KEY (`user`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `insurer_ibfk_696` FOREIGN KEY (`grade`) REFERENCES `grade` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `justification`
--
ALTER TABLE `justification`
  ADD CONSTRAINT `justification_ibfk_1` FOREIGN KEY (`claim`) REFERENCES `claim` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `medicalservice`
--
ALTER TABLE `medicalservice`
  ADD CONSTRAINT `medicalservice_ibfk_1` FOREIGN KEY (`user`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `payment`
--
ALTER TABLE `payment`
  ADD CONSTRAINT `payment_ibfk_1` FOREIGN KEY (`claim`) REFERENCES `claim` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `user_ibfk_1` FOREIGN KEY (`region`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `user_ibfk_2` FOREIGN KEY (`region`) REFERENCES `region` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
