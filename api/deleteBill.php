<?php

require '../lib/functionFinance.php';

    $mahd = $_POST['mahd'];
    deleteLSTHPbyMaHD($connection, $mahd);
    deleteHDHocPhi($connection, $mahd);

   

