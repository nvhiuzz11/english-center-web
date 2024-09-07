<?php
require '../lib/functionParent.php';
$key = trim($_POST['key']);
$page = $_POST['page'];
$collumSort = $_POST['collumSort'];
$order =  $_POST['order'];

$listParent = searchParent($connection, $key,$page,$collumSort,$order);

$i = 1;

if (!$listParent) {
    echo ' <h2>Không tìm thấy kết quả phù hợp "' .$key . '"</h2>';
} else {
    foreach ($listParent as $Parent) : ?>
        
        <tr>
            <td><?php echo $i++ ?></td>
            <td><?php echo $Parent['MaPH']; ?></td>
            <td><?php echo $Parent['TenPH']; ?></td>
            <td><?php echo $Parent['GioiTinh']; ?></td>
            <td><?php echo $Parent['Tuoi']; ?></td>
            <td style="width :200px"><?php echo $Parent['DiaChi']; ?></td>
            <td>

                <?php echo str_replace(',', "<br>", $Parent['dshs']) ; ?>
            </td>


        </tr>
<?php endforeach;
} ?>

<p hidden id="count-data"> <?php if(searchList($connection,$key)) {echo count(searchList($connection,$key));} ?> </p>
