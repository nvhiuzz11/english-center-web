
<?php
include "../lib/FunctionClass.php";


$malop = $_POST['malop'];
$timeOld =  $_POST['date_old'];
$timeNew = $_POST['date_new'];
$datajs = json_decode($_POST['data'], true);

updatediemdanhDate($malop,  $timeOld, $timeNew, $connection);
$getCodeStudentByTimeandCodeClass = getCodeStudentByTimeandCodeClass($malop, $timeNew, $connection);
foreach ($getCodeStudentByTimeandCodeClass as $data) {
    $checkBoxOld = $data['dd'];
    
    if ($datajs !== null && is_array($datajs)) {

        foreach ($datajs as $item) {
            if($item['MaHS'] ==  $data['MAHS']){
                $checkBoxNew = $item['isChecked'];
               
                if ($checkBoxOld != $checkBoxNew) {
                    updatediemdanhStudent($malop, $data['MAHS'], $checkBoxNew, $connection);
                }
                editdiemdanhClass($malop, $data['MAHS'], $timeNew, $checkBoxNew, $connection);
    
            }
        }
    }



    
    
}


