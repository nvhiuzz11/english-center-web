<?php
require '../lib/functionFin_wageTea.php';


if (!empty($_POST['teacher'])) {
    $gv = $_POST['teacher'];

    $arrayTeacher = explode(",", $gv);
}


    $ten = trim($_POST['name']);
    $soTien =  $_POST['money'];
    $soTien =  str_replace(',', '', $soTien);
    $thoiGian = date('n/Y');

foreach ($arrayTeacher as $t) {
    insertluongGV($connection, $ten, $t,'', $thoiGian, $soTien);
}


 


