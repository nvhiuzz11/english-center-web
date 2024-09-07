<?php
require '../../lib/functionUserStudent.php';

session_start();
$ma = $_SESSION['MaHS'];
$maHS = $ma['MaHS'];

$tenHS = selecttenHS($connection, $maHS);
$listParent = parentOfStudent($connection, $maHS);
$listMaPH = listMaPH($connection);
$listRequest  = selectdslk($connection, $maHS);
$detailStudent = selectStudent($connection, $maHS);

$jstenHS = json_encode($tenHS);
$jslistParent = json_encode($listParent);
$jslistMaPH = json_encode($listMaPH);
$jslistRequest = json_encode($listRequest);
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

    <link rel="stylesheet" href="../../plugins/slick-1.8.1/slick/slick.css" />
    <link rel="stylesheet" href="../../assets/css/home.css" />

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" />
    <link rel="stylesheet" href="/assets/css/userStudent_link.css">
    <link rel="stylesheet" href="../../assets/css/common.css">
    <script src="https://code.jquery.com/jquery-3.6.4.js"></script>
    <link rel="icon" href="../../assets/images/logo-web.png" type="image/x-icon">

    <title>Học viên</title>
</head>

<body>

    <div id="menu-bar">

    </div>
    <div id="content" style="display:flex">
        <div id="parent-container">
            <div style="width:80%">
                <h2>Phụ huynh đã liên kết</h2>
                <div id="div-parent">


                </div>


            </div>

        </div>
        <div id="link-container">

            <h2>Liên kết phụ huynh</h2>

            <form action="" id="form-link" method="POST">
                <input type="text" id="maPH-link" name="maPH-link" placeholder="Nhập mã phụ huynh">
                <button type="submit" id="btn-link">Liên kết</button>
                <button type="button" id="btn-nofi"><img id="img-nofi" width="30px" src=<?php if (!$listRequest) echo '"../../assets/images/bell.png"';
                                                                                        else echo '"../../assets/images/bell-1.png"' ?> alt=""></button>
                <input type="hidden" id="name-parent" name="name-parent">
            </form>
            <p id="err" style="color:red ; font-style:italic; margin-left: 80px;"></p>
        </div>

    </div>

    <div id="div-nofi">

    </div>

    <div class="add-success">
        <img src="../../assets/images/icon_success.png" alt="" style=" width: 40px;">
        <h3 id='tb1'></h3>
    </div>


</body>
<script src="../common/menubar.js"></script>
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

<script>
    var tenHS = <?php print_r($jstenHS); ?>;
    var ds_ph = <?php print_r($jslistParent); ?>;
    var ds_maPH = <?php print_r($jslistMaPH); ?>;
    var ds_yeuCau = <?php print_r($jslistRequest); ?>;
    var detailStudent = <?php print_r($jsdetailStudent); ?>;

    menubarv2(tenHS[0].TenHS,detailStudent[0].GioiTinh)
    
</script>

<script src="../../assets/js/userStudent_link.js"></script>

<!--boostrap.js-->
<script src="https://code.jquery.com/jquery-3.7.0.min.js"></script>

<!--boostrap.js-->
<script src="../../plugins/bootstrap-5.2.3-dist/js/bootstrap.min.js"></script>
<script src="../../plugins/bootstrap-5.2.3-dist/js/bootstrap.bundle.min.js"></script>
<!--slick.js-->
<script type="text/javascript" src="../../plugins/slick-1.8.1/slick/slick.min.js"></script>



</html>