<?php
include "../lib/FunctionClass.php";
$malop = $_POST['malop'];

$date = $_POST['date'];





$data = json_decode($_POST['data'], true);

if ($data !== null && is_array($data)) {
    foreach ($data as $item) {
        $maHS = $item['MaHS'];
        $check = $item['isChecked'];
 
        adddiemdanhClassTime($malop, $maHS, $date, $check, $connection);
    }
}
updateSoBuoiTC($malop, $connection);