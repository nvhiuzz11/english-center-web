<?php

// include '../../lib/function.php';

// //$json = file_get_contents('php://input');

// // Chuyển đổi JSON thành mảng PHP
// $data = $_POST['body'];
// var_dump($data);

// // Lấy giá trị từ mảng
// $firstParam = $data['username'];
// $secondParam = $data['pass'];

// echo 1232;

// //checkAcount($userName, $passWord, $connection);

require '../lib/functionStudent.php';

// $data = json_decode(file_get_contents('php://input'), true);

// var_dump($data);
//echo file_get_contents('php://input');

//$listAcc = listtk_hs($connection);

//print_r(json_encode($listAcc));

$username = $_POST['username'];
$pass = $_POST['pass'];

echo $username;
