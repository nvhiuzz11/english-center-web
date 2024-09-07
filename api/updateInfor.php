<?php
require '../lib/functionPersonal.php';


$id = $_POST['id'];
$ten = trim($_POST['name']);
$gt = $_POST['gender'];
$ns = $_POST['birthday'];
$tuoi = $_POST['age'];
$dc = trim($_POST['address']);
$sdt = $_POST['phone'];
$email = trim($_POST['email']);
$user = $_POST['user'];
if ($user == "student") {

    updateStudentbyID($connection, $id, $ten, $gt, $ns, $tuoi, $dc, $sdt, $email);
    $detailStudent = selectStudent($connection, $id);
    print_r(json_encode($detailStudent));
} else if ($user == "parent") {
    updateParentbyID($connection, $id, $ten, $gt, $ns, $tuoi, $dc, $sdt, $email);
    $detailParent = selectParent($connection, $id);
    print_r(json_encode($detailParent));
} else {
    $qq = trim($_POST['hometown']);
    $td = trim($_POST['qualification']);

    updateTeacherbyID($connection, $id, $ten, $gt, $ns, $tuoi, $qq, $dc, $td, $sdt, $email);
    $detailTeacher = selectTeacher($connection, $id);
    print_r(json_encode($detailTeacher));
}
