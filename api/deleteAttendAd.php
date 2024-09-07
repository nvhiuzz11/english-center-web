<?php
include "../lib/FunctionClass.php";
$malop = $_POST['malop'];

$time = $_POST['date'];

   

        $getCodeStudentByTimeandCodeClass = getCodeStudentByTimeandCodeClass($malop, $time, $connection);
    
        foreach ($getCodeStudentByTimeandCodeClass as $data) {
            $checkBoxOld = $data['dd'];
            
            deletediemdanhStudent($malop, $data['MAHS'], $checkBoxOld, $connection);
        }

        deletediemdanhClass($malop, $time, $connection);

        deleteBuoiTC($malop, $connection);
 