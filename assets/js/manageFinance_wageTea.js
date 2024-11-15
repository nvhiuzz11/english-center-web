const CostType = {
  TeacherSalary: 1,
  StudentFee: 2,
  ElecFee: 3,
  WaterFee: 4,
  OtherFee: 5,
};

const CostStatus = {
  Pending: 1,
  Done: 2,
  Debt: 3,
};

var countData;
var currentPage = 1;
var dsHoaDon;

var selectedStatus = "";
var dateFilter = "";

const accessToken = localStorage.getItem("accessToken");

const store_ds_hoadon_luong = localStorage.getItem("ds_hoadon_luong");
if (store_ds_hoadon_luong) {
  dsHoaDon = JSON.parse(store_ds_hoadon_luong);
  console.log("store_ds_hoadon_luong", dsHoaDon);
  hienthids(selectedStatus, dsHoaDon, currentPage, dateFilter);
}

fetchCost();

var ds_giaovien;

const store_ds_giaovien = localStorage.getItem("ds_giaovien");
if (store_ds_giaovien) {
  ds_giaovien = JSON.parse(store_ds_giaovien);
}
fetchTeacher();

async function fetchTeacher() {
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

      var select = document.getElementById("bill-teacher-add-ps");

      ds_giaovien.forEach((item) => {
        const option = document.createElement("option");
        option.value = item.id;
        option.text = `${item.id}. ${item.name}`;
        select.appendChild(option);
      });

      localStorage.setItem("ds_giaovien", JSON.stringify(ds_giaovien));

      hideSpinner();
    }
  } catch (error) {
    hideSpinner();
    console.log("fetchTeacher error", error);
  }
}

function showSpinner() {
  document.getElementById("loadingSpinner").style.display = "flex";
}

function hideSpinner() {
  document.getElementById("loadingSpinner").style.display = "none";
}

async function fetchCost() {
  if (!dsHoaDon) {
    showSpinner();
  }
  try {
    const res = await fetch(`${API_URL}/api/costs?multipleType=1;6`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (res.status === 200) {
      const resData = await res.json();
      console.log("resData", resData);
      dsHoaDon = resData.docs;
      countData = dsHoaDon.length;

      localStorage.setItem("ds_hoadon_luong", JSON.stringify(dsHoaDon));

      hienthids(selectedStatus, dsHoaDon, currentPage, dateFilter);

      hideSpinner();
    }
  } catch (error) {
    hideSpinner();
    console.log("fetchCost error", error);
  }
}

function getGender(gender) {
  if (gender == 1) {
    return "Nam";
  } else {
    return "Nữ";
  }
}
function getCostStatus(status) {
  if (status == CostStatus.Pending) {
    return "Chưa thanh toán";
  } else if (status == CostStatus.Done) {
    return "Đã thanh toán";
  }
}

function getRecordByPage(list, page, pageSize = 50) {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  return list.slice(startIndex, endIndex);
}

function formatDateFromISO(isoString) {
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

function convertDateFormat(dateString) {
  var dateParts = dateString.split("-");
  var formattedDate = dateParts[2] + "-" + dateParts[1] + "-" + dateParts[0];
  return formattedDate;
}

function parseCustomDateFormat(dateString, format) {
  var parts = dateString.split("-");
  if (parts.length !== 3) return NaN;

  var day = parseInt(parts[0], 10);
  var month = parseInt(parts[1], 10) - 1;
  var year = parseInt(parts[2], 10);

  return new Date(year, month, day);
}

function formatMoney(number) {
  return Number(number).toLocaleString("en-US", {
    maximumFractionDigits: 2,
  });
}

// Mặc định hiển thị tab đầu tiên
document.getElementById("Tab1").style.display = "block";
document.getElementById("btn-tab2").classList.add("active");

document.getElementById("Tab1-add").style.display = "block";
document.getElementById("btn-tab1-add").classList.add("active");

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
//Hiẹn thị bảng

function hienthids(status, listData, page, date) {
  document.querySelector(".tbody-1").innerHTML = "";
  document.querySelector(".tbody-5").innerHTML = "";
  var filteredData = listData;
  if (status !== "") {
    filteredData = filteredData.filter(function (item) {
      return item.status == status;
    });
  }

  if (date != "") {
    filteredData = filteredData.filter(function (item) {
      let thang1 = item.forMonth;
      let nam1 = item.forYear;

      let thang2 = parseInt(date.split("-")[1], 10);

      let nam2 = date.split("-")[0];

      return thang1 == thang2 && nam1 == nam2;
      //return hoaDon['TrangThai'] === status;
    });
  }

  if (filteredData.length == 0) {
    document.querySelector(".tbody-1").innerHTML = "Không có dữ liệu phù hợp !";
  }

  var html = "";
  var html_last = "";
  var color = "";
  var tongSoTien = 0;
  var tienChuaTT = 0;
  var tienDaTT = 0;
  var dem1 = 0;
  var dem0 = 0;
  if (filteredData.length != 0) {
    showindex(filteredData.length);
    const listItem = getRecordByPage(filteredData, page, 50);
    let i = 1;

    listItem.filter((item) => {
      if (item.status === CostStatus.Done) {
        color = "lightgreen";
        tienDaTT += parseInt(item.totalMoney);
        dem1++;
      } else if (item.status === CostStatus.Pending) {
        color = "#ff9393";
        tienChuaTT += parseInt(item.totalMoney);
        dem0++;
      }

      html += '<tr onclick="handleRowClick(' + item.id + ')">';
      html +=
        '<td style="width:20px ;background-color:' +
        color +
        '">' +
        i++ +
        "</td>";
      html +=
        '<td style = "background-color:' + color + '">' + item.id + "</td>";
      html +=
        '<td style = "background-color:' + color + '">' + item.name + "</td>";
      html +=
        '<td style = "background-color:' +
        color +
        '">' +
        item.teacher.id +
        "</td>";
      html +=
        '<td style = "background-color:' +
        color +
        '">' +
        item.teacher.name +
        "</td>";
      html += '<td style = "background-color:' + color + '">';
      if (item?.teachedInfo) {
        item.teachedInfo.forEach((info) => {
          html += info.class.code;
          html += "<br/>";
        });
      }

      html += "</td>";
      html +=
        '<td style = "background-color:' +
        color +
        '">' +
        `${item.forMonth}/${item.forYear}` +
        "</td>";
      html +=
        '<td style = "background-color:' +
        color +
        '">' +
        formatMoney(item.totalMoney) +
        "</td>";

      if (item.status == CostStatus.Done) {
        html +=
          '<td style = "background-color:' +
          color +
          '">' +
          formatDateFromISO(item.paidAt) +
          "</td>";
      } else {
        html += '<td style = "background-color:' + color + '">' + "" + "</td>";
      }

      html +=
        '<td style = "background-color:' +
        color +
        '">' +
        getCostStatus(item.status) +
        "</td>";

      html += "</tr>";

      tongSoTien += parseInt(item.totalMoney);
    });

    html_last += "<tr>";
    html_last += '<td style="width:20px ;  ">' + "</td>";
    html_last += "<td >" + "</td>";
    html_last += "<td >" + "</td>";
    html_last += "<td >" + "</td>";
    html_last += "<td >" + "</td>";
    html_last += "<td >" + "</td>";
    html_last += "<td >" + "Tổng : </td>";
    html_last += "<td >" + numberWithCommas(tongSoTien) + "</td>";
    html_last += "<td >" + "Đã thanh toán:  </td>";
    html_last += "<td >" + numberWithCommas(tienDaTT) + "(" + dem1 + ") </td>";

    html_last += "</tr>";
    html_last += "<tr>";
    html_last += '<td style="width:20px ;  ">' + "</td>";
    html_last += "<td >" + "</td>";
    html_last += "<td >" + "</td>";
    html_last += "<td >" + "</td>";
    html_last += "<td >" + "</td>";
    html_last += "<td >" + "</td>";
    html_last += "<td >" + "</td>";
    html_last += "<td >" + "</td>";
    html_last += "<td >" + "Chưa thanh toán: </td>";
    html_last +=
      "<td >" + numberWithCommas(tienChuaTT) + "(" + dem0 + ") </td>";

    html_last += "</tr>";
    document.querySelector(".tbody-1").innerHTML = html;
    document.querySelector(".tbody-5").innerHTML = html_last;
  }
}

var selectStatus = document.getElementById("select-status");
selectStatus.addEventListener("change", function () {
  selectedStatus = selectStatus.value;
  currentPage = 1;
  searchList(1);
});

document.getElementById("month-year").addEventListener("change", function () {
  dateFilter = document.getElementById("month-year").value;
  currentPage = 1;
  searchList(1);
});

const removeVietnameseTones = (str) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
};

function searchKey(keyword) {
  const lowerKeyword = keyword.toLowerCase();
  return dsHoaDon.filter((item) => {
    let classInfo = "";
    if (item.teachedInfo) {
      item.teachedInfo.forEach((info) => {
        classInfo += info.class.code;
      });
    }

    return (
      String(item.id).includes(lowerKeyword) ||
      removeVietnameseTones(item.name.toLowerCase()).includes(lowerKeyword) ||
      item.name.toLowerCase().includes(lowerKeyword) ||
      removeVietnameseTones(item.teacher.name.toLowerCase()).includes(
        lowerKeyword
      ) ||
      item.teacher.name.toLowerCase().includes(lowerKeyword) ||
      `${item.forMonth}/${item.forYear}`.toLowerCase().includes(lowerKeyword) ||
      String(item.teacher.id).includes(lowerKeyword) ||
      String(item.totalMoney).includes(lowerKeyword) ||
      String(formatDateFromISO(item.paidAt)).includes(lowerKeyword) ||
      classInfo.toLowerCase().includes(lowerKeyword)
    );
  });
}

function searchList(number = 1) {
  var text = document.getElementById("keyword").value;

  const listSearch = searchKey(text);
  currentPage = number;
  hienthids(selectedStatus, listSearch, currentPage, dateFilter);
  removeSortIcons();
}

function showindex(length) {
  var html = "";

  var count = Math.ceil(length / 50);

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
  searchList(currentPage);
  var table = document.querySelector(".tbody-1");
  table.scrollTo({ top: table.offsetTop, behavior: "smooth" });
}

// sap xep bang

function parseNumericValue(value) {
  return parseInt(value.replace(/,/g, ""));
}
function parseDateValue(value) {
  var parts = value.split("/");
  var month = parseInt(parts[0]);
  var year = parseInt(parts[1]);
  return new Date(year, month - 1);
}
function parseDate(dateStr) {
  if (!dateStr) return null; // Trả về null nếu dateStr rỗng
  const [day, month, year] = dateStr.split("-");
  return new Date(`${year}-${month}-${day}`);
}

function compareDates(aValue, bValue) {
  var aDate = parseDate(aValue);
  var bDate = parseDate(bValue);

  if (!aDate && !bDate) return 0;
  if (!aDate) return 1;
  if (!bDate) return -1;

  return aDate - bDate;
}

var sortDirection = {}; // Store the current sort direction for each column

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

    if (
      columnIndex === 2 ||
      columnIndex === 4 ||
      columnIndex === 5 ||
      columnIndex === 9
    ) {
      if (sortDirection[columnIndex] === "asc") {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    } else if (columnIndex === 0) {
      return;
    } else if (columnIndex === 6) {
      var aDate = parseDateValue(aValue);
      var bDate = parseDateValue(bValue);

      if (sortDirection[columnIndex] === "asc") {
        return aDate - bDate;
      } else {
        return bDate - aDate;
      }
    } else if (columnIndex === 8) {
      // var aDate = parseDate(aValue);
      // var bDate = parseDate(bValue);

      // console.log(aDate, bDate);
      console.log("");

      if (sortDirection[columnIndex] === "asc") {
        return compareDates(aValue, bValue);
      } else {
        return compareDates(bValue, aValue);
      }
    } else {
      aValue = parseNumericValue(aValue);
      bValue = parseNumericValue(bValue);

      if (sortDirection[columnIndex] === "asc") {
        return aValue - bValue;
      } else {
        return bValue - aValue;
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

function openTab_add(evt, tabName) {
  var i, tabcontent, tablinks;

  tabcontent = document.getElementsByClassName("tabcontent-add");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  tablinks = document.getElementsByClassName("tablinks-add");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
}

// Them hoa don

const modalBgAdd = document.querySelector(".modal-bg-add");
const modalContentAdd = document.querySelector(".modal-content-add");

const selectYearps = document.getElementById("bill-year-add");

document.querySelector(".add-bill-button").addEventListener("click", () => {
  modalBgAdd.style.display = "block";
  for (let year = 2022; year <= 2100; year++) {
    const option = document.createElement("option");
    option.value = year;
    option.text = year;

    selectYearps.appendChild(option);
  }
});

// thay doi selection chọn giáo viên
var monthSelect = document.getElementById("bill-month-add");
var yearSelect = document.getElementById("bill-year-add");
var teacherSelect = document.getElementById("bill-teacher-add");

monthSelect.addEventListener("change", updateTeacherOptions);
yearSelect.addEventListener("change", updateTeacherOptions);
var addedTeachers = [];
var teacherData = [];
async function updateTeacherOptions() {
  var selectedMonth = monthSelect.value;
  var selectedYear = yearSelect.value;

  teacherData = [];

  if (selectedMonth && selectedYear) {
    try {
      const res = await fetch(
        `${API_URL}/api/search-teacher-work?month=${selectedMonth}&year=${selectedYear}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 200) {
        const resData = await res.json();
        teacherData = resData;
      }
    } catch (error) {
      console.log("fetchCost error", error);
    }
  }

  console.log("teacherData", teacherData);

  if (inputsValue.length != 0) {
    inputs.forEach((input) => outputDiv.removeChild(input));
    inputs = [];
    inputsValue = [];
  }
  while (teacherSelect.options.length > 0) {
    teacherSelect.remove(0);
  }

  var defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Chọn Giáo viên";
  teacherSelect.appendChild(defaultOption);

  addedTeachers = [];

  if (teacherData.length > 0) {
    var defaultOption = document.createElement("option");
    defaultOption.value = "Tất cả";
    defaultOption.textContent = "Tất cả";
    teacherSelect.appendChild(defaultOption);

    teacherData.forEach((item) => {
      addedTeachers.push(item);
      var option = document.createElement("option");
      option.value = item.id;
      option.text = item.id + " - " + item.name;
      teacherSelect.add(option);
    });
  }
}

// class
const select = document.getElementById("bill-teacher-add");
const outputDiv = document.getElementById("div-bill-class-add");
const options_All = document.querySelectorAll("#bill-teacher-add option");

var inputs = [];
var inputsValue = [];

select.addEventListener("change", (event) => {
  //Xóa input đã chọn nếu có
  var check = true;
  const selectedOption = event.target.value;

  if (selectedOption === "Tất cả") {
    inputs.forEach((input) => outputDiv.removeChild(input));
    inputs = [];
    inputsValue = [];
    const options_All = addedTeachers;
    for (var i = 0; i < options_All.length; i++) {
      const input = document.createElement("input");
      input.type = "text";
      input.value = options_All[i].id + "." + options_All[i].name;
      input.setAttribute("readonly", "readonly");

      inputsValue.push(options_All[i].id);
      inputs.push(input);
      outputDiv.appendChild(input);
    }
  } else {
    if (!inputsValue.includes(parseInt(selectedOption))) {
      const input = document.createElement("input");
      input.type = "text";
      const x = teacherData.filter((item) => item.id == selectedOption);

      input.value = x[0].id + "." + x[0].name;
      input.setAttribute("readonly", "readonly");

      inputsValue.push(parseInt(selectedOption));
      inputs.push(input);
      outputDiv.appendChild(input);
    }
  }
});

document.getElementById("reset-class").addEventListener("click", () => {
  inputs.forEach((input) => outputDiv.removeChild(input));
  inputs = [];
  inputsValue = [];
});

document.getElementById("reset-1").addEventListener("click", () => {
  inputs.forEach((input) => outputDiv.removeChild(input));
  inputs = [];
  inputsValue = [];
});

document.querySelector(".btn-close-add").addEventListener("click", () => {
  modalBgAdd.style.display = "none";
  document.getElementById("Tab1-add").style.display = "block";
  document.getElementById("btn-tab1-add").classList.add("active");
  document.getElementById("btn-tab2-add").classList.remove("active");
  document.getElementById("Tab2-add").style.display = "none";

  document.getElementById("form-add-bill").reset();
  document.getElementById("form-add-bill-ps").reset();

  inputs2.forEach((input) => outputDiv2.removeChild(input));
  inputs2 = [];
  inputsValue2 = [];
  inputs.forEach((input) => outputDiv.removeChild(input));
  inputs = [];
  inputsValue = [];
});

// Khi nhấn tao

document
  .getElementById("sumit-bill-add")
  .addEventListener("click", async function (event) {
    var check = true;

    event.preventDefault();
    const name_bill = document.getElementById("bill-name-add").value;
    const month_bill = document.getElementById("bill-month-add").value;
    const year_bill = document.getElementById("bill-year-add").value;

    //Kiểm tra dữ liệu nhập vào

    if (!name_bill) {
      document.getElementById("lb-name-add").textContent =
        "*Chưa nhập tên hóa đơn";
      check = false;
    } else document.getElementById("lb-name-add").textContent = "";

    if (!month_bill) {
      document.getElementById("lb-time-add").textContent =
        "*Chưa chọn thời gian";
      check = false;
    } else {
      if (!year_bill) {
        document.getElementById("lb-time-add").textContent =
          "*Chưa chọn thời gian";
        check = false;
      } else document.getElementById("lb-time-add").textContent = "";
    }
    if (inputsValue.length === 0) {
      document.getElementById("lb-class-add").textContent =
        "*Chưa chọn giáo viên";
      check = false;
    } else document.getElementById("lb-class-add").textContent = "";

    console.log("inputsValue", inputsValue);

    if (!check) return;

    try {
      showSpinner();

      const promises = inputsValue.map((value) => {
        return fetch(`${API_URL}/api/cost-teacher`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name_bill,
            teacherId: value,
            month: month_bill,
            year: year_bill,
          }),
        });
      });

      const responses = await Promise.all(promises);

      // Check if any response failed
      const allSuccess = responses.every((response) => response.status === 200);

      if (allSuccess) {
        await fetchCost();
        searchList(currentPage);

        document.getElementById("tb1").innerHTML =
          "Đã thêm lương giáo viên tháng " +
          month_bill +
          "/" +
          year_bill +
          " thành công!";
        hideSpinner();
        document.getElementById("form-add-bill").reset();
        inputs.forEach((input) => outputDiv.removeChild(input));
        inputs = [];
        inputsValue = [];
        document.querySelector(".add-success").style.display = "block";

        setTimeout(function () {
          document.querySelector(".add-success").style.display = "none";
        }, 1500);
      } else {
        for (let response of responses) {
          if (!response.ok) {
            const errorData = await response.json();
            console.log(`Error ${response.status}:`, errorData);

            document.getElementById("text-mess").innerText = errorData.message;
            document.querySelector(".add-bill-warning").style.display = "block";
            document.querySelector("#modal-ques").style.display = "block";
          }
        }

        hideSpinner();
      }
    } catch (error) {
      hideSpinner();
      console.log("Error:", error);
    }

    // $.ajax({
    //   url: "../api/addWageTeacher.php",
    //   type: "POST",
    //   data: {
    //     name: name_bill,
    //     month: month_bill,
    //     year: year_bill,
    //     teacher: teacher_bill,
    //   },
    //   success: function (res) {
    //     var text = document.getElementById("keyword").value;
    //     showTableFinance(text, currentPage, collum, orderby, dateFilter);
    //   },
    //   error: function (xhr, status, error) {
    //     console.error(error);
    //   },
    // });

    // document.getElementById("tb1").innerHTML =
    //   "Đã thêm lương giáo viên tháng " +
    //   month_bill +
    //   "/" +
    //   year_bill +
    //   " thành công!";
    // document.getElementById("form-add-bill").reset();
    // inputs.forEach((input) => outputDiv.removeChild(input));
    // inputs = [];
    // inputsValue = [];
    // document.querySelector(".add-success").style.display = "block";

    // setTimeout(function () {
    //   document.querySelector(".add-success").style.display = "none";
    // }, 1500);
  });

// Thêm hóa đơn cá nhân

//ds giáo viên
var inputText = document.getElementById("name-teacher-add-bill");

const select2 = document.getElementById("bill-teacher-add-ps");
const outputDiv2 = document.getElementById("div-bill-class-add-ps");
const options_All2 = document.querySelectorAll("#bill-teacher-add-ps option");

var inputs2 = [];
var inputsValue2 = [];

select2.addEventListener("change", (event) => {
  //Xóa input đã chọn nếu có
  var check = true;
  const selectedOption = event.target.value;

  if (selectedOption === "Tất cả") {
    inputs2.forEach((input) => outputDiv2.removeChild(input));
    inputs2 = [];
    inputsValue2 = [];
    const options_All2 = ds_giaovien;

    ds_giaovien.forEach((item) => {
      const input = document.createElement("input");
      input.type = "text";
      input.value = item.id + "." + item.name;
      input.setAttribute("readonly", "readonly");

      inputsValue2.push(item.id);
      inputs2.push(input);
      outputDiv2.appendChild(input);
    });

    // for (var i = 0; i < options_All2.length; i++) {
    //   const input = document.createElement("input");
    //   input.type = "text";
    //   input.value = options_All2.id + "." + options_All2.name;
    //   input.setAttribute("readonly", "readonly");

    //   inputsValue2.push(options_All2.id);
    //   inputs2.push(input);
    //   outputDiv2.appendChild(input);
    // }
  } else {
    console.log("inputsValue2", inputsValue2);
    console.log("selectedOption", selectedOption);
    if (!inputsValue2.includes(parseInt(selectedOption))) {
      const input = document.createElement("input");
      input.type = "text";
      const x = ds_giaovien.filter((item) => item.id == selectedOption);
      input.value = x[0].id + "." + x[0].name;
      input.setAttribute("readonly", "readonly");
      inputsValue2.push(parseInt(selectedOption));
      inputs2.push(input);
      outputDiv2.appendChild(input);
    }
  }
});

document.getElementById("reset-class-ps").addEventListener("click", () => {
  inputs2.forEach((input) => outputDiv2.removeChild(input));
  inputs2 = [];
  inputsValue2 = [];
});

document.getElementById("reset-2").addEventListener("click", () => {
  inputs2.forEach((input) => outputDiv2.removeChild(input));
  inputs2 = [];
  inputsValue2 = [];
});

function formatNumber(input) {
  let value = input.value;
  // Xóa tất cả ký tự không phải là số và dấu phẩy
  value = value.replace(/[^\d,]/g, "");
  // Xóa dấu phẩy hiện có
  value = value.replace(/,/g, "");
  // Thêm dấu phẩy sau mỗi ba chữ số
  value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  input.value = value;
}

document.getElementById("money-add-bill").addEventListener("blur", function () {
  var value = parseNumericValue(this.value);

  if (!value) {
    this.value = "";
  } else {
    this.value = numberWithCommas(value);
  }
});

function convertToMoney(moneyString) {
  const moneyNumber = parseFloat(moneyString.replace(/,/g, ""));
  return moneyNumber;
}

document
  .getElementById("sumit-bill-add-ps")
  .addEventListener("click", async function (event) {
    var check = true;

    event.preventDefault();
    const name_bill = document.getElementById("bill-name-add-ps").value;
    const money = document.getElementById("money-add-bill").value;

    //Kiểm tra dữ liệu nhập vào
    if (inputsValue2.length === 0) {
      document.getElementById("lb-class-add-ps").textContent =
        "*Chưa chọn giáo viên";
      check = false;
    } else document.getElementById("lb-class-add-ps").textContent = "";

    if (!name_bill) {
      document.getElementById("lb-name-add-ps").textContent =
        "*Chưa nhập tên hóa đơn";
      check = false;
    } else document.getElementById("lb-name-add-ps").textContent = "";

    if (!money) {
      document.getElementById("lb-money-add-ps").textContent = "*Chưa số tiền";
      check = false;
    } else document.getElementById("lb-money-add-ps").textContent = "";

    // console.log("inputsValue2", inputsValue2);
    // console.log("money", convertToMoney(money));

    if (!check) return;

    // $.ajax({
    //   url: "../api/addWageTeacherps.php",
    //   type: "POST",
    //   data: {
    //     name: name_bill,
    //     money: money,
    //     teacher: teacher_bill_ps,
    //   },
    //   success: function (res) {
    //     var text = document.getElementById("keyword").value;
    //     showTableFinance(text, currentPage, collum, orderby, dateFilter);
    //   },
    //   error: function (xhr, status, error) {
    //     console.error(error);
    //   },
    // });

    const today = new Date();

    try {
      showSpinner();

      const promises = inputsValue2.map((value) => {
        return fetch(`${API_URL}/api/cost-bonus-teacher`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            month: Number(today.getMonth() + 1),
            year: Number(today.getFullYear()),
            totalMoney: convertToMoney(money),
            teacherId: value,
            name: name_bill,
          }),
        });
      });

      const responses = await Promise.all(promises);

      // Check if any response failed
      const allSuccess = responses.every((response) => response.status === 200);

      if (allSuccess) {
        await fetchCost();
        searchList(currentPage);

        document.getElementById("tb1").innerHTML =
          "Đã thêm lương giáo viên" + " thành công!";
        hideSpinner();

        document.getElementById("tb1").innerHTML =
          "Đã thêm hóa đơn " + name_bill + " cho giáo  viên thành công! ";

        document.getElementById("form-add-bill-ps").reset();
        document.querySelector(".add-success").style.display = "block";

        setTimeout(function () {
          document.querySelector(".add-success").style.display = "none";
        }, 1500);
      } else {
        for (let response of responses) {
          if (!response.ok) {
            const errorData = await response.json();
            console.log(`Error ${response.status}:`, errorData);

            document.getElementById("text-mess").innerText = errorData.message;
            document.querySelector(".add-bill-warning").style.display = "block";
            document.querySelector("#modal-ques").style.display = "block";
          }
        }

        hideSpinner();
      }
    } catch (error) {
      hideSpinner();
      console.log("Error:", error);
    }
  });

//thong tin chi tiet hoa don

const rows = document.querySelectorAll(".tbody-1 tr");
const modalBg = document.querySelector(".modal-bg");
const modalContent = document.querySelector(".modal-content");

const select_tt = document.getElementById("status-detail");
var maHD_select;
var hoaDon_select;

var lsthp = [];
function handleRowClick(index) {
  // Xử lý sự kiện khi bấm vào một dòng
  // var selectedRow = rows[index].cells[1];

  document.getElementById("btn-tab-3-1").classList.add("active");

  document.getElementById("tab-3-1").style.display = "block";

  maHD_select = index;

  for (var i = 0; i < dsHoaDon.length; i++) {
    if (maHD_select == dsHoaDon[i].id) hoaDon_select = dsHoaDon[i];
  }

  console.log("hoaDon_select", hoaDon_select);

  document.getElementById("id-bill-detail").textContent = hoaDon_select.id;
  document.getElementById("name-bill-detail").textContent = hoaDon_select.name;

  document.getElementById("id-st-detail").textContent =
    hoaDon_select.teacher.id;
  document.getElementById("name-st-bill-detail").textContent =
    hoaDon_select.teacher.name;
  document.getElementById(
    "time-bill-detail"
  ).textContent = `${hoaDon_select.forMonth}/${hoaDon_select.forYear}`;
  document.getElementById("st-bill-detail").textContent = formatMoney(
    hoaDon_select.totalMoney
  );
  if (hoaDon_select.status == CostStatus.Done)
    document.getElementById("time-tt-bill-detail").textContent =
      formatDateFromISO(hoaDon_select.paidAt);
  else {
    document.getElementById("time-tt-bill-detail").textContent = "";
  }

  if (hoaDon_select.status == CostStatus.Done) {
    select_tt.value = "2";
    select_tt.style.color = "green";
  } else {
    select_tt.value = "1";
    select_tt.style.color = "red";
  }

  var html = "";

  const teachedInfo = hoaDon_select.teachedInfo;
  if (teachedInfo?.length > 0) {
    teachedInfo.forEach((item) => {
      html +=
        item.class.code +
        ": " +
        item.teachedCount +
        " buổi             (" +
        numberWithCommas(item.salary) +
        " / buổi)" +
        "<br>";
    });
    document.getElementById("edit-button").hidden = true;
  } else {
    document.getElementById("edit-button").hidden = true;
  }

  document.getElementById("class-bill-detail").innerHTML = html;

  modalBg.style.display = "block";
}

select_tt.addEventListener("change", function () {
  if (select_tt.value == "2") select_tt.style.color = "green";
  else select_tt.style.color = "red";
});

// cap nhat trang thai hoa don

document
  .getElementById("update-tt")
  .addEventListener("click", async function (event) {
    event.preventDefault();

    const status = document.getElementById("status-detail").value;

    showSpinner();
    try {
      const response = await fetch(
        `${API_URL}/api/cost-status/${hoaDon_select.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: parseInt(status),
          }),
        }
      );

      if (response.status === 200) {
        await fetchCost();

        for (var i = 0; i < dsHoaDon.length; i++) {
          if (hoaDon_select.id == dsHoaDon[i].id) hoaDon_select = dsHoaDon[i];
        }

        if (hoaDon_select.status == CostStatus.Done)
          document.getElementById("time-tt-bill-detail").textContent =
            formatDateFromISO(hoaDon_select.paidAt);
        else {
          document.getElementById("time-tt-bill-detail").textContent = "";
        }

        if (hoaDon_select.status == CostStatus.Done) {
          select_tt.value = "2";
          select_tt.style.color = "green";
        } else {
          select_tt.value = "1";
          select_tt.style.color = "red";
        }

        searchList(currentPage);

        hideSpinner();

        document.getElementById("tb1").innerHTML =
          "Đã cập nhật trạng thái  thành công! ";
        document.getElementById("id-wage").value = maHD_select;
        document.querySelector(".add-success").style.display = "block";

        setTimeout(function () {
          document.querySelector(".add-success").style.display = "none";
        }, 1500);
      }
    } catch (error) {
      console.error("api error", error);
      hideSpinner();
    }
  });

document.querySelector(".close-btn").addEventListener("click", () => {
  modalBg.style.display = "none";
});

////Sua thong tin hoa don
const editButton = document.getElementById("edit-button");

const modalBgEdit = document.querySelector(".modal-bg-edit");
const modalContentEdit = document.querySelector(".modal-content-edit");

// Khi  nhấn vào nút "Sửa"
editButton.addEventListener("click", () => {
  document.getElementById("id-bill-edit").value = hoaDon_select.id;
  document.getElementById("bill-name-edit").value = hoaDon_select.name;
  var time = hoaDon_select.ThoiGian;
  var tt = hoaDon_select.TrangThai;

  numbers = time.split("/");

  var month = parseInt(numbers[0]);
  var year = parseInt(numbers[1]);

  var select = document.getElementById("bill-month-edit");
  for (var i = 0; i < select.options.length; i++) {
    var option = select.options[i];
    if (parseInt(option.value) === month) {
      option.selected = true;
    }
  }
  select = document.getElementById("bill-year-edit");
  for (var i = 0; i < select.options.length; i++) {
    var option = select.options[i];
    if (parseInt(option.value) === year) {
      option.selected = true;
    }
  }

  select = document.getElementById("bill-status-edit");
  for (var i = 0; i < select.options.length; i++) {
    var option = select.options[i];
    if (option.value == tt) {
      option.selected = true;
    }
  }

  select = document.getElementById("teacher-edit");
  for (var i = 0; i < select.options.length; i++) {
    var option = select.options[i];
    if (option.value == hoaDon_select.MaGV) {
      option.selected = true;
    }
  }

  document.getElementById("money-edit-bill").value = numberWithCommas(
    hoaDon_select.SoTien
  );

  if (hoaDon_select.ThoiGianTT != null)
    document.getElementById("time-tt-edit-bill").value =
      hoaDon_select.ThoiGianTT;
  else {
    document.getElementById("time-tt-edit-bill").value = "";
  }

  modalBgEdit.style.display = "block";
});

document.querySelector(".cancle-btn").addEventListener("click", () => {
  modalBgEdit.style.display = "none";

  document.getElementById("lb-name-edit").textContent = "";
  document.getElementById("lb-time-edit").textContent = "";
  document.getElementById("lb-time-tt-edit").textContent = "";
  document.getElementById("lb-money-edit").textContent = "";
  document.getElementById("form-edit-bill").reset();
});

// Cap nhat sua hoa don
document
  .getElementById("update-bill-edit")
  .addEventListener("click", function (event) {
    var check = true;

    event.preventDefault();

    const name_bill = document.getElementById("bill-name-edit").value;
    const month_bill = document.getElementById("bill-month-edit").value;
    const year_bill = document.getElementById("bill-year-edit").value;
    const teacher_bill = document.getElementById("teacher-edit").value;
    const money = document.getElementById("money-edit-bill").value;
    const time_tt = document.getElementById("time-tt-edit-bill").value;
    const status = document.getElementById("bill-status-edit").value;

    //Kiểm tra dữ liệu nhập vào

    if (!name_bill) {
      document.getElementById("lb-name-edit").textContent =
        "*Chưa nhập tên hóa đơn";
      check = false;
    } else document.getElementById("lb-name-edit").textContent = "";

    if (!month_bill) {
      document.getElementById("lb-time-edit").textContent =
        "*Chưa chọn thời gian";
      check = false;
    } else {
      if (!year_bill) {
        document.getElementById("lb-time-edit").textContent =
          "*Chưa chọn thời gian";
        check = false;
      } else document.getElementById("lb-time-edit").textContent = "";
    }

    if (!money) {
      document.getElementById("lb-money-edit").textContent =
        "*Chưa ghi số tiền";
      check = false;
    } else document.getElementById("lb-money-edit").textContent = "";

    if (!teacher_bill) {
      document.getElementById("lb-time-edit").textContent = "*Chưa ghi số tiền";
      check = false;
    } else document.getElementById("lb-time-edit").textContent = "";

    if (status == "Đã thanh toán") {
      if (!time_tt) {
        document.getElementById("lb-time-tt-edit").textContent =
          "*Chưa cập nhật thời gian thanh toán";
        check = false;
      } else document.getElementById("lb-time-tt-edit").textContent = "";
    }

    if (!check) return;

    $.ajax({
      url: "../api/updateWageTeacher.php",
      type: "POST",
      data: {
        id: hoaDon_select.MaLuong,
        name: name_bill,
        month: month_bill,
        year: year_bill,
        teacher: teacher_bill,
        money: money,
        time: time_tt,
        status: status,
      },
      success: function (res) {
        dsHoaDon = JSON.parse(res);

        for (var i = 0; i < dsHoaDon.length; i++) {
          if (hoaDon_select.MaLuong == dsHoaDon[i].MaLuong)
            hoaDon_select = dsHoaDon[i];
        }

        document.getElementById("id-bill-detail").textContent =
          hoaDon_select.MaLuong;
        document.getElementById("name-bill-detail").textContent =
          hoaDon_select.TenHD;
        document.getElementById("id-st-detail").textContent =
          hoaDon_select.MaGV;
        document.getElementById("name-st-bill-detail").textContent =
          hoaDon_select.TenGV;
        document.getElementById("time-bill-detail").textContent =
          hoaDon_select.ThoiGian;
        document.getElementById("st-bill-detail").textContent =
          numberWithCommas(hoaDon_select.SoTien);
        if (hoaDon_select.ThoiGianTT != null)
          document.getElementById("time-tt-bill-detail").textContent =
            convertDateFormat(hoaDon_select.ThoiGianTT);
        else {
          document.getElementById("time-tt-bill-detail").textContent = "";
        }

        if (hoaDon_select.TrangThai == "Đã thanh toán") {
          select_tt.value = "Đã thanh toán";
          select_tt.style.color = "green";
        } else {
          select_tt.value = "Chưa thanh toán";
          select_tt.style.color = "red";
        }

        var parts = hoaDon_select.ThoiGian.split("/");
        var month = parts[0]; // "7"
        var year = parts[1];
        var html = "";
        if (hoaDon_select.Lop != null) {
          for (var i = 0; i < dssoBuoiDay.length; i++) {
            if (
              dssoBuoiDay[i].MaGV == hoaDon_select.MaGV &&
              dssoBuoiDay[i].Thang == month &&
              dssoBuoiDay[i].Nam == year
            ) {
              html +=
                dssoBuoiDay[i].MaLop +
                ": " +
                dssoBuoiDay[i].SoBuoiDay +
                " buổi             (" +
                numberWithCommas(dssoBuoiDay[i].TienTraGV) +
                " / buổi)" +
                "<br>";
            }
          }
        }

        document.getElementById("class-bill-detail").innerHTML = html;

        var text = document.getElementById("keyword").value;
        showTableFinance(text, currentPage, collum, orderby, dateFilter);
      },
      error: function (xhr, status, error) {
        console.error(error);
      },
    });

    modalBgEdit.style.display = "none";
    document.getElementById("tb1").innerHTML =
      'Đã cập nhật sửa đổi  hóa đơn "' + name_bill + '"' + " thành công!";

    document.querySelector(".add-success").style.display = "block";

    setTimeout(function () {
      document.querySelector(".add-success").style.display = "none";
    }, 1500);
  });

// Xoa hoa don

document.getElementById("btn-delete-bill").addEventListener("click", () => {
  document.querySelector(".delete-bill-ques").style.display = "block";
  document.querySelector("#modal-ques").style.display = "block";
});

document
  .getElementById("btn-cancle-add-bill-warning")
  .addEventListener("click", () => {
    document.querySelector(".add-bill-warning").style.display = "none";
    document.querySelector("#modal-ques").style.display = "none";
  });

document
  .getElementById("btn-cancle-delete-bill")
  .addEventListener("click", () => {
    document.querySelector(".delete-bill-ques").style.display = "none";
    document.querySelector("#modal-ques").style.display = "none";
  });
document
  .getElementById("delete-bill")
  .addEventListener("click", async function (event) {
    event.preventDefault();

    document.querySelector(".delete-bill-ques").style.display = "none";

    if (hoaDon_select.status == CostStatus.Done) {
      document.querySelector(".delete-bill-ques-2").style.display = "block";
      return;
    }

    showSpinner();
    try {
      const response = await fetch(`${API_URL}/api/cost/${hoaDon_select.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        await fetchCost();
        searchList(currentPage);

        hideSpinner();

        document.querySelector("#modal-ques").style.display = "none";
        modalBg.style.display = "none";
        document.querySelector(".delete-success").style.display = "block";
        setTimeout(function () {
          document.querySelector(".delete-success").style.display = "none";
        }, 1500);
      }
    } catch (error) {
      console.error("api error", error);
      hideSpinner();
    }
  });

document
  .getElementById("btn-cancle-delete-bill-2")
  .addEventListener("click", () => {
    document.querySelector(".delete-bill-ques-2").style.display = "none";
    document.querySelector("#modal-ques").style.display = "none";
  });

// document
//   .getElementById("delete-bill-2")
//   .addEventListener("click", function (event) {
//     event.preventDefault();

//     $.ajax({
//       url: "../api/deleteWage.php",
//       type: "POST",
//       data: {
//         mahd: hoaDon_select.MaLuong,
//       },
//       success: function (res) {
//         var text = document.getElementById("keyword").value;
//         showTableFinance(text, currentPage, collum, orderby, dateFilter);
//       },
//       error: function (xhr, status, error) {
//         console.error(error);
//       },
//     });

//     document.querySelector(".delete-bill-ques-2").style.display = "none";
//     document.querySelector("#modal-ques").style.display = "none";
//     modalBg.style.display = "none";
//     document.querySelector(".delete-success").style.display = "block";
//     setTimeout(function () {
//       document.querySelector(".delete-success").style.display = "none";
//     }, 1500);
//   });

// them giao dich

///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////// Chi Phi ////////////////////////

document.getElementById("btn-tab2").addEventListener("mouseenter", () => {
  document.getElementById("nav-container-Tab2").style.display = "block";
});
document.getElementById("btn-tab2").addEventListener("mouseleave", () => {
  document.getElementById("nav-container-Tab2").style.display = "none";
});
document
  .getElementById("nav-container-Tab2")
  .addEventListener("mouseenter", () => {
    document.getElementById("nav-container-Tab2").style.display = "block";
  });
document
  .getElementById("nav-container-Tab2")
  .addEventListener("mouseleave", () => {
    document.getElementById("nav-container-Tab2").style.display = "none";
  });

document.getElementById("btn-tab1").addEventListener("click", () => {
  window.location.href = "./manageFinance.html";
});

document.getElementById("btn-tab3").addEventListener("click", () => {
  window.location.href = "./manageHistoryFinance.html";
});
