-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 16, 2025 at 01:48 AM
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

-- --------------------------------------------------------

--
-- Table structure for table `accusation`
--

CREATE TABLE `accusation` (
  `id` int(11) NOT NULL,
  `justification` int(11) NOT NULL,
  `description` text NOT NULL,
  `status` enum('approved','rejected','pending') NOT NULL DEFAULT 'pending',
  `date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `accusation`
--

INSERT INTO `accusation` (`id`, `justification`, `description`, `status`, `date`) VALUES
(1, 4, 'sdas sdas sdas sdas sdas sdas sdas sdas sdas sdas sdas sdas sdas sdas sdas sdas sdas v v sdas sdas', 'pending', '2025-02-11 17:43:32'),
(4, 5, 'ifhxkgsitxxkglhxlhxlxhcjl', 'pending', '2025-02-14 23:44:19'),
(5, 7, '3lchhhhhhh', 'pending', '2025-02-16 00:34:17');

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
  `region` int(11) NOT NULL,
  `date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `claim`
--

INSERT INTO `claim` (`id`, `client`, `medicalservice`, `insurer`, `status`, `closed`, `claim_amount`, `region`, `date`) VALUES
(8, 4, 2, NULL, 'pending', 0, '20000', 3, '2025-02-11 15:36:54'),
(9, 1, 1, 2, 'paid', 1, '10000', 2, '2025-02-11 15:38:47'),
(10, 1, 1, 2, 'paid', 1, '5000', 2, '2025-02-11 15:40:09'),
(11, 1, 1, 2, 'rejected', 1, '7000', 2, '2025-02-11 15:45:27'),
(12, 1, 1, 2, 'paid', 1, '5800', 2, '2025-02-11 16:45:48'),
(13, 1, 1, 2, 'rejected', 1, '9000', 2, '2025-02-11 18:26:49'),
(14, 1, 1, 2, 'approved', 0, '8000', 2, '2025-02-11 19:15:12'),
(15, 1, 1, NULL, 'pending', 0, '5000', 2, '2025-02-11 19:17:58'),
(16, 1, 2, 4, 'paid', 1, '10000', 3, '2025-02-14 23:12:53'),
(17, 1, 2, 4, 'rejected', 1, '10000', 3, '2025-02-14 23:13:24'),
(18, 1, 1, NULL, 'pending', 0, '50000', 2, '2025-02-16 00:25:33'),
(19, 4, 1, 2, 'rejected', 1, '10000', 2, '2025-02-16 00:32:01');

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
  `name` varchar(255) NOT NULL,
  `date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `document`
--

INSERT INTO `document` (`id`, `claim`, `name`, `date`) VALUES
(1, 13, '1739298408479.jpg', '2025-02-11 18:26:49'),
(2, 13, '1739298408734.jpg', '2025-02-11 18:26:49'),
(3, 13, '1739298408872.jpg', '2025-02-11 18:26:49'),
(4, 13, '1739298409146.jpg', '2025-02-11 18:26:49'),
(5, 14, '1739301305375.jpg', '2025-02-11 19:15:12'),
(6, 14, '1739301307325.jpg', '2025-02-11 19:15:12'),
(7, 14, '1739301309923.jpg', '2025-02-11 19:15:12'),
(8, 15, '1739301478279.jpg', '2025-02-11 19:17:58'),
(9, 16, '1739574772327.jpg', '2025-02-14 23:12:53'),
(10, 16, '1739574772841.jpg', '2025-02-14 23:12:53'),
(11, 17, '1739574803672.jpg', '2025-02-14 23:13:24'),
(12, 17, '1739574804220.jpg', '2025-02-14 23:13:24'),
(13, 18, '1739665531867.jpg', '2025-02-16 00:25:33'),
(14, 19, '1739665921472.png', '2025-02-16 00:32:01');

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
(2, 'B', 'secure'),
(5, 'C', 'unclassified');

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
(2, 3, 2),
(4, 12, 1);

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
(4, 11, 'You d\'ont have the right documents', 1, '2025-02-11 15:46:04'),
(5, 13, 'nefhatli', 1, '2025-02-12 17:56:12'),
(6, 17, 'Are you sure you want to reject this claim Are you sure you want to reject this claim you sure you want to reject this claim you sure you want to reject this claim.', 0, '2025-02-14 23:16:24'),
(7, 19, 'no merci', 1, '2025-02-16 00:33:53');

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
(14, 9, '2000', 1, '2025-02-11 15:41:23'),
(15, 10, '1000', 1, '2025-02-11 15:44:00'),
(16, 12, '500', 1, '2025-02-11 16:47:04'),
(17, 12, '10', 1, '2025-02-11 16:47:27'),
(18, 12, '5', 1, '2025-02-11 16:47:31'),
(19, 12, '645', 1, '2025-02-12 12:30:07'),
(20, 14, '1000', 1, '2025-02-12 17:56:56'),
(21, 16, '1000', 1, '2025-02-14 23:21:00'),
(22, 16, '250', 1, '2025-02-14 23:42:00'),
(23, 16, '250', 1, '2025-02-14 23:42:06'),
(24, 16, '500', 1, '2025-02-14 23:42:26');

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
(1, 'Basic Health Insurance Plan', 150000, 20, 'Prescription medication', '2025-02-09 02:36:36'),
(2, 'Premium Health Insurance Plan', 500000, 10, 'Experimental treatments, prescription medication, non-prescription medication', '2025-02-09 02:37:21'),
(3, 'Family Plan', 1000000, 20, 'Experimental treatments, non-prescription medication.', '2025-02-09 02:39:46');

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
(3, 'Medea'),
(7, 'Bejaia');

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
(1, 'zynocodes', '$2b$10$g1R/LP8FrRmbXSVrRzD9k.qdsid3uWrmGTeqzRuMB2bG3TCfEIcTe', '0778295266', 'Zineeddine Boumrar', 3),
(2, 'codebykhaldi', '$2b$10$g1R/LP8FrRmbXSVrRzD9k.qdsid3uWrmGTeqzRuMB2bG3TCfEIcTe', '0563825360', 'Abdelmoumen Khaldi', 1),
(3, 'yassine2003', '$2b$10$g1R/LP8FrRmbXSVrRzD9k.qdsid3uWrmGTeqzRuMB2bG3TCfEIcTe', '0643187659', 'Yassine Hakem', 2),
(4, 'hind22', '$2b$10$g1R/LP8FrRmbXSVrRzD9k.qdsid3uWrmGTeqzRuMB2bG3TCfEIcTe', '0756321198', 'Benkssiour Hind', 2),
(5, 'amira22', '$2b$10$g1R/LP8FrRmbXSVrRzD9k.qdsid3uWrmGTeqzRuMB2bG3TCfEIcTe', '0543678294', 'Said Abdessameud Amira', 1),
(6, 'Dryassine22', '$2b$10$g1R/LP8FrRmbXSVrRzD9k.qdsid3uWrmGTeqzRuMB2bG3TCfEIcTe', '0765342984', 'Dr Yassine Hakem', 2),
(7, 'Drloukmane23', '$2b$10$g1R/LP8FrRmbXSVrRzD9k.qdsid3uWrmGTeqzRuMB2bG3TCfEIcTe', '0564328734', 'Dr Loukmane Nouar', 3),
(8, 'hopitalA1', '$2b$10$g1R/LP8FrRmbXSVrRzD9k.qdsid3uWrmGTeqzRuMB2bG3TCfEIcTe', '0654382976', 'Hopital A', 1),
(9, 'zino31', '$2b$10$g1R/LP8FrRmbXSVrRzD9k.qdsid3uWrmGTeqzRuMB2bG3TCfEIcTe', '078532589', 'ZINE EDDINE BOUMRAR', 3),
(12, 'zynocodes2', '$2b$10$g1R/LP8FrRmbXSVrRzD9k.qdsid3uWrmGTeqzRuMB2bG3TCfEIcTe', '0743278164', 'zinoxy', 3);

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
  ADD UNIQUE KEY `phone` (`phone`),
  ADD KEY `idx_user_region` (`region`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accusation`
--
ALTER TABLE `accusation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `claim`
--
ALTER TABLE `claim`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `client`
--
ALTER TABLE `client`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `document`
--
ALTER TABLE `document`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `grade`
--
ALTER TABLE `grade`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `insurer`
--
ALTER TABLE `insurer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `justification`
--
ALTER TABLE `justification`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `medicalservice`
--
ALTER TABLE `medicalservice`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `observation`
--
ALTER TABLE `observation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payment`
--
ALTER TABLE `payment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `policy`
--
ALTER TABLE `policy`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `region`
--
ALTER TABLE `region`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `accusation`
--
ALTER TABLE `accusation`
  ADD CONSTRAINT `accusation_ibfk_1` FOREIGN KEY (`justification`) REFERENCES `justification` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `admin`
--
ALTER TABLE `admin`
  ADD CONSTRAINT `admin_ibfk_1` FOREIGN KEY (`user`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `claim`
--
ALTER TABLE `claim`
  ADD CONSTRAINT `claim_ibfk_5669` FOREIGN KEY (`client`) REFERENCES `client` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `claim_ibfk_5670` FOREIGN KEY (`medicalservice`) REFERENCES `medicalservice` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `claim_ibfk_5671` FOREIGN KEY (`insurer`) REFERENCES `insurer` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `claim_ibfk_5672` FOREIGN KEY (`region`) REFERENCES `region` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `client`
--
ALTER TABLE `client`
  ADD CONSTRAINT `client_ibfk_137` FOREIGN KEY (`user`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `client_ibfk_138` FOREIGN KEY (`policy`) REFERENCES `policy` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `document`
--
ALTER TABLE `document`
  ADD CONSTRAINT `document_ibfk_1` FOREIGN KEY (`claim`) REFERENCES `claim` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `insurer`
--
ALTER TABLE `insurer`
  ADD CONSTRAINT `insurer_ibfk_317` FOREIGN KEY (`user`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `insurer_ibfk_318` FOREIGN KEY (`grade`) REFERENCES `grade` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

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
