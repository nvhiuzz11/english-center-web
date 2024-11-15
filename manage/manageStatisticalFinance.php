<?php
require '../lib/functionStatisticalFinance.php';

$listCountThu = listCountThu($connection);
$listCountChi = listCountChi($connection);
$listDTTheoThang = listDTTheoThang($connection);
$listThuTheoNam = listThuTheoNam($connection);
$listChiTheoNam = listChiTheoNam($connection);

$jslistCountThu  = json_encode($listCountThu);
$jslistCountChi  = json_encode($listCountChi);
$jslistDTTheoThang = json_encode($listDTTheoThang);
$jslistChiTheoNam = json_encode($listChiTheoNam);
$jslistThuTheoNam = json_encode($listThuTheoNam);

?>




<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Quản lý hệ thống giáo dục</title>
    <link rel="stylesheet" href="../assets/css/manage.css">
    <link rel="stylesheet" href="../assets/css/manageStatisticalFinance.css">
    <link rel="icon" href="../assets/images/logo-web.png" type="image/x-icon">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>



    <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
    <script src="https://cdn.jsdelivr.net/npm/apexcharts@3.27.3/dist/apexcharts.min.js"></script>

</head>

<body>
    <header>
        <div class="logo">
            <img src="../assets/images/logo-web.png" alt="Logo">
        </div>
        <nav>
            <ul>
                <li><a href="./manageClass.html">Quản lý lớp học</a></li>
                <li><a href="../manage/manageStudent.html">Quản lý học viên</a></li>
                <li><a href="../manage/manageTeacher.html">Quản lý giáo viên</a></li>
                <li><a href="../manage/manageParent.html">Quản lý phụ huynh</a></li>
                <li><a href="../manage/manageFinance.html">Quản lý tài chính</a></li>
                <li><a style="color: #0088cc;" href="../manage/manageStatistical.php">Báo cáo thống kê</a></li>
                <li><a href="../manage/manageCenter.html">Quản lý trung tâm</a></li>
                <li><a href="../pages/home/home.php" style="display: flex;"><img src="../assets/images/icon-logout.png" alt="" style="width:20px"></a></li>

            </ul>
        </nav>
    </header>
    <main>
        <div class="tab">
            <button class="tablinks" id='btn-tab1'>Thống kê tổng quan</button>
            <button class="tablinks" id='btn-tab2'>Thống kê tài chính</button>

        </div>

        <div style="display: flex;flex-direction: column;" id="content">
            <div>


                <div style="    display: flex;align-items: center;">
                    <h4 style="margin-right:5px;      margin-left: 20px;  ">Cơ sở:</h4>
                    <select
                        style=" margin-right: 20px; border: groove;font-size: 14px;padding:0; width:300px;height:40px"
                        id="select-center-1">
                        <option value="">...</option>

                    </select>

                    <select id="select-year-1" style="width:100px">
                        <option value="">Chọn năm</option>

                    </select>
                </div>

                <canvas id="chart-1" style="max-height:700px ; max-width: 1500px"></canvas>

            </div>
            <div>

                <div style="    display: flex;align-items: center;">
                    <h4 style="margin-right:5px;      margin-left: 20px;  ">Cơ sở:</h4>
                    <select
                        style=" margin-right: 20px; border: groove;font-size: 14px;padding:0; width:300px;height:40px"
                        id="select-center-2">
                        <option value="">...</option>

                    </select>
                    <select id="select-year-2" style="width:100px">
                        <option value="">Chọn năm</option>

                    </select>
                </div>

                <div id="chart-2"></div>
                <h3 style="margin-left:35%">Biểu đồ tổng doanh thu và tỉ lệ lợi nhuận </h3>

            </div>

            <div style="margin-left: 30%;">
                <div style="display: flex">
                    <h4 style="margin-right:5px;      margin-left: 20px;  ">Cơ sở:</h4>
                    <select
                        style=" margin-right: 20px; border: groove;font-size: 14px;padding:0; width:300px;height:40px"
                        id="select-center-3">
                        <option value="">...</option>

                    </select>

                    <div style="    display: flex;align-items: center;">
                        <select id="select-year-3" style="width:100px">
                            <option value="">Chọn năm</option>
                        </select>
                    </div>
                </div>


                <i id="chart-3-empty" style="display:none">Không có dữ liệu phù hợp theo yêu cầu</i>

                <canvas id="chart-3" style="max-width:500px;max-height:500px"></canvas>
            </div>

        </div>





    </main>
    <!-- Spinner overlay -->
    <div id="loadingSpinner" class="spinner-overlay">
        <div class="spinner"></div>
    </div>


    <footer>
        <p>© 2023 Hệ thống quản lý giáo dục. All rights reserved.</p>
    </footer>
</body>



<script>
    var ds_countThu = <?php print_r($jslistCountThu); ?>;
    var ds_countChi = <?php print_r($jslistCountChi); ?>;
    var ds_DTTheoThang = <?php print_r($jslistDTTheoThang); ?>;
    var ds_Thu = <?php print_r($jslistThuTheoNam); ?>;
    var ds_Chi = <?php print_r($jslistChiTheoNam); ?>;
</script>

<script src="../../assets/js/api.js"></script>

<script src="../../assets/js/manageStatisticalFinance.js"></script>

</html>