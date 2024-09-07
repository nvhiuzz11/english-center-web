<?php
include "../lib/FunctionClass.php";

$listClass = listClass($connection);

$result = listSchedules($connection);
$listTeacher = listTeacher($connection);
$dataClassOnOff = dataClassOnOff('Đang mở', $connection);
// lịch của giáo viên
$timeTeacher = timeTeacher($connection);

$listtimeTeacher = json_encode($timeTeacher);

$arr = array();
$dem = 0;
foreach ($listClass as $dataCodeClass) {
	$arr[$dem] = $dataCodeClass['MaLop'];
	$dem++;
};
$listClassJson = json_encode($arr);


?>

<!DOCTYPE html>

<html lang="en">

<head>
	<meta charset="UTF-8">
	<title>Quản lý hệ thống giáo dục</title>
	<link rel="stylesheet" href="../assets/css/manage.css">
	<link rel="stylesheet" href="../assets/css/manageClass.css">
	<link rel="icon" href="../assets/images/logo-web.png" type="image/x-icon">
	<!-- start boot strap  -->
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
	<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
	<!-- start end strap  -->
	<script src="https://code.jquery.com/jquery-3.6.4.js"></script>
	<script src="../assets/js/ajaxListClass.js"></script>
	<style>
		button {
			border: none;
		}
	</style>
</head>

<body>
	<header>
		<div class="logo">
			<img src="../assets/images/logo-web.png" alt="Logo">
		</div>
		<nav>
			<ul>
				<li><a style="color: #0088cc;" href="./ListClass.php">Quản lý lớp học</a></li>
				<li><a href="../manage/manageStudent.php">Quản lý học sinh</a></li>
				<li><a href="../manage/manageTeacher.php">Quản lý giáo viên</a></li>
				<li><a href="../manage/manageParent.php">Quản lý phụ huynh</a></li>
				<li><a href="../manage/manageFinance.php">Quản lý tài chính</a></li>
				<li><a href="../manage/manageStatistical.php">Báo cáo thống kê</a></li>
				<li><a href="../pages/home/home.php" style="display: flex;"><img src="../assets/images/icon-logout.png" alt="" style="width:20px"></a></li>

			</ul>
		</nav>
	</header>
	<main>
		<div class="center-listClass">
			<div class="">
				<button id="open-btn">Thêm lớp</button>
			</div>
			<div class="searchClass" id="searchClass">
				<div>
					<input type="text" class="timkiem" placeholder="Tìm kiếm lớp...">
				</div>
			</div>

			<div class="optionClass">
				<select name="province" id="province">
					<option value="1">Lớp đang mở</option>
					<option value="0">Lớp chưa mở </option>
					<option value="2">Lớp đã đóng</option>
				</select>
			</div>
		</div>
		<div>
			<h1 style="color: #0088cc;">Danh sách lớp học</h1>
			<!-- lớp on -->
			<div class="class-container" id="district">

			</div>
			<style>
				#box {}
			</style>
			<div id="overlay">
				<div id="box">
					<button id="close-btn">&times;</button>
					<div class="">
						<h1 class="fw-bold mt-4" style="color: #0088cc;">Thêm lớp học</h1>
						<form id="form_add" name="form_add" method="post">
							<div class="row">
								<div class="col-md-6">
									<label for="classcode" class="fw-bold">Mã lớp:<label class="lbStyle" id="lbclasscode" style="color:red; font-size:13px ; font-style: italic "></label></label>
									<input type="text" id="classcode" name="classcode" placeholder="Nhập mã lớp...">
								</div>

								<div class="col-md-6">
									<label for="classname" class="fw-bold">Tên lớp:<label class="lbStyle" id="lbclassname" style="color:red; font-size:13px ; font-style: italic "></label></label>
									<input type="text" id="classname" name="classname" placeholder="Nhập tên lớp...">
								</div>


								<div class="col-md-6">
									<label for="classAge" class="fw-bold mb-2">Lứa tuổi:<label class="lbStyle" id="lbclassAge" style="color:red; font-size:13px ; font-style: italic "></label></label>
									<br><input style="padding: 12px; outline: none; border: 1px solid #ccc;" class="w-100" type="number" id="classAge" name="classAge" placeholder="Nhập lứa tuổi...">
								</div>

								<div class="col-md-6">
									<label for="price" class="fw-bold">Học phí/buổi:<label class="lbStyle" id="lbprice" style="color:red; font-size:13px ; font-style: italic "></label></label>
									<input type="text" id="price" name="price" placeholder="Nhập học phí..." oninput="formatNumber(this)">
								</div>

								<div class="col-md-6">
									<label for="classTimeOpen" class="fw-bold mb-2">Thời gian bắt đầu khóa học:</label><label id="lbclassTimeOpen" style="color:red; font-size:13px ; font-style: italic "></label>

									<input style="width: 100%;" type="date" id="classTimeOpen" name="classTimeOpen" placeholder="Nhập thời gian...">
								</div>

								<div class="col-md-6">
									<label class="fw-bold mb-2" for="schedules">Lịch học:<label class="lbStyle" id="lbschedules" style="color:red; font-size:13px ; font-style: italic "></label></label>
									<br><select style="width: 70%;" name="schedules0" id="schedules0">
										<option value="">Thời gian</option>
										<?php foreach ($result as $results) : ?>
											<option style="height: 30px;"  value="<?php echo $results['MaLich'] ?>">
												<?php echo $results['Ngay'] . ' - ' . $results['TGBatDau'] . '-' . $results['TGKetThuc'] ?>
											</option>
										<?php endforeach; ?>
									</select>

									<button style="background-color: chartreuse; border: 1px solid #fff; border-radius:5px ; padding: 5px 4px;" type="button" onclick="addCard()">Thêm lịch học</button>
									<div id="addSchedules"></div>
								</div>



								<div class="col-md-6">
									<label class="fw-bold" for="numberlessons">Tổng số buổi học:<label class="lbStyle" id="lbnumberlessons" style="color:red; font-size:13px ; font-style: italic "></label></label>
									<br><input type="text" id="numberlessons" name="numberlessons" placeholder="Nhập số buổi học...">
								</div>

								<div class="col-md-6">
									<label for="students" class="fw-bold">Số lượng học sinh tối đa:<label class="lbStyle" id="lbstudents" style="color:red; font-size:13px ; font-style: italic "></label></label>
									<br><input type="text" id="students" name="students" placeholder="Nhập số lượng học sinh...">
									<br>
								</div>
								<div class="col-md-6">
									<label class="fw-bold mb-2" for="teacher">Giáo viên:<label class="lbStyle" id="lbteacher" style="color:red; font-size:13px ; font-style: italic "></label></label>
									<br>
									<select style="width: 100%;" name="teachers" id="teachers">
										<option value="">Tên giáo viên</option>
										<?php foreach ($listTeacher as $listTeachers) : ?>
											<option value="<?php echo $listTeachers['MaGV'] ?>">
												<?php echo $listTeachers['TenGV'] . ' - ' . $listTeachers['TrinhDo'] ?>
											</option>
										<?php endforeach; ?>
									</select>
								</div>
								<div class="col-md-6">
									<label class="fw-bold" for="TeacherSalarie">Lương giáo viên/buổi:<label class="lbStyle" id="lbTeacherSalarie" style="color:red; font-size:13px ; font-style: italic "></label></label>
									<br><input type="text" id="TeacherSalarie" name="TeacherSalarie" placeholder="Nhập lương giáo viên" oninput="formatNumber(this)">
								</div>
								<div class="col-md-6">
									<label class="fw-bold mb-2" for="condition">Trạng thái:<label class="lbStyle" id="lbcondition" style="color:red; font-size:13px ; font-style: italic "></label></label>
									<br><select name="SelectCondition" id="SelectCondition">
										<option value="">Trạng thái</option>
										<option value="Chưa mở">Chưa mở</option>
										<option value="Đang mở">Đang mở</option>
										<option value="Đã đóng">Đã đóng</option>
									</select>
									<br>
									<button class="mt-2 d-none" style="background-color: chartreuse; border: 1px solid #fff; border-radius:5px ; padding: 5px 4px; margin-bottom: 10px;" type="button">Thêm khuyến mại</button>
									<div class="d-none" id="addDiscount">
									</div>




									<input id="btn-discount" style="background-color: chartreuse; border: 1px solid #fff; border-radius:5px ; padding: 5px 4px; margin-bottom: 10px; margin-top:5px" type="button" value="Thêm khuyến mãi" onClick="showHideDiv('divMsg')" /><br><br>
									<div id="divMsg" style="display:none">
										<label for="">Khuyến mại :<label class="lbStyle" id="lbdiscount" style="color:red; font-size:13px ; font-style: italic "></label></label>
										<br>
										Thời gian bát đầu : <input type="date" name="startDiscount" id="startDiscount"><br>
										Thời gian kết thúc: <input type="date" name="endDiscount" id="endDiscount"><br>
										<input type="text" name="discountpercent" id="discountpercent" placeholder="Nhập % khuyến mại" style="width:50%"><span style="margin-left: -23px;">%</span>
									</div>

								</div>





								<input type="submit" id='add' name="add" value="Thêm">
							</div>
						</form>

						<div id="card-container"></div>
					</div>
				</div>
			</div>
	</main>
	<footer>
		<p>© 2023 Hệ thống quản lý giáo dục. All rights reserved.</p>
	</footer>

	<div class="add-success">
		<img src="../assets/images/icon_success.png" alt="" style=" width: 40px;">
		<h3>Thêm lớp thành công!</h3>
	</div>
</body>


<script>
	var listtimeTeacher = <?php echo $listtimeTeacher ?>;

	showClass();

	function showClass() {
		var province_id = document.getElementById("province").value;
		var txt = document.querySelector(".timkiem").value;
		var data = {
			key: txt,
			province_id: province_id
		};

		$.post('../api/get_searchClass.php', {
			data: data
		}, function(response) {
			document.querySelector('.class-container').innerHTML = response;
		})

	}


	// hiển thị box chính




	const openBtn = document.getElementById('open-btn');
	const overlay = document.getElementById('overlay');
	const box = document.getElementById('box');
	const closeBtn = document.getElementById('close-btn');

	openBtn.addEventListener('click', () => {
		overlay.classList.add('active');
		box.classList.add('active');
	});

	closeBtn.addEventListener('click', () => {
		overlay.classList.remove('active');
		box.classList.remove('active');

		document.getElementById("form_add").reset();
		const container = document.getElementById("addSchedules");
		while (container.firstChild) {
			container.removeChild(container.firstChild);
		}
		document.getElementById("divMsg").style.display = "none";
	});

	// add class
	var counter = 1; // Biến đếm ban đầu
	<?php $counter = 1 ?>

	function addCard() {
		var container = document.getElementById("addSchedules");
		var card = document.createElement("div");
		card.className = "card";
		card.style.width = "100%";
		card.style.display ="flex";
		card.style.flexDirection = "row";
		card.style.border = "unset";
		card.style.marginTop = "5px";
		card.innerHTML = `
  		<select style='width: 70%; margin-right:5px' name="schedules${counter}" id="schedules${counter}">
          <option value="">Thời gian</option>
          <?php foreach ($result as $results) : ?>
            <?php $counter = 1 ?>
            <option <?php if (isset($_POST['schedules']) && $_POST['schedules'] == $results['MaLich']) {
						echo 'selected';
					}
					?>
             value="<?php echo $results['MaLich'] ?>">
              <?php echo $results['Ngay'] . ' - ' . $results['TGBatDau'] . '-' . $results['TGKetThuc'] ?>
            </option>
          <?php endforeach; ?>
        </select>
        <button class="delete-button" data-index="${counter}" onclick="deleteCard(this)">Xóa</button>
  `;
		container.appendChild(card);
		counter++; // Tăng giá trị của biến đếm
		<?php $counter++ ?>
	}

	function deleteCard(button) {
		var index = button.getAttribute("data-index");
		var card = button.parentNode;
		var container = card.parentNode;
		container.removeChild(card);

		// Cập nhật giá trị biến đếm
		counter--;
		<?php $counter-- ?>

		// Cập nhật thuộc tính name của các thẻ select
		var cards = container.getElementsByClassName("card");
		for (var i = 0; i < cards.length; i++) {
			var select = cards[i].querySelector("select");
			select.setAttribute("name", "schedules" + (i + 1));
		}
	}




	function addDiscount() {
		var container = document.getElementById("addDiscount");
		var card = document.createElement("div");
		card.className = "card";
		card.innerHTML = `
		<label for="">Khuyến mại :<label class="lbStyle" id="lbdiscount" style="color:red; font-size:13px ; font-style: italic "></label></label>
							<br>
							Thời gian bát đầu : <input type="date" name="startDiscount" id="startDiscount" ><br>
							Thời gian kết thúc: <input type="date" name="endDiscount" id="endDiscount"><br>
							<input type="text" name="discountpercent" id="discountpercent" placeholder="Nhập % khuyến mại">
							<button class="delete-button" onclick="deleteDiscount(this)">Xóa khuyến mại</button>
  `;
		container.appendChild(card);
	}

	function deleteDiscount(button) {
		var index = button.getAttribute("data-index");
		var card = button.parentNode;
		var container = card.parentNode;
		container.removeChild(card);

	}
	// Khi nhấn Thêm
	const submit_add = document.getElementById('add');
	submit_add.addEventListener('click', function(event) {



		event.preventDefault();
		const classcode = document.getElementById('classcode').value;

		// Kiểm tra mã lớp có tồn tại hay không
		const listClass = <?php echo $listClassJson; ?>;
		let found = false;
		for (let i = 0; i < listClass.length; i++) {
			if (classcode === listClass[i]) {
				found = true;
				break;
			}
		}

		const classname = document.getElementById('classname').value;
		const classAge = document.getElementById('classAge').value;
		const classTimeOpen = document.getElementById('classTimeOpen').value;
		const price = document.getElementById('price').value;
		const numberlessons = document.getElementById('numberlessons').value;
		const students = document.getElementById('students').value;
		const teachers = document.getElementById('teachers').value;
		const teacherSalarie = document.getElementById('TeacherSalarie').value

		// trạng thái
		const condition = document.getElementById('SelectCondition').value;


		// lịch

		var teacherScheduleArray = [];
		var schedules = [];
		for (let i = 0; i <= counter; i++) {
			const element = document.getElementById(`schedules${i}`);
			const idSchedules = element ? element.value : "";

			if (idSchedules != "") {
				teacherScheduleArray.push({
					idSchedules: idSchedules,
					MAGV: teachers
				});
				schedules.push(idSchedules);
			}

		}
		


		// dữ liệu giảm học phí
		const element_startDiscount = document.getElementById('startDiscount');
		const startDiscount = element_startDiscount ? element_startDiscount.value : "";

		const element_endDiscount = document.getElementById('endDiscount');
		const endDiscount = element_endDiscount ? element_endDiscount.value : "";

		const element_discountpercent = document.getElementById('discountpercent');
		const discountpercent = element_discountpercent ? element_discountpercent.value : "";


		var erorr_empty = "*Dữ liệu không để trống";



		var check = false;


		//Kiểm tra dữ liệu nhập vào
		if (!classcode) {

			document.getElementById('lbclasscode').textContent = erorr_empty;
			check = true;

		} else {
			if (found) {
				document.getElementById('lbclasscode').textContent = '*Mã lớp đã tồn tại';
				check = true;

			} else
				document.getElementById('lbclasscode').textContent = "";
		}




		if (!classname) {
			document.getElementById('lbclassname').textContent = erorr_empty;
			check = true;
		} else
			document.getElementById('lbclassname').textContent = "";

		if (!classAge) {
			document.getElementById('lbclassAge').textContent = erorr_empty;
			check = true;
		} else
			document.getElementById('lbclassAge').textContent = "";

		if (!classTimeOpen) {
			document.getElementById('lbclassTimeOpen').textContent = erorr_empty;
			check = true;
		} else
			document.getElementById('lbclassTimeOpen').textContent = "";
		if (teacherScheduleArray.length == 0) {
			document.getElementById('lbschedules').textContent = '*Chưa có lịch học';
		} else {
			if (checkDuplicateSchedules(teacherScheduleArray)) {
				document.getElementById('lbschedules').textContent = '*Lịch học trùng nhau';
				check = true;
			} else if (hasDuplicateElements(teacherScheduleArray, listtimeTeacher)) {
				document.getElementById('lbschedules').textContent = '*Lịch học của giáo viên đã tồn tại ';
				check = true;
			} else {
				document.getElementById('lbschedules').textContent = "";
			}
		}


		if (!price) {
			document.getElementById('lbprice').textContent = erorr_empty;
			check = true;
		} else
			document.getElementById('lbprice').textContent = "";

		if (!numberlessons) {
			document.getElementById('lbnumberlessons').textContent = erorr_empty;
			check = true;
		} else
			document.getElementById('lbnumberlessons').textContent = "";
		if (!students) {

			document.getElementById('lbstudents').textContent = erorr_empty;
			check = true;
		} else
			document.getElementById('lbstudents').textContent = "";

		if (!teachers) {
			document.getElementById('lbteacher').textContent = erorr_empty;
			check = true;
		} else
			document.getElementById('lbteacher').textContent = "";

		if (!teacherSalarie) {
			document.getElementById('lbTeacherSalarie').textContent = erorr_empty;
			check = true;
		} else
			document.getElementById('lbTeacherSalarie').textContent = "";
		if (!condition) {
			document.getElementById('lbcondition').textContent = erorr_empty;
			check = true;
		} else
			document.getElementById('lbcondition').textContent = "";

		// lịch học giáo viên


		if (startDiscount) {
			if (!startDiscount || !endDiscount || !discountpercent) {
				document.getElementById('lbdiscount').textContent = '*Bạn đang thiếu dữ liệu';
				check = true;
			} else if (startDiscount == endDiscount) {
				document.getElementById('lbdiscount').textContent = '*Lịch trùng nhau';
				check = true;
			} else {
				document.getElementById('lbdiscount').textContent = "";
			}
		}


		if (check) {
			return;
		}



		const data = {
			classcode: classcode,
			classname: classname,
			classAge: classAge,
			classTimeOpen: classTimeOpen,
			SelectCondition: condition,
			price: price,
			numberlessons: numberlessons,
			students: students,
			teachers: teachers,
			TeacherSalarie: teacherSalarie,
			startDiscount: startDiscount,
			endDiscount: endDiscount,
			discountpercent: discountpercent,

		};
		const compressedData = JSON.stringify(data);



		$.ajax({
			url: '../api/addClass.php',
			type: 'POST',
			data: {
				 compressedData: compressedData,
				schedules: schedules,
			},
			success: function(res) {
				
				
				showClass();


			},
			error: function(xhr, status, error) {
				console.error(error);
			}
		});

		document.getElementById('form_add').reset();
		const container = document.getElementById("addSchedules");
		while (container.firstChild) {
			container.removeChild(container.firstChild);
		}
		document.getElementById("divMsg").style.display = 'none';
		document.querySelector('.add-success').style.display = 'block';

		setTimeout(function() {
			document.querySelector('.add-success').style.display = 'none';

		}, 1000);


	});




	function checkDuplicateSchedules(scheduleArray) {
		const idSet = new Set();

		for (const schedule of scheduleArray) {
			if (idSet.has(schedule.idSchedules)) {

				return true;
			} else {
				idSet.add(schedule.idSchedules);
			}
		}
		return false;
	}

	function hasDuplicateElements(arr1, arr2) {
		for (let i = 0; i < arr1.length; i++) {
			for (let j = 0; j < arr2.length; j++) {

				if (arr1[i].MAGV == arr2[j].MAGV && arr1[i].idSchedules == arr2[j].MaLich) {


					return true;
				}
			}
		}
		return false;
	}

	function numberWithCommas(x) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

	function parseNumericValue(value) {
		return parseInt(value.replace(/,/g, ''));
	}

	document.getElementById('TeacherSalarie').addEventListener('blur', function() {
		var value = parseNumericValue(this.value);

		if (!value) {
			this.value = '';
		} else {
			this.value = numberWithCommas(value);

		}

	});

	document.getElementById('lbprice').addEventListener('blur', function() {
		var value = parseNumericValue(this.value);

		if (!value) {
			this.value = '';
		} else {
			this.value = numberWithCommas(value);

		}

	});

	function formatNumber(input) {
		let value = input.value;

		value = value.replace(/[^\d,]/g, '');

		value = value.replace(/,/g, '');

		value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
		input.value = value;
	}



	function showHideDiv(ele) {
		var srcElement = document.getElementById(ele);
		if (srcElement != null) {
			if (srcElement.style.display == "block") {
				srcElement.style.display = 'none';
				document.getElementById("btn-discount").value = "Thêm khuyến mãi";
			} else {
				srcElement.style.display = 'block';
				document.getElementById("btn-discount").value = "Xóa khuyến mãi";
			}
			return false;
		}
	}
</script>

</html>