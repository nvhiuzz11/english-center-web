<?php
    require '../lib/functionStudent.php';

    $parents =  $_POST['parents'];
    $mahs = $_POST['id'];
    
    foreach ($parents as $maph) {
        insertph_hs($connection,$mahs,$maph);
    }

    
    
    print_r(json_encode(listph_hs($connection)));

?>
