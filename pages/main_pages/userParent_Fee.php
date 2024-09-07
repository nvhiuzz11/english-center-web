<?php
require '../../lib/functionUserParent.php';

session_start();
$ma = $_SESSION['MaPH'];


$maPH = $ma['MaPH'];

$listBill = searchHDHocPhi($connection, '', $maPH);
$tenPH = selecttenPH($connection, $maPH);
$detailParent = selectParent($connection, $maPH);
$listChild = studentOfParent($connection, $maPH);
$listLSTHP = listLSTHP($connection);
$jsdetailParent = json_encode($detailParent);
$listRequest  = selectdslk($connection, $maPH);

$listBill_CD = searchHDHocPhi($connection, 'Chưa đóng', $maPH);
$listBill_CN = searchHDHocPhi($connection, 'Còn nợ', $maPH);

$jslistBill_CD = json_encode($listBill_CD);
$jslistBill_CN = json_encode($listBill_CN);
$jslistRequest = json_encode($listRequest);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['refesh'])) {
        header("Location: userParent_Fee.php");
    }

    if (isset($_POST['btn-logout'])) {

        session_start();
        session_unset();
        session_destroy();
        header("Location: ../home/home.php");
    }
}
$jstenPH = json_encode($tenPH);
$jslistBill = json_encode($listBill);
$jslistLSTHP = json_encode($listLSTHP);
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
    <link rel="stylesheet" href="/assets/css/userParent_Fee.css">
    <link rel="stylesheet" href="../../assets/css/common.css">
    <link rel="icon" href="../../assets/images/logo-web.png" type="image/x-icon">
    <title>Phụ huynh</title>
</head>

<body>

    <div id="menu-bar">

    </div>
    <div id="content">



        <div id="div-table">

            <h1>Danh sách học phí</h1>
            <div class="search-container">
                <form id="form-search" method="post" action="<?php echo htmlspecialchars($_SERVER['PHP_SELF']); ?>" style="width: 50%; margin: unset;display: inline-flex;" autocomplete="off">
                    <input type="text" id="keyword" placeholder="Tìm kiếm..." style="width: 70%" oninput="searchList()">
                    <input type="submit" id="search" id="search" value="Tìm kiếm" style="width: 100px">
                    <button type="submit" id="refesh-btn" name="refesh" style="     border: none; background-color: white;"> <img style="width: 30px;" src="../../assets/images/Refresh-icon.png" alt=""></button>


                </form>
                <div style="display:inline-flex;    align-items: center;">
                    <h3 style="margin-right:5px">Trạng thái :</h3>
                    <select id="select-status">
                        <option value="">...</option>
                        <option value="Chưa đóng">Chưa đóng</option>
                        <option value="Còn nợ">Còn nợ</option>
                        <option value="Hoàn thành">Hoàn thành</option>
                    </select>
                    <h3 style="margin-right:5px ;  margin-left:20px">Con :</h3>
                    <select id="select-child">
                        <option value="">...</option>
                        <?php for ($i = 0; $i < count($listChild); $i++) { ?>
                            <option value="<?php echo $listChild[$i]['TenHS'] ?>"><?php echo $listChild[$i]['TenHS'] ?></option>
                        <?php } ?>

                    </select>


                </div>

            </div>

            <table id="table-1">
                <?php $i = 1;
                
                ?>
                <thead id="thead-1">
                    <tr>
                        <th data-column="0" style="width:20px" onclick="sortTable(0)">STT</th>
                        <th data-column="1" onclick="sortTable(1)">Mã Hóa dơn</th>
                        <th data-column="2" onclick="sortTable(2)">Tên hóa đơn</th>
                        <th data-column="3" onclick="sortTable(3)">Tên học viên</th>
                        <th data-column="4" onclick="sortTable(4)">Lớp</th>
                        <th data-column="5" onclick="sortTable(5)">Thời gian </th>
                        <th data-column="6" onclick="sortTable(6)">Số tiền </th>
                        <th data-column="7" onclick="sortTable(7)">Giảm học phí </th>
                        <th data-column="8" onclick="sortTable(8)">Số tiền giảm </th>
                        <th data-column="9" onclick="sortTable(9)">Số tiền phải đóng </th>
                        <th data-column="10" onclick="sortTable(10)">Số tiền đã đóng</th>
                        <th data-column="11" onclick="sortTable(11)">Nợ phí còn lại </th>
                        <th data-column="12" onclick="sortTable(12)">Trạng thái </th>

                    </tr>
                </thead>

                <tbody class="tbody-1">
                </tbody>

                </tbody>

                <tbody class="tbody-5">
            </table>
        </div>

        <div class="modal-bg">
            <div class="modal-content">
                <div class="container">
                    <h2>Lịch sử thanh toán hóa đơn</h2>

                    <h3>Mã hóa đơn : <strong id="id-bill-lsthp"></strong></h3>
                    <div style="display: flex;">
                        <p style="margin-right: 20px;">Số tiền phải đóng:
                        <p id="stpd-lsthp"></p>
                        </p>
                    </div>
                    <div style="display: flex; margin-bottom: 20px;">
                        <p style="margin-right: 20px;">Trạng thái :
                        <p id="tt-lsthp"></p>
                        </p>
                    </div>

                    <button id="btn-add-trans" style="margin-bottom:5px">Thanh toán</button>
                    <form action="" method="POST" id="form-edit-trans"></form>
                    <table id="bill-history">
                        <thead style="background-color:#b9b5b5; color:black">

                            <tr>
                                <th>STT</th>
                                <th>Mã giao dịch</th>
                                <th>Thời gian</th>
                                <th>Số tiền</th>

                            </tr>
                        </thead>
                        <tbody id="tbody-lsthp">

                            <tr>
                                <td><strong id="bill-empty" style="color: tomato;"></strong>s</td>
                            </tr>
                        </tbody>


                    </table>


                </div>

                <button class="close-btn">Đóng</button>
            </div>
        </div>

    </div>
    <button type="button" id="btn-nofi"><img id="img-nofi" width="30px" alt=""></button>
    <div id="div-nofi">
        
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
    var tenPH = <?php print_r($jstenPH); ?>;
    var dsHoaDon = <?php print_r($jslistBill); ?>;
    var ds_LS_THP = <?php print_r($jslistLSTHP); ?>;
    var detailParent = <?php print_r($jsdetailParent); ?>;

    var ds_yeuCau = <?php print_r($jslistRequest); ?>;
    var dsHoaDon_CD = <?php print_r($jslistBill_CD); ?>;
    var dsHoaDon_CN = <?php print_r($jslistBill_CN); ?>;
    menubarv2(tenPH[0].TenPH, detailParent[0].GioiTinh, "parent");
</script>

<script src="../../assets/js/userParent_Fee.js"></script>

<!--boostrap.js-->
<script src="https://code.jquery.com/jquery-3.7.0.min.js"></script>

<!--boostrap.js-->
<script src="../../plugins/bootstrap-5.2.3-dist/js/bootstrap.min.js"></script>
<script src="../../plugins/bootstrap-5.2.3-dist/js/bootstrap.bundle.min.js"></script>
<!--slick.js-->
<script type="text/javascript" src="../../plugins/slick-1.8.1/slick/slick.min.js"></script>



</html>