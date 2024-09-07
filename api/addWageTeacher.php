<?php
require '../lib/functionFin_wageTea.php';
$ten = trim($_POST['name']);
$thang = $_POST['month'];
$nam = $_POST['year'];
$thoiGian = $thang . "/" . $nam;

if (!empty($_POST['teacher'])) {
    $gv = $_POST['teacher'];

    $arrayTeacher = explode(",", $gv);
}

foreach ($arrayTeacher as $t) {
    $lop = '';
    $st = 0;

    $listBDay = selectSoBuoiDay($connection, $thang, $nam, $t);
    for ($i = 0; $i < count($listBDay); $i++) {

        if ($i == count($listBDay) - 1) {
            $lop .= $listBDay[$i]['MaLop'];
        } else {
            $lop .= $listBDay[$i]['MaLop'] . ', ';
        }
        $st += $listBDay[$i]['SoBuoiDay'] * $listBDay[$i]['TienTraGV'];
    }
    insertluongGV($connection, $ten, $t, $lop, $thoiGian, $st);
}
