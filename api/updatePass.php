<?php

require '../lib/functionPersonal.php';

$id = $_POST['id'];
$username = $_POST['username'];
$pass = trim($_POST['pass']);

$user = $_POST['user'];

if ($user == "student") {
    updatePassHS($connection, $username, $pass);

    $accountStudent = selectAcountStudent($connection, $id);
    print_r(json_encode($accountStudent));
} else if ($user == "parent") {
    updatePassPH($connection, $username, $pass);
    $accountParent = selectAcountParent($connection, $id);
    print_r(json_encode($accountParent));
} else {
    updatePassGV($connection, $username, $pass);
    $accountTeacher = selectAcountTeacher($connection, $id);
    print_r(json_encode($accountTeacher));
}
