<?php

require '../lib/functionTeacher.php';
$key = trim($_POST['key']);
$page = $_POST['page'];
$collumSort = $_POST['collumSort'];
$order =  $_POST['order'];

$listTeacher = searchTeacher($connection, $key, $page,$collumSort,$order);


$i = 1;

if (!$listTeacher) {
    echo ' <h2>Không tìm thấy kết quả phù hợp "' .$key . '"</h2>';
} else {
    foreach ($listTeacher as $teacher) : ?>
        <tr>
            <td><?php echo $i++ ?></td>
            <td><?php echo $teacher['MaGV']; ?></td>
            <td><?php echo $teacher['TenGV']; ?></td>

            <td><?php echo $teacher['GioiTinh']; ?></td>
            <td><?php echo $teacher['Tuoi']; ?></td>
            <td><?php echo $teacher['DiaChi']; ?></td>
            <!-- <td><?php
                $listClass = classOfTeacher($connection, $teacher['MaGV']);
                foreach ($listClass as $class) :
                    echo $class['MaLop'] . ' ; ';
                endforeach;
                ?></td> -->
           

        </tr>
<?php endforeach;
} ?>

<p hidden id="count-data"> <?php if(searchList($connection,$key)) {echo count(searchList($connection,$key));} ?> </p>
