<?php
require '../lib/functionStudent.php';



    $mahs = $_POST['id'];
    $ten = trim($_POST['name']);
    $gt = $_POST['gender'];
    $ns = $_POST['birthday'];
    $tuoi = $_POST['age'];
    $dc = trim($_POST['address']);
    $sdt = $_POST['phone'];
    $email = trim($_POST['email']);
    
    updateStudentbyID($connection, $mahs, $ten, $gt, $ns, $tuoi, $dc, $sdt, $email);

   $listStudent =  listStudent($connection);

   print_r(json_encode($listStudent)) ;


?>