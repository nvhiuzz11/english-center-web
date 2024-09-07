<?php
require '../../lib/functionUserStudent.php';

session_start();
$ma = $_SESSION['MaHS'];

$maHS = $ma['MaHS'];



$tenHS = selecttenHS($connection, $maHS);

$listClassOpen = listDD_HD($connection,$maHS);
$listClassClose = listDD($connection, $maHS, 'Đã đóng');
$listAbsent = listNgayNghi($connection, $maHS);
$listSchedules =  listSchedules($connection);
$detailStudent = selectStudent($connection, $maHS);


$jstenHS = json_encode($tenHS);
$jslistClassOpen = json_encode($listClassOpen);
$jslistClassClose = json_encode($listClassClose);
$jslistAbsent = json_encode($listAbsent);
$jslistSchedules = json_encode($listSchedules);
$jsdetailStudent = json_encode($detailStudent);


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
  <link rel="stylesheet" href="/assets/css/userStudent_class.css">
  <link rel="stylesheet" href="../../assets/css/common.css">
  <link rel="icon" href="../../assets/images/logo-web.png" type="image/x-icon">

  <title>Học viên</title>
</head>

<body>

  <div id="menu-bar">

  </div>
  <div id="content">

    <ul class="tab">
      <li><a href="#" id="btn-1" class="tablinks" onclick="openTab(event, 'tabpane1')">Lớp đang theo học </a></li>
      <li><a href="#" class="tablinks" onclick="openTab(event, 'tabpane2')">Lớp đã hoàn thành</a></li>
      <!-- <li><a href="#" class="tablinks" onclick="openTab(event, 'tabpane3')">Tab 3</a></li> -->
    </ul>
    <div id="tabpane1" class="tabcontent">
      <div id="class-active">
        <h2>Lớp đang theo học</h2>
        <div id="container-class"></div>
      </div>
    </div>

    <div id="tabpane2" class="tabcontent">

      <div id="class-close">
        <h2>Lớp đã hoàn thành</h2>
        <div id="container-class-close"></div>
      </div>
    </div>
  </div>

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
  var tenHS = <?php print_r($jstenHS); ?>;
  var detailStudent = <?php print_r($jsdetailStudent); ?>;

  var ds_classOpen = <?php print_r($jslistClassOpen); ?>;
  var ds_classClose = <?php print_r($jslistClassClose); ?>;
  var ds_absent = <?php print_r($jslistAbsent); ?>;
  var ds_schedule = <?php print_r($jslistSchedules); ?>;

  menubarv2(tenHS[0].TenHS, detailStudent[0].GioiTinh);
</script>

<script src="../../assets/js/userStudent_class.js"></script>

<!--boostrap.js-->
<script src="https://code.jquery.com/jquery-3.7.0.min.js"></script>

<!--boostrap.js-->
<script src="../../plugins/bootstrap-5.2.3-dist/js/bootstrap.min.js"></script>
<script src="../../plugins/bootstrap-5.2.3-dist/js/bootstrap.bundle.min.js"></script>
<!--slick.js-->
<script type="text/javascript" src="../../plugins/slick-1.8.1/slick/slick.min.js"></script>



</html>