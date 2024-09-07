<?php
require '../lib/functionFin_wageTea.php';


$key = trim($_POST['key']);
$collumSort = $_POST['collumSort'];
$order =  $_POST['order'];
$listBill = searchLuongGV($connection,$key,$collumSort,$order);


print_r(json_encode($listBill)) ;



