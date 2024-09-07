<?php
include "../lib/FunctionClass.php";

$compressedData = $_POST['compressedData'];
$data = json_decode($compressedData, true);
$schedules = $_POST['schedules'];

$SelectCondition = $data['SelectCondition'];
$classcode = trim($data['classcode']);
$classname = trim($data['classname']);
$classAge = $data['classAge'];
$classTimeOpen = $data['classTimeOpen'];
$price = str_replace(',', '', $data['price']);
$numberlessons = trim($data['numberlessons']);
$students = trim($data['students']);


$teachers = $data['teachers'];





updateClassbyID($classcode, $classname, $classAge, $classTimeOpen, 0, $students, $price, $numberlessons, 0, $SelectCondition, $connection);
delete_SchedulesByID($classcode, $connection);
for ($i = 0; $i < count($schedules); $i++) {
    updateClass_SchedulesByID($classcode, $schedules[$i], $connection);
}
  $TeacherSalarie = str_replace(',', '', $data['TeacherSalarie']);
updateClass_TeacherByID($classcode,  $teachers, $TeacherSalarie, $connection);



if (isset($data['startDiscount'])) {
    $startDiscount = $data['startDiscount'];
} else {
    $startDiscount = '2023-1-1';
}

if (isset($data['endDiscount'])) {
    $endDiscount = $data['endDiscount'];
} else {
    $endDiscount = '2023-1-1';
}

if (isset($data['discountpercent'])) {
    $Discount = $data['discountpercent'];
} else {
    $Discount = 0;
}

editDiscountFull($classcode, $startDiscount, $endDiscount, $Discount, $connection);
