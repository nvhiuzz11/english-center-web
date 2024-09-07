<?php
include "../lib/FunctionClass.php";


$malop = $_POST['malop'];



    foreach ($_POST['addstudents'] as $maHS) {
        addStudentsClass($maHS, $malop, $connection);
        
    }


    $result = [
        "listNo" => getListStudents($connection, $malop),
        "listYes" =>    ListStudentByClass($malop, $connection),
    ];
    
    echo json_encode($result);
    
