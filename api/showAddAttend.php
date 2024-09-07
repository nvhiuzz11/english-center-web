
<?php
include "../lib/FunctionClass.php";
$malop = $_POST['malop'];

$k = 1;
$listStudents = ListStudentByClass($malop, $connection);
foreach ($listStudents as $dataStudentTime) : ?>
    <tr>
        <td><?php echo $k++ ?></td>
        <td><?php echo $dataStudentTime['MaHS'] ?></td>
        <td><?php echo $dataStudentTime['TenHS'] ?></td>
        <td style="text-align: center;">

            <input type="checkbox" name="editdd<?php echo $dataStudentTime['MaHS']; ?>">

        </td>
    </tr>
<?php endforeach ?>