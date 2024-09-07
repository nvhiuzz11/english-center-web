<?php

require '../lib/functionFinance.php';

    $updatedData = json_decode($_POST['updatedData'], true);
    $totalAmount = $_POST['totalAmount'];
    $remainingFee = $_POST['remainingFee'];

    $mahd = $_POST['maHD'];

    $listTHPbyMaHD = selectLSTHPbyMaHD($connection, $mahd);

    foreach ($listTHPbyMaHD as $a) {
        $check = true;
        foreach ($updatedData as $data) {
            $maGD = $data['maGD'];
            $ngay = $data['ngay'];
            $soTien = $data['soTien'];
            if ($a['MaGD'] == $maGD) {
                updateLSTHP($connection, $ngay, $soTien, $maGD);
                $check = false;
            }
        }
        if ($check) {
            deleteLSTHPbyMaGD($connection, $a['MaGD']);
        }
    }
    if ($totalAmount == 0) {
        $tt = 'Chưa đóng';
    } else {
        if ($remainingFee <= 0) {
            $tt = 'Hoàn thành';
        } else {
            $tt = 'Còn nợ';
        }
    }
    updateHDTHP_addLSTHP($connection, $totalAmount, $remainingFee, $tt, $mahd);

    $result = [
        "hoadon" =>  listBillHP($connection),
        "lsthp" => listLSTHP($connection),
    ];
    
    echo json_encode($result);
