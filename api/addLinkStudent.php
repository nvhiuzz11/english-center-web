<?php
    require '../lib/functionParent.php';

    $students =  $_POST['students'];
    $maph = $_POST['id'];
    
    foreach ($students as $mahs) {
        insertph_hs($connection,$mahs,$maph);
    }

  
    
    print_r(json_encode(listph_hs($connection)));

?>
