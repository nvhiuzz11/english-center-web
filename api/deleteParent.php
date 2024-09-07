<?php

require '../lib/functionParent.php';
    $maph = $_POST['id'];
    
		deletetk_ph($connection, $maph);
		deleteParent_ph_hs($connection, $maph);
		deleteLKPHHS($connection, $maph);

		deleteParent($connection, $maph);
        $listParent = listParent($connection);

    print_r(json_encode($listParent)) ;
    

?>