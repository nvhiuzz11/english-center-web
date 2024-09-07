<?php 
include "../lib/FunctionClass.php";


$malop = $_POST['malop'];
$dataClass = dataClassById($malop, $connection);
$listStudents = ListStudentByClass($malop, $connection);

$discountNumber = 1;
$i =1;
?>

<?php foreach ($listStudents as $data) : ?>

 
    <tr class="tr-student" data-maHS="<?php echo $data['MaHS']; ?> ">
        <td><?php echo $i++ ?></td>
        <td><?php echo $data['MaHS'] ?></td>
        <td><?php echo $data['TenHS'] ?></td>
        <td><?php echo convertDateFormat($data['NgaySinh']) ?></td>
        <td><?php echo $data['GioiTinh'] ?></td>
        <td><?php echo $data['DiaChi'] ?></td>
        <td><?php echo $data['SDT'] ?></td>
        <td style="text-align: center;"><?php
            $mahs = $data['MaHS'];
            $numberAttend = numberAttend($mahs, $malop, $connection);
           
            echo  $numberAttend['Attend']."/".$dataClass['SoBuoiDaToChuc'];
            ?></td>
        <td>
            <input name="discount<?php echo $discountNumber++ ?>" style="border:none" type="text" value="<?php
                                                                                                            $discount = discount($mahs, $malop, $connection);
                                                                                                            echo $discount['GiamHocPhi'];         
                                                                                                            ?>"><span style="margin-left: -23px;">%</span>
        </td>
    </tr>
<?php endforeach ?>

<?php  if(!$listStudents) {
    ?> <p style="color: crimson;">Lớp chưa có học sinh !</p>
    <?php
}?>
