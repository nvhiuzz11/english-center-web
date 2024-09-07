<?php
require '../../lib/functionUserTeacher.php';


session_start();
$maGV = $_SESSION['MaGV'];


$listClassActive  =  listClassActive($connection, $maGV);

$listClassClose  =  listClassOfTeacher($connection, $maGV, 'Đã đóng');
$listSchedules =  listSchedules($connection);
$listStudentOfClass =  studentOfClass($connection, $maGV);
$listDD =  listDD($connection, $maGV);
$tenGV = selectTenGV($connection, $maGV);
$detailTeacher = selectTeacher($connection, $maGV);

$jslistDD =  json_encode($listDD);
$jslistClassClose = json_encode($listClassClose);
$jslistClassActive = json_encode($listClassActive);
$jslistStudentOfClass = json_encode($listStudentOfClass);
$jsmaGV  =  json_encode($maGV);
$jstenGV  =  json_encode($tenGV);
$jsdetailTeacher = json_encode($detailTeacher);
$jslistSchedules = json_encode($listSchedules);


if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    

    if (isset($_POST['btn-logout'])) {

        session_start();
        session_unset();
        session_destroy();
        header("Location: ../home/home.php");
    }
}



?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">



    <!-- bootstrap.css-->
    <!-- <link rel="stylesheet" href="../../plugins/bootstrap-5.2.3-dist/css/bootstrap.min.css" /> -->
    <!--slick.css-->

    <link rel="stylesheet" href="../../plugins/slick-1.8.1/slick/slick.css" />
    <link rel="stylesheet" href="../../assets/css/home.css" />
    <!--Animated css-->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" />

    <link rel="stylesheet" href="/assets/css/userTeacherClass.css">
    <link rel="stylesheet" href="../../assets/css/common.css">
    <link rel="icon" href="../../assets/images/logo-web.png" type="image/x-icon">
    <title>Giáo viên</title>
</head>

<body>

    <div id="menu-bar">

    </div>

    <div id="content">
        <h1 class="title-page" style="text-align: center;margin-top:88px">Danh sách các lớp dạy</h1>
        <div class="div-class-t">
            <h1 style="background-color:yellowgreen">Lớp đang hoạt động</h1>
            <div id="class-on">
    
            </div>
        </div>
        <div class="div-class-t">
            <h1 style="background-color: tomato;">Lớp đã đóng</h1>
            <div id="class-off">


            </div>
        </div>

    </div>

    <div id="modal-bg">
        <div id="modal-content">
            <h1 style="margin-left: 50px;">Danh sách điểm danh </h1>
            <button id="btn-add">+ Thêm điểm danh </button>

            <div id="date-list">
                <div class="date">

                    <p style="margin-left:50px" id="time"></p>
                    <p id="number"></p>
                    <p style="margin-right:30px" id="absent"> </p>
                </div>

            </div>



            <button id="close">Đóng</button>

        </div>
    </div>

    <div id="modal-bg-update">
        <div id="modal-content-update">
            <h1 style="margin-left: 50px;">Danh sách điểm danh</h1>


            <button id="btn-delete">Xóa</button>

            <!-- <h2 id="time-header" style="margin-left: 50px;"></h2> -->
            <!-- <input type="date" id="time-header" style="margin-left: 50px;"> -->
            <h2 style="margin-left: 50px;">Thời gian : <input style="margin-left: 20px;font-size: 16px;" type="date" id="time-update" name="time-update"></h2>


            <table id="attendance">
                <thead>
                    <th>STT</th>
                    <th>Mã học viên</th>
                    <th>Tên học viên</th>
                    <th>Điểm danh</th>
                </thead>
                <tbody id='tbody-listStudent'>

                </tbody>
            </table>
            <form action="" , method="post" id="form-update">
                <button type="button" id="close-update" style="margin-left: 22%;">Đóng</button>
                <input type="hidden" id="time-update" name="time-update">
                <input type="hidden" id="class-update" name="class-update">
                <button type="submit" class="btn" id="btn-update">Cập nhật</button>
            </form>



        </div>
    </div>

    <div id="modal-bg-add">
        <div id="modal-content-add">
            <form action="" , method="post" id="form-add">
                <h1 style="margin-left: 50px;">Thên điểm danh</h1>
                <h2 style="margin-left: 50px;">Thời gian : <input style="margin-left: 20px;font-size: 16px;" type="date" id="time-add" name="time-add"></h2>
                <p style="margin-left: 50px;color: red;" id="error-time"></p>
                <table id="attendance-add">
                    <thead>
                        <th>STT</th>
                        <th>Mã học viên</th>
                        <th>Tên học viên</th>
                        <th>Điểm danh</th>
                    </thead>
                    <tbody id='tbody-listStudent-add'>

                    </tbody>
                </table>

                <button type="button" id="close-add" style="margin-left: 22%;">Hủy bỏ</button>

                <input type="hidden" id="class-add" name="class-add">
                <button type="submit" class="btn" id="btn-add-submit">Thêm</button>
            </form>



        </div>
    </div>



    </div>
    <div class="add-success">
        <img src="../../assets/images/icon_success.png" alt="" style=" width: 40px;">
        <h3 id='tb1'></h3>
    </div>
    <div class="modal-noti" id="modal-noti-add">

        <div class="add-cant">
            <img src="../../assets/images/Close-icon.png" alt="" style=" width: 40px;">
            <h3 id="tb2">Lớp đã đóng ~<br> Không thể cập nhật!</h3>
            <button id="close-err">Đóng</button>
        </div>

    </div>

    <div class="modal-noti" id="modal-noti-delete">
        <div class="delete-ques">
            <img src="../../assets/images/Help-icon.png" alt="" style=" width: 40px;">
            <h4>Bạn chắc chắn muốn xóa?</h4>
            <div style="display:flex ;justify-content: space-evenly;align-items: center">
                <button style="background-color:#52a95f; height: 44px;width: 80px" id="delete-cancle">Hủy bỏ</button>
                <form id="form-delete" action="" method="POST">
                    <input type="hidden" id="date-delete" name="date-delete">
                    <input type="hidden" id="class-delete" name="class-delete">
                    <input type="submit" style="background-color: #d52828;  height: 44px;width: 80px" id="delete" name="delete" value="Xóa"></input>
                </form>
            </div>
        </div>

    </div>


</body>

<script src="../common/menubar.js"></script>

<script>
    var ds_diemdanh = <?php print_r($jslistDD); ?>;
    var ds_lopDong = <?php print_r($jslistClassClose); ?>;
    var ds_lopMo = <?php print_r($jslistClassActive); ?>;
    var ds_hocsinh = <?php print_r($jslistStudentOfClass); ?>;
    var MaGV = <?php print_r($jsmaGV); ?>;
    var tenGV = <?php print_r($jstenGV); ?>;
    var detailTeacher = <?php print_r($jsdetailTeacher); ?>;
    var ds_lichhoc = <?php print_r($jslistSchedules); ?>;

    menubarv2(tenGV[0].TenGV, detailTeacher[0].GioiTinh, "teacher");
</script>

<script src="../../assets/js/userTeacherClass.js"></script>



<!--boostrap.js-->
<script src="https://code.jquery.com/jquery-3.7.0.min.js"></script>

<!--boostrap.js-->
<script src="../../plugins/bootstrap-5.2.3-dist/js/bootstrap.min.js"></script>
<script src="../../plugins/bootstrap-5.2.3-dist/js/bootstrap.bundle.min.js"></script>
<!--slick.js-->
<script type="text/javascript" src="../../plugins/slick-1.8.1/slick/slick.min.js"></script>




</html>