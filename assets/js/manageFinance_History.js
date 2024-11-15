const CostType = {
  TeacherSalary: 1,
  StudentFee: 2,
  ElecFee: 3,
  WaterFee: 4,
  OtherFee: 5,
  TeacherBonus: 6,
};

const HistoryType = {
  Income: 1,
  Expenditure: 2,
};

var listCenter;
var dsHoaDon;
var currentPage = 1;
var selectedKind = "";
var selectedCenter = "";
var fromDate;
var toDate;
const accessToken = localStorage.getItem("accessToken");

const store_ds_lichsu_thu_chi = localStorage.getItem("ds_lichsu_thu_chi");
if (store_ds_lichsu_thu_chi) {
  dsHoaDon = JSON.parse(store_ds_lichsu_thu_chi);
  console.log("store_ds_lichsu_thu_chi", dsHoaDon);
  hienthids(selectedKind, selectedCenter, dsHoaDon, currentPage);
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
    const res = await fetch(`${API_URL}/api/transactions`, {
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

      localStorage.setItem("ds_lichsu_thu_chi", JSON.stringify(dsHoaDon));

      hienthids(selectedKind, selectedCenter, dsHoaDon, currentPage);

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

var selectCenter = document.getElementById("select-center");

selectCenter.addEventListener("change", function () {
  selectedCenter = selectCenter.value;
  searchList(1);
});

function getHistoryType(type) {
  if (type == CostType.StudentFee) {
    return HistoryType.Income;
  } else {
    return HistoryType.Expenditure;
  }
}

function getCostType(type) {
  if (type == CostType.StudentFee) {
    return "Học phí";
  } else if (type == CostType.ElecFee) {
    return "Tiền điện";
  } else if (type == CostType.OtherFee) {
    return "Chi phí khác";
  } else if (type == CostType.TeacherSalary) {
    return "Lương giáo viên";
  } else if (type == CostType.WaterFee) {
    return "Tiền nước";
  } else if (type == CostType.TeacherBonus) {
    return "Lương thưởng";
  }
}

function formatDateFromISO(isoString) {
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

function formatMoney(number) {
  return Number(number).toLocaleString("en-US", {
    maximumFractionDigits: 2,
  });
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

// Mặc định hiển thị tab đầu tiên
document.getElementById("Tab1").style.display = "block";
document.getElementById("btn-tab3").classList.add("active");

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

//Hiẹn thị bảng
// var filteredData = dsHoaDon;

function getRecordByPage(list, page, pageSize = 50) {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  return list.slice(startIndex, endIndex);
}

function hienthids(kind, center, listData, page) {
  var filteredData = listData;

  if (kind) {
    filteredData = dsHoaDon.filter(function (hoaDon) {
      return getHistoryType(hoaDon.costType) == kind;
    });
  }

  if (fromDate && toDate) {
    filteredData = filteredData.filter((item) => {
      const itemDate = new Date(item.timerTime);
      return itemDate >= fromDate && itemDate <= toDate;
    });
  }

  if (center) {
    filteredData = filteredData.filter((bill) => {
      if (bill.costType == CostType.StudentFee) {
        if (bill?.cost?.class?.centerId == center) {
          return true;
        }
      } else if (bill.costType == CostType.TeacherSalary) {
        const hasCenterId = bill?.cost?.teachedInfo.some(
          (item) => item?.class?.centerId == center
        );
        return hasCenterId;
      } else if (
        bill.costType == CostType.ElecFee ||
        bill.costType == CostType.WaterFee ||
        bill.costType == CostType.OtherFee
      ) {
        if (bill?.cost?.centerId == center) {
          return true;
        }
      }

      // else{

      // }
    });
  }

  if (!filteredData.length) {
    document.querySelector(".tbody-1").innerHTML = "Không có kết quả phù hợp";
    document.querySelector(".tbody-5").innerHTML = "";
  } else {
    var html = "";
    var html_last = "";
    var color = "";
    var tongSoTien = 0;
    var tongThu = 0;
    var tongChi = 0;

    if (filteredData.length != 0) {
      showindex(filteredData.length);
      const listItem = getRecordByPage(filteredData, page, 50);
      let i = 1;
      listItem.filter((item) => {
        if (getHistoryType(item.costType) == HistoryType.Income) {
          tongThu += parseInt(item.totalMoney);
          color = "#84e3b5";
        } else {
          tongChi += parseInt(item.totalMoney);
          color = "#ffd093";
        }

        html += "<tr>";
        html +=
          '<td style="width:100px ;background-color:' +
          color +
          '">' +
          i++ +
          "</td>";
        html +=
          '<td style="width:100px ;background-color:' +
          color +
          '">' +
          item.costId +
          "</td>";
        html +=
          '<td style="background-color:' +
          color +
          '">' +
          item.cost.name +
          "</td>";

        var name = "";

        if (item.costType == CostType.StudentFee) {
          name += "HV: " + item.user.student.name;
        } else if (item.costType == CostType.TeacherSalary) {
          name += "GV: " + item.user.teacher.name;
        }

        html += '<td style="background-color:' + color + '">' + name + "</td>";
        html +=
          '<td style="background-color:' +
          color +
          '">' +
          getCostType(item.costType) +
          "</td>";
        html +=
          '<td style="background-color:' +
          color +
          '">' +
          formatDateFromISO(item.timerTime) +
          "</td>";
        html +=
          '<td style="background-color:' +
          color +
          '">' +
          numberWithCommas(item.totalMoney) +
          "</td>";
        html += "</tr>";

        tongSoTien += parseInt(item.totalMoney);
      });

      html_last += "<tr>";
      html_last +=
        '<td style="width:100px;display: flex; align-items: center"><div style="background-color:#84e3b5; width:10px; height:10px"> </div>: Thu <div style="background-color:#ffd093; width:10px; height:10px;margin-left:10px"> </div>: Chi</td>';
      html_last += "<td></td>";
      html_last += "<td>Tổng: " + numberWithCommas(tongSoTien) + "</td>";
      html_last += "<td>Thu: " + numberWithCommas(tongThu) + "</td>";
      html_last += "<td>Chi: " + numberWithCommas(tongChi) + "</td>";
      html_last +=
        "<td>Thu - Chi: " + numberWithCommas(tongThu - tongChi) + "</td>";
      html_last += "</tr>";

      document.querySelector(".tbody-1").innerHTML = html;
      document.querySelector(".tbody-5").innerHTML = html_last;
    }
  }
}

var selectKind = document.getElementById("select-kind-bill");

var btnFilter = document.getElementById("btn-filter");
var dateFrom = document.getElementById("date-from");
var dateTo = document.getElementById("date-to");

selectKind.addEventListener("change", function () {
  selectedKind = selectKind.value;
  currentPage = 1;
  searchList(1);
});

function filterDate() {
  fromDate = new Date(dateFrom.value);
  toDate = new Date(dateTo.value);
  searchList(1);
}

btnFilter.addEventListener("click", function (event) {
  event.preventDefault();
  filterDate();
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
    let name = "";
    if (item.costType == CostType.StudentFee) {
      name += "HV: " + item.user.student.name;
    } else if (item.costType == CostType.TeacherSalary) {
      name += "GV: " + item.user.teacher.name;
    }

    return (
      String(item.costId).includes(lowerKeyword) ||
      removeVietnameseTones(item.cost.name.toLowerCase()).includes(
        lowerKeyword
      ) ||
      item.cost.name.toLowerCase().includes(lowerKeyword) ||
      name.toLowerCase().includes(lowerKeyword) ||
      removeVietnameseTones(name.toLowerCase()).includes(lowerKeyword) ||
      String(item.totalMoney).includes(lowerKeyword) ||
      String(formatDateFromISO(item.timerTime)).includes(lowerKeyword)
    );
  });
}

function searchList(number = 1) {
  var text = document.getElementById("keyword").value;
  const listSearch = searchKey(text);
  currentPage = number;
  hienthids(selectedKind, selectedCenter, listSearch, currentPage);
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

var sortDirection = {}; // Store the current sort direction for each column

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

    if (columnIndex === 2 || columnIndex === 3 || columnIndex === 4) {
      if (sortDirection[columnIndex] === "asc") {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    } else if (columnIndex === 0) {
      return;
    } else if (columnIndex === 5) {
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

///////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////

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
