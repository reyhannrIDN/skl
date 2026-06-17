-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: May 07, 2026 at 01:14 AM
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
(111, 1, 'logout', 'User logged out', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-04-29 07:02:56');

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
(2, 1, 2, 'Video', 'approved', NULL, '2026-04-14 05:40:57', '2026-04-12 23:55:56', '2026-04-14 05:40:57');

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
(26, '2026_04_29_123055_make_user_id_nullable_in_activity_logs_table', 5);

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
(1, 4, 'Kategori Project Baru', 'Guru Pak Budi Santoso telah membuat kategori project baru: \"Kategori Baru\". Silakan cek tugas Anda.', 'info', 0, NULL, '2026-04-12 23:50:19'),
(2, 5, 'Kategori Project Baru', 'Guru Pak Budi Santoso telah membuat kategori project baru: \"Kategori Baru\". Silakan cek tugas Anda.', 'info', 0, NULL, '2026-04-12 23:50:19'),
(3, 4, 'Perlu Revisi', 'Project Anda \"Final Project - Ahmad Fauzi\" perlu direvisi. Lihat catatan dari guru.', 'warning', 0, 1, '2026-04-13 00:08:04'),
(4, 4, 'Kategori Project Baru', 'Guru Pak Budi Santoso telah membuat kategori project baru: \"Kategori Baru\". Silakan cek tugas Anda.', 'info', 0, NULL, '2026-04-13 19:14:10'),
(5, 5, 'Kategori Project Baru', 'Guru Pak Budi Santoso telah membuat kategori project baru: \"Kategori Baru\". Silakan cek tugas Anda.', 'info', 0, NULL, '2026-04-13 19:14:10'),
(6, 4, 'Kategori Project Baru', 'Guru Pak Budi Santoso telah membuat kategori project baru: \"Kategori Baru\". Silakan cek tugas Anda.', 'info', 0, NULL, '2026-04-14 05:18:28'),
(7, 5, 'Kategori Project Baru', 'Guru Pak Budi Santoso telah membuat kategori project baru: \"Kategori Baru\". Silakan cek tugas Anda.', 'info', 0, NULL, '2026-04-14 05:18:28');

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
(115, 'App\\Models\\User', 1, 'refresh-token', '69a22039064d10c214e5b0a5fcb04904515b39a04644286493e0feb782b166b7', '[\"refresh\"]', NULL, '2026-05-06 07:01:27', '2026-04-29 07:01:27', '2026-04-29 07:01:27');

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
(5, 2, 'Buku Tahunan', 'testing', NULL, '2026-04-14', '2026-04-30', 1, '2026-04-14 05:18:28', '2026-04-14 05:19:17');

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
(10, 3, 'Flyer', 'flyer', 'local_file', NULL, 1, '.pdf', 5, '2026-04-12 23:51:11', '2026-04-12 23:51:11', NULL, NULL),
(11, 3, 'Video', 'video', 'link', NULL, 1, NULL, 5, '2026-04-12 23:51:11', '2026-04-12 23:51:11', NULL, NULL),
(14, 4, 'Flyer', 'flyer', 'local_file', NULL, 1, '.pdf', 5, '2026-04-13 19:15:01', '2026-04-13 19:15:01', NULL, NULL),
(15, 4, 'Youtube', 'youtube', 'link', NULL, 1, NULL, 5, '2026-04-13 19:15:01', '2026-04-13 19:15:01', NULL, NULL),
(16, 5, 'Requirement Baru', 'requirement-baru', 'local_file', NULL, 1, '.zip, .pdf', 5, '2026-04-14 05:19:18', '2026-04-14 05:19:18', NULL, NULL),
(17, 5, 'Requirement Baru', 'requirement-baru', 'link', NULL, 1, NULL, 5, '2026-04-14 05:19:18', '2026-04-14 05:19:18', NULL, NULL);

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
(1, 4, 3, 'Final Project - Ahmad Fauzi', 'final-project-ahmad-fauzi', NULL, NULL, NULL, 'approved', '2026-04-12 23:53:10', '2026-04-14 05:40:57', NULL, 0, 2, NULL, 'file error', '2026-04-12 23:53:10', '2026-04-14 05:40:57');

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
('0CWLha4LirGEJ4lLN66ppP6foqg4mLr4rY2hEwFu', NULL, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiampRd01aNmZ2WlhMOElTWDVUNnpWZDMySXRvVHlwWDNvQktjeEVCayI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9zYW5jdHVtL2NzcmYtY29va2llIjtzOjU6InJvdXRlIjtzOjE5OiJzYW5jdHVtLmNzcmYtY29va2llIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1777467970),
('2Q7oLmSc9TfCbteoOrSvnuPJTTQ5YOxQq0o1tVj1', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiV09Gb0l5QlpJdVVXcFJtdVMwaDFiT3RZakN2ZXR0azhORDFxNzlqTiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1777466646),
('3Okkt6QC1WtHatSc3CO0xzjezUTVk27OBWjq32BZ', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.22621.4391', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiNlVBalA3Z1RBajRiUkp1ZzdtSm12MzE0RDJWS3VUOXBrenhEOW1vUiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1777471234),
('40IkUGZrYRsuKVLtLguH2ChL8VYzzXWgQFbfZV6d', 1, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQ1NJRjFqdThvZ1lFa0NBMExRaXpQZmhxZUdqbG90NmdYc1pwWlZCYSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzM6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYXV0aC9tZSI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1777468068),
('7C595Ii8VGfYK5kjIiDOgnAbT2HTSlTki3c9r0pL', NULL, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRUp5U3ByRFBlQm9SVWxxNGJ0R1JZVEtkZzlOUEpocnFLRzJsY1RnciI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzM6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvYXV0aC9tZSI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1777467600),
('7qsc8gQqvG4e39Iqhq9CxsFfAyPaRzKNWcNWseox', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.22621.4391', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiS0Z5UlFXT0l6UXZqTEI4QUY2N2dmVjdqMkZNZW9MU25yUVZpT082UiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1777470865),
('7UfQcjoOa1vfVuobZNq2GX76lbQ0dtqGrrJNv0Gn', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZUY2ZHk3TlprbldjN2JCVEdhVjhpd0xSUlVBQ2s0WnhFOXRSSDBDViI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9zYW5jdHVtL2NzcmYtY29va2llIjtzOjU6InJvdXRlIjtzOjE5OiJzYW5jdHVtLmNzcmYtY29va2llIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1777467067),
('843roGeR34K9lF6HMPornxHe9azpIDYXjll11nsC', 1, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYTczT3ppYnVmTVkzSmt4UmFhZnMzZEM2NWhxN1dCRnlKMkJqTzF2MCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzM6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYXV0aC9tZSI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1777468068),
('8jmjW709AZcKSw9BS95hcWEqePvPPM5kAk8xRu1V', NULL, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYWM2Vkg4c014YVR5Nmk1eUFTdGtOMG9mMk5aaExCU2RLZDJleEpxNiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzM6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYXV0aC9tZSI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1777468066),
('8RKUYx68dE4veFzuv5jtJubvTC7RAtd5a2uYsYBw', NULL, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTFpoRFd1TFZNTlkyUGVic01DQWF4OFRlczl3Yk5SWmd0YjROVnk4MCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzM6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvYXV0aC9tZSI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1777467475),
('a9ezkBjFVCTNdOIsbvpVNblJdOwIoZ7Wid2SrT1S', NULL, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNDlaSGVic1dDT2VIYnhwRDhGNGhWZGZIbnBUNUZlQmpGWnhaNmgwTyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzM6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYXV0aC9tZSI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1777468067),
('BtwLo03Fx9IO7U6YjwA8NkRoMGgPPb2gRHyGqaYr', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSWhSMEpHSGZPbmNpTGVCenZncGVtZTRvVVExeGhBeGhENnBaNWhlZiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9zYW5jdHVtL2NzcmYtY29va2llIjtzOjU6InJvdXRlIjtzOjE5OiJzYW5jdHVtLmNzcmYtY29va2llIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1777465018),
('CmGJ3fPMhJYCweAjNJkq3qnchAsOW3Zc2MMYlxmz', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZmJUTnh6V3NOVnV2M1o3V1RhNHpsOHdhSFNsd2ZXV1dmOVNYeVYxcCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9zYW5jdHVtL2NzcmYtY29va2llIjtzOjU6InJvdXRlIjtzOjE5OiJzYW5jdHVtLmNzcmYtY29va2llIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1777466644),
('cviLk22KUP9qJDbFQmWTEz3G0PF34oO7QB0kuACs', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.22621.4391', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUDhBNkoyZ01KWGlWa0tVT0Y4OVAyOTJJOVozTWZnQ3QzWXFhYXd2NyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1777470936),
('DEat17j0xK8ZGLnM2phapj1qhioJzX7zxANoSE2b', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.22621.4391', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoibnFudFBZb2I5TDFoeE9mYkZRYWJScTBFaEZ5MWIza01wN21FY014UCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1777471058),
('fwfqebqP5Etsv15Tz8VKnMX2g2F6wZeJD6GNoeZ5', NULL, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicVk4bzhUTDk0VWRHYjRLS3B3OEc0VnVhUHdQcWtpQlZENFhLYWFxQSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzM6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvYXV0aC9tZSI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1777468067),
('gbt1JVgdBJlZtnvm2Mn047BGjz9V8EcYXEpR4FN7', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.22621.4391', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVjhOdnhOUVlOYlRwTmJVM0ZDb2xaTFExYnhvZmJmaERmOGlSMjlhcyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1777470938),
('HPENI7Zj62KEnu1x9pMHSqHvx4uRrWIpndcxbBqY', NULL, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoieFRmVUphOFE1Y1FMcDI1eWhWN1RrckZPQko5c1pMTm5JQVVvY2ozayI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9zYW5jdHVtL2NzcmYtY29va2llIjtzOjU6InJvdXRlIjtzOjE5OiJzYW5jdHVtLmNzcmYtY29va2llIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1777467964),
('iPLyrhGM9AM2YEmKgNsS6pmDXHSM0AgqdDkACgh3', NULL, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYThMckNPRUxGTHNKcUpIOVp1MmRtS0pHNUdNZlcybVNwSU9MWFRoVyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9zYW5jdHVtL2NzcmYtY29va2llIjtzOjU6InJvdXRlIjtzOjE5OiJzYW5jdHVtLmNzcmYtY29va2llIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1777468064),
('jOvCUALuymr0LpiSxAvECiReFinbcOQyivBEis5d', NULL, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiOUVlWTU3dEVWZ3E0UUJvY2c1bHlKa01uVUJza25leHdBSnVtOXVrRiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9zYW5jdHVtL2NzcmYtY29va2llIjtzOjU6InJvdXRlIjtzOjE5OiJzYW5jdHVtLmNzcmYtY29va2llIjt9fQ==', 1777466921),
('jpywEEXFGPLLBGJ9FajRbGfND17mcMBhgYpFHSx1', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiZmdlZjVXUHg5N25kakJNVVNlZVNoSE9kNHFObDI1OVJKQzk5cVY2MiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1777465019),
('NS31sf34dU7HC1RYHUHrrOFQZCxkwoa9LVkUmzJK', 1, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidnByd2F5S3RkY1dGRkRGMmlWSENEYzM1YTJFZzlLZ2x5TnN4c1R1USI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzM6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYXV0aC9tZSI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1777468068),
('pm6AsB8bwlGhoWx9yDQBKuzRYahFtg8SJnujPf4e', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYVZLdGpvc3JsSE5rdWs1QnZSWFdFbjNYdTBWa1ZvUFFsaDJHWmNSWSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9zYW5jdHVtL2NzcmYtY29va2llIjtzOjU6InJvdXRlIjtzOjE5OiJzYW5jdHVtLmNzcmYtY29va2llIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1777464979),
('qajZ1XC809avBBSYF2mPqpLB9RZKvr5WmOIcN98B', NULL, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiWnhieHFEZHowMDdJQ2N1VG1SeHRLQzYyTkJ6NnhEaGM4RDZhRjN5dSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1777468065),
('riWQgZ3AorFibbsCFJ2GgWjT2jHCWyndZ8ccxu36', NULL, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibWZBdjBwVGZXTGV1ZjlvbnBwNWJHWHJKajJRZkpVRTM4WXRzaUtYQyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDc6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvbm90aWZpY2F0aW9ucz9saW1pdD01IjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1777466479),
('rTlpEYuca56HM9NNbNBky1s0ZGQp5VVCubDWaSOe', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicnJuTnk1bHFtajVPb2lKSmRQWEVqajBBVVBodzFxMDNOUHJ3YlY4TSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTY6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvbm90aWZpY2F0aW9ucz91bnJlYWRfb25seT10cnVlIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1777470461),
('RWJS1qyj4CTn4ssEf5tCKmUhOu8XwoEV3g3vHRp6', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoicFlqaHkzcGlFOURKSU5jejAzcVhLbjNxSUpCTWZVOWpOMVFWZVBicSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1777465022),
('RZJHfqU3schgkMgmUCGTEbgug0q3V2xOhbxWRXKb', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.22621.4391', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNXBTcFNMQ2Z3QVoydWxKSnM4T1ZzRnI2d0JMc0NPUzZ2OEt0TXM4ZSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1777470862),
('Sc5y97DtHCD0Tln3D9M4WTgXvia822bEHK1uBaJx', NULL, '127.0.0.1', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiV0ZRVmhsRFB3UnVnYmhLWXJtOHFpSVRhQm8wZXBTMnRadFc4M09ERiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1777468275),
('SzbGmu0XY3MSbHEDtNGv7HjQI5qwv64TuRvCAVxU', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.22621.4391', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiRGtaMUJLWTRyVUNucnVYRTBpa1V0STZSM001d0dBcVg1d0xDV09naiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1777471012),
('Te1cE2fPpvDZ5B8jk6VyZeoDPsDGL9N1I9Igsf5L', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYXoyNW9zazZ0Mm84TDRoVjlPbW40ZnhOMjFKUm0xSGQyVXF4bUlNVCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDc6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvbm90aWZpY2F0aW9ucz9saW1pdD01IjtzOjU6InJvdXRlIjtOO319', 1777471376),
('uTDEKds0dSn6r2hcpSMbubpEZylAsbhwtFIz4I1v', NULL, '127.0.0.1', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoid1pFUEw2THoyamQ5SDR5U09Pd2pRc0l0bTFiZWJ3UjVlVzJMRUR3aCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9zYW5jdHVtL2NzcmYtY29va2llIjtzOjU6InJvdXRlIjtzOjE5OiJzYW5jdHVtLmNzcmYtY29va2llIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1777468603),
('vFw3XJkUK6fARUniIOGO9Ox06xNqvh1qSD8Fa6Jr', NULL, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiZDRYaEFTY1NLcUZzZ1hUc3ZOWm52M3daRkhQMDRtQm1BWlp6V0liTCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1777467994),
('VM9krzNm2UpdH3vcun601Ju4i3cjsMXJkAb36bZ6', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.22621.4391', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiQnpBM0tqblM0UXQ3S0E1Nno2Y2FGQnBBc292TVdZUkxFR3Q3Z0NROCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1777471335),
('vMSIhnZxw0A77zNtM7shiEXvtHqeiu5mattPEWhW', NULL, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoicVVlVjJsSmR2QmhxQ1BTeEx3aGx0Q29NTklHVzhwbHNmWk9oRnZhSyI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1777467970),
('wD9CtJRIU7OaMrG5pSstRyHXoMt3gGHv9ccUzSKa', NULL, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoicTlwelBFa2ZGQ0ZpUEpteWJrM1c4Qk9zWXVvUzlSU0d3UHNNcE1RSCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1777467965),
('wdCyKjlL2Ned5xPFufPyvGHecz2b1MFXOhZfyetq', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYjl4eEtkeEViNzE5VG1nWlVjeDJDQ3lpWmhuZko3d0lJVU5aWEFQQSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9zYW5jdHVtL2NzcmYtY29va2llIjtzOjU6InJvdXRlIjtzOjE5OiJzYW5jdHVtLmNzcmYtY29va2llIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1777465021),
('wgzipe9l6vBzKBzLYPBNM8O1OaVK0aVlSkMTd4Sz', NULL, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoibGtUbHIxcGFaSEQ1R0NpVmc1WlpEcWQyUk1IeXhTcGY3TFNtM2tUbCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1777468211),
('xErSRNS0zyZr2e7Dhl095HMKWfouoy0UgEVzMz0r', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiWm9ZZVBXQktDbmtvVGpCdXUwZ283aGR4MWNuY1hiU2FENnUyazJGeiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1777468242),
('XPaRCeGzg8bWORW4OAAKA8EHZtMwHa447NyDVhA5', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiRm0zYVpmZmM4T3RZZzNYdzlWVlhKU0dhSWp6aEppanVpQm1wU3Q2eiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1777464980),
('yDYJOHIaPK92slU4925Ujlsl8Fe6DOyUpjuuiEs9', NULL, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidk5iTFZUYVVmT2ZwdEgxc1JuakpqdWZMRGNoZ2NKRHgyNExWdG9mYiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9zYW5jdHVtL2NzcmYtY29va2llIjtzOjU6InJvdXRlIjtzOjE5OiJzYW5jdHVtLmNzcmYtY29va2llIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1777469646);

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
(1, 'Kelas 9', 'ini untuk kelas 9', 2, '2026-04-12 23:49:18', '2026-04-12 23:49:18');

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
(1, 1, 10, 'flyer', 'submissions/1/flyer/surat-pelaksanaan-tka-sulingjar-th-2026_1776063190.pdf', NULL, 'Surat pelaksanaan TKA & Sulingjar Th. 2026.pdf', 1237225, 'application/pdf', NULL, '2026-04-12 23:53:10', '2026-04-12 23:53:10'),
(2, 1, 11, 'video', 'https://docs.google.com/spreadsheets/d/15jNPdzMlekvkQo4bo6DwBIidcMg5aGP8KrUi_ouEui4/edit?gid=574583478#gid=574583478', 'https://docs.google.com/spreadsheets/d/15jNPdzMlekvkQo4bo6DwBIidcMg5aGP8KrUi_ouEui4/edit?gid=574583478#gid=574583478', 'Video', NULL, 'text/url', NULL, '2026-04-12 23:53:10', '2026-04-12 23:53:10');

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
('academic_year', '2025/2026', 1, '2026-04-12 23:27:39'),
('allowed_classes', '[\"XII RPL 1\",\"XII RPL 2\",\"XII MM 1\",\"XII MM 2\",\"XII TKJ 1\"]', 1, '2026-04-12 23:27:39'),
('max_file_size_mb', '500', 1, '2026-04-12 23:27:39'),
('registration_open', 'false', 1, '2026-04-29 04:23:01'),
('school_logo', NULL, 1, '2026-04-12 23:27:39'),
('school_name', 'SMK Digital Nusantara', 1, '2026-04-12 23:27:39');

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
  `role` enum('superadmin','guru','siswa') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'siswa',
  `specialty` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nis` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nip` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `kelas` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `angkatan` year DEFAULT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `google_id`, `email_verified_at`, `password`, `role`, `specialty`, `nis`, `nip`, `kelas`, `angkatan`, `phone`, `avatar`, `is_active`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Admin SKL', 'admin@skl.test', NULL, NULL, '$2y$12$n1g00AIwihth0z4Csu4F6eBbfAnIuXDFizNKQEGQrrN6gG3A5OSOq', 'superadmin', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, '2026-04-12 23:27:36', '2026-04-12 23:27:36'),
(2, 'Pak Budi Santoso', 'guru@skl.test', NULL, NULL, '$2y$12$NEtlCfl7XwYIs3tWUsyuD.vh4/be97ZR/IF65s8YedHIch.vbOKmi', 'guru', 'IT', NULL, '198501012010011001', NULL, NULL, NULL, NULL, 1, NULL, '2026-04-12 23:27:36', '2026-04-23 20:42:11'),
(3, 'Bu Siti Rahayu', 'guru2@skl.test', NULL, NULL, '$2y$12$mWd3pwcmf/ivnhnU48HCkO0oSJybQ7fs93sgV4RLD86Dgq8BrkzBe', 'guru', NULL, NULL, '198702032012012002', NULL, NULL, NULL, NULL, 1, NULL, '2026-04-12 23:27:37', '2026-04-12 23:27:37'),
(4, 'Ahmad Fauzi', 'siswa@skl.test', NULL, NULL, '$2y$12$ncVh9lfqkaH3u4iDs0UAoepEIT3tGGCyjuZSwykmp4cCK.bG.y5V6', 'siswa', NULL, '2024001', NULL, '9', 2024, NULL, NULL, 1, NULL, '2026-04-12 23:27:37', '2026-04-12 23:27:37'),
(5, 'Siti Nurhaliza', 'siswa2@skl.test', NULL, NULL, '$2y$12$dZtfkXVUMeZLzIcyX/U0kesS8hz4xZ8loEMOZcDvLd6vtnJK5bKwK', 'siswa', NULL, '2024002', NULL, '9', 2024, NULL, NULL, 1, NULL, '2026-04-12 23:27:38', '2026-04-12 23:27:38'),
(6, 'Budi Prakoso', 'siswa3@skl.test', NULL, NULL, '$2y$12$RcKhZBfxIWr2yZ6tywA7RO8lxtIVBC.UHXb7eyPTs.6m/GoTbWRde', 'siswa', NULL, '2024003', NULL, '7', 2024, NULL, NULL, 1, NULL, '2026-04-12 23:27:38', '2026-04-12 23:27:38'),
(7, 'Dewi Lestari', 'siswa4@skl.test', NULL, NULL, '$2y$12$54AubDpRp37ULY7VmBA6/eNHyZoxsDUxgnBBROE8N2OCASIv3VmWu', 'siswa', NULL, '2024004', NULL, '7', 2024, NULL, NULL, 1, NULL, '2026-04-12 23:27:39', '2026-04-29 00:50:42'),
(8, 'Rizky Ramadhan', 'siswa5@skl.test', NULL, NULL, '$2y$12$XorePX/DJlIBSyqo/fOKsuusO345xYzkwBSpIspdHgAHEvyD1S7Ga', 'siswa', NULL, '2024005', NULL, '8', 2024, NULL, NULL, 1, NULL, '2026-04-12 23:27:39', '2026-04-12 23:27:39'),
(9, 'Reyhan Nazera Rusmana', 'reyhannr@idn.sch.id', '102613613208803604227', NULL, '$2y$12$Zt9qZpQDUAE4uD18dMV3Q.6DTZLNxv2QiHaUPHQfI0QjPmTvmgCp6', 'guru', NULL, NULL, NULL, NULL, NULL, NULL, 'https://lh3.googleusercontent.com/a/ACg8ocKG8hll-9BlCA9FO58Zx5G8FTr9jiMWCv8jHU4NWmmfCGbU-A=s96-c', 1, NULL, '2026-04-29 00:23:51', '2026-04-29 01:01:20'),
(10, 'Qoerbanesia', 'qoerbanesia@gmail.com', '100488923677968035628', NULL, '$2y$12$fyY/2kxxHw/CLNDaDgn7OeeLVCi11t6Kj1WY1Bd4DzOjicXXqc/Fu', 'siswa', NULL, NULL, NULL, NULL, NULL, NULL, 'https://lh3.googleusercontent.com/a/ACg8ocIfKKeQzfooJ0a0glQmnuqZ1a8-tINsE3At84AOZWPz4PGpqHY=s96-c', 1, NULL, '2026-04-29 06:27:28', '2026-04-29 06:39:33');

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
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=112;

--
-- AUTO_INCREMENT for table `checklist_reviews`
--
ALTER TABLE `checklist_reviews`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

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
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=116;

--
-- AUTO_INCREMENT for table `project_categories`
--
ALTER TABLE `project_categories`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `project_requirements`
--
ALTER TABLE `project_requirements`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `project_submissions`
--
ALTER TABLE `project_submissions`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `student_groups`
--
ALTER TABLE `student_groups`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `student_group_user`
--
ALTER TABLE `student_group_user`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `submission_files`
--
ALTER TABLE `submission_files`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD CONSTRAINT `activity_logs_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

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
