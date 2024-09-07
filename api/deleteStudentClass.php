<?php
include "../lib/FunctionClass.php";
$malop = $_POST['malop'];
$mahs = $_POST['mahs'];

        deletedStudentsClass($mahs, $malop, $connection);
        deleteDiemdanhHS($malop,$mahs,$connection);

        
        $result = [
            "listNo" => getListStudents($connection, $malop),
            "listYes" =>    ListStudentByClass($malop, $connection),
        ];
        
        echo json_encode($result);       