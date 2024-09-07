<?php
require '../lib/functionFinance.php';



    $ten = trim($_POST['name']);
    $thang = $_POST['month'];
    $nam = $_POST['year'];
    $mahs = $_POST['student'];
    $malop = $_POST['class'];
    $thoiGian = $thang . "/" . $nam;


    $listDD = attendOfMonth($connection, $thang, $nam);
    $listHS_GHP = selecths_hocPhi($connection);


    foreach ($listDD as $dd) {
        if (($dd['MaHS'] == $mahs) && ($dd['MaLop'] == $malop)) {
            $diemDanh = $dd['SoBuoiDiemDanh'];
        }
    }
    foreach ($listHS_GHP as $aa) {
        if (($aa['MaHS'] == $mahs) && ($aa['MaLop'] == $malop)) {
            $hocPhi = $aa['HocPhi'];
            $giamHocPhi = $aa['GiamHocPhi'];
        }
    }
    if ($diemDanh)
        $soTien = $diemDanh * $hocPhi;
    $soTienGiam = round($soTien * $giamHocPhi / 100);
    $SoTienPhaiDong = $soTien - $soTienGiam;


    insertHDHocPhi($connection, $ten, $malop, $mahs, $thoiGian, $soTien, $giamHocPhi, $soTienGiam, $SoTienPhaiDong);





