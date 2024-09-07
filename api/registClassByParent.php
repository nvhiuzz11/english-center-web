<?php
$path_dir = __DIR__ . '/../lib';

include $path_dir . '/database.php';
require '../lib/registerClass.php';

$maHS = $_POST['MaHS'];
$maLop = $_POST['MaLop'];
$dataClass = dataClassByIdRegister($maLop, $connection);
$now = new DateTime();
$giamHP = 0;
$discount = getDiscountRegister($maLop, $connection);
if ($now > $discount['TGBatDau'] && $now < $discount['TGKetThuc']) {
    $giamHP = $discount['GiamHocPhi'];
}
$countRegister = $dataClass['SLHS'] + 1;
if ($countRegister > $dataClass['SLHSToiDa']) {
    print_r("MaxCount");
    return;
}
registToClass($maHS, $maLop, $giamHP, $connection);
updateStudentCount($maLop, $countRegister, $connection);
//echo "<meta http-equiv='refresh' content='0'>";


print_r("UpdateDone");
