<?php
    require '../lib/functionFin_History.php';
    $key = trim($_POST['key']);
    $collumSort = $_POST['collumSort'];
    $order =  $_POST['order'];
    $listBill = searchHistory($connection, $key,$collumSort,$order);
    print_r(json_encode($listBill)) ;


