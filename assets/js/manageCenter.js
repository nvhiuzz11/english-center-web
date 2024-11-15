var listCenter;
var countData;
var currentPage = 1;
var collum = "";
var orderby = "";

const accessToken = localStorage.getItem("accessToken");
console.log("assetToken", localStorage.getItem("accessToken"));

const store_listCenter = localStorage.getItem("listCenter");
if (store_listCenter) {
  listCenter = JSON.parse(store_listCenter);
  console.log("store_listCenter", listCenter);
  showTable(listCenter, "", currentPage);
}

fetchTable();

function formatDateFromISO(isoString) {
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

function showSpinner() {
  document.getElementById("loadingSpinner").style.display = "flex";
}

function hideSpinner() {
  document.getElementById("loadingSpinner").style.display = "none";
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

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

async function fetchTable() {
  if (!listCenter) {
    showSpinner();
  }

  fetch(`${API_URL}/api/centers?includeClass=true`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Protected data:", data);
      listCenter = data.docs;

      localStorage.setItem("listCenter", JSON.stringify(listCenter));

      countData = data.pages;
      currentPage = 1;
      showTable(listCenter, "", currentPage);

      hideSpinner();
    })
    .catch((error) => {
      console.log("Error:", error);
      hideSpinner();
    });
}

function showTable(listItem, text, page) {
  // var key = "";
  let i = 1;

  const tableBody = document.querySelector(".tbody-1");
  tableBody.innerHTML = "";

  if (!listItem || listItem.length === 0) {
    if (text != "") {
      tableBody.innerHTML += `<h2>Không tìm thấy kết quả phù hợp "${text}"</h2>`;
    }
  } else {
    listItem.forEach((center) => {
      const newRow = `<tr>
                <td  style="width :100px">${i++}</td>
                <td  style="width :100px">${center.id}</td>
                <td>${center.name}</td>
                <td>${center.address}</td>
                <td>${center.phone}</td>
                </tr>`;
      tableBody.innerHTML += newRow;
    });
  }

  showindex();
}

function searchCenters(keyword) {
  const lowerKeyword = keyword.toLowerCase();
  return listCenter.filter((center) => {
    return (
      String(center.id).includes(lowerKeyword) ||
      center.name.toLowerCase().includes(lowerKeyword) ||
      center.address.toLowerCase().includes(lowerKeyword) ||
      center.phone.includes(lowerKeyword)
    );
  });
}

// tim kiem
function searchList() {
  var text = document.getElementById("keyword").value;
  const listSearch = searchCenters(text);
  currentPage = 1;
  showTable(listSearch, text, currentPage);
  removeSortIcons();
}

function showindex() {
  var html = "";

  //   var count = Math.ceil(countData / 50);
  var count = countData;

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
  searchList();
  var table = document.querySelector(".tbody-1");
  table.scrollTo({ top: table.offsetTop, behavior: "smooth" });
}

const rows = document.querySelectorAll(".tbody-1 tr");
const modalBg = document.querySelector(".modal-bg");
const modalContent = document.querySelector(".modal-content");

var stt_select;
var center_select;

document.querySelector(".tbody-1").addEventListener("click", function (event) {
  if (event.target.tagName === "TD") {
    stt_select = event.target.parentNode.cells[1].textContent;

    for (var i = 0; i < listCenter.length; i++) {
      if (stt_select == listCenter[i].id) center_select = listCenter[i];
    }

    console.log("center_select", center_select);

    document.getElementById("center-name").textContent = center_select.name;
    document.getElementById("center-id").textContent = center_select.id;
    document.getElementById("center-phone").textContent = center_select.phone;
    document.getElementById("center-address").textContent =
      center_select.address;
    document.getElementById("center-class").textContent =
      center_select.classes.length;
    document.getElementById("center-date").textContent = formatDateFromISO(
      center_select.createdAt
    );

    document.getElementById("tab1").classList.add("show");
    document.getElementById("tab2").classList.remove("show");
    document.getElementById("tab3").classList.remove("show");
    document.getElementById("tab4").classList.remove("show");
    document.getElementById("tb1").classList.add("active");
    document.getElementById("tb2").classList.remove("active");
    document.getElementById("tb3").classList.remove("active");
    document.getElementById("tb4").classList.remove("active");

    showClass();

    modalBg.style.display = "block";
  }
});

var dshs_lk = [];
var maHS_delete;
function showClass() {
  console.log("center_select?.classes", center_select?.classes);
  var comming_class = center_select?.classes.filter(
    (item) => item.status === 1
  );
  var onGoing_class = center_select?.classes.filter(
    (item) => item.status === 2
  );
  var closed_class = center_select?.classes.filter((item) => item.status === 3);

  console.log("comming_class", comming_class);
  console.log("onGoing_class", onGoing_class);
  console.log("closed_class", closed_class);

  // coming
  var html_comming = "";
  if (comming_class.length == 0) {
    html_comming += "<p> Trung tâm hiện tại không có lớp đang sắp mở</p>";
  } else {
    html_comming += "<p>Số lượng lớp sắp mở : " + comming_class.length + "</p>";

    comming_class.forEach((item) => {
      html_comming +=
        '<div class="child">' +
        "<p></p>" +
        "<table>" +
        "<td>" +
        "<p ><strong> Mã lớp :</strong>" +
        "   " +
        item.code +
        "</p>" +
        "<tr>" +
        "<td>" +
        "<p ><strong> Tên :</strong>" +
        "   " +
        item.name +
        "</p>" +
        "</td>" +
        "</tr>" +
        "<tr>" +
        "<td>" +
        "<p ><strong> Ngày bắt đầu :</strong>" +
        "   " +
        formatDateFromISO(item.startAt) +
        "</p>" +
        "</td>" +
        "<td>" +
        "<p ><strong> Số lượng học viên :</strong>" +
        "   " +
        item.studentQuantity +
        "/" +
        item.maxQuantity +
        " học viên" +
        "</p>" +
        "</td>" +
        "</tr>" +
        "<tr>" +
        "<td>" +
        "<p ><strong>Học phí:</strong>" +
        "   " +
        formatMoney(item.fee) +
        "/buổi";
      "</p>" + "</td>" + "</tr>";

      html_comming += "</table>" + "</div>";
    });
  }

  document.querySelector("#class-comming").innerHTML = html_comming;
  // ongoing

  var html_ongoing = "";
  if (onGoing_class.length == 0) {
    html_ongoing += "<p> Trung tâm hiện tại không có lớp đang hoạt động</p>";
  } else {
    html_ongoing += "<p>Số lượng lớp sắp mở : " + onGoing_class.length + "</p>";

    onGoing_class.forEach((item) => {
      html_ongoing +=
        '<div class="child">' +
        "<p></p>" +
        "<table>" +
        "<td>" +
        "<p ><strong> Mã lớp :</strong>" +
        "   " +
        item.code +
        "</p>" +
        "<tr>" +
        "<td>" +
        "<p ><strong> Tên :</strong>" +
        "   " +
        item.name +
        "</p>" +
        "</td>" +
        "</tr>" +
        "<tr>" +
        "<td>" +
        "<p ><strong> Ngày bắt đầu :</strong>" +
        "   " +
        formatDateFromISO(item.startAt) +
        "</p>" +
        "</td>" +
        "<td>" +
        "<p ><strong> Số lượng học viên :</strong>" +
        "   " +
        item.studentQuantity +
        "/" +
        item.maxQuantity +
        " học viên" +
        "</p>" +
        "</td>" +
        "</tr>" +
        "<tr>" +
        "<td>" +
        "<p ><strong>Học phí:</strong>" +
        "   " +
        formatMoney(item.fee) +
        "/buổi";
      "</p>" + "</td>" + "</tr>";

      html_ongoing += "</table>" + "</div>";
    });
  }

  document.querySelector("#class-ongoing").innerHTML = html_ongoing;

  // close
  var html_close = "";
  if (closed_class.length == 0) {
    html_close += "<p> Trung tâm hiện tại không có lớp đã kết thúc</p>";
  } else {
    html_close += "<p>Số lượng lớp sắp mở : " + closed_class.length + "</p>";

    closed_class.forEach((item) => {
      html_close +=
        '<div class="child">' +
        "<p></p>" +
        "<table>" +
        "<td>" +
        "<p ><strong> Mã lớp :</strong>" +
        "   " +
        item.code +
        "</p>" +
        "<tr>" +
        "<td>" +
        "<p ><strong> Tên :</strong>" +
        "   " +
        item.name +
        "</p>" +
        "</td>" +
        "</tr>" +
        "<tr>" +
        "<td>" +
        "<p ><strong> Ngày bắt đầu :</strong>" +
        "   " +
        formatDateFromISO(item.startAt) +
        "</p>" +
        "</td>" +
        "<td>" +
        "<p ><strong> Số lượng học viên :</strong>" +
        "   " +
        item.studentQuantity +
        "/" +
        item.maxQuantity +
        " học viên" +
        "</p>" +
        "</td>" +
        "</tr>" +
        "<tr>" +
        "<td>" +
        "<p ><strong>Học phí:</strong>" +
        "   " +
        formatMoney(item.fee) +
        "/buổi";
      "</p>" + "</td>" + "</tr>";

      html_close += "</table>" + "</div>";
    });
  }

  document.querySelector("#class-close").innerHTML = html_close;
}

document.querySelector(".close-btn").addEventListener("click", () => {
  modalBg.style.display = "none";
});

const editButton = document.getElementById("edit-button");
// const tdList = document.querySelectorAll('td[contenteditable]');

const modalBgEdit = document.querySelector(".modal-bg-edit");
const modalContentEdit = document.querySelector(".modal-content-edit");

// Khi  nhấn vào nút "Sửa"
editButton.addEventListener("click", () => {
  document.getElementById("lb_name_edit").textContent = "";
  document.getElementById("lb_address_edit").textContent = "";
  document.getElementById("lb_phone_edit").textContent = "";

  document.getElementById("center_name_edit").value = center_select.name;
  document.getElementById("address_edit").value = center_select.address;
  document.getElementById("phone_number_edit").value = center_select.phone;

  modalBgEdit.style.display = "block";
});

document.querySelector(".cancle-btn").addEventListener("click", () => {
  modalBgEdit.style.display = "none";
});

// Khi nhấn nút Cập nhật
const submit_update = document.getElementById("update");
submit_update.addEventListener("click", async function (event) {
  var check = true;

  event.preventDefault();
  const id = center_select.id;
  const phone_number = document.getElementById("phone_number_edit").value;
  const address = document.getElementById("address_edit").value;
  const name = document.getElementById("center_name_edit").value;

  var erorr_empty = "*Dữ liệu không được để trống";

  if (!name) {
    document.getElementById("lb_name_edit").textContent = erorr_empty;
    check = false;
  } else document.getElementById("lb_name_edit").textContent = "";

  if (!address) {
    document.getElementById("lb_address_edit").textContent = erorr_empty;
    check = false;
  } else document.getElementById("lb_address_edit").textContent = "";

  if (!/^(0[0-9]{9})$/.test(phone_number)) {
    document.getElementById("lb_phone_edit").textContent =
      "*Số điện thoại không chính xác (0..; 10 chữ số)";
    check = false;
  } else document.getElementById("lb_phone_edit").textContent = "";

  if (!check) return;

  showSpinner();
  try {
    const response = await fetch(`${API_URL}/api/center/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        address: address,
        phone: phone_number,
        images: null,
      }),
    });

    if (response.status === 200) {
      const responseData = await response.json();
      console.log("responseData", responseData);
      await fetchTable();
      searchList();

      hideSpinner();

      document.getElementById("center-name").textContent = name;
      document.getElementById("center-id").textContent = id;
      document.getElementById("center-phone").textContent = phone_number;
      document.getElementById("center-address").textContent = address;

      modalBgEdit.style.display = "none";

      document.querySelector(".update-success").style.display = "block";
      setTimeout(function () {
        document.querySelector(".update-success").style.display = "none";
      }, 1000);
    }
  } catch (error) {
    console.error("api error", error);
    hideSpinner();
  }
});

// Khi nhan nut Xoa

async function deleteCenter() {
  // $.ajax({
  //   url: "../api/deleteParent.php",
  //   type: "POST",
  //   data: {
  //     id: parent_select.MaPH,
  //   },
  //   success: function (res) {
  //     listCenter = JSON.parse(res);
  //     var text = document.getElementById("keyword").value;
  //     showTableParent(text, currentPage, collum, orderby);
  //   },
  //   error: function (xhr, status, error) {
  //     console.error(error);
  //   },
  // });

  showSpinner();
  try {
    const response = await fetch(`${API_URL}/api/center/${center_select.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      await fetchTable();
      searchList();
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
  if (center_select.classes.length > 0) {
    document.querySelector(".delete-ques").style.display = "none";
    document.querySelector(".delete-ques2").style.display = "block";
  } else {
    deleteCenter();
  }
});

document.getElementById("delete-cancle2").addEventListener("click", () => {
  document.querySelector(".delete-ques2").style.display = "none";
  document.getElementById("modal-ques").style.display = "none";
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

// them phu huynh

document.querySelector(".add-parent-button").addEventListener("click", () => {
  document.querySelector(".modal-bg-add").style.display = "block";
});

document.querySelector(".cancle-btn-add").addEventListener("click", () => {
  document.querySelector(".modal-bg-add").style.display = "none";

  document.getElementById("phone_number_add").value = "";
  document.getElementById("parent_name_add").value = "";
  document.getElementById("address_add").value = "";
  document.getElementById("lb_name_add").textContent = "";
  document.getElementById("lb_address_add").textContent = "";
  document.getElementById("lb_phone_add").textContent = "";
});

document
  .getElementById("add")
  .addEventListener("click", async function (event) {
    var check = true;

    event.preventDefault();
    const phone_number = document.getElementById("phone_number_add").value;
    const name = document.getElementById("parent_name_add").value;
    const address = document.getElementById("address_add").value;

    var erorr_empty = "*Dữ liệu không để trống";

    //Kiểm tra dữ liệu nhập vào

    if (!name) {
      document.getElementById("lb_name_add").textContent = erorr_empty;
      check = false;
    } else document.getElementById("lb_name_add").textContent = "";

    if (!address) {
      document.getElementById("lb_address_add").textContent = erorr_empty;
      check = false;
    } else document.getElementById("lb_address_add").textContent = "";

    if (!/^(0[0-9]{9})$/.test(phone_number)) {
      document.getElementById("lb_phone_add").textContent =
        "*Số điện thoại không chính xác (0[0-9]; 10 chữ số)";
      check = false;
    } else document.getElementById("lb_phone_add").textContent = "";

    if (!check) return;

    showSpinner();
    try {
      const response = await fetch(`${API_URL}/api/center`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          address: address,
          phone: phone_number,
          images: null,
        }),
      });

      if (response.status === 200) {
        const responseData = await response.json();
        console.log("responseData", responseData);
        await fetchTable();
        searchList();

        hideSpinner();
        document.getElementById("phone_number_add").value = "";
        document.getElementById("parent_name_add").value = "";
        document.getElementById("address_add").value = "";
        document.querySelector(".add-success").style.display = "block";

        setTimeout(function () {
          document.querySelector(".add-success").style.display = "none";
        }, 1000);
      }
    } catch (error) {
      console.error("api error", error);
      hideSpinner();
    }
  });
