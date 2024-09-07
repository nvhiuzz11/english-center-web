<?php
include "../lib/FunctionClass.php";

$compressedData = $_POST['compressedData'];
$data = json_decode($compressedData, true);

$classcode = trim($data['classcode']);
$classname = trim($data['classname']);
$classAge = $data['classAge'];
$classTimeOpen = $data['classTimeOpen'];

$condition = $data['SelectCondition'];
$schedules = $_POST['schedules'];

$price = str_replace(',', '', $data['price']);
$numberlessons = trim($data['numberlessons']);
$students = trim($data['students']);

$teachers = $data['teachers'];

$maLop = CreateClass($classcode, $classname, $classAge, $classTimeOpen, 0, $students, $price, $numberlessons, 0, $condition, $connection);

if ($maLop != null) {

    for ($i = 0; $i < count($schedules); $i++) {
        CreateSchedules_Class($schedules[$i], $maLop, $connection);
    }

    $tientraGV = str_replace(',', '', $data['TeacherSalarie']);

    $teacherClass = CreateTeacher_Class($teachers, $maLop, $tientraGV, $connection);
    if ($teacherClass && isset($data['startDiscount']) && isset($data['endDiscount']) && isset($data['discountpercent'])) {
        insertDiscount($data['startDiscount'], $data['endDiscount'], $data['discountpercent'], $maLop, $connection);
    } else {
        insertDiscount('2023-1-1', '2023-1-1', 0, $maLop, $connection);
    }

}
