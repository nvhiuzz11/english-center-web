<?php
    require '../lib/functionParent.php';

    $maph =  $_POST['maph'];
    $mahs =  $_POST['mahs'];
  
    delete_ph_hs($connection,$maph,$mahs);
    
    print_r(json_encode(listph_hs($connection)));

?>
