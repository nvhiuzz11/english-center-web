<?php


require '../lib/functionFin_OtherFee.php';

    


    $tt = $_POST['status'];
    $maL = $_POST['id'];

    if ($tt == 'Đã thanh toán') {
        $tg = date('Y-m-d');
    } else
        $tg = null;
    updateStatusChiPhiKhac($connection, $tt, $tg, $maL);


   
    $listBill = listBillCPK($connection);

    print_r(json_encode($listBill)) ;