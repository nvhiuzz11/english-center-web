<?php
include "../lib/FunctionClass.php";
$malop = $_POST['maLop'];

$dataClass = dataClassById($malop, $connection);
$dataSchedules = dataSchedulesByMaLop($malop, $connection);
$nameTeacher = dataTeacherByMaLop($malop, $connection);
$result = listSchedules($connection);

?>

<div class="row">
<div class="col-md-6">
    <span class="text-black fw-bold"> Mã lớp :</span> <?php echo $malop; ?>
</div>

<div class="col-md-6">
    <span class="text-black fw-bold">Tên lớp : </span><?php echo $dataClass['TenLop']; ?>
</div>
</div>

<div class="row">
<div class="col-md-6">
    <span class="text-black fw-bold"> Lứa tuổi:</span> <?php echo $dataClass['LuaTuoi']; ?>
</div>

<div class="col-md-6">
    <span class="text-black fw-bold">Thời gian bắt đầu khóa học: </span><?php echo convertDateFormat($dataClass['ThoiGian']); ?>
</div>
</div>

<div class="row">
<div class="col-md-6">
    <span class="text-black fw-bold"> Lịch học:</span> <br>
    <?php
    foreach ($dataSchedules as $listschedules) {
        echo  $listschedules['Ngay'] . ' - ' . $listschedules['TGBatDau'] . '-' . $listschedules['TGKetThuc'];
        echo "<br>";
    }
    ?>
</div>

<div class="col-md-6">
    <span class="text-black fw-bold">Học phí/buổi: </span><?php echo numberWithCommas($dataClass['HocPhi']) . ' VND'; ?>
</div>
</div>

<div class="row">
<div class="col-md-6">
    <span class="text-black fw-bold"> Tổng số buổi đã dạy:</span>
    <?php echo $dataClass['SoBuoiDaToChuc']; ?>
</div>

<div class="col-md-6">
    <span class="text-black fw-bold">Tổng số buổi học: </span><?php echo $dataClass['SoBuoi']; ?>
</div>
</div>

<div class="row">
<div class="col-md-6">
    <span class="text-black fw-bold"> Số lượng học sinh đăng kí:</span>
    <?php echo $dataClass['SLHS']; ?>
</div>

<div class="col-md-6">
    <span class="text-black fw-bold">Số lượng học sinh tối đa: </span><?php echo $dataClass['SLHSToiDa']; ?>
</div>
</div>

<div class="row">
<div class="col-md-6">
    <span class="text-black fw-bold"> Tên giáo viên:</span>
    <?php
    foreach ($nameTeacher as $nameTeachers) {

        echo $nameTeachers['TenGV'];
    };
    ?>


</div>

<div class="col-md-6" id="22">
    <span class="text-black fw-bold">Lương giáo viên/buổi : </span>
 <?php
    foreach ($nameTeacher as $nameTeachers) {
        $TeacherSalarie = $nameTeachers['TienTraGV'];
    };

    echo numberWithCommas($TeacherSalarie) . ' VND';
    ?>
  
</div>

<div class="col-md-6">
    <span class="text-black fw-bold">Khuyến mại : </span>
    <?php
    $discount = getDiscount($malop, $connection);

    if (empty($discount['GiamHocPhi'])) {
        echo '0%';
    } else {
        echo $discount['GiamHocPhi'] . '%';
    }
    ?>
</div>
</div>
<input type="hidden" name="deleteClassCheck" value="Thầy Hiếu đẹp trai">



