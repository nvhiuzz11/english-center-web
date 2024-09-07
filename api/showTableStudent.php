<?php 
require '../lib/functionStudent.php';


$key = trim($_POST['key']);
$page = $_POST['page'];
$collumSort = $_POST['collumSort'];
$order =  $_POST['order'];

    
$listStudent = searchStudent($connection, $key, $page,$collumSort,$order);

$i = 1;

if (!$listStudent) {
    echo ' <h2 id="search-fail">Không tìm thấy kết quả phù hợp "' . $key  . '"</h2>';
} else {
    echo ' <h2 id="search-fail"></h2>';
    foreach ($listStudent as $Student) : ?>
       
        <tr  <?php if($i >20){echo "hidden";}  ?> >
            <td><?php echo $i++ ?></td>
            <td><?php echo $Student['MaHS']; ?></td>
            <td><?php echo $Student['TenHS']; ?></td>
            <td><?php echo $Student['GioiTinh']; ?></td>
            <td><?php echo $Student['Tuoi']; ?></td>
            <td style="width :200px"><?php echo $Student['DiaChi']; ?></td>
        </tr>
        
<?php endforeach;}
   ?>
   <p hidden id="count-data"> <?php if(searchList($connection,$key)) {echo count(searchList($connection,$key));} ?> </p>
