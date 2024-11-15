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
var filteredData_ds;
var listCenter;

var selectedCenter = "";

var selectedStatus = "";
var dateFilter = "";

const accessToken = localStorage.getItem("accessToken");

const store_ds_hoadon_hocphi = localStorage.getItem("ds_hoadon_hocphi");
if (store_ds_hoadon_hocphi) {
  dsHoaDon = JSON.parse(store_ds_hoadon_hocphi);
  hienthids(selectedStatus, selectedCenter, dsHoaDon, currentPage, dateFilter);
}

fetchCost();

listCenter = JSON.parse(localStorage.getItem("listCenter"));

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
    const res = await fetch(`${API_URL}/api/costs?type=2`, {
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

      localStorage.setItem("ds_hoadon_hocphi", JSON.stringify(dsHoaDon));

      //   showTableStudent(ds_hocsinh, "");
      hienthids(
        selectedStatus,
        selectedCenter,
        dsHoaDon,
        currentPage,
        dateFilter
      );

      hideSpinner();
    }
  } catch (error) {
    hideSpinner();
    console.log("fetchCost error", error);
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

// async function fetchCost() {
//   if (!dsHoaDon) {
//     showSpinner();
//   }

//   const controller = new AbortController();
//   const timeoutId = setTimeout(() => controller.abort(), 20000); // 10 giây timeout

//   try {
//     const res = await fetch(`${API_URL}/api/costs?type=2`, {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         "Content-Type": "application/json",
//       },
//       signal: controller.signal, // Thêm signal cho AbortController
//     });

//     clearTimeout(timeoutId); // Xóa timeout nếu yêu cầu hoàn thành trước khi hết thời gian chờ

//     if (res.status === 200) {
//       const resData = await res.json();
//       console.log("resData", resData);
//       dsHoaDon = resData.docs;
//       countData = dsHoaDon.length;

//       localStorage.setItem("ds_hoadon_hocphi", JSON.stringify(dsHoaDon));

//       hienthids(selectedStatus, dsHoaDon, currentPage, dateFilter);
//       hideSpinner();
//     }
//   } catch (error) {
//     hideSpinner();
//     if (error.name === "AbortError") {
//       console.log("Request timed out");
//     } else {
//       console.log("fetchCost error", error);
//     }
//   }
// }

/////// funct
function getGender(gender) {
  if (gender == 1) {
    return "Nam";
  } else {
    return "Nữ";
  }
}
function getCostStatus(status) {
  if (status == CostStatus.Pending) {
    return "Chưa đóng";
  } else if (status == CostStatus.Done) {
    return "Hoàn thành";
  } else {
    return "Còn nợ";
  }
}

function getCenterNameById(id) {
  if (!listCenter) return "";
  else {
    const center = listCenter.find((center) => center.id === id);
    return center ? center.name : "";
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

function convertDateToIOS(dateString) {
  const date = new Date(dateString);
  const formattedDate = date
    .toISOString()
    .replace("T", " ")
    .replace("Z", "000+00");
  return formattedDate;
}

function convertToMoney(moneyString) {
  const moneyNumber = parseFloat(moneyString.replace(/,/g, ""));
  return moneyNumber;
}

document.getElementById("Tab1").style.display = "block";
document.getElementById("btn-tab1").classList.add("active");

document.getElementById("Tab1-add").style.display = "block";
document.getElementById("btn-tab1-add").classList.add("active");

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatMoney(number) {
  return Number(number).toLocaleString("en-US", {
    maximumFractionDigits: 2,
  });
}
//Hiẹn thị bảng

var selectCenter = document.getElementById("select-center");

selectCenter.addEventListener("change", function () {
  selectedCenter = selectCenter.value;
  searchList(1);
});

function hienthids(status, center, listData, page, date) {
  document.querySelector(".tbody-1").innerHTML = "";
  document.querySelector(".tbody-5").innerHTML = "";
  var filteredData = listData;
  if (status != "") {
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

  if (center) {
    filteredData = filteredData.filter(
      (bill) => bill?.class.centerId == center
    );
  }

  if (filteredData.length == 0) {
    document.querySelector(".tbody-1").innerHTML = "Không có dữ liệu phù hợp !";
  }

  var html = "";
  var html_last = "";
  var color = "";
  var tongSoTien = 0;
  var tongSoTienGiam = 0;
  var tongSoTienDaDong = 0;
  var tongSoTienPhaiDong = 0;
  if (filteredData.length != 0) {
    showindex(filteredData.length);
    const listItem = getRecordByPage(filteredData, page, 50);
    let i = 1;

    listItem.filter((item) => {
      if (item.status === CostStatus.Done) {
        color = "lightgreen";
      } else if (item.status === CostStatus.Pending) {
        color = "#ff9393";
      } else {
        color = "#bcbdff";
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
        item.user.student.name +
        "</td>";
      html +=
        '<td style = "background-color:' +
        color +
        '">' +
        item.class.code +
        "</td>";
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
        formatMoney(item.originTotalMoney) +
        "</td>";
      html +=
        '<td style = "background-color:' +
        color +
        '">' +
        item.studentClass.reducePercent +
        "%</td>";
      html +=
        '<td style = "background-color:' +
        color +
        '">' +
        formatMoney(item.totalReduceMoney) +
        "</td>";
      html +=
        '<td style = "background-color:' +
        color +
        '">' +
        formatMoney(item.totalMoney) +
        "</td>";
      html +=
        '<td style = "background-color:' +
        color +
        '">' +
        formatMoney(item.paidMoney) +
        "</td>";
      html +=
        '<td style = "background-color:' +
        color +
        '">' +
        formatMoney(item.debtMoney) +
        "</td>";

      html +=
        '<td style = "background-color:' +
        color +
        '">' +
        getCostStatus(item.status) +
        "</td>";

      html += "</tr>";

      tongSoTien += parseInt(item.totalMoney);
      if (item.totalReduceMoney) {
        tongSoTienGiam += parseInt(item.totalReduceMoney);
      }
      tongSoTienPhaiDong += parseInt(item.totalMoney);
      tongSoTienDaDong += parseInt(item.paidMoney);
    });

    // for (var i = 0; i < filteredData.length; i++) {
    //   if (filteredData[i]["TrangThai"] === "Hoàn thành") {
    //     color = "lightgreen";
    //   } else if (filteredData[i]["TrangThai"] === "Chưa đóng") {
    //     color = "#ff9393";
    //   } else {
    //     color = "#bcbdff";
    //   }
    //   if (i >= (page - 1) * 50 && i <= page * 50 - 1) {
    //     html += '<tr onclick="handleRowClick(' + i + ')">';
    //     html +=
    //       '<td style="width:20px ;background-color:' +
    //       color +
    //       '">' +
    //       (i + 1) +
    //       "</td>";
    //     html +=
    //       '<td style = "background-color:' +
    //       color +
    //       '">' +
    //       filteredData[i]["MaHD"] +
    //       "</td>";
    //     html +=
    //       '<td style = "background-color:' +
    //       color +
    //       '">' +
    //       filteredData[i]["TenHD"] +
    //       "</td>";
    //     html +=
    //       '<td style = "background-color:' +
    //       color +
    //       '">' +
    //       filteredData[i]["TenHS"] +
    //       "</td>";
    //     html +=
    //       '<td style = "background-color:' +
    //       color +
    //       '">' +
    //       filteredData[i]["MaLop"] +
    //       "</td>";
    //     html +=
    //       '<td style = "background-color:' +
    //       color +
    //       '">' +
    //       filteredData[i]["ThoiGian"] +
    //       "</td>";
    //     html +=
    //       '<td style = "background-color:' +
    //       color +
    //       '">' +
    //       numberWithCommas(filteredData[i]["SoTien"]) +
    //       "</td>";
    //     html +=
    //       '<td style = "background-color:' +
    //       color +
    //       '">' +
    //       filteredData[i]["GiamHocPhi"] +
    //       "%</td>";
    //     html +=
    //       '<td style = "background-color:' +
    //       color +
    //       '">' +
    //       numberWithCommas(filteredData[i]["SoTienGiam"]) +
    //       "</td>";
    //     html +=
    //       '<td style = "background-color:' +
    //       color +
    //       '">' +
    //       numberWithCommas(filteredData[i]["SoTienPhaiDong"]) +
    //       "</td>";
    //     html +=
    //       '<td style = "background-color:' +
    //       color +
    //       '">' +
    //       numberWithCommas(filteredData[i]["SoTienDaDong"]) +
    //       "</td>";
    //     html +=
    //       '<td style = "background-color:' +
    //       color +
    //       '">' +
    //       numberWithCommas(filteredData[i]["NoPhiConLai"]) +
    //       "</td>";

    //     html +=
    //       '<td style = "background-color:' +
    //       color +
    //       '">' +
    //       filteredData[i]["TrangThai"] +
    //       "</td>";

    //     html += "</tr>";
    //   }
    //   tongSoTien += parseInt(filteredData[i]["SoTien"]);

    //   tongSoTienGiam += parseInt(filteredData[i]["SoTienGiam"]);
    //   tongSoTienPhaiDong += parseInt(filteredData[i]["SoTienPhaiDong"]);
    //   tongSoTienDaDong += parseInt(filteredData[i]["SoTienDaDong"]);
    // }
    html_last += '<tr">';
    html_last += '<td style="width:20px ;  ">' + "</td>";
    html_last += "<td >" + "</td>";
    html_last += "<td >" + "</td>";
    html_last += "<td >" + "</td>";
    html_last += "<td >" + "</td>";
    html_last += "<td >" + "Tổng : </td>";
    html_last += "<td >" + formatMoney(tongSoTien) + "</td>";
    html_last +=
      "<td >" + ((tongSoTienGiam / tongSoTien) * 100).toFixed(2) + "%</td>";
    html_last += "<td >" + formatMoney(tongSoTienGiam) + "</td>";
    html_last += "<td >" + formatMoney(tongSoTienPhaiDong) + "</td>";
    html_last += "<td >" + formatMoney(tongSoTienDaDong) + "</td>";
    html_last +=
      "<td >" + formatMoney(tongSoTienPhaiDong - tongSoTienDaDong) + "</td>";
    html_last += "<td >" + "</td>";
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
    return (
      String(item.id).includes(lowerKeyword) ||
      removeVietnameseTones(item.name.toLowerCase()).includes(lowerKeyword) ||
      item.name.toLowerCase().includes(lowerKeyword) ||
      removeVietnameseTones(item.user.student.name.toLowerCase()).includes(
        lowerKeyword
      ) ||
      item.user.student.name.toLowerCase().includes(lowerKeyword) ||
      removeVietnameseTones(item.class.code.toLowerCase()).includes(
        lowerKeyword
      ) ||
      `${item.forMonth}/${item.forYear}`.toLowerCase().includes(lowerKeyword) ||
      String(item.debtMoney).includes(lowerKeyword) ||
      String(item.originTotalMoney).includes(lowerKeyword) ||
      String(item.paidMoney).includes(lowerKeyword) ||
      String(item.studentClass.reducePercent).includes(lowerKeyword) ||
      String(item.totalMoney).includes(lowerKeyword) ||
      String(item.totalReduceMoney).includes(lowerKeyword)
    );
  });
}

function searchList(number = 1) {
  var text = document.getElementById("keyword").value;

  const listSearch = searchKey(text);
  currentPage = number;
  hienthids(
    selectedStatus,
    selectedCenter,
    listSearch,
    currentPage,
    dateFilter
  );
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
  var text = document.getElementById("keyword").value;
  showTableFinance(text, pageNumber, collum, orderby, dateFilter);
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
      columnIndex === 3 ||
      columnIndex === 4 ||
      columnIndex === 12
    ) {
      if (sortDirection[columnIndex] === "asc") {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    } else if (columnIndex === 0) {
      return;
    } else if (columnIndex === 5) {
      var aDate = parseDateValue(aValue);
      var bDate = parseDateValue(bValue);

      if (sortDirection[columnIndex] === "asc") {
        return aDate - bDate;
      } else {
        return bDate - aDate;
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

  // Ẩn tất cả các nội dung của tab
  tabcontent = document.getElementsByClassName("tabcontent-add");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Loại bỏ lớp active của tất cả các button
  tablinks = document.getElementsByClassName("tablinks-add");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Hiển thị nội dung của tab được chọn và đánh dấu button đã chọn
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
}

function openTab_3(evt, tabName) {
  var i, tabcontent, tablinks;

  tabcontent = document.getElementsByClassName("tabcontent-3");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  tablinks = document.getElementsByClassName("tablinks-3");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
}

// Them hoa don

const modalBgAdd = document.querySelector(".modal-bg-add");
const modalContentAdd = document.querySelector(".modal-content-add");
const selectYearss = document.getElementById("bill-year-add-ps");

const selectYearps = document.getElementById("bill-year-add");

for (let year = 2022; year <= 2100; year++) {
  const option = document.createElement("option");
  option.value = year;
  option.text = year;

  selectYearss.appendChild(option);
}

for (let year = 2022; year <= 2100; year++) {
  const option = document.createElement("option");
  option.value = year;
  option.text = year;

  selectYearps.appendChild(option);
}

document.querySelector(".add-bill-button").addEventListener("click", () => {
  modalBgAdd.style.display = "block";
});

var monthSelect = document.getElementById("bill-month-add");
var yearSelect = document.getElementById("bill-year-add");
var classsSelect = document.getElementById("bill-class-add");

monthSelect.addEventListener("change", updateclasssOptions);
yearSelect.addEventListener("change", updateclasssOptions);
var addedClasses = [];
var classData = [];
// Hàm cập nhật các giá trị trong select bill-classs-add
async function updateclasssOptions() {
  var selectedMonth = monthSelect.value;
  var selectedYear = yearSelect.value;

  classData = [];

  if (selectedMonth && selectedYear) {
    try {
      const res = await fetch(
        `${API_URL}/api/search-class-work?month=${selectedMonth}&year=${selectedYear}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 200) {
        const resData = await res.json();
        classData = resData;
      }
    } catch (error) {
      console.log("fetchCost error", error);
    }
  }

  var check = true;
  if (inputsValue.length != 0) {
    inputs.forEach((input) => outputDiv.removeChild(input));
    inputs = [];
    inputsValue = [];
  }

  while (classsSelect.options.length > 0) {
    classsSelect.remove(0);
  }

  // Add default option

  var defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Chọn lớp học";
  classsSelect.appendChild(defaultOption);

  addedClasses = [];
  if (classData.length > 0) {
    var defaultOption = document.createElement("option");
    defaultOption.value = "Tất cả";
    defaultOption.textContent = "Tất cả";
    classsSelect.appendChild(defaultOption);

    classData.forEach((item) => {
      addedClasses.push(item);
      var option = document.createElement("option");
      option.value = item.id;
      option.text = item.code;
      classsSelect.add(option);
    });
  }
}

// class
const select = document.getElementById("bill-class-add");
const outputDiv = document.getElementById("div-bill-class-add");
const options_All = document.querySelectorAll("#bill-class-add option");

var inputs = [];
var inputsValue = [];

select.addEventListener("change", (event) => {
  // Xóa input đã chọn nếu có
  var check = true;
  const selectedOption = event.target.value;

  if (selectedOption === "Tất cả") {
    inputs.forEach((input) => outputDiv.removeChild(input));
    inputs = [];
    inputsValue = [];
    const options_All = addedClasses;
    for (var i = 0; i < options_All.length; i++) {
      const input = document.createElement("input");
      input.type = "text";
      input.value = options_All[i].code;
      input.setAttribute("readonly", "readonly");
      inputsValue.push(options_All[i].id);
      inputs.push(input);
      outputDiv.appendChild(input);
    }
  } else {
    inputsValue.forEach((i) => {
      if (i == selectedOption) check = false;
    });
    if (selectedOption !== "" && check) {
      const input = document.createElement("input");
      input.type = "text";
      const x = classData.filter((item) => item.id == selectedOption);

      input.value = x[0].code;
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
  inputs.forEach((input) => outputDiv.removeChild(input));
  inputs = [];
  inputsValue = [];
  document.getElementById("form-add-bill").reset();
  document.getElementById("form-add-bill-ps").reset();
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

    var erorr_empty = "*Dữ liệu không để trống";

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
      document.getElementById("lb-class-add").textContent = "*Chưa chọn lớp";
      check = false;
    } else document.getElementById("lb-class-add").textContent = "";

    if (!check) return;

    try {
      showSpinner();

      const promises = inputsValue.map((value) => {
        return fetch(`${API_URL}/api/cost-class`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name_bill,
            classId: value,
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
          "Đã thêm hóa đơn tháng " +
          month_bill +
          "/" +
          year_bill +
          " thành công!";

        hideSpinner();
        document.getElementById("form-add-bill").reset();

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

var classSelect = document.getElementById("bill-class-add-ps");
var studentSelect = document.getElementById("name-student-add-bill");
var student_ps_data = [];

classSelect.addEventListener("change", async function () {
  studentSelect.innerHTML = '<option value="">Chọn Học viên</option>';

  try {
    const res = await fetch(
      `${API_URL}/api/search-student-work?month=${monthSelect_ps.value}&year=${yearSelect_ps.value}&classId=${classsSelect_ps.value}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (res.status === 200) {
      const resData = await res.json();
      student_ps_data = resData;
    }
  } catch (error) {
    console.log("fetchCost error", error);
  }

  console.log("student_ps_data", student_ps_data);

  if (student_ps_data.length > 0) {
    student_ps_data.forEach((item) => {
      var option = document.createElement("option");
      option.value = item.id;
      option.textContent = item.id + ". " + item.name;
      studentSelect.add(option);
    });
  }

  // var selectedClass = classSelect.value;
  // for (var i = 0; i < dshs_lopxHS.length; i++) {
  //   var student = dshs_lopxHS[i];
  //   if (student.MaLop === selectedClass) {
  //     var option = document.createElement("option");
  //     option.value = student.MaHS;
  //     option.textContent = student.MaHS + ". " + student.TenHS;
  //     studentSelect.appendChild(option);
  //   }
  // }
});
var monthSelect_ps = document.getElementById("bill-month-add-ps");
var yearSelect_ps = document.getElementById("bill-year-add-ps");
var classsSelect_ps = document.getElementById("bill-class-add-ps");

monthSelect_ps.addEventListener("change", updateclasssOptions2);
yearSelect_ps.addEventListener("change", updateclasssOptions2);
var addedClasses_ps = [];
var classData_ps = [];
async function updateclasssOptions2() {
  var selectedMonth = monthSelect_ps.value;
  var selectedYear = yearSelect_ps.value;

  classData_ps = [];

  if (selectedMonth && selectedYear) {
    try {
      const res = await fetch(
        `${API_URL}/api/search-class-work?month=${selectedMonth}&year=${selectedYear}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 200) {
        const resData = await res.json();
        classData_ps = resData;
      }
    } catch (error) {
      console.log("fetchCost error", error);
    }
  }
  console.log("classData_ps", classData_ps);

  var check = true;

  while (classsSelect_ps.options.length > 0) {
    classsSelect_ps.remove(0);
  }

  // Add default option
  var defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Chọn lớp học";
  classsSelect_ps.appendChild(defaultOption);

  addedClasses = [];

  if (classData_ps.length > 0) {
    classData_ps.forEach((item) => {
      addedClasses.push(item);
      var option = document.createElement("option");
      option.value = item.id;
      option.text = item.code;
      classsSelect_ps.add(option);
    });
  }
}

document
  .getElementById("sumit-bill-add-ps")
  .addEventListener("click", async function (event) {
    var check = true;

    event.preventDefault();
    const name_bill = document.getElementById("bill-name-add-ps").value;
    const month_bill = document.getElementById("bill-month-add-ps").value;
    const year_bill = document.getElementById("bill-year-add-ps").value;
    const name_student = document.getElementById("name-student-add-bill").value;
    const class_bill = document.getElementById("bill-class-add-ps").value;

    //Kiểm tra dữ liệu nhập vào

    if (!name_bill) {
      document.getElementById("lb-name-add-ps").textContent =
        "*Chưa nhập tên hóa đơn";
      check = false;
    } else document.getElementById("lb-name-add-ps").textContent = "";

    if (!month_bill) {
      document.getElementById("lb-time-add-ps").textContent =
        "*Chưa chọn thời gian";
      check = false;
    } else document.getElementById("lb-time-add-ps").textContent = "";

    if (!year_bill) {
      document.getElementById("lb-time-add-ps").textContent =
        "*Chưa chọn thời gian";
      check = false;
    } else document.getElementById("lb-time-add-ps").textContent = "";

    if (!class_bill) {
      document.getElementById("lb-class-add-ps").textContent = "*Chưa chọn lớp";
      check = false;
    } else document.getElementById("lb-class-add-ps").textContent = "";

    if (!name_student) {
      document.getElementById("lb-name-student-add-bill").textContent =
        "*Chưa chọn học sinh";
      check = false;
    } else document.getElementById("lb-name-student-add-bill").textContent = "";

    if (!check) return;
    try {
      showSpinner();
      const res = await fetch(`${API_URL}/api/cost-to-student`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name_bill,
          classId: Number(class_bill),
          month: Number(month_bill),
          year: Number(year_bill),
          studentId: Number(name_student),
        }),
      });

      const resData = await res.json();

      if (res.status === 200) {
        await fetchCost();

        searchList(currentPage);

        hideSpinner();

        document.getElementById("tb1").innerHTML =
          "Đã thêm hóa đơn " +
          month_bill +
          "/" +
          year_bill +
          " của học viên" +
          " thành công! ";

        document.querySelector(".add-success").style.display = "block";
        document.getElementById("form-add-bill-ps").reset();
        setTimeout(function () {
          document.querySelector(".add-success").style.display = "none";
        }, 1500);
      } else {
        hideSpinner();
        console.log("Error: ", resData.message || "Có lỗi xảy ra");

        document.getElementById("text-mess").innerText = resData.message;
        document.querySelector(".add-bill-warning").style.display = "block";
        document.querySelector("#modal-ques").style.display = "block";
      }
    } catch (error) {
      hideSpinner();
      console.log("add bill error", error);
    }
  });

document.getElementById("close").addEventListener("click", () => {
  document.querySelector(".delete-cant").style.display = "none";
});
//thong tin chi tiet hoa don

const rows = document.querySelectorAll(".tbody-1 tr");
const modalBg = document.querySelector(".modal-bg");
const modalContent = document.querySelector(".modal-content");

var maHD_select;
var hoaDon_select;

var lsthp = [];
function handleRowClick(index) {
  // var selectedRow = rows[index].cells[1];

  document.getElementById("btn-tab-3-1").classList.add("active");
  document.getElementById("btn-tab-3-2").classList.remove("active");
  document.getElementById("btn-tab-3-2").classList.remove("active");
  document.getElementById("tab-3-1").style.display = "block";
  document.getElementById("tab-3-2").style.display = "none";
  document.getElementById("tab-3-3").style.display = "none";

  maHD_select = index;

  for (var i = 0; i < dsHoaDon.length; i++) {
    if (maHD_select == dsHoaDon[i].id) hoaDon_select = dsHoaDon[i];
  }

  console.log("hoaDon_select", hoaDon_select);

  document.getElementById("id-bill-detail").textContent = hoaDon_select.id;
  document.getElementById("name-bill-detail").textContent = hoaDon_select.name;
  document.getElementById("class-bill-detail").textContent =
    hoaDon_select.class.code;
  document.getElementById("center-bill-detail").textContent = getCenterNameById(
    hoaDon_select.class.centerId
  );
  document.getElementById("id-st-detail").textContent =
    hoaDon_select.user.student.id;
  document.getElementById("name-st-bill-detail").textContent =
    hoaDon_select.user.student.name;
  document.getElementById(
    "time-bill-detail"
  ).textContent = `${hoaDon_select.forMonth}/${hoaDon_select.forYear}`;
  document.getElementById("st-bill-detail").textContent = formatMoney(
    hoaDon_select.originTotalMoney
  );
  document.getElementById("ghp-bill-detail").textContent =
    hoaDon_select.studentClass.reducePercent + "%";
  document.getElementById("stg-bill-detail").textContent = formatMoney(
    hoaDon_select.totalReduceMoney
  );
  document.getElementById("stpd-bill-detail").textContent = formatMoney(
    hoaDon_select.totalMoney
  );
  document.getElementById("stdd-bill-detail").textContent = formatMoney(
    hoaDon_select.paidMoney
  );
  document.getElementById("npcl-bill-detail").textContent = formatMoney(
    hoaDon_select.debtMoney
  );
  document.getElementById("status-bill-detail").textContent = getCostStatus(
    hoaDon_select.status
  );
  // var hp = 0;
  // for (var i = 0; i < ds_hs_hocphi.length; i++) {
  //   if (
  //     hoaDon_select.MaHS == ds_hs_hocphi[i].MaHS &&
  //     hoaDon_select.MaLop == ds_hs_hocphi[i].MaLop
  //   )
  //     hp = ds_hs_hocphi[i].HocPhi;
  // }
  document.getElementById("fee-bill-detail").textContent =
    numberWithCommas(hoaDon_select.class.fee) + " /buổi";

  document.getElementById("session-bill-detail").textContent =
    hoaDon_select.class.joinCount;

  if (hoaDon_select.status === CostStatus.Done) {
    color = "green";
  } else if (hoaDon_select.status === CostStatus.Pending) {
    color = "red";
  } else {
    color = "blue";
  }
  document.getElementById("status-bill-detail").style.color = color;

  document.getElementById("mahd-delete").value = hoaDon_select.id;
  // document.getElementById("mahd-delete-2").value = hoaDon_select.id;
  modalBg.style.display = "block";

  // lich sử thu học phí

  lsthp = hoaDon_select.transactions;

  lsthp.sort((a, b) => new Date(b.timerTime) - new Date(a.timerTime));

  document.getElementById("id-bill-lsthp").textContent = numberWithCommas(
    hoaDon_select.id
  );
  document.getElementById("stpd-lsthp").textContent = numberWithCommas(
    hoaDon_select.totalMoney
  );

  var tbody = document.getElementById("tbody-lsthp");

  var rowsHTML = "";
  var tt = 0;
  if (lsthp.length != 0) {
    lsthp.forEach((item, index) => {
      rowsHTML +=
        "<tr>" +
        "<td>" +
        (index + 1) +
        "</td>" +
        "<td>" +
        item.id +
        "</td>" +
        // '<td class="thoi-gian">' + convertDateFormat(giaoDich.ThoiGian) + '</td>' +
        '<td> <input type="date" value ="' +
        item.timerTime.split("T")[0] +
        '" required>' +
        "</td>" +
        '<td  class="so-tien" pattern="[0-9,]+">' +
        numberWithCommas(item.totalMoney) +
        "</td>" +
        "<td>" +
        '<button type ="button" id="edit-lsthp-btn" class="btn-edit-lsthp" onclick="editRow(' +
        index +
        ')" style ="background-color: rosybrown">Sửa</button>' +
        '<button type ="button" id="delete-lsthp-btn" class="btn-edit-lsthp" onclick="deleteRow(' +
        item.id +
        ')" style ="background-color: rebeccapurple">Xoá</button>' +
        "</td>" +
        "</tr>";
      tt += parseInt(item.totalMoney);
    });
    rowsHTML +=
      "<tr>" +
      "<td> </td>" +
      "<td> </td>" +
      "<td> Tổng tiền : </td>" +
      '<td id="total-amount-cell">' +
      numberWithCommas(tt) +
      "</td>" +
      '<td > <button  onclick="updateLSTHP()" class="btn-edit-lsthp"  id="btn-update-lsthp" style ="background-color: orangered">Cập nhật</button></td>' +
      "</tr>";

    rowsHTML +=
      "<tr>" +
      "<td> </td>" +
      "<td> </td>" +
      "<td> Nợ phí còn lại : </td>" +
      '<td id="npcl-amount-cell">' +
      numberWithCommas(hoaDon_select.totalMoney - tt) +
      "</td>" +
      '<td "></td>' +
      "</tr>";
  } else
    rowsHTML +=
      "<td> <strong> Hóa đơn chưa có dữ liệu thanh toán  </strong> </td>";

  tbody.innerHTML = rowsHTML;
}

document.querySelector(".close-btn").addEventListener("click", () => {
  modalBg.style.display = "none";

  document.getElementById("tbody-lsthp").innerHTML = "";
});

//Sua thong tin hoa don
const editButton = document.getElementById("edit-button");
const modalBgEdit = document.querySelector(".modal-bg-edit");
const modalContentEdit = document.querySelector(".modal-content-edit");

// Khi  nhấn vào nút "Sửa"

editButton.addEventListener("click", () => {
  var time = hoaDon_select.ThoiGian;
  var tt = hoaDon_select.TrangThai;
  numbers = time.split("/");

  var month = parseInt(numbers[0]);
  var year = parseInt(numbers[1]);

  var select = document.getElementById("month-bill-edit");
  for (var i = 0; i < select.options.length; i++) {
    var option = select.options[i];
    if (parseInt(option.value) === month) {
      option.selected = true;
    }
  }
  select = document.getElementById("year-bill-edit");
  for (var i = 0; i < select.options.length; i++) {
    var option = select.options[i];
    if (parseInt(option.value) === year) {
      option.selected = true;
    }
  }

  select = document.getElementById("status-bill-edit");
  for (var i = 0; i < select.options.length; i++) {
    var option = select.options[i];
    if (option.value == tt) {
      option.selected = true;
    }
  }

  document.getElementById("id-bill-edit").value = hoaDon_select.MaHD;
  document.getElementById("name-bill-edit").value = hoaDon_select.TenHD;
  document.getElementById("id-st-bill-edit").value = hoaDon_select.MaHS;
  document.getElementById("name-st-bill-edit").value = hoaDon_select.TenHS;
  document.getElementById("class-bill-edit").value = hoaDon_select.MaLop;
  document.getElementById("st-bill-edit").value = numberWithCommas(
    hoaDon_select.SoTien
  );

  document.getElementById("ghp-bill-edit").value =
    hoaDon_select.GiamHocPhi + "%";
  document.getElementById("stg-bill-edit").value = numberWithCommas(
    hoaDon_select.SoTienGiam
  );
  document.getElementById("stpd-bill-edit").value = numberWithCommas(
    hoaDon_select.SoTienPhaiDong
  );
  document.getElementById("stdd-bill-edit").value = numberWithCommas(
    hoaDon_select.SoTienDaDong
  );
  document.getElementById("npcl-bill-edit").value = numberWithCommas(
    hoaDon_select.NoPhiConLai
  );

  modalBgEdit.style.display = "block";
});

document
  .getElementById("btn-cancle-edit-bill")
  .addEventListener("click", () => {
    modalBgEdit.style.display = "none";
  });

// Cap nhat sua hoa don
document
  .getElementById("update-bill-edit")
  .addEventListener("click", function (event) {
    var check = true;
    event.preventDefault();
    const form = document.getElementById("form-edit-bill");

    var name = document.getElementById("name-bill-edit").value;

    if (!name) {
      document.getElementById("err-name-bill-edit").textContent =
        "*Chưa nhập tên hóa đơn";
      check = false;
    } else document.getElementById("err-name-bill-edit").textContent = "";

    if (!check) return;

    document.getElementById("tb1").innerHTML = "Cập nhật hóa đơn thành công! ";

    document.querySelector(".add-success").style.display = "block";

    setTimeout(function () {
      document.querySelector(".add-success").style.display = "none";
      form.submit();
    }, 1500);
  });

// Xoa hoa don

document.getElementById("btn-delete-bill").addEventListener("click", () => {
  document.querySelector(".delete-bill-ques").style.display = "block";
  document.querySelector("#modal-ques").style.display = "block";
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

    if (hoaDon_select.paidMoney != 0) {
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
        document.getElementById("tbody-lsthp").innerHTML = "";
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

document
  .getElementById("btn-cancle-add-bill-warning")
  .addEventListener("click", () => {
    document.querySelector(".add-bill-warning").style.display = "none";
    document.querySelector("#modal-ques").style.display = "none";
  });

// them giao dich
function checkDays() {
  var month = document.getElementById("month-add-trans").value;
  var year = document.getElementById("year-add-trans").value;
  var daySelect = document.getElementById("day-add-trans");

  while (daySelect.options.length > 0) {
    daySelect.remove(0);
  }
  var daysInMonth = new Date(year, month, 0).getDate();
  for (var i = 1; i <= daysInMonth; i++) {
    var option = document.createElement("option");
    option.text = i;
    option.value = i;
    daySelect.add(option);
  }
}

function formatNumber(input) {
  var value = input.value;
  value = value.replace(/[,\s]/g, "");
  value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  input.value = value;
}

document.getElementById("btn-add-trans").addEventListener("click", () => {
  document.querySelector("#div-add-trans").style.display = "block";
  document.querySelector("#modal-add-trans").style.display = "block";
});

document
  .getElementById("form-add-trans")
  .addEventListener("submit", async function (event) {
    var check = true;
    event.preventDefault();

    const money = document.getElementById("money-add-trans").value;
    const date = document.getElementById("date-add-trans").value;

    console.log("date", convertDateToIOS(date));
    console.log("money", convertToMoney(money));

    if (!money) {
      document.getElementById("lb-money-add-trans").textContent =
        "*Chưa nhập số tiền";
      check = false;
    } else document.getElementById("lb-money-add-trans").textContent = "";

    if (!check) return;

    try {
      showSpinner();
      const res = await fetch(`${API_URL}/api/transaction`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          costId: hoaDon_select.id,
          totalMoney: convertToMoney(money),
          timerTime: convertDateToIOS(date),
        }),
      });

      if (res.status === 200) {
        await fetchCost();

        for (var i = 0; i < dsHoaDon.length; i++) {
          if (hoaDon_select.id == dsHoaDon[i].id) hoaDon_select = dsHoaDon[i];
        }

        document.getElementById("stdd-bill-detail").textContent = formatMoney(
          hoaDon_select.paidMoney
        );
        document.getElementById("npcl-bill-detail").textContent = formatMoney(
          hoaDon_select.debtMoney
        );
        document.getElementById("status-bill-detail").textContent =
          getCostStatus(hoaDon_select.status);

        if (hoaDon_select.status === CostStatus.Done) {
          color = "green";
        } else if (hoaDon_select.status === CostStatus.Pending) {
          color = "red";
        } else {
          color = "blue";
        }

        document.getElementById("status-bill-detail").style.color = color;

        //
        lsthp = hoaDon_select.transactions;

        lsthp.sort((a, b) => new Date(b.timerTime) - new Date(a.timerTime));

        document.getElementById("id-bill-lsthp").textContent = numberWithCommas(
          hoaDon_select.id
        );
        document.getElementById("stpd-lsthp").textContent = numberWithCommas(
          hoaDon_select.totalMoney
        );

        var rowsHTML = "";
        var tt = 0;
        if (lsthp.length != 0) {
          lsthp.forEach((item, index) => {
            rowsHTML +=
              "<tr>" +
              "<td>" +
              (index + 1) +
              "</td>" +
              "<td>" +
              item.id +
              "</td>" +
              // '<td class="thoi-gian">' + convertDateFormat(giaoDich.ThoiGian) + '</td>' +
              '<td> <input type="date" value ="' +
              item.timerTime.split("T")[0] +
              '" required>' +
              "</td>" +
              '<td  class="so-tien" pattern="[0-9,]+">' +
              numberWithCommas(item.totalMoney) +
              "</td>" +
              "<td>" +
              '<button type ="button" id="edit-lsthp-btn" class="btn-edit-lsthp" onclick="editRow(' +
              index +
              ')" style ="background-color: rosybrown">Sửa</button>' +
              '<button type ="button" id="delete-lsthp-btn" class="btn-edit-lsthp" onclick="deleteRow(' +
              item.id +
              ')" style ="background-color: rebeccapurple">Xoá</button>' +
              "</td>" +
              "</tr>";
            tt += parseInt(item.totalMoney);
          });
          rowsHTML +=
            "<tr>" +
            "<td> </td>" +
            "<td> </td>" +
            "<td> Tổng tiền : </td>" +
            '<td id="total-amount-cell">' +
            numberWithCommas(tt) +
            "</td>" +
            '<td > <button  onclick="updateLSTHP()" class="btn-edit-lsthp"  id="btn-update-lsthp" style ="background-color: orangered">Cập nhật</button></td>' +
            "</tr>";

          rowsHTML +=
            "<tr>" +
            "<td> </td>" +
            "<td> </td>" +
            "<td> Nợ phí còn lại : </td>" +
            '<td id="npcl-amount-cell">' +
            numberWithCommas(hoaDon_select.totalMoney - tt) +
            "</td>" +
            '<td "></td>' +
            "</tr>";
        } else
          rowsHTML +=
            "<td> <strong> Hóa đơn chưa có dữ liệu thanh toán  </strong> </td>";

        document.getElementById("tbody-lsthp").innerHTML = rowsHTML;

        searchList(currentPage);

        hideSpinner();

        document.querySelector("#div-add-trans").style.display = "none";
        document.querySelector("#modal-add-trans").style.display = "none";
        document.getElementById("money-add-trans").value = "";
        document.getElementById("date-add-trans").value = "";

        document.getElementById("tb1").innerHTML =
          "Đã thêm trạng giao dịch thành công !";

        document.querySelector(".add-success").style.display = "block";

        setTimeout(function () {
          document.querySelector(".add-success").style.display = "none";
        }, 1500);
      }
    } catch (error) {
      hideSpinner();
      console.log("add bill error", error);
    }
  });

document.getElementById("canle-add-trans").addEventListener("click", () => {
  document.querySelector("#div-add-trans").style.display = "none";
  document.querySelector("#modal-add-trans").style.display = "none";
  document.getElementById("money-add-trans").value = "";
  document.getElementById("date-add-trans").value = "";
});

//sua lich su thu hoc phi
function editRow(index) {
  tbody = document.getElementById("tbody-lsthp");
  //var soTienCell = document.getElementsByClassName("so-tien")[index];
  var soTienCell = tbody.rows[index].querySelector(".so-tien");

  // Cho phép chỉnh sửa cột "Số tiền"
  var st = soTienCell.textContent;
  soTienCell.contentEditable = true;
  soTienCell.style.backgroundColor = "#f9f9f9";
  soTienCell.style.border = "double";

  soTienCell.addEventListener("blur", function () {
    soTienCell.contentEditable = false;
    soTienCell.style.backgroundColor = "";
    soTienCell.style.border = "";
    var value = parseNumericValue(this.textContent);
    if (!value) {
      this.textContent = st;
    } else {
      this.textContent = numberWithCommas(value);
      updateTotalAmount();
    }
  });
}

//tt
function updateTotalAmount() {
  var totalAmount = 0;
  var soTienCells = document.getElementsByClassName("so-tien");

  for (var i = 0; i < soTienCells.length; i++) {
    var value = parseNumericValue(soTienCells[i].textContent);
    totalAmount += parseInt(value);
  }

  var totalAmountCell = document.getElementById("total-amount-cell");
  totalAmountCell.textContent = numberWithCommas(totalAmount);

  document.getElementById("npcl-amount-cell").textContent = numberWithCommas(
    parseNumericValue(document.getElementById("stpd-lsthp").textContent) -
      totalAmount
  );
}
//cap nhat lsthp
function getUpdateLSTHP() {
  var updatedData = [];

  tbody = document.getElementById("tbody-lsthp");
  var rows = tbody.querySelectorAll("tr");

  for (var i = 0; i < rows.length - 2; i++) {
    var row = rows[i];
    var inputs = row.getElementsByTagName("input");
    var id = parseInt(row.cells[1].innerText);
    var timerTime = convertDateToIOS(inputs[0].value);
    var totalMoney = convertToMoney(row.cells[3].innerText);

    updatedData.push({
      id: id,
      timerTime: timerTime,
      totalMoney: totalMoney,
    });
  }

  return updatedData;
}

async function updateLSTHP() {
  var selectedRows = Array.from(
    document.querySelectorAll('#tbody-lsthp input[type="checkbox"]:checked')
  ).map(function (checkbox) {
    return checkbox.closest("tr");
  });

  // Remove the selected rows from the table
  selectedRows.forEach(function (row) {
    row.remove();
  });

  // Update the remaining rows' index
  var tbody = document.getElementById("tbody-lsthp");
  var rows = tbody.querySelectorAll("tr");
  rows.forEach(function (row, index) {
    row.cells[0].textContent = index + 1;
  });

  var updatedData = getUpdateLSTHP();

  var totalAmount = parseNumericValue(
    document.getElementById("total-amount-cell").textContent
  );
  var remainingFee = parseNumericValue(
    document.getElementById("npcl-amount-cell").textContent
  );

  console.log("updatedData", updatedData);

  try {
    showSpinner();
    const promises = updatedData.map((data) => {
      return fetch(`${API_URL}/api/transaction/${data.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          totalMoney: data.totalMoney,
          timerTime: data.timerTime,
        }),
      });
    });

    const responses = await Promise.all(promises);
    const allSuccess = responses.every((response) => response.status === 200);
    if (allSuccess) {
      await fetchCost();
      for (var i = 0; i < dsHoaDon.length; i++) {
        if (hoaDon_select.id == dsHoaDon[i].id) hoaDon_select = dsHoaDon[i];
      }

      document.getElementById("stdd-bill-detail").textContent = formatMoney(
        hoaDon_select.paidMoney
      );
      document.getElementById("npcl-bill-detail").textContent = formatMoney(
        hoaDon_select.debtMoney
      );
      document.getElementById("status-bill-detail").textContent = getCostStatus(
        hoaDon_select.status
      );

      if (hoaDon_select.status === CostStatus.Done) {
        color = "green";
      } else if (hoaDon_select.status === CostStatus.Pending) {
        color = "red";
      } else {
        color = "blue";
      }

      document.getElementById("status-bill-detail").style.color = color;

      //
      lsthp = hoaDon_select.transactions;
      lsthp.sort((a, b) => new Date(b.timerTime) - new Date(a.timerTime));

      document.getElementById("id-bill-lsthp").textContent = numberWithCommas(
        hoaDon_select.id
      );
      document.getElementById("stpd-lsthp").textContent = numberWithCommas(
        hoaDon_select.totalMoney
      );

      var rowsHTML = "";
      var tt = 0;
      if (lsthp.length != 0) {
        lsthp.forEach((item, index) => {
          rowsHTML +=
            "<tr>" +
            "<td>" +
            (index + 1) +
            "</td>" +
            "<td>" +
            item.id +
            "</td>" +
            // '<td class="thoi-gian">' + convertDateFormat(giaoDich.ThoiGian) + '</td>' +
            '<td> <input type="date" value ="' +
            item.timerTime.split("T")[0] +
            '" required>' +
            "</td>" +
            '<td  class="so-tien" pattern="[0-9,]+">' +
            numberWithCommas(item.totalMoney) +
            "</td>" +
            "<td>" +
            '<button type ="button" id="edit-lsthp-btn" class="btn-edit-lsthp" onclick="editRow(' +
            index +
            ')" style ="background-color: rosybrown">Sửa</button>' +
            '<button type ="button" id="delete-lsthp-btn" class="btn-edit-lsthp" onclick="deleteRow(' +
            item.id +
            ')" style ="background-color: rebeccapurple">Xoá</button>' +
            "</td>" +
            "</tr>";
          tt += parseInt(item.totalMoney);
        });
        rowsHTML +=
          "<tr>" +
          "<td> </td>" +
          "<td> </td>" +
          "<td> Tổng tiền : </td>" +
          '<td id="total-amount-cell">' +
          numberWithCommas(tt) +
          "</td>" +
          '<td > <button  onclick="updateLSTHP()" class="btn-edit-lsthp"  id="btn-update-lsthp" style ="background-color: orangered">Cập nhật</button></td>' +
          "</tr>";

        rowsHTML +=
          "<tr>" +
          "<td> </td>" +
          "<td> </td>" +
          "<td> Nợ phí còn lại : </td>" +
          '<td id="npcl-amount-cell">' +
          numberWithCommas(hoaDon_select.totalMoney - tt) +
          "</td>" +
          '<td "></td>' +
          "</tr>";
      } else
        rowsHTML +=
          "<td> <strong> Hóa đơn chưa có dữ liệu thanh toán  </strong> </td>";

      document.getElementById("tbody-lsthp").innerHTML = rowsHTML;

      searchList(currentPage);

      hideSpinner();
      document.getElementById("tb1").innerHTML = "Đã cập nhật thành công!";

      document.querySelector(".add-success").style.display = "block";

      setTimeout(function () {
        document.querySelector(".add-success").style.display = "none";
      }, 1500);
    }
  } catch (error) {
    hideSpinner();
    console.log("Error:", error);
  }

  // Submit the form
}

async function deleteRow(index) {
  document.querySelector(".delete-ques-trans").style.display = "block";
  document.querySelector("#modal-ques-trans").style.display = "block";

  document
    .getElementById("delete-trans")
    .addEventListener("click", async () => {
      document.querySelector(".delete-ques-trans").style.display = "none";
      document.querySelector("#modal-ques-trans").style.display = "none";

      showSpinner();
      try {
        const response = await fetch(`${API_URL}/api/transaction/${index}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        if (response.status === 200) {
          await fetchCost();

          for (var i = 0; i < dsHoaDon.length; i++) {
            if (hoaDon_select.id == dsHoaDon[i].id) hoaDon_select = dsHoaDon[i];
          }

          document.getElementById("stdd-bill-detail").textContent = formatMoney(
            hoaDon_select.paidMoney
          );
          document.getElementById("npcl-bill-detail").textContent = formatMoney(
            hoaDon_select.debtMoney
          );
          document.getElementById("status-bill-detail").textContent =
            getCostStatus(hoaDon_select.status);

          if (hoaDon_select.status === CostStatus.Done) {
            color = "green";
          } else if (hoaDon_select.status === CostStatus.Pending) {
            color = "red";
          } else {
            color = "blue";
          }

          document.getElementById("status-bill-detail").style.color = color;

          //
          lsthp = hoaDon_select.transactions;
          lsthp.sort((a, b) => new Date(b.timerTime) - new Date(a.timerTime));

          document.getElementById("id-bill-lsthp").textContent =
            numberWithCommas(hoaDon_select.id);
          document.getElementById("stpd-lsthp").textContent = numberWithCommas(
            hoaDon_select.totalMoney
          );

          var rowsHTML = "";
          var tt = 0;
          if (lsthp.length != 0) {
            lsthp.forEach((item, index) => {
              rowsHTML +=
                "<tr>" +
                "<td>" +
                (index + 1) +
                "</td>" +
                "<td>" +
                item.id +
                "</td>" +
                // '<td class="thoi-gian">' + convertDateFormat(giaoDich.ThoiGian) + '</td>' +
                '<td> <input type="date" value ="' +
                item.timerTime.split("T")[0] +
                '" required>' +
                "</td>" +
                '<td  class="so-tien" pattern="[0-9,]+">' +
                numberWithCommas(item.totalMoney) +
                "</td>" +
                "<td>" +
                '<button type ="button" id="edit-lsthp-btn" class="btn-edit-lsthp" onclick="editRow(' +
                index +
                ')" style ="background-color: rosybrown">Sửa</button>' +
                '<button type ="button" id="delete-lsthp-btn" class="btn-edit-lsthp" onclick="deleteRow(' +
                item.id +
                ')" style ="background-color: rebeccapurple">Xoá</button>' +
                "</td>" +
                "</tr>";
              tt += parseInt(item.totalMoney);
            });
            rowsHTML +=
              "<tr>" +
              "<td> </td>" +
              "<td> </td>" +
              "<td> Tổng tiền : </td>" +
              '<td id="total-amount-cell">' +
              numberWithCommas(tt) +
              "</td>" +
              '<td > <button  onclick="updateLSTHP()" class="btn-edit-lsthp"  id="btn-update-lsthp" style ="background-color: orangered">Cập nhật</button></td>' +
              "</tr>";

            rowsHTML +=
              "<tr>" +
              "<td> </td>" +
              "<td> </td>" +
              "<td> Nợ phí còn lại : </td>" +
              '<td id="npcl-amount-cell">' +
              numberWithCommas(hoaDon_select.totalMoney - tt) +
              "</td>" +
              '<td "></td>' +
              "</tr>";
          } else
            rowsHTML +=
              "<td> <strong> Hóa đơn chưa có dữ liệu thanh toán  </strong> </td>";

          document.getElementById("tbody-lsthp").innerHTML = rowsHTML;

          searchList(currentPage);

          hideSpinner();

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
    .getElementById("btn-cancle-delete-trans")
    .addEventListener("click", () => {
      document.querySelector(".delete-ques-trans").style.display = "none";
      document.querySelector("#modal-ques-trans").style.display = "none";
    });
}

document
  .getElementById("delete-trans")
  .addEventListener("click", function (event) {
    document.querySelector(".delete-ques-trans").style.display = "none";
    document.querySelector("#modal-ques-trans").style.display = "none";
  });

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
