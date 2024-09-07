<?php
require '../lib/functionTeacher.php';
    $magv= $_POST['id'];


    
	deletetk_gv($connection, $magv);
	deletegv_lop($connection, $magv);
	deleteLuongGV($connection, $magv);
	deleteTeacher($connection, $magv);
	


    $listTeacher = listTeacher($connection);

    print_r(json_encode($listTeacher)) ;
    

?>