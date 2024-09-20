-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Apr 18, 2020 at 02:11 PM
-- Server version: 10.1.28-MariaDB
-- PHP Version: 7.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `alemi`
--

-- --------------------------------------------------------

--
-- Table structure for table `drug_types`
--

CREATE TABLE `drug_types` (
  `id` int(11) NOT NULL,
  `type` varchar(100) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `userid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `drug_types`
--

INSERT INTO `drug_types` (`id`, `type`, `created_at`, `updated_at`, `userid`) VALUES
(2, 'Syrup', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 0),
(3, 'Iontment', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 0),
(4, 'Drop', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 0),
(5, 'Serom', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 0),
(6, 'Solution', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 0),
(7, 'Soup', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 0),
(9, 'Ampoule', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 0),
(11, 'Capsule', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 0),
(12, 'Shampoo', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 0),
(13, 'Cream', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 0),
(17, 'guil', '2018-05-28 11:23:25', '0000-00-00 00:00:00', 13),
(22, 'Tablet', '2018-05-30 08:57:04', '0000-00-00 00:00:00', 13),
(24, 'pense', '2020-02-25 11:21:28', '0000-00-00 00:00:00', 49),
(26, 'Suppositor', '2020-04-15 11:18:38', '0000-00-00 00:00:00', 55),
(27, 'Vial', '2020-04-17 09:32:09', '0000-00-00 00:00:00', 55),
(28, 'Tube', '2020-04-18 08:17:46', '0000-00-00 00:00:00', 55),
(29, 'Sachet', '2020-04-18 08:17:55', '0000-00-00 00:00:00', 55),
(30, 'Powder', '2020-04-18 08:29:48', '0000-00-00 00:00:00', 55),
(31, 'Lotion', '2020-04-18 08:35:25', '0000-00-00 00:00:00', 55),
(32, 'Spray', '2020-04-18 08:37:09', '0000-00-00 00:00:00', 55);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `drug_types`
--
ALTER TABLE `drug_types`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `drug_types`
--
ALTER TABLE `drug_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
