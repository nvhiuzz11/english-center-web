<?php
    require '../lib/functionStudent.php';

    $username = $_POST['username'];
    $pass = $_POST['pass'];
    $mahs = $_POST['id'];

    
    
    updatePassHS($connection, $username, $pass, $mahs);

    

    $listAcc = listtk_hs($connection);

    
    print_r(json_encode($listAcc));

?>
