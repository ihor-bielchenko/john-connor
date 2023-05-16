-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: May 15, 2023 at 02:42 AM
-- Server version: 8.0.33-0ubuntu0.22.04.1
-- PHP Version: 8.1.2-1ubuntu2.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dev_john_connor1`
--

-- --------------------------------------------------------

--
-- Table structure for table `chain`
--

CREATE TABLE `chain` (
  `id` int NOT NULL,
  `neuronId` int NOT NULL,
  `dataId` int NOT NULL,
  `name` varchar(255) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `chain`
--

INSERT INTO `chain` (`id`, `neuronId`, `dataId`, `name`) VALUES
(1, 3, 1, 'Пустое значение'),
(2, 4, 1, 'Не пустое значение');

-- --------------------------------------------------------

--
-- Table structure for table `chain_item`
--

CREATE TABLE `chain_item` (
  `id` int NOT NULL,
  `chainId` int NOT NULL,
  `neuronId` int NOT NULL,
  `order` int NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `chain_item`
--

INSERT INTO `chain_item` (`id`, `chainId`, `neuronId`, `order`) VALUES
(1, 1, 1, 0),
(2, 1, 2, 1),
(3, 2, 1, 0),
(4, 2, 3, 1);

-- --------------------------------------------------------

--
-- Table structure for table `data`
--

CREATE TABLE `data` (
  `id` int NOT NULL,
  `value` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `data`
--

INSERT INTO `data` (`id`, `value`) VALUES
(1, '');

-- --------------------------------------------------------

--
-- Table structure for table `neuron`
--

CREATE TABLE `neuron` (
  `id` int NOT NULL,
  `x` int NOT NULL DEFAULT '0',
  `y` int NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `neuron`
--

INSERT INTO `neuron` (`id`, `x`, `y`) VALUES
(1, 0, 0),
(2, 0, 10),
(3, -5, 5),
(4, -5, 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `chain`
--
ALTER TABLE `chain`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_a200036ef31ffbad6dab30b922c` (`neuronId`),
  ADD KEY `FK_1a91f4fc2987a687aeb135b1fe2` (`dataId`);

--
-- Indexes for table `chain_item`
--
ALTER TABLE `chain_item`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_e763ae53378ee8988e7a1310814` (`chainId`),
  ADD KEY `FK_71aa48cd3945039a6a525c19de8` (`neuronId`);

--
-- Indexes for table `data`
--
ALTER TABLE `data`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `neuron`
--
ALTER TABLE `neuron`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `chain`
--
ALTER TABLE `chain`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `chain_item`
--
ALTER TABLE `chain_item`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `data`
--
ALTER TABLE `data`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `neuron`
--
ALTER TABLE `neuron`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `chain`
--
ALTER TABLE `chain`
  ADD CONSTRAINT `FK_1a91f4fc2987a687aeb135b1fe2` FOREIGN KEY (`dataId`) REFERENCES `data` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_a200036ef31ffbad6dab30b922c` FOREIGN KEY (`neuronId`) REFERENCES `neuron` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `chain_item`
--
ALTER TABLE `chain_item`
  ADD CONSTRAINT `FK_71aa48cd3945039a6a525c19de8` FOREIGN KEY (`neuronId`) REFERENCES `neuron` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_e763ae53378ee8988e7a1310814` FOREIGN KEY (`chainId`) REFERENCES `chain` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
