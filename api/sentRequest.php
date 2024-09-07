<?php

require '../lib/functionUserStudent.php';


    $maph = $_POST['maph'];
    $mahs =  $_POST['mahs'];
 

    $nyc = $_POST['nyc'];

    insertLienKet($mahs, $maph, $nyc, $connection);

   


