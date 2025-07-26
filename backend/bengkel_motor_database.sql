DROP DATABASE IF EXISTS bengkel_motor_database;
CREATE DATABASE IF NOT EXISTS bengkel_motor_database;
USE bengkel_motor_database;

CREATE TABLE `pelanggan` (
  `id_pelanggan` int AUTO_INCREMENT PRIMARY KEY NOT NULL,
  `nama` varchar(128) NOT NULL,
  `nohp` varchar(20) UNIQUE NOT NULL
);

INSERT INTO `pelanggan` (`nama`, `nohp`) VALUES
('Acep', '08123456789'),
('Melvin', '08123456788');

CREATE TABLE `antrian` (
  `id_antrian` int AUTO_INCREMENT PRIMARY KEY NOT NULL,
  `id_pelanggan` int NOT NULL REFERENCES pelanggan(`id_pelanggan`),
  `merk` varchar(128) NOT NULL,
  `tipe` varchar(128) NOT NULL,
  `plat_nomor` varchar(16) NOT NULL,
  `tanggal` date NOT NULL,
  `status` enum('Menunggu','Diproses','Selesai') NOT NULL
);

INSERT INTO `antrian` (`id_pelanggan`, `merk`, `tipe`, `plat_nomor`, `tanggal`, `status`) VALUES
(1, 'Honda', 'Beat', 'D1234XYZ', '2025-08-16', 'Diproses'),
(2, 'Yamaha', 'NMAX', 'D1234YYZ', '2025-08-17', 'Menunggu');

CREATE TABLE `kategori_kerusakan` (
  `id_kategori` int AUTO_INCREMENT PRIMARY KEY NOT NULL,
  `nama_kategori` varchar(64) NOT NULL
);

INSERT INTO `kategori_kerusakan` (`nama_kategori`) VALUES
('Sistem Mesin & Performa'),
('Roda & Suspensi'),
('Body & Aksesori'),
('Sistem Rem'),
('Kelistrikan & Lampu'),
('Transmisi & Kaki-Kaki'),
('Layanan Tambahan');

CREATE TABLE `kerusakan` (
  `id_kerusakan` int AUTO_INCREMENT PRIMARY KEY NOT NULL,
  `nama_kerusakan` varchar(64) NOT NULL,
  `estimasi_biaya` float NOT NULL,
  `id_kategori` int NOT NULL REFERENCES kategori_kerusakan(`id_kerusakan`),
  `status` enum('Tersedia','Tersembunyi') NOT NULL
);

INSERT INTO `kerusakan` (`nama_kerusakan`, `estimasi_biaya`, `id_kategori`, `status`) VALUES
('Ganti oli mesin', 60000, 1, 'Tersedia'),
('Ganti oli gardan (motor matic)', 25000, 1, 'Tersedia'),
('Ganti busi', 35000, 1, 'Tersedia'),
('Ganti filter udara', 45000, 1, 'Tersedia'),
('Ganti aki', 250000, 1, 'Tersedia'),
('Servis karburator/injeksi', 120000, 1, 'Tersedia'),
('Ganti kampas kopling', 200000, 1, 'Tersedia'),
('Overhaul mesin (turun mesin)', 1500000, 1, 'Tersedia'),
('Ganti ban depan', 200000, 2, 'Tersedia'),
('Ganti ban belakang', 220000, 2, 'Tersedia'),
('Tambal ban', 15000, 2, 'Tersedia'),
('Ganti velg', 400000, 2, 'Tersedia'),
('Ganti shockbreaker depan', 300000, 2, 'Tersedia'),
('Ganti shockbreaker belakang', 350000, 2, 'Tersedia'),
('Setel roda', 30000, 2, 'Tersedia'),
('Ganti spion (1 buah)', 35000, 3, 'Tersedia'),
('Ganti bodi/sayap motor', 300000, 3, 'Tersedia'),
('Ganti jok/sadel', 120000, 3, 'Tersedia'),
('Cat ulang body motor', 800000, 3, 'Tersedia'),
('Poles body motor', 150000, 3, 'Tersedia'),
('Pasang box tambahan', 500000, 3, 'Tersedia'),
('Ganti kampas rem depan', 70000, 4, 'Tersedia'),
('Ganti kampas rem belakang', 70000, 4, 'Tersedia'),
('Ganti cakram rem', 250000, 4, 'Tersedia'),
('Ganti master rem', 200000, 4, 'Tersedia'),
('Setel rem', 15000, 4, 'Tersedia'),
('Ganti lampu depan', 45000, 5, 'Tersedia'),
('Ganti lampu belakang', 35000, 5, 'Tersedia'),
('Ganti lampu sein', 25000, 5, 'Tersedia'),
('Ganti klakson', 40000, 5, 'Tersedia'),
('Ganti kabel bodi', 300000, 5, 'Tersedia'),
('Perbaikan ECU/injeksi', 750000, 5, 'Tersedia'),
('Ganti rantai + gear set', 250000, 6, 'Tersedia'),
('Ganti V-belt (matic)', 180000, 6, 'Tersedia'),
('Ganti roller CVT', 120000, 6, 'Tersedia'),
('Ganti kampas ganda', 200000, 6, 'Tersedia'),
('Cuci motor', 25000, 7, 'Tersedia'),
('Anti karat', 150000, 7, 'Tersedia'),
('Service ringan', 100000, 7, 'Tersedia'),
('Service besar', 500000, 7, 'Tersedia');

CREATE TABLE `antrian_kerusakan` (
  `id_antrian_kerusakan` int AUTO_INCREMENT PRIMARY KEY NOT NULL,
  `id_antrian` int NOT NULL REFERENCES antrian(`id_antrian`),
  `id_kerusakan` int NOT NULL REFERENCES kerusakan(`id_kerusakan`)
);

INSERT INTO `antrian_kerusakan` (`id_antrian`, `id_kerusakan`) VALUES
(1, 17),
(1, 27),
(1, 37),
(2, 16),
(2, 26),
(2, 36),
(2, 37),
(2, 38);