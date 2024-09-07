<?php
require '../lib/functionFinance.php';

// $listBill = listBill($connection);

$listBill = searchHDHocPhi($connection, "","","");
$listStudent = listStudent($connection);
$listClassOpen = listClassOpen($connection);
$lisths_lopxHS = lisths_lopxHS($connection);
$listLSTHP = listLSTHP($connection);
$listHS_GHP = selecths_hocPhi($connection);
$listDD = listDD($connection);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

	

	if (isset($_POST['refesh'])) {
		header("Location: manageFinance.php");
	}
	
}

$jslisths_lopxHS = json_encode($lisths_lopxHS);
$jslistBill = json_encode($listBill);
$jslistStudent = json_encode($listStudent);
$jslistClassOpen = json_encode($listClassOpen);
$jslistLSTHP = json_encode($listLSTHP);
$jslistHS_GHP = json_encode($listHS_GHP);
$jslistDD = json_encode($listDD);

?>




<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8">
	<title>Quản lý hệ thống giáo dục</title>
	<link rel="stylesheet" href="../assets/css/manage.css">
	<link rel="stylesheet" href="../assets/css/manageFinance.css">
	<script src="https://code.jquery.com/jquery-3.6.4.js"></script>
	<link rel="icon" href="../assets/images/logo-web.png" type="image/x-icon">
</head>

<body>
	<header>
		<div class="logo">
			<img src="../assets/images/logo-web.png" alt="Logo">
		</div>
		<nav>
			<ul>
				<li><a href="./ListClass.php">Quản lý lớp học</a></li>
				<li><a href="../manage/manageStudent.php">Quản lý học sinh</a></li>
				<li><a href="../manage/manageTeacher.php">Quản lý giáo viên</a></li>
				<li><a href="../manage/manageParent.php">Quản lý phụ huynh</a></li>
				<li><a style="color: #0088cc;" href="../manage/manageFinance.php">Quản lý tài chính</a></li>
				<li><a href="../manage/manageStatistical.php">Báo cáo thống kê</a></li>
				<li><a href="../pages/home/home.php" style="display: flex;"><img src="../assets/images/icon-logout.png" alt="" style="width:20px"></a></li>
				

			</ul>
		</nav>
	</header>
	<main>

		<div class="tab">
			<button class="tablinks" id='btn-tab1'>Thu học phí</button>
			<button class="tablinks" id='btn-tab2'>Chi phí</button>
			<button class="tablinks" id='btn-tab3'>Lịch sử thu chi</button>

		</div>

		<div id="nav-container-Tab2">

			<a href="./manageFinance_wageTea.php" id="btn-tab-luongGV">Lương giáo viên</a>
			<a href="./manageFinance_OtherFee.php" id="btn-tab-chiPhiKhac">Chi phí khác</a>


		</div>
		
		<div id="Tab1" class="tabcontent">
			<h1>Thu Học phí</h1>
			<div class="search-container">
				<form id="form-search" method="post" action="<?php echo htmlspecialchars($_SERVER['PHP_SELF']); ?>" style="width: 50%; margin: unset;display: inline-flex;" autocomplete="off">
					<input type="text" name="keyword" id="keyword" placeholder="Tìm kiếm..." style="width: 70% ; border-radius: 0px; border-color:black;"  oninput="searchList()">
					<input type="button" id="search" value="Tìm kiếm" style="width: 100px;  background-color: #4CAF50;">
					<button type="submit" id="refesh-btn" name="refesh" style=" background-color: currentcolor "> <img style="width: 30px;" src="../assets/images/Refresh-icon.png" alt=""></button>
				</form>
				<div style="display:inline-flex; align-items: center; text-align: center; margin-right: 10px"> 
				<h3 > Thời gian: </h3>
				<input type="month" id="month-year" style="height: 30px;background-color: beige;margin-right: 20px;">
					<h3 style="margin-right:5px">Trạng thái:</h3>
					<select style=" border: groove;background-color: beige;font-size: 14px;padding:0; width:200px;height:40px" id="select-status">
						<option value="">...</option>
						<option value="Chưa đóng">Chưa đóng</option>
						<option value="Còn nợ">Còn nợ</option>
						<option value="Hoàn thành">Hoàn thành</option>
					</select>
				</div>
				<div>

					<button class="add-bill-button">+ Thêm hóa đơn</button>
				</div>
			</div>



			<div>
				<table id="table-1">

					<thead id="thead-1">
						<tr>
							<th data-column="0" style="width:20px" >STT</th>
							<th data-column="1" onclick="sortTable(1)">Mã Hóa dơn</th>
							<th data-column="2" onclick="sortTable(2)">Tên hóa đơn</th>
							<th data-column="3" onclick="sortTable(3)">Tên Học sinh</th>
							<th data-column="4" onclick="sortTable(4)">Lớp</th>
							<th data-column="5" onclick="sortTable(5)">Thời gian <br> </th>
							<th data-column="6" onclick="sortTable(6)">Số tiền <br> </th>
							<th data-column="7" onclick="sortTable(7)">Giảm học phí <br> </th>
							<th data-column="8" onclick="sortTable(8)">Số tiền giảm <br> </th>
							<th data-column="9" onclick="sortTable(9)">Số tiền phải đóng <br> </th>
							<th data-column="10" onclick="sortTable(10)">Số tiền đã đóng <br> </th>
							<th data-column="11" onclick="sortTable(11)">Nợ phí còn lại <br> </th>
							<th data-column="12" onclick="sortTable(12)">Trạng thái <br> </th>

						</tr>
					</thead>

					<tbody class="tbody-1">
					</tbody>

					</tbody>
					<tbody class="tbody-5">
				</table>
				<div id="container-index"></div>
			</div>
			<!-- Them hoa don -->
			<div class="modal-bg-add">
				<div class="modal-content-add" style="height :fit-content">
					<div class="tab-add" style="display:inline-flex; padding-bottom:0;padding-left:0">
						<button class="tablinks-add" id='btn-tab1-add' onclick="openTab_add(event, 'Tab1-add')">Thêm hóa đơn học phí tháng</button>
						<button class="tablinks-add" id='btn-tab2-add' onclick="openTab_add(event, 'Tab2-add')">Thênm hóa đơn cá nhân</button>
						<!-- <button class="tablinks-add" id='btn-tab3-add' onclick="openTab_add(event, 'Tab3-add')">Thêm hóa </button> -->

					</div>

					<div id="Tab1-add" class="tabcontent-add">
						<div>
							<h1> Tạo hóa đơn</h1>
							<form id="form-add-bill" name="form-add-bill" method="post">



								<table>
									<tbody style="max-height:fit-content; overflow:unset">
										<td>
											<label for="bill-name-add">Tên hóa đơn : <label id="lb-name-add" style="color:red; font-size:13px ; font-style: italic "></label></label>
											<input type="text" id="bill-name-add" name="bill-name-add" placeholder="Nhập tên hóa đơn">
										</td>


										<tr>
											<td>
												<label>Thời gian : <label id="lb-time-add" style="color:red; font-size:13px ; font-style: italic "></label></label>
												<br>
												<label style="margin-left: 100px" for="bill-month-add">Tháng :</label>
												<select style="width:fit-content" name="bill-month-add" id="bill-month-add">
													<option value="">Chọn tháng</option>
													<option value="1">Tháng 1</option>
													<option value="2">Tháng 2</option>
													<option value="3">Tháng 3</option>
													<option value="4">Tháng 4</option>
													<option value="5">Tháng 5</option>
													<option value="6">Tháng 6</option>
													<option value="7">Tháng 7</option>
													<option value="8">Tháng 8</option>
													<option value="9">Tháng 9</option>
													<option value="10">Tháng 10</option>
													<option value="11">Tháng 11</option>
													<option value="12">Tháng 12</option>
												</select>

												<label style="margin-left: 100px" for="bill-month-add">Năm :</label>
												<select style="width:fit-content" name="bill-year-add" id="bill-year-add">

													<option value="">Chọn năm</option>
													<?php for ($i = 2020; $i <= 2100; $i++) { ?>
														<option value="<?php echo $i ?>">
															<?php echo $i ?>
														</option>
													<?php } ?>
												</select>



											</td>
										</tr>
										<br>
										<td>
											<label for="bill-class-add">Lớp : <label id="lb-class-add" style="color:red; font-size:13px ; font-style: italic "></label></label>

											<br>

											<select style="width: 50%;" name="bill-class-add" id="bill-class-add">

												<option value="">Chọn lớp</option>

											</select>
											<button type="button" id="reset-class" style="margin-left: 20px;background-color: yellowgreen;padding: 10px;">Reset</button>
											<br>
											<div id="div-bill-class-add">

											</div>
											<input type="hidden" name="class-add-bill" id="class-add-bill">

										</td>
										<tr>
											<td>
												<button style="background-color: teal;" id="reset-1" type="reset">Làm mới</button>
											</td>
											<td>
												<input style="font-size: 14px; padding: 15px 35px; background-color: teal" type="submit" id="sumit-bill-add" value="Tạo">
											</td>
										</tr>

									</tbody>
								</table>
							</form>

						</div>
					</div>
					<div id="Tab2-add" class="tabcontent-add">
						<div>
							<h1>Tạo Hóa đơn cá nhân</h1>
							<form id="form-add-bill-ps" name="form-add-bill-ps" method="post">

								<label for="bill-name-add-ps">Tên hóa đơn : <label id="lb-name-add-ps" style="color:red; font-size:13px ; font-style: italic "></label></label>
								<input type="text" id="bill-name-add-ps" name="bill-name-add-ps" placeholder="Nhập tên hóa đơn">
								<label>Thời gian : <label id="lb-time-add-ps" style="color:red; font-size:13px ; font-style: italic "></label></label>
								<br>
								<label style="margin-left: 100px" for="bill-month-add-ps">Tháng :</label>
								<select style="width:fit-content" name="bill-month-add-ps" id="bill-month-add-ps">
									<option value="">Chọn tháng</option>
									<option value="1">Tháng 1</option>
									<option value="2">Tháng 2</option>
									<option value="3">Tháng 3</option>
									<option value="4">Tháng 4</option>
									<option value="5">Tháng 5</option>
									<option value="6">Tháng 6</option>
									<option value="7">Tháng 7</option>
									<option value="8">Tháng 8</option>
									<option value="9">Tháng 9</option>
									<option value="10">Tháng 10</option>
									<option value="11">Tháng 11</option>
									<option value="12">Tháng 12</option>
								</select>

								<label style="margin-left: 100px" for="bill-year-add-ps">Năm :</label>
								<select style="width:fit-content" name="bill-year-add-ps" id="bill-year-add-ps">

									<option value="">Chọn năm</option>
									<?php for ($i = 2020; $i <= 2100; $i++) { ?>
										<option value="<?php echo $i ?>">
											<?php echo $i ?>
										</option>
									<?php } ?>
								</select>
								<br>
								<label for="bill-class-add-ps">Lớp : <label id="lb-class-add-ps" style="color:red; font-size:13px ; font-style: italic "></label></label>
								<br>

								<select style="width: 50%;" name="bill-class-add-ps" id="bill-class-add-ps">

									<option value="">Chọn lớp</option>


								</select>

								<br>
								<label for="name-student-add-bill">Tên học sinh: <label id="lb-name-student-add-bill" style="color:red; font-size:13px ; font-style: italic "></label></label>
								<br>
								<select style="width: 50%;" name="name-student-add-bill" id="name-student-add-bill">
									<option value="">Chọn Học viên</option>

								</select>

								<br>


								<button style="background-color: teal;margin-top: 25px;" id="reset-2" type="reset">Làm mới</button>

								<input style="font-size: 14px; padding: 15px 35px; background-color: teal;margin-top: 25px;" type="submit" id="sumit-bill-add-ps" value="Tạo">

							</form>
						</div>


					</div>
					<div id="Tab3-add" class="tabcontent-add">
						<h1>3</h1>

					</div>
					<div id="Tab4-add" class="tabcontent-add">
						<h1>4</h1>

					</div>
					<button style="margin-left: 45%;" class="btn-close-add">Đóng</button>
				</div>

			</div>





		</div>
		<!-- Tab 2 -Chi phi -->




		<!-- <div id="Tab3" class="tabcontent">
			<h3>Tổng hợp thu chi</h3>
			<p>Content of Tab 3</p>
		</div>

		<div id="Tab4" class="tabcontent">
			<h3>Tab4</h3>
			<p>Content of Tab 4</p>
		</div>

		<div id="Tab5" class="tabcontent">
			<h3>Tab5</h3>
			<p>Content of Tab 5</p>
		</div> -->

		<!-- Thong tin chi tiet hoa don hoc phi -->
		<div class="modal-bg">
			<div class="modal-content">

				<div class="btn-tab-3">
					<button class="tablinks-3" id="btn-tab-3-1" onclick="openTab_3(event, 'tab-3-1')">Thông tin hóa đơn</button>
					<button class="tablinks-3" id="btn-tab-3-2" onclick="openTab_3(event, 'tab-3-2')">Lịch sử thanh toán</button>

				</div>

				<div id="tab-3-1" class="tabcontent-3">
					<h2>Thông tin hóa đơn</h2>
					<button id="edit-button" style="position: absolute;top: 75px;right: 60px;" hidden>Sửa</button>

					<button id="btn-delete-bill" style="position: absolute;top: 75px;right: 11px; background-color: #e90000">Xóa</button>

					<div class="container">


						<div class="detail">
							<table>
								<tbody style=" max-height: fit-content;">
									<tr>
										<td>
											<div style="display:inline-flex ">
												<h3 class="lb-detail-bill">Mã hóa đơn : </h3>
												<h3 id="id-bill-detail"> </h3>
											</div>
										</td>
									</tr>
									<tr>
										<th class="lb-detail-bill">Tên hóa dơn :</th>
										<td id="name-bill-detail"></td>
									</tr>
									<tr>
										<th class="lb-detail-bill"> Lớp :</th>
										<td id="class-bill-detail"></td>
									</tr>
									<tr>
										<th class="lb-detail-bill">Mã học sinh :</th>
										<td id="id-st-detail"></td>
									</tr>
									<tr>
										<th class="lb-detail-bill">Tên học sinh :</th>
										<td id="name-st-bill-detail"></td>
									</tr>

									<tr>
										<th class="lb-detail-bill">Thời gian :</th>
										<td id="time-bill-detail"></td>
									</tr>
									<tr>
										<th class="lb-detail-bill">Học phí:</th>
										<td id="fee-bill-detail"></td>
									</tr>
									<tr>
										<th class="lb-detail-bill">Số buổi học:</th>
										<td id="session-bill-detail"></td>
									</tr>

									<tr>
										<th class="lb-detail-bill">Số tiền :</th>
										<td id="st-bill-detail"></td>
									</tr>

									<tr>
										<th class="lb-detail-bill">Giảm học phí :</th>
										<td id="ghp-bill-detail"></td>
									</tr>

									<tr>
										<th class="lb-detail-bill">Số tiền giảm : </th>
										<td id="stg-bill-detail"></td>
									</tr>

									<tr>
										<th class="lb-detail-bill">Số tiền phải đóng :</th>
										<td id="stpd-bill-detail"></td>
									</tr>
									<tr>
										<th class="lb-detail-bill">Số tiền đã đóng :</th>
										<td id="stdd-bill-detail"></td>
									</tr>
									<tr>
										<th class="lb-detail-bill">Nợ phí còn lại :</th>
										<td id="npcl-bill-detail"></td>
									</tr>
									<tr>
										<th class="lb-detail-bill">Trạng thái:</th>
										<td id="status-bill-detail"></td>
									</tr>
								</tbody>
							</table>




						</div>
					</div>
				</div>
				<!-- lich su thanh toan hoa don -->
				<div id="tab-3-2" class="tabcontent-3">

					<h2>Lịch sử thanh toán hóa đơn</h2>

					<h3>Mã hóa đơn : <strong id="id-bill-lsthp"></strong></h3>
					<div style="display: flex; margin-bottom: 20px;">
						<p style="margin-right: 20px;">Số tiền phải đóng:
						<p id="stpd-lsthp"></p>
						</p>
					</div>
					<button id="btn-add-trans" style="margin-bottom:5px">+ Thêm giao dịch</button>
					<form action="" method="POST" id="form-edit-trans"></form>
					<table>
						<thead style="background-color:#b9b5b5; color:black">

							<tr>
								<th>STT</th>
								<th>Mã giao dịch</th>
								<th>Thời gian</th>
								<th>Số tiền</th>
								<th></th>
							</tr>
						</thead>
						<tbody id="tbody-lsthp">


						</tbody>
					</table>

				</div>
				<div id="tab-3-3" class="tabcontent-3">3</div>
				<button class="close-btn">Đóng</button>
			</div>
		</div>
		<!-- Them giao dich -->
		<div id="modal-add-trans">
			<div id="div-add-trans">
				<h1>Thêm giao dịch</h1>
				<form id="form-add-trans" name="form-add-trans" method="post">
					<input type="hidden" id="id-add-trans" name="id-add-trans">

					<br>
					<label>Thời gian : <label id="lb-time-add-trans" style="color:red; font-size:13px ; font-style: italic "></label></label>



					<input style="font-size: 16px;" type="date" id="date-add-trans" name="date-add-trans" required>
					<br>
					<br>
					<label for="money-add-trans">Số tiền : </label>
					<input style="height: 30px; font-size: 15px; width:50%" type="text" id="money-add-trans" name="money-add-trans" pattern="[0-9,]+" oninput="formatNumber(this)">
					<br>
					<label id="lb-money-add-trans" style="color:red; font-size:13px ; font-style: italic "></label>
					<br>
					<button type="button" style=" background-color: teal;margin: 25px 0px 8px; padding: 15px 20px;margin-left: 50px;" id="canle-add-trans">Huỷ bỏ</button>

					<input style="font-size: 14px;background-color: teal; margin-top: 25px;width: fit-content;margin-left: 120px;  padding: 15px 25px;" type="submit" id="submit-add-trans" value="Thêm">

				</form>
			</div>
		</div>

		<!-- Sua thong tin -->
		<div class="modal-bg-edit">
			<div class="modal-content-edit">
				<div>
					<form id="form-edit-bill" name="form-edit-bill" method="post">

						<h1>Sửa thông tin hóa đơn</h1>

						<table>
							<tr>
								<td>
									<label>Mã hóa đơn : <strong style="color: #ff1ace; font-weight: inherit;font-size: small;">(Không thể sửa)</strong></label>
									<input type="text" id="id-bill-edit" name="id-bill-edit" readonly>

								</td>
								<td>
									<label>Tên hóa đơn : <strong id="err-name-bill-edit" style="color: #e90000; font-weight: inherit;font-size: small;"></strong></label>
									<input type="text" id="name-bill-edit" name="name-bill-edit">

								</td>

							</tr>

							<tr>
								<td>
									<label>Mã học sinh : <strong style="color: #ff1ace; font-weight: inherit;font-size: small;">(Không thể sửa)</strong></label>
									<input type="text" id="id-st-bill-edit" name="id-st-bill-edit" readonly>
								</td>
								<td>
									<label>Tên học sinh : <strong style="color: #ff1ace; font-weight: inherit;font-size: small;">(Không thể sửa)</strong></label>
									<input type="text" id="name-st-bill-edit" name="name-st-bill-edit" readonly>
								</td>
							</tr>

							<tr>
								<td>
									<label>Lớp: <strong style="color: #ff1ace; font-weight: inherit;font-size: small;">(Không thể sửa)</strong></label>
									<input type="text" id="class-bill-edit" name="clas-bill-edit" readonly>
								</td>
								<td>
									<label>Số tiền : <strong style="color: #ff1ace; font-weight: inherit;font-size: small;">(Không thể sửa)</strong></label>
									<input type="text" id="st-bill-edit" name="st-bill-edit" readonly>
								</td>
							</tr>

							<tr>
								<td>
									<label>Thời gian : <strong id="err-time-bill-edit" style="color: #e90000; font-weight: inherit;font-size: small;"></strong></label></label>
									<br>

									<label style="margin-left: 100px" for="month-bill-edit">Tháng :</label>
									<select style="width:fit-content" name="month-bill-edit" id="month-bill-edit">
										<option value="">Chọn tháng</option>
										<option value="1">Tháng 1</option>
										<option value="2">Tháng 2</option>
										<option value="3">Tháng 3</option>
										<option value="4">Tháng 4</option>
										<option value="5">Tháng 5</option>
										<option value="6">Tháng 6</option>
										<option value="7">Tháng 7</option>
										<option value="8">Tháng 8</option>
										<option value="9">Tháng 9</option>
										<option value="10">Tháng 10</option>
										<option value="11">Tháng 11</option>
										<option value="12">Tháng 12</option>
									</select>

									<label style="margin-left: 100px" for="year-bill-edit">Năm :</label>
									<select style="width:fit-content" name="year-bill-edit" id="year-bill-edit">

										<option value="">Chọn năm</option>
										<?php for ($i = 2020; $i <= 2100; $i++) { ?>
											<option value="<?php echo $i ?>">
												<?php echo $i ?>
											</option>
										<?php } ?>
									</select>

								</td>
							</tr>

							<tr>
								<td>
									<label>Giảm học phí: <strong style="color: #ff1ace; font-weight: inherit;font-size: small;">(Không thể sửa)</strong></label>
									<input type="text" id="ghp-bill-edit" name="ghp-bill-edit" readonly>
								</td>
								<td>
									<label>Số tiền giảm : <strong style="color: #ff1ace; font-weight: inherit;font-size: small;">(Không thể sửa)</strong></label>
									<input type="text" id="stg-bill-edit" name="stg-bill-edit" readonly>
								</td>
							</tr>



							<tr>
								<td>
									<label>Số tiền phải đóng : <strong style="color: #ff1ace; font-weight: inherit;font-size: small;">(Không thể sửa)</strong></label>
									<input type="text" id="stpd-bill-edit" name="stpd-bill-edit" readonly>
								</td>
								<td>
									<label>Số tiền đã đóng : <strong style="color: #ff1ace; font-weight: inherit;font-size: small;">(Không thể sửa)</strong></label>
									<input type="text" id="stdd-bill-edit" name="stdd-bill-edit" readonly>
								</td>
							</tr>
							<tr>
								<td>
									<label> Nợ phí còn lại : <strong style="color: #ff1ace; font-weight: inherit;font-size: small;">(Không thể sửa)</strong></label>
									<input type="text" id="npcl-bill-edit" name="npcl-bill-edit" readonly>
								</td>
								<td>
									<label> Trạng thái : </label>
									<select id="status-bill-edit" name="status-bill-edit">
										<option value="Chưa đóng">Chưa đóng</option>
										<option value="Còn nợ">Còn nợ</option>
										<option value="Hoàn thành">Hoàn thành</option>
									</select>
								</td>
							</tr>

						</table>





						<input type="submit" id='update-bill-edit' name="update-bill-edit" value="Cập nhật">

					</form>
					<button id="btn-cancle-edit-bill">Hủy bỏ</button>
				</div>
			</div>
		</div>


		<!-- thong bao -->
		<div class="add-success">
			<img src="../assets/images/icon_success.png" alt="" style=" width: 40px;">
			<h3 id='tb1'></h3>
		</div>

		<!-- xóa hóa đơn -->
		<div id="modal-ques">
			<div class="delete-bill-ques">
				<img src="../assets/images/Help-icon.png" alt="" style=" width: 40px;">
				<h4>Bạn chắc chắn muốn xóa?</h4>
				<div style="display:flex ;justify-content: space-evenly;align-items: center">

					<button style="background-color:#52a95f; height: 44px;width: 80px" id="btn-cancle-delete-bill">Hủy bỏ</button>
					<form id="form-delete-bill" action="" method="POST">
						<input type="hidden" id="mahd-delete" name="mahd-delete">
						<input type="submit" style="background-color: #d52828;  height: 44px;width: 80px" id="delete-bill" name="delete=bill" value="Xóa"></input>
					</form>
				</div>
			</div>

			<div class="delete-bill-ques-2">
				<img src="../assets/images/warning-icon.png" alt="" style=" width: 40px;">
				<h4>Hóa đơn đã có dữ liệu thanh toán</h4>
				<h4>Bạn chắc chắn muốn xóa?</h4>
				<div style="display:flex ;justify-content: space-evenly;align-items: center">

					<button style="background-color:#52a95f; height: 44px;width: 80px" id="btn-cancle-delete-bill-2">Hủy bỏ</button>
					<form id="form-delete-bill-2" action="" method="POST">
						<input type="hidden" id="mahd-delete-2" name="mahd-delete-2">
						<input type="submit" style="background-color: #d52828;  height: 44px;width: 80px" id="delete-bill-2" name="delete=bill-2" value="Xóa"></input>
					</form>
				</div>
			</div>
		</div>
		<div class="delete-success">
			<img src="../assets/images/icon_success.png" alt="" style=" width: 40px;">
			<h3>Xóa thành công!</h3>
		</div>


		<div class="delete-cant">
			<img src="../assets/images/Close-icon.png" alt="" style=" width: 40px;">
			<h3 id='tb2'> <br> </h3>
			<button id="close">Đóng</button>
		</div>
		<div id="modal-ques-trans">
			<div class="delete-ques-trans">
				<img src="../assets/images/Help-icon.png" alt="" style=" width: 40px;">
				<h4>Bạn chắc chắn muốn xóa?</h4>
				<div style="display:flex ;justify-content: space-evenly;align-items: center">

					<button style="background-color:#52a95f; height: 44px;width: 80px " id="btn-cancle-delete-trans">Hủy bỏ</button>


					<button type="button" style="background-color: #d52828;  height: 44px;width: 80px;border-radius: 7px;" id="delete-trans">Xóa</button>

				</div>
			</div>
		</div>
	</main>

	<footer>
		<p>© 2023 Hệ thống quản lý giáo dục. All rights reserved.</p>
	</footer>
</body>



<script>
	var dsHoaDon = <?php print_r($jslistBill); ?>;
	var dshs_lopxHS = <?php print_r($jslisths_lopxHS); ?>;
	var ds_LS_THP = <?php print_r($jslistLSTHP); ?>;
	var ds_lop_DD = <?php print_r($jslistClassOpen); ?>;
	var ds_hs_hocphi = <?php print_r($jslistHS_GHP); ?>;
	var ds_diemdanh = <?php print_r($jslistDD); ?>;
</script>

<script src="../assets/js/manageFinance.js"></script>

</html>