<?php
include "../../lib/functionClass2.php";
include "../../lib/registerClass.php";

$malop = $_GET['malop'];


session_start();
$mahs = "";
$maHS = "";
$maPH = "";
$resultHSLOP = false;
$studentBaseParentList = [];
$jsStudentList = [];
$selectChild = null;
if (isset($_SESSION['MaHS']['MaHS'])) {
    $mahs = $_SESSION['MaHS']['MaHS'];
    $resultHSLOP = setExits_hs_lop($mahs, $malop, $connection);
}
if (isset($_SESSION['MaPH']['MaPH'])) {
    $maPH = $_SESSION['MaPH']['MaPH'];
    $studentBaseParentList = studentOfParentRegister($maPH, $connection);
    $jsStudentList = json_encode($studentBaseParentList);

    $listBill_CD = searchHDHocPhi($connection, 'Chưa đóng', $maPH);
    $listBill_CN = searchHDHocPhi($connection, 'Còn nợ', $maPH);
    $listRequest = selectdslk($connection, $maPH);
}
$type = "";
$tenPH = array();
$detailParent = array();
$tenHS = array();
$detailStudent = array();
$checkregister = "";
$check = false;
$jsdetailStudent = "";
$jstenHS = "";
$jsdetailParent = "";
$jstenPH = "";
if (isset($_SESSION['MaHS'])) {
    $maPH = $_SESSION['MaHS'];
    $tenPH = selectTenPH($connection, $maPH['MaHS']);
    $detailParent = selectParent($connection, $maPH['MaHS']);
    $jstenPH = json_encode($tenPH);
    $jsdetailParent = json_encode($detailParent);
    $type = "student";
    //
    $check = true;
    $maHS = $_SESSION['MaHS'];
    $tenHS = selecttenHS($connection, $maHS['MaHS']);
    $detailStudent = selectStudent($connection, $maHS['MaHS']);
    $jstenHS = json_encode($tenHS);
    $jsdetailStudent = json_encode($detailStudent);
    $type = "student";
}
if (isset($_SESSION['MaPH'])) {
    $check = true;
    $maHS =  $_SESSION['MaPH'];
    $tenHS = selecttenHS($connection, $maHS['MaPH']);
    $detailStudent = selectStudent($connection, $maHS['MaPH']);
    $jstenHS = json_encode($tenHS);
    $jsdetailStudent = json_encode($detailStudent);
    $type = "parent";
    //
    $check = true;
    $maPH = $_SESSION['MaPH'];
    $tenPH = selectTenPH($connection, $maPH['MaPH']);
    $detailParent = selectParent($connection, $maPH['MaPH']);
    $jstenPH = json_encode($tenPH);
    $jsdetailParent = json_encode($detailParent);
    $type = "parent";
}
$jsType = json_encode($type);
$jscheck = json_encode($check);

$registerDone = false;
$dataClass = dataClassById($malop, $connection);
// $dataSchedules = dataSchedulesByMaLop($malop, $connection);
$nameTeacher = dataTeacherByMaLop($malop, $connection);
$result = listSchedules($connection);
$schedule = dataSchedulesByMaLop($malop, $connection);
$nameCondition = '';
if ($dataClass['TrangThai'] == 'Chưa mở') {
    $nameCondition = 'Chưa mở';
} else if ($dataClass['TrangThai'] == 'Đang mở') {
    $nameCondition = 'Đang mở';
} else {
    $nameCondition = 'Đã đóng';
}


function useRegisterConfirm($maHS, $maLop, $giamHP, $slhs, $connection)
{
    registToClass($maHS, $maLop, $giamHP, $connection);
    updateStudentCount($maLop, $slhs, $connection);
    echo "<meta http-equiv='refresh' content='0'>";
}

if (isset($_POST['register'])) {
    if ($_SESSION['MaHS'] != null) {
        $mahs = $_SESSION['MaHS']['MaHS'];

        $stRegister = $dataClass['SLHS'];
        setHSDANGKI($stRegister, $malop, $connection);

        if ($stRegister + 1 == $dataClass['SLHSToiDa']) {
            setSLHSToiDa($malop, $connection);
        }
    } else {
        header("Location: ../login_pages/login.php");
        exit();
    }
}
//hoc sinh tu dang ki
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
    <title>Chi tiết lớp học</title>
    <link rel="stylesheet" href="../../assets/css/manage.css">
    <link rel="stylesheet" href="../../assets/css/home.css" />
    <link rel="stylesheet" href="../../assets/css/common.css">
    <link rel="stylesheet" href="../../assets/css/registerClass_.css">
    <script src="https://code.jquery.com/jquery-3.6.4.js"></script>
    <link rel="stylesheet" href="../../plugins/bootstrap-5.2.3-dist/css/bootstrap.min.css" />
    <link rel="icon" href="../../assets/images/logo-web.png" type="image/x-icon">
    <style>
        .hidden {
            display: none;
        }

        .buttonAdd {
            position: absolute;
            left: 30;
            top: 100px;
            padding: 8px;

        }

        .register-class-btn-wrap {
            right: 40px;
        }

        .buttonAdd p {
            margin: 0;
            padding: 3px;
        }



        /* box add lớp */
        #overlay {
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
            visibility: hidden;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            overflow: auto;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 999;
            transition: opacity 0.3s, visibility 0.3s;
        }

        #overlay.active {
            opacity: 1;
            visibility: visible;
        }

        #box {
            opacity: 0;
            transform: scale(1.5);
            transition: opacity 0.3s, transform 0.3s;
            background-color: #fff;
            overflow: auto;
            padding: 30px;
            border-radius: 5px;
        }

        #box.active {
            opacity: 1;
            transform: scale(1);
        }

        #box #close-btn {
            position: absolute;
            top: -20px;
            right: 3px;
            background: none;
            border: none;
            font-size: 50px;
            cursor: pointer;
            color: #0088cc;
        }

        #showButtons {
            border: none;
            border: 1px solid #0088cc;
            font-size: 17px;
            background-color: #ffd95c;
            color: #0088cc;
        }

        #checkLoginButton {
            margin-top: 10px;
            margin-left: 50px;
            border: none;
            border: 1px solid #ffd95c;
            font-size: 15px;
            background-color: #0088cc;
            color: #ffd95c;
        }

        #noButton {
            margin-top: 10px;
            margin-left: 5px;
            border: none;
            border: 1px solid #ffd95c;
            font-size: 15px;
            background-color: #0088cc;
            color: #ffd95c;
        }



        .text-regsister {
            color: #0088cc;
            font-size: 18px;
            position: absolute;
            left: 30;
            top: 100px;
        }



        #btn-nofi {
            border: none;
            margin-left: 10px;
            background-color: white;
            position: fixed;
            z-index: 100;
            top: 20px;
            right: 201px;
            background-color: unset;
        }


        #div-nofi {
            display: none;
            position: fixed;

            background-color: #f2f2f2;
            padding: 10px;
            border-radius: 5px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            width: 400px;
            height: 400px;
            max-height: 380px;
            background-color: lavender;
            overflow-y: auto;
            border: ridge;
            z-index: 1000;
            top: 47px;
            right: 225px;
        }

        #nofi {
            border: solid 2px;
            border-radius: 8px;
            padding: 10px;
            margin-bottom: 20px;
        }

        #nofi button {

            background-color: rgb(0 125 124);
            color: white;
            border: none;
            padding: 10px 20px;
            margin-right: 10px;
            cursor: pointer;
        }


        #btn-logout {
            all: unset;

            border: none;
            background-color: unset;

        }

        #btn-logout:hover {
            cursor: pointer;
            background-color: #0d7cd0;
        }
    </style>
</head>

<body>
    <div class="toastDiv"></div>
    <header>
    </header>
    <main class="register-main">
        <div>
            <div id="menu-bar">
                <!-- khi chưa đăng nhập -->
                <?php

                if (!$check) : ?>
                    <div class="PageMenuBar">
                        <a class="PageLogoWrap" href="../home/home.php">
                            <img class="PageLogoImg" src="../../assets/images/logo-web.png" />
                        </a>
                        <div class="menubar-btnwrap">
                            <a href="../login_pages/login.php" class="PageLogoBtn">Login LoDuHi</a>
                        </div>
                    </div>
                <?php endif ?>

                <!-- khi đã đăng nhập -->

            </div>

            <!-- main -->

            <div id="overlay">
                <div id="box" class="">
                    <button id="close-btn">&times;</button>
                    <?php $checkExistChild = false;
                    $checkRegistedChild = [];
                    if ($check) {
                        $checkExistChild = checkExistWithChild($maPH['MaPH'], $connection);
                        $checkRegistedChild = checkRegistedChild($malop, $connection);
                    }

                    $jsonCheckRegistedChild = json_encode($checkRegistedChild);
                    if ($mahs != "" || $maPH != "") {
                        $discount = discount($malop, $connection);
                        $day = date("Y/m/d");
                        $startTime = $discount['TGBatDau'];
                        $startTimeObj = new DateTime($startTime);
                        $endTime = $discount['TGKetThuc'];
                        $endTimeObj = new DateTime($endTime);
                        $price = $discount['GiamHocPhi'];
                        $pr = false;
                        if ((new DateTime($day)) >= $startTimeObj && (new DateTime($day)) <= $endTimeObj) {
                            $pr = true;
                            insertDiscountMahs($malop, $mahs, $price, $connection);
                        }
                    }
                    ?>
                    <?php if (!$check) : ?>
                        <div class="container-dialog">
                            <h3 class="container-title">Thông báo!</h3>
                            <p class="dialog-content-text">Bạn chưa đăng nhập tài khoản</p>
                            <p class="dialog-content-text">Vui lòng đăng nhập để tiếp tục thao tác: <a style="color: #0088cc;" href="../login_pages/login.php">Login</a></p>
                        </div>
                    <?php endif ?>
                    <?php if ($check && !$checkExistChild) : ?>
                        <div class="container-dialog">
                            <h3 class="container-title">Thông báo!</h3>
                            <p class="dialog-content-text">Bạn chưa liên kết tài khoản của con</p>
                        </div>
                    <?php endif ?>
                    <?php if ($check && $checkExistChild) : ?>
                        <div class="container-dialog">
                            <h3 class="container-title">Vui lòng chọn con để đăng kí!</h3>
                            <div class="container-chosen-div">

                            </div>
                        </div>
                    <?php endif ?>
                </div>
            </div>
            <div class="dialog-wrap">
                <div class="dialog-container">
                    <?php if ($check && $type === "student") : ?>
                        <div class="container-dialog">
                            <h3 class="container-title">Thông báo!</h3>
                            <p class="dialog-content-text">Bạn chắc chắn muốn đăng kí</p>
                            <div class="dialog-content-btn-wrap">
                                <button class="dialog-content-btn" id="close-btn-confirm">Hủy</button>
                                <button class="dialog-content-btn" id="confirm-btn" onclick="dangki()">Xác nhận</button>
                            </div>
                        </div>
                    <?php endif ?>
                    <?php if ($check && $type === "parent") : ?>
                        <div class="container-dialog">
                            <h3 class="container-title">Thông báo!</h3>
                            <p class="dialog-content-text">Bạn chắc chắn muốn đăng kí cho con</p>
                            <div class="dialog-content-btn-wrap">
                                <button class="dialog-content-btn" id="close-btn-confirm">Hủy</button>
                                <button class="dialog-content-btn" id="confirm-btn">Xác nhận</button>
                            </div>
                        </div>
                    <?php endif ?>
                </div>
            </div>

        </div>
        </div>
        <?php if (!$resultHSLOP) : ?>
            <div class="buttonAdd register-class-btn-wrap hidden-wrap">
                <button id="showButtons" class="regiter-class-btn-now">
                    <p>Đăng kí lớp học ngay!</p>
                </button>
                <div id="buttonContainer" class="hidden">
                    <button id="checkLoginButton">Có</button>
                    <button id="noButton">Không</button>
                </div>
            </div>

        <?php endif ?>
        <?php if ($resultHSLOP) : ?>
            <div class="text-regsister hidden-wrap">
                Lớp này bạn đã đăng kí
            </div>
            </div>

        <?php endif ?>
        <div class="modal-bg register-class-bg">
            <img class="wave-start-jouney img-inner" src="../../assets/images/wave-Vector.svg" />
        </div>
        <div class="modal-content register-content-wrap">
            <div class="container-border">
                <h1 style="text-align: center;color:#0088cc;">Thông tin chi tiết lớp học <?php echo $malop; ?></h1>
                <form id="form_delete" name="form_delete" method="post">
                    <table>
                        <tr>
                            <th style="color:#0088cc">Mã lớp:</th>
                            <td style="color: #0088cc" id="teacher-id"><?php echo $malop; ?></td>
                        </tr>
                        <tr>
                            <th style="color: #0088cc">Tên lớp:</th>
                            <td style="color: #0088cc" id="teacher-gender" contenteditable="false"><?php echo $dataClass['TenLop']; ?></td>
                        </tr>
                        <tr>
                            <th style="color:#0088cc">Lứa tuổi:</th>
                            <td style="color: #0088cc" id="" contenteditable="false"><?php echo $dataClass['LuaTuoi']; ?></td>
                        </tr>
                        <tr>
                            <th style="color:#0088cc">Thời gian bắt đầu khóa học:</th>
                            <td style="color: #0088cc" id="teacher-date" contenteditable="false"><?php echo convertDateFormat($dataClass['ThoiGian']); ?></td>
                        </tr>
                        <tr>
                            <th style="color:#0088cc">Lịch học:</th>
                            <td style="color: #0088cc" id="teacher-age" contenteditable="false">
                                <?php
                                foreach ($schedule as $listschedules) {
                                    echo  $listschedules['Ngay'] . ' - ' . $listschedules['TGBatDau'] . '-' . $listschedules['TGKetThuc'];
                                    echo "<br/>";
                                }
                                ?>
                            </td>
                        </tr>
                        <tr>
                            <th style="color:#0088cc">Học phí:</th>
                            <td style="color: #0088cc" id="teacher-qq" contenteditable="false"><?php echo numberWithCommas($dataClass['HocPhi']); ?>VND</td>
                        </tr>
                        <tr>
                            <th style="color:#0088cc">Tổng số buổi đã dạy:</th>
                            <td style="color: #0088cc" id="" contenteditable="false"><?php echo $dataClass['SoBuoiDaToChuc']; ?></td>
                        </tr>
                        <tr>
                            <th style="color:#0088cc">Tổng số buổi dạy:</th>
                            <td style="color: #0088cc" id="" contenteditable="false"><?php echo $dataClass['SoBuoi']; ?></td>
                        </tr>
                        <tr>
                            <th style="color:#0088cc">Số lượng học sinh đăng kí:</th>
                            <td style="color: #0088cc" id="" contenteditable="false"><?php echo $dataClass['SLHS']; ?></td>
                        </tr>
                        <tr>
                            <th style="color:#0088cc">Số lượng học sinh tối đa:</th>
                            <td style="color: #0088cc" id="" contenteditable="false"><?php echo $dataClass['SLHSToiDa']; ?></td>
                        </tr>
                        <tr>
                            <th style="color:#0088cc">Tên giáo viên</th>
                            <td style="color: #0088cc" id="teacher-class" contenteditable="false">
                                <?php
                                foreach ($nameTeacher as $nameTeachers) {
                                    echo $nameTeachers['TenGV'];
                                };
                                ?>
                            </td>
                        </tr>
                        <tr>
                            <th style="color:#0088cc">Trình độ giáo viên :</th>
                            <td style="color: #0088cc">
                                <?php
                                foreach ($nameTeacher as $nameTeachers) {
                                    echo  $TeacherSalarie = $nameTeachers['TrinhDo'];
                                };
                                ?>
                            </td>
                        </tr>
                        <tr>
                            <th style="color: #0088cc">Khuyến mại :</th>
                            <td style="color: #0088cc">
                                <?php
                                $discount = getDiscount($malop, $connection);

                                if (empty($discount['GiamHocPhi'])) {
                                    echo '0%';
                                } else {
                                    echo $discount['GiamHocPhi'] . '%' . '    &emsp; &emsp; (Từ ' . $discount['TGBatDau'] . ' đến ' . $discount['TGKetThuc'] . ')';
                                }
                                ?>
                            </td>
                        </tr>
                    </table>

                    <?php if (!$resultHSLOP) : ?>
                        <button type="button" id="register-btn" class="register-now-btn-bottom">
                            <span>Đăng kí lớp học ngay!</span>
                        </button>
                    <?php endif ?>

                    <?php if ($resultHSLOP && $type === "student") : ?>
                        <div class="text-register-bottom">
                            <span>Bạn đã đăng kí lớp này!</span>
                        </div>
                    <?php endif ?>
                    <input style="display: none;" type="text" id="" name="deleteClass" value="helloToiDepTraiQuaDi">
                </form>
            </div>
        </div>
        <div class="register-back-wrap" id="turn-back-btn">
            <button class="register-back-btn regiter-class-btn-now">Quay lại</button>
        </div>
        </div>
    </main>
    <footer>
        <p>© 2023 Hệ thống quản lý giáo dục. All rights reserved.</p>
    </footer>
</body>
<button type="button" id="btn-nofi"><img id="img-nofi" width="30px" alt=""></button>
<div id="div-nofi">

</div>


<!-- Messenger Plugin chat Code -->
<div id="fb-root"></div>

<!-- Your Plugin chat code -->
<div id="fb-customer-chat" class="fb-customerchat">
</div>

<script>
  var chatbox = document.getElementById('fb-customer-chat');
  chatbox.setAttribute("page_id", "185087568020922");
  chatbox.setAttribute("attribution", "biz_inbox");
</script>

<!-- Your SDK code -->
<script>
  window.fbAsyncInit = function() {
    FB.init({
      xfbml            : true,
      version          : 'v18.0'
    });
  };

  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = 'https://connect.facebook.net/vi_VN/sdk/xfbml.customerchat.js';
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));
</script>


<script src="https://code.jquery.com/jquery-3.7.0.min.js"></script>
<!--boostrap.js-->
<script src="../../plugins/bootstrap-5.2.3-dist/js/bootstrap.min.js"></script>
<script src="../common/menubar.js"></script>
<script src="../common/toast.js"></script>
<script>
    var ds_yeuCau = <?php print_r(json_encode($listRequest)); ?>;
    var dsHoaDon_CD = <?php print_r(json_encode($listBill_CD)); ?>;
    var dsHoaDon_CN = <?php print_r(json_encode($listBill_CN)); ?>;
</script>
<script>
    var ten = null;
    var detail = null;
    var type = <?php print_r($jsType); ?> || "";
    if (type === "student") {
        ten = <?php print_r($jstenHS); ?>;
        detail = <?php print_r($jsdetailStudent); ?>;
    }
    if (type === "parent") {
        ten = <?php
                print_r($jstenPH); ?>;
        detail = <?php print_r($jsdetailParent); ?>;
    }
    var check = <?php print_r($jscheck); ?>;

    if (check) {
        if (type === "student") {
            menubarv2(ten[0].TenHS, detail[0].GioiTinh, "student");
        }
        if (type === "parent") {

            menubarv2(ten[0].TenPH, detail[0].GioiTinh, "parent");


            // var $ = jQuery.noConflict();

            var button = document.getElementById('btn-nofi');
            var hiddenDiv = document.getElementById('div-nofi');

            button.addEventListener('click', function() {
                hiddenDiv.style.display = hiddenDiv.style.display === 'block' ? 'none' : 'block';

            });


            var divNofiContainer = document.getElementById('div-nofi');
            showNotification();


        }
    }

    function showNotification() {
        divNofiContainer.innerHTML = "";

        ds_yeuCau.forEach(function(yeuCau) {

            var nofiDiv = document.createElement('div');
            nofiDiv.id = 'nofi';
            nofiDiv.innerHTML = '<p>Học viên ' + yeuCau.TenHS + ' đã gửi yêu cầu liên kết với bạn</p>' +
                '<button onclick="tuChoi(' + yeuCau.MaHS + ',' + yeuCau.MaPH + ')">Từ chối</button>' +
                '<button onclick="chapNhan(' + yeuCau.MaHS + ',' + yeuCau.MaPH + ')">Chấp nhận</button>';

            divNofiContainer.appendChild(nofiDiv);


        });

        dsHoaDon_CD.forEach(function(yeuCau) {
            yeuCau

            var nofiDiv = document.createElement('div');
            nofiDiv.id = 'nofi';
            nofiDiv.innerHTML = '<p> Hóa đơn ' + yeuCau.TenHD + ' (' + numberWithCommas(yeuCau.SoTienPhaiDong) + ' VND) của  Học viên ' + yeuCau.TenHS + '  chưa được thanh toán</p>'
            divNofiContainer.appendChild(nofiDiv);
        });



        dsHoaDon_CN.forEach(function(yeuCau) {

            var nofiDiv = document.createElement('div');
            nofiDiv.id = 'nofi';
            nofiDiv.innerHTML = '<p> Hóa đơn ' + yeuCau.TenHD + ' còn nợ (' + numberWithCommas(yeuCau.NoPhiConLai) + ' VND) của  Học viên ' + yeuCau.TenHS + '  chưa được thanh toán</p>'
            divNofiContainer.appendChild(nofiDiv);
        });
        var imgElement = document.getElementById("img-nofi");


        if (ds_yeuCau.length || dsHoaDon_CD.length || dsHoaDon_CN.length) {
            imgElement.src = "../../assets/images/bell-1.png";
        } else {
            imgElement.src = "../../assets/images/bell.png";
            document.getElementById('div-nofi').innerHTML = "<p>Không có thông báo mới!</p>";
        }
    }

    function tuChoi(maHS, maPH) {


        $.ajax({
            url: '../../api/replyRequest.php',
            type: 'POST',
            data: {
                maph: maPH,
                mahs: maHS,
                rep: "refuse",
                nyc: "ph",
            },
            success: function(res) {

                ds_yeuCau = JSON.parse(res).listRequest;

                showNotification();
            },
            error: function(xhr, status, error) {
                console.error(error);
            }
        });


    }

    function chapNhan(maHS, maPH) {


        $.ajax({
            url: '../../api/replyRequest.php',
            type: 'POST',
            data: {
                maph: maPH,
                mahs: maHS,
                rep: "accept",
                nyc: "ph",
            },
            success: function(res) {

                ds_yeuCau = JSON.parse(res).listRequest;
                showNotification();

            },
            error: function(xhr, status, error) {
                console.error(error);
            }
        });
    }


    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
</script>
<script>
    var type = <?php print_r($jsType); ?> || "";
    const openBtn = document.getElementById('checkLoginButton');
    const overlay = document.getElementById('overlay');
    const box = document.getElementById('box');
    const closeBtn = document.getElementById('close-btn');
    const turnBack = document.getElementById('turn-back-btn');
    const registerBtn = document.getElementById("register-btn");
    const dialogwrap = document.querySelector(".dialog-wrap");
    const dialogCon = document.querySelector(".dialog-container");
    turnBack.onclick = () => {
        window.history.go(-1);
    }

    closeBtn.addEventListener('click', () => {
        overlay.classList.remove('active');
        box.classList.remove('active');
        dialogwrap.classList.remove('active');
        dialogCon.classList.remove('active');
    });

    dialogCon.onclick = (e) => {
        e.stopPropagation();
    }

    dialogwrap.onclick = (e) => {
        e.stopPropagation();
        dialogwrap.classList.remove('active');
        dialogCon.classList.remove('active');

    }

    box.onclick = (e) => {
        e.stopPropagation();
    }

    overlay.onclick = (e) => {
        e.stopPropagation();
        overlay.classList.remove('active');
        box.classList.remove('active');
        location.reload();
    }

    $(document).ready(function() {
        $("#checkLoginButton").click(function() {
            var province_id = $(this).val();
            $.post(window.location.href, {
                check: province_id
            }, function(check) {
                setTimeout(function() {
                    document.documentElement.innerHTML = check;
                }, 30000); // Đợi 30 giây (30000ms) trước khi load lại trang
            });
        });
    });

    const maHS = <?php print_r(json_encode($maHS)) ?>;
    const maLop = <?php print_r(json_encode($malop)) ?>;

    function chonHocSinh(selectedId) {
     
        $.ajax({
            url: '../../api/registClassByParent.php',
            type: 'POST',
            data: {
                MaLop: maLop,
                MaHS: selectedId,
            },
            success: function(res) {

                if (res === "UpdateDone") {
                    useToast("Đăng kí thành công");
                    let timeout = setTimeout(() => {
                        location.reload();
                        clearTimeout(timeout);
                    },1500);
                }
                if (res === "MaxCount") {
                    useToast("Lớp đã đủ học sinh","Đăng kí thất bại","fail");
                }

            },
            error: function(xhr, status, error) {
                useToast("Đăng kí thất bại",null,"fail")
                console.error(error);
            }
        });
    }
    registerBtn.onclick = (e) => {
        onClickRegisterBtn(e);
    }

    function dangki() {
        $.ajax({
            url: '../../api/registClass.php',
            type: 'POST',
            data: {
                MaLop: maLop,
                MaHS: maHS,
            },
            success: function(res) {

                if (res === "UpdateDone") {
                    useToast("Đăng kí thành công");
                    let timeout = setTimeout(() => {
                        location.reload();
                        clearTimeout(timeout);
                    }, 1500);
                }
                if (res === "MaxCount") {
                    useToast("Lớp đã đủ học sinh","Đăng kí thất bại","fail");
                }

            },
            error: function(xhr, status, error) {
                useToast("Đăng kí thất bại",null,"fail")
                console.error(error);
            }
        });
    }


    function onClickRegisterBtn(e) {
        switch (type) {
            case "student": {
                onOpenConfirmDialog(e);
                break;
            }
            case "parent": {
                //if()
                e.stopPropagation();
                e.preventDefault();
                overlay.classList.add('active');
                box.classList.add('active');
                break;
            }
            default: {
                e.stopPropagation();
                e.preventDefault();
                overlay.classList.add('active');
                box.classList.add('active');
                break;
            }
        }
    }

    function onOpenConfirmDialog(e) {
        e.stopPropagation();
        e.preventDefault();
        dialogCon.classList.add('active');
        dialogwrap.classList.add('active');
    }
    const childListDiv = document.querySelector(".container-chosen-div");
    const listChildrent = <?php print_r($jsStudentList) ?>;
    const listStu = <?php print_r($jsonCheckRegistedChild) ?>;

    function showChildToSelect() {
        listChildrent.forEach(function(child) {
            let isRegist = listStu.find(stu => stu.MaHS === child.MaHS);
            var nofiDiv = document.createElement('div');
            
            nofiDiv.classList.add("register-div-add");
            nofiDiv.innerHTML =
                `
                <button ${isRegist ? "disabled" : ""} type="button" class="dialog-select-btn ${ isRegist ? "dialog-selected-item" :""}" onClick="chonHocSinh(` + child.MaHS + `)">` + child.TenHS + `</button>
                ${isRegist ? ("<span>-Đã đăng kí</span>"): ""}
                `;
            childListDiv.appendChild(nofiDiv);
        });
    }
    showChildToSelect();
    if (type != "") {
        const closeConfirm = document.querySelector("#close-btn-confirm");
        closeConfirm.onclick = (e) => {
            e.stopPropagation();
            dialogwrap.classList.remove('active');
            dialogCon.classList.remove('active');
        }
    }

    // var noButton = document.getElementById('noButton');

    // var showButton = document.getElementById('showButtons');
    // var buttonContainer = document.getElementById('buttonContainer');

    // // showButton.addEventListener('click', function(event) {
    // //     buttonContainer.classList.toggle('hidden');
    // //     event.stopPropagation();
    // // });

    // buttonContainer.addEventListener('click', function(event) {
    //     event.stopPropagation();
    // });

    // noButton.addEventListener('click', function() {
    //     buttonContainer.classList.toggle('hidden');
    // });
</script>

</html>