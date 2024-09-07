<?php
include "../lib/FunctionClass.php";

$malop = $_POST['malop'];
$listTime = ListTimeAttendance($malop, $connection);
?>
<?php $j = 1;
foreach ($listTime as $data) :
    $maTime = $data['ThoiGian'];
?>
    <div class="detailTimeAttendance" id="details-<?php echo $j ?>">
        <div class="w-75" style="max-width: 900px;" id="boxTime<?php echo $j ?>">
            <button id="closebtnboxTime<?php echo $j ?>">&times;</button>
            <div class="">
                <h1 class="fw-bold mt-3">Chi tiết điểm danh </h1>




                <div>
                    <label style="">Thời gian : </label><input type="date" id="updateTime" name="UpdateTime" style="margin-left: 20px;" value="<?php echo $data['ThoiGian'] ?>">
                    <label id="err-edit" style="color:red; font-size:13px ; font-style: italic "></label>
                    <input type="hidden" name="deleteddTimeClass" value="<?php echo $data['ThoiGian'] ?>">
                    <input class="w-auto" style="margin-left:30%;" type="submit" id="submitDiemDanh"  value="Cập nhật" name="submitDiemDanh">
                    <input class="w-auto" style="margin-left:20px" type="submit" value="Xóa dữ liệu điểm danh">
                </div>

                <form id="dd" name="dd" method="post">
                    <table>
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Mã học sinh</th>
                                <th>Tên học sinh</th>
                                <th style="text-align : center">Tham gia lớp học</th>
                            </tr>
                        </thead>
                        
                        <tbody>
                            <?php $k = 1;

                            $getCodeStudentByTimeandCodeClass = getCodeStudentByTimeandCodeClass($malop, $maTime, $connection);
                            foreach ($getCodeStudentByTimeandCodeClass as $dataStudentTime) : ?>
                                <tr>
                                    <td><?php echo $k++ ?></td>
                                    <td><?php echo $dataStudentTime['MAHS'] ?></td>
                                    <td><?php echo  getStudentByid($dataStudentTime['MAHS'], $connection)['TenHS']; ?></td>
                                    <td style="text-align: center;">

                                        <input type="checkbox" name="editdd<?php echo $dataStudentTime['MAHS']; ?>" <?php echo ($dataStudentTime['dd'] == 1) ? 'checked' : ''; ?>>

                                    </td>
                                </tr>
                            <?php endforeach ?>
                            <input type="hidden" name="MaLop" value="<?php echo $malop ?>">
                            <input type="hidden" name="Time" value="<?php echo $data['ThoiGian']; ?>">
                            <input type="hidden" name="ddcheck" value="hieudeptrai">
                        </tbody>
                       
                </form>
                </table>

            </div>
        </div>
    </div>
    <?php $j++ ?>
<?php endforeach ?>


