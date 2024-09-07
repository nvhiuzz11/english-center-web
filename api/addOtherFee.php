<?php


require '../lib/functionFin_OtherFee.php';

    $ten = trim($_POST['name']);
    $thang = $_POST['month'];
    $nam = $_POST['year'];
    $thoiGian = $thang . "/" . $nam;
    $loaiHD  =  $_POST['kind'];
    $soTien  =  $_POST['money'];
    $soTien =  str_replace(',', '', $soTien);

    $tt  =  $_POST['status'];
    if ($tt == 'Đã thanh toán') {
        $tgtt = date('Y-m-d');
    } else
        $tgtt = null;

    insertChiPhiKhac($connection, $ten, $loaiHD, $thoiGian, $soTien, $tgtt, $tt);
