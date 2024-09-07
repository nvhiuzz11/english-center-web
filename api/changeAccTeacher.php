<?php
require '../lib/functionTeacher.php';

    $username = $_POST['username'];
    $pass = $_POST['pass'];
    $magv = $_POST['id'];

    
    
    updatePassGV($connection, $username, $pass, $magv);

    
    $listtk_gv = listtk_gv($connection);

    
    print_r(json_encode($listtk_gv));

?>
