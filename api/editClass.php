<?php
include "../lib/FunctionClass.php";


$malop = $_POST['maLop'];

$dataClass = dataClassById($malop, $connection);
$dataSchedules = dataSchedulesByMaLop($malop, $connection);
$nameTeacher = dataTeacherByMaLop($malop, $connection);
$result = listSchedules($connection);
$nameCondition = '';

if ($dataClass['TrangThai'] == 'Chưa mở') {
    $nameCondition = 'Chưa mở';
} else if ($dataClass['TrangThai'] == 'Đang mở') {
    $nameCondition = 'Đang mở';
} else {
    $nameCondition = 'Đã đóng';
}

?>

<div class="col-md-6">
    <label class="fw-bold" for="classcode">Mã lớp:<label id="lbclasscode" style="color:red; font-size:13px ; font-style: italic "></label></label>
    <input type="text" id="classcode" name="classcode" readonly value="<?php echo $malop ?>">
</div>

<div class="col-md-6">
    <label class="fw-bold" for="classname">Tên lớp:<label id="lbclassname" style="color:red; font-size:13px ; font-style: italic "></label></label>
    <input type="text" id="classname" name="classname" value="<?php echo $dataClass['TenLop']; ?>">
</div>

<div class="col-md-6">
    <label class="w-100 fw-bold" for="classAge">Lứa tuổi:<label id="lbclassAge" style="color:red; font-size:13px ; font-style: italic "></label></label>
    <br><input style="width: 100%;" type="number" id="classAge" name="classAge" value="<?php echo $dataClass['LuaTuoi']; ?>">
</div>

<div class="col-md-6">
    <label class="fw-bold mb-2" for="classTimeOpen">Thời gian bắt đầu khóa học:<label id="lbclassTimeOpen" style="color:red; font-size:13px ; font-style: italic "></label></label>
    <input class="w-100" style="padding: 12px;" type="date" id="classTimeOpen" name="classTimeOpen" value="<?php echo $dataClass['ThoiGian']; ?>">
</div>

<div class="col-md-6">
    <label class="fw-bold mb-2" for="schedules">Lịch học:<label id="lbschedules" style="color:red; font-size:13px ; font-style: italic "></label></label>
    <br>

    <div id="schedule-container">
        <?php $i = 0 ?>
        <?php foreach ($dataSchedules as $listschedules) :
            $maLich = $listschedules['MaLich'];
        ?>
            <div>

                <select class="w-100 mb-2" name="schedules<?php echo $i; ?>" id="schedules<?php echo $i; ?>" style="width: 80%!important;">
                    <option value="<?php echo $maLich ?>">
                        <?php echo  $listschedules['Ngay'] . ' - ' . $listschedules['TGBatDau'] . '-' . $listschedules['TGKetThuc']; ?>
                    </option>
                    <?php foreach ($result as $results) :
                        $maSchedules = $results['MaLich'];
                    ?>
                        <option id="" value="<?php echo $maSchedules ?>">
                            <?php echo  $results['Ngay'] . ' - ' . $results['TGBatDau'] . '-' . $results['TGKetThuc']; ?>
                        </option>
                    <?php endforeach ?>

                </select>
                <?php if ($i == 0) {
                    echo '<button  id="btn-add-schedule" onclick ="addSchedule()">Thêm</button>';
                } else {?>
                     <button id="btn-delete-schedule" data-index="<?php  echo $i; ?>" onclick="deleteSchedule(this)">Xóa</button>;
              <?php  } ?>

            </div>

            
            <?php $i++; ?>
        <?php endforeach ?>
    </div>
</div>

<br>
<div class="col-md-6">
    <label class="fw-bold" for="price">Học phí (/buổi) :<label id="lbprice" style="color:red; font-size:13px ; font-style: italic "></label></label>
    <input type="text" id="price" name="price" value="<?php echo number_format($dataClass['HocPhi'], 0, ',', ','); ?>" oninput="formatNumber(this)">
</div>

<div class="col-md-6">
    <label class="fw-bold" for="numberlessons">Tổng số buổi học:<label id="lbnumberlessons" style="color:red; font-size:13px ; font-style: italic "></label></label>
    <input type="text" id="numberlessons" name="numberlessons" value="<?php echo $dataClass['SoBuoi']; ?>">
</div>

<div class="col-md-6">
    <label class="fw-bold" for="students">Số lượng sinh viên tối đa:<label id="lbstudents" style="color:red; font-size:13px ; font-style: italic "></label></label>
    <input type="text" id="students" name="students" value="<?php echo $dataClass['SLHSToiDa']; ?>">
</div>

<div class="col-md-6">
    <label class="fw-bold mb-2" for="teacher">Giáo viên:<label id="lbteacher" style="color:red; font-size:13px ; font-style: italic "></label></label>
    <br><select class="w-100" name="teachers" id="teachers">
        <option value="<?php
                        foreach ($nameTeacher as $nameTeachers) {
                            echo $nameTeachers['MaGV'];
                        };
                        ?>">
            <?php
            foreach ($nameTeacher as $nameTeachers) {
                echo $nameTeachers['TenGV'] . ' - ' . $nameTeachers['TrinhDo'];
            };
            ?>
        </option>
        <?php $listTeacher = listTeacher($connection); ?>
        <?php foreach ($listTeacher as $listTeachers) : ?>
            <option value="<?php echo $listTeachers['MaGV'] ?>">
                <?php echo $listTeachers['TenGV'] . ' - ' . $listTeachers['TrinhDo'] ?>
            </option>
        <?php endforeach; ?>
    </select>
    <br>
</div>
<div class="col-md-6">
    <label class="fw-bold" for="TeacherSalarie">Lương giáo viên (/buổi):<label id="lbTeacherSalarie" style="color:red; font-size:13px ; font-style: italic "></label></label>
    <input type="text" id="TeacherSalarie" name="TeacherSalarie" value="<?php
                                                                        foreach ($nameTeacher as $nameTeachers) {
                                                                            $TeacherSalarie = $nameTeachers['TienTraGV'];
                                                                            if ($TeacherSalarie == null) {
                                                                                $TeacherSalarie = 0;
                                                                            }
                                                                        };

                                                                        echo  number_format($TeacherSalarie, 0, ',', ',');
                                                                        ?>" oninput="formatNumber(this)">
    <br>
</div>
<div class="col-md-6">
    <label class="fw-bold mb-2" for="condition">Trạng thái:<label class="lbStyle" id="lbcondition" style="color:red; font-size:13px ; font-style: italic "></label></label>
    <br><select class="w-100" name="SelectCondition" id="SelectCondition">
        <option value="<?php echo $dataClass['TrangThai'] ?>">
            <?php echo $nameCondition ?>
        </option>
        <option value="Chưa mở">Chưa mở</option>
        <option value="Đang mở">Đang mở</option>
        <option value="Đã đóng">Đã đóng</option>
    </select>
</div>
<br>
<div class="col-md-6">
    <label class="fw-bold" for="condition">Khuyến mãi:<label class="lbStyle" id="lbcondition" style="color:red; font-size:13px ; font-style: italic "></label></label>
    <p>
        <?php
        $discount = getDiscount($malop, $connection);

        if (empty($discount['GiamHocPhi'])) {
            echo '0%';
        }
        ?>
        <?php
        if (empty($discount['GiamHocPhi'])) : ?>




            <input id="btn-discount" style="background-color: chartreuse; border: 1px solid #fff; border-radius:5px ; padding: 5px 4px; margin-bottom: 10px;" type="button" value="Thêm khuyến mại" onClick="showHideDiv('divMsg')" /><br><br>
    <div id="divMsg" style="display:none">
        <label for="">Khuyến mãi :<label class="lbStyle" id="lbdiscount" style="color:red; font-size:13px ; font-style: italic "></label></label>
        <br>
        Thời gian bát đầu : <input type="date" name="startDiscount" id="startDiscount"><br>
        Thời gian kết thúc: <input type="date" name="endDiscount" id="endDiscount"><br>
        <input type="text" name="discountpercent" id="discountpercent" placeholder="Nhập % khuyến mại" style="width: 50%;"><span style="margin-left: -23px;">%</span>
    </div>

    <!-- end test -->

<?php else : ?><br>
    <label class="lbStyle" id="lbdiscount" style="color:red; font-size:13px ; font-style: italic "></label>
    <span>Thời gian bắt đầu :</span> <input type="date" name="startDiscount" id="startDiscount" value="<?php echo $discount['TGBatDau'] ?>"><br>
    <span class="ps-4">Thời gian kết thúc :</span> <input type="date" name="endDiscount" id="endDiscount" value="<?php echo $discount['TGKetThuc'] ?>"><br>
    <span class="ps-4"> Khuyến mại : </span>
    <input type="text" name="discountpercent" id="discountpercent" style="width: 20%; padding:5px 5px" value="<?php echo $discount['GiamHocPhi'] ?>"></input> <span style="margin-left: -23px;">%</span>
    <label id="lbvv1"></label>
<?php endif ?>
</p>
</div>


