<?php

require '../lib/functionFinance.php';


$mahd = $_POST['id'];

$soTien = $_POST['money'];
$date = $_POST['date'];
$key = trim($_POST['key']);

$listss = selectSTPD_NPCL($connection, $mahd);
$soTienDaDong = $listss[0]['SoTienDaDong'];
$SoTienPhaiDong = $listss[0]['SoTienPhaiDong'];
$NoPhiConLai = $listss[0]['NoPhiConLai'];

$soTien = str_replace(',', '', $soTien);
$stdd = $soTienDaDong + $soTien;
$npcl = $SoTienPhaiDong - $stdd;
if ($npcl <= 0) {
    $tt = 'Hoàn thành';
} else {
    $tt = 'Còn nợ';
}
insertlsthp($mahd, $date, $soTien, $connection);
updateHDTHP_addLSTHP($connection, $stdd, $npcl, $tt, $mahd);


$result = [
    "hoadon" =>  listBillHP($connection),
    "lsthp" => listLSTHP($connection),
];

echo json_encode($result);

?>
