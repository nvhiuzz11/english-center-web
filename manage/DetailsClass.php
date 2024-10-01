<?php
include "../lib/FunctionClass.php";
$malop = $_GET['maLop'];

$dataClass = dataClassById($malop, $connection);
$dataSchedules = dataSchedulesByMaLop($malop, $connection);
$nameTeacher = dataTeacherByMaLop($malop, $connection);
$listSchedule = listSchedules($connection);

///
$listStudents = ListStudentByClass($malop, $connection);
$listAddStudent = getListStudents($connection, $malop);
$listTime = ListTimeAttendance($malop, $connection);



$timeTeacher = timeTeacherOther($connection, $malop);

?>
<!DOCTYPE html>

<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Chi tiết lớp học</title>
    <link rel="stylesheet" href="../assets/css/manage.css">
    <link rel="stylesheet" href="../assets/css/manageClass.css">
    <link rel="icon" href="../assets/images/logo-web.png" type="image/x-icon">
    <!-- start boot strap  -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <!-- start end strap  -->
    <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/morris.js/0.5.1/morris.css">
    <script src="https://code.jquery.com/jquery-3.7.0.min.js"></script>
    <style>
        /* .checkbox 
  display: none; /* Ẩn checkbox gốc */
        .checkbox {
            display: none;
        }

        .checkbox+label {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 2px solid #999;
            border-radius: 50%;
            cursor: pointer;
        }

        .green+label {
            background-color: #3cb371;
            /* Màu xanh */
            border-color: #3cb371;
        }

        .green+label::before {
            content: "\2713";
            /* Dấu tích unicode */
            color: #fff;
            font-size: 14px;
            text-align: center;
            line-height: 20px;
        }

        label::before {
            content: "";
            display: block;
            width: 100%;
            height: 100%;
            text-align: center;
            line-height: 20px;
        }

        .red+label {
            background-color: #ff0000;
            /* Màu đỏ */
            border-color: #ff0000;
        }

        .red+label::before {
            content: "\2717";
            /* Dấu tích unicode */
            color: #fff;
            font-size: 14px;
            text-align: center;
            line-height: 20px;
        }

        .squaredcheck {
            display: flex;
            align-items: center;
        }

        /* <?php
        if ($dataClass['TrangThai'] == 'Chưa mở') : ?>#piechart_3d {
            display: none;
        }

        <?php endif ?>*/ */
    </style>
</head>

<body>
    <script src="//cdnjs.cloudflare.com/ajax/libs/raphael/2.1.0/raphael-min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/morris.js/0.5.1/morris.min.js"></script>
    <header>
        <div class="logo">
            <img src="../assets/images/logo-web.png" alt="Logo">
        </div>
        <nav>
            <ul>
                <li><a style="color: #0088cc;" href="./ListClass.php">Quản lý lớp học</a></li>
                <li><a href="../manage/manageStudent.html">Quản lý học sinh</a></li>
                <li><a href="../manage/manageTeacher.html">Quản lý giáo viên</a></li>
                <li><a href="../manage/manageParent.html">Quản lý phụ huynh</a></li>
                <li><a href="../manage/manageFinance.html">Quản lý tài chính</a></li>
                <li><a href="../manage/manageStatistical.php">Báo cáo thống kê</a></li>
                <li><a href="../manage/manageCenter.html">Quản lý trung tâm</a></li>
                <li><a href="../pages/home/home.php" style="display: flex;"><img src="../assets/images/icon-logout.png" alt="" style="width:20px"></a></li>

            </ul>
        </nav>
    </header>

    <!--5 12 2023 start -->
    <div>
        <div class="card p-3 shadow">
            <!-- <h2 class="text-center p-3 fw-bold"><?php echo $malop; ?></h2> -->
            <nav>
                <div class="nav nav-tabs mb-3" id="nav-tab" role="tablist">
                    <button class="nav-link fw-bold active" id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#nav-home" type="button" role="tab" aria-controls="nav-home" aria-selected="true">Thông tin chi tiết</button>
                    <button class="nav-link fw-bold" id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#nav-profile" type="button" role="tab" aria-controls="nav-profile" aria-selected="false">Danh sách học sinh</button>
                    <button class="nav-link fw-bold" id="nav-contact-tab" data-bs-toggle="tab" data-bs-target="#nav-contact" type="button" role="tab" aria-controls="nav-contact" aria-selected="false">Quản lý điểm danh</button>
                </div>
            </nav>
            <div class="tab-content p-3 border bg-light" id="nav-tabContent">
                <div class="tab-pane fade active show" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">
                    <div class="modal-content">
                        <h1 class="fw-bold" style="color: #0088cc;">Thông tin chi tiết lớp <?php echo $malop ?></h1>
                        <div class="container px-md-5" style="box-shadow: none;">

                            <form id="form_delete" name="form_delete" method="post">

                            </form>
                            <div class="detailButton">
                                <input type="submit" id='delete' name="delete" value="Xóa Lớp">
                                <button id="open-btn">Sửa Lớp</button>
                            </div>
                        </div>
                    </div>

                    <!-- sửa thông tin lớp -->
                    <div id="overlay">
                        <div id="box">
                            <button id="close-btn">&times;</button>
                            <div class="">
                                <h3 class="fw-bold mt-2 text-center" style="color: #0088cc;">Sửa lớp học</h3>
                                <form class="row" id="form_edit" name="form_edit" method="post">


                                </form>
                                <input type="submit" id='btn-update' name="update" value="Cập nhật">
                                <div id="card-container"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- danh sách học sinh -->
                <div class="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">
                    <div id="">
                        <div class="px-5" id="">
                            <div class="">
                                <h1 class="fw-bold" style="color: #0088cc;">Danh sách học sinh lớp <?php echo $malop ?></h1>
                                <table>
                                    <thead>
                                        <tr>
                                        <th>STT</th>
                                        <th>Mã học sinh</th>
                                            <th>Họ và tên</th>
                                            <th>Ngày sinh</th>
                                            <th>Giới tính</th>
                                            <th>Địa chỉ</th>
                                            <th>Số điện thoại</th>
                                            <th>Số buổi tham gia học</th>
                                            <th>Giảm học phí</th>
                                            <th>Xóa học sinh</th>
                                        </tr>
                                    </thead>



                                    <form id="form_discount" name="form_discount" method="post">
                                        <tbody style="position: relative;" id="tbody-student">

                                        </tbody>

                                    </form>




                                    <button id="addStudent" class="px-3 py-1 border-0">Thêm học sinh</button>
                                    <input class="px-3 py-2 me-2" type="submit" id="discount" style="margin-left:70%" value="Cập nhật giảm học phí">
                                    <!-- thêm học sinh -->
                                    <style>
                                        #overlay-addStudent {
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
                                            z-index: 9999;
                                            transition: opacity 0.3s, visibility 0.3s;
                                        }

                                        #overlay-addStudent.active {
                                            opacity: 1;
                                            visibility: visible;
                                        }

                                        #box-addStudent {
                                            opacity: 0;
                                            transform: scale(1.5);
                                            transition: opacity 0.3s, transform 0.3s;
                                            background-color: #ffffff;
                                            width: 60%;
                                            height: 98vh;
                                            overflow: auto;
                                            padding: 0px 30px;
                                            border-radius: 5px;
                                        }

                                        #box-addStudent.active {
                                            opacity: 1;
                                            transform: scale(1);
                                        }

                                        #box-addStudent #close-btn-addStudent {
                                            position: absolute;
                                            top: 5px;
                                            right: 5px;
                                            background: none;
                                            border: none;
                                            font-size: 50px;
                                            cursor: pointer;
                                            color: #0088cc;
                                        }
                                    </style>


                                    <div class="add-success">
                                        <img src="../assets/images/icon_success.png" alt="" style=" width: 40px;">
                                        <h3>Thêm học sinh thành công!</h3>
                                    </div>


                                    <div id="overlay-addStudent">
                                        <div id="box-addStudent" style="text-align: center;">
                                            <button id="close-btn-addStudent">&times;</button>
                                            <div class="">
                                                <h3 class="fw-bold mt-4 text-center" style="color: #0088cc;">Thêm học sinh</h3>


                                                <form class="h-100" id="form-addStudent-submit" method="post">

                                                    <select style="height: 500px;" multiple name="addstudents[]" id="select-student">

                                                    </select>
                                                </form>
                                                <input class="btn" id="addStudent-submit" style="border: groove;margin-top: 20px;" type="submit" value="Thêm học sinh">
                                                <p style="color: red;" id ="empty-student"></p>
                                            </div>
                                        </div>
                                    </div>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div style="position: absolute; right: 130px; top:275px" id="div-btn-delete">

                    </div>
                </div>
                <div class="tab-pane fade" id="nav-contact" role="tabpanel" aria-labelledby="nav-contact-tab">
                    <!-- dữ liệu điểm danh của lớp  -->
                    <div id="">
                        <button onclick="showAddDateDD()" class="">Thêm điểm danh</button>
                        <div id="" class="d-flex justify-content-center">
                            <div class="w-75">
                                <h1 class="fw-bold" style="color: #0088cc;">Quản lý điểm danh lớp <?php echo $malop ?></h1>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>STT</th>
                                            <th>Thời gian</th>
                                            <th>Sĩ số</th>

                                        </tr>
                                    </thead>
                                    <tbody id="listdday">



                                    </tbody>
                                </table>

                                <!-- hiện ra box của time chi tiết -->
                                <div id="div-detail">

                                </div>
                                <!-- hiển thị box thêm điểm danh + ngày -->
                                <div id="addboxDateDD">
                                    <div class="w-75" id="boxDateDD" style="max-width: 900px;">
                                        <button id="closeboxDateDD">&times;</button>
                                        <div class="">
                                            <h1 class="fw-bold mt-3">Thêm điểm danh </h1>
                                            <form method="post" id="form-add-attend">
                                                <div class="d-flex" style="display: flex!important;justify-content: space-around;align-items: center;">

                                                    <div>
                                                        <strong style="margin-right: 20px;">Thời gian:</strong> <input type="date" name="addTime" id="addTime">
                                                        <label id="err-add" style="color:red; font-size:13px ; font-style: italic "></label>
                                                    </div>


                                                    <input class="w-auto" type="submit" id="btn-add-attend" style="padding:10px 20px" value="Thêm">
                                                </div>

                                                <table>
                                                    <thead>
                                                        <tr>
                                                            <th>STT</th>
                                                            <th>Mã học sinh</th>
                                                            <th>Tên học sinh</th>
                                                            <th style="text-align: center;  ">Tham gia lớp học</th>
                                                        </tr>
                                                    </thead>

                                                    <tbody id="tbody-addAttend">



                                                    </tbody>

                                                </table>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>


    </div>

    <!-- thống kê -->
    <div id="piechart_3d" style="width: 100%; height: 500px;"></div>
    <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js">

    </script>
    <script type="text/javascript">
        google.charts.load("current", {
            packages: ["corechart"]
        });
        google.charts.setOnLoadCallback(drawChart);

        function drawChart() {
            var data = google.visualization.arrayToDataTable([
                ['Đi học', 'Nghỉ học'],
                <?php $a = getCountDD(1, $malop, $connection);
                $b = getCountDD(0, $malop, $connection);

                ?>['Đi học', <?php echo $a['dihoc'] ?>],
                ['Nghỉ học', <?php echo $b['dihoc'] ?>],
            ]);

            var options = {
                title: 'Thống kê tỉ lệ học sinh đi học của lớp <?php echo $malop ?>',
                is3D: true,
            };

            var chart = new google.visualization.PieChart(document.getElementById('piechart_3d'));
            chart.draw(data, options);
        }
    </script>
    <!-- end -->
    <footer>
        <p>© 2023 Hệ thống quản lý giáo dục. All rights reserved.</p>
    </footer>

    
    

    <div class="add-success2">
        <img src="../assets/images/icon_success.png" alt="" style=" width: 40px;">
        <h3>Thêm điểm danh thành công!</h3>
    </div>

    <div class="update-success">
        <img src="../assets/images/icon_success.png" alt="" style=" width: 40px;">
        <h3>Cập nhật thay đổi thành công!</h3>
    </div>
    <div class="delete-success">
        <img src="../assets/images/icon_success.png" alt="" style=" width: 40px;">
        <h3>Xóa thành công!</h3>
    </div>
    <!-- <div style="padding: 10px; max-width: 400px; height:300px" class="delete-Option">
        <h3 style="color: #fff;">Bạn có chắc chắn xóa lớp không</h3>
        <button class="btn" id="yesDelete">Có</button>
        <button class="btn" id="noDelete">Không</button>
    </div> -->
    <div id="modal-ques">
        <div class="delete-ques">
            <img src="../assets/images/Help-icon.png" alt="" style=" width: 40px;">
            <h5>Việc xóa lớp sẽ ảnh hưởng đến dữ liệu. Bạn chắc chắn muốn xóa?</h5>
            <div style="display:flex ;justify-content: space-evenly;align-items: center">

                <input type="submit" style="background-color:#52a95f; height: 44px;width: 80px" id="noDelete" value="Hủy bỏ"></input>
                <input type="submit" style="background-color: #d52828;  height: 44px;width: 80px" id="yesDelete" value="Xóa"></input>

            </div>
        </div>
    </div>

    <div id="modal-ques2">
        <div class="delete-ques">
            <img src="../assets/images/Help-icon.png" alt="" style=" width: 40px;">
            <h5>Bạn chắc chắn muốn xóa học sinh ra khỏi lớp?</h5>
            <div style="display:flex ;justify-content: space-evenly;align-items: center">

                <input type="submit" style="background-color:#52a95f; height: 44px;width: 80px" id="noDeleteStudent" value="Hủy bỏ"></input>
                <input type="submit" style="background-color: #d52828;  height: 44px;width: 80px" id="yesDeleteStudent" value="Xóa"></input>

            </div>
        </div>
    </div>

    <div id="modal-ques3">
        <div class="delete-ques">
            <img src="../assets/images/Help-icon.png" alt="" style=" width: 40px;">
            <h5>Bạn chắc chắn muốn dữ liệu điểm danh này?</h5>
            <div style="display:flex ;justify-content: space-evenly;align-items: center">

                <input type="submit" style="background-color:#52a95f; height: 44px;width: 80px" id="noDeleteAttend" value="Hủy bỏ"></input>
                <input type="submit" style="background-color: #d52828;  height: 44px;width: 80px" id="yesDeleteAttend" value="Xóa"></input>

            </div>
        </div>
    </div>
</body>
<script>
    var malop = <?php echo json_encode($malop) ?>;
    var jsonListStudents = <?php echo json_encode($listStudents) ?>;
    var listtimeTeacher = <?php echo  json_encode($timeTeacher); ?>;
    var listAddStudent = <?php echo  json_encode($listAddStudent); ?>;
    var listTime = <?php echo  json_encode($listTime); ?>;
    var listSchedule = <?php echo json_encode($listSchedule)  ?>
    
</script>
<script src="../assets/js/DetailClass.js"></script>

</html>