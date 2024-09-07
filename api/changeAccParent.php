<?php
    require '../lib/functionParent.php';

    $username = $_POST['username'];
    $pass = $_POST['pass'];
    $maph = $_POST['id'];

    
    
    updatePassPH($connection, $username, $pass, $maph);

    

    $listtk_ph = listtk_ph($connection);
    
    print_r(json_encode($listtk_ph));

?>
