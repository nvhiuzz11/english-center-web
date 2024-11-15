const CLASS_STATUS = {
  COMING: 1,
  ONGOING: 2,
  CLOSE: 3,
};

var countData;
var currentPage = 1;
var ds_hocsinh;
var ds_phuhuynh;

var selectedCenter = "";

var listCenter;

const accessToken = localStorage.getItem("accessToken");

const store_ds_hocsinh = localStorage.getItem("ds_hocsinh");
const store_ds_phuhuynh = localStorage.getItem("ds_phuhuynh");
if (store_ds_hocsinh) {
  ds_hocsinh = JSON.parse(store_ds_hocsinh);
  showTableStudent(ds_hocsinh, selectedCenter, "");
}
if (store_ds_phuhuynh) {
  ds_phuhuynh = JSON.parse(store_ds_phuhuynh);
}

listCenter = JSON.parse(localStorage.getItem("listCenter"));

fetchStudent();
fetchParent();

function showSpinner() {
  document.getElementById("loadingSpinner").style.display = "flex";
}

function hideSpinner() {
  document.getElementById("loadingSpinner").style.display = "none";
}

async function fetchStudent() {
  if (!ds_hocsinh) {
    showSpinner();
  }
  try {
    const res = await fetch(`${API_URL}/api/students`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (res.status === 200) {
      const resData = await res.json();
      console.log("resData", resData);
      ds_hocsinh = resData.docs;

      localStorage.setItem("ds_hocsinh", JSON.stringify(ds_hocsinh));

      countData = ds_hocsinh.length;

      showTableStudent(ds_hocsinh, selectedCenter, "");

      hideSpinner();
    }
  } catch (error) {
    hideSpinner();
    console.log("fetchStudent error", error);
  }
}

async function fetchParent() {
  try {
    const res = await fetch(`${API_URL}/api/parents`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (res.status === 200) {
      const resData = await res.json();

      ds_phuhuynh = resData.docs;

      localStorage.setItem("ds_phuhuynh", JSON.stringify(ds_phuhuynh));

      console.log("ds_phuhuynh", ds_phuhuynh);
    }
  } catch (error) {
    console.log("fetchStudent error", error);
  }
}

fetchCenter();

async function fetchCenter() {
  fetch(`${API_URL}/api/centers?includeClass=true`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      listCenter = data.docs;

      var select1 = document.getElementById("select-center");

      listCenter.forEach((center) => {
        const option = document.createElement("option");
        option.value = center.id;
        option.text = `Cơ sở ${center.id}: ${center.name}`;

        select1.appendChild(option);
      });

      localStorage.setItem("listCenter", JSON.stringify(listCenter));
    })
    .catch((error) => {
      console.log("Error:", error);
    });
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

function getCenterNameById(id) {
  if (!listCenter) return "";
  else {
    const center = listCenter.find((center) => center.id === id);
    return center ? center.name : "";
  }
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

function showTableStudent(list, center, text) {
  let i = 1;

  const tableBody = document.querySelector(".tbody-1");
  tableBody.innerHTML = "";

  if (center) {
    list = list.filter((student) =>
      student?.classes.some((classItem) => classItem.centerId == center)
    );
  }

  if (!list || list.length == 0) {
    tableBody.innerHTML += `<h2>Không tìm thấy kết quả phù hợp!</h2>`;
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

var selectCenter = document.getElementById("select-center");

selectCenter.addEventListener("change", function () {
  selectedCenter = selectCenter.value;
  searchList(1);
});

// tim kiem
function searchKey(keyword) {
  const lowerKeyword = keyword.toLowerCase();
  return ds_hocsinh.filter((item) => {
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
  showTableStudent(listSearch, selectedCenter, text);
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

  //currentPage = pageNumber;
  //   var text = document.getElementById("keyword").value;
  searchList(pageNumber);
  var table = document.querySelector(".tbody-1");
  table.scrollTo({ top: table.offsetTop, behavior: "smooth" });
}

function checkAttendance(studentID, attendances) {
  let attendedCount = 0;
  let missedCount = 0;
  if (attendances != null) {
    attendances.forEach((attendance) => {
      if (attendance.studentIds.includes(studentID)) {
        attendedCount++;
        missedCount++;
      }
    });
  }

  return {
    attended: attendedCount,
    missed: missedCount,
  };
}

document.getElementById("cancle-change-pass").addEventListener("click", () => {
  document.getElementById("div-change-pass").style.display = "none";
  document.getElementById("err-pass").textContent = "";
  document.getElementById("new-password").value = "";
});

const rows = document.querySelectorAll(".tbody-1 tr");
const modalBg = document.querySelector(".modal-bg");
const modalContent = document.querySelector(".modal-content");

var stt_select;

var classes = [];
var student_select;
var dsph_lk = [];
var maPH_delete;
// khi nhấn vào 1 hàng , hiển thị thông tin chi tiêt
document.querySelector(".tbody-1").addEventListener("click", function (event) {
  if (event.target.tagName === "TD") {
    stt_select = event.target.parentNode.cells[1].textContent;

    for (var i = 0; i < ds_hocsinh.length; i++) {
      if (stt_select == ds_hocsinh[i].id) student_select = ds_hocsinh[i];
    }

    console.log("student_select", student_select);

    // lay tt phu huynh
    var phhs = student_select.parents;

    // var j = 0;
    // for (var i = 0; i < ds_ph_hs.length; i++) {
    //   if (ds_ph_hs[i].MaHS === student_select.MaHS) {
    //     phhs[j++] = ds_ph_hs[i].TenPH;
    //   }
    // }

    document.getElementById("Student-name").textContent = student_select.name;
    document.getElementById("Student-gender").textContent = getGender(
      student_select.gender
    );
    document.getElementById("Student-age").textContent = student_select.age;

    document.getElementById("Student-id").textContent = student_select.id;
    document.getElementById("Student-address").textContent =
      student_select.address;
    document.getElementById("Student-date").textContent = formatDateFromISO(
      student_select.birthday
    );
    document.getElementById("Student-phone").textContent = student_select.phone;
    document.getElementById("Student-email").textContent = student_select.email;

    phhs.forEach(function (parent) {
      const pTag = document.createElement("p");
      pTag.innerText = parent.name;
      const tdTag = document.getElementById("Student-parent");
      tdTag.appendChild(pTag);
    });

    // document.getElementById('Student-parent').textContent =

    var img = document.getElementById("img");

    if (student_select.gender == 1) {
      img.src = "../assets/images/Student-male-icon.png";
    } else {
      img.src = "../assets/images/Student-female-icon.png";
    }

    document.getElementById("tab1").classList.add("show");
    document.getElementById("tab2").classList.remove("show");
    document.getElementById("tab3").classList.remove("show");
    document.getElementById("tab4").classList.remove("show");
    document.getElementById("tb1").classList.add("active");
    document.getElementById("tb2").classList.remove("active");
    document.getElementById("tb3").classList.remove("active");
    document.getElementById("tb4").classList.remove("active");

    // thong tin lop cua hoc vien
    classes = student_select.classes;
    // var k = 0;
    // for (var i = 0; i < ds_hs_lop.length; i++) {
    //   if (ds_hs_lop[i].MaHS === student_select.MaHS) {
    //     classes[k++] = ds_hs_lop[i];
    //   }
    // }

    var html = "";
    var color = "";
    console.log("classes lg", classes.length);
    if (classes.length == 0) {
      html += "<p>Học sinh chưa tham gia lớp học nào </p>";
    } else {
      html += "<p> Số lớp đã tham gia: " + classes.length + "</p>";

      classes.forEach((item) => {
        if (item.status == CLASS_STATUS.ONGOING) {
          color = "#00c608";
        } else if (item.status == CLASS_STATUS.COMING) {
          color = "#ad9d0b";
        } else {
          color = "#ad0b0b";
        }

        const attendance = checkAttendance(student_select.id, item.attendances);

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
          " (Vắng : " +
          attendance.missed +
          ") </p>" +
          "</td>" +
          "</tr>" +
          "<tr>" +
          "<td>" +
          '<p id="name-class">Tên lớp học:  ' +
          item.name +
          "</p>" +
          "</td>" +
          "<td>" +
          '<p id="name =name-teacher">Tên giáo viên:  ' +
          item?.teachers[0]?.name +
          "</p>" +
          "</td>" +
          "</tr>" +
          "<tr>" +
          "<td>" +
          '<p id="fee-class">Học phí:  ' +
          formatMoney(item.fee) +
          "/buổi" +
          "</p>" +
          "</td>" +
          "<td>" +
          '<p id="de-fee-class">Giảm học phí:  ';
        if (item.StudentClasses.reducePercent != null) {
          html += item.StudentClasses.reducePercent;
        } else {
          html += 0;
        }

        html +=
          " %" +
          "</p>" +
          "</td>" +
          "</tr>" +
          "<tr>" +
          "<td>" +
          "<p >Cơ sở: " +
          getCenterNameById(item.centerId) +
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
    }

    document.querySelector(".class-of-student").innerHTML = html;

    // // thong tin tai khoan

    document.getElementById("name-login").textContent =
      student_select.user.userName;
    document.getElementById("username-login").value =
      student_select.user.userName;
    document.getElementById("date_logup").textContent =
      "Ngày đăng ký  :  " + formatDateFromISO(student_select.createdAt);
    // for (var i = 0; i < ds_tk_hs.length; i++) {
    //   if (ds_tk_hs[i].MaHS === student_select.MaHS) {
    //     ds_tk_hs[i]["UserName"];
    //     document.getElementById("username-login").value =
    //       ds_tk_hs[i]["UserName"];
    //     document.getElementById("password").value = ds_tk_hs[i]["Password"];

    //     break;
    //   }
    // }

    showParent();

    modalBg.style.display = "block";
  }
});

function showParent() {
  //thong tin phu huynh cua hoc sinh
  var parents = student_select.parents;
  var k = 0,
    j = 0;

  dsph_lk = ds_phuhuynh;

  var html = "";

  if (parents.length === "0") {
    html += "<p> Học sinh này chưa liên kết với phụ huynh</p>";
  } else {
    html += "<p> Số phụ huynh liên kết : " + parents.length + "</p>";

    parents.forEach((item) => {
      dsph_lk = dsph_lk.filter((phuhuynh) => phuhuynh.id != item.id);

      html +=
        '<div class="parent">' +
        "<p></p>" +
        "<table>" +
        "<td>" +
        "<p ><strong> Mã phụ huynh :</strong>" +
        "   " +
        item.id +
        "</p>" +
        "</td>" +
        "<td>" +
        '<button  class="delete-button" data-maph="' +
        item.id +
        '" style=" float: right ;background-color: cadetblue;"> Xóa' +
        "</td>" +
        "<tr>" +
        "<td>" +
        "<p ><strong> Họ tên :</strong>" +
        "   " +
        item.name +
        "</p>" +
        "</td>" +
        "<td>" +
        "<p ><strong> Tuổi :</strong>" +
        "   " +
        item.age +
        "</p>" +
        "</td>" +
        "</tr>" +
        "<tr>" +
        "<td>" +
        "<p ><strong> Giới tính :</strong>" +
        "   " +
        getGender(item.gender) +
        "</p>" +
        "</td>" +
        "<td>" +
        "<p ><strong> Ngày sinh :</strong>" +
        "   " +
        formatDateFromISO(item.birthday) +
        "</p>" +
        "</td>" +
        "</tr>" +
        "<tr>" +
        "<td>" +
        "<p ><strong>Số điện thoại :</strong>" +
        "   " +
        (item.phone !== null ? item.phone : "") +
        "</p>" +
        "</td>" +
        "<td>" +
        "<p ><strong>Email :</strong>" +
        "   " +
        (item.email !== null ? item.email : "") +
        "</p>" +
        "</td>" +
        "</tr>" +
        "</table>" +
        "</div>";
    });

    document.querySelector("#parent-infor").innerHTML = html;
  }

  const selectElement = document.getElementById("select-parent");
  const options = selectElement.querySelectorAll("option:not(:first-child)");

  options.forEach((option) => {
    option.remove();
  });

  dsph_lk.forEach((parent) => {
    const option = document.createElement("option");
    option.value = parent.id;
    option.textContent = `${parent.id}. ${parent.name} - ${parent.age} tuổi`;
    document.getElementById("select-parent").appendChild(option);
  });

  /// xoa lien ket

  document.querySelectorAll(".delete-button").forEach((button) => {
    button.addEventListener("click", function (event) {
      maPH_delete = event.target.dataset.maph;

      ds_phuhuynh.forEach((phuHuynh) => {
        if (phuHuynh.MaPH == maPH_delete) {
          document.getElementById("txt-quest-link").textContent =
            "Bạn chắc chắn muốn xóa liên kết phụ huynh " +
            maPH_delete +
            "." +
            phuHuynh.TenPH;
        }
      });

      document.getElementById("modal-ques-link").style.display = "block";
      document.querySelector(".delete-ques-link").style.display = "block";
    });
  });
}
// xoa lien ket
document.getElementById("delete-cancle-link").addEventListener("click", () => {
  document.getElementById("modal-ques-link").style.display = "none";
  document.querySelector(".delete-ques-link").style.display = "none";
});

document.getElementById("delete-link").addEventListener("click", async () => {
  showSpinner();
  try {
    const response = await fetch(`${API_URL}/api/admin-remove-connect`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        studentId: student_select.id,
        parentId: maPH_delete,
      }),
    });

    if (response.status === 200) {
      await fetchStudent();

      for (var i = 0; i < ds_hocsinh.length; i++) {
        if (ds_hocsinh[i].id === student_select.id) {
          student_select = ds_hocsinh[i];
          break;
        }
      }
      showParent();
      hideSpinner();
    }
  } catch (error) {
    console.error("api error", error);
    hideSpinner();
  }

  document.getElementById("modal-ques-link").style.display = "none";
  document.querySelector(".delete-ques-link").style.display = "none";

  document.querySelector(".delete-success").style.display = "block";
  setTimeout(function () {
    document.querySelector(".delete-success").style.display = "none";
  }, 1000);
});

document.querySelector(".close-btn").addEventListener("click", () => {
  document.getElementById("div-change-pass").style.display = "none";

  modalBg.style.display = "none";
  document.getElementById("err-pass").textContent = "";
  document.getElementById("err-username").textContent = "";

  const paragraphs = document.getElementsByTagName("p");
  while (paragraphs.length > 0) {
    paragraphs[0].parentNode.removeChild(paragraphs[0]);
  }
  document.querySelector(".class-of-student").innerHTML = "";
});

const editButton = document.getElementById("edit-button");
// const tdList = document.querySelectorAll('td[contenteditable]');

const modalBgEdit = document.querySelector(".modal-bg-edit");
const modalContentEdit = document.querySelector(".modal-content-edit");

// Khi  nhấn vào nút "Sửa"
editButton.addEventListener("click", () => {
  document.getElementById("lb_phone_edit").textContent = "";
  document.getElementById("lb_email_edit").textContent = "";
  document.getElementById("lb_name_edit").textContent = "";

  document.getElementById("lb_address_edit").textContent = "";
  document.getElementById("lb_birthday_edit").textContent = "";

  modalBgEdit.style.display = "block";

  document.getElementById("sudent_name_edit").value = student_select.name;

  var gt = student_select.gender;
  var selectTag = document.getElementById("gender_edit");
  for (var i = 0; i < selectTag.options.length; i++) {
    if (selectTag.options[i].value == gt) {
      selectTag.options[i].selected = true;
      break;
    }
  }

  setDateInput("birthday_edit", student_select.birthday);

  document.getElementById("age_edit").value = student_select.age;
  document.getElementById("Student-id_edit").textContent =
    "Mã Học sinh : " + student_select.id;
  document.getElementById("address_edit").value = student_select.address;
  document.getElementById("phone_number_edit").value = student_select.phone;
  document.getElementById("email_edit").value = student_select.email;
  // document.getElementById('education_edit').value = student_select.TrinhDo;
  document.getElementById("id_edit").value = student_select.id;
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
  const Student_name = document.getElementById("sudent_name_edit").value;
  const age = document.getElementById("age_edit").value;
  const address = document.getElementById("address_edit").value;
  const birthday = document.getElementById("birthday_edit").value;

  var erorr_empty = "*Dữ liệu không để trống";

  //Kiểm tra dữ liệu nhập vào
  if (!Student_name) {
    document.getElementById("lb_name_edit").textContent = erorr_empty;
    check = false;
  } else document.getElementById("lb_name_edit").textContent = "";

  if (!birthday) {
    document.getElementById("lb_birthday_edit").textContent = erorr_empty;
    check = false;
  } else document.getElementById("lb_birthday_edit").textContent = "";

  if (!address) {
    document.getElementById("lb_address_edit").textContent = erorr_empty;
    check = false;
  } else document.getElementById("lb_address_edit").textContent = "";

  if (!/^(0[0-9]{9})$/.test(phone_number) && phone_number) {
    document.getElementById("lb_phone_edit").textContent =
      "*Số điện thoại không chính xác (0..; 10 chữ số)";
    check = false;
  } else document.getElementById("lb_phone_edit").textContent = "";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email) {
    document.getElementById("lb_email_edit").textContent =
      "*Email không chính xác";
    check = false;
  } else document.getElementById("lb_email_edit").textContent = "";

  if (!check) return;

  showSpinner();
  try {
    const response = await fetch(
      `${API_URL}/api/student-detail-by-admin/${id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: Student_name,
          gender: gender,
          birthday: new Date(birthday).toISOString(),
          phone: phone_number,
          email: email,
          address: address,
          age: age,
        }),
      }
    );

    if (response.status === 200) {
      const responseData = await response.json();
      console.log("responseData", responseData);
      await fetchStudent();
      searchList(currentPage);

      for (var i = 0; i < ds_hocsinh.length; i++) {
        if (ds_hocsinh[i].id === student_select.id) {
          student_select = ds_hocsinh[i];
          break;
        }
      }

      document.getElementById("Student-name").textContent = student_select.name;
      document.getElementById("Student-gender").textContent = getGender(
        student_select.gender
      );
      document.getElementById("Student-age").textContent = student_select.age;

      document.getElementById("Student-id").textContent = student_select.id;
      document.getElementById("Student-address").textContent =
        student_select.address;
      document.getElementById("Student-date").textContent = formatDateFromISO(
        student_select.birthday
      );
      document.getElementById("Student-phone").textContent =
        student_select.phone;
      document.getElementById("Student-email").textContent =
        student_select.email;

      var img = document.getElementById("img");

      if (student_select.gender == 1) {
        img.src = "../assets/images/Student-male-icon.png";
      } else {
        img.src = "../assets/images/Student-female-icon.png";
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

// Khi nhan nut Xoa

async function deleteStudent() {
  $.ajax({
    url: "../api/deleteStudent.php",
    type: "POST",
    data: {
      id: student_select.MaHS,
    },
    success: function (res) {
      ds_hocsinh = JSON.parse(res);
      var text = document.getElementById("keyword").value;
      showTableStudent(text, currentPage, collum, orderby);
    },
    error: function (xhr, status, error) {
      console.error(error);
    },
  });

  //   showSpinner();
  //   try {
  //     const response = await fetch(
  //       `${API_URL}/api/student-detail-by-admin/${id}`,
  //       {
  //         method: "PUT",
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           name: Student_name,
  //           gender: gender,
  //           birthday: new Date(birthday).toISOString(),
  //           phone: phone_number,
  //           email: email,
  //           address: address,
  //           age: age,
  //         }),
  //       }
  //     );

  //     if (response.status === 200) {
  //       const responseData = await response.json();
  //       console.log("responseData", responseData);
  //       await fetchStudent();
  //       searchList(currentPage);

  //       for (var i = 0; i < ds_hocsinh.length; i++) {
  //         if (ds_hocsinh[i].id === student_select.id) {
  //           student_select = ds_hocsinh[i];
  //           break;
  //         }
  //       }

  //       document.getElementById("Student-name").textContent = student_select.name;
  //       document.getElementById("Student-gender").textContent = getGender(
  //         student_select.gender
  //       );
  //       document.getElementById("Student-age").textContent = student_select.age;

  //       document.getElementById("Student-id").textContent = student_select.id;
  //       document.getElementById("Student-address").textContent =
  //         student_select.address;
  //       document.getElementById("Student-date").textContent = formatDateFromISO(
  //         student_select.birthday
  //       );
  //       document.getElementById("Student-phone").textContent =
  //         student_select.phone;
  //       document.getElementById("Student-email").textContent =
  //         student_select.email;

  //       var img = document.getElementById("img");

  //       if (student_select.gender == 1) {
  //         img.src = "../assets/images/Student-male-icon.png";
  //       } else {
  //         img.src = "../assets/images/Student-female-icon.png";
  //       }

  //       hideSpinner();
  //       ///

  //       ///
  //     }
  //   } catch (error) {
  //     console.error("api error", error);
  //     hideSpinner();
  //   }

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
  document.querySelector(".class-of-student").innerHTML = "";

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
    url: "../api/checkAccStudent.php",
    type: "POST",
    data: {
      id: student_select.MaHS,
    },
    success: function (res) {
      if (res) {
        document.querySelector(".delete-ques").style.display = "none";
        document.querySelector(".delete-ques2").style.display = "block";
      } else {
        deleteStudent();
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
  deleteStudent();
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

document
  .getElementById("change")
  .addEventListener("click", async function (event) {
    event.preventDefault();
    var pass = document.getElementById("new-password").value;

    var username = document.getElementById("username-login").value;

    var err_pass = "";
    var err_username = "";
    var check = true;

    if (!pass) {
      err_pass = "*Bạn chưa nhập mật khẩu";
      check = false;
    } else if (pass.length < 8) {
      err_pass = "*Mật khẩu cần ít nhất 8 ký tự";
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

    showSpinner();
    try {
      const response = await fetch(
        `${API_URL}/api/user-password-by-admin/${student_select.userId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password: pass,
          }),
        }
      );

      if (response.status === 200) {
        hideSpinner();

        document.getElementById("new-password").value = "";
        document.getElementById("div-change-pass").style.display = "none";
        document.querySelector(".change-pass-success").style.display = "block";

        setTimeout(function () {
          document.querySelector(".change-pass-success").style.display = "none";
          document.getElementById("err-pass").textContent = "";
          document.getElementById("err-username").textContent = "";
        }, 1000);
      }
    } catch (error) {
      console.error("api error", error);
      hideSpinner();
    }
  });

document.getElementById("cancle-change-pass").addEventListener("click", () => {
  document.getElementById("div-change-pass").style.display = "none";
  document.getElementById("err-pass").textContent = "";
  document.getElementById("err-username").textContent = "";
});

var sortDirection = {};

function sortTable(columnIndex) {
  //   if (columnIndex == 1) collum = "MaHS";
  //   else if (columnIndex == 2) collum = "TenHS";
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
  //   showTableStudent(text, currentPage, collum, orderby);

  //   updateSortIcon(columnIndex);

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

// them hoc sinh

document.querySelector(".add-student-button").addEventListener("click", () => {
  document.querySelector(".modal-bg-add").style.display = "block";
});

document.querySelector(".cancle-btn-add").addEventListener("click", () => {
  document.querySelector(".modal-bg-add").style.display = "none";
  document.querySelector(".parent_add").selectedIndex = 0;

  document.getElementById("phone_number_add").value = "";
  document.getElementById("email_add").value = "";
  document.getElementById("student_name_add").value = "";
  document.getElementById("age_add").value = "";

  document.getElementById("address_add").value = "";
  document.getElementById("birthday_add").value = "";

  const parentContainer = document.getElementById("parentContainer");
  while (parentContainer.firstChild) {
    parentContainer.removeChild(parentContainer.firstChild);
  }
  document.getElementById("lb_name_add").textContent = "";
  document.getElementById("lb_birthday_add").textContent = "";

  document.getElementById("lb_address_add").textContent = "";
  document.getElementById("lb_phone_add").textContent = "";
  document.getElementById("lb_email_add").textContent = "";
});

document
  .getElementById("add")
  .addEventListener("click", async function (event) {
    var check = true;

    event.preventDefault();
    const phone_number = document.getElementById("phone_number_add").value;
    const email = document.getElementById("email_add").value;
    const name = document.getElementById("student_name_add").value;
    const age = document.getElementById("age_add").value;
    const gender = document.getElementById("gender_add").value;

    const address = document.getElementById("address_add").value;

    const birthday = document.getElementById("birthday_add").value;

    console.log(gender);

    var erorr_empty = "*Dữ liệu không để trống";

    //Kiểm tra dữ liệu nhập vào

    if (!name) {
      document.getElementById("lb_name_add").textContent =
        "Tên học sinh không được để trống";
      check = false;
    } else document.getElementById("lb_name_add").textContent = "";

    if (!birthday) {
      document.getElementById("lb_birthday_add").textContent =
        "Ngày sinh không được để trống";
      check = false;
    } else document.getElementById("lb_birthday_add").textContent = "";

    if (!address) {
      document.getElementById("lb_address_add").textContent =
        "Địa chỉ không được để trống";
      check = false;
    } else document.getElementById("lb_address_add").textContent = "";

    if (!/^(0[0-9]{9})$/.test(phone_number) && phone_number) {
      document.getElementById("lb_phone_add").textContent =
        "Định dạng số điện thoại không đúng";
      check = false;
    } else document.getElementById("lb_phone_add").textContent = "";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email) {
      document.getElementById("lb_email_add").textContent =
        "Định dạng email không đúng";
      check = false;
    } else document.getElementById("lb_email_add").textContent = "";

    if (!check) return;

    showSpinner();
    try {
      const response = await fetch(`${API_URL}/api/student`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: "hocsinhxx",
          password: "12345678",
          name: name,
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
        await fetchStudent();
        searchList(currentPage);

        hideSpinner();

        //
        document.getElementById("phone_number_add").value = "";
        document.getElementById("email_add").value = "";
        document.getElementById("student_name_add").value = "";
        document.getElementById("age_add").value = "";
        document.getElementById("address_add").value = "";
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

function addParent() {
  const parentContainer = document.getElementById("parentContainer");
  const newParent = document.createElement("div");
  newParent.classList.add("parent");
  newParent.style.padding = 0;
  newParent.innerHTML = `
      <select name="parent_add" class="parent_add" style="width: 50%;">
        <option value="">Chọn phụ huynh</option>
      </select>
      <button class="removeBtn"  style="background-color: lightcoral;" onclick="removeParent(this)">-</button>
    `;

  parentContainer.appendChild(newParent);

  const newSelect = newParent.querySelector(".parent_add");

  // Điền dữ liệu về phụ huynh vào select
  ds_phuhuynh.forEach((phuHuynh) => {
    const option = document.createElement("option");
    option.value = phuHuynh.MaPH;
    option.textContent = `${phuHuynh.MaPH}. ${phuHuynh.TenPH} - ${phuHuynh.Tuoi} tuổi`;
    newSelect.appendChild(option);
  });
}

function removeParent(btn) {
  const parentToRemove = btn.parentNode;
  const parentContainer = document.getElementById("parentContainer");
  parentContainer.removeChild(parentToRemove);
}

///////////////// them lien kett phu huynh
document.getElementById("add-parent").addEventListener("click", () => {
  document.getElementById("modal-add-link").style.display = "block";
});

function removeParent2(btn) {
  const parentToRemove = btn.parentNode;
  const parentContainer = document.getElementById("parentContainer2");
  parentContainer.removeChild(parentToRemove);
}

function addLinkParent() {
  const parentContainer = document.getElementById("parentContainer2");
  const newParent = document.createElement("div");
  newParent.classList.add("parent2");
  newParent.style.padding = 0;
  newParent.innerHTML = `
      <select name="parent_add2" class="parent_add2" style="width: 60%;" required>
        <option value="">Chọn phụ huynh</option>
      </select>
      <button class="removeBtn"  style="background-color: lightcoral;" onclick="removeParent2(this)">-</button>
    `;

  parentContainer.appendChild(newParent);

  const newSelect = newParent.querySelector(".parent_add2");

  dsph_lk.forEach((parent) => {
    const option = document.createElement("option");
    option.value = parent.id;
    option.textContent = `${parent.id}. ${parent.name} - ${parent.age} tuổi`;
    newSelect.appendChild(option);
  });
}

document.getElementById("btn-cancle-link").addEventListener("click", () => {
  document.getElementById("modal-add-link").style.display = "none";
  document.querySelector(".parent_add2").selectedIndex = 0;

  const parentContainer = document.getElementById("parentContainer2");
  while (parentContainer.firstChild) {
    parentContainer.removeChild(parentContainer.firstChild);
  }
});

document.getElementById("btn-add-link").addEventListener("click", async () => {
  const selects = document.querySelectorAll(".parent_add2");
  const selectedValues = [];
  const seenValues = {};

  selects.forEach((select) => {
    const selectedOption = select.options[select.selectedIndex];
    if (selectedOption.value != "") {
      if (!seenValues[selectedOption.value]) {
        seenValues[selectedOption.value] = true;
        selectedValues.push(selectedOption.value);
      }
    }
  });

  console.log("selectedValues", selectedValues);
  showSpinner();

  try {
    const promises = selectedValues.map((value) => {
      return fetch(`${API_URL}/api/admin-create-connect`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId: student_select.id,
          parentId: Number(value),
        }),
      });
    });

    const responses = await Promise.all(promises);
    const allSuccess = responses.every((response) => response.status === 200);
    if (allSuccess) {
      await fetchStudent();
      searchList(currentPage);

      for (var i = 0; i < ds_hocsinh.length; i++) {
        if (ds_hocsinh[i].id === student_select.id) {
          student_select = ds_hocsinh[i];
          break;
        }
      }

      showParent();

      document.getElementById("modal-add-link").style.display = "none";

      document.querySelector(".parent_add2").selectedIndex = 0;

      const parentContainer = document.getElementById("parentContainer2");
      while (parentContainer.firstChild) {
        parentContainer.removeChild(parentContainer.firstChild);
      }

      document.getElementById("noti-add-link").style.display = "block";

      setTimeout(function () {
        document.getElementById("noti-add-link").style.display = "none";
      }, 1000);
    }
  } catch (error) {
    console.log("Error:", error);
  }
});
