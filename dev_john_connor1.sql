-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: May 22, 2023 at 02:30 AM
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
  `parentId` int NOT NULL,
  `neuronId` int NOT NULL,
  `stateId` int NOT NULL,
  `dataId` int NOT NULL,
  `isTrue` tinyint NOT NULL,
  `isFortified` tinyint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `chain`
--

INSERT INTO `chain` (`id`, `parentId`, `neuronId`, `stateId`, `dataId`, `isTrue`, `isFortified`) VALUES
(1, 1, 2, 1, 1, 1, 1),
(2, 1, 3, 1, 1, 0, 1),
(3, 3, 2, 2, 1, 1, 1),
(4, 3, 1, 2, 1, 0, 1),
(5, 2, 1, 3, 1, 1, 1),
(6, 2, 3, 3, 1, 0, 1),
(7, 3, 1, 1, 2, 1, 1),
(8, 3, 4, 1, 2, 0, 0),
(9, 4, 1, 1, 2, 1, 1),
(10, 4, 3, 1, 2, 0, 0),
(11, 1, 4, 1, 2, 1, 1),
(12, 1, 3, 1, 2, 0, 1),
(13, 2, 3, 4, 2, 1, 1),
(14, 2, 5, 4, 2, 0, 0),
(15, 5, 3, 4, 2, 1, 1),
(16, 5, 2, 4, 2, 0, 0),
(17, 3, 5, 4, 2, 1, 1),
(18, 3, 2, 4, 2, 0, 1);

-- --------------------------------------------------------

--
-- Table structure for table `data`
--

CREATE TABLE `data` (
  `id` int NOT NULL,
  `value` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `data`
--

INSERT INTO `data` (`id`, `value`) VALUES
(1, ''),
(2, 'PWD');

-- --------------------------------------------------------

--
-- Table structure for table `neuron`
--

CREATE TABLE `neuron` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL DEFAULT '',
  `x` int NOT NULL DEFAULT '0',
  `y` int NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `neuron`
--

INSERT INTO `neuron` (`id`, `name`, `x`, `y`) VALUES
(1, 'Мотивация', 0, -100),
(2, 'Пустое значение', 0, -160),
(3, 'Не пустое значение', -30, -130),
(4, 'Подготовить команду PWD', 30, -130),
(5, 'Выполнить команду PWD', 60, -160);

-- --------------------------------------------------------

--
-- Table structure for table `state`
--

CREATE TABLE `state` (
  `id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `state`
--

INSERT INTO `state` (`id`) VALUES
(1),
(2),
(3),
(4);

-- --------------------------------------------------------

--
-- Table structure for table `state_item`
--

CREATE TABLE `state_item` (
  `id` int NOT NULL,
  `stateId` int NOT NULL,
  `neuronId` int NOT NULL,
  `order` int NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `state_item`
--

INSERT INTO `state_item` (`id`, `stateId`, `neuronId`, `order`) VALUES
(1, 1, 1, 0),
(2, 1, 2, 1),
(3, 1, 1, 0),
(4, 1, 3, 1),
(5, 2, 3, 0),
(6, 2, 2, 1),
(7, 2, 3, 0),
(8, 2, 1, 1),
(9, 3, 2, 0),
(10, 3, 3, 1),
(11, 3, 2, 0),
(12, 3, 1, 1),
(13, 4, 4, 0),
(14, 4, 1, 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `chain`
--
ALTER TABLE `chain`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_8a0e2b74700bd8bf2d03b892b06` (`parentId`),
  ADD KEY `FK_a200036ef31ffbad6dab30b922c` (`neuronId`),
  ADD KEY `FK_43dded96ec635885ad9a9cbab30` (`stateId`),
  ADD KEY `FK_1a91f4fc2987a687aeb135b1fe2` (`dataId`);

--
-- Indexes for table `data`
--
ALTER TABLE `data`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_07530d8e01dd7333880f14137f` (`value`);

--
-- Indexes for table `neuron`
--
ALTER TABLE `neuron`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `state`
--
ALTER TABLE `state`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `state_item`
--
ALTER TABLE `state_item`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_6d4b49ade8d40a72bee14a6cf41` (`stateId`),
  ADD KEY `FK_c71b5964f46362df6e20aee5f50` (`neuronId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `chain`
--
ALTER TABLE `chain`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `data`
--
ALTER TABLE `data`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `neuron`
--
ALTER TABLE `neuron`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `state`
--
ALTER TABLE `state`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `state_item`
--
ALTER TABLE `state_item`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `chain`
--
ALTER TABLE `chain`
  ADD CONSTRAINT `FK_1a91f4fc2987a687aeb135b1fe2` FOREIGN KEY (`dataId`) REFERENCES `data` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_43dded96ec635885ad9a9cbab30` FOREIGN KEY (`stateId`) REFERENCES `state` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_8a0e2b74700bd8bf2d03b892b06` FOREIGN KEY (`parentId`) REFERENCES `neuron` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_a200036ef31ffbad6dab30b922c` FOREIGN KEY (`neuronId`) REFERENCES `neuron` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `state_item`
--
ALTER TABLE `state_item`
  ADD CONSTRAINT `FK_6d4b49ade8d40a72bee14a6cf41` FOREIGN KEY (`stateId`) REFERENCES `state` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_c71b5964f46362df6e20aee5f50` FOREIGN KEY (`neuronId`) REFERENCES `neuron` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
