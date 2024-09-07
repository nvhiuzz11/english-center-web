<?php
require '../../lib/functionUserParent.php';

session_start();
$ma = $_SESSION['MaPH'];


$maPH = $ma['MaPH'];


$tenPH = selecttenPH($connection, $maPH);

$listBill_CD = searchHDHocPhi($connection, 'Chưa đóng', $maPH);
$listBill_CN = searchHDHocPhi($connection, 'Còn nợ', $maPH);

$listChild = studentOfParent($connection, $maPH);
$listClassOpen = listDD_HD($connection);
$listClassClose = listDD($connection, 'Đã đóng');
$listAbsent = listNgayNghi($connection);
$listMaHS = listMaHS($connection);
$listSchedules =  listSchedules($connection);
$listRequest  = selectdslk($connection, $maPH);
$detailParent = selectParent($connection, $maPH);

$jslistBill_CD = json_encode($listBill_CD);
$jslistBill_CN = json_encode($listBill_CN);

$jsdetailParent = json_encode($detailParent);
$jslistChild = json_encode($listChild);
$jstenPH = json_encode($tenPH);
$jslistClassOpen = json_encode($listClassOpen);
$jslistClassClose = json_encode($listClassClose);
$jslistAbsent = json_encode($listAbsent);
$jslistMaHS = json_encode($listMaHS);
$jslistSchedules = json_encode($listSchedules);
$jslistRequest = json_encode($listRequest);

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
  <link rel="stylesheet" href="/assets/css/userParent_child.css">
  <link rel="stylesheet" href="../../assets/css/common.css">
  <link rel="icon" href="../../assets/images/logo-web.png" type="image/x-icon">

  <title>Phụ huynh</title>
</head>

<body>

  <div id="menu-bar">

  </div>
  <div id="content">

    <div id="child">
      <h3>Con của phụ hunh</h3>
      <div id="div-child">
      
      </div>

      <div style="display:flex;align-items:center;justify-content:center;">
        <button id="btn-add-child" onclick="toggleDivLink()"> Thêm liên kết với học viên</button>
        <button type="button" id="btn-nofi"><img id="img-nofi" width="30px"  alt=""></button>
      </div>
      <div id="div-link">
        <form action="" method="post" id="form-link">
          <input type="text" id="input-child" name="input-child" placeholder="Nhập mã học viên" required>
          <input type="hidden" id="name-child" name="name-child">
          <br><button type="submit" id="btn-link">Liên kết</button>
          <p id="err-mahs" style="color:red ; font-style:italic"></p>
        </form>

      </div>
    </div>
    <div id="infor">

      <ul class="tab">
        <li><a href="#" class="tablinks" onclick="openTab(event, 'tabpane1')">Thông tin cá nhân</a></li>
        <li><a href="#" class="tablinks" onclick="openTab(event, 'tabpane2')">Lớp học</a></li>
        <!-- <li><a href="#" class="tablinks" onclick="openTab(event, 'tabpane3')">Tab 3</a></li> -->
      </ul>

      <div id="tabpane1" class="tabcontent">
        <h2>Thông tin cá nhân</h2>

        <table style="margin-left: 15%; width:80%">
          <tbody id="tbody-infor"></tbody>

        </table>
      </div>

      <div id="tabpane2" class="tabcontent">
        <div class="tab-2">
          <button id="btn-class-active" class="tablinks-2" onclick="openTab_2(event, 'tab3')">Lớp đang hoạt động</button>
          <button class="tablinks-2" onclick="openTab_2(event, 'tab4')">Lớp đã hoàn thành</button>
        </div>

        <div id="tab3" class="tabpane">
          <div id="class-active">
            <h3>Lớp đang hoạt động</h3>
            <div id="container-class"></div>

          </div>
        </div>

        <div id="tab4" class="tabpane">
          <div id="class-close"></div>
          <h3>Lớp đã hoàn thành</h3>
          <div id="container-class-close"></div>
        </div>

      </div>

    </div>

  </div>


  <div id="div-nofi">

  </div>

  <div class="add-success">
    <img src="../../assets/images/icon_success.png" alt="" style=" width: 40px;">
    <h3 id='tb1'></h3>
  </div>

</body>


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

<script src="../common/menubar.js"></script>

<script>
  var tenPH = <?php print_r($jstenPH); ?>;
  var ds_con = <?php print_r($jslistChild); ?>;
  var ds_classOpen = <?php print_r($jslistClassOpen); ?>;
  var ds_classClose = <?php print_r($jslistClassClose); ?>;
  var ds_absent = <?php print_r($jslistAbsent); ?>;
  var ds_maHS = <?php print_r($jslistMaHS); ?>;
  var ds_schedule = <?php print_r($jslistSchedules); ?>;
  var ds_yeuCau = <?php print_r($jslistRequest); ?>;
  var detailParent = <?php print_r($jsdetailParent); ?>;


  var dsHoaDon_CD = <?php print_r($jslistBill_CD); ?>;
  var dsHoaDon_CN = <?php print_r($jslistBill_CN); ?>;

  menubarv2(tenPH[0].TenPH, detailParent[0].GioiTinh, "parent")
</script>

<script src="../../assets/js/userParent_child.js"></script>

<!--boostrap.js-->
<script src="https://code.jquery.com/jquery-3.7.0.min.js"></script>

<!--boostrap.js-->
<script src="../../plugins/bootstrap-5.2.3-dist/js/bootstrap.min.js"></script>
<script src="../../plugins/bootstrap-5.2.3-dist/js/bootstrap.bundle.min.js"></script>
<!--slick.js-->
<script type="text/javascript" src="../../plugins/slick-1.8.1/slick/slick.min.js"></script>



</html>