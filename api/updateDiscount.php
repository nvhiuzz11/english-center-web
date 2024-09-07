<?php
include "../lib/FunctionClass.php";
$malop = $_POST['malop'];
$data = json_decode($_POST['data'], true);

if ($data !== null && is_array($data)) {
    foreach ($data as $item) {
        $maHS = $item['MaHS'];
        $discountValue = $item['DiscountValue'];

        editDiscount($discountValue, $maHS, $malop, $connection);
    }
}
   
$listStudents = ListStudentByClass($malop, $connection);
print_r(json_encode($listStudents));

        
 
