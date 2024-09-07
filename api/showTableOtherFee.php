<?php


require '../lib/functionFin_OtherFee.php';

$key = trim($_POST['key']);
$collumSort = $_POST['collumSort'];
$order =  $_POST['order'];
$listBill = searchChiPhiKhac($connection, $key,$collumSort,$order);
print_r(json_encode($listBill)) ;