<?php
require '../lib/functionFin_wageTea.php';


$ten = trim($_POST['name']);
$thang = $_POST['month'];
$nam = $_POST['year'];
$thoiGian = $thang . "/" . $nam;
$teacher = $_POST['teacher'];
$mahd = $_POST['id'];

$status = $_POST['status'];
$money = $_POST['money'];
$money =  str_replace(',', '', $money);

if ($status == 'Đã thanh toán') {
    $time = $_POST['time'];
} else{
    $time = null;
}


updateLuongGV($connection,$mahd,$ten,$teacher,$thoiGian,$time,$money,$status);


$listBill = listBillLGV($connection);
print_r(json_encode($listBill)) ;


 


