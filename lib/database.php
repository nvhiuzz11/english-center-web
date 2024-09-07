<?php
define("DATABASE_SEVER", "localhost");
define("DATABASE_USER", "nmfjbsaa_englishcenter");
define("DATABASE_PASSWORD", "Li-Vh}xoD&hi");
define("DATABASE_NAME", "nmfjbsaa_englishcenter");
$connection = null;
try {
    $connection = new PDO(
        "mysql:host=" . DATABASE_SEVER . ";dbname=" . DATABASE_NAME,
        DATABASE_USER,
        DATABASE_PASSWORD,
        array(
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8", // Thiết lập mã hóa UTF-8
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
        )
    );

} catch (PDOException $e) {
    echo "Kết nối thất bại: " . $e->getMessage();
    $connection = null;
}
?>