<?php


require '../lib/functionUserStudent.php';


$maph = $_POST['maph'];
$mahs  = $_POST['mahs'];
$rep =  $_POST['rep'];

if ($rep == "refuse") {
    deletedslk($connection, $mahs, $maph);
} else {
    deletedslk($connection, $mahs, $maph);
    insertPHHS($mahs, $maph, $connection);
}
$nyc = $_POST['nyc'];

if ($nyc == "hs") {

    $result = [
        "listParent" => parentOfStudent($connection, $mahs),
        "listRequest" => selectdslk($connection, $mahs),
    ];
} else {
    $result = [
        "listChild" => studentOfParent($connection, $maph),
        "listRequest" => selectdslk2($connection, $maph),
    ];
}

echo json_encode($result);
