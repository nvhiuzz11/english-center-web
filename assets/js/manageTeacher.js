const CLASS_STATUS = {
  COMING: 1,
  ONGOING: 2,
  CLOSE: 3,
};

var countData;
var currentPage = 1;
var ds_giaovien;
const accessToken = localStorage.getItem("accessToken");

fetchTeacher();

function showSpinner() {
  document.getElementById("loadingSpinner").style.display = "flex";
}

function hideSpinner() {
  document.getElementById("loadingSpinner").style.display = "none";
}

async function fetchTeacher() {
  showSpinner();
  try {
    const res = await fetch(`${API_URL}/api/teacher?includeClass=true`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.status === 200) {
      const resData = await res.json();

      ds_giaovien = resData.docs;
      console.log("ds_giaovien", ds_giaovien);
      countData = ds_giaovien.length;

      showTableTeacher(ds_giaovien, "");

      hideSpinner();
    }
  } catch (error) {
    hideSpinner();
    console.log("fetchTeacher error", error);
  }
}

function formatMoney(number) {
  return Number(number).toLocaleString("en-US", {
    maximumFractionDigits: 2,
  });
}

function formatDateFromISO(isoString) {
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

function setDateInput(inputId, isoString) {
  const date = new Date(isoString);
  const formattedDate = date.toISOString().split("T")[0];
  document.getElementById(inputId).value = formattedDate;
}

function convertDateFormat(dateString) {
  var dateParts = dateString.split("-");
  var formattedDate = dateParts[2] + "-" + dateParts[1] + "-" + dateParts[0];
  return formattedDate;
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function getGender(gender) {
  if (gender == 1) {
    return "Nam";
  } else {
    return "Nữ";
  }
}

function getStatus(status) {
  if (status == CLASS_STATUS.COMING) {
    return "Chưa mở";
  } else if (status == CLASS_STATUS.ONGOING) {
    return "Đang mở";
  } else {
    return "Đã đóng";
  }
}

function getRecordByPage(list, page, pageSize = 50) {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  return list.slice(startIndex, endIndex);
}

function showTableTeacher(list, text) {
  let i = 1;

  const tableBody = document.querySelector(".tbody-1");
  tableBody.innerHTML = "";

  if (!list || list.length === 0) {
    if (text != "") {
      tableBody.innerHTML += `<h2>Không tìm thấy kết quả phù hợp "${text}"</h2>`;
    }
  } else {
    const listItem = getRecordByPage(list, currentPage, 50);
    listItem.forEach((item) => {
      const newRow = `
            <tr>
                <td>${i++}</td>
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td>${getGender(item.gender)}</td>
                <td>${item.age}</td>
                <td style="width: 200px;">${
                  item.address != null ? item.address : ""
                }</td>
            </tr>
        `;
      tableBody.innerHTML += newRow;
    });
  }

  showindex();
}

// search
function searchKey(keyword) {
  const lowerKeyword = keyword.toLowerCase();
  return ds_giaovien.filter((item) => {
    return (
      String(item.id).includes(lowerKeyword) ||
      item.name.toLowerCase().includes(lowerKeyword) ||
      item.address.toLowerCase().includes(lowerKeyword) ||
      String(item.phone).includes(lowerKeyword) ||
      String(item.age).includes(lowerKeyword)
    );
  });
}

function searchList(number = 1) {
  var text = document.getElementById("keyword").value;
  const listSearch = searchKey(text);
  currentPage = number;
  showTableTeacher(listSearch, text);
  removeSortIcons();
}

function showindex() {
  var html = "";

  var count = Math.ceil(countData / 50);
  for (let i = 1; i <= count; i++) {
    var isActive = i === currentPage ? "activeIndex" : "";
    html +=
      '<div class="page-index ' +
      isActive +
      '" onclick="handlePageIndexClick(this, ' +
      i +
      ')">' +
      i +
      "</div>";
  }
  document.getElementById("container-index").innerHTML = html;
}

function handlePageIndexClick(clickedElement, pageNumber) {
  var pageElements = document.querySelectorAll(".page-index");
  pageElements.forEach(function (element) {
    element.classList.remove("activeIndex");
  });
  clickedElement.classList.add("activeIndex");

  currentPage = pageNumber;
  var text = document.getElementById("keyword").value;
  //   showTableTeacher(text, pageNumber, collum, orderby);
  searchList(pageNumber);
  var table = document.querySelector(".tbody-1");
  table.scrollTo({ top: table.offsetTop, behavior: "smooth" });
}

const rows = document.querySelectorAll(".tbody-1 tr");
const modalBg = document.querySelector(".modal-bg");
const modalContent = document.querySelector(".modal-content");

var stt_select;

var teacher_select;

document.querySelector(".tbody-1").addEventListener("click", function (event) {
  if (event.target.tagName === "TD") {
    stt_select = event.target.parentNode.cells[1].textContent;

    for (var i = 0; i < ds_giaovien.length; i++) {
      if (stt_select == ds_giaovien[i].id) teacher_select = ds_giaovien[i];
    }

    document.getElementById("teacher-name").textContent = teacher_select.name;
    document.getElementById("teacher-gender").textContent = getGender(
      teacher_select.gender
    );
    document.getElementById("teacher-age").textContent = teacher_select.age;
    document.getElementById("teacher-id").textContent = teacher_select.id;
    // document.getElementById("teacher-qq").textContent = teacher_select.a;
    document.getElementById("teacher-address").textContent =
      teacher_select.address;
    document.getElementById("teacher-date").textContent = formatDateFromISO(
      teacher_select.birthday
    );
    document.getElementById("teacher-phone").textContent = teacher_select.phone;
    document.getElementById("teacher-email").textContent = teacher_select.email;
    // document.getElementById("teacher-qualification").textContent =
    //   teacher_select.TrinhDo;

    var img = document.getElementById("img");

    if (teacher_select.gender == 1) {
      img.src = "../assets/images/Teacher-male-icon.png";
    } else {
      img.src = "../assets/images/Teacher-female-icon.png";
    }

    document.getElementById("tab1").classList.add("show");
    document.getElementById("tab2").classList.remove("show");
    document.getElementById("tab3").classList.remove("show");
    document.getElementById("tb1").classList.add("active");
    document.getElementById("tb2").classList.remove("active");
    document.getElementById("tb3").classList.remove("active");

    // Thong tin lop cua giao vien
    var classes = teacher_select.classes;
    // var k = 0;
    // for (var i = 0; i < ds_gv_lop.length; i++) {
    //   if (ds_gv_lop[i].MaGV === teacher_select.MaGV) {
    //     classes[k++] = ds_gv_lop[i];
    //   }
    // }

    var color = "";
    var html = "";

    if (classes.length == 0) {
      html += "<p>Giáo viên chưa tham gia giảng dạy lớp học nào </p>";
    } else {
      html += "<p> Số lớp dạy:  " + classes.length + "</p>";

      classes.forEach((item) => {
        if (item.status == CLASS_STATUS.ONGOING) {
          color = "#00c608";
        } else if (item.status == CLASS_STATUS.COMING) {
          color = "#ad9d0b";
        } else {
          color = "#ad0b0b";
        }

        html +=
          '<div class="class">' +
          "<p></p>" +
          "<table>" +
          "<tr>" +
          "<td>" +
          '<p id="id-class">Mã lớp học:  ' +
          item.code +
          "</p>" +
          "</td>" +
          "<td>" +
          '<p id="num-of-session">Số buổi học:  ' +
          item.teachedSession +
          "/" +
          item.totalSession +
          "</tr>" +
          "<tr>" +
          "<td>" +
          '<p id="name-class">Tên lớp học:  ' +
          item.name +
          "</p>" +
          "</td>" +
          "<td>" +
          '<p id="name =name-teacher">Lứa tuổi:  ' +
          item.fromAge +
          "</p>" +
          "</td>" +
          "</tr>" +
          "<tr>" +
          "<td>" +
          '<p id="fee-class">Số học sinh:  ' +
          item.studentQuantity +
          "/" +
          item.maxQuantity +
          "</p>" +
          "</td>" +
          "<td>" +
          '<p id="de-fee-class">Lương:  ' +
          formatMoney(item.TeacherClasses.salary) +
          "VND / buổi" +
          "</p>" +
          "</td>" +
          "</tr>" +
          "<tr>" +
          "<td>" +
          '<p id="status-class" style ="color:' +
          color +
          '" >Trạng thái:  ' +
          getStatus(item.status) +
          "</p>" +
          "</td>" +
          "</tr>" +
          "</table>" +
          "</div>";
      });

      document.querySelector("#classes-of-teacher").innerHTML = html;
    }

    //thong tin tai khoan

    // for (var i = 0; i < ds_tk_gv.length; i++) {
    //   if (ds_tk_gv[i].MaGV === teacher_select.MaGV) {
    //     document.getElementById("name-login").textContent =
    //       ds_tk_gv[i]["UserName"];
    //     document.getElementById("username-login").value =
    //       ds_tk_gv[i]["UserName"];
    //     document.getElementById("password").value = ds_tk_gv[i]["Password"];
    //     document.getElementById("date_logup").textContent =
    //       "Ngày đăng ký  :  " + convertDateFormat(ds_tk_gv[i]["NgayDK"]);
    //   }
    // }

    modalBg.style.display = "block";
  }
});

document.querySelector(".close-btn").addEventListener("click", () => {
  document.getElementById("div-change-pass").style.display = "none";
  document.getElementById("err-pass").textContent = "";
  document.getElementById("new-password").value = "";
  modalBg.style.display = "none";
});

const editButton = document.getElementById("edit-button");
const tdList = document.querySelectorAll("td[contenteditable]");

const modalBgEdit = document.querySelector(".modal-bg-edit");
const modalContentEdit = document.querySelector(".modal-content-edit");

// Khi người dùng nhấn vào nút "Sửa"
editButton.addEventListener("click", () => {
  document.getElementById("lb_phone_edit").textContent = "";
  document.getElementById("lb_email_edit").textContent = "";
  document.getElementById("lb_name_edit").textContent = "";
  document.getElementById("lb_hometown_edit").textContent = "";
  document.getElementById("lb_address_edit").textContent = "";
  document.getElementById("lb_education_edit").textContent = "";

  document.getElementById("lb_birthday_edit").textContent = "";

  modalBgEdit.style.display = "block";

  document.getElementById("teacher_name_edit").value = teacher_select.name;

  var gt = teacher_select.gender;
  var selectTag = document.getElementById("gender_edit");
  for (var i = 0; i < selectTag.options.length; i++) {
    if (selectTag.options[i].value == gt) {
      selectTag.options[i].selected = true; // nếu giống nhau, đặt thuộc tính selected cho option
      break;
    }
  }

  setDateInput("birthday_edit", teacher_select.birthday);

  document.getElementById("age_edit").value = teacher_select.age;
  document.getElementById("teacher-id_edit").textContent =
    "Mã Giáo viên : " + teacher_select.id;
  //   document.getElementById("hometown_edit").value = teacher_select.QueQuan;
  document.getElementById("address_edit").value = teacher_select.address;
  document.getElementById("phone_number_edit").value = teacher_select.phone;
  document.getElementById("email_edit").value = teacher_select.email;
  //   document.getElementById("education_edit").value = teacher_select.TrinhDo;
  document.getElementById("id_edit").value = teacher_select.id;
});

document.querySelector(".cancle-btn").addEventListener("click", () => {
  modalBgEdit.style.display = "none";
});

// Khi nhấn nút Cập nhật
const submit_update = document.getElementById("update");
submit_update.addEventListener("click", async function (event) {
  var check = true;

  event.preventDefault();
  const id = document.getElementById("id_edit").value;
  const phone_number = document.getElementById("phone_number_edit").value;
  const email = document.getElementById("email_edit").value;
  const gender = document.getElementById("gender_edit").value;

  const teacher_name = document.getElementById("teacher_name_edit").value;
  const age = document.getElementById("age_edit").value;
  const hometown = document.getElementById("hometown_edit").value;
  const address = document.getElementById("address_edit").value;
  const education = document.getElementById("education_edit").value;
  const birthday = document.getElementById("birthday_edit").value;

  var erorr_empty = "*Dữ liệu không để trống";

  //Kiểm tra dữ liệu nhập vào
  if (!teacher_name) {
    document.getElementById("lb_name_edit").textContent = erorr_empty;
    check = false;
  } else document.getElementById("lb_name_edit").textContent = "";

  if (!birthday) {
    document.getElementById("lb_birthday_edit").textContent = erorr_empty;
    check = false;
  } else document.getElementById("lb_birthday_edit").textContent = "";

  //   if (!hometown) {
  //     document.getElementById("lb_hometown_edit").textContent = erorr_empty;
  //     check = false;
  //   } else document.getElementById("lb_hometown_edit").textContent = "";

  if (!address) {
    document.getElementById("lb_address_edit").textContent = erorr_empty;
    check = false;
  } else document.getElementById("lb_address_edit").textContent = "";
  //   if (!education) {
  //     document.getElementById("lb_education_edit").textContent = erorr_empty;
  //     check = false;
  //   } else document.getElementById("lb_education_edit").textContent = "";
  if (!/^(0[0-9]{9})$/.test(phone_number)) {
    document.getElementById("lb_phone_edit").textContent =
      "*Số điện thoại không chính xác (0..; 10 chữ số)";
    check = false;
  } else document.getElementById("lb_phone_edit").textContent = "";

  if (!/\S+@\S+\.\S+/.test(email)) {
    document.getElementById("lb_email_edit").textContent =
      "*Email không chính xác (example@xxx.com)";
    check = false;
  } else document.getElementById("lb_email_edit").textContent = "";

  if (!check) return;
  //   document.querySelector(".update-success").style.display = "block";

  //   $.ajax({
  //     type: "POST",
  //     url: "../api/updateInforTeacher.php",
  //     data: {
  //       id: id,
  //       name: teacher_name,
  //       gender: gender,
  //       date: birthday,
  //       age: age,
  //       address: address,
  //       phone: phone_number,
  //       email: email,
  //       hometown: hometown,
  //       education: education,
  //     },
  //     success: function (res) {
  //       ds_giaovien = JSON.parse(res);
  //       for (var i = 0; i < ds_giaovien.length; i++) {
  //         if (ds_giaovien[i].MaGV === teacher_select.MaGV) {
  //           teacher_select = ds_giaovien[i];
  //           break;
  //         }
  //       }

  //       document.getElementById("teacher-name").textContent =
  //         teacher_select.TenGV;
  //       document.getElementById("teacher-gender").textContent =
  //         teacher_select.GioiTinh;
  //       document.getElementById("teacher-age").textContent = teacher_select.Tuoi;
  //       document.getElementById("teacher-id").textContent = teacher_select.MaGV;
  //       document.getElementById("teacher-qq").textContent =
  //         teacher_select.QueQuan;
  //       document.getElementById("teacher-address").textContent =
  //         teacher_select.DiaChi;
  //       document.getElementById("teacher-date").textContent = convertDateFormat(
  //         teacher_select.NgaySinh
  //       );
  //       document.getElementById("teacher-phone").textContent = teacher_select.SDT;
  //       document.getElementById("teacher-email").textContent =
  //         teacher_select.Email;
  //       document.getElementById("teacher-qualification").textContent =
  //         teacher_select.TrinhDo;

  //       var img = document.getElementById("img");

  //       if (teacher_select.GioiTinh == "Nam") {
  //         img.src = "../assets/images/Teacher-male-icon.png";
  //       } else {
  //         img.src = "../assets/images/Teacher-female-icon.png";
  //       }

  //       var text = document.getElementById("keyword").value;
  //       showTableTeacher(text, currentPage, collum, orderby);
  //     },
  //     error: function (xhr, status, error) {
  //       console.error(error);
  //     },
  //   });

  showSpinner();
  try {
    const response = await fetch(`${API_URL}/api/teacher/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: teacher_name,
        gender: gender,
        birthday: new Date(birthday).toISOString(),
        phone: phone_number,
        email: email,
        address: address,
        age: age,
      }),
    });

    if (response.status === 200) {
      const responseData = await response.json();
      console.log("responseData", responseData);
      await fetchTeacher();
      searchList(currentPage);

      for (var i = 0; i < ds_giaovien.length; i++) {
        if (ds_giaovien[i].id === teacher_select.id) {
          teacher_select = ds_giaovien[i];
          break;
        }
      }

      document.getElementById("teacher-name").textContent = teacher_select.name;
      document.getElementById("teacher-gender").textContent = getGender(
        teacher_select.gender
      );
      document.getElementById("teacher-age").textContent = teacher_select.age;
      document.getElementById("teacher-id").textContent = teacher_select.id;
      // document.getElementById("teacher-qq").textContent = teacher_select.a;
      document.getElementById("teacher-address").textContent =
        teacher_select.address;
      document.getElementById("teacher-date").textContent = formatDateFromISO(
        teacher_select.birthday
      );
      document.getElementById("teacher-phone").textContent =
        teacher_select.phone;
      document.getElementById("teacher-email").textContent =
        teacher_select.email;
      // document.getElementById("teacher-qualification").textContent =
      //   teacher_select.TrinhDo;

      var img = document.getElementById("img");

      if (teacher_select.gender == 1) {
        img.src = "../assets/images/Teacher-male-icon.png";
      } else {
        img.src = "../assets/images/Teacher-female-icon.png";
      }

      hideSpinner();
      ///

      ///
    }
  } catch (error) {
    console.error("api error", error);
    hideSpinner();
  }

  modalBgEdit.style.display = "none";
  document.querySelector(".update-success").style.display = "block";
  setTimeout(function () {
    document.querySelector(".update-success").style.display = "none";
  }, 1000);
});

//Thêm giáo viên
function setAge() {
  var inputDate = document.getElementById("birthday_add").value;
  var namHienTai = new Date().getFullYear();
  var namInput = new Date(inputDate).getFullYear();

  var age = namHienTai - namInput;
  document.getElementById("age_add").value = age;
}

function setAge2() {
  var inputDate = document.getElementById("birthday_edit").value;
  var namHienTai = new Date().getFullYear();
  var namInput = new Date(inputDate).getFullYear();

  var age = namHienTai - namInput;
  document.getElementById("age_edit").value = age;
}

const modalBgAdd = document.querySelector(".modal-bg-add");
const modalContentAdd = document.querySelector(".modal-content-add");

// Khi nhấn "thêm giáo viên"
document.querySelector(".add-teacher-button").addEventListener("click", () => {
  modalBgAdd.style.display = "block";
});
// Huy bo
document.querySelector(".cancle-btn-add").addEventListener("click", () => {
  modalBgAdd.style.display = "none";

  document.getElementById("phone_number_add").value = "";
  document.getElementById("email_add").value = "";
  document.getElementById("teacher_name_add").value = "";
  document.getElementById("age_add").value = "";
  document.getElementById("hometown_add").value = "";
  document.getElementById("address_add").value = "";
  document.getElementById("education_add").value = "";
  document.getElementById("birthday_add").value = "";
  document.getElementById("lb_name_add").textContent = "";

  document.getElementById("lb_birthday_add").textContent = "";
  document.getElementById("lb_hometown_add").textContent = "";
  document.getElementById("lb_address_add").textContent = "";
  document.getElementById("lb_education_add").textContent = "";
  document.getElementById("lb_phone_add").textContent = "";
  document.getElementById("lb_email_add").textContent = "";
});

// Khi nhấn Thêm
const submit_add = document.getElementById("add");
submit_add.addEventListener("click", async function (event) {
  var check = true;
  event.preventDefault();
  const phone_number = document.getElementById("phone_number_add").value;
  const email = document.getElementById("email_add").value;
  const teacher_name = document.getElementById("teacher_name_add").value;
  const age = document.getElementById("age_add").value;
  const hometown = document.getElementById("hometown_add").value;
  const address = document.getElementById("address_add").value;
  const education = document.getElementById("education_add").value;
  const birthday = document.getElementById("birthday_add").value;
  const gender = document.getElementById("gender_add").value;
  var erorr_empty = "*Dữ liệu không để trống";

  //Kiểm tra dữ liệu nhập vào

  if (!teacher_name) {
    document.getElementById("lb_name_add").textContent = erorr_empty;
    check = false;
  } else document.getElementById("lb_name_add").textContent = "";

  if (!birthday) {
    document.getElementById("lb_birthday_add").textContent = erorr_empty;
    check = false;
  } else document.getElementById("lb_birthday_add").textContent = "";

  //   if (!hometown) {
  //     document.getElementById("lb_hometown_add").textContent = erorr_empty;
  //     check = false;
  //   } else document.getElementById("lb_hometown_add").textContent = "";

  if (!address) {
    document.getElementById("lb_address_add").textContent = erorr_empty;
    check = false;
  } else document.getElementById("lb_address_add").textContent = "";
  //   if (!education) {
  //     document.getElementById("lb_education_add").textContent = erorr_empty;
  //     check = false;
  //   } else document.getElementById("lb_education_add").textContent = "";
  if (!/^(0[0-9]{9})$/.test(phone_number)) {
    document.getElementById("lb_phone_add").textContent =
      "*Số điện thoại không chính xác (0[0-9]; 10 chữ số)";
    check = false;
  } else document.getElementById("lb_phone_add").textContent = "";

  if (!/\S+@\S+\.\S+/.test(email)) {
    document.getElementById("lb_email_add").textContent =
      "*Email không chính xác (example@xxx.com)";
    check = false;
  } else document.getElementById("lb_email_add").textContent = "";

  if (!check) return;

  //   $.ajax({
  //     url: "../api/addTeacher.php",
  //     type: "POST",
  //     data: {
  //       name: teacher_name,
  //       gender: gender,
  //       date: birthday,
  //       age: age,
  //       address: address,
  //       phone: phone_number,
  //       email: email,
  //       hometown: hometown,
  //       education: education,
  //     },
  //     success: function (res) {
  //       ds_giaovien = JSON.parse(res);
  //       var text = document.getElementById("keyword").value;
  //       showTableTeacher(text, currentPage, collum, orderby);
  //     },
  //     error: function (xhr, status, error) {
  //       console.error(error);
  //     },
  //   });

  showSpinner();
  try {
    const response = await fetch(`${API_URL}/api/teacher`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userName: "giaovienx",
        password: "12345678",
        name: teacher_name,
        gender: gender,
        birthday: new Date(birthday).toISOString(),
        phone: phone_number,
        email: email,
        address: address,
        age: age,
      }),
    });

    if (response.status === 200) {
      const responseData = await response.json();
      console.log("responseData", responseData);
      await fetchTeacher();
      searchList(currentPage);

      hideSpinner();

      //
      document.getElementById("phone_number_add").value = "";
      document.getElementById("email_add").value = "";
      document.getElementById("teacher_name_add").value = "";
      document.getElementById("age_add").value = "";
      document.getElementById("hometown_add").value = "";
      document.getElementById("address_add").value = "";
      document.getElementById("education_add").value = "";
      document.getElementById("birthday_add").value = "";

      document.querySelector(".add-success").style.display = "block";

      setTimeout(function () {
        document.querySelector(".add-success").style.display = "none";
      }, 1000);
      //
    }
  } catch (error) {
    console.error("api error", error);
    hideSpinner();
  }
});

// Khi nhan nut Xoa
function deleteTeacher() {
  $.ajax({
    url: "../api/deleteTeacher.php",
    type: "POST",
    data: {
      id: teacher_select.MaGV,
    },
    success: function (res) {
      ds_giaovien = JSON.parse(res);
      var text = document.getElementById("keyword").value;
      showTableTeacher(text, currentPage, collum, orderby);
    },
    error: function (xhr, status, error) {
      console.error(error);
    },
  });

  //
  document.querySelector(".delete-ques2").style.display = "none";
  document.querySelector(".delete-ques").style.display = "none";
  document.getElementById("modal-ques").style.display = "none";

  document.getElementById("div-change-pass").style.display = "none";
  modalBg.style.display = "none";
  const paragraphs = document.getElementsByTagName("p");
  while (paragraphs.length > 0) {
    paragraphs[0].parentNode.removeChild(paragraphs[0]);
  }

  //
  document.querySelector(".delete-success").style.display = "block";
  setTimeout(function () {
    document.querySelector(".delete-success").style.display = "none";
  }, 1000);
}

document.getElementById("delete-button").addEventListener("click", () => {
  document.getElementById("modal-ques").style.display = "block";
  document.querySelector(".delete-ques").style.display = "block";
});

document.getElementById("delete-cancle").addEventListener("click", () => {
  document.querySelector(".delete-ques").style.display = "none";
  document.getElementById("modal-ques").style.display = "none";
});
document.getElementById("delete").addEventListener("click", function (event) {
  $.ajax({
    url: "../api/checkAccTeacher.php",
    type: "POST",
    data: {
      id: teacher_select.MaGV,
    },
    success: function (res) {
      if (res) {
        document.querySelector(".delete-ques").style.display = "none";
        document.querySelector(".delete-ques2").style.display = "block";
      } else {
        deleteTeacher();
      }
    },
    error: function (xhr, status, error) {
      console.error(error);
    },
  });
});

document.getElementById("delete-cancle2").addEventListener("click", () => {
  document.querySelector(".delete-ques2").style.display = "none";
  document.getElementById("modal-ques").style.display = "none";
});

/// xac nhan xoa
document.getElementById("delete2").addEventListener("click", function (event) {
  event.preventDefault();
  deleteTeacher();
});

// Open detail tab
document.getElementById("tab1").classList.add("show");

function openTab(evt, tabName) {
  var i, tabcontent, tablinks;

  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].classList.remove("show");
  }

  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].classList.remove("active");
  }

  document.getElementById(tabName).classList.add("show");
  evt.currentTarget.classList.add("active");
}

//  Tài khoản

function togglePassword() {
  var passwordInput = document.getElementById("password");
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
  } else {
    passwordInput.type = "password";
  }
}
// Đổi mật khẩu

document.getElementById("change-pass-btn").addEventListener("click", () => {
  document.getElementById("div-change-pass").style.display = "block";
});

document.getElementById("change").addEventListener("click", function (event) {
  event.preventDefault();

  var pass = document.getElementById("new-password").value;

  var username = document.getElementById("username-login").value;

  var err_pass = "";
  var err_username = "";
  var check = true;

  if (!pass) {
    err_pass = "*Bạn chưa nhập mật khẩu";
    check = false;
  }
  if (!username) {
    err_username = "*Bạn chưa nhập tên tài khoản";
    check = false;
  }

  document.getElementById("err-pass").textContent = err_pass;
  document.getElementById("err-username").textContent = err_username;

  if (!check) {
    return;
  }

  $.ajax({
    url: "../api/changeAccTeacher.php",
    type: "POST",
    data: {
      id: teacher_select.MaGV,
      username: username,
      pass: pass,
    },
    success: function (res) {
      ds_tk_gv = JSON.parse(res);

      for (var i = 0; i < ds_tk_gv.length; i++) {
        if (ds_tk_gv[i].MaGV === teacher_select.MaGV) {
          document.getElementById("name-login").textContent =
            ds_tk_gv[i]["UserName"];
          document.getElementById("username-login").value =
            ds_tk_gv[i]["UserName"];
          document.getElementById("password").value = ds_tk_gv[i]["Password"];
          document.getElementById("date_logup").textContent =
            "Ngày đăng ký  :  " + convertDateFormat(ds_tk_gv[i]["NgayDK"]);
          break;
        }
      }
    },
    error: function (xhr, status, error) {
      console.error(error);
    },
  });
  document.getElementById("div-change-pass").style.display = "none";
  document.querySelector(".change-pass-success").style.display = "block";

  setTimeout(function () {
    document.querySelector(".change-pass-success").style.display = "none";
    document.getElementById("err-pass").textContent = "";
    document.getElementById("err-username").textContent = "";
  }, 1000);
});

document.getElementById("cancle-change-pass").addEventListener("click", () => {
  document.getElementById("div-change-pass").style.display = "none";
  document.getElementById("err-pass").textContent = "";
  document.getElementById("err-username").textContent = "";
});

// sap xep

// sap xep bang

var sortDirection = {};

function sortTable(columnIndex) {
  var table = document.getElementById("table-1");
  var tbody = table.querySelector(".tbody-1");
  var rows = Array.from(tbody.getElementsByTagName("tr"));
  var sttValues = rows.map(function (row) {
    return parseInt(row.getElementsByTagName("td")[0].innerText.trim());
  });

  rows.sort(function (a, b) {
    var aValue = a.getElementsByTagName("td")[columnIndex].innerText.trim();
    var bValue = b.getElementsByTagName("td")[columnIndex].innerText.trim();

    if (columnIndex === 4 || columnIndex === 1) {
      var aValue = parseFloat(
        a.getElementsByTagName("td")[columnIndex].innerText.trim()
      );
      var bValue = parseFloat(
        b.getElementsByTagName("td")[columnIndex].innerText.trim()
      );

      if (sortDirection[columnIndex] === "asc") {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    } else {
      var aValue = a.getElementsByTagName("td")[columnIndex].innerText.trim();
      var bValue = b.getElementsByTagName("td")[columnIndex].innerText.trim();
      if (sortDirection[columnIndex] === "asc") {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    }
  });
  rows.forEach(function (row, index) {
    var sttCell = row.getElementsByTagName("td")[0];
    sttCell.innerText = sttValues[index];
  });

  rows.forEach(function (row) {
    tbody.appendChild(row);
  });

  if (sortDirection[columnIndex] === "asc") {
    sortDirection[columnIndex] = "desc";
    orderby = "desc";
  } else {
    sortDirection[columnIndex] = "asc";
    orderby = "asc";
  }
  //  var text = document.getElementById("keyword").value;
  //  showTableParent(text, currentPage, collum, orderby);

  updateSortIcon(columnIndex);

  //   if (columnIndex == 1) collum = "MaGV";
  //   else if (columnIndex == 2) collum = "TenGV";
  //   else if (columnIndex == 3) collum = "GioiTinh";
  //   else if (columnIndex == 4) collum = "Tuoi";
  //   else if (columnIndex == 5) collum = "DiaChi";

  //   if (sortDirection[columnIndex] === "asc") {
  //     sortDirection[columnIndex] = "desc";
  //     orderby = "desc";
  //   } else {
  //     sortDirection[columnIndex] = "asc";
  //     orderby = "asc";
  //   }
  //   var text = document.getElementById("keyword").value;
  //   showTableTeacher(text, currentPage, collum, orderby);

  //   updateSortIcon(columnIndex);
}

function removeSortIcons() {
  var table = document.getElementById("table-1");
  var headers = table.querySelectorAll("th");

  headers.forEach(function (header) {
    var icon = header.querySelector("img");
    if (icon) {
      header.removeChild(icon);
    }
  });
}

function updateSortIcon(columnIndex) {
  var table = document.getElementById("table-1");
  var headers = table.querySelectorAll("th");

  headers.forEach(function (header) {
    var icon = header.querySelector("img");
    if (icon) {
      header.removeChild(icon);
    }
  });

  var clickedHeader = headers[columnIndex];
  var sortIcon = document.createElement("img");
  sortIcon.src = "../assets/images/iconSort.png";
  sortIcon.style.width = "20px";
  sortIcon.style.backgroundColor = "white";
  sortIcon.style.borderRadius = "30px";
  if (sortDirection[columnIndex] === "desc") {
    sortIcon.style.transform = "rotate(180deg)";
  }
  clickedHeader.appendChild(sortIcon);
}
