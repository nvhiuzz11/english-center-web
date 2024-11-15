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
var selectedKind = "";
var selectedStatus = "";
var selectedCenter = "";
var dateFilter = "";
var listCenter;

const accessToken = localStorage.getItem("accessToken");

const store_ds_hoadon_khac = localStorage.getItem("ds_hoadon_khac");
if (store_ds_hoadon_khac) {
  dsHoaDon = JSON.parse(store_ds_hoadon_khac);
  console.log("store_ds_hoadon_khac", dsHoaDon);
  hienthids(
    selectedCenter,
    selectedStatus,
    selectedKind,
    dsHoaDon,
    currentPage,
    dateFilter
  );
}

fetchCost();

listCenter = JSON.parse(localStorage.getItem("listCenter"));

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
      var select2 = document.getElementById("bill-center-add");
      var select3 = document.getElementById("bill-center-edit");

      listCenter.forEach((center) => {
        const option = document.createElement("option");
        option.value = center.id;
        option.text = `Cơ sở ${center.id}: ${center.name}`;

        select1.appendChild(option);
      });

      listCenter.forEach((center) => {
        const option = document.createElement("option");
        option.value = center.id;
        option.text = `Cơ sở ${center.id}: ${center.name}`;

        select2.appendChild(option);
      });

      listCenter.forEach((center) => {
        const option = document.createElement("option");
        option.value = center.id;
        option.text = `Cơ sở ${center.id}: ${center.name}`;

        select3.appendChild(option);
      });

      localStorage.setItem("listCenter", JSON.stringify(listCenter));
    })
    .catch((error) => {
      console.log("Error:", error);
    });
}

function showSpinner() {
  document.getElementById("loadingSpinner").style.display = "flex";
}

function hideSpinner() {
  document.getElementById("loadingSpinner").style.display = "none";
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

function getCostType(type) {
  if (type == CostType.ElecFee) {
    return "Tiền điện";
  } else if (type == CostType.WaterFee) {
    return "Tiền nước";
  } else {
    return "Khác";
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

async function fetchCost() {
  if (!dsHoaDon) {
    showSpinner();
  }
  try {
    const res = await fetch(`${API_URL}/api/costs?multipleType=3;4;5`, {
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

      localStorage.setItem("ds_hoadon_khac", JSON.stringify(dsHoaDon));

      hienthids(
        selectedCenter,
        selectedStatus,
        selectedKind,
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

function cleanSeparatorNumber(numberString) {
  let cleanedNumber = numberString.replace(/,/g, "");
  return parseInt(cleanedNumber, 10);
}

// Mặc định hiển thị tab đầu tiên
document.getElementById("Tab1").style.display = "block";
document.getElementById("btn-tab2").classList.add("active");

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
//Hiẹn thị bảng

function hienthids(center, status, kind, listData, page, date) {
  document.querySelector(".tbody-1").innerHTML = "";
  document.querySelector(".tbody-5").innerHTML = "";

  var filteredData = listData;
  if (status && kind) {
    filteredData = filteredData.filter(function (item) {
      return item.status == status;
    });

    filteredData = filteredData.filter(function (hoaDon) {
      return hoaDon.type == kind;
    });
  } else {
    if (kind) {
      filteredData = dsHoaDon.filter(function (hoaDon) {
        return hoaDon.type == kind;
      });
    } else if (status) {
      filteredData = dsHoaDon.filter(function (hoaDon) {
        return hoaDon.status == status;
      });
    }
  }

  if (center) {
    filteredData = filteredData.filter(function (hoaDon) {
      return hoaDon.referenceId == center;
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
    return;
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
        getCostType(item.type) +
        "</td>";
      html +=
        '<td style = "background-color:' +
        color +
        '">' +
        `${item.forMonth}/${item.forYear}` +
        "</td>";
      if (item.center) {
        html +=
          '<td style = "background-color:' +
          color +
          '">' +
          item.center.name +
          "</td>";
      } else {
        html += '<td style = "background-color:' + color + '">' + "</td>";
      }

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
    html_last += "<td >" + "Tổng : </td>";
    html_last += "<td >" + numberWithCommas(tongSoTien) + "</td>";
    html_last += "<td >" + "Đã thanh toán :</td>";
    html_last += "<td >" + numberWithCommas(tienDaTT) + "(" + dem1 + ")</td>";
    html_last += "</tr>";

    html_last += "<tr>";
    html_last += '<td style="width:20px ;  ">' + "</td>";
    html_last += "<td >" + "</td>";
    html_last += "<td >" + "</td>";
    html_last += "<td >" + "</td>";
    html_last += "<td >" + " </td>";
    html_last += "<td >" + "</td>";
    html_last += "<td >" + "Chưa thanh toán :</td>";
    html_last += "<td >" + numberWithCommas(tienChuaTT) + "(" + dem0 + ")</td>";
    html_last += "</tr>";

    document.querySelector(".tbody-1").innerHTML = html;
    document.querySelector(".tbody-5").innerHTML = html_last;
  }
}

var selectKind = document.getElementById("select-kind-bill");
var selectStatus = document.getElementById("select-status");
var selectCenter = document.getElementById("select-center");
var check_status = false;
var check_kind = false;

selectStatus.addEventListener("change", function () {
  selectedStatus = selectStatus.value;
  currentPage = 1;
  searchList(1);
});

selectCenter.addEventListener("change", function () {
  selectedCenter = selectCenter.value;
  currentPage = 1;
  searchList(1);
});

selectKind.addEventListener("change", function () {
  selectedKind = selectKind.value;
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
      `${item.forMonth}/${item.forYear}`.toLowerCase().includes(lowerKeyword) ||
      String(item.totalMoney).includes(lowerKeyword) ||
      String(formatDateFromISO(item.paidAt)).includes(lowerKeyword)
    );
  });
}

function searchList(number = 1) {
  var text = document.getElementById("keyword").value;

  const listSearch = searchKey(text);

  hienthids(
    selectedCenter,
    selectedStatus,
    selectedKind,
    listSearch,
    currentPage,
    dateFilter
  );
  currentPage = number;
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
      columnIndex === 3 ||
      columnIndex === 5 ||
      columnIndex === 8
    ) {
      if (sortDirection[columnIndex] === "asc") {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    } else if (columnIndex === 0) {
      return;
    } else if (columnIndex === 4) {
      var aDate = parseDateValue(aValue);
      var bDate = parseDateValue(bValue);

      if (sortDirection[columnIndex] === "asc") {
        return aDate - bDate;
      } else {
        return bDate - aDate;
      }
    } else if (columnIndex === 7) {
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

document.querySelector(".add-bill-button").addEventListener("click", () => {
  modalBgAdd.style.display = "block";
});

var selectsx = document.getElementById("bill-year-add");
for (let year = 2022; year <= 2100; year++) {
  const option = document.createElement("option");
  option.value = year;
  option.text = year;

  selectsx.appendChild(option);
}

document.querySelector(".btn-close-add").addEventListener("click", () => {
  modalBgAdd.style.display = "none";
  document.getElementById("form-add-bill").reset();
  document.getElementById("lb-name-add").textContent = "";

  document.getElementById("lb-time-add").textContent = "";

  document.getElementById("lb-kind-add").textContent = "";

  document.getElementById("lb-money-add").textContent = "";
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
    const center_bill = document.getElementById("bill-center-add").value;
    const kind_bill = document.getElementById("bill-kind-add").value;
    const money = document.getElementById("money-add-bill").value;
    // const status = document.getElementById("bill-status-add").value;

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
    if (!kind_bill) {
      document.getElementById("lb-kind-add").textContent =
        "*Chưa chọn loại hóa đơn";
      check = false;
    } else document.getElementById("lb-kind-add").textContent = "";
    if (!money) {
      document.getElementById("lb-money-add").textContent = "*Chưa ghi số tiền";
      check = false;
    } else document.getElementById("lb-money-add").textContent = "";

    if (!check) return;

    showSpinner();
    try {
      const response = await fetch(`${API_URL}/api/cost-other`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name_bill,
          totalMoney: cleanSeparatorNumber(money),
          month: Number(month_bill),
          year: Number(year_bill),
          type: Number(kind_bill),
          centerId: center_bill ? Number(center_bill) : "",
        }),
      });

      if (response.status === 200) {
        const responseData = await response.json();
        console.log("responseData", responseData);
        await fetchCost();
        searchList(currentPage);

        hideSpinner();
        document.getElementById("tb1").innerHTML =
          'Đã thêm hóa đơn "' + name_bill + '"' + " thành công!";
        document.getElementById("form-add-bill").reset();
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

  document.getElementById("id-bill-detail").textContent = hoaDon_select.id;
  document.getElementById("name-bill-detail").textContent = hoaDon_select.name;
  document.getElementById("kind-bill-detail").textContent = getCostType(
    hoaDon_select.type
  );
  document.getElementById(
    "time-bill-detail"
  ).textContent = `${hoaDon_select.forMonth}/${hoaDon_select.forYear}`;

  if (hoaDon_select.center) {
    document.getElementById("time-center-detail").textContent =
      hoaDon_select.center.name;
  }

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
    const status = document.getElementById("status-detail").value;

    event.preventDefault();

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
  // var time = hoaDon_select.ThoiGian;
  // var tt = hoaDon_select.TrangThai;
  // var kind = hoaDon_select.LoaiHD;
  // numbers = time.split("/");

  // var month = parseInt(numbers[0]);
  // var year = parseInt(numbers[1]);

  var select = document.getElementById("bill-month-edit");

  for (var i = 0; i < select.options.length; i++) {
    var option = select.options[i];
    if (parseInt(option.value) == hoaDon_select.forMonth) {
      option.selected = true;
    }
  }

  select = document.getElementById("bill-year-edit");

  for (let year = 2022; year <= 2100; year++) {
    const option = document.createElement("option");
    option.value = year;
    option.text = year;

    select.appendChild(option);
  }

  for (var i = 0; i < select.options.length; i++) {
    var option = select.options[i];
    if (parseInt(option.value) == hoaDon_select.forYear) {
      option.selected = true;
    }
  }

  select = document.getElementById("bill-status-edit");
  for (var i = 0; i < select.options.length; i++) {
    var option = select.options[i];
    if (option.value == hoaDon_select.status) {
      option.selected = true;
    }
  }

  select = document.getElementById("bill-kind-edit");
  for (var i = 0; i < select.options.length; i++) {
    var option = select.options[i];
    if (option.value == hoaDon_select.type) {
      option.selected = true;
    }
  }

  if (hoaDon_select.center) {
    select = document.getElementById("bill-center-edit");
    for (var i = 0; i < select.options.length; i++) {
      var option = select.options[i];
      if (option.value == hoaDon_select.center.id) {
        option.selected = true;
      }
    }
  }

  document.getElementById("id-bill-edit").value = hoaDon_select.id;
  document.getElementById("bill-name-edit").value = hoaDon_select.name;

  document.getElementById("money-edit-bill").value = numberWithCommas(
    hoaDon_select.totalMoney
  );

  if (hoaDon_select.status == CostStatus.Done)
    document.getElementById("time-tt-edit-bill").value =
      hoaDon_select.paidAt.split("T")[0];

  // else {
  //     document.getElementById('time-tt-edit-bill').value = '';

  // }

  modalBgEdit.style.display = "block";
});

document.querySelector(".cancle-btn").addEventListener("click", () => {
  modalBgEdit.style.display = "none";

  document.getElementById("lb-name-edit").textContent = "";
  document.getElementById("lb-time-edit").textContent = "";
  document.getElementById("lb-kind-edit").textContent = "";
  document.getElementById("lb-money-edit").textContent = "";
  document.getElementById("lb-time-tt-edit").textContent = "";
  document.getElementById("form-edit-bill").reset();
});

// Cap nhat sua hoa don
document
  .getElementById("update-bill-edit")
  .addEventListener("click", async function (event) {
    var check = true;

    event.preventDefault();

    const name_bill = document.getElementById("bill-name-edit").value;
    const month_bill = document.getElementById("bill-month-edit").value;
    const year_bill = document.getElementById("bill-year-edit").value;
    const kind_bill = document.getElementById("bill-kind-edit").value;
    const money = document.getElementById("money-edit-bill").value;
    const time_tt = document.getElementById("time-tt-edit-bill").value;
    const status = document.getElementById("bill-status-edit").value;
    const center = document.getElementById("bill-center-edit").value;

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
    if (!kind_bill) {
      document.getElementById("lb-kind-edit").textContent =
        "*Chưa chọn loại hóa đơn";
      check = false;
    } else document.getElementById("lb-kind-edit").textContent = "";
    if (!money) {
      document.getElementById("lb-money-edit").textContent =
        "*Chưa ghi số tiền";
      check = false;
    } else document.getElementById("lb-money-edit").textContent = "";

    if (status == "Đã thanh toán") {
      if (!time_tt) {
        document.getElementById("lb-time-tt-edit").textContent =
          "*Chưa cập nhật thời gian thanh toán";
        check = false;
      } else document.getElementById("lb-time-tt-edit").textContent = "";
    }

    if (!check) return;

    console.log("centerId", center);

    showSpinner();
    try {
      const response = await fetch(`${API_URL}/api/cost/${hoaDon_select.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name_bill,
          paidMoney: status == 2 ? cleanSeparatorNumber(money) : null,
          type: Number(kind_bill),
          totalMoney: cleanSeparatorNumber(money),
          status: Number(status),
          forMonth: Number(month_bill),
          forYear: Number(year_bill),
          paidAt: status == 2 ? new Date(time_tt).toISOString() : null,
          centerId: center ? Number(center) : 0,
        }),
      });

      if (response.status === 200) {
        const responseData = await response.json();
        console.log("responseData", responseData);
        await fetchCost();
        searchList(currentPage);

        // Xử lý sự kiện khi bấm vào một dòng
        // var selectedRow = rows[index].cells[1];

        document.getElementById("btn-tab-3-1").classList.add("active");

        document.getElementById("tab-3-1").style.display = "block";

        for (var i = 0; i < dsHoaDon.length; i++) {
          if (hoaDon_select.id == dsHoaDon[i].id) hoaDon_select = dsHoaDon[i];
        }

        document.getElementById("id-bill-detail").textContent =
          hoaDon_select.id;
        document.getElementById("name-bill-detail").textContent =
          hoaDon_select.name;
        document.getElementById("kind-bill-detail").textContent = getCostType(
          hoaDon_select.type
        );
        if (hoaDon_select.center) {
          document.getElementById("time-center-detail").textContent =
            hoaDon_select.center.name;
        }
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

        hideSpinner();
        modalBgEdit.style.display = "none";
        document.getElementById("tb1").innerHTML =
          'Đã cập nhật sửa đổi  hóa đơn "' + name_bill + '"' + " thành công!";
        document.getElementById("form-edit-bill").reset();
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
//       url: "../api/deleteOtherFee.php",
//       type: "POST",
//       data: {
//         mahd: hoaDon_select.MaHD,
//       },
//       success: function (res) {
//         var text = document.getElementById("keyword").value;
//         showTableFinance(text, currentPage, collum, orderby, dateFilter);
//       },
//       error: function (xhr, status, error) {
//         console.error(error);
//       },
//     });

//     document.querySelector("#modal-ques").style.display = "none";
//     document.querySelector(".delete-bill-ques-2").style.display = "none";
//     modalBg.style.display = "none";
//     document.querySelector(".delete-success").style.display = "block";
//     setTimeout(function () {
//       document.querySelector(".delete-success").style.display = "none";
//     }, 1500);
//   });

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
