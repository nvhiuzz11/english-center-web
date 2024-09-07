<?php
require '../lib/functionTeacher.php';


$name =   trim($_POST['name']);
$gender =  $_POST['gender'];
$date =  $_POST['date'];
$age =  $_POST['age'];
$address =   trim($_POST['address']);
$phone =  $_POST['phone'];
$email =   trim($_POST['email']);
    
    $hometown =  trim( $_POST['hometown']);
    $education =   trim($_POST['education']);
 


	$magv = insertTeacher($connection, $name, $gender, $date, $age, $hometown, $address, $education, $phone, $email);
	

     $username = "giaovien".$magv;
     $pass = date("dmY", strtotime($date));
     $datelogup = date("Y-m-d");
    inserttk_gv($connection,$magv,$username,$pass,$datelogup);

    
$listTeacher = listTeacher($connection);
print_r(json_encode($listTeacher)) ;
 


?>