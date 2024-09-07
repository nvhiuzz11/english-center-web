<?php


require '../lib/functionUserTeacher.php';



    $date = $_POST['time'];
    $class = $_POST['malop'];
    $magv  =$_POST['magv'];


    $listdiemDanh = selectddByLopTG($connection, $class, $date);
    for ($i = 0; $i < count($listdiemDanh); $i++) {
        if ($listdiemDanh[$i]['dd'] == 0) {
            $soBuoiNghi =  selectSoBuoiNghi($connection, $listdiemDanh[$i]['MaHS'], $class);
            $so =   $soBuoiNghi[0]['SoBuoiNghi'] - 1;
            updateSoBuoiNghi($connection, $so, $class,  $listdiemDanh[$i]['MaHS']);
        }
    }

    deleteDiemDanh($connection, $class, $date);
    $la =  selectSoBuoiDaToChuc($connection, $class);
    $soBDTC =  $la[0]['SoBuoiDaToChuc'] - 1;

    updateSoBuoiDaToChuc($connection, $soBDTC, $class);

    $result = [
        "dslop" => listClassActive($connection, $magv),
        "dsdd" =>  listDD($connection, $magv),
    ];
    
    echo json_encode($result);


