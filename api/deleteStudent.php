<?php

require '../lib/functionStudent.php';
$mahs = $_POST['id'];


    deletetk_hs($connection, $mahs);
    deleteStudent_ph_hs($connection, $mahs);
    deleteLKPHHS($connection, $mahs);
    deleteDiemDanh($connection, $mahs);
    deleteHS_Lop($connection,$mahs);
    $listMaHD = selectMaHD($connection, $mahs);
    foreach ($listMaHD as $hd) {
        deleteLSTHP($connection, $hd['MaHD']);
    }
    deleteHDHP($connection,$mahs);
    deleteStudent($connection, $mahs);

    $listStudent =  listStudent($connection);

    print_r(json_encode($listStudent)) ;
    

?>