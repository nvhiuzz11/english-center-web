<?php


require '../lib/functionUserTeacher.php';

    
    $thoiGian = $_POST['time'];
    $malop = $_POST['malop'];
    $danhSachDiemDanh = $_POST['danhSachDiemDanh'];
    $magv  =$_POST['magv'];
  
    foreach ($danhSachDiemDanh as $index => $student) {
      
        $maHS = $student['maHS'];
        $tenHS = $student['tenHS'];
        $diemDanh = $student['diemDanh'] ? 1 : 0;

        if ($diemDanh == 0) {
            $soBuoiNghi =  selectSoBuoiNghi($connection, $maHS, $malop);
            $so =   $soBuoiNghi[0]['SoBuoiNghi'] + 1;
            updateSoBuoiNghi($connection, $so, $malop, $maHS);
        }



        insertDiemDanh($malop, $maHS, $thoiGian, (int)$diemDanh, $connection);
    }


    $la =  selectSoBuoiDaToChuc($connection, $malop);
    $soBDTC =  $la[0]['SoBuoiDaToChuc'] + 1;

    updateSoBuoiDaToChuc($connection, $soBDTC, $malop);

    
$result = [
    "dslop" => listClassActive($connection, $magv),
    "dsdd" =>  listDD($connection, $magv),
];

echo json_encode($result);