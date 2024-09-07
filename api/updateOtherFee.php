<?php

require '../lib/functionFin_OtherFee.php';




        
    $mahd = $_POST['id'];
    $tenhd = $_POST['name'];
    $loaiHD = $_POST['kind'];
    $thang = $_POST['month'];
    $nam = $_POST['year'];
    $thoiGian = $thang . "/" . $nam;

    $soTien  =  $_POST['money'];
    $soTien =  str_replace(',', '', $soTien);
    $tt  =  $_POST['status'];

    if ($tt == 'Đã thanh toán') {
        $tgtt =  $_POST['time'];
    } else
        $tgtt = null;
        
    updateChiPhiKhac($connection,$tenhd,$loaiHD,$thoiGian,$soTien,$tt,$tgtt,$mahd);

    $listBill = listBillCPK($connection);

    print_r(json_encode($listBill)) ;
