<?php
require '../../lib/functionPersonal.php';

session_start();
$ma = $_SESSION['MaPH'];


$maPH = $ma['MaPH'];



$detailParent = selectParent($connection, $maPH);
$accountParent = selectAcountParent($connection, $maPH);
$listBill_CD = searchHDHocPhi($connection, 'Chưa đóng', $maPH);
$listBill_CN = searchHDHocPhi($connection, 'Còn nợ', $maPH);




$jsdetailParent = json_encode($detailParent);
$jsaccountParent = json_encode($accountParent);

$jslistBill_CD = json_encode($listBill_CD);
$jslistBill_CN = json_encode($listBill_CN);

$listRequest  = selectdslk($connection, $maPH);

$jslistRequest = json_encode($listRequest);



if ($_SERVER['REQUEST_METHOD'] === 'POST') {





    if (isset($_POST['accept-maHS'])) {
        $mahs = $_POST['accept-maHS'];
        deletedslk($connection, $mahs, $maPH);
        insertPHHS($mahs, $maPH, $connection);
        header("Location: personal_Parent.php");
    }

    if (isset($_POST['refuse-maHS'])) {
        $mahs = $_POST['refuse-maHS'];

        deletedslk($connection, $mahs, $maPH);

        header("Location: personal_Parent.php");
    }
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
    <link rel="stylesheet" href="../../assets/css/personal.css" />
    <link rel="stylesheet" href="../../assets/fonts/themify-icons/themify-icons.css">
    <link rel="stylesheet" href="../../assets/css/home.css" />
    <link rel="stylesheet" href="../../plugins/bootstrap-5.2.3-dist/css/bootstrap.min.css" />
    <link rel="stylesheet" href="../../assets/css/common.css">
    <link rel="icon" href="../../assets/images/logo-web.png" type="image/x-icon">
    <title>Thông tin cá nhân</title>
</head>

<body>
    <div class="personal-wrap">
        <div id="menu-bar"></div>

        <div class="personal-bg-wrap">
            <h2 class="personal-title-page" style=" margin-top: 10px;"> Thông tin cá nhân</h2>
        </div>

        <div class="personal-inner">
            <div class="personal-avt-wrap">
                <img alt="" class="personal-avt">
            </div>
            <div class="personal-inner-name"></div>
            <div class="personal-inner-info">
                <div class="edit-div">
                    <button class="edit-wrap edit-info">
                        <i class="ti-pencil-alt edit-icon"></i>
                    </button>
                </div>
                <form action="" method="POST" id='form-update'>
                    <div class=" personal-inner-item">
                        <div class="personal-inner-key">Mã phụ huynh :</div>
                        <div id="id" class="personal-inner-value personal-inner-value-info">Long</div>
                    </div>
                    <div id="id-inp" class="personal-inner-edit-range personal-inner-edit-range-info"></div>
                    <input id="id-input" name="id-input" class="personal-inner-edit-range personal-inner-edit-range-info" type="hidden"></input>

                    <div class=" personal-inner-item personal-inner-item-first">
                        <div class="personal-inner-key">Tên : <strong style="color: red; font-size: 12px;font-style: italic;" id="err-name"></strong></div>
                        <div id="name" class="personal-inner-value personal-inner-value-info">Long</div>
                    </div>

                    <input id="name-input" name="name-input" class="personal-inner-edit-range personal-inner-edit-range-info" type="tetxt" placeholder="Nhập tên" required></input>

                    <div class="personal-inner-item">
                        <div class="personal-inner-key">Giới tính : <strong style="color: red; font-size: 12px;font-style: italic;" id="err-gender"></strong></div>
                        <div id="gender" class="personal-inner-value personal-inner-value-info">Nữ</div>
                    </div>
                    <select id="gender-input" name="gender-input" class="personal-inner-edit-range personal-inner-edit-range-info" required>
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                    </select>


                    <div class="personal-inner-item">
                        <div class="personal-inner-key">Ngày sinh : <strong style="color: red; font-size: 12px;font-style: italic;" id="err-birthday"></strong></div>
                        <div id="birthday" class="personal-inner-value personal-inner-value-info">11-12-2122</div>
                    </div>
                    <input id="birthday-input" name="birthday-input" class="personal-inner-edit-range personal-inner-edit-range-info" type="date" onchange="setAge()"></input>

                    <div class="personal-inner-item">
                        <div class="personal-inner-key">Tuổi : <strong style="color: red; font-size: 12px;font-style: italic;" id="err-age"></strong></div>
                        <div id="age" class="personal-inner-value personal-inner-value-info">12</div>
                    </div>
                    <input id="age-input" name="age-input" class="personal-inner-edit-range personal-inner-edit-range-info" type="number" readonly></input>



                    <div class="personal-inner-item">
                        <div class="personal-inner-key">Địa chỉ : <strong style="color: red; font-size: 12px;font-style: italic;" id="err-address"></strong></div>
                        <div id="address" class="personal-inner-value personal-inner-value-info">Longabc@gmail.com</div>
                    </div>
                    <input id="address-input" name="address-input" class="personal-inner-edit-range personal-inner-edit-range-info" type="tetxt" placeholder="Nhập dịa chỉ" required></input>



                    <div class="personal-inner-item">
                        <div class="personal-inner-key">Email: <strong style="color: red; font-size: 12px;font-style: italic;" id="err-email"></strong></div>
                        <div id="email" class="personal-inner-value personal-inner-value-info">Longabc@gmail.com</div>
                    </div>
                    <input id="email-input" name="email-input" class="personal-inner-edit-range personal-inner-edit-range-info" type="tetxt" placeholder="Nhập Email" required></input>

                    <div class="personal-inner-item">
                        <div class="personal-inner-key">Số điện thoại: <strong style="color: red; font-size: 12px;font-style: italic;" id="err-phone"></strong></div>
                        <div id="phone" class="personal-inner-value personal-inner-value-info">01234567</div>
                    </div>
                    <input id="phone-input" name="phone-input" class="personal-inner-edit-range personal-inner-edit-range-info" type="tetxt" placeholder="Nhập số điện thoại" required></input>
                    <div class="personal-inner-control control-info">
                        <button type="button" class="personal-btn personal-cancel info-cancel">Huỷ</button>
                        <button type="submit" class="personal-btn personal-accept info-accept" id="btn-update">Cập nhật</button>
                    </div>
                </form>
            </div>
            <div class="personal-inner-info personal-inner-password">
                <div class="edit-div">
                    <button class="edit-wrap edit-pass">
                        <i class="ti-pencil-alt edit-icon"></i>
                    </button>
                </div>

                <div class="personal-inner-item personal-inner-item-first personal-inner-password personal-pass-flex">
                    <div class="personal-inner-key">Mật khẩu: <strong style="color: red; font-size: 12px;font-style: italic;" id="err-pass"></strong></div>
                    <input id='password' class="personal-inner-value personal-inner-value-pass personal-inner-value-pass-input" type="password" readonly></input>

                    <div class="">
                        <button style="width:25px ; margin-top:2px;  height:25px; margin-left:90%; background-image: url(https://icons.veryicon.com/png/o/miscellaneous/hekr/action-hide-password.png);background-size: cover; " onclick="togglePassword()" class="personal-inner-value personal-inner-value-pass"></button>
                    </div>
                </div>


                <form action="" method="post" id="form-change-pass">
                    <input id="new-pass" name="new-pass" class="personal-inner-edit-range personal-inner-edit-range-pass" type="password" placeholder="Nhập mật khẩu mới" required></input>
                    <div class="personal-inner-control control-pass">

                        <button type="button" class="personal-btn personal-cancel password-cancel">Hủy</button>

                        <input type="hidden" name="username" id="username">
                        <button class="personal-btn personal-accept password-accept" id="btn-change">Lưu</button>


                    </div>

                    <!-- <div class="personal-inner-item personal-inner-item-first">
                        <div class="personal-inner-key">Nhập lại Mật khẩu:</div>
                        <div class="personal-inner-value">********</div>
                    </div> -->
                    <!-- <input class="personal-inner-edit-range" type="password"></input> -->


                </form>
            </div>
        </div>

    </div>
    <div class="add-success">
        <img src="../../assets/images/icon_success.png" alt="" style=" width: 40px;">
        <h5 id='tb1'></h5>
    </div>
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
    <script src="../../plugins/bootstrap-5.2.3-dist/js/bootstrap.bundle.min.js"></script>
    <!--slick.js-->
    <!-- <script src="./personal.js"></script> -->
    <script src="../common/menubar.js"></script>

    <script>
        var detailParent = <?php print_r($jsdetailParent); ?>;
        var accountParent = <?php print_r($jsaccountParent); ?>;
        var ds_yeuCau = <?php print_r($jslistRequest); ?>;
        var dsHoaDon_CD = <?php print_r($jslistBill_CD); ?>;
        var dsHoaDon_CN = <?php print_r($jslistBill_CN); ?>;
        menubarv2(detailParent[0].TenPH, detailParent[0].GioiTinh, "parent", "../main_pages");
    </script>
</body>

<script>
    showInfor();

    function showInfor() {
        document.getElementById('id').innerHTML = detailParent[0].MaPH;
        document.getElementById('id-inp').innerHTML = detailParent[0].MaPH;
        document.getElementById('name').innerHTML = detailParent[0].TenPH;
        document.getElementById('name-input').value = detailParent[0].TenPH;
        document.getElementById('gender').innerHTML = detailParent[0].GioiTinh;
        var img = document.querySelector(".personal-avt");
        var img2 = document.querySelector(".menubar-avt");
        if (detailParent[0].GioiTinh == "Nam") {
            img.src = "../../assets/images/Parent-male-icon.png";
            img2.src = "../../assets/images/Parent-male-icon.png";
        } else {
            img.src = "../../assets/images/Parent-female-icon.png";
            img2.src = "../../assets/images/Parent-female-icon.png";
        }
        var selectTag = document.getElementById("gender-input");
        for (var i = 0; i < selectTag.options.length; i++) {
            if (selectTag.options[i].value == detailParent[0].GioiTinh) {
                selectTag.options[i].selected = true;
                break;
            }
        }
        document.getElementById('birthday').innerHTML = formatDate(detailParent[0].NgaySinh);
        document.getElementById('birthday-input').value = detailParent[0].NgaySinh;
        document.getElementById('age').innerHTML = detailParent[0].Tuoi;
        document.getElementById('age-input').value = detailParent[0].Tuoi;
        document.getElementById('address').innerHTML = detailParent[0].DiaChi;
        document.getElementById('address-input').value = detailParent[0].DiaChi;
        document.getElementById('email').innerHTML = detailParent[0].Email;
        document.getElementById('email-input').value = detailParent[0].Email;
        document.getElementById('phone').innerHTML = detailParent[0].SDT;
        document.getElementById('phone-input').value = detailParent[0].SDT;
        document.getElementById('password').value = accountParent[0].Password;


    }

    function togglePassword() {
        var passwordInput = document.getElementById("password");
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
        } else {
            passwordInput.type = "password";
        }
    }

    function formatDate(dateString) {
        var dateParts = dateString.split('-');
        var year = dateParts[0];
        var month = dateParts[1];
        var day = dateParts[2];

        var formattedDate = day + '-' + month + '-' + year;
        return formattedDate;
    }

    function setAge() {
        var inputDate = document.getElementById("birthday-input").value;
        var namHienTai = new Date().getFullYear();
        var namInput = new Date(inputDate).getFullYear();

        var age = namHienTai - namInput;
        document.getElementById('age-input').value = age;

    }


    // Khi nhấn nút Cập nhật
    const submit_update = document.getElementById('btn-update');
    submit_update.addEventListener('click', function(event) {

        var check = true;
        event.preventDefault();

        const phone = document.getElementById('phone-input').value;
        const email = document.getElementById('email-input').value;
        const name = document.getElementById('name-input').value;
        const gender = document.getElementById('gender-input').value;
        const birthday = document.getElementById('birthday-input').value;
        const age = document.getElementById('age-input').value;
        const address = document.getElementById('address-input').value;


        var erorr_empty = "*Dữ liệu không để trống";

        //Kiểm tra dữ liệu nhập vào
        if (!name) {
            document.getElementById('err-name').textContent = erorr_empty;
            check = false;
        } else
            document.getElementById('err-name').textContent = "";

        if (!gender) {
            document.getElementById('err-gender').textContent = erorr_empty;
            check = false;
        } else
            document.getElementById('err-gender').textContent = "";

        if (!birthday) {
            document.getElementById('err-birthday').textContent = erorr_empty;
            check = false;
        } else
            document.getElementById('err-birthday').textContent = "";

        if (!age) {

            document.getElementById('err-age').textContent = erorr_empty;
            check = false;
        } else
            document.getElementById('err-age').textContent = "";



        if (!address) {

            document.getElementById('err-address').textContent = erorr_empty;
            check = false;
        } else
            document.getElementById('err-address').textContent = "";



        if (!(/^(0[0-9]{9})$/.test(phone))) {
            document.getElementById('err-phone').textContent = "*Số điện thoại không chính xác (0..; 10 chữ số)";
            check = false;
        } else
            document.getElementById('err-phone').textContent = "";

        if (!(/\S+@\S+\.\S+/.test(email)) && email) {
            document.getElementById('err-email').textContent = "*Email không chính xác (example@xxx.com)";
            check = false;
        } else
            document.getElementById('err-email').textContent = "";

        if (!check)
            return;


        $.ajax({
            type: 'POST',
            url: '../../api/updateInfor.php',
            data: {
                id: detailParent[0].MaPH,
                name: name,
                gender: gender,
                birthday: birthday,
                age: age,
                address: address,
                phone: phone,
                email: email,
                user: "parent",
            },
            success: function(res) {
                detailParent = JSON.parse(res);
                showInfor();
                onChangeEditType(!isEdit, "info");
            },
            error: function(xhr, status, error) {
                console.error(error);
            }
        });

        document.getElementById("tb1").textContent = "Đã cập nhật thông tin"
        document.querySelector(".add-success").style.display = "block"
        setTimeout(function() {
            document.querySelector(".add-success").style.display = "none";

        }, 1000);;


        // Gửi form đi nếu tất cả dữ liệu hợp lệ

    });


    document.getElementById('btn-change').addEventListener('click', function(event) {

        var check = true;
        event.preventDefault();
        const pass = document.getElementById('new-pass').value;



        //Kiểm tra dữ liệu nhập vào

        if (!pass) {

            document.getElementById('err-pass').textContent = "Chưa nhập mật khẩu mới";
            check = false;
        } else
            document.getElementById('err-pass').textContent = "";

        if (!check)
            return;
        $.ajax({
            type: 'POST',
            url: '../../api/updatePass.php',
            data: {
                id: detailParent[0].MaPH,
                username: accountParent[0].UserName,
                pass: pass,
                user: "parent",
            },
            success: function(res) {
                accountParent = JSON.parse(res);

                showInfor();
                onChangeEditType(!isEdit, "pass")
            },
            error: function(xhr, status, error) {
                console.error(error);
            }
        });

        document.getElementById("tb1").textContent = "Đã cập nhật mật khẩu";
        document.querySelector(".add-success").style.display = "block"
        setTimeout(function() {
            document.querySelector(".add-success").style.display = "none";

        }, 1000);


    });




    // initial setup

    var $$ = document.querySelectorAll.bind(document)



    var isEdit = false
    const editBtn = document.querySelector(".edit-info")

    $$(".personal-inner-value").forEach(item => {
        item.classList.add("personal-act-inline")
    })
    const inputdata = {
        name: "",
        email: "",
        phone: "",
    }
    //func chuyển dạng
    const onChangeEditType = (type, opt) => {
        isEdit = type

        if (isEdit) {
            $$(`.personal-inner-value-${opt}`).forEach((item) => {
                item.classList.remove("personal-act-inline")
            })
            document.querySelector(`.control-${opt}`).classList.add("personal-act-flex")
            $$(`.personal-inner-edit-range-${opt}`).forEach((item) => {
                item.classList.add("personal-active")
            })
            // khởi tạo giá trị của input khi chuyển sang dạng edit
            if (opt === "info") {



            }
        } else {
            $$(`.personal-inner-edit-range-${opt}`).forEach((item) => {
                item.classList.remove("personal-active")
            })
            $$(`.personal-inner-value-${opt}`).forEach((item) => {
                item.classList.add("personal-act-inline")
            })
            document.querySelector(`.control-${opt}`).classList.remove("personal-act-flex")
        }
    }



    editBtn.onclick = () => {
        onChangeEditType(!isEdit, "info")
    }

    document.querySelector(".edit-pass").onclick = () => {
        onChangeEditType(!isEdit, "pass")
    }

    document.querySelector(".info-cancel").onclick = () => {
        onChangeEditType(false, "info");

        document.getElementById('err-name').textContent = "";
        document.getElementById('err-gender').textContent = "";
        document.getElementById('err-birthday').textContent = "";
        document.getElementById('err-age').textContent = "";
        document.getElementById('err-address').textContent = "";
        document.getElementById('err-phone').textContent = "";
        document.getElementById('err-email').textContent = "";
    }
    document.querySelector(".password-cancel").onclick = () => {
        onChangeEditType(false, "pass");
        document.getElementById('err-pass').textContent = "";
    }




    var button = document.getElementById('btn-nofi');
    var hiddenDiv = document.getElementById('div-nofi');

    button.addEventListener('click', function() {
        hiddenDiv.style.display = hiddenDiv.style.display === 'block' ? 'none' : 'block';

    });
    var divNofiContainer = document.getElementById('div-nofi');
    showNotification();

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

</html>