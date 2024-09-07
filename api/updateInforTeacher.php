<?php
require '../lib/functionTeacher.php';

    $id = $_POST['id'];
    $name =   trim($_POST['name']);
    $gender =  $_POST['gender'];
    $date =  $_POST['date'];
    $age =  $_POST['age'];
    $address =   trim($_POST['address']);
    $phone =  $_POST['phone'];
    $email =   trim($_POST['email']);
    
    $hometown =  trim( $_POST['hometown']);
    $education =   trim($_POST['education']);
 

	updateTeacherbyID($connection, $id, $name, $gender, $date, $age, $hometown, $address, $education, $phone, $email);

    $listTeacher = listTeacher($connection);

   print_r(json_encode($listTeacher)) ;


?>