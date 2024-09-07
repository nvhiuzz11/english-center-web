<?php

require '../lib/functionUserParent.php';
$maph = $_POST['maph'];
$key = $_POST['key'];


$listBill = searchHDHocPhi($connection, $key, $maph);

    print_r(json_encode($listBill)) ;