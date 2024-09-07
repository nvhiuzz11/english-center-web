<?php
include "../lib/FunctionClass.php";

$malop = $_POST['malop'];

    $listMaHD =  selectMaHD($connection, $malop);
    foreach ($listMaHD as $hd) {
        deleteLSTHP($connection, $hd['MaHD']);
    }
    $result = deleteClassById($malop, $connection);
   


    