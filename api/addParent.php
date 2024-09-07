<?php

require '../lib/functionParent.php';



$name =   trim($_POST['name']);
    $gender =  $_POST['gender'];
    $date =  $_POST['date'];
    $age =  $_POST['age'];
    $address =   trim($_POST['address']);
    $phone =  $_POST['phone'];
    $email =   trim($_POST['email']);


 $maph=  insertParent($connection,$name,$gender,$date,$age,$address,$phone,$email);
 $username = "phuhuynh".$maph;
 $pass = date("dmY", strtotime($date));
 $datelogup = date("Y-m-d");


inserttk_ph($connection,$maph,$username,$pass,$datelogup);

if(isset($_POST['students'])){
    $students =  $_POST['students'];
    foreach ($students as $mahs) {
        insertph_hs($connection,$mahs,$maph);
    }

}





$result = [
    "parent" => listParent($connection),
    "acc" => listtk_ph($connection),
    "phhs" => listph_hs($connection),
];

echo json_encode($result);





?>