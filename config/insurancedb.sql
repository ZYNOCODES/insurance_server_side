-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 20, 2024 at 11:45 PM
-- Server version: 10.4.25-MariaDB
-- PHP Version: 8.1.10

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
  `description` int(11) NOT NULL,
  `status` enum('approved','rejected','pending') NOT NULL DEFAULT 'pending',
  `date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `user` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `claim`
--

CREATE TABLE `claim` (
  `id` int(11) NOT NULL,
  `client` int(11) NOT NULL,
  `medicalservice` int(11) NOT NULL,
  `insurer` int(11) DEFAULT NULL,
  `policy` int(11) DEFAULT NULL,
  `status` enum('pending','approved','rejected','paid') NOT NULL DEFAULT 'pending',
  `closed` tinyint(1) NOT NULL DEFAULT 0,
  `claim_amount` varchar(55) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `client`
--

CREATE TABLE `client` (
  `id` int(11) NOT NULL,
  `user` int(11) NOT NULL,
  `age` varchar(55) NOT NULL,
  `address` varchar(255) NOT NULL,
  `job` varchar(55) NOT NULL,
  `married` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `document`
--

CREATE TABLE `document` (
  `id` int(11) NOT NULL,
  `claim` int(11) NOT NULL,
  `name` varchar(55) NOT NULL,
  `date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `insurer`
--

CREATE TABLE `insurer` (
  `id` int(11) NOT NULL,
  `user` int(11) NOT NULL,
  `grade` int(11) NOT NULL,
  `region` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `justification`
--

CREATE TABLE `justification` (
  `id` int(11) NOT NULL,
  `claim` int(11) NOT NULL,
  `description` text NOT NULL,
  `accused` tinyint(1) NOT NULL DEFAULT 0,
  `date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `medicalservice`
--

CREATE TABLE `medicalservice` (
  `id` int(11) NOT NULL,
  `user` int(11) NOT NULL,
  `type` enum('doctor','pharmacy','organisation') NOT NULL,
  `location` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `payment`
--

CREATE TABLE `payment` (
  `id` int(11) NOT NULL,
  `claim` int(11) NOT NULL,
  `amount` varchar(55) NOT NULL,
  `validation` tinyint(1) NOT NULL DEFAULT 0,
  `date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `policy`
--

CREATE TABLE `policy` (
  `id` int(11) NOT NULL,
  `name` varchar(55) NOT NULL,
  `limit` decimal(10,2) NOT NULL,
  `co_pay` decimal(5,2) NOT NULL,
  `exclusions` text NOT NULL,
  `timeframe` int(55) NOT NULL,
  `date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `region`
--

CREATE TABLE `region` (
  `id` int(11) NOT NULL,
  `name` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `username` varchar(55) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(55) NOT NULL,
  `fullname` varchar(55) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
  ADD KEY `idx_claim_policy` (`policy`);

--
-- Indexes for table `client`
--
ALTER TABLE `client`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_client_user` (`user`);

--
-- Indexes for table `document`
--
ALTER TABLE `document`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_document_claim` (`claim`);

--
-- Indexes for table `insurer`
--
ALTER TABLE `insurer`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_insurer_user` (`user`),
  ADD KEY `idx_insurer_region` (`region`);

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
  ADD PRIMARY KEY (`id`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `claim`
--
ALTER TABLE `claim`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `client`
--
ALTER TABLE `client`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `document`
--
ALTER TABLE `document`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `insurer`
--
ALTER TABLE `insurer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `justification`
--
ALTER TABLE `justification`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `medicalservice`
--
ALTER TABLE `medicalservice`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `observation`
--
ALTER TABLE `observation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payment`
--
ALTER TABLE `payment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `policy`
--
ALTER TABLE `policy`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `region`
--
ALTER TABLE `region`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

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
  ADD CONSTRAINT `fk_admin_user` FOREIGN KEY (`user`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `claim`
--
ALTER TABLE `claim`
  ADD CONSTRAINT `fk_claim_client` FOREIGN KEY (`client`) REFERENCES `client` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_claim_insurer` FOREIGN KEY (`insurer`) REFERENCES `insurer` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_claim_medicalservice` FOREIGN KEY (`medicalservice`) REFERENCES `medicalservice` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_claim_policy` FOREIGN KEY (`policy`) REFERENCES `policy` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `client`
--
ALTER TABLE `client`
  ADD CONSTRAINT `fk_client_user` FOREIGN KEY (`user`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `document`
--
ALTER TABLE `document`
  ADD CONSTRAINT `fk_document_claim` FOREIGN KEY (`claim`) REFERENCES `claim` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `insurer`
--
ALTER TABLE `insurer`
  ADD CONSTRAINT `fk_insurer_region` FOREIGN KEY (`region`) REFERENCES `region` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_insurer_user` FOREIGN KEY (`user`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `justification`
--
ALTER TABLE `justification`
  ADD CONSTRAINT `fk_justification_claim` FOREIGN KEY (`claim`) REFERENCES `claim` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `medicalservice`
--
ALTER TABLE `medicalservice`
  ADD CONSTRAINT `fk_medicalservice_user` FOREIGN KEY (`user`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `payment`
--
ALTER TABLE `payment`
  ADD CONSTRAINT `fk_payment_claim` FOREIGN KEY (`claim`) REFERENCES `claim` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
