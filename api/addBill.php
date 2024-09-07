<?php
require '../lib/functionFinance.php';


    $ten = trim($_POST['name']);
    $thang = $_POST['month'];
    $nam = $_POST['year'];
    $thoiGian = $thang . "/" . $nam;
    if (!empty($_POST['class'])) {
        $class = $_POST['class'];

        $arrayClass = explode(",", $class);
    }
    $listDD = attendOfMonth($connection, $thang, $nam);
    $listHS_GHP = selecths_hocPhi($connection);

    
    foreach ($listDD as $dd) {
        foreach ($listHS_GHP as $ghp) {
            foreach ($arrayClass as $a) {
                if (($dd['MaHS'] === $ghp['MaHS']) && ($dd['MaLop'] === $ghp['MaLop']) && ($dd['MaLop'] === $a)) {
                    echo($dd['MaHS']);
                    $soTien = $dd['SoBuoiDiemDanh'] * $ghp['HocPhi'];
                    $soTienGiam = round($soTien * $ghp['GiamHocPhi'] / 100);
                    $SoTienPhaiDong = $soTien - $soTienGiam;
                    insertHDHocPhi($connection, $ten, $dd['MaLop'], $dd['MaHS'], $thoiGian, $soTien, $ghp['GiamHocPhi'], $soTienGiam, $SoTienPhaiDong);
                }
            }
        }
    }

