<?php
require '../lib/functionFin_wageTea.php';


    $tt = $_POST['status'];
    $maL = $_POST['id'];

    if ($tt == 'Đã thanh toán') {
        $tg = date('Y-m-d');
    } else
        $tg = null;
    updateStatusLuonggv($connection, $tt, $tg, $maL);


    $listBill = listBillLGV($connection);

    print_r(json_encode($listBill)) ;



 


