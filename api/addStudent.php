<?php
require '../lib/functionStudent.php';

    $name =   trim($_POST['name']);
    $gender =  $_POST['gender'];
    $date =  $_POST['date'];
    $age =  $_POST['age'];
    $address =   trim($_POST['address']);
    $phone =  $_POST['phone'];
    $email =   trim($_POST['email']);
   
    

     $mahs=  insertStudent($connection,$name,$gender,$date,$age,$address,$phone,$email);
     $username = "hocsinh".$mahs;
     $pass = date("dmY", strtotime($date));
     $datelogup = date("Y-m-d");
    inserttk_hs($connection,$mahs,$username,$pass,$datelogup);

    if(isset($_POST['parents'])){
        $parents =  $_POST['parents'];
        foreach ($parents as $maph) {
            insertph_hs($connection,$mahs,$maph);
        }
    
    }
    
 
    $result = [
        "student" => listStudent($connection),
        "acc" => listtk_hs($connection),
        "phhs" => listph_hs($connection),
    ];

    echo json_encode($result);


?>