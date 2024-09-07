<?php

require '../lib/functionParent.php';



    $maph = $_POST['id'];
    $ten = trim($_POST['name']);
    $gt = $_POST['gender'];
    $ns = $_POST['birthday'];
    $tuoi = $_POST['age'];
    $dc = trim($_POST['address']);
    $sdt = $_POST['phone'];
    $email = trim($_POST['email']);
    
    updateParentbyID($connection, $maph, $ten, $gt, $ns, $tuoi, $dc, $sdt, $email);

   $listParent = listParent($connection);

   print_r(json_encode($listParent)) ;


?>