
<?php
include "../lib/FunctionClass.php";
$malop = $_POST['malop'];
$listTime = ListTimeAttendance($malop, $connection);
$dataClass = dataClassById($malop, $connection);

$j = 1;
?>
<?php foreach ($listTime as $data) : ?>
    <tr id='time<?php echo $j ?>' onclick="showDetails(<?php echo $j; ?>)">
        <td><?php echo $j++ ?></td>
        <td><?php echo convertDateFormat($data['ThoiGian']) ?></td>
        <td><?php
            $totalStudent = TotalStudentByTime($data['ThoiGian'], $malop, $connection);
            echo $totalStudent['total'] . '/' . $dataClass['SLHS'] ?></td>
    </tr>

<?php endforeach ?>
<?php  if(!$listTime) {
    ?> <p style="color: crimson;">Lớp chưa có dữ liệu điểm danh !</p>
    <?php
}?>