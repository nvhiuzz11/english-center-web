<?php
require '../lib/functionFinance.php';


$key = trim($_POST['key']);
$collumSort = $_POST['collumSort'];
$order =  $_POST['order'];
$listBill = searchHDHocPhi($connection, $key,$collumSort,$order);

print_r(json_encode($listBill)) ;

?>