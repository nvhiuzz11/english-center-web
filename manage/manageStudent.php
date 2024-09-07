<?php
require '../lib/functionStudent.php';

$listStudent = listStudent($connection);
$listph_hs = listph_hs($connection);
$lisths_lop = lisths_lop($connection);
$listtk_hs = listtk_hs($connection);
$listPhuHuynh =  selectAllParent($connection);
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

	if (isset($_POST['refesh'])) {
		header("Location: manageStudent.php");
	}
}

$jsonListStudent = json_encode($listStudent);
$jsonListph_hs = json_encode($listph_hs);
$jsonLisths_lop = json_encode($lisths_lop);
$jsonListtk_hs = json_encode($listtk_hs);
$jsonListPhuHuynh = json_encode($listPhuHuynh);
?>


<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8">
	<title>Quản lý hệ thống giáo dục</title>
	<link rel="stylesheet" href="../assets/css/manage.css">
	<link rel="stylesheet" href="../assets/css/manageStudent.css">
	<link rel="icon" href="../assets/images/logo-web.png" type="image/x-icon">
	<script src="https://code.jquery.com/jquery-3.6.4.js"></script>
</head>

<body>
	<header>
		<div class="logo">
			<img src="../assets/images/logo-web.png" alt="Logo">

		</div>
		<nav>
			<ul>
				<li><a href="./ListClass.php">Quản lý lớp học</a></li>
				<li><a style="color: #0088cc;" href="../manage/manageStudent.php">Quản lý học sinh</a></li>
				<li><a href="../manage/manageTeacher.php">Quản lý giáo viên</a></li>
				<li><a href="../manage/manageParent.php">Quản lý phụ huynh</a></li>
				<li><a href="../manage/manageFinance.php">Quản lý tài chính</a></li>
				<li><a href="../manage/manageStatistical.php">Báo cáo thống kê</a></li>
				<li><a href="../pages/home/home.php" style="display: flex;"><img src="../assets/images/icon-logout.png" alt="" style="width:20px"></a></li>

			</ul>
		</nav>
	</header>
	<main>

		<h1>Quản lý Học sinh</h1>
		<div class="search-container">

			<form id="form-search" method="post" action="<?php echo htmlspecialchars($_SERVER['PHP_SELF']); ?>" style="width: 50%; margin: unset;display: inline-flex;" autocomplete="off">
				<input type="text" name="keyword" id="keyword" placeholder="Tìm kiếm..." style="width: 70% ; border-radius: 0px; border-color:black;" value="<?php if (isset($_POST['keyword'])) {
																																	} ?>" oninput="searchList()">
				<input type="button" id="search" value="Tìm kiếm" style="width: 100px;  background-color: #4CAF50;">
				<button type="submit" id="refesh-btn" name="refesh" style=" background-color: currentcolor "> <img style="width: 30px;" src="../assets/images/Refresh-icon.png" alt=""></button>
			</form>
			<div>
				<button class="add-student-button">+ Thêm học sinh</button>
			</div>
		</div>

		<table id="table-1">
			<thead>
				<tr>
					<th>STT</th>
					<th onclick="sortTable(1)">Mã học sinh</th>
					<th onclick="sortTable(2)">Họ Tên</th>
					<th onclick="sortTable(3)">Giới tính</th>
					<th onclick="sortTable(4)">Tuổi</th>
					<th onclick="sortTable(5)" style="width :200px">Địa chỉ</th>



				</tr>
			</thead>
			<tbody class="tbody-1">


			</tbody>

			
		</table>
		<div id="container-index">
		
		
		</div>

		<!-- Thêm học sinh -->

		<div class="modal-bg-add">
			<div class="modal-content-add">
				<div>
					<form id="form_add" name="form_add" method="post">

						<h1>Thêm Học sinh</h1>

						<label for="student_name">Tên học sinh: <label id="lb_name_add" style="color:red; font-size:13px ; font-style: italic "></label></label>
						<input type="text" id="student_name_add" name="student_name_add" placeholder="Nhập tên học sinh">

						<label for="gender">Giới tính:</label>
						<select id="gender_add" name="gender_add">
							<option>Nam</option>
							<option>Nữ</option>
						</select>

						<label for="birthday">Ngày sinh:</label>
						<input type="date" id="birthday_add" name="birthday_add" onchange="setAge()"><label id="lb_birthday_add" style="color:red; font-size:13px ; font-style: italic "></label>

						<label for="age" style="margin-left: 150px;">Tuổi:</label>
						<input type="number" id="age_add" name="age_add" readonly> <label id="lb_age_add" style="color:red; font-size:13px ; font-style: italic "></label>
						<br>

						<label for="address">Địa chỉ: <label id="lb_address_add" style="color:red; font-size:13px ; font-style: italic "></label></label>
						<input type="text" id="address_add" name="address_add" placeholder="Nhập địa chỉ">

						<label for="phone_number">Số điện thoại: <label id="lb_phone_add" style="color:red; font-size:13px ; font-style: italic "></label></label>
						<input type="tel" id="phone_number_add" name="phone_number_add" placeholder="Nhập số diện thoại">

						<label for="email_add">Email: <label id="lb_email_add" style="color:red; font-size:13px ; font-style: italic "></label></label>
						<input type="email" id="email_add" name="email_add" placeholder="Nhập email">

				<div hidden>																											
						<label for="parent_add">Phụ huynh: <label class="lb_parent_add" style="color:red; font-size:13px; font-style: italic;"></label></label>
						<br>
						<select name="parent_add" class="parent_add" style="width: 50%;">
							<option value="">Chọn phụ huynh</option>

							
							<?php foreach ($listPhuHuynh as $ph) { ?>
								<option value="<?php echo $ph['MaPH'] ?>">
									<?php echo $ph['MaPH'] . '. ' . $ph['TenPH'] . ' - ' . $ph['Tuoi'] . ' tuổi' ?>
								</option>
							<?php } ?>

						</select>
						<button type="button" style="background-color: limegreen;" onclick="addParent()" id="add_parent">+</button>

						<div id="parentContainer" style="padding : 0px">

						</div>

</div>	
						<input type="submit" id='add' name="add" value="Thêm">

					</form>
					<button class="cancle-btn-add" style="margin-left: 70px;">Hủy bỏ</button>
				</div>
			</div>
		</div>

		<!-- Thong tin chi tiet -->
		<div class="modal-bg">
			<div class="modal-content">


				<h2>Thông tin học sinh</h2>
				<button id="edit-button" style="position: absolute;top: 40px;right: 60px;">Sửa</button>

				<button id="delete-button" name="delete" style="position: absolute;top: 40px;right: 11px; background-color: #e90000">Xóa</button>

				<div class="container">

					<div class="header">
						<img id="img" alt="Avatar" class="avatar">

						<h1 class="name" id="Student-name"></h1>
					</div>

					<div class="detail">

						<div class="tab">
							<button class="tablinks" id="tb1" onclick="openTab(event, 'tab1')">Chung</button>
							<button class="tablinks" id="tb2" onclick="openTab(event, 'tab2')"> Lớp học</button>
							<button class="tablinks" id="tb4" onclick="openTab(event, 'tab4')">Phụ huynh liên kết</button>
							<button class="tablinks" id="tb3" onclick="openTab(event, 'tab3')">Tài khoản</button>

						</div>

						<div id="tab1" class="tabcontent">

							<table>
								<tr>
									<th>Mã học sinh:</th>
									<td id="Student-id"></td>
								</tr>
								<tr>
									<th>Giới tính:</th>
									<td id="Student-gender" contenteditable="false"></td>
								</tr>
								<tr>
									<th>Ngày sinh:</th>
									<td id="Student-date" contenteditable="false"></td>
								</tr>
								<tr>
									<th>Tuổi:</th>
									<td id="Student-age" contenteditable="false"></td>
								</tr>

								<tr>
									<th>Địa chỉ:</th>
									<td id="Student-address" contenteditable="false"></td>
								</tr>


								<tr>
									<th>Phụ huynh:</th>
									<td id="Student-parent"></td>
								</tr>

								<tr>
									<th>Số điện thoại: </th>
									<td id="Student-phone" contenteditable="false"></td>
								</tr>

								<tr>
									<th>Email:</th>
									<td id="Student-email" contenteditable="false"></td>
								</tr>
							</table>
						</div>


						<div id="tab2" class="tabcontent">
							<div class="class-of-student">

							</div>

						</div>

						<div id="tab3" class="tabcontent">
							<div>
								<table>
									<tr>
										<td id="date_logup"></td>
									</tr>
									<tr>
										<td>
											<h3 style="text-align: center;"> Tên đăng nhập : </h3>
										</td>
										<td>
											<label id="name-login"> </label>
										</td>
									</tr>
									<tr>
										<td>
											<h3 style="text-align: center;"> Mật khẩu : </h3>
										</td>
										<td>
											<input type="password" id="password" style="height: 21px;font-size: 18px;" readonly>
											<button style="background-color: slategray;" onclick="togglePassword()">Hiện/ẩn</button>
										</td>
									</tr>
									<tr>
										<td></td>
										<td>
											<button style=" background-color: peru;" id="change-pass-btn">Thay đổi</button>
										</td>
									</tr>
								</table>
							</div>

							<div id="div-change-pass">
								<form action="#" method="POST" id="change-pass" name="change-pass">
									<table>

										<tr>
											<td>
												<label> Tên đăng nhập : </label>
											</td>
											<td>
												<input type="text" id="username-login" name="username-login" readonly>
											</td>

										</tr>
										<tr>
											<td>
												<h5 id="err-username" style="color: red;font-style: italic;  font-size: 14px;"></h5>
											</td>

										</tr>
										<tr>

											<td>
												<label for="new-password">Mật khẩu mới:</label>
											</td>
											<td>
												<input type="password" id="new-password" name="new-password" autocomplete="false"><br>
											</td>
										</tr>
										<tr>
											<td>
												<h5 id="err-pass" style="color: red;font-style: italic;  font-size: 14px;"></h5>
											</td>

										</tr>


										<tr>
											<td style="text-align :center">
												<button type="button" id="cancle-change-pass" style=" font-size: 14px;padding: 14px 20px;">Hủy bỏ</button>
											</td>
											<td style="text-align :center">
												<input type="submit" name="change" id="change" style="width: unset" value="Cập nhật">
											</td>
										</tr>

									</table>
								</form>
							</div>
						</div>

						<div id="tab4" class="tabcontent">
							<button id="add-parent" style="float: inline-end;border-radius: 0px;  background-color: seagreen; "> Thêm liên kết phụ huynh</button>


							<div id="parent-infor">


							</div>


						</div>

					</div>


				</div>

				<button class="close-btn">Đóng</button>
			</div>
		</div>


		<div id="modal-add-link">



			<div id="add-link-parent">
				<h3>Thêm liên kết phụ huynh</h3>
				<select name="parent_add2" class="parent_add2" id="select-parent" style="width: 60%;" required>
					<option value="">Chọn phụ huynh</option>

				</select>
				<button type="button" style="background-color: limegreen;" onclick="addLinkParent()">+</button>

				<div id="parentContainer2" style="padding : 0px ">

				</div>
				<button id="btn-cancle-link" style="width: 30%;">Hủy</button>

				<button id="btn-add-link" style="width: 30%;">Thêm</button>

			</div>
		</div>

		<!-- Sua thong tin -->
		<div class="modal-bg-edit">
			<div class="modal-content-edit">
				<div>
					<form id="form_edit" name="form_edit" method="post">

						<h1>Sửa thông tin học sinh</h1>

						<h2 id="Student-id_edit"></h2>
						<input type="hidden" id="id_edit" name="id_edit">

						<label for="Student_name">Tên học sinh: <label id="lb_name_edit" style="color:red; font-size:13px ; font-style: italic "></label></label>
						<input type="text" id="sudent_name_edit" name="sudent_name_edit" required>

						<label for="gender">Giới tính:</label>
						<select id="gender_edit" name="gender_edit">
							<option>Nam</option>
							<option>Nữ</option>
						</select>

						<label for="birthday">Ngày sinh:</label>
						<input type="date" id="birthday_edit" name="birthday_edit"  onchange="setAge2()" required><label id="lb_birthday_edit" style="color:red; font-size:13px ; font-style: italic "></label>

						<label for="age" style="margin-left: 150px;">Tuổi:</label>
						<input type="number" id="age_edit" name="age_edit" readonly> 
						<br>
						<label for="address">Địa chỉ: <label id="lb_address_edit" style="color:red; font-size:13px ; font-style: italic "></label></label>
						<input type="text" id="address_edit" name="address_edit" required>

						<label for="phone_number">Số điện thoại: <label id="lb_phone_edit" style="color:red; font-size:13px ; font-style: italic "></label></label>
						<input type="tel" id="phone_number_edit" name="phone_number_edit" required>

						<label for="email">Email: <label id="lb_email_edit" style="color:red; font-size:13px ; font-style: italic "></label></label>
						<input type="email" id="email_edit" name="email_edit" required>


						<input type="submit" id='update' name="update" value="Cập nhật">

					</form>
					<button class="cancle-btn">Hủy bỏ</button>
				</div>
			</div>
		</div>



		<!-- Thong bao -->

		<div class="add-success">
			<img src="../assets/images/icon_success.png" alt="" style=" width: 40px;">
			<h3>Thêm học sinh thành công!</h3>
		</div>

		<div class="add-success" id="noti-add-link">
			<img src="../assets/images/icon_success.png" alt="" style=" width: 40px;">
			<h3>Thêm liên kết thành công!</h3>
		</div>

		<div class="update-success">
			<img src="../assets/images/icon_success.png" alt="" style=" width: 40px;">
			<h3>Thay đổi thành công!</h3>
		</div>
		<div class="delete-success">
			<img src="../assets/images/icon_success.png" alt="" style=" width: 40px;">
			<h3>Xóa thành công!</h3>
		</div>

		<div id="modal-ques">
			<div class="delete-ques">
				<img src="../assets/images/Help-icon.png" alt="" style=" width: 40px;">
				<h4>Bạn chắc chắn muốn xóa?</h4>
				<div style="display:flex ;justify-content: space-evenly;align-items: center">

					<input type="submit" style="background-color:#52a95f; height: 44px;width: 80px" id="delete-cancle" value="Hủy bỏ"></input>
					<input type="submit" style="background-color: #d52828;  height: 44px;width: 80px" id="delete" value="Xóa"></input>

				</div>
			</div>


			<div class="delete-ques2" style="max-width: 333px;">
				<img src="../assets/images/Help-icon.png" alt="" style=" width: 40px;">
				<h4>Học sinh đã có nhiều dữ liệu liên quan. Việc xóa sẽ ảnh hưởng đến cơ sở dữ liệu. <br> Bạn chắc chắn muốn xóa?</h4>
				<div style="display:flex ;justify-content: space-evenly;align-items: center">

					<input type="submit" style="background-color:#52a95f; height: 44px;width: 80px" id="delete-cancle2" value="Hủy bỏ"></input>
					<input type="submit" style="background-color: #d52828;  height: 44px;width: 80px" id="delete2" value="Xóa"></input>

				</div>
			</div>

		</div>
		<div class="change-pass-success">
			<img src="../assets/images/icon_success.png" alt="" style=" width: 40px;">
			<h3>Cập nhật tài khoản thành công!</h3>
		</div>


		<div id="modal-ques-link">
			<div class="delete-ques-link">
				<img src="../assets/images/Help-icon.png" alt="" style=" width: 40px;">
				<h4 id="txt-quest-link">Bạn chắc chắn muốn xóa?</h4>
				<div style="display:flex ;justify-content: space-evenly;align-items: center">
					<input type="submit" style="background-color:#52a95f; height: 44px;width: 80px" id="delete-cancle-link" value="Hủy bỏ"></input>
					<input type="submit" style="background-color: #d52828;  height: 44px;width: 80px" id="delete-link" value="Xóa"></input>

				</div>
			</div>
		</div>


		 <p style="margin-left: 80%; font-style:italic; font-size:13px" id="total">  </p>

	
		
	</main>




	<footer>
		<p>© 2023 Hệ thống quản lý giáo dục. All rights reserved.</p>
	</footer>

	<script>
		ds_hocsinh = <?php print_r($jsonListStudent); ?>;
		ds_ph_hs = <?php print_r($jsonListph_hs); ?>;
		ds_hs_lop = <?php print_r($jsonLisths_lop); ?>;
		ds_tk_hs = <?php print_r($jsonListtk_hs); ?>;
		ds_phuhuynh = <?php print_r($jsonListPhuHuynh); ?>;
	</script>;

	<script src="../../assets/js/manageStudent.js"></script>



</html>