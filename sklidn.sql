-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jul 09, 2026 at 04:17 AM
-- Server version: 8.0.30
-- PHP Version: 8.3.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sklidn`
--

-- --------------------------------------------------------

--
-- Table structure for table `activity_logs`
--

CREATE TABLE `activity_logs` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED DEFAULT NULL,
  `action` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `activity_logs`
--

INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `description`, `ip_address`, `user_agent`, `created_at`) VALUES
(1, 2, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-12 23:45:03'),
(2, 2, 'logout', 'User logged out', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-12 23:45:47'),
(3, 1, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-12 23:45:57'),
(4, 1, 'logout', 'User logged out', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-12 23:49:32'),
(5, 2, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-12 23:49:41'),
(6, 2, 'logout', 'User logged out', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-12 23:51:34'),
(7, 4, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-12 23:51:44'),
(8, 2, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-12 23:55:43'),
(9, 2, 'request_revision', 'Requested revision for: Final Project - Ahmad Fauzi', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-13 00:08:04'),
(10, 4, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-13 17:43:45'),
(11, 2, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-13 17:44:04'),
(12, 4, 'logout', 'User logged out', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-13 19:40:47'),
(13, 2, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-13 19:55:01'),
(14, 2, 'logout', 'User logged out', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-13 21:03:55'),
(15, 4, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-13 21:04:09'),
(16, 4, 'logout', 'User logged out', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-14 04:40:52'),
(17, 2, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-14 04:41:01'),
(18, 4, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-14 05:19:56'),
(19, 2, 'review_submission', 'Reviewed submission: Final Project - Ahmad Fauzi', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-14 05:40:57'),
(20, 4, 'logout', 'User logged out', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-14 05:44:22'),
(21, 4, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-14 05:45:34'),
(22, 2, 'logout', 'User logged out', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-14 06:26:42'),
(23, 4, 'logout', 'User logged out', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-14 06:34:03'),
(24, 2, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-14 06:34:18'),
(25, 2, 'logout', 'User logged out', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-14 07:05:17'),
(26, 2, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-04-23 20:39:09'),
(27, 2, 'logout', 'User logged out', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-04-23 20:40:16'),
(28, 1, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-04-23 20:40:39'),
(29, 1, 'update_user', 'Updated user: Pak Budi Santoso', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-04-23 20:42:11'),
(30, 1, 'logout', 'User logged out', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-04-23 20:42:18'),
(31, 2, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-04-23 20:42:31'),
(32, 2, 'logout', 'User logged out', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-04-23 20:44:43'),
(33, 9, 'register_google', 'New user registered via Google: Reyhan Nazera Rusmana', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-04-29 00:23:51'),
(34, 1, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-04-29 00:24:17'),
(35, 1, 'update_user', 'Updated user: Reyhan Nazera Rusmana', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-04-29 00:25:32'),
(36, 1, 'logout', 'User logged out', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-04-29 00:25:36'),
(37, 9, 'login_google', 'User logged in via Google', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-04-29 00:25:41'),
(38, 9, 'logout', 'User logged out', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-04-29 00:26:09'),
(39, 1, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-04-29 00:26:19'),
(40, 1, 'toggle_registration', 'Registration toggled to: false', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-04-29 00:33:10'),
(41, 1, 'toggle_registration', 'Registration toggled to: true', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-04-29 00:33:13'),
(42, 1, 'update_user', 'Updated user: Reyhan Nazera Rusmana', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-04-29 00:35:58'),
(43, 1, 'update_user', 'Updated user: Reyhan Nazera Rusmana', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-04-29 00:36:01'),
(44, 1, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-04-29 00:43:36'),
(45, 1, 'update_user', 'Updated user: Dewi Lestari', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-04-29 00:49:39'),
(46, 1, 'update_user', 'Updated user: Dewi Lestari', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-04-29 00:49:44'),
(47, 1, 'update_user', 'Updated user: Dewi Lestari', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-04-29 00:50:40'),
(48, 1, 'update_user', 'Updated user: Dewi Lestari', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-04-29 00:50:42'),
(49, 1, 'update_user', 'Updated user: Reyhan Nazera Rusmana', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-04-29 01:01:20'),
(50, 1, 'toggle_registration', 'Registration toggled to: false', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-04-29 04:23:01'),
(51, 1, 'logout', 'User logged out', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-04-29 04:23:07'),
(52, 2, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-04-29 04:23:39'),
(53, 2, 'logout', 'User logged out', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-04-29 04:25:32'),
(54, 2, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-04-29 04:25:39'),
(55, 2, 'logout', 'User logged out', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-04-29 04:25:45'),
(56, 4, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-04-29 04:25:53'),
(57, NULL, 'login_failed', 'Failed login attempt for: hacker_pro@attacker.net', '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.22621.4391', '2026-04-29 05:32:44'),
(58, NULL, 'login_failed', 'Failed login attempt for: hacker_pro@attacker.net', '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.22621.4391', '2026-04-29 05:32:45'),
(59, NULL, 'login_failed', 'Failed login attempt for: hacker_pro@attacker.net', '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.22621.4391', '2026-04-29 05:32:46'),
(60, 9, 'login_google', 'User logged in via Google', '127.0.0.1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', '2026-04-29 05:39:03'),
(61, 9, 'login_google', 'User logged in via Google', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-04-29 05:39:20'),
(62, 9, 'login_google', 'User logged in via Google', '127.0.0.1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', '2026-04-29 05:41:19'),
(63, 1, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-04-29 05:42:40'),
(64, 1, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-04-29 05:43:12'),
(65, 1, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.22621.4391', '2026-04-29 05:44:16'),
(66, 2, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.22621.4391', '2026-04-29 05:44:17'),
(67, 4, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.22621.4391', '2026-04-29 05:44:19'),
(68, 1, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-04-29 05:45:04'),
(69, 1, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-04-29 05:46:54'),
(70, 1, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-04-29 05:52:35'),
(71, 9, 'login_google', 'User logged in via Google', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-04-29 05:53:34'),
(72, 1, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-04-29 05:56:20'),
(73, 9, 'login_google', 'User logged in via Google', '127.0.0.1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', '2026-04-29 05:56:44'),
(74, 1, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', '2026-04-29 05:57:29'),
(75, 1, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', '2026-04-29 05:57:53'),
(76, 1, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', '2026-04-29 05:59:55'),
(77, 1, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', '2026-04-29 06:03:47'),
(78, 1, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', '2026-04-29 06:07:45'),
(79, 1, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', '2026-04-29 06:10:07'),
(80, 1, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-04-29 06:10:40'),
(81, 1, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1', '2026-04-29 06:11:13'),
(82, 1, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1', '2026-04-29 06:14:14'),
(83, 1, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1', '2026-04-29 06:16:43'),
(84, 1, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1', '2026-04-29 06:19:57'),
(85, 1, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', '2026-04-29 06:22:37'),
(86, 1, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', '2026-04-29 06:24:15'),
(87, 9, 'login_google', 'User logged in via Google', '127.0.0.1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', '2026-04-29 06:24:30'),
(88, 1, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1', '2026-04-29 06:27:13'),
(89, 10, 'register_google', 'New user registered via Google: Qoerbanesia', '127.0.0.1', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1', '2026-04-29 06:27:28'),
(90, 9, 'login_google', 'User logged in via Google', '127.0.0.1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', '2026-04-29 06:28:21'),
(91, 9, 'login_google', 'User logged in via Google', '127.0.0.1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', '2026-04-29 06:29:00'),
(92, 9, 'login_google', 'User logged in via Google', '127.0.0.1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', '2026-04-29 06:30:16'),
(93, 9, 'login_google', 'User logged in via Google', '127.0.0.1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', '2026-04-29 06:30:27'),
(94, 1, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', '2026-04-29 06:30:39'),
(95, 1, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1', '2026-04-29 06:33:34'),
(96, 9, 'login_google', 'User logged in via Google', '127.0.0.1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', '2026-04-29 06:34:06'),
(97, 9, 'login_google', 'User logged in via Google', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-04-29 06:36:05'),
(98, NULL, 'login_failed', 'Failed login attempt for: admin@skl.test', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-04-29 06:36:27'),
(99, NULL, 'login_failed', 'Failed login attempt for: admin@skl.test', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-04-29 06:36:29'),
(100, 1, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-04-29 06:36:37'),
(101, 9, 'login_google', 'User logged in via Google', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-04-29 06:38:25'),
(102, 9, 'logout', 'User logged out', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-04-29 06:39:05'),
(103, 1, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-04-29 06:39:13'),
(104, 1, 'update_user', 'Updated user: Qoerbanesia', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-04-29 06:39:33'),
(105, 1, 'logout', 'User logged out', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-04-29 06:40:43'),
(106, 1, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-04-29 06:43:54'),
(107, 10, 'login_google', 'User logged in via Google', '127.0.0.1', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1', '2026-04-29 06:44:12'),
(108, 10, 'login_google', 'User logged in via Google', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-04-29 06:47:36'),
(109, 10, 'logout', 'User logged out', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-04-29 06:47:41'),
(110, 1, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-04-29 07:01:27'),
(111, 1, 'logout', 'User logged out', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-04-29 07:02:56'),
(112, 9, 'login_google', 'User logged in via Google', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-05-06 18:59:19'),
(113, 9, 'logout', 'User logged out', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-05-06 18:59:25'),
(114, 1, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-16 21:09:23'),
(115, 1, 'update_settings', 'Updated system settings', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-16 21:10:03'),
(116, 9, 'login_google', 'User logged in via Google', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-16 21:25:07'),
(117, 9, 'logout', 'User logged out', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-16 21:32:17'),
(118, 1, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-16 21:32:32'),
(119, 1, 'logout', 'User logged out', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-16 21:33:49'),
(120, 9, 'login_google', 'User logged in via Google', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-16 21:33:54'),
(121, 9, 'login_google', 'User logged in via Google', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-16 21:51:28'),
(122, 9, 'login_google', 'User logged in via Google', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-16 22:18:09'),
(123, 9, 'login_google', 'User logged in via Google', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-16 22:35:02'),
(124, 9, 'logout', 'User logged out', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-16 22:42:38'),
(125, 1, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-16 22:42:45'),
(126, 1, 'update_settings', 'Updated system settings', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-16 22:48:34'),
(127, 1, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-16 22:59:07'),
(128, 1, 'update_user', 'Updated user: Qoerbanesia', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-16 23:10:30'),
(129, 1, 'logout', 'User logged out', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-16 23:10:42'),
(130, 9, 'login_google', 'User logged in via Google', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-16 23:10:48'),
(131, 9, 'logout', 'User logged out', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-16 23:11:05'),
(132, 2, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-16 23:11:16'),
(133, 4, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-16 23:17:30'),
(134, 9, 'login_google', 'User logged in via Google', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-16 23:28:28'),
(135, 9, 'request_revision', 'Requested revision for: Portofolio dan CV - Ahmad Fauzi', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-16 23:29:12'),
(136, 9, 'logout', 'User logged out', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-16 23:38:45'),
(137, 12, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.22621.4391', '2026-06-16 23:48:00'),
(138, 12, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-16 23:52:40'),
(139, 12, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-17 00:08:49'),
(140, 12, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-17 00:34:03'),
(141, 12, 'logout', 'User logged out', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-17 00:34:24'),
(142, 12, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-17 17:08:51'),
(143, 12, 'logout', 'User logged out', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-17 17:09:12'),
(144, NULL, 'login_failed', 'Failed login attempt for: test@test.com', '127.0.0.1', 'curl/8.12.1', '2026-06-17 22:01:39'),
(145, NULL, 'login_failed', 'Failed login attempt for: test@test.com', '127.0.0.1', 'curl/8.12.1', '2026-06-17 22:01:57'),
(146, NULL, 'login_failed', 'Failed login attempt for: test@test.com', '127.0.0.1', 'curl/8.12.1', '2026-06-17 22:05:07'),
(147, 9, 'login_google', 'User logged in via Google', '127.0.0.1', 'Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Mobile Safari/537.36', '2026-06-17 22:05:42'),
(148, 9, 'logout', 'User logged out', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-17 22:06:00'),
(149, 9, 'login_google', 'User logged in via Google', '127.0.0.1', 'Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Mobile Safari/537.36', '2026-06-17 22:25:06'),
(150, 9, 'logout', 'User logged out', '127.0.0.1', 'Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Mobile Safari/537.36', '2026-06-17 22:25:15'),
(151, 9, 'login_google', 'User logged in via Google', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-17 22:26:53'),
(152, 9, 'logout', 'User logged out', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-17 22:26:58'),
(153, 9, 'login_google', 'User logged in via Google', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-17 22:29:51'),
(154, 9, 'logout', 'User logged out', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-17 22:29:55'),
(155, 12, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-17 22:30:16'),
(156, 12, 'logout', 'User logged out', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-17 22:30:24'),
(157, NULL, 'login_failed', 'Failed login attempt for: admin@skl.test', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-23 06:22:45'),
(158, 1, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-23 06:23:55'),
(159, 1, 'backup_created', 'Manual backup created: backup-2026-06-23-1336.tar.gz', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-23 06:36:28'),
(160, 1, 'backup_created', 'Manual backup created: backup-2026-06-23-1338.tar.gz', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-23 06:38:44'),
(161, 1, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-23 06:39:01'),
(162, 1, 'backup_created', 'Manual backup created: backup-2026-06-23-1339.tar.gz', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-23 06:39:13'),
(163, 1, 'backup_deleted', 'Backup deleted: backup-2026-06-23-1340.tar.gz', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-23 06:41:35'),
(164, 1, 'backup_deleted', 'Backup deleted: backup-2026-06-23-1339.tar.gz', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-23 06:41:38'),
(165, 1, 'backup_deleted', 'Backup deleted: backup-2026-06-23-1338.tar.gz', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-23 06:41:41'),
(166, 1, 'backup_deleted', 'Backup deleted: backup-2026-06-23-1337.tar.gz', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-23 06:41:45'),
(167, 1, 'backup_deleted', 'Backup deleted: backup-2026-06-23-1335.tar.gz', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-23 06:41:48'),
(168, 1, 'backup_created', 'Manual backup created: backup-2026-06-23-1341.tar.gz', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-23 06:41:52'),
(169, 1, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-23 06:56:26'),
(170, 1, 'update_lock_settings', 'Lock settings updated', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-23 07:01:48'),
(171, 1, 'logout', 'User logged out', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-23 07:01:53'),
(172, 1, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-23 07:02:00'),
(173, 1, 'update_lock_settings', 'Lock settings updated', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-23 07:10:44'),
(174, 1, 'update_lock_settings', 'Lock settings updated', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-23 07:11:11'),
(175, 1, 'logout', 'User logged out', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-23 07:16:20'),
(176, 1, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-23 07:20:36'),
(177, 1, 'logout', 'User logged out', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-23 07:21:05'),
(178, 1, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-23 07:22:52'),
(179, 1, 'logout', 'User logged out', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-23 07:23:31'),
(180, 4, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-23 07:23:38'),
(181, 1, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-26 07:44:20'),
(182, 1, 'logout', 'User logged out', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-26 07:45:09'),
(183, 4, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-26 07:45:28'),
(184, 1, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-26 07:54:01'),
(185, 1, 'logout', 'User logged out', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-26 07:55:11'),
(186, 13, 'register_google', 'New user registered via Google: Reyhan Nazera Rusmana', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-26 07:55:23'),
(187, 4, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-26 07:55:33'),
(188, 4, 'logout', 'User logged out', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-26 07:55:39'),
(189, 9, 'login_google', 'User logged in via Google', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-26 07:55:49'),
(190, 4, 'logout', 'User logged out', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-26 07:55:57'),
(191, 4, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-26 07:56:12'),
(192, 9, 'chat_add_members', 'Added members to chat group #3', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-26 07:56:30'),
(193, 4, 'logout', 'User logged out', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-26 08:06:42'),
(194, 9, 'login_google', 'User logged in via Google', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-26 08:21:19'),
(195, 9, 'login_google', 'User logged in via Google', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-26 08:37:26'),
(196, 9, 'logout', 'User logged out', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-26 08:47:44'),
(197, 1, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-26 08:48:11'),
(198, 9, 'login_google', 'User logged in via Google', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-26 20:02:48'),
(199, 9, 'logout', 'User logged out', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-26 20:05:40'),
(200, 9, 'login_google', 'User logged in via Google', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-26 20:11:09'),
(201, 9, 'logout', 'User logged out', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-26 20:12:15'),
(202, 12, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-26 20:12:40'),
(203, 12, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-26 20:28:17'),
(204, 9, 'login_google', 'User logged in via Google', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-27 04:32:18'),
(205, 9, 'logout', 'User logged out', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-27 04:32:30'),
(206, 12, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-27 04:33:01'),
(207, 12, 'logout', 'User logged out', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-27 04:36:51'),
(208, 12, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-27 04:42:52'),
(209, 12, 'logout', 'User logged out', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-27 04:43:49'),
(210, 9, 'login_google', 'User logged in via Google', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-27 04:45:00'),
(211, 9, 'logout', 'User logged out', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-27 04:46:09'),
(212, 12, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-27 04:49:45'),
(213, 12, 'logout', 'User logged out', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-27 04:50:00'),
(214, 1, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-27 05:23:10'),
(215, 1, 'update_user', 'Updated user: Reyhan Nazera Rusmana', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-27 05:24:15'),
(216, 1, 'logout', 'User logged out', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-27 05:28:39'),
(217, 9, 'login_google', 'User logged in via Google', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-27 05:28:51'),
(218, 9, 'logout', 'User logged out', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-27 05:34:34'),
(219, 4, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-27 05:34:51'),
(220, 4, 'logout', 'User logged out', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-27 05:37:12'),
(221, 12, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-27 05:37:30'),
(222, 12, 'logout', 'User logged out', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-27 05:49:46'),
(223, 1, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-27 05:50:06'),
(224, 1, 'logout', 'User logged out', '127.0.0.1', 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Mobile Safari/537.36', '2026-06-27 05:56:27'),
(225, 9, 'login_google', 'User logged in via Google', '127.0.0.1', 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Mobile Safari/537.36', '2026-06-27 05:56:35'),
(226, 9, 'logout', 'User logged out', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-27 05:59:20'),
(227, 4, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-27 05:59:39'),
(228, 4, 'update_lock_settings', 'Lock settings updated', '127.0.0.1', 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Mobile Safari/537.36', '2026-06-27 06:05:00'),
(229, 4, 'logout', 'User logged out', '127.0.0.1', 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Mobile Safari/537.36', '2026-06-27 06:05:04'),
(230, 4, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Mobile Safari/537.36', '2026-06-27 06:05:25'),
(231, 4, 'logout', 'User logged out', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-27 06:09:50'),
(232, 12, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-27 06:10:09'),
(233, 12, 'logout', 'User logged out', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-27 06:10:32'),
(234, 1, 'login', 'User logged in', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-30 03:56:00'),
(235, 1, 'logout', 'User logged out', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-30 03:57:17'),
(236, 9, 'login_google', 'User logged in via Google', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-30 03:57:23'),
(237, 9, 'logout', 'User logged out', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-30 03:57:25'),
(238, 9, 'login_google', 'User logged in via Google', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-30 04:01:39'),
(239, 9, 'logout', 'User logged out', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-30 04:01:44'),
(240, 9, 'login_google', 'User logged in via Google', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-30 09:46:36'),
(241, 9, 'logout', 'User logged out', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-30 09:46:54');

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cache`
--

INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
('skl-project-cache-public_idn_stats', 'O:28:\"Illuminate\\Http\\JsonResponse\":11:{s:7:\"headers\";O:50:\"Symfony\\Component\\HttpFoundation\\ResponseHeaderBag\":5:{s:10:\"\0*\0headers\";a:3:{s:13:\"cache-control\";a:1:{i:0;s:17:\"no-cache, private\";}s:4:\"date\";a:1:{i:0;s:29:\"Sat, 27 Jun 2026 11:40:07 GMT\";}s:12:\"content-type\";a:1:{i:0;s:16:\"application/json\";}}s:15:\"\0*\0cacheControl\";a:0:{}s:23:\"\0*\0computedCacheControl\";a:2:{s:8:\"no-cache\";b:1;s:7:\"private\";b:1;}s:10:\"\0*\0cookies\";a:0:{}s:14:\"\0*\0headerNames\";a:3:{s:13:\"cache-control\";s:13:\"Cache-Control\";s:4:\"date\";s:4:\"Date\";s:12:\"content-type\";s:12:\"Content-Type\";}}s:10:\"\0*\0content\";s:77:\"{\"total_students\":7,\"total_schools\":1,\"total_audience\":\"300\",\"total_teams\":4}\";s:10:\"\0*\0version\";s:3:\"1.0\";s:13:\"\0*\0statusCode\";i:200;s:13:\"\0*\0statusText\";s:2:\"OK\";s:10:\"\0*\0charset\";N;s:7:\"\0*\0data\";s:77:\"{\"total_students\":7,\"total_schools\":1,\"total_audience\":\"300\",\"total_teams\":4}\";s:11:\"\0*\0callback\";N;s:18:\"\0*\0encodingOptions\";i:0;s:8:\"original\";a:4:{s:14:\"total_students\";i:7;s:13:\"total_schools\";i:1;s:14:\"total_audience\";s:3:\"300\";s:11:\"total_teams\";i:4;}s:9:\"exception\";N;}', 1782560707);

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `chat_groups`
--

CREATE TABLE `chat_groups` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `photo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `type` enum('personal','class_group','group') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'personal',
  `created_by` bigint UNSIGNED NOT NULL,
  `reference_id` bigint UNSIGNED DEFAULT NULL COMMENT 'ID referensi (student_group_id untuk class_group)',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `chat_groups`
--

INSERT INTO `chat_groups` (`id`, `name`, `photo`, `description`, `notes`, `type`, `created_by`, `reference_id`, `is_active`, `created_at`, `updated_at`) VALUES
(1, NULL, NULL, NULL, NULL, 'personal', 1, NULL, 1, '2026-06-16 21:21:50', '2026-06-16 21:21:50'),
(2, NULL, NULL, NULL, NULL, 'personal', 9, NULL, 1, '2026-06-16 21:34:14', '2026-06-16 21:34:14'),
(3, '9', 'chat-photos/FJw6YUT55YC5ZKobrPgRHt87nhWswVrZWmG5bxj5.png', NULL, NULL, 'group', 9, NULL, 1, '2026-06-16 21:54:50', '2026-06-16 22:04:04'),
(4, NULL, NULL, NULL, NULL, 'personal', 4, NULL, 1, '2026-06-26 07:53:09', '2026-06-26 07:53:09'),
(5, NULL, NULL, NULL, NULL, 'personal', 4, NULL, 1, '2026-06-26 07:54:30', '2026-06-26 07:54:30');

-- --------------------------------------------------------

--
-- Table structure for table `chat_group_members`
--

CREATE TABLE `chat_group_members` (
  `id` bigint UNSIGNED NOT NULL,
  `group_id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `joined_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_read_at` timestamp NULL DEFAULT NULL,
  `is_admin` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `chat_group_members`
--

INSERT INTO `chat_group_members` (`id`, `group_id`, `user_id`, `joined_at`, `last_read_at`, `is_admin`, `created_at`, `updated_at`) VALUES
(1, 1, 1, '2026-06-16 21:21:50', '2026-06-27 05:54:34', 1, '2026-06-16 21:21:50', '2026-06-27 05:54:34'),
(2, 1, 9, '2026-06-16 21:21:50', '2026-06-16 23:38:18', 0, '2026-06-16 21:21:50', '2026-06-16 23:38:18'),
(3, 2, 9, '2026-06-16 21:34:14', '2026-06-27 05:34:25', 1, '2026-06-16 21:34:14', '2026-06-27 05:34:25'),
(4, 2, 5, '2026-06-16 21:34:14', NULL, 0, '2026-06-16 21:34:14', '2026-06-16 21:34:14'),
(5, 3, 9, '2026-06-16 21:54:50', '2026-06-27 05:58:29', 1, '2026-06-16 21:54:50', '2026-06-27 05:58:29'),
(6, 3, 1, '2026-06-16 21:54:50', '2026-06-27 05:54:26', 0, '2026-06-16 21:54:50', '2026-06-27 05:54:26'),
(7, 3, 5, '2026-06-16 21:54:50', NULL, 0, '2026-06-16 21:54:50', '2026-06-16 21:54:50'),
(8, 4, 4, '2026-06-26 07:53:09', '2026-06-26 07:54:31', 0, '2026-06-26 07:53:09', '2026-06-26 07:54:31'),
(9, 4, 1, '2026-06-26 07:53:09', '2026-06-26 07:54:17', 0, '2026-06-26 07:53:09', '2026-06-26 07:54:17'),
(10, 5, 4, '2026-06-26 07:54:30', '2026-06-26 07:54:30', 0, '2026-06-26 07:54:30', '2026-06-26 07:54:30'),
(11, 5, 9, '2026-06-26 07:54:30', NULL, 0, '2026-06-26 07:54:30', '2026-06-26 07:54:30'),
(12, 3, 4, '2026-06-26 07:56:30', '2026-06-27 06:04:28', 0, '2026-06-26 07:56:30', '2026-06-27 06:04:28');

-- --------------------------------------------------------

--
-- Table structure for table `chat_messages`
--

CREATE TABLE `chat_messages` (
  `id` bigint UNSIGNED NOT NULL,
  `group_id` bigint UNSIGNED NOT NULL,
  `sender_id` bigint UNSIGNED NOT NULL,
  `message_type` enum('text','emoji','sticker','file','image') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'text',
  `message` text COLLATE utf8mb4_unicode_ci,
  `file_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file_size` bigint DEFAULT NULL,
  `mime_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sticker_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_pinned` tinyint(1) NOT NULL DEFAULT '0',
  `mentions` json DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_for` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `chat_messages`
--

INSERT INTO `chat_messages` (`id`, `group_id`, `sender_id`, `message_type`, `message`, `file_path`, `file_name`, `file_size`, `mime_type`, `sticker_id`, `is_pinned`, `mentions`, `is_deleted`, `deleted_at`, `deleted_for`, `created_at`, `updated_at`) VALUES
(1, 1, 9, 'sticker', '😡', NULL, NULL, NULL, NULL, 'angry', 0, NULL, 0, NULL, NULL, '2026-06-16 21:25:24', '2026-06-16 21:25:24'),
(2, 1, 9, 'image', 'null', 'chat-files/FRfJXIlsERaPDmm0466kxJtSjonusaJhGIq2H6vm.png', 'ChatGPT Image Jun 16, 2026, 08_26_07 PM.png', 1465365, 'image/png', NULL, 0, NULL, 0, NULL, NULL, '2026-06-16 21:25:42', '2026-06-16 21:25:42'),
(3, 1, 9, 'text', 'miaw', NULL, NULL, NULL, NULL, NULL, 0, NULL, 0, NULL, NULL, '2026-06-16 21:43:16', '2026-06-16 21:43:16'),
(4, 1, 9, 'image', 'miaw', 'chat-files/YRUT5xsKUrKEifgqrLJeKye2Rt6wMe7qt3Th2eGJ.png', 'ChatGPT Image Jun 16, 2026, 07_53_09 PM.png', 1720264, 'image/png', NULL, 0, NULL, 0, NULL, NULL, '2026-06-16 21:43:27', '2026-06-16 21:43:27'),
(5, 3, 9, 'text', '@Admin SKL om', NULL, NULL, NULL, NULL, NULL, 1, '[1]', 1, '2026-06-16 22:41:17', NULL, '2026-06-16 22:02:25', '2026-06-16 22:41:17'),
(6, 3, 9, 'text', 'cek', NULL, NULL, NULL, NULL, NULL, 1, NULL, 0, NULL, NULL, '2026-06-16 22:02:45', '2026-06-16 22:02:47'),
(7, 3, 9, 'image', 'null', 'chat-files/dy4MdqYk5SWzlpq1y4TFzzg7IKCrVmmiaPC3LlgN.png', 'ChatGPT Image Jun 16, 2026, 08_26_07 PM.png', 1465365, 'image/png', NULL, 0, NULL, 0, NULL, NULL, '2026-06-16 22:04:57', '2026-06-16 22:21:29'),
(8, 3, 9, 'image', NULL, 'chat-files/ZXCdjcQBF4BgTk1AYmYn15plM50LGqHPdJMdRddo.png', 'ChatGPT Image Jun 16, 2026, 07_41_40 PM.png', 2355788, 'image/png', NULL, 0, NULL, 0, NULL, NULL, '2026-06-16 22:22:51', '2026-06-16 22:22:51'),
(9, 3, 9, 'sticker', '😂', NULL, NULL, NULL, NULL, 'laugh', 0, NULL, 0, NULL, NULL, '2026-06-16 22:35:59', '2026-06-16 22:35:59'),
(10, 3, 9, 'sticker', '🥰', NULL, NULL, NULL, NULL, 'love', 0, NULL, 0, NULL, NULL, '2026-06-16 22:37:32', '2026-06-16 22:37:32'),
(11, 3, 1, 'text', 'miaw', NULL, NULL, NULL, NULL, NULL, 0, NULL, 0, NULL, NULL, '2026-06-16 22:43:00', '2026-06-16 22:43:00'),
(12, 1, 1, 'file', NULL, 'chat-files/afgySe1QBGp8oy2cBbzM3TZDvhfEOIX1JeQ3W4p0.pdf', 'Invoice 3084440490 (1).pdf', 56390, 'application/pdf', NULL, 0, NULL, 0, NULL, NULL, '2026-06-16 22:45:25', '2026-06-16 22:45:25'),
(13, 4, 4, 'sticker', '👽', NULL, NULL, NULL, NULL, 'alien', 0, NULL, 0, NULL, NULL, '2026-06-26 07:53:35', '2026-06-26 07:53:35'),
(14, 4, 1, 'text', 'nape lu', NULL, NULL, NULL, NULL, NULL, 0, NULL, 0, NULL, NULL, '2026-06-26 07:54:22', '2026-06-26 07:54:22'),
(15, 3, 4, 'text', 'helo guys', NULL, NULL, NULL, NULL, NULL, 0, NULL, 0, NULL, NULL, '2026-06-26 07:56:44', '2026-06-26 07:56:44'),
(16, 3, 9, 'text', 'halo', NULL, NULL, NULL, NULL, NULL, 0, NULL, 0, NULL, NULL, '2026-06-27 05:33:58', '2026-06-27 05:33:58'),
(17, 3, 4, 'text', 'cek', NULL, NULL, NULL, NULL, NULL, 0, NULL, 0, NULL, NULL, '2026-06-27 06:04:32', '2026-06-27 06:04:32');

-- --------------------------------------------------------

--
-- Table structure for table `checklist_reviews`
--

CREATE TABLE `checklist_reviews` (
  `id` bigint UNSIGNED NOT NULL,
  `submission_id` bigint UNSIGNED NOT NULL,
  `guru_id` bigint UNSIGNED NOT NULL,
  `checklist_item` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('pending','approved','rejected') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `catatan` text COLLATE utf8mb4_unicode_ci,
  `reviewed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `checklist_reviews`
--

INSERT INTO `checklist_reviews` (`id`, `submission_id`, `guru_id`, `checklist_item`, `status`, `catatan`, `reviewed_at`, `created_at`, `updated_at`) VALUES
(1, 1, 2, 'Flyer', 'approved', NULL, '2026-04-14 05:40:57', '2026-04-12 23:55:56', '2026-04-14 05:40:57'),
(2, 1, 2, 'Video', 'approved', NULL, '2026-04-14 05:40:57', '2026-04-12 23:55:56', '2026-04-14 05:40:57'),
(3, 2, 2, 'Flyer', 'pending', NULL, NULL, '2026-06-16 23:22:37', '2026-06-16 23:22:37'),
(4, 2, 2, 'Youtube', 'pending', NULL, NULL, '2026-06-16 23:22:37', '2026-06-16 23:22:37');

-- --------------------------------------------------------

--
-- Table structure for table `class_teacher`
--

CREATE TABLE `class_teacher` (
  `id` bigint UNSIGNED NOT NULL,
  `student_group_id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `class_teacher`
--

INSERT INTO `class_teacher` (`id`, `student_group_id`, `user_id`, `created_at`, `updated_at`) VALUES
(1, 1, 2, NULL, NULL),
(2, 1, 3, NULL, NULL),
(3, 1, 9, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint UNSIGNED NOT NULL,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `idn_school_visits`
--

CREATE TABLE `idn_school_visits` (
  `id` bigint UNSIGNED NOT NULL,
  `school_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` text COLLATE utf8mb4_unicode_ci,
  `visit_date` date DEFAULT NULL,
  `team_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `team_members` text COLLATE utf8mb4_unicode_ci,
  `total_audience` int NOT NULL DEFAULT '0',
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `idn_school_visits`
--

INSERT INTO `idn_school_visits` (`id`, `school_name`, `address`, `visit_date`, `team_name`, `team_members`, `total_audience`, `notes`, `created_at`, `updated_at`) VALUES
(1, 'SUKABUMI', 'CIOMAS', '2026-06-17', 'MIAW', 'Fadlan, Faisal', 300, NULL, '2026-06-17 00:09:51', '2026-06-17 00:09:51');

-- --------------------------------------------------------

--
-- Table structure for table `idn_students`
--

CREATE TABLE `idn_students` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nis` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `school` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `kelas` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `idn_students`
--

INSERT INTO `idn_students` (`id`, `name`, `nis`, `school`, `kelas`, `is_active`, `created_at`, `updated_at`) VALUES
(2, 'Faisal', '013123', 'IDN Boarding School', '7', 1, '2026-06-16 23:53:21', '2026-06-16 23:53:21'),
(3, 'Fadlan', '13123', 'IDN Boarding School', '8', 1, '2026-06-16 23:53:43', '2026-06-16 23:53:43');

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint UNSIGNED NOT NULL,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint UNSIGNED NOT NULL,
  `reserved_at` int UNSIGNED DEFAULT NULL,
  `available_at` int UNSIGNED NOT NULL,
  `created_at` int UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `lomba`
--

CREATE TABLE `lomba` (
  `id` bigint UNSIGNED NOT NULL,
  `nama_lomba` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tingkat` enum('sekolah','kecamatan','kabupaten','provinsi','nasional','internasional') COLLATE utf8mb4_unicode_ci NOT NULL,
  `kategori` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `penyelenggara` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lokasi` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `alamat` text COLLATE utf8mb4_unicode_ci,
  `tanggal_mulai` date DEFAULT NULL,
  `tanggal_selesai` date DEFAULT NULL,
  `deskripsi` text COLLATE utf8mb4_unicode_ci,
  `status_hasil` enum('belum_ada_hasil','juara','tidak_juara') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'belum_ada_hasil',
  `juara_ke` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `juara_ke_lainnya` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `total_tim` int NOT NULL DEFAULT '0',
  `total_peserta` int NOT NULL DEFAULT '0',
  `created_by` bigint UNSIGNED NOT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `lomba`
--

INSERT INTO `lomba` (`id`, `nama_lomba`, `tingkat`, `kategori`, `penyelenggara`, `lokasi`, `alamat`, `tanggal_mulai`, `tanggal_selesai`, `deskripsi`, `status_hasil`, `juara_ke`, `juara_ke_lainnya`, `total_tim`, `total_peserta`, `created_by`, `deleted_at`, `created_at`, `updated_at`) VALUES
(1, 'Pertamina', 'nasional', 'Lomba', 'Pertamina', 'Pertamina jakarta', 'Pertamina Jakarta', '2026-06-27', '2026-06-27', 'lomba pertamina jakarta', 'tidak_juara', NULL, NULL, 1, 2, 12, NULL, '2026-06-26 20:30:02', '2026-06-26 20:30:02');

-- --------------------------------------------------------

--
-- Table structure for table `lomba_foto`
--

CREATE TABLE `lomba_foto` (
  `id` bigint UNSIGNED NOT NULL,
  `lomba_id` bigint UNSIGNED NOT NULL,
  `file_path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `original_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file_size` int DEFAULT NULL,
  `urutan` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `lomba_foto`
--

INSERT INTO `lomba_foto` (`id`, `lomba_id`, `file_path`, `original_name`, `file_size`, `urutan`, `created_at`, `updated_at`) VALUES
(1, 1, 'lomba/6a3f43ba4adf4.webp', 'IMG_20260622_151022.jpg.jpeg', 4670252, 0, '2026-06-26 20:30:05', '2026-06-26 20:30:05');

-- --------------------------------------------------------

--
-- Table structure for table `lomba_pendamping`
--

CREATE TABLE `lomba_pendamping` (
  `id` bigint UNSIGNED NOT NULL,
  `lomba_id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `nama` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `jabatan` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `lomba_pendamping`
--

INSERT INTO `lomba_pendamping` (`id`, `lomba_id`, `user_id`, `nama`, `jabatan`, `created_at`, `updated_at`) VALUES
(1, 1, 9, 'Reyhan Nazera Rusmana', 'Guru', '2026-06-26 20:30:02', '2026-06-26 20:30:02');

-- --------------------------------------------------------

--
-- Table structure for table `lomba_peserta`
--

CREATE TABLE `lomba_peserta` (
  `id` bigint UNSIGNED NOT NULL,
  `lomba_tim_id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `nama` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nis` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `kelas` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `lomba_peserta`
--

INSERT INTO `lomba_peserta` (`id`, `lomba_tim_id`, `user_id`, `nama`, `nis`, `kelas`, `created_at`, `updated_at`) VALUES
(1, 1, 4, 'Ahmad Fauzi', '2024001', '9', '2026-06-26 20:30:02', '2026-06-26 20:30:02'),
(2, 1, 7, 'Dewi Lestari', '2024004', '7', '2026-06-26 20:30:02', '2026-06-26 20:30:02');

-- --------------------------------------------------------

--
-- Table structure for table `lomba_tim`
--

CREATE TABLE `lomba_tim` (
  `id` bigint UNSIGNED NOT NULL,
  `lomba_id` bigint UNSIGNED NOT NULL,
  `nama_tim` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `jenis_tim` enum('individu','beregu') COLLATE utf8mb4_unicode_ci NOT NULL,
  `jumlah_anggota` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `lomba_tim`
--

INSERT INTO `lomba_tim` (`id`, `lomba_id`, `nama_tim`, `jenis_tim`, `jumlah_anggota`, `created_at`, `updated_at`) VALUES
(1, 1, 'Kucing', 'beregu', 2, '2026-06-26 20:30:02', '2026-06-26 20:30:02');

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int UNSIGNED NOT NULL,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2024_01_01_000001_create_project_categories_table', 1),
(5, '2024_01_01_000002_create_project_requirements_table', 1),
(6, '2024_01_01_000003_create_project_submissions_table', 1),
(7, '2024_01_01_000004_create_submission_files_table', 1),
(8, '2024_01_01_000005_create_checklist_reviews_table', 1),
(9, '2024_01_01_000006_create_notifications_table', 1),
(10, '2024_01_01_000007_create_activity_logs_table', 1),
(11, '2024_01_01_000008_create_system_settings_table', 1),
(12, '2024_01_01_000010_add_category_id_to_project_submissions_table', 1),
(13, '2026_03_12_160819_create_personal_access_tokens_table', 1),
(14, '2026_03_13_042133_add_metadata_to_submission_files_table', 1),
(15, '2026_03_13_043355_create_student_groups_table', 1),
(16, '2026_03_13_044302_add_guru_id_to_project_categories_table', 1),
(17, '2026_03_19_161830_update_student_groups_relationships', 1),
(18, '2026_03_19_161952_create_class_teacher_table', 1),
(19, '2026_03_19_162550_update_project_requirements_for_dynamic_inputs', 1),
(20, '2026_03_19_162831_add_link_url_to_submission_files', 1),
(21, '2026_03_19_164248_add_instructions_to_project_requirements_table', 1),
(22, '2026_03_19_203739_add_specialty_to_users_table', 1),
(23, '2026_04_13_071147_add_slug_to_project_submissions_table', 2),
(24, '2026_04_14_041507_add_deadlines_to_project_categories_table', 3),
(25, '2026_04_29_072014_add_google_id_to_users_table', 4),
(26, '2026_04_29_123055_make_user_id_nullable_in_activity_logs_table', 5),
(27, '2026_06_17_000001_add_last_activity_at_to_users_table', 6),
(28, '2026_06_17_000002_create_chat_tables', 6),
(29, '2026_06_17_000003_add_group_type_to_chat_groups', 7),
(30, '2026_06_17_000004_add_chat_features_columns', 8),
(31, '2026_06_17_000005_add_group_admin_and_description', 9),
(32, '2026_06_17_000006_add_message_delete_columns', 10),
(33, '2026_06_17_000007_add_idn_role_to_users', 11),
(34, '2026_06_17_000008_create_idn_students_table', 11),
(35, '2026_06_17_000009_create_idn_school_visits_table', 11),
(36, '2026_06_23_000001_add_lock_to_users_table', 12),
(37, '2026_06_26_000001_create_student_incomes_table', 13),
(38, '2026_06_26_000002_add_file_path_to_student_incomes', 14),
(39, '2026_06_26_000003_add_permissions_to_users_table', 15),
(40, '2026_06_26_000004_create_lomba_tables', 16),
(41, '2026_06_26_000005_add_kepala_sekolah_role_to_users', 16);

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('info','success','warning','error') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'info',
  `is_read` tinyint(1) NOT NULL DEFAULT '0',
  `related_submission_id` bigint UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `title`, `message`, `type`, `is_read`, `related_submission_id`, `created_at`) VALUES
(1, 4, 'Kategori Project Baru', 'Guru Pak Budi Santoso telah membuat kategori project baru: \"Kategori Baru\". Silakan cek tugas Anda.', 'info', 1, NULL, '2026-04-12 23:50:19'),
(2, 5, 'Kategori Project Baru', 'Guru Pak Budi Santoso telah membuat kategori project baru: \"Kategori Baru\". Silakan cek tugas Anda.', 'info', 0, NULL, '2026-04-12 23:50:19'),
(3, 4, 'Perlu Revisi', 'Project Anda \"Final Project - Ahmad Fauzi\" perlu direvisi. Lihat catatan dari guru.', 'warning', 1, 1, '2026-04-13 00:08:04'),
(4, 4, 'Kategori Project Baru', 'Guru Pak Budi Santoso telah membuat kategori project baru: \"Kategori Baru\". Silakan cek tugas Anda.', 'info', 1, NULL, '2026-04-13 19:14:10'),
(5, 5, 'Kategori Project Baru', 'Guru Pak Budi Santoso telah membuat kategori project baru: \"Kategori Baru\". Silakan cek tugas Anda.', 'info', 0, NULL, '2026-04-13 19:14:10'),
(6, 4, 'Kategori Project Baru', 'Guru Pak Budi Santoso telah membuat kategori project baru: \"Kategori Baru\". Silakan cek tugas Anda.', 'info', 1, NULL, '2026-04-14 05:18:28'),
(7, 5, 'Kategori Project Baru', 'Guru Pak Budi Santoso telah membuat kategori project baru: \"Kategori Baru\". Silakan cek tugas Anda.', 'info', 0, NULL, '2026-04-14 05:18:28'),
(8, 4, 'Kategori Project Baru', 'Guru Pak Budi Santoso telah membuat kategori project baru: \"Kategori Baru\". Silakan cek tugas Anda.', 'info', 1, NULL, '2026-06-16 23:18:53'),
(9, 5, 'Kategori Project Baru', 'Guru Pak Budi Santoso telah membuat kategori project baru: \"Kategori Baru\". Silakan cek tugas Anda.', 'info', 0, NULL, '2026-06-16 23:18:53'),
(10, 4, 'Perlu Revisi', 'Project Anda \"Portofolio dan CV - Ahmad Fauzi\" perlu direvisi. Lihat catatan dari guru.', 'warning', 1, 2, '2026-06-16 23:29:12'),
(11, 4, 'Kategori Project Baru', 'Guru Reyhan Nazera Rusmana telah membuat kategori project baru: \"Kategori Baru\". Silakan cek tugas Anda.', 'info', 0, NULL, '2026-06-27 05:29:55'),
(12, 5, 'Kategori Project Baru', 'Guru Reyhan Nazera Rusmana telah membuat kategori project baru: \"Kategori Baru\". Silakan cek tugas Anda.', 'info', 0, NULL, '2026-06-27 05:29:55');

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint UNSIGNED NOT NULL,
  `name` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(4, 'App\\Models\\User', 4, 'auth-token', '5f41ad4f2c54faacbc344e8d6caf8efb200c785b8fd5a5bbfafea893fcb41cb9', '[\"*\"]', '2026-04-13 00:49:31', NULL, '2026-04-12 23:51:44', '2026-04-13 00:49:31'),
(5, 'App\\Models\\User', 2, 'auth-token', 'b376635392860377caf26dbd0ddcdc4cef187ca622b5c4feff7e95ca310873fa', '[\"*\"]', '2026-04-13 00:49:46', NULL, '2026-04-12 23:55:43', '2026-04-13 00:49:46'),
(8, 'App\\Models\\User', 2, 'auth-token', '6608823847d7798e39867754774c7d1dfd3476e6a8b2853a3bc725381d90f97f', '[\"*\"]', '2026-04-23 19:50:18', NULL, '2026-04-13 19:55:01', '2026-04-23 19:50:18'),
(20, 'App\\Models\\User', 1, 'auth-token', 'de2081e4f46330e431750f11f60acc2d4efd3d85f170a9628eb30175acb15898', '[\"*\"]', '2026-04-29 04:43:14', NULL, '2026-04-29 00:43:36', '2026-04-29 04:43:14'),
(23, 'App\\Models\\User', 4, 'auth-token', '699cb0bd49a83bff3d1ae07d3e5eb881cff606444b78c4860a19956e1fd58a83', '[\"*\"]', '2026-04-29 04:43:15', NULL, '2026-04-29 04:25:53', '2026-04-29 04:43:15'),
(24, 'App\\Models\\User', 9, 'access-token', 'd881b51404cc6859011e31af99c77c1c949c13c7e9179356a2aa17f39ce306fd', '[\"*\"]', NULL, '2026-04-29 05:54:02', '2026-04-29 05:39:02', '2026-04-29 05:39:02'),
(25, 'App\\Models\\User', 9, 'refresh-token', '347e125e6b50bf76438b90cdadab694d6511e987f33e1e52c09daa1680f22912', '[\"refresh\"]', NULL, '2026-05-06 05:39:03', '2026-04-29 05:39:03', '2026-04-29 05:39:03'),
(26, 'App\\Models\\User', 9, 'access-token', '14da4b9a9989ce36476ffa891a8dcc6c5e9fe3be8acb519629dbee9d0f9ad9c7', '[\"*\"]', NULL, '2026-04-29 05:54:20', '2026-04-29 05:39:20', '2026-04-29 05:39:20'),
(27, 'App\\Models\\User', 9, 'refresh-token', '5e68173c96b86a763fa5a74e550f53de51ff25953b0a81210d4e60f04a8aa388', '[\"refresh\"]', NULL, '2026-05-06 05:39:20', '2026-04-29 05:39:20', '2026-04-29 05:39:20'),
(28, 'App\\Models\\User', 9, 'access-token', '1328316fcc4c35efd1d744e96e1650addb02a096c06b81f06e114cee380a65b5', '[\"*\"]', NULL, '2026-04-29 05:56:19', '2026-04-29 05:41:19', '2026-04-29 05:41:19'),
(29, 'App\\Models\\User', 9, 'refresh-token', 'bd8c6eb135f2e5e3172f6838319ea709da4f8eb88c3ee244b00cd296f860b32d', '[\"refresh\"]', NULL, '2026-05-06 05:41:19', '2026-04-29 05:41:19', '2026-04-29 05:41:19'),
(30, 'App\\Models\\User', 1, 'access-token', '09198c94b84d663a2f77f7b22bb10ccd0feda9b9eaf99ebbfc841c4cf5b45943', '[\"*\"]', NULL, '2026-04-29 05:57:40', '2026-04-29 05:42:40', '2026-04-29 05:42:40'),
(31, 'App\\Models\\User', 1, 'refresh-token', 'd13e4711241b7c032a149a5f0edb0c034d40d7afca071a32eb23f0499ca86b40', '[\"refresh\"]', NULL, '2026-05-06 05:42:40', '2026-04-29 05:42:40', '2026-04-29 05:42:40'),
(32, 'App\\Models\\User', 1, 'access-token', '1b0a82f4dbe3c9b320450bc0482da3a7fe3129e66a3a5b0146cb279a99065237', '[\"*\"]', NULL, '2026-04-29 05:58:12', '2026-04-29 05:43:12', '2026-04-29 05:43:12'),
(33, 'App\\Models\\User', 1, 'refresh-token', 'e48aca0ae016923ea72322b47f3da2cef3bdc0701f0326e4eab36593d65d5f57', '[\"refresh\"]', NULL, '2026-05-06 05:43:12', '2026-04-29 05:43:12', '2026-04-29 05:43:12'),
(34, 'App\\Models\\User', 1, 'access-token', '0a936be6df727e9c543cf1ede6dfc64da58119f94349d1ec9be894c4a443fea1', '[\"*\"]', NULL, '2026-04-29 05:59:16', '2026-04-29 05:44:16', '2026-04-29 05:44:16'),
(35, 'App\\Models\\User', 1, 'refresh-token', '293992034a61a08ebbb91c4ee1cd995c315164362b861457e5e86db24993339f', '[\"refresh\"]', NULL, '2026-05-06 05:44:16', '2026-04-29 05:44:16', '2026-04-29 05:44:16'),
(36, 'App\\Models\\User', 2, 'access-token', 'acaba5a8957a3ac6fbf0d36d8f62e13c9f96660805f712864acc2b787a046edc', '[\"*\"]', NULL, '2026-04-29 05:59:17', '2026-04-29 05:44:17', '2026-04-29 05:44:17'),
(37, 'App\\Models\\User', 2, 'refresh-token', '08dec662d84992c304ebb098bfccd14c938278418038a78970c4f451651de7b2', '[\"refresh\"]', NULL, '2026-05-06 05:44:17', '2026-04-29 05:44:17', '2026-04-29 05:44:17'),
(38, 'App\\Models\\User', 4, 'access-token', 'bd4c840c7f9550e7492e46cb53b15f722aa2fd1c45d850b1148ad46e6c7ad6ae', '[\"*\"]', NULL, '2026-04-29 05:59:18', '2026-04-29 05:44:18', '2026-04-29 05:44:18'),
(39, 'App\\Models\\User', 4, 'refresh-token', '55f6a9ec4f50f45f5db3c6bc926b7ffff481a12174388acc37e75b7613259e39', '[\"refresh\"]', NULL, '2026-05-06 05:44:19', '2026-04-29 05:44:19', '2026-04-29 05:44:19'),
(40, 'App\\Models\\User', 1, 'access-token', 'a76d7dac1a1ae18f4c4b9cb04846c6fa8d6bf8413bed7d3eafa91f01aaccda71', '[\"*\"]', NULL, '2026-04-29 06:00:04', '2026-04-29 05:45:04', '2026-04-29 05:45:04'),
(41, 'App\\Models\\User', 1, 'refresh-token', '202686c6e7d714d650839048d88547b01c43a147110c6aa554a69d117751cf97', '[\"refresh\"]', NULL, '2026-05-06 05:45:04', '2026-04-29 05:45:04', '2026-04-29 05:45:04'),
(42, 'App\\Models\\User', 1, 'access-token', 'd4168070bd8b6cdd85179eb93cab49d4d3cb9338a173620795cf4c714083f983', '[\"*\"]', NULL, '2026-04-29 06:01:53', '2026-04-29 05:46:53', '2026-04-29 05:46:53'),
(43, 'App\\Models\\User', 1, 'refresh-token', '2a180d5a58f4971db4be4ec8d38dd05e33154ad89c0fcca40473634ce326761c', '[\"refresh\"]', NULL, '2026-05-06 05:46:54', '2026-04-29 05:46:54', '2026-04-29 05:46:54'),
(44, 'App\\Models\\User', 1, 'access-token', '8182bfe8fd1d6234071a2c112b90f38e4c34345a7c73e25552aaf0fffae7ce44', '[\"*\"]', NULL, '2026-04-29 06:07:35', '2026-04-29 05:52:35', '2026-04-29 05:52:35'),
(45, 'App\\Models\\User', 1, 'refresh-token', '6f1ebfd580b2090458625df67c2258003949a5b5f77dde420e6b907e5cc46879', '[\"refresh\"]', NULL, '2026-05-06 05:52:35', '2026-04-29 05:52:35', '2026-04-29 05:52:35'),
(46, 'App\\Models\\User', 9, 'access-token', '46b5eac7a562d868a318ebdba28427ff96f685d175bd4f76ee74ffdaedc99d3a', '[\"*\"]', NULL, '2026-04-29 06:08:34', '2026-04-29 05:53:34', '2026-04-29 05:53:34'),
(47, 'App\\Models\\User', 9, 'refresh-token', '31a62828cf5904fb84f7621d37700dec434881c75b5db805ee278e5bb0b71d46', '[\"refresh\"]', NULL, '2026-05-06 05:53:34', '2026-04-29 05:53:34', '2026-04-29 05:53:34'),
(48, 'App\\Models\\User', 1, 'access-token', '4c2c30b0e23376849a5993ae973fed21ea68347a5b30e09b713e5eda702335bc', '[\"*\"]', NULL, '2026-04-29 06:11:20', '2026-04-29 05:56:20', '2026-04-29 05:56:20'),
(49, 'App\\Models\\User', 1, 'refresh-token', '3179c68ac52417250d400943fb8f1a87970b1b5c52214bd66e70219198ca992e', '[\"refresh\"]', NULL, '2026-05-06 05:56:20', '2026-04-29 05:56:20', '2026-04-29 05:56:20'),
(50, 'App\\Models\\User', 9, 'access-token', '468e6c6df9124cef0b4e53bfae10c3f7dc680ed5c622e58d50dec4a64f4384d1', '[\"*\"]', NULL, '2026-04-29 06:11:44', '2026-04-29 05:56:44', '2026-04-29 05:56:44'),
(51, 'App\\Models\\User', 9, 'refresh-token', 'ca989f5aaccc9a8d112b7fb1e59150ecec8f9ece0c456fef8c116043af0b1922', '[\"refresh\"]', NULL, '2026-05-06 05:56:44', '2026-04-29 05:56:44', '2026-04-29 05:56:44'),
(52, 'App\\Models\\User', 1, 'access-token', 'b46b1f9cfbcb94e66fee76de8d7cc879eef4554400a6c48ce4f5e6bde9ed50ab', '[\"*\"]', NULL, '2026-04-29 06:12:29', '2026-04-29 05:57:29', '2026-04-29 05:57:29'),
(53, 'App\\Models\\User', 1, 'refresh-token', '705ba03da169327180f326772146f8102584a61a714937c6f1fd9faea8eecd66', '[\"refresh\"]', NULL, '2026-05-06 05:57:29', '2026-04-29 05:57:29', '2026-04-29 05:57:29'),
(54, 'App\\Models\\User', 1, 'access-token', '732158718648de44468fd8311ee312f1b01207aca692c4dd3087c7dfb273bfe8', '[\"*\"]', NULL, '2026-04-29 06:12:53', '2026-04-29 05:57:53', '2026-04-29 05:57:53'),
(55, 'App\\Models\\User', 1, 'refresh-token', 'ce1c8fe130f9e0331b37288ac99e9c5e63c46c9b3e312b376a8e063faf891f8e', '[\"refresh\"]', NULL, '2026-05-06 05:57:53', '2026-04-29 05:57:53', '2026-04-29 05:57:53'),
(56, 'App\\Models\\User', 1, 'access-token', 'd98bd29bb7c19518e208e1e0b8bc6771d104fea5d8126154c4bff9031cbac9b0', '[\"*\"]', NULL, '2026-04-29 06:14:55', '2026-04-29 05:59:55', '2026-04-29 05:59:55'),
(57, 'App\\Models\\User', 1, 'refresh-token', '12f4cc679c94d1a4f4a74913910f721802a62063dc9d49de812c206ce07a7045', '[\"refresh\"]', NULL, '2026-05-06 05:59:55', '2026-04-29 05:59:55', '2026-04-29 05:59:55'),
(58, 'App\\Models\\User', 1, 'access-token', 'e65aa6dfd36fdff667cce8c7d80eaf4191a3e13d946914d6d2c54cf6a287397b', '[\"*\"]', NULL, '2026-04-29 06:18:47', '2026-04-29 06:03:47', '2026-04-29 06:03:47'),
(60, 'App\\Models\\User', 1, 'access-token', '261cadaef40257dd4b939affac0c12ecc22451d57063c87cccdabb98f41291fe', '[\"*\"]', NULL, '2026-04-29 06:22:45', '2026-04-29 06:07:45', '2026-04-29 06:07:45'),
(61, 'App\\Models\\User', 1, 'refresh-token', 'aeecc3c61e72238a6265c6f94adcefb5d8aad8ae6e0c177bca8bd412262d03e0', '[\"refresh\"]', NULL, '2026-05-06 06:07:45', '2026-04-29 06:07:45', '2026-04-29 06:07:45'),
(62, 'App\\Models\\User', 1, 'access-token', 'f5545b7303a051c5af1642c115b2d955c8cda00956e2aa14a137ab55886df87b', '[\"*\"]', '2026-04-29 06:07:48', '2026-04-29 06:22:47', '2026-04-29 06:07:47', '2026-04-29 06:07:48'),
(63, 'App\\Models\\User', 1, 'refresh-token', 'ac452eb5428b701d574bf5bd1f98cbb18f0310cb613cc038a97a5f8f41a81cfc', '[\"refresh\"]', NULL, '2026-05-06 06:07:47', '2026-04-29 06:07:47', '2026-04-29 06:07:47'),
(64, 'App\\Models\\User', 1, 'access-token', '29bedf2d412093a19a5a2250e7dcef7b335ae9b929ba74307ce036a029774598', '[\"*\"]', NULL, '2026-04-29 06:25:07', '2026-04-29 06:10:07', '2026-04-29 06:10:07'),
(65, 'App\\Models\\User', 1, 'refresh-token', 'bcfead1d545da31865e0d0a1fccef07deff14863691db0a6a36c1cf4d98c9f60', '[\"refresh\"]', NULL, '2026-05-06 06:10:07', '2026-04-29 06:10:07', '2026-04-29 06:10:07'),
(66, 'App\\Models\\User', 1, 'access-token', 'eb3c3d18571ef1d4d6b89073abc99d6f6688f6b6f5f90f9d29703a5e17a80f48', '[\"*\"]', NULL, '2026-04-29 06:25:40', '2026-04-29 06:10:40', '2026-04-29 06:10:40'),
(67, 'App\\Models\\User', 1, 'refresh-token', 'd8b0639795eaf38d611946e1f88c0b6445b4b7bf4e833c1d0f776fa7187f778b', '[\"refresh\"]', NULL, '2026-05-06 06:10:40', '2026-04-29 06:10:40', '2026-04-29 06:10:40'),
(68, 'App\\Models\\User', 1, 'access-token', '5898a256afbda5382bc6ac4467182ecf73cd5ea88e268e3c4ea8aefed7668dca', '[\"*\"]', NULL, '2026-04-29 06:26:12', '2026-04-29 06:11:12', '2026-04-29 06:11:12'),
(69, 'App\\Models\\User', 1, 'refresh-token', '160ebb4731b2789f51eb6228d0c1a5a357344b6cf59a4dcae7b1bd691c9b3dcf', '[\"refresh\"]', NULL, '2026-05-06 06:11:13', '2026-04-29 06:11:13', '2026-04-29 06:11:13'),
(70, 'App\\Models\\User', 1, 'access-token', '2725d9b38a6abdac42757ae942e898d35f1c4e0d4357391349d41f52d852082b', '[\"*\"]', NULL, '2026-04-29 06:29:14', '2026-04-29 06:14:14', '2026-04-29 06:14:14'),
(71, 'App\\Models\\User', 1, 'refresh-token', 'c6571876ced0623161ea33f2d1187db8be855fe0726f1ee7c4cf8bd0b89c6ff1', '[\"refresh\"]', NULL, '2026-05-06 06:14:14', '2026-04-29 06:14:14', '2026-04-29 06:14:14'),
(72, 'App\\Models\\User', 1, 'access-token', '90512e8dcb66391ec2e3b882cb568fe2ed98f8a0ab5d62f2db1f333913d20e03', '[\"*\"]', NULL, '2026-04-29 06:31:43', '2026-04-29 06:16:43', '2026-04-29 06:16:43'),
(73, 'App\\Models\\User', 1, 'refresh-token', '4dc26aa8fa52bb57625f6ee4ebf69f59cbf2062ccb39eebc79062c77743e8a77', '[\"refresh\"]', NULL, '2026-05-06 06:16:43', '2026-04-29 06:16:43', '2026-04-29 06:16:43'),
(74, 'App\\Models\\User', 1, 'access-token', '287d1c9a81568698ec357b68df40cda1c0a7220961ee487bc4f1f9535d658620', '[\"*\"]', NULL, '2026-04-29 06:34:57', '2026-04-29 06:19:57', '2026-04-29 06:19:57'),
(75, 'App\\Models\\User', 1, 'refresh-token', '410a06bfb967f5a91ff32dec50b0dee57acc3d9b2c3e8be74d24a3a92dad8e5e', '[\"refresh\"]', NULL, '2026-05-06 06:19:57', '2026-04-29 06:19:57', '2026-04-29 06:19:57'),
(76, 'App\\Models\\User', 1, 'access-token', 'bfa5391c81ab6abbafa503e4185b20b13b5d0592e258ff551dff0cb966e0fbac', '[\"*\"]', NULL, '2026-04-29 06:37:37', '2026-04-29 06:22:37', '2026-04-29 06:22:37'),
(77, 'App\\Models\\User', 1, 'refresh-token', '5d7971a3ef036c2f44a6d0cc42d1e8b50f3872ca95f6bac9de7bb53935077ff1', '[\"refresh\"]', NULL, '2026-05-06 06:22:37', '2026-04-29 06:22:37', '2026-04-29 06:22:37'),
(78, 'App\\Models\\User', 1, 'access-token', '8ef47f183cc750d1dd0920a24b73d7a40ab7ebebb918858f42628cfb12026893', '[\"*\"]', NULL, '2026-04-29 06:39:15', '2026-04-29 06:24:15', '2026-04-29 06:24:15'),
(79, 'App\\Models\\User', 1, 'refresh-token', '5ee7a5ad282135ff90a994959495b793b40fe5ee7349c4ee06d434ebf9577f8b', '[\"refresh\"]', NULL, '2026-05-06 06:24:15', '2026-04-29 06:24:15', '2026-04-29 06:24:15'),
(80, 'App\\Models\\User', 9, 'access-token', '8f007dcd69ec7a8a8169a89dec3371ded6b67caadc80c131c0c231d25316d2df', '[\"*\"]', NULL, '2026-04-29 06:39:30', '2026-04-29 06:24:30', '2026-04-29 06:24:30'),
(81, 'App\\Models\\User', 9, 'refresh-token', 'ddfab7a215abbd54af1cf12f76431a02655b40e7d10f8e1d2faccf710f7cf352', '[\"refresh\"]', NULL, '2026-05-06 06:24:30', '2026-04-29 06:24:30', '2026-04-29 06:24:30'),
(82, 'App\\Models\\User', 1, 'access-token', 'ab2eb5bad1ea11b5b2f51c5de2ac3c7a966bdb904f87d2d61bf00a69fc794575', '[\"*\"]', NULL, '2026-04-29 06:42:13', '2026-04-29 06:27:13', '2026-04-29 06:27:13'),
(83, 'App\\Models\\User', 1, 'refresh-token', 'b4182c213060bef71a943599cba3a979748376764af16bcc9e20140d8e79b0cd', '[\"refresh\"]', NULL, '2026-05-06 06:27:13', '2026-04-29 06:27:13', '2026-04-29 06:27:13'),
(84, 'App\\Models\\User', 9, 'access-token', 'd33e4dc2da8de4d149369474e4368ab89b301c55960e1a860b2986462e601a08', '[\"*\"]', NULL, '2026-04-29 06:43:21', '2026-04-29 06:28:21', '2026-04-29 06:28:21'),
(85, 'App\\Models\\User', 9, 'refresh-token', '707cbcf98e54980b2eed900e335fabe4c5619b9fd2d7719394e2a94ac5bbca96', '[\"refresh\"]', NULL, '2026-05-06 06:28:21', '2026-04-29 06:28:21', '2026-04-29 06:28:21'),
(86, 'App\\Models\\User', 9, 'access-token', '11f80df260f6fb1028798fdffc85753e7e36a77b2abf3b9de23c761928ffeaa9', '[\"*\"]', NULL, '2026-04-29 06:44:00', '2026-04-29 06:29:00', '2026-04-29 06:29:00'),
(87, 'App\\Models\\User', 9, 'refresh-token', 'a117c26d8d7c649295e8cabe54b3e44e4b932c1c0806f63da284ee530560ec67', '[\"refresh\"]', NULL, '2026-05-06 06:29:00', '2026-04-29 06:29:00', '2026-04-29 06:29:00'),
(88, 'App\\Models\\User', 9, 'access-token', '558605686349772ef4fe015cf2d356a6121ac625267362748f36838901d4902d', '[\"*\"]', NULL, '2026-04-29 06:45:16', '2026-04-29 06:30:16', '2026-04-29 06:30:16'),
(89, 'App\\Models\\User', 9, 'refresh-token', '513af3b0e0713e2195feb3949f52eef7bec3ed3f09a91aa7e6aa8e816cee028e', '[\"refresh\"]', NULL, '2026-05-06 06:30:16', '2026-04-29 06:30:16', '2026-04-29 06:30:16'),
(90, 'App\\Models\\User', 9, 'access-token', 'e1fdc22379a653fafd8e81dc8e18c1b33a61af84a81cbcddb3c175516d053336', '[\"*\"]', NULL, '2026-04-29 06:45:27', '2026-04-29 06:30:27', '2026-04-29 06:30:27'),
(91, 'App\\Models\\User', 9, 'refresh-token', '5e0d8783cc97531c9b0367924b6078b1a1c16db7a1aebf9b750cf2b995997fa1', '[\"refresh\"]', NULL, '2026-05-06 06:30:27', '2026-04-29 06:30:27', '2026-04-29 06:30:27'),
(92, 'App\\Models\\User', 1, 'access-token', '4bdd1c060e16c11b4dc1c435c2cb9d2d31c94795dd67a3654baf9c1e1f651f8e', '[\"*\"]', NULL, '2026-04-29 06:45:39', '2026-04-29 06:30:39', '2026-04-29 06:30:39'),
(93, 'App\\Models\\User', 1, 'refresh-token', 'e483d55acd8f1c74da642564388dfbfb7a12e95228734b77a50541eac0ae2073', '[\"refresh\"]', NULL, '2026-05-06 06:30:39', '2026-04-29 06:30:39', '2026-04-29 06:30:39'),
(94, 'App\\Models\\User', 1, 'access-token', '0f5ffd96bdda8d536eac6f907bf577617b16a5942fa6feed6bfccee3701fe3e0', '[\"*\"]', NULL, '2026-04-29 06:48:34', '2026-04-29 06:33:34', '2026-04-29 06:33:34'),
(95, 'App\\Models\\User', 1, 'refresh-token', '42e6db3d226e817a2c6adb9654c0a9aae66d4378bd576473156aa6f09661d562', '[\"refresh\"]', NULL, '2026-05-06 06:33:34', '2026-04-29 06:33:34', '2026-04-29 06:33:34'),
(96, 'App\\Models\\User', 9, 'access-token', 'e6ba3dc77b9960156f3aacd16b50e2af59b80b8d7926e28ef3673d659dedca29', '[\"*\"]', NULL, '2026-04-29 06:49:06', '2026-04-29 06:34:06', '2026-04-29 06:34:06'),
(97, 'App\\Models\\User', 9, 'refresh-token', '63ce6f1b4bb0df36c47cf1d0512c6c5ecfec7b0a5ddcea3d98f2823596d20277', '[\"refresh\"]', NULL, '2026-05-06 06:34:06', '2026-04-29 06:34:06', '2026-04-29 06:34:06'),
(98, 'App\\Models\\User', 9, 'access-token', '065dcdb4a89d18702aa554ade03fbe56a3f8dfc346d5212adc2c87a2c8455c2c', '[\"*\"]', NULL, '2026-04-29 06:51:05', '2026-04-29 06:36:05', '2026-04-29 06:36:05'),
(100, 'App\\Models\\User', 9, 'access-token', '22ace2e66cd8054865498d0be92c0987f8970b78a1d1eaaa591d71ac68abf1b7', '[\"*\"]', NULL, '2026-04-29 06:51:28', '2026-04-29 06:36:28', '2026-04-29 06:36:28'),
(101, 'App\\Models\\User', 9, 'refresh-token', 'b389d2506dc74e05b1028f0e3e558a02e3d43c3ebd3227ae0aa58c224ebd9712', '[\"refresh\"]', NULL, '2026-05-06 06:36:28', '2026-04-29 06:36:28', '2026-04-29 06:36:28'),
(102, 'App\\Models\\User', 1, 'access-token', 'b858a674a7a17e09dbba48481c075d4fa093779181becf492b659b5ba097e1e9', '[\"*\"]', '2026-04-29 06:36:40', '2026-04-29 06:51:37', '2026-04-29 06:36:37', '2026-04-29 06:36:40'),
(103, 'App\\Models\\User', 1, 'refresh-token', 'e29f01aaae885c28d8c09599dbdb745ecdb9453976ba85befecf353824a59132', '[\"refresh\"]', NULL, '2026-05-06 06:36:37', '2026-04-29 06:36:37', '2026-04-29 06:36:37'),
(105, 'App\\Models\\User', 9, 'refresh-token', '055822f7fa31a902bf9b9b892ff7383c4a5f1c70f58dcf4967d97a2754c18098', '[\"refresh\"]', NULL, '2026-05-06 06:38:25', '2026-04-29 06:38:25', '2026-04-29 06:38:25'),
(107, 'App\\Models\\User', 1, 'refresh-token', '70b4d45b6ca5b0943629cb3007f2eaa16aff6abd683cfb4e5070fdc3db61d67e', '[\"refresh\"]', NULL, '2026-05-06 06:39:13', '2026-04-29 06:39:13', '2026-04-29 06:39:13'),
(108, 'App\\Models\\User', 1, 'access-token', '80ec84ae14bc23826262788db340c1e0efa27a4708147b407c56f7917cf47103', '[\"*\"]', '2026-04-29 06:58:28', '2026-04-29 06:58:54', '2026-04-29 06:43:54', '2026-04-29 06:58:28'),
(109, 'App\\Models\\User', 1, 'refresh-token', '1f42d1432478dbad5a25730107c27a5b950c58ccdb71e85e071d9387320c0af0', '[\"refresh\"]', NULL, '2026-05-06 06:43:54', '2026-04-29 06:43:54', '2026-04-29 06:43:54'),
(110, 'App\\Models\\User', 10, 'access-token', 'f7e1ca5c779cffa22d66fb936a7d6081fe78bc24461014cc60ca4cb5ed684d71', '[\"*\"]', '2026-04-29 06:44:20', '2026-04-29 06:59:12', '2026-04-29 06:44:12', '2026-04-29 06:44:20'),
(111, 'App\\Models\\User', 10, 'refresh-token', '6c31b33812ef034f3784c2cbbcc08e4bc5fd5bda7787ed018f648360eb4c682b', '[\"refresh\"]', NULL, '2026-05-06 06:44:12', '2026-04-29 06:44:12', '2026-04-29 06:44:12'),
(113, 'App\\Models\\User', 10, 'refresh-token', '14d2216dc7fb51ce3c753102e4488061f4741fa24de13937008246b743923fd3', '[\"refresh\"]', NULL, '2026-05-06 06:47:36', '2026-04-29 06:47:36', '2026-04-29 06:47:36'),
(115, 'App\\Models\\User', 1, 'refresh-token', '69a22039064d10c214e5b0a5fcb04904515b39a04644286493e0feb782b166b7', '[\"refresh\"]', NULL, '2026-05-06 07:01:27', '2026-04-29 07:01:27', '2026-04-29 07:01:27'),
(117, 'App\\Models\\User', 9, 'refresh-token', '35845b4a99505de81ed9ac43053328f72522baa27c415b26c829fd5c48c1e6d1', '[\"refresh\"]', NULL, '2026-05-13 18:59:19', '2026-05-06 18:59:19', '2026-05-06 18:59:19'),
(118, 'App\\Models\\User', 1, 'access-token', 'ca6c444fb2314e84cc3b21f41efabcc70f5c27afd775f295b4760a15cb30d24f', '[\"*\"]', '2026-06-16 21:24:18', '2026-06-16 21:24:23', '2026-06-16 21:09:23', '2026-06-16 21:24:18'),
(119, 'App\\Models\\User', 1, 'refresh-token', 'd26b2d6fa8be2651696d3636eabb36d8313736144c6f379c5f3f8d8539051362', '[\"refresh\"]', NULL, '2026-06-23 21:09:23', '2026-06-16 21:09:23', '2026-06-16 21:09:23'),
(121, 'App\\Models\\User', 9, 'refresh-token', 'e60cc0317544a7e4133ef8004b1c8b65701fbc47e0d521739ffefe54bbc6ed8e', '[\"refresh\"]', NULL, '2026-06-23 21:25:07', '2026-06-16 21:25:07', '2026-06-16 21:25:07'),
(123, 'App\\Models\\User', 1, 'refresh-token', 'e33c78a6d63144306e4d10335ec63e2ed5027074c539859c6678c6c009be37db', '[\"refresh\"]', NULL, '2026-06-23 21:32:32', '2026-06-16 21:32:32', '2026-06-16 21:32:32'),
(124, 'App\\Models\\User', 9, 'access-token', '33c74d0e7112431a78762c50a5dacfdce091329573e12294d311cbdbd37c8e35', '[\"*\"]', '2026-06-16 21:47:27', '2026-06-16 21:48:54', '2026-06-16 21:33:54', '2026-06-16 21:47:27'),
(125, 'App\\Models\\User', 9, 'refresh-token', '862abcad13c747607b48b136c0ddbc9272ea47d0928d4b953ef5746be2c99fc2', '[\"refresh\"]', NULL, '2026-06-23 21:33:54', '2026-06-16 21:33:54', '2026-06-16 21:33:54'),
(126, 'App\\Models\\User', 9, 'access-token', '9fda0e2bcede2aad8798ee49e6117448f348b0a75682b23a345530ae3e2c6e3a', '[\"*\"]', '2026-06-16 22:06:24', '2026-06-16 22:06:28', '2026-06-16 21:51:28', '2026-06-16 22:06:24'),
(127, 'App\\Models\\User', 9, 'refresh-token', 'ce35b5f0030a2d3d87ae34168ecfdb44c44043436b88b597411d44cf8ee570ff', '[\"refresh\"]', NULL, '2026-06-23 21:51:28', '2026-06-16 21:51:28', '2026-06-16 21:51:28'),
(128, 'App\\Models\\User', 9, 'access-token', '89c0db3f687db304045b2c5d4b556811331ce870f344ead12d2ceec82834de2d', '[\"*\"]', '2026-06-16 22:32:11', '2026-06-16 22:33:09', '2026-06-16 22:18:09', '2026-06-16 22:32:11'),
(129, 'App\\Models\\User', 9, 'refresh-token', '1a8469c4fcc2596dfa1c2f6dd492c19e52c0bf2ce8bc506a8cd8af8b3d31bb3d', '[\"refresh\"]', NULL, '2026-06-23 22:18:09', '2026-06-16 22:18:09', '2026-06-16 22:18:09'),
(131, 'App\\Models\\User', 9, 'refresh-token', 'a638c66d8905f67745be9024788afa443b34de05ad96767912e69531cdbcf411', '[\"refresh\"]', NULL, '2026-06-23 22:35:02', '2026-06-16 22:35:02', '2026-06-16 22:35:02'),
(132, 'App\\Models\\User', 1, 'access-token', '2aaaf99432e2aed75b532f7b45d1ca6146c02bf76821c7404233bb4546d3b6a0', '[\"*\"]', '2026-06-16 22:57:16', '2026-06-16 22:57:45', '2026-06-16 22:42:45', '2026-06-16 22:57:16'),
(133, 'App\\Models\\User', 1, 'refresh-token', '678e66cb83d8459d181e76188ffed0513e0bff157d20fa884c0e37452d35fe03', '[\"refresh\"]', NULL, '2026-06-23 22:42:45', '2026-06-16 22:42:45', '2026-06-16 22:42:45'),
(135, 'App\\Models\\User', 1, 'refresh-token', 'cbe115f0fc440d117cc1bce8bf72cd1765ad8be34f33cba35096d0f0dc1af8a3', '[\"refresh\"]', NULL, '2026-06-23 22:59:07', '2026-06-16 22:59:07', '2026-06-16 22:59:07'),
(137, 'App\\Models\\User', 9, 'refresh-token', '2feeada5f9ef389418e2106c67893dc20527d2c8512303810abfe261732d661a', '[\"refresh\"]', NULL, '2026-06-23 23:10:48', '2026-06-16 23:10:48', '2026-06-16 23:10:48'),
(138, 'App\\Models\\User', 2, 'access-token', 'b3229f296222592425bc0175eb381627085f4a6e24e25ab7394dcb1f46db145d', '[\"*\"]', '2026-06-16 23:25:55', '2026-06-16 23:26:16', '2026-06-16 23:11:16', '2026-06-16 23:25:55'),
(139, 'App\\Models\\User', 2, 'refresh-token', '6bb8276e74b592cb9fde848a3d5945eac8d2174751c3ccd89c92c9e8251ce7c5', '[\"refresh\"]', NULL, '2026-06-23 23:11:16', '2026-06-16 23:11:16', '2026-06-16 23:11:16'),
(140, 'App\\Models\\User', 4, 'access-token', '8a1bb05ff93424fc341b45c221e429b5068b15a1b77d124fa36e2a94c8d9fc98', '[\"*\"]', '2026-06-16 23:32:16', '2026-06-16 23:32:30', '2026-06-16 23:17:30', '2026-06-16 23:32:16'),
(141, 'App\\Models\\User', 4, 'refresh-token', 'aaa228c1efccfa983a425778a8f6880cf2a62042b6d88454488181f1bb9f33ac', '[\"refresh\"]', NULL, '2026-06-23 23:17:30', '2026-06-16 23:17:30', '2026-06-16 23:17:30'),
(143, 'App\\Models\\User', 9, 'refresh-token', '5c946805a393a12ad0cd83b61c4669f8eafa8029d2ecf1a7333158dd89426ea2', '[\"refresh\"]', NULL, '2026-06-23 23:28:28', '2026-06-16 23:28:28', '2026-06-16 23:28:28'),
(144, 'App\\Models\\User', 12, 'access-token', 'd6fb5e6f54849830b4078c1a02894486ea0767f96a6194876e3b0d178bfdada2', '[\"*\"]', '2026-06-16 23:49:21', '2026-06-17 00:02:59', '2026-06-16 23:47:59', '2026-06-16 23:49:21'),
(145, 'App\\Models\\User', 12, 'refresh-token', 'a8546576fee0619c3f1dd3d3c53bd0d43886d81573e51c171a2b5ad499f318cd', '[\"refresh\"]', NULL, '2026-06-23 23:48:00', '2026-06-16 23:48:00', '2026-06-16 23:48:00'),
(146, 'App\\Models\\User', 12, 'access-token', '4e0e592d698b6cb8c5af98ad4181521f9360859d3e0cadd8783ed9ba12886bd3', '[\"*\"]', '2026-06-17 00:07:39', '2026-06-17 00:07:40', '2026-06-16 23:52:40', '2026-06-17 00:07:39'),
(147, 'App\\Models\\User', 12, 'refresh-token', '4f247391233e0a06d1899ab3e4792b2712a4f5ba21d5081d6ad6b7281f38aa1e', '[\"refresh\"]', NULL, '2026-06-23 23:52:40', '2026-06-16 23:52:40', '2026-06-16 23:52:40'),
(148, 'App\\Models\\User', 12, 'access-token', '70907f9bcc9843c69cd6622c08425a544193c8b519db50dbea3b1bf06fc25811', '[\"*\"]', '2026-06-17 00:23:22', '2026-06-17 00:23:49', '2026-06-17 00:08:49', '2026-06-17 00:23:22'),
(149, 'App\\Models\\User', 12, 'refresh-token', '982777e55cf5482671fca07da394005161c31190e6a98c249ef2e3f97e904971', '[\"refresh\"]', NULL, '2026-06-24 00:08:49', '2026-06-17 00:08:49', '2026-06-17 00:08:49'),
(151, 'App\\Models\\User', 12, 'refresh-token', '63464f7c3d0040b1798f91b1b233e3551bdba58ca3e7a4249add8899ed2f869d', '[\"refresh\"]', NULL, '2026-06-24 00:34:03', '2026-06-17 00:34:03', '2026-06-17 00:34:03'),
(153, 'App\\Models\\User', 12, 'refresh-token', '34b6f50305dafac13d9192ad9e64c0546c065eb6ea722545c165f483f2266e35', '[\"refresh\"]', NULL, '2026-06-24 17:08:51', '2026-06-17 17:08:51', '2026-06-17 17:08:51'),
(155, 'App\\Models\\User', 9, 'refresh-token', '7dace50c8720c323b94c48874a19ec3895152cf30df749b67030539252c9b761', '[\"refresh\"]', NULL, '2026-06-24 22:05:42', '2026-06-17 22:05:42', '2026-06-17 22:05:42'),
(157, 'App\\Models\\User', 9, 'refresh-token', '171d4313240de87b89ef91d360e26283753ca19698ea47a8dee6b25806634f77', '[\"refresh\"]', NULL, '2026-06-24 22:25:06', '2026-06-17 22:25:06', '2026-06-17 22:25:06'),
(159, 'App\\Models\\User', 9, 'refresh-token', '7ba7e852a7c68afb0bd0be58f7d14abc38f0937d611da9c80c8adb644748da43', '[\"refresh\"]', NULL, '2026-06-24 22:26:53', '2026-06-17 22:26:53', '2026-06-17 22:26:53'),
(161, 'App\\Models\\User', 9, 'refresh-token', '41e6e1c5595dc212a114c3dd66915df905c5067adac63258636b4913703bc870', '[\"refresh\"]', NULL, '2026-06-24 22:29:51', '2026-06-17 22:29:51', '2026-06-17 22:29:51'),
(163, 'App\\Models\\User', 12, 'refresh-token', 'b3cd0f7211721728412efd51de4835142732018a5012c11d7429d4a6d2258a41', '[\"refresh\"]', NULL, '2026-06-24 22:30:16', '2026-06-17 22:30:16', '2026-06-17 22:30:16'),
(164, 'App\\Models\\User', 1, 'access-token', '256aa9c82c8d77c701441c658a516880e0929bc7ce8bdd3f132078c2ef466f21', '[\"*\"]', '2026-06-23 06:38:53', '2026-06-23 06:38:54', '2026-06-23 06:23:54', '2026-06-23 06:38:53'),
(165, 'App\\Models\\User', 1, 'refresh-token', '21d2b85f8ff5a4eaaa30de42ed1ce2f046440b4261adcfc6dada709da1f748f5', '[\"refresh\"]', NULL, '2026-06-30 06:23:55', '2026-06-23 06:23:55', '2026-06-23 06:23:55'),
(166, 'App\\Models\\User', 1, 'access-token', '691d066b5bd62d132f90dd3fc83aaae37f91cdc1f47fcabc66333829039226f2', '[\"*\"]', '2026-06-23 06:54:00', '2026-06-23 06:54:01', '2026-06-23 06:39:01', '2026-06-23 06:54:00'),
(167, 'App\\Models\\User', 1, 'refresh-token', 'd9a8d101a30974befbeba3c92dcd146164fbe8f913b2be3c7fb915c963ecbecf', '[\"refresh\"]', NULL, '2026-06-30 06:39:01', '2026-06-23 06:39:01', '2026-06-23 06:39:01'),
(169, 'App\\Models\\User', 1, 'refresh-token', 'ea7eb88a38a45bcbeba4648c2455a2281f90642c5d381d9bad84b275655b3fc9', '[\"refresh\"]', NULL, '2026-06-30 06:56:26', '2026-06-23 06:56:26', '2026-06-23 06:56:26'),
(171, 'App\\Models\\User', 1, 'refresh-token', '8c58fc80f6e88305f56a5b0d1ed7d70b7eeb343f8c80885e84fb6ab6a0cdf0c4', '[\"refresh\"]', NULL, '2026-06-30 07:02:00', '2026-06-23 07:02:00', '2026-06-23 07:02:00'),
(173, 'App\\Models\\User', 1, 'refresh-token', '70190284043ed1146ffb2424f1329ac1ab1cdb54d112eec07598d9a4145a2272', '[\"refresh\"]', NULL, '2026-06-30 07:20:36', '2026-06-23 07:20:36', '2026-06-23 07:20:36'),
(175, 'App\\Models\\User', 1, 'refresh-token', '0eb690dfa27f77e56649e459c464c60707e2b97fc894dbf8e8d37e25dd6e8319', '[\"refresh\"]', NULL, '2026-06-30 07:22:52', '2026-06-23 07:22:52', '2026-06-23 07:22:52'),
(176, 'App\\Models\\User', 4, 'access-token', '9ee7b1dde32b9f111c913f983735e1bdf5d0f6203ff01a8f2ac086a850120b45', '[\"*\"]', '2026-06-23 07:38:32', '2026-06-23 07:38:38', '2026-06-23 07:23:38', '2026-06-23 07:38:32'),
(177, 'App\\Models\\User', 4, 'refresh-token', '7065d587baf4db0bdd05d155d776b1b4ab421dac7155850f8dd59f434b0cac04', '[\"refresh\"]', NULL, '2026-06-30 07:23:38', '2026-06-23 07:23:38', '2026-06-23 07:23:38'),
(179, 'App\\Models\\User', 1, 'refresh-token', '76405c532aab204ce44581c2f24bc3c17385bfe3b7194e35fd9ae71fa8137df5', '[\"refresh\"]', NULL, '2026-07-03 07:44:20', '2026-06-26 07:44:20', '2026-06-26 07:44:20'),
(181, 'App\\Models\\User', 4, 'refresh-token', 'ec16db4673c4f41f3fbdba0a7216cf06f61ae9c4b55fedf58b5484f3e88890d4', '[\"refresh\"]', NULL, '2026-07-03 07:45:28', '2026-06-26 07:45:28', '2026-06-26 07:45:28'),
(183, 'App\\Models\\User', 1, 'refresh-token', '13bfe9df91aa8e56bc3170b0e4aafe99d6293d445f8d28971c51145983284376', '[\"refresh\"]', NULL, '2026-07-03 07:54:01', '2026-06-26 07:54:01', '2026-06-26 07:54:01'),
(185, 'App\\Models\\User', 4, 'refresh-token', '9ba392052d3cc6cfeb773730b5f8b670ac0e02eb189fa7043a53fc284e9ebfe4', '[\"refresh\"]', NULL, '2026-07-03 07:55:33', '2026-06-26 07:55:33', '2026-06-26 07:55:33'),
(186, 'App\\Models\\User', 9, 'access-token', '19587ce2562acec910c5ba41bf3d4c184e084ca0f37e76ff012f4fc2cb2dec5f', '[\"*\"]', '2026-06-26 08:06:50', '2026-06-26 08:10:49', '2026-06-26 07:55:49', '2026-06-26 08:06:50'),
(187, 'App\\Models\\User', 9, 'refresh-token', 'b21c1dab487b0c6fd51d617747af95a4c08e58dcda731ebb105e9f35a80b3a76', '[\"refresh\"]', NULL, '2026-07-03 07:55:49', '2026-06-26 07:55:49', '2026-06-26 07:55:49'),
(189, 'App\\Models\\User', 4, 'refresh-token', '60105576fd6eeb2a8338c92279e58494107c512456815959c5d405035df98739', '[\"refresh\"]', NULL, '2026-07-03 07:56:12', '2026-06-26 07:56:12', '2026-06-26 07:56:12'),
(190, 'App\\Models\\User', 9, 'access-token', 'c868c243f15b30026f6c47797d0a60c0cab93876a0aff3d6f105dcc88d6a8891', '[\"*\"]', '2026-06-26 08:36:03', '2026-06-26 08:36:19', '2026-06-26 08:21:19', '2026-06-26 08:36:03'),
(191, 'App\\Models\\User', 9, 'refresh-token', '511390604ba1ff6a90ef6a500ab00e468be24ac268064c940b85e8de7caef3fc', '[\"refresh\"]', NULL, '2026-07-03 08:21:19', '2026-06-26 08:21:19', '2026-06-26 08:21:19'),
(193, 'App\\Models\\User', 9, 'refresh-token', '45a9ad41d9b851cc00463c32a5744f9156ecf2c467d3c869509d30ad7b38acd6', '[\"refresh\"]', NULL, '2026-07-03 08:37:26', '2026-06-26 08:37:26', '2026-06-26 08:37:26'),
(194, 'App\\Models\\User', 1, 'access-token', 'ebf85265752a55a1e2b00baf8d42780377b1f972d18d10d9b918cd8bc7e15b02', '[\"*\"]', '2026-06-26 09:02:38', '2026-06-26 09:03:11', '2026-06-26 08:48:11', '2026-06-26 09:02:38'),
(195, 'App\\Models\\User', 1, 'refresh-token', '45f0cbe458491ff51ede84c24b1406457569150157738037ae92b510424518ac', '[\"refresh\"]', NULL, '2026-07-03 08:48:11', '2026-06-26 08:48:11', '2026-06-26 08:48:11'),
(197, 'App\\Models\\User', 9, 'refresh-token', '48c454fc045221f9e365d377d28d58e844bde39aa379e7a7751a39a6754cab18', '[\"refresh\"]', NULL, '2026-07-03 20:02:47', '2026-06-26 20:02:47', '2026-06-26 20:02:47'),
(199, 'App\\Models\\User', 9, 'refresh-token', 'd7396c4ace42e52e4b7706cfa43017d1a1acd9fe2a1d3cd836c25d4aac6d4e99', '[\"refresh\"]', NULL, '2026-07-03 20:11:09', '2026-06-26 20:11:09', '2026-06-26 20:11:09'),
(200, 'App\\Models\\User', 12, 'access-token', '5a833b4551e739f2f12e287fcc03141c8a8bd7ee37ccafc72dd19c27dee6da76', '[\"*\"]', '2026-06-26 20:27:34', '2026-06-26 20:27:40', '2026-06-26 20:12:40', '2026-06-26 20:27:34'),
(201, 'App\\Models\\User', 12, 'refresh-token', '067e0b015403a19ee5b2d0054eda4841638cbd3f64de422f9ee46c4efd226c1b', '[\"refresh\"]', NULL, '2026-07-03 20:12:40', '2026-06-26 20:12:40', '2026-06-26 20:12:40'),
(202, 'App\\Models\\User', 12, 'access-token', '965396307767255a68541fd758eb470a3fcf430435a03cd1c5a959d0f5950747', '[\"*\"]', '2026-06-26 20:42:49', '2026-06-26 20:43:17', '2026-06-26 20:28:17', '2026-06-26 20:42:49'),
(203, 'App\\Models\\User', 12, 'refresh-token', 'f25e4123d43178117a56c369f37709f3ab887152a7bbdc52676b4eed347f1e3a', '[\"refresh\"]', NULL, '2026-07-03 20:28:17', '2026-06-26 20:28:17', '2026-06-26 20:28:17'),
(205, 'App\\Models\\User', 9, 'refresh-token', 'adef759213a26d6b84d0e83216d172ebc7b8d33c8db57e2305e6db3a492d1514', '[\"refresh\"]', NULL, '2026-07-04 04:32:18', '2026-06-27 04:32:18', '2026-06-27 04:32:18'),
(207, 'App\\Models\\User', 12, 'refresh-token', '1edd6e8b3375c39c81599b194a61869ff62b496d7f5484e0da0d3a2f7d7cc7e4', '[\"refresh\"]', NULL, '2026-07-04 04:33:01', '2026-06-27 04:33:01', '2026-06-27 04:33:01'),
(209, 'App\\Models\\User', 12, 'refresh-token', '72a1c718b58bffb1464203d6829a841775711c9cfeeb395d09db32d19129c0c6', '[\"refresh\"]', NULL, '2026-07-04 04:42:52', '2026-06-27 04:42:52', '2026-06-27 04:42:52'),
(211, 'App\\Models\\User', 9, 'refresh-token', '5e1427622bf6233409be8369a96714af18255be6dd67614a91b69e30901d050d', '[\"refresh\"]', NULL, '2026-07-04 04:45:00', '2026-06-27 04:45:00', '2026-06-27 04:45:00'),
(213, 'App\\Models\\User', 12, 'refresh-token', '39b22b2fc90fbf12d885250db1a024882c44ef145959c3547654b0897d5c7f00', '[\"refresh\"]', NULL, '2026-07-04 04:49:45', '2026-06-27 04:49:45', '2026-06-27 04:49:45'),
(215, 'App\\Models\\User', 1, 'refresh-token', 'dbfc2070a618fee2971a28277162907642bcc78f23e8bcd2501fcfd191e3e789', '[\"refresh\"]', NULL, '2026-07-04 05:23:10', '2026-06-27 05:23:10', '2026-06-27 05:23:10'),
(217, 'App\\Models\\User', 9, 'refresh-token', '2601339ee5772542109fc20468713206bbe7ad589c6be023f37d5fe5c13cbd19', '[\"refresh\"]', NULL, '2026-07-04 05:28:51', '2026-06-27 05:28:51', '2026-06-27 05:28:51'),
(219, 'App\\Models\\User', 4, 'refresh-token', '7a3790f768df773a4268307f2d6172d563cd49793b28bb85b5d29316969ddb5f', '[\"refresh\"]', NULL, '2026-07-04 05:34:51', '2026-06-27 05:34:51', '2026-06-27 05:34:51'),
(221, 'App\\Models\\User', 12, 'refresh-token', 'f5a9f1886e4b5d9c86745af86223fa5c76cc803582b6bd66241fa4762cb190a5', '[\"refresh\"]', NULL, '2026-07-04 05:37:30', '2026-06-27 05:37:30', '2026-06-27 05:37:30'),
(223, 'App\\Models\\User', 1, 'refresh-token', '67fe56324975b23206380dc0c8358821b0015a6044485560ad6f0a4bb02680f4', '[\"refresh\"]', NULL, '2026-07-04 05:50:06', '2026-06-27 05:50:06', '2026-06-27 05:50:06'),
(225, 'App\\Models\\User', 9, 'refresh-token', 'ee41454d81d9194b8570b5ddf4c5f8a45dad39c2a5794d971e622a0d6ab83d4d', '[\"refresh\"]', NULL, '2026-07-04 05:56:35', '2026-06-27 05:56:35', '2026-06-27 05:56:35'),
(227, 'App\\Models\\User', 4, 'refresh-token', '74494daf6814a3e8f939eeee94cc9af20b7d5579c77a3732238f965be0c61fc6', '[\"refresh\"]', NULL, '2026-07-04 05:59:39', '2026-06-27 05:59:39', '2026-06-27 05:59:39'),
(229, 'App\\Models\\User', 4, 'refresh-token', 'bd232f98c2326c13ca7eced34f2e2e0f0984ebf3c7f8d2914bd2da85bc8d6100', '[\"refresh\"]', NULL, '2026-07-04 06:05:25', '2026-06-27 06:05:25', '2026-06-27 06:05:25'),
(231, 'App\\Models\\User', 12, 'refresh-token', '082e5f281d399639cee9bc484a26da195339f81270c796cd7dcf189158b6c70b', '[\"refresh\"]', NULL, '2026-07-04 06:10:09', '2026-06-27 06:10:09', '2026-06-27 06:10:09'),
(233, 'App\\Models\\User', 1, 'refresh-token', '7af840e767dcefff13f97ea03815896868b5139a20c9f94a58be4b07087c9fc0', '[\"refresh\"]', NULL, '2026-07-07 03:56:00', '2026-06-30 03:56:00', '2026-06-30 03:56:00'),
(235, 'App\\Models\\User', 9, 'refresh-token', 'deda022656cfca6098510372f2d995e51f239ca670cbf978f34fb1ca203342aa', '[\"refresh\"]', NULL, '2026-07-07 03:57:23', '2026-06-30 03:57:23', '2026-06-30 03:57:23'),
(237, 'App\\Models\\User', 9, 'refresh-token', '260eec94a3405dec4618651f1f98cf16092008052c2840c381c6b209b278a63b', '[\"refresh\"]', NULL, '2026-07-07 04:01:39', '2026-06-30 04:01:39', '2026-06-30 04:01:39'),
(239, 'App\\Models\\User', 9, 'refresh-token', 'a5db5c59e3462391d24a4c1f014a3b92764f27c766c818dfd6cde3f4d6ba891f', '[\"refresh\"]', NULL, '2026-07-07 09:46:36', '2026-06-30 09:46:36', '2026-06-30 09:46:36');

-- --------------------------------------------------------

--
-- Table structure for table `project_categories`
--

CREATE TABLE `project_categories` (
  `id` bigint UNSIGNED NOT NULL,
  `guru_id` bigint UNSIGNED DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `target_kelas` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `project_categories`
--

INSERT INTO `project_categories` (`id`, `guru_id`, `name`, `description`, `target_kelas`, `start_date`, `end_date`, `is_active`, `created_at`, `updated_at`) VALUES
(1, NULL, 'Aplikasi Mobile', 'Project pengembangan aplikasi mobile menggunakan MIT App Inventor, Kodular, atau Flutter.', '9', NULL, NULL, 1, '2026-04-12 23:27:39', '2026-04-12 23:27:39'),
(2, NULL, 'Project Website', 'Project pengembangan website menggunakan HTML, CSS, JS atau CMS.', '7', NULL, NULL, 1, '2026-04-12 23:27:39', '2026-04-12 23:27:39'),
(3, 2, 'Final Project', 'pengerjaan final project deadline 5 hari', NULL, NULL, NULL, 1, '2026-04-12 23:50:19', '2026-04-12 23:51:10'),
(4, 2, 'Portofolio dan CV', 'adwawdawd', NULL, NULL, NULL, 1, '2026-04-13 19:14:10', '2026-04-13 19:14:58'),
(5, 2, 'Buku Tahunan', 'testing', NULL, '2026-04-14', '2026-04-30', 1, '2026-04-14 05:18:28', '2026-04-14 05:19:17'),
(6, 2, 'Kategori Baru', NULL, NULL, NULL, NULL, 1, '2026-06-16 23:18:53', '2026-06-16 23:18:53'),
(7, 9, 'Final Project', 'Final project ini berisikan pembuatan web, aplikasi dari kelas 7 - kelas 9', NULL, '2026-06-29', '2026-07-06', 1, '2026-06-27 05:29:55', '2026-06-27 05:31:14');

-- --------------------------------------------------------

--
-- Table structure for table `project_requirements`
--

CREATE TABLE `project_requirements` (
  `id` bigint UNSIGNED NOT NULL,
  `category_id` bigint UNSIGNED NOT NULL,
  `label` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `instructions` text COLLATE utf8mb4_unicode_ci,
  `is_required` tinyint(1) NOT NULL DEFAULT '1',
  `allowed_extensions` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `max_size_mb` int NOT NULL DEFAULT '10',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `teacher_id` bigint UNSIGNED DEFAULT NULL,
  `input_config` json DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `project_requirements`
--

INSERT INTO `project_requirements` (`id`, `category_id`, `label`, `slug`, `type`, `instructions`, `is_required`, `allowed_extensions`, `max_size_mb`, `created_at`, `updated_at`, `teacher_id`, `input_config`) VALUES
(1, 1, 'Poster Project', 'poster', 'local_file', NULL, 1, '.jpg,.jpeg,.png,.pdf', 5, '2026-04-12 23:27:39', '2026-04-12 23:27:39', NULL, NULL),
(2, 1, 'Aplikasi .APK', 'apk', 'local_file', NULL, 1, '.apk', 100, '2026-04-12 23:27:39', '2026-04-12 23:27:39', NULL, NULL),
(3, 1, 'Screenshot Aplikasi (1)', 'screenshot_1', 'local_file', NULL, 1, '.jpg,.jpeg,.png', 2, '2026-04-12 23:27:39', '2026-04-12 23:27:39', NULL, NULL),
(4, 1, 'Source Code .ZIP', 'source_zip', 'local_file', NULL, 0, '.zip', 200, '2026-04-12 23:27:39', '2026-04-12 23:27:39', NULL, NULL),
(5, 1, 'File Kodular .AIA', 'kodular_aia', 'local_file', NULL, 0, '.aia', 100, '2026-04-12 23:27:39', '2026-04-12 23:27:39', NULL, NULL),
(6, 1, 'Link Video Demo (Drive/YouTube)', 'video_link', 'link', NULL, 0, NULL, 10, '2026-04-12 23:27:39', '2026-04-12 23:27:39', NULL, NULL),
(7, 2, 'Poster Project', 'poster', 'local_file', NULL, 1, '.jpg,.jpeg,.png', 5, '2026-04-12 23:27:39', '2026-04-12 23:27:39', NULL, NULL),
(8, 2, 'Link Website / Demo', 'website_link', 'link', NULL, 1, NULL, 10, '2026-04-12 23:27:39', '2026-04-12 23:27:39', NULL, NULL),
(9, 2, 'Source Code (GitHub/Drive)', 'source_code_link', 'link', NULL, 1, NULL, 10, '2026-04-12 23:27:39', '2026-04-12 23:27:39', NULL, NULL),
(14, 4, 'Flyer', 'flyer', 'local_file', NULL, 1, '.pdf,.jpg,.png', 5, '2026-04-13 19:15:01', '2026-06-16 23:19:14', NULL, NULL),
(15, 4, 'Youtube', 'youtube', 'link', NULL, 1, NULL, 5, '2026-04-13 19:15:01', '2026-04-13 19:15:01', NULL, NULL),
(16, 5, 'Requirement Baru', 'requirement-baru', 'local_file', NULL, 1, '.zip, .pdf', 5, '2026-04-14 05:19:18', '2026-04-14 05:19:18', NULL, NULL),
(17, 5, 'Requirement Baru', 'requirement-baru', 'link', NULL, 1, NULL, 5, '2026-04-14 05:19:18', '2026-04-14 05:19:18', NULL, NULL),
(18, 3, 'Upload web', 'upload-web', 'local_file', NULL, 1, '.pdf,.docx,.svg,.mp3', 5, '2026-06-16 23:16:52', '2026-06-16 23:16:52', NULL, NULL),
(21, 7, 'Flyer', 'flyer', 'local_file', NULL, 1, '.pdf,.png,.jpeg,.jpg,.webp', 5, '2026-06-27 05:31:14', '2026-06-27 05:31:14', NULL, NULL),
(22, 7, 'Requirement Baru', 'requirement-baru', 'link', NULL, 1, NULL, 5, '2026-06-27 05:31:14', '2026-06-27 05:31:14', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `project_submissions`
--

CREATE TABLE `project_submissions` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `category_id` bigint UNSIGNED DEFAULT NULL,
  `judul_project` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `deskripsi_project` text COLLATE utf8mb4_unicode_ci,
  `teknologi_digunakan` json DEFAULT NULL,
  `nama_pembimbing` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('draft','submitted','under_review','revision','approved','skl_issued') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft',
  `submitted_at` timestamp NULL DEFAULT NULL,
  `reviewed_at` timestamp NULL DEFAULT NULL,
  `skl_issued_at` timestamp NULL DEFAULT NULL,
  `is_locked` tinyint(1) NOT NULL DEFAULT '0',
  `guru_reviewer_id` bigint UNSIGNED DEFAULT NULL,
  `skl_drive_link` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `catatan_guru` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `project_submissions`
--

INSERT INTO `project_submissions` (`id`, `user_id`, `category_id`, `judul_project`, `slug`, `deskripsi_project`, `teknologi_digunakan`, `nama_pembimbing`, `status`, `submitted_at`, `reviewed_at`, `skl_issued_at`, `is_locked`, `guru_reviewer_id`, `skl_drive_link`, `catatan_guru`, `created_at`, `updated_at`) VALUES
(1, 4, 3, 'Final Project - Ahmad Fauzi', 'final-project-ahmad-fauzi', NULL, NULL, NULL, 'approved', '2026-04-12 23:53:10', '2026-04-14 05:40:57', NULL, 0, 2, NULL, 'file error', '2026-04-12 23:53:10', '2026-04-14 05:40:57'),
(2, 4, 4, 'Portofolio dan CV - Ahmad Fauzi', 'portofolio-dan-cv-ahmad-fauzi', NULL, NULL, NULL, 'revision', '2026-06-16 23:22:30', '2026-06-16 23:29:12', NULL, 0, 9, NULL, 'flyer tidak sesuai', '2026-06-16 23:22:30', '2026-06-16 23:29:12');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('4Fu81oYnI5rjiYhIeYDJhWkRcBQ4kaPWKcFdYkd4', NULL, '127.0.0.1', 'curl/8.12.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTldvTldBbGRpNVo0dE5FVlBSZThacWM4M0hZa1QwSTVIdTJLcEVYVCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1781758897),
('5Vx4VCdr76Vi2FnjtrzbmkiyN6HFIokiIjE2432D', NULL, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Mobile Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiaGVobnhTaGlQUk1tWjViZjA2Q01nYjZFcVAzSG5HeWJ6eXpxdnl3ciI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDI6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvcHVibGljL2lkbi1zdGF0cyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1781758973),
('7OwiId7QfuTtTHqA6KdeahgSS5jLexDuqPhnqRKX', NULL, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Mobile Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibWd2aXpnYU9YWUNRS1E0VFZIa2lOZk5sZldBcU1VRWF5NEl3bGlUcyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDI6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvcHVibGljL2lkbi1zdGF0cyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1781758974),
('8Nm27dUt1kGG6UfjdzxJltdIXO4Xa2i7EYf6XH2k', NULL, '127.0.0.1', 'curl/8.12.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNnNiQ3RrYldrUGtVWVMyRXhnSWl0b2JaaDBPd0tsSkljQXFQUXl6bSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDI6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvcHVibGljL2lkbi1zdGF0cyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1781758985),
('9iiMsG7dqXIAoPRtHFKWxf9v2DW476RMmGGasL5G', NULL, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Mobile Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicHBuRVl5Q01YOGN4SVZDakhMR2hBN3BQOTFCSFUwZ1NJQVdOUUhuTCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDI6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvcHVibGljL2lkbi1zdGF0cyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1781759009),
('dj8G9hNxB7c4nzyt0laA6EC7SHX60XDrFwKltRWu', NULL, '127.0.0.1', 'curl/8.12.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVlJZVHlJR2lUOFFIa1dqRW9jVmxnN2dKSldZblVhaVduNkJHTkllRCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1781758961),
('dui0lzsWwY3Ik3fqeul8E4beUnMQa7JBqxxgznPT', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUWdsVEJ5QU9wNldHSEl2TXdmUWxHMDVGRWlRMmhJS0IyaG9pNVo3biI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDI6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvcHVibGljL2lkbi1zdGF0cyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1781741356),
('l2NXFXnFl5l9w9WcoNsI1pQnyqr5t9Sy6AsHQN45', NULL, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Mobile Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoicVd4UTJPU1BXZXBuSWs3YVc3bGJHU0w4azlkNzdZZ1h2b3c3SmJJayI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1781759028),
('LYGqjRHGTYvkmW3xQGlGJRng7GPRfkqOXwvr6fmg', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiazdUTlhibUJ6WlYyRUN3cm5adEFZakl2WW1qdlJTOG10ZW83bFFWcSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDI6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvcHVibGljL2lkbi1zdGF0cyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1781681871),
('N891hMrjbe8gm8r7jWAH72QitAjUKzdWmquWrb5m', 9, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRDVaZVhrTmMxUHV3dWNpb3FadzFjN3hIWDh3ZW5zWDRHelZNOFp0VCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NzA6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvZ3VydS9zdWJtaXNzaW9ucz9wZXJfcGFnZT01JnN0YXR1cz1zdWJtaXR0ZWQiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1781678325),
('qQwdl6Vdkg5YkyY1k5ISRX7u8gh9lQBLPwnh08f9', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiR0xack11REJFdmlqdmIwb0pudGxNdmFMcUVIN0tRUTNVYlRIOHFWYyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDI6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvcHVibGljL2lkbi1zdGF0cyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1781741311),
('tM93VtAG4gSV0096jOdzjxMHolM8ve8ZPo5liWWZ', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSEJFVjJxd0NIdGhvcG90MktYMTlYQ3YzOEppSXYxOGNxc2lSWXNjNyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1782487253),
('wQnT5nWcwfSVdHw9BSzRLblJOBucnHqeQMyXVjtE', NULL, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Mobile Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiV2Z6MDF5S0xpY1VJVnROUzVyWmsxcXp3WGxQTnc3blZHc2RkU0Z6QiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDI6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvcHVibGljL2lkbi1zdGF0cyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1781759010);

-- --------------------------------------------------------

--
-- Table structure for table `student_groups`
--

CREATE TABLE `student_groups` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `wali_kelas_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `student_groups`
--

INSERT INTO `student_groups` (`id`, `name`, `description`, `wali_kelas_id`, `created_at`, `updated_at`) VALUES
(1, 'Kelas 9', 'ini untuk kelas 9', 9, '2026-04-12 23:49:18', '2026-06-16 21:33:46');

-- --------------------------------------------------------

--
-- Table structure for table `student_group_user`
--

CREATE TABLE `student_group_user` (
  `id` bigint UNSIGNED NOT NULL,
  `student_group_id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `student_group_user`
--

INSERT INTO `student_group_user` (`id`, `student_group_id`, `user_id`, `created_at`, `updated_at`) VALUES
(1, 1, 4, NULL, NULL),
(2, 1, 5, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `student_incomes`
--

CREATE TABLE `student_incomes` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `transaction_date` date NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `file_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `input_by` bigint UNSIGNED NOT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `student_incomes`
--

INSERT INTO `student_incomes` (`id`, `user_id`, `amount`, `transaction_date`, `description`, `file_path`, `input_by`, `deleted_at`, `created_at`, `updated_at`) VALUES
(1, 4, '250000.00', '2026-06-26', 'nabung bulan ini', NULL, 9, NULL, '2026-06-26 08:27:13', '2026-06-26 08:27:13'),
(2, 4, '900000.00', '2026-06-26', 'tabungan bulan ini', 'income-proof/6a3e9d8056f9c.webp', 9, NULL, '2026-06-26 08:40:49', '2026-06-26 08:40:49'),
(3, 5, '300000.00', '2026-06-27', 'tabungan tanggal sekian', 'income-proof/6a3fc2f41caef.webp', 9, NULL, '2026-06-27 05:32:54', '2026-06-27 05:32:54');

-- --------------------------------------------------------

--
-- Table structure for table `submission_files`
--

CREATE TABLE `submission_files` (
  `id` bigint UNSIGNED NOT NULL,
  `submission_id` bigint UNSIGNED NOT NULL,
  `requirement_id` bigint UNSIGNED DEFAULT NULL,
  `file_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `link_url` text COLLATE utf8mb4_unicode_ci,
  `file_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file_size` bigint UNSIGNED DEFAULT NULL,
  `mime_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `submission_files`
--

INSERT INTO `submission_files` (`id`, `submission_id`, `requirement_id`, `file_type`, `file_path`, `link_url`, `file_name`, `file_size`, `mime_type`, `metadata`, `created_at`, `updated_at`) VALUES
(1, 1, NULL, 'flyer', 'submissions/1/flyer/surat-pelaksanaan-tka-sulingjar-th-2026_1776063190.pdf', NULL, 'Surat pelaksanaan TKA & Sulingjar Th. 2026.pdf', 1237225, 'application/pdf', NULL, '2026-04-12 23:53:10', '2026-04-12 23:53:10'),
(2, 1, NULL, 'video', 'https://docs.google.com/spreadsheets/d/15jNPdzMlekvkQo4bo6DwBIidcMg5aGP8KrUi_ouEui4/edit?gid=574583478#gid=574583478', 'https://docs.google.com/spreadsheets/d/15jNPdzMlekvkQo4bo6DwBIidcMg5aGP8KrUi_ouEui4/edit?gid=574583478#gid=574583478', 'Video', NULL, 'text/url', NULL, '2026-04-12 23:53:10', '2026-04-12 23:53:10'),
(3, 2, 14, 'flyer', 'submissions/2/flyer/chatgpt-image-jun-16-2026-07-44-32-pm_1781677350.png', NULL, 'ChatGPT Image Jun 16, 2026, 07_44_32 PM.png', 2206374, 'image/png', NULL, '2026-06-16 23:22:30', '2026-06-16 23:22:30'),
(4, 2, 15, 'youtube', 'http://127.0.0.1:5173/siswa/submission/create?category_id=4', 'http://127.0.0.1:5173/siswa/submission/create?category_id=4', 'Youtube', NULL, 'text/url', NULL, '2026-06-16 23:22:31', '2026-06-16 23:22:31');

-- --------------------------------------------------------

--
-- Table structure for table `system_settings`
--

CREATE TABLE `system_settings` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` text COLLATE utf8mb4_unicode_ci,
  `updated_by` bigint UNSIGNED DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `system_settings`
--

INSERT INTO `system_settings` (`key`, `value`, `updated_by`, `updated_at`) VALUES
('academic_year', '2025/2026', 1, '2026-06-16 22:48:34'),
('allowed_classes', '[\"XII RPL 1\",\"XII RPL 2\",\"XII MM 1\",\"XII MM 2\",\"XII TKJ 1\"]', 1, '2026-06-16 22:48:34'),
('chat_allowed_file_types', '[\"jpg\",\"jpeg\",\"png\",\"gif\",\"pdf\",\"doc\",\"docx\",\"xls\",\"xlsx\",\"zip\",\"rar\"]', 1, '2026-06-16 22:48:34'),
('chat_enabled', 'true', 1, '2026-06-16 22:48:34'),
('chat_file_upload_enabled', 'true', 1, '2026-06-16 22:48:34'),
('chat_max_file_size_mb', '10', 1, '2026-06-16 22:48:34'),
('headmaster_name', 'Ifam', 1, '2026-06-16 22:48:34'),
('headmaster_nip', NULL, 1, '2026-06-16 22:48:34'),
('max_file_size_mb', '500', 1, '2026-06-16 22:48:34'),
('registration_open', 'true', 1, '2026-06-16 22:48:34'),
('school_logo', NULL, 1, '2026-06-16 22:48:34'),
('school_name', 'IDN Boarding School', 1, '2026-06-16 22:48:34');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `google_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `specialty` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nis` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nip` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `kelas` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `angkatan` year DEFAULT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `permissions` json DEFAULT NULL,
  `last_activity_at` timestamp NULL DEFAULT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `lock_enabled` tinyint(1) NOT NULL DEFAULT '0',
  `lock_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'pin or pattern',
  `lock_code` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `google_id`, `email_verified_at`, `password`, `role`, `specialty`, `nis`, `nip`, `kelas`, `angkatan`, `phone`, `avatar`, `is_active`, `permissions`, `last_activity_at`, `remember_token`, `created_at`, `updated_at`, `lock_enabled`, `lock_type`, `lock_code`) VALUES
(1, 'Admin SKL', 'admin@skl.test', NULL, NULL, '$2y$12$n1g00AIwihth0z4Csu4F6eBbfAnIuXDFizNKQEGQrrN6gG3A5OSOq', 'superadmin', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, '2026-06-30 03:57:11', NULL, '2026-04-12 23:27:36', '2026-06-30 03:57:11', 1, 'pattern', '$2y$12$v8/3AByisbjSBg1LkUB7Pu/SfHZIha56aHyzdxL0h3Efgaay2VZTq'),
(2, 'Pak Budi Santoso', 'guru@skl.test', NULL, NULL, '$2y$12$NEtlCfl7XwYIs3tWUsyuD.vh4/be97ZR/IF65s8YedHIch.vbOKmi', 'guru', 'IT', NULL, '198501012010011001', NULL, NULL, NULL, NULL, 1, NULL, '2026-06-16 23:25:27', NULL, '2026-04-12 23:27:36', '2026-06-16 23:25:27', 0, NULL, NULL),
(3, 'Bu Siti Rahayu', 'guru2@skl.test', NULL, NULL, '$2y$12$mWd3pwcmf/ivnhnU48HCkO0oSJybQ7fs93sgV4RLD86Dgq8BrkzBe', 'guru', NULL, NULL, '198702032012012002', NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, '2026-04-12 23:27:37', '2026-04-12 23:27:37', 0, NULL, NULL),
(4, 'Ahmad Fauzi', 'siswa@skl.test', NULL, NULL, '$2y$12$ncVh9lfqkaH3u4iDs0UAoepEIT3tGGCyjuZSwykmp4cCK.bG.y5V6', 'siswa', NULL, '2024001', NULL, '9', 2024, NULL, NULL, 1, NULL, '2026-06-27 06:09:20', NULL, '2026-04-12 23:27:37', '2026-06-27 06:09:20', 1, 'pin', '$2y$12$uyIPNVE9PS5eM5qggcd1quZ3Hb0/PRV7irjpIEf7PkT6RkHwXFUau'),
(5, 'Siti Nurhaliza', 'siswa2@skl.test', NULL, NULL, '$2y$12$dZtfkXVUMeZLzIcyX/U0kesS8hz4xZ8loEMOZcDvLd6vtnJK5bKwK', 'siswa', NULL, '2024002', NULL, '9', 2024, NULL, NULL, 1, NULL, NULL, NULL, '2026-04-12 23:27:38', '2026-04-12 23:27:38', 0, NULL, NULL),
(6, 'Budi Prakoso', 'siswa3@skl.test', NULL, NULL, '$2y$12$RcKhZBfxIWr2yZ6tywA7RO8lxtIVBC.UHXb7eyPTs.6m/GoTbWRde', 'siswa', NULL, '2024003', NULL, '7', 2024, NULL, NULL, 1, NULL, NULL, NULL, '2026-04-12 23:27:38', '2026-04-12 23:27:38', 0, NULL, NULL),
(7, 'Dewi Lestari', 'siswa4@skl.test', NULL, NULL, '$2y$12$54AubDpRp37ULY7VmBA6/eNHyZoxsDUxgnBBROE8N2OCASIv3VmWu', 'siswa', NULL, '2024004', NULL, '7', 2024, NULL, NULL, 1, NULL, NULL, NULL, '2026-04-12 23:27:39', '2026-04-29 00:50:42', 0, NULL, NULL),
(8, 'Rizky Ramadhan', 'siswa5@skl.test', NULL, NULL, '$2y$12$XorePX/DJlIBSyqo/fOKsuusO345xYzkwBSpIspdHgAHEvyD1S7Ga', 'siswa', NULL, '2024005', NULL, '8', 2024, NULL, NULL, 1, NULL, NULL, NULL, '2026-04-12 23:27:39', '2026-04-12 23:27:39', 0, NULL, NULL),
(9, 'Reyhan Nazera Rusmana', 'reyhannr@idn.sch.id', '102613613208803604227', NULL, '$2y$12$Zt9qZpQDUAE4uD18dMV3Q.6DTZLNxv2QiHaUPHQfI0QjPmTvmgCp6', 'guru', NULL, NULL, NULL, NULL, NULL, NULL, 'https://lh3.googleusercontent.com/a/ACg8ocKG8hll-9BlCA9FO58Zx5G8FTr9jiMWCv8jHU4NWmmfCGbU-A=s96-c', 1, NULL, '2026-06-30 09:46:36', NULL, '2026-04-29 00:23:51', '2026-06-30 09:46:36', 0, NULL, NULL),
(10, 'Qoerbanesia', 'qoerbanesia@gmail.com', '100488923677968035628', NULL, '$2y$12$fyY/2kxxHw/CLNDaDgn7OeeLVCi11t6Kj1WY1Bd4DzOjicXXqc/Fu', 'siswa', NULL, NULL, NULL, NULL, NULL, NULL, 'https://lh3.googleusercontent.com/a/ACg8ocIfKKeQzfooJ0a0glQmnuqZ1a8-tINsE3At84AOZWPz4PGpqHY=s96-c', 0, NULL, NULL, NULL, '2026-04-29 06:27:28', '2026-06-16 23:10:30', 0, NULL, NULL),
(12, 'Admin IDN', 'admin@idnbogor.id', NULL, NULL, '$2y$12$QaIf4YOsnH3kM0trvvVQEuZQCmFITNpfUd03qAepTsN2W6XG5mlKu', 'idn', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '{\"dashboard\": [\"view\"]}', '2026-06-27 06:10:09', NULL, '2026-06-16 23:46:56', '2026-06-27 06:10:09', 0, NULL, NULL),
(13, 'Reyhan Nazera Rusmana', 'reyhannr.xmia6@gmail.com', '112214477551622746120', NULL, '$2y$12$x0qL6zzTkrr70YsxhmPJ9uEl7RqmfEeq.Rrnms08SWUIp8iV8tRVG', 'siswa', NULL, NULL, NULL, NULL, NULL, NULL, 'https://lh3.googleusercontent.com/a/ACg8ocIQKsm2XzwlO3HirMSzBk-W4Gt_4P4-ipG-_UQIAT2uC7XnQHYc=s96-c', 1, NULL, NULL, NULL, '2026-06-26 07:55:23', '2026-06-27 05:24:15', 0, NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `activity_logs_user_id_foreign` (`user_id`);

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_expiration_index` (`expiration`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_locks_expiration_index` (`expiration`);

--
-- Indexes for table `chat_groups`
--
ALTER TABLE `chat_groups`
  ADD PRIMARY KEY (`id`),
  ADD KEY `chat_groups_created_by_foreign` (`created_by`);

--
-- Indexes for table `chat_group_members`
--
ALTER TABLE `chat_group_members`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `chat_group_members_group_id_user_id_unique` (`group_id`,`user_id`),
  ADD KEY `chat_group_members_user_id_foreign` (`user_id`);

--
-- Indexes for table `chat_messages`
--
ALTER TABLE `chat_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `chat_messages_sender_id_foreign` (`sender_id`),
  ADD KEY `chat_messages_group_id_index` (`group_id`),
  ADD KEY `chat_messages_created_at_index` (`created_at`),
  ADD KEY `chat_messages_is_pinned_index` (`is_pinned`),
  ADD KEY `chat_messages_is_deleted_index` (`is_deleted`);

--
-- Indexes for table `checklist_reviews`
--
ALTER TABLE `checklist_reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `checklist_reviews_submission_id_foreign` (`submission_id`),
  ADD KEY `checklist_reviews_guru_id_foreign` (`guru_id`);

--
-- Indexes for table `class_teacher`
--
ALTER TABLE `class_teacher`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `class_teacher_student_group_id_user_id_unique` (`student_group_id`,`user_id`),
  ADD KEY `class_teacher_user_id_foreign` (`user_id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `idn_school_visits`
--
ALTER TABLE `idn_school_visits`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `idn_students`
--
ALTER TABLE `idn_students`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_reserved_at_available_at_index` (`queue`,`reserved_at`,`available_at`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `lomba`
--
ALTER TABLE `lomba`
  ADD PRIMARY KEY (`id`),
  ADD KEY `lomba_created_by_foreign` (`created_by`);

--
-- Indexes for table `lomba_foto`
--
ALTER TABLE `lomba_foto`
  ADD PRIMARY KEY (`id`),
  ADD KEY `lomba_foto_lomba_id_foreign` (`lomba_id`);

--
-- Indexes for table `lomba_pendamping`
--
ALTER TABLE `lomba_pendamping`
  ADD PRIMARY KEY (`id`),
  ADD KEY `lomba_pendamping_lomba_id_foreign` (`lomba_id`),
  ADD KEY `lomba_pendamping_user_id_foreign` (`user_id`);

--
-- Indexes for table `lomba_peserta`
--
ALTER TABLE `lomba_peserta`
  ADD PRIMARY KEY (`id`),
  ADD KEY `lomba_peserta_lomba_tim_id_foreign` (`lomba_tim_id`),
  ADD KEY `lomba_peserta_user_id_foreign` (`user_id`);

--
-- Indexes for table `lomba_tim`
--
ALTER TABLE `lomba_tim`
  ADD PRIMARY KEY (`id`),
  ADD KEY `lomba_tim_lomba_id_foreign` (`lomba_id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `notifications_user_id_foreign` (`user_id`),
  ADD KEY `notifications_related_submission_id_foreign` (`related_submission_id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Indexes for table `project_categories`
--
ALTER TABLE `project_categories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `project_categories_guru_id_foreign` (`guru_id`);

--
-- Indexes for table `project_requirements`
--
ALTER TABLE `project_requirements`
  ADD PRIMARY KEY (`id`),
  ADD KEY `project_requirements_category_id_foreign` (`category_id`),
  ADD KEY `project_requirements_teacher_id_foreign` (`teacher_id`);

--
-- Indexes for table `project_submissions`
--
ALTER TABLE `project_submissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `project_submissions_slug_unique` (`slug`),
  ADD KEY `project_submissions_user_id_foreign` (`user_id`),
  ADD KEY `project_submissions_guru_reviewer_id_foreign` (`guru_reviewer_id`),
  ADD KEY `project_submissions_category_id_foreign` (`category_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `student_groups`
--
ALTER TABLE `student_groups`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_groups_guru_id_foreign` (`wali_kelas_id`);

--
-- Indexes for table `student_group_user`
--
ALTER TABLE `student_group_user`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_group_user_student_group_id_foreign` (`student_group_id`),
  ADD KEY `student_group_user_user_id_foreign` (`user_id`);

--
-- Indexes for table `student_incomes`
--
ALTER TABLE `student_incomes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_incomes_input_by_foreign` (`input_by`),
  ADD KEY `student_incomes_user_id_index` (`user_id`),
  ADD KEY `student_incomes_transaction_date_index` (`transaction_date`),
  ADD KEY `student_incomes_deleted_at_index` (`deleted_at`);

--
-- Indexes for table `submission_files`
--
ALTER TABLE `submission_files`
  ADD PRIMARY KEY (`id`),
  ADD KEY `submission_files_submission_id_foreign` (`submission_id`),
  ADD KEY `submission_files_requirement_id_foreign` (`requirement_id`);

--
-- Indexes for table `system_settings`
--
ALTER TABLE `system_settings`
  ADD PRIMARY KEY (`key`),
  ADD KEY `system_settings_updated_by_foreign` (`updated_by`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD UNIQUE KEY `users_google_id_unique` (`google_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activity_logs`
--
ALTER TABLE `activity_logs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=242;

--
-- AUTO_INCREMENT for table `chat_groups`
--
ALTER TABLE `chat_groups`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `chat_group_members`
--
ALTER TABLE `chat_group_members`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `chat_messages`
--
ALTER TABLE `chat_messages`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `checklist_reviews`
--
ALTER TABLE `checklist_reviews`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `class_teacher`
--
ALTER TABLE `class_teacher`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `idn_school_visits`
--
ALTER TABLE `idn_school_visits`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `idn_students`
--
ALTER TABLE `idn_students`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `lomba`
--
ALTER TABLE `lomba`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `lomba_foto`
--
ALTER TABLE `lomba_foto`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `lomba_pendamping`
--
ALTER TABLE `lomba_pendamping`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `lomba_peserta`
--
ALTER TABLE `lomba_peserta`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `lomba_tim`
--
ALTER TABLE `lomba_tim`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=240;

--
-- AUTO_INCREMENT for table `project_categories`
--
ALTER TABLE `project_categories`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `project_requirements`
--
ALTER TABLE `project_requirements`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `project_submissions`
--
ALTER TABLE `project_submissions`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `student_groups`
--
ALTER TABLE `student_groups`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `student_group_user`
--
ALTER TABLE `student_group_user`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `student_incomes`
--
ALTER TABLE `student_incomes`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `submission_files`
--
ALTER TABLE `submission_files`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD CONSTRAINT `activity_logs_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `chat_groups`
--
ALTER TABLE `chat_groups`
  ADD CONSTRAINT `chat_groups_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `chat_group_members`
--
ALTER TABLE `chat_group_members`
  ADD CONSTRAINT `chat_group_members_group_id_foreign` FOREIGN KEY (`group_id`) REFERENCES `chat_groups` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `chat_group_members_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `chat_messages`
--
ALTER TABLE `chat_messages`
  ADD CONSTRAINT `chat_messages_group_id_foreign` FOREIGN KEY (`group_id`) REFERENCES `chat_groups` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `chat_messages_sender_id_foreign` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `checklist_reviews`
--
ALTER TABLE `checklist_reviews`
  ADD CONSTRAINT `checklist_reviews_guru_id_foreign` FOREIGN KEY (`guru_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `checklist_reviews_submission_id_foreign` FOREIGN KEY (`submission_id`) REFERENCES `project_submissions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `class_teacher`
--
ALTER TABLE `class_teacher`
  ADD CONSTRAINT `class_teacher_student_group_id_foreign` FOREIGN KEY (`student_group_id`) REFERENCES `student_groups` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `class_teacher_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `lomba`
--
ALTER TABLE `lomba`
  ADD CONSTRAINT `lomba_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `lomba_foto`
--
ALTER TABLE `lomba_foto`
  ADD CONSTRAINT `lomba_foto_lomba_id_foreign` FOREIGN KEY (`lomba_id`) REFERENCES `lomba` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `lomba_pendamping`
--
ALTER TABLE `lomba_pendamping`
  ADD CONSTRAINT `lomba_pendamping_lomba_id_foreign` FOREIGN KEY (`lomba_id`) REFERENCES `lomba` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `lomba_pendamping_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `lomba_peserta`
--
ALTER TABLE `lomba_peserta`
  ADD CONSTRAINT `lomba_peserta_lomba_tim_id_foreign` FOREIGN KEY (`lomba_tim_id`) REFERENCES `lomba_tim` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `lomba_peserta_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `lomba_tim`
--
ALTER TABLE `lomba_tim`
  ADD CONSTRAINT `lomba_tim_lomba_id_foreign` FOREIGN KEY (`lomba_id`) REFERENCES `lomba` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_related_submission_id_foreign` FOREIGN KEY (`related_submission_id`) REFERENCES `project_submissions` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `notifications_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `project_categories`
--
ALTER TABLE `project_categories`
  ADD CONSTRAINT `project_categories_guru_id_foreign` FOREIGN KEY (`guru_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `project_requirements`
--
ALTER TABLE `project_requirements`
  ADD CONSTRAINT `project_requirements_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `project_categories` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `project_requirements_teacher_id_foreign` FOREIGN KEY (`teacher_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `project_submissions`
--
ALTER TABLE `project_submissions`
  ADD CONSTRAINT `project_submissions_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `project_categories` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `project_submissions_guru_reviewer_id_foreign` FOREIGN KEY (`guru_reviewer_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `project_submissions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `student_groups`
--
ALTER TABLE `student_groups`
  ADD CONSTRAINT `student_groups_guru_id_foreign` FOREIGN KEY (`wali_kelas_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `student_group_user`
--
ALTER TABLE `student_group_user`
  ADD CONSTRAINT `student_group_user_student_group_id_foreign` FOREIGN KEY (`student_group_id`) REFERENCES `student_groups` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `student_group_user_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `student_incomes`
--
ALTER TABLE `student_incomes`
  ADD CONSTRAINT `student_incomes_input_by_foreign` FOREIGN KEY (`input_by`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `student_incomes_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `submission_files`
--
ALTER TABLE `submission_files`
  ADD CONSTRAINT `submission_files_requirement_id_foreign` FOREIGN KEY (`requirement_id`) REFERENCES `project_requirements` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `submission_files_submission_id_foreign` FOREIGN KEY (`submission_id`) REFERENCES `project_submissions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `system_settings`
--
ALTER TABLE `system_settings`
  ADD CONSTRAINT `system_settings_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
