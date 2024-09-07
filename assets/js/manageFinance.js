var countData = dsHoaDon.length;
var currentPage = 1;
var collum = "";
var orderby = "";
var selectedStatus = "";
var dateFilter = "";
showTableFinance("", 1, collum, orderby,"");



function convertDateFormat(dateString) {
    var dateParts = dateString.split("-");
    var formattedDate = dateParts[2] + "-" + dateParts[1] + "-" + dateParts[0];
    return formattedDate;
}

// Mặc định hiển thị tab đầu tiên
document.getElementById("Tab1").style.display = "block";
document.getElementById("btn-tab1").classList.add("active");

document.getElementById("Tab1-add").style.display = "block";
document.getElementById("btn-tab1-add").classList.add("active");




function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
//Hiẹn thị bảng
var filteredData_ds;


//hienthids(selectedStatus, filteredData_ds , currentPage);

function hienthids(status, filteredData, page, date) {
    
    filteredData_ds = [];
    document.querySelector(".tbody-1").innerHTML = '';
    document.querySelector(".tbody-5").innerHTML = '';
    var filteredData = dsHoaDon;
    if (status != "") {

        filteredData = filteredData.filter(function (hoaDon) {
            return hoaDon['TrangThai'] === status;
        });
    }
    if(date != ""){
        filteredData = filteredData.filter(function (hoaDon) {
          
            let thang1 = hoaDon['ThoiGian'].split('/')[0];
            let nam1 = hoaDon['ThoiGian'].split('/')[1];

            let thang2 = parseInt(date.split('-')[1], 10);
           
            let nam2 = date.split('-')[0];
            
            return (thang1 == thang2 && nam1 == nam2);
            //return hoaDon['TrangThai'] === status;
        });
    }

    if (filteredData.length == 0) {
        document.querySelector(".tbody-1").innerHTML = 'Không có dữ liệu phù hợp !';
    }
    filteredData_ds = filteredData;

    var html = ''; var html_last = '';
    var color = '';
    var tongSoTien = 0; var tongSoTienGiam = 0; var tongSoTienDaDong = 0; var tongSoTienPhaiDong = 0;
    if (filteredData.length != 0) {
        for (var i = 0; i < filteredData.length; i++) {
            if (filteredData[i]['TrangThai'] === 'Hoàn thành') {
                color = "lightgreen";
            }
            else if (filteredData[i]['TrangThai'] === 'Chưa đóng') { color = "#ff9393" }
            else { color = "#bcbdff" }
            if (i >= (page - 1) * 50  && i <= page * 50-1) {


                html += '<tr onclick="handleRowClick(' + i + ')">';
                html += '<td style="width:20px ;background-color:' + color + '">' + (i + 1) + '</td>';
                html += '<td style = "background-color:' + color + '">' + filteredData[i]['MaHD'] + '</td>';
                html += '<td style = "background-color:' + color + '">' + filteredData[i]['TenHD'] + '</td>';
                html += '<td style = "background-color:' + color + '">' + filteredData[i]['TenHS'] + '</td>';
                html += '<td style = "background-color:' + color + '">' + filteredData[i]['MaLop'] + '</td>';
                html += '<td style = "background-color:' + color + '">' + filteredData[i]['ThoiGian'] + '</td>';
                html += '<td style = "background-color:' + color + '">' + numberWithCommas(filteredData[i]['SoTien']) + '</td>';
                html += '<td style = "background-color:' + color + '">' + filteredData[i]['GiamHocPhi'] + '%</td>';
                html += '<td style = "background-color:' + color + '">' + numberWithCommas(filteredData[i]['SoTienGiam']) + '</td>';
                html += '<td style = "background-color:' + color + '">' + numberWithCommas(filteredData[i]['SoTienPhaiDong']) + '</td>';
                html += '<td style = "background-color:' + color + '">' + numberWithCommas(filteredData[i]['SoTienDaDong']) + '</td>';
                html += '<td style = "background-color:' + color + '">' + numberWithCommas(filteredData[i]['NoPhiConLai']) + '</td>';

                html += '<td style = "background-color:' + color + '">' + filteredData[i]['TrangThai'] + '</td>';

                html += '</tr>';
            }
            tongSoTien += parseInt(filteredData[i]['SoTien']);
          
            tongSoTienGiam += parseInt(filteredData[i]['SoTienGiam']);
            tongSoTienPhaiDong += parseInt(filteredData[i]['SoTienPhaiDong']);
            tongSoTienDaDong += parseInt(filteredData[i]['SoTienDaDong']);

        }
        html_last += '<tr">';
        html_last += '<td style="width:20px ;  ">' + '</td>';
        html_last += '<td >' + '</td>';
        html_last += '<td >' + '</td>';
        html_last += '<td >' + '</td>';
        html_last += '<td >' + '</td>';
        html_last += '<td >' + 'Tổng : </td>';
        html_last += '<td >' + numberWithCommas(tongSoTien) + '</td>';
        html_last += '<td >' + ((tongSoTienGiam / tongSoTien) * 100).toFixed(2) + '%</td>';
        html_last += '<td >' + numberWithCommas(tongSoTienGiam) + '</td>';
        html_last += '<td >' + numberWithCommas(tongSoTienPhaiDong) + '</td>';
        html_last += '<td >' + numberWithCommas(tongSoTienDaDong) + '</td>';
        html_last += '<td >' + numberWithCommas(tongSoTienPhaiDong - tongSoTienDaDong) + '</td>';
        html_last += '<td >' + '</td>';
        html_last += '</tr>';
        document.querySelector(".tbody-1").innerHTML = html;
        document.querySelector(".tbody-5").innerHTML = html_last;

    }
}


var selectStatus = document.getElementById('select-status');
selectStatus.addEventListener('change', function () {
    selectedStatus = selectStatus.value;
    currentPage = 1;
    hienthids(selectedStatus, filteredData_ds,currentPage,dateFilter);
    showindex();

});

document.getElementById("month-year").addEventListener('change',function(){
    dateFilter = document.getElementById("month-year").value;
    currentPage = 1;
    hienthids(selectedStatus, filteredData_ds,currentPage,dateFilter);
    showindex();
    

});

function showTableFinance(text, page, collumSort, order,date) {

    $.ajax({
        url: '../api/showTableFinance.php',
        type: 'POST',
        data: {
            key: text,
            collumSort: collumSort,
            order: order,
        },
        success: function (res) {
            dsHoaDon = JSON.parse(res);
            hienthids(selectedStatus, filteredData_ds, page,date);
            showindex();
        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });


}


function searchList() {
    collum ="";
    orderby = "";
    var text = document.getElementById('keyword').value;
    currentPage = 1;
    showTableFinance(text, 1, collum, orderby,dateFilter);
    removeSortIcons();
}


function showindex() {
    var html = "";


    var count = Math.ceil(filteredData_ds.length / 50);


    for (let i = 1; i <= count; i++) {

        var isActive = i === currentPage ? 'activeIndex' : '';
        html += '<div class="page-index ' + isActive + '" onclick="handlePageIndexClick(this, ' + i + ')">' + i + '</div>';
    }
    document.getElementById("container-index").innerHTML = html;
}

function handlePageIndexClick(clickedElement, pageNumber) {

    var pageElements = document.querySelectorAll('.page-index');
    pageElements.forEach(function (element) {
        element.classList.remove('activeIndex');
    });
    clickedElement.classList.add('activeIndex');

 
    currentPage = pageNumber;
    var text = document.getElementById('keyword').value;
    showTableFinance(text, pageNumber,collum,orderby,dateFilter);
    var table = document.querySelector(".tbody-1");
    table.scrollTo({ top: table.offsetTop, behavior: 'smooth' });
}


// sap xep bang

function parseNumericValue(value) {
    return parseInt(value.replace(/,/g, ''));
}
function parseDateValue(value) {
    var parts = value.split('/');
    var month = parseInt(parts[0]);
    var year = parseInt(parts[1]);
    return new Date(year, month - 1);
}

var sortDirection = {}; // Store the current sort direction for each column

function sortTable(columnIndex) {
    // var table = document.getElementById('table-1');
    // var tbody = table.querySelector('.tbody-1');
    // var rows = Array.from(tbody.getElementsByTagName('tr'));
    // var sttValues = rows.map(function (row) {
    //     return parseInt(row.getElementsByTagName('td')[0].innerText.trim());
    // });

    // rows.sort(function (a, b) {
    //     var aValue = a.getElementsByTagName('td')[columnIndex].innerText.trim();
    //     var bValue = b.getElementsByTagName('td')[columnIndex].innerText.trim();


    //     if (columnIndex === 2 || columnIndex === 3 || columnIndex === 4 || columnIndex === 12) {
    //         if (sortDirection[columnIndex] === 'asc') {
    //             return aValue.localeCompare(bValue);
    //         } else {
    //             return bValue.localeCompare(aValue);
    //         }
    //     }
    //     else
    //         if (columnIndex === 0) {
    //             return;
    //         } else if (columnIndex === 5) {
    //             var aDate = parseDateValue(aValue);
    //             var bDate = parseDateValue(bValue);

    //             if (sortDirection[columnIndex] === 'asc') {
    //                 return aDate - bDate;
    //             } else {
    //                 return bDate - aDate;
    //             }
    //         } else {
    //             aValue = parseNumericValue(aValue);
    //             bValue = parseNumericValue(bValue);

    //             if (sortDirection[columnIndex] === 'asc') {
    //                 return aValue - bValue;
    //             } else {
    //                 return bValue - aValue;
    //             }
    //         }


    // });



    // rows.forEach(function (row, index) {
    //     var sttCell = row.getElementsByTagName('td')[0];
    //     sttCell.innerText = sttValues[index];
    // });

    // rows.forEach(function (row) {
    //     tbody.appendChild(row);
    // });


    if (columnIndex == 1 ) collum = "MaHD";
    else if(columnIndex == 2) collum = "TenHD";
    else if(columnIndex == 3) collum = "TenHS";
    else if(columnIndex == 4) collum = "MaLop";
    else if(columnIndex == 5) collum = "ThoiGian";
    else if(columnIndex == 6) collum = "SoTien";
    else if(columnIndex == 7) collum = "GiamHocPhi";
    else if(columnIndex == 8) collum = "SoTienGiam";
    else if(columnIndex == 9) collum = "SoTienPhaiDong";
    else if(columnIndex == 10) collum = "SoTienDaDong";
    else if(columnIndex == 11) collum = "NoPhiConLai";
    else if(columnIndex == 12) collum = "TrangThai";


    if (sortDirection[columnIndex] === 'asc') {
        sortDirection[columnIndex] = 'desc';
        orderby = "desc";
        
    } else {
        sortDirection[columnIndex] = 'asc';
        orderby = "asc";    
    }
    var text = document.getElementById('keyword').value;
    showTableFinance(text, currentPage,collum,orderby,dateFilter);


    updateSortIcon(columnIndex);



}





function removeSortIcons() {
    var table = document.getElementById('table-1');
    var headers = table.querySelectorAll('th');

    headers.forEach(function (header) {
        var icon = header.querySelector('img');
        if (icon) {
            header.removeChild(icon);
        }
    });
}


function updateSortIcon(columnIndex) {
    var table = document.getElementById('table-1');
    var headers = table.querySelectorAll('th');

    headers.forEach(function (header) {
        var icon = header.querySelector('img');
        if (icon) {
            header.removeChild(icon);
        }
    });

    var clickedHeader = headers[columnIndex];
    var sortIcon = document.createElement('img');
    sortIcon.src = '../assets/images/iconSort.png';
    sortIcon.style.width = '20px';
    sortIcon.style.backgroundColor = 'white';
    sortIcon.style.borderRadius = '30px';
    if (sortDirection[columnIndex] === 'desc') {
        sortIcon.style.transform = 'rotate(180deg)';

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

const modalBgAdd = document.querySelector('.modal-bg-add');
const modalContentAdd = document.querySelector('.modal-content-add');

document.querySelector('.add-bill-button').addEventListener('click', () => {
    modalBgAdd.style.display = 'block';
})


var monthSelect = document.getElementById("bill-month-add");
var yearSelect = document.getElementById("bill-year-add");
var classsSelect = document.getElementById("bill-class-add");

monthSelect.addEventListener("change", updateclasssOptions);
yearSelect.addEventListener("change", updateclasssOptions);
var addedClasses = [];
// Hàm cập nhật các giá trị trong select bill-classs-add
function updateclasssOptions() {

    var selectedMonth = monthSelect.value;
    var selectedYear = yearSelect.value;
    var check = true;
    if (inputsValue.length != 0) {
        inputs.forEach(input => outputDiv.removeChild(input));
        inputs = [];
        inputsValue = [];
    }

    while (classsSelect.options.length > 0) {
        classsSelect.remove(0);
    }

    // Add default option
    var defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Chọn lớp học';
    classsSelect.appendChild(defaultOption);

    addedClasses = [];
    for (var i = 0; i < ds_diemdanh.length; i++) {
        var diemdanh = ds_diemdanh[i];
        var diemdanhMonth = parseInt(diemdanh.ThoiGian.split("-")[1]);
        var diemdanhYear = parseInt(diemdanh.ThoiGian.split("-")[0]);

        if ((diemdanhMonth == selectedMonth) && (diemdanhYear == selectedYear)) {

            var classs = {
                MaLop: diemdanh.MaLop,

            };

            var isclasssAdded = addedClasses.some(function (addedclasss) {
                return addedclasss.MaLop === classs.MaLop;
            });

            if (!isclasssAdded && check) {
                var defaultOption = document.createElement('option');
                defaultOption.value = 'Tất cả';
                defaultOption.textContent = 'Tất cả';
                classsSelect.appendChild(defaultOption);
                check = false;
            }

            if (!isclasssAdded) {
                addedClasses.push(classs);
                var option = document.createElement("option");
                option.value = classs.MaLop;
                option.text = classs.MaLop;
                classsSelect.add(option);
            }
        }
    }
}




// class
const select = document.getElementById("bill-class-add");
const outputDiv = document.getElementById("div-bill-class-add");
const options_All = document.querySelectorAll('#bill-class-add option');

var inputs = [];
var inputsValue = [];



select.addEventListener("change", (event) => {
    // Xóa input đã chọn nếu có
    var check = true;
    const selectedOption = event.target.value;

    if (selectedOption === 'Tất cả') {
        inputs.forEach(input => outputDiv.removeChild(input));
        inputs = [];
        inputsValue = [];
        const options_All = addedClasses;
        for (var i = 0; i < options_All.length; i++) {
            const input = document.createElement('input');
            input.type = 'text';
            input.value = options_All[i].MaLop;
            input.setAttribute('readonly', 'readonly');
            inputsValue.push(input.value);
            inputs.push(input);
            outputDiv.appendChild(input);
        }

    }
    else {
        inputsValue.forEach(i => {
            if (i == selectedOption)
                check = false;
        });
        if (selectedOption !== '' && check) {
            const input = document.createElement('input');
            input.type = 'text';
            input.value = selectedOption;
            input.setAttribute('readonly', 'readonly');
            inputsValue.push(selectedOption);
            inputs.push(input);
            outputDiv.appendChild(input);
        }
    }


});

document.getElementById('reset-class').addEventListener('click', () => {
    inputs.forEach(input => outputDiv.removeChild(input));
    inputs = [];
    inputsValue = [];
});

document.getElementById('reset-1').addEventListener('click', () => {
    inputs.forEach(input => outputDiv.removeChild(input));
    inputs = [];
    inputsValue = [];
});

document.querySelector('.btn-close-add').addEventListener('click', () => {
    modalBgAdd.style.display = 'none';
    document.getElementById("Tab1-add").style.display = "block";
    document.getElementById("btn-tab1-add").classList.add("active");
    document.getElementById("btn-tab2-add").classList.remove("active");
    document.getElementById("Tab2-add").style.display = "none";
    inputs.forEach(input => outputDiv.removeChild(input));
    inputs = [];
    inputsValue = [];
    document.getElementById('form-add-bill').reset();
    document.getElementById('form-add-bill-ps').reset();


});

// Khi nhấn tao

document.getElementById('sumit-bill-add').addEventListener('click', function (event) {
    var check = true;

    event.preventDefault();
    const name_bill = document.getElementById('bill-name-add').value;
    const month_bill = document.getElementById('bill-month-add').value;
    const year_bill = document.getElementById('bill-year-add').value;


    var erorr_empty = "*Dữ liệu không để trống";

    //Kiểm tra dữ liệu nhập vào

    if (!name_bill) {
        document.getElementById('lb-name-add').textContent = "*Chưa nhập tên hóa đơn";
        check = false;
    } else
        document.getElementById('lb-name-add').textContent = "";

    if (!month_bill) {
        document.getElementById('lb-time-add').textContent = "*Chưa chọn thời gian";
        check = false;
    } else {
        if (!year_bill) {
            document.getElementById('lb-time-add').textContent = "*Chưa chọn thời gian";
            check = false;
        } else
            document.getElementById('lb-time-add').textContent = "";
    }

    if (inputsValue.length === 0) {

        document.getElementById('lb-class-add').textContent = "*Chưa chọn lớp";
        check = false;
    } else
        document.getElementById('lb-class-add').textContent = "";

    if (!check)
        return;
    document.getElementById('class-add-bill').value = inputsValue;

    const class_bill = document.getElementById('class-add-bill').value;

    $.ajax({
        url: '../api/addBill.php',
        type: 'POST',
        data: {
            name: name_bill,
            month: month_bill,
            year: year_bill,
            class: class_bill,
        },
        success: function (res) {

            var text = document.getElementById('keyword').value;
            showTableFinance(text, currentPage, collum, orderby,dateFilter);
        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });




    document.getElementById('tb1').innerHTML = "Đã thêm hóa đơn tháng " + month_bill + "/" + year_bill + " thành công!";
    document.getElementById('form-add-bill').reset();

    document.querySelector('.add-success').style.display = 'block';

    setTimeout(function () {
        document.querySelector('.add-success').style.display = 'none';

    }, 1500);
});


var classSelect = document.getElementById("bill-class-add-ps");
var studentSelect = document.getElementById("name-student-add-bill");




classSelect.addEventListener("change", function () {
    studentSelect.innerHTML = '<option value="">Chọn Học viên</option>';

    var selectedClass = classSelect.value;
    for (var i = 0; i < dshs_lopxHS.length; i++) {
        var student = dshs_lopxHS[i];
        if (student.MaLop === selectedClass) {
            var option = document.createElement("option");
            option.value = student.MaHS;
            option.textContent = student.MaHS + '. ' + student.TenHS;
            studentSelect.appendChild(option);
        }
    }
});
var monthSelect_ps = document.getElementById("bill-month-add-ps");
var yearSelect_ps = document.getElementById("bill-year-add-ps");
var classsSelect_ps = document.getElementById("bill-class-add-ps");

monthSelect_ps.addEventListener("change", updateclasssOptions2);
yearSelect_ps.addEventListener("change", updateclasssOptions2);
var addedClasses_ps = [];
function updateclasssOptions2() {

    var selectedMonth = monthSelect_ps.value;
    var selectedYear = yearSelect_ps.value;
    var check = true;


    while (classsSelect_ps.options.length > 0) {
        classsSelect_ps.remove(0);
    }

    // Add default option
    var defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Chọn lớp học';
    classsSelect_ps.appendChild(defaultOption);

    addedClasses = [];
    for (var i = 0; i < ds_diemdanh.length; i++) {
        var diemdanh = ds_diemdanh[i];
        var diemdanhMonth = parseInt(diemdanh.ThoiGian.split("-")[1]);
        var diemdanhYear = parseInt(diemdanh.ThoiGian.split("-")[0]);

        if ((diemdanhMonth == selectedMonth) && (diemdanhYear == selectedYear)) {

            var classs = {
                MaLop: diemdanh.MaLop,
            };

            var isclasssAdded = addedClasses.some(function (addedclasss) {
                return addedclasss.MaLop === classs.MaLop;
            });



            if (!isclasssAdded) {
                addedClasses.push(classs);
                var option = document.createElement("option");
                option.value = classs.MaLop;
                option.text = classs.MaLop;
                classsSelect_ps.add(option);
            }
        }
    }
}




document.getElementById('sumit-bill-add-ps').addEventListener('click', function (event) {
    var check = true;

    event.preventDefault();
    const name_bill = document.getElementById('bill-name-add-ps').value;
    const month_bill = document.getElementById('bill-month-add-ps').value;
    const year_bill = document.getElementById('bill-year-add-ps').value;
    const name_student = document.getElementById('name-student-add-bill').value;
    const class_bill = document.getElementById('bill-class-add-ps').value;


    //Kiểm tra dữ liệu nhập vào

    if (!name_bill) {
        document.getElementById('lb-name-add-ps').textContent = "*Chưa nhập tên hóa đơn";
        check = false;
    } else
        document.getElementById('lb-name-add-ps').textContent = "";

    if (!month_bill) {
        document.getElementById('lb-time-add-ps').textContent = "*Chưa chọn thời gian";
        check = false;
    } else
        document.getElementById('lb-time-add-ps').textContent = "";

    if (!year_bill) {
        document.getElementById('lb-time-add-ps').textContent = "*Chưa chọn thời gian";
        check = false;
    } else
        document.getElementById('lb-time-add-ps').textContent = "";


    if (!class_bill) {

        document.getElementById('lb-class-add-ps').textContent = "*Chưa chọn lớp";
        check = false;
    } else
        document.getElementById('lb-class-add-ps').textContent = "";

    if (!name_student) {

        document.getElementById('lb-name-student-add-bill').textContent = "*Chưa chọn học sinh";
        check = false;
    } else
        document.getElementById('lb-name-student-add-bill').textContent = "";

    if (!check)
        return;

    var hasAttendance = false;
    console.log(name_student, class_bill, year_bill, month_bill);
    for (var i = 0; i < ds_diemdanh.length; i++) {
        var attendance = ds_diemdanh[i];

        // Kiểm tra nếu mã học sinh, mã lớp và thời gian phù hợp
        let parts = attendance.ThoiGian.split('-');
        let dateYear = parseInt(parts[0]);
        let dateMonth = parseInt(parts[1]);
        if (
            attendance.MaHS == name_student &&
            attendance.MaLop == class_bill &&
            dateYear == year_bill && dateMonth == month_bill) {
            console.log(attendance);
            if (attendance.dd == 1) {
                hasAttendance = true;
                break;
            }
        }
    }

    if (!hasAttendance) {
        document.getElementById('tb2').innerHTML = "Học viên " + name_student + ' chưa tham gia buổi nào học của lớp ' + class_bill + '  trong tháng ' + month_bill + "/" + year_bill + " ! ";
        document.querySelector('.delete-cant').style.display = 'block';
        return;
    }

    $.ajax({
        url: '../api/addBillps.php',
        type: 'POST',
        data: {
            name: name_bill,
            month: month_bill,
            year: year_bill,
            class: class_bill,
            student: name_student,
        },
        success: function (res) {
            var text = document.getElementById('keyword').value;
            showTableFinance(text, currentPage, collum, orderby,dateFilter);
        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });

    document.getElementById('tb1').innerHTML = "Đã thêm hóa đơn " + month_bill + "/" + year_bill + "của học viên " + " thành công! ";

    document.querySelector('.add-success').style.display = 'block';
    document.getElementById('form-add-bill-ps').reset();
    setTimeout(function () {
        document.querySelector('.add-success').style.display = 'none';
    }, 1500);

});

document.getElementById('close').addEventListener('click', () => {
    document.querySelector('.delete-cant').style.display = 'none';
});
//thong tin chi tiet hoa don

const rows = document.querySelectorAll('.tbody-1 tr');
const modalBg = document.querySelector('.modal-bg');
const modalContent = document.querySelector('.modal-content');


var maHD_select;
var hoaDon_select;

var lsthp = [];
function handleRowClick(index) {
    // Xử lý sự kiện khi bấm vào một dòng
    // var selectedRow = rows[index].cells[1];
    var selectedRow = filteredData_ds[index];


    document.getElementById("btn-tab-3-1").classList.add("active");
    document.getElementById("btn-tab-3-2").classList.remove("active");
    document.getElementById("btn-tab-3-2").classList.remove("active");
    document.getElementById("tab-3-1").style.display = 'block';
    document.getElementById("tab-3-2").style.display = 'none';
    document.getElementById("tab-3-3").style.display = 'none';


    maHD_select = selectedRow.MaHD;

    for (var i = 0; i < dsHoaDon.length; i++) {
        if (maHD_select == dsHoaDon[i].MaHD)
            hoaDon_select = dsHoaDon[i];
    }

    document.getElementById('id-bill-detail').textContent = maHD_select;
    document.getElementById('name-bill-detail').textContent = hoaDon_select.TenHD;
    document.getElementById('class-bill-detail').textContent = hoaDon_select.MaLop;
    document.getElementById('id-st-detail').textContent = hoaDon_select.MaHS;
    document.getElementById('name-st-bill-detail').textContent = hoaDon_select.TenHS;
    document.getElementById('time-bill-detail').textContent = hoaDon_select.ThoiGian;
    document.getElementById('st-bill-detail').textContent = numberWithCommas(hoaDon_select.SoTien);
    document.getElementById('ghp-bill-detail').textContent = hoaDon_select.GiamHocPhi + '%';
    document.getElementById('stg-bill-detail').textContent = numberWithCommas(hoaDon_select.SoTienGiam);
    document.getElementById('stpd-bill-detail').textContent = numberWithCommas(hoaDon_select.SoTienPhaiDong);
    document.getElementById('stdd-bill-detail').textContent = numberWithCommas(hoaDon_select.SoTienDaDong);
    document.getElementById('npcl-bill-detail').textContent = numberWithCommas(hoaDon_select.NoPhiConLai);
    document.getElementById('status-bill-detail').textContent = hoaDon_select.TrangThai;
    var hp = 0;
    for (var i = 0; i < ds_hs_hocphi.length; i++) {
        if ((hoaDon_select.MaHS == ds_hs_hocphi[i].MaHS) && (hoaDon_select.MaLop == ds_hs_hocphi[i].MaLop))
            hp = ds_hs_hocphi[i].HocPhi;
    }
    document.getElementById('fee-bill-detail').textContent = numberWithCommas(hp) + ' /buổi';

    document.getElementById('session-bill-detail').textContent = parseInt(hoaDon_select.SoTien / hp);
    if (hoaDon_select.TrangThai === 'Hoàn thành') {
        color = "green";
    }
    else if (hoaDon_select.TrangThai === 'Chưa đóng') { color = "red" }
    else { color = "blue" }
    document.getElementById('status-bill-detail').style.color = color;

    document.getElementById('mahd-delete').value = hoaDon_select.MaHD;
    document.getElementById('mahd-delete-2').value = hoaDon_select.MaHD;
    modalBg.style.display = 'block';


    // lich sử thu học phí

    // var lsthp = [];

    lsthp = [];
    var k = 0;
    for (var i = 0; i < ds_LS_THP.length; i++) {
        if (maHD_select == ds_LS_THP[i].MaHD)
            lsthp[k++] = ds_LS_THP[i];
    }

    document.getElementById('id-bill-lsthp').textContent = numberWithCommas(hoaDon_select.MaHD);
    document.getElementById('stpd-lsthp').textContent = numberWithCommas(hoaDon_select.SoTienPhaiDong);

    var tbody = document.getElementById('tbody-lsthp');



    var rowsHTML = '';
    var tt = 0;
    if (lsthp.length != '0') {
        for (var i = 0; i < lsthp.length; i++) {
            var giaoDich = lsthp[i];
            rowsHTML += '<tr>' +
                '<td>' + (i + 1) + '</td>' +
                '<td>' + giaoDich.MaGD + '</td>' +
                // '<td class="thoi-gian">' + convertDateFormat(giaoDich.ThoiGian) + '</td>' +
                '<td> <input type="date" value ="' + giaoDich.ThoiGian + '" required>' + '</td>' +
                '<td  class="so-tien" pattern="[0-9,]+">' + numberWithCommas(giaoDich.SoTien) + '</td>' +
                '<td>' + '<button type ="button" id="edit-lsthp-btn" class="btn-edit-lsthp" onclick="editRow(' + i + ')" style ="background-color: rosybrown">Sửa</button>' +
                '<button type ="button" id="delete-lsthp-btn" class="btn-edit-lsthp" onclick="deleteRow(' + i + ')" style ="background-color: rebeccapurple">Xoá</button>' + '</td>' +
                '</tr>';
            tt += parseInt(giaoDich.SoTien);
        }
        rowsHTML += '<tr>' +
            '<td> </td>' +
            '<td> </td>' +
            '<td> Tổng tiền : </td>' +
            '<td id="total-amount-cell">' + numberWithCommas( tt) + '</td>' +
            '<td > <button  onclick="updateLSTHP()" class="btn-edit-lsthp"  id="btn-update-lsthp" style ="background-color: orangered">Cập nhật</button></td>' +
            '</tr>';

        rowsHTML += '<tr>' +
            '<td> </td>' +
            '<td> </td>' +
            '<td> Nợ phí còn lại : </td>' +
            '<td id="npcl-amount-cell">' + numberWithCommas(hoaDon_select.SoTienPhaiDong - tt) + '</td>' +
            '<td "></td>' +
            '</tr>'
    }
    else
        rowsHTML += '<td> <strong> Hóa đơn chưa có dữ liệu thanh toán  </strong> </td>'

    tbody.innerHTML = rowsHTML;

}


document.querySelector('.close-btn').addEventListener('click', () => {

    modalBg.style.display = 'none';

    document.getElementById('tbody-lsthp').innerHTML = '';

});

//Sua thong tin hoa don
const editButton = document.getElementById('edit-button');
const modalBgEdit = document.querySelector('.modal-bg-edit');
const modalContentEdit = document.querySelector('.modal-content-edit');

// Khi  nhấn vào nút "Sửa"

editButton.addEventListener('click', () => {

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


    document.getElementById('id-bill-edit').value = hoaDon_select.MaHD;
    document.getElementById('name-bill-edit').value = hoaDon_select.TenHD;
    document.getElementById('id-st-bill-edit').value = hoaDon_select.MaHS;
    document.getElementById('name-st-bill-edit').value = hoaDon_select.TenHS;
    document.getElementById('class-bill-edit').value = hoaDon_select.MaLop;
    document.getElementById('st-bill-edit').value = numberWithCommas(hoaDon_select.SoTien);

    document.getElementById('ghp-bill-edit').value = hoaDon_select.GiamHocPhi + '%';
    document.getElementById('stg-bill-edit').value = numberWithCommas(hoaDon_select.SoTienGiam);
    document.getElementById('stpd-bill-edit').value = numberWithCommas(hoaDon_select.SoTienPhaiDong);
    document.getElementById('stdd-bill-edit').value = numberWithCommas(hoaDon_select.SoTienDaDong);
    document.getElementById('npcl-bill-edit').value = numberWithCommas(hoaDon_select.NoPhiConLai);

    modalBgEdit.style.display = "block";

});

document.getElementById('btn-cancle-edit-bill').addEventListener('click', () => {
    modalBgEdit.style.display = 'none';

});

// Cap nhat sua hoa don
document.getElementById('update-bill-edit').addEventListener('click', function (event) {
    var check = true;
    event.preventDefault();
    const form = document.getElementById('form-edit-bill');

    var name = document.getElementById('name-bill-edit').value;


    if (!name) {
        document.getElementById('err-name-bill-edit').textContent = "*Chưa nhập tên hóa đơn";
        check = false;
    } else
        document.getElementById('err-name-bill-edit').textContent = "";


    if (!check)
        return;


    document.getElementById('tb1').innerHTML = "Cập nhật hóa đơn thành công! ";

    document.querySelector('.add-success').style.display = 'block';

    setTimeout(function () {
        document.querySelector('.add-success').style.display = 'none';
        form.submit();
    }, 1500);

});


// Xoa hoa don

document.getElementById('btn-delete-bill').addEventListener('click', () => {
    document.querySelector('.delete-bill-ques').style.display = 'block';
    document.querySelector('#modal-ques').style.display = 'block';
});

document.getElementById('btn-cancle-delete-bill').addEventListener('click', () => {
    document.querySelector('.delete-bill-ques').style.display = 'none';
    document.querySelector('#modal-ques').style.display = 'none';
});
document.getElementById('delete-bill').addEventListener('click', function (event) {


    event.preventDefault();

    document.querySelector('.delete-bill-ques').style.display = 'none';

    if (hoaDon_select.SoTienDaDong != 0) {
        document.querySelector('.delete-bill-ques-2').style.display = 'block';
        return;
    }

    $.ajax({
        url: '../api/deleteBill.php',
        type: 'POST',
        data: {
            mahd: hoaDon_select.MaHD
        },
        success: function (res) {
            var text = document.getElementById('keyword').value;
            showTableFinance(text, currentPage, collum, orderby,dateFilter);
        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });


    document.querySelector('#modal-ques').style.display = 'none';
    modalBg.style.display = 'none';
    document.getElementById('tbody-lsthp').innerHTML = '';
    document.querySelector('.delete-success').style.display = 'block';
    setTimeout(function () {
        document.querySelector('.delete-success').style.display = 'none';

    }, 1500);

});

document.getElementById('btn-cancle-delete-bill-2').addEventListener('click', () => {
    document.querySelector('.delete-bill-ques-2').style.display = 'none';
    document.querySelector('#modal-ques').style.display = 'none';
});


document.getElementById('delete-bill-2').addEventListener('click', function (event) {
    event.preventDefault();

    $.ajax({
        url: '../api/deleteBill.php',
        type: 'POST',
        data: {
            mahd: hoaDon_select.MaHD
        },
        success: function (res) {
            var text = document.getElementById('keyword').value;
           showTableFinance(text, currentPage, collum, orderby,dateFilter);
        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });



    document.querySelector('.delete-bill-ques-2').style.display = 'none';
    document.querySelector('#modal-ques').style.display = 'none';

    modalBg.style.display = 'none';
    document.querySelector('.delete-success').style.display = 'block';
    setTimeout(function () {
        document.querySelector('.delete-success').style.display = 'none';
    }, 1500);

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
    value = value.replace(/[,\s]/g, '');
    value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    input.value = value;
}


document.getElementById('btn-add-trans').addEventListener('click', () => {
    document.querySelector('#div-add-trans').style.display = 'block';
    document.querySelector('#modal-add-trans').style.display = 'block';
});

document.getElementById('form-add-trans').addEventListener('submit', function (event) {

    var check = true;
    event.preventDefault();


    const money = document.getElementById('money-add-trans').value;
    const date = document.getElementById('date-add-trans').value;


    if (!money) {

        document.getElementById('lb-money-add-trans').textContent = "*Chưa nhập số tiền";
        check = false;
    } else
        document.getElementById('lb-money-add-trans').textContent = "";


    if (!check)
        return;
    var text = document.getElementById('keyword').value;

    $.ajax({
        url: '../api/addTrans.php',
        type: 'POST',
        data: {
            id: hoaDon_select.MaHD,
            date: date,
            money: money,  
            key: text,
        },
        success: function (res) {
            dsHoaDon = JSON.parse(res).hoadon;
            ds_LS_THP = JSON.parse(res).lsthp;


            for (var i = 0; i < dsHoaDon.length; i++) {
                if (hoaDon_select.MaHD == dsHoaDon[i].MaHD)
                    hoaDon_select = dsHoaDon[i];
            }

            document.getElementById('stdd-bill-detail').textContent = numberWithCommas(hoaDon_select.SoTienDaDong);
            document.getElementById('npcl-bill-detail').textContent = numberWithCommas(hoaDon_select.NoPhiConLai);
            document.getElementById('status-bill-detail').textContent = hoaDon_select.TrangThai;
            if (hoaDon_select.TrangThai === 'Hoàn thành') {
                color = "green";
            }
            else if (hoaDon_select.TrangThai === 'Chưa đóng') { color = "red" }
            else { color = "blue" }
            document.getElementById('status-bill-detail').style.color = color;

            //
            lsthp = [];
            var k = 0;
            for (var i = 0; i < ds_LS_THP.length; i++) {
                if (hoaDon_select.MaHD == ds_LS_THP[i].MaHD)
                    lsthp[k++] = ds_LS_THP[i];
            }

            document.getElementById('id-bill-lsthp').textContent = numberWithCommas(hoaDon_select.MaHD);
            document.getElementById('stpd-lsthp').textContent = numberWithCommas(hoaDon_select.SoTienPhaiDong);


            var rowsHTML = '';
            var tt = 0;
            if (lsthp.length != '0') {
                for (var i = 0; i < lsthp.length; i++) {
                    var giaoDich = lsthp[i];
                    rowsHTML += '<tr>' +
                        '<td>' + (i + 1) + '</td>' +
                        '<td>' + giaoDich.MaGD + '</td>' +
                        // '<td class="thoi-gian">' + convertDateFormat(giaoDich.ThoiGian) + '</td>' +
                        '<td> <input type="date" value ="' + giaoDich.ThoiGian + '" required>' + '</td>' +
                        '<td  class="so-tien" pattern="[0-9,]+">' + numberWithCommas(giaoDich.SoTien) + ' </td>' +
                        '<td>' + '<button type ="button" id="edit-lsthp-btn" class="btn-edit-lsthp" onclick="editRow(' + i + ')" style ="background-color: rosybrown">Sửa</button>' +
                        '<button type ="button" id="delete-lsthp-btn" class="btn-edit-lsthp" onclick="deleteRow(' + i + ')" style ="background-color: rebeccapurple">Xoá</button>' + '</td>' +
                        '</tr>';
                        tt += parseInt(giaoDich.SoTien);
                        
                }
                rowsHTML += '<tr>' +
                    '<td> </td>' +
                    '<td> </td>' +
                    '<td> Tổng tiền : </td>' +
                    '<td id="total-amount-cell">' + numberWithCommas(tt) + '</td>' +
                    '<td > <button  onclick="updateLSTHP()" class="btn-edit-lsthp"  id="btn-update-lsthp" style ="background-color: orangered">Cập nhật</button></td>' +
                    '</tr>';

                rowsHTML += '<tr>' +
                    '<td> </td>' +
                    '<td> </td>' +
                    '<td> Nợ phí còn lại : </td>' +
                    '<td id="npcl-amount-cell">' + numberWithCommas(hoaDon_select.SoTienPhaiDong - tt) + '</td>' +
                    '<td "></td>' +
                    '</tr>'
            }
            else
                rowsHTML += '<td> <strong> Hóa đơn chưa có dữ liệu thanh toán  </strong> </td>'

            document.getElementById('tbody-lsthp').innerHTML = rowsHTML;


         
           var text = document.getElementById('keyword').value;
           showTableFinance(text, currentPage, collum, orderby,dateFilter);

        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });


    document.querySelector('#div-add-trans').style.display = 'none';
    document.querySelector('#modal-add-trans').style.display = 'none';
    document.getElementById('money-add-trans').value = "";
    document.getElementById('date-add-trans').value = "";


    document.getElementById('tb1').innerHTML = "Đã thêm trạng giao dịch thành công !";

    document.querySelector('.add-success').style.display = 'block';

    setTimeout(function () {
        document.querySelector('.add-success').style.display = 'none';

    }, 1500);

});

document.getElementById('canle-add-trans').addEventListener('click', () => {
    document.querySelector('#div-add-trans').style.display = 'none';
    document.querySelector('#modal-add-trans').style.display = 'none';
    document.getElementById('money-add-trans').value = "";
    document.getElementById('date-add-trans').value = "";
});

//sua lich su thu hoc phi
function editRow(index) {
    tbody = document.getElementById('tbody-lsthp');
    // var soTienCell = document.getElementsByClassName('so-tien')[index];
    var soTienCell = tbody.rows[index].querySelector(".so-tien");


    // Cho phép chỉnh sửa cột "Số tiền"
    var st = soTienCell.textContent;
    soTienCell.contentEditable = true;
    soTienCell.style.backgroundColor = '#f9f9f9';
    soTienCell.style.border = 'double';

    soTienCell.addEventListener('blur', function () {
        soTienCell.contentEditable = false;
        soTienCell.style.backgroundColor = '';
        soTienCell.style.border = '';
        var value = parseNumericValue(this.textContent);
        if (!value) {
            this.textContent = st;
        }
        else {
            this.textContent = numberWithCommas(value);
            updateTotalAmount();
        }
    });

}



//tt
function updateTotalAmount() {
    var totalAmount = 0;
    var soTienCells = document.getElementsByClassName('so-tien');

    for (var i = 0; i < soTienCells.length; i++) {
        var value = parseNumericValue(soTienCells[i].textContent);
        totalAmount += parseInt(value);
    }

    var totalAmountCell = document.getElementById('total-amount-cell');
    totalAmountCell.textContent = numberWithCommas(totalAmount);

    document.getElementById('npcl-amount-cell').textContent = numberWithCommas(parseNumericValue(document.getElementById('stpd-lsthp').textContent) - totalAmount);


}
//cap nhat lsthp
function getUpdateLSTHP() {
    var updatedData = [];

    tbody = document.getElementById('tbody-lsthp');
    var rows = tbody.querySelectorAll('tr');

    for (var i = 0; i < rows.length - 2; i++) {
        var row = rows[i];
        var inputs = row.getElementsByTagName('input');
        var maGD = row.cells[1].innerText;
        var ngay = inputs[0].value;
        var soTien = row.cells[3].innerText.replace(/,/g, '');

        updatedData.push({
            maGD: maGD,
            ngay: ngay,
            soTien: soTien
        });
    }

    return updatedData;
}

function updateLSTHP() {

    var selectedRows = Array.from(document.querySelectorAll('#tbody-lsthp input[type="checkbox"]:checked')).map(function (checkbox) {
        return checkbox.closest('tr');
    });

    // Remove the selected rows from the table
    selectedRows.forEach(function (row) {
        row.remove();
    });

    // Update the remaining rows' index
    var tbody = document.getElementById('tbody-lsthp');
    var rows = tbody.querySelectorAll('tr');
    rows.forEach(function (row, index) {
        row.cells[0].textContent = index + 1;
    });

    var updatedData = getUpdateLSTHP();


    var totalAmount = parseNumericValue(document.getElementById('total-amount-cell').textContent);
    var remainingFee = parseNumericValue(document.getElementById('npcl-amount-cell').textContent);



    // Convert the updatedData to a JSON string
    var jsonData = JSON.stringify(updatedData);



    // Create hidden input fields in the form to store the JSON data, total amount, and remaining fee
    var hiddenInputData = document.createElement('input');
    hiddenInputData.setAttribute('type', 'hidden');
    hiddenInputData.setAttribute('name', 'updatedData');
    hiddenInputData.setAttribute('value', jsonData);

    var hiddenInputTotalAmount = document.createElement('input');
    hiddenInputTotalAmount.setAttribute('type', 'hidden');
    hiddenInputTotalAmount.setAttribute('name', 'totalAmount');
    hiddenInputTotalAmount.setAttribute('value', totalAmount);

    var hiddenInputRemainingFee = document.createElement('input');
    hiddenInputRemainingFee.setAttribute('type', 'hidden');
    hiddenInputRemainingFee.setAttribute('name', 'remainingFee');
    hiddenInputRemainingFee.setAttribute('value', remainingFee);

    var maHD = parseNumericValue(document.getElementById('id-bill-lsthp').textContent);

    var hiddenInputmahd = document.createElement('input');
    hiddenInputmahd.setAttribute('type', 'hidden');
    hiddenInputmahd.setAttribute('name', 'maHD');
    hiddenInputmahd.setAttribute('value', maHD);


    var form = document.getElementById('form-edit-trans');
    form.appendChild(hiddenInputData);
    form.appendChild(hiddenInputTotalAmount);
    form.appendChild(hiddenInputRemainingFee);
    form.appendChild(hiddenInputmahd);

    $.ajax({
        url: '../api/updatelsthp.php',
        type: 'POST',
        data: $('#form-edit-trans').serialize(),

        success: function (res) {
            dsHoaDon = JSON.parse(res).hoadon;
            ds_LS_THP = JSON.parse(res).lsthp;


            for (var i = 0; i < dsHoaDon.length; i++) {
                if (hoaDon_select.MaHD == dsHoaDon[i].MaHD)
                    hoaDon_select = dsHoaDon[i];
            }

            document.getElementById('stdd-bill-detail').textContent = numberWithCommas(hoaDon_select.SoTienDaDong);
            document.getElementById('npcl-bill-detail').textContent = numberWithCommas(hoaDon_select.NoPhiConLai);
            document.getElementById('status-bill-detail').textContent = hoaDon_select.TrangThai;
            if (hoaDon_select.TrangThai === 'Hoàn thành') {
                color = "green";
            }
            else if (hoaDon_select.TrangThai === 'Chưa đóng') { color = "red" }
            else { color = "blue" }
            document.getElementById('status-bill-detail').style.color = color;

            //
            lsthp = [];
            var k = 0;
            for (var i = 0; i < ds_LS_THP.length; i++) {
                if (hoaDon_select.MaHD == ds_LS_THP[i].MaHD)
                    lsthp[k++] = ds_LS_THP[i];
            }

            document.getElementById('id-bill-lsthp').textContent = numberWithCommas(hoaDon_select.MaHD);
            document.getElementById('stpd-lsthp').textContent = numberWithCommas(hoaDon_select.SoTienPhaiDong);


            var rowsHTML = '';
            var tt = 0;
            if (lsthp.length != '0') {
                for (var i = 0; i < lsthp.length; i++) {
                    var giaoDich = lsthp[i];
                    rowsHTML += '<tr>' +
                        '<td>' + (i + 1) + '</td>' +
                        '<td>' + giaoDich.MaGD + '</td>' +
                        '<td> <input type="date" value ="' + giaoDich.ThoiGian + '" required>' + '</td>' +
                        '<td  class="so-tien" pattern="[0-9,]+">' + numberWithCommas(giaoDich.SoTien) + ' </td>' +
                        '<td>' + '<button type ="button" id="edit-lsthp-btn" class="btn-edit-lsthp" onclick="editRow(' + i + ')" style ="background-color: rosybrown">Sửa</button>' +
                        '<button type ="button" id="delete-lsthp-btn" class="btn-edit-lsthp" onclick="deleteRow(' + i + ')" style ="background-color: rebeccapurple">Xoá</button>' + '</td>' +
                        '</tr>';
                        tt += parseInt(giaoDich.SoTien);
                }
                rowsHTML += '<tr>' +
                    '<td> </td>' +
                    '<td> </td>' +
                    '<td> Tổng tiền : </td>' +
                    '<td id="total-amount-cell">' + numberWithCommas(tt) + '</td>' +
                    '<td > <button  onclick="updateLSTHP()" class="btn-edit-lsthp"  id="btn-update-lsthp" style ="background-color: orangered">Cập nhật</button></td>' +
                    '</tr>';

                rowsHTML += '<tr>' +
                    '<td> </td>' +
                    '<td> </td>' +
                    '<td> Nợ phí còn lại : </td>' +
                    '<td id="npcl-amount-cell">' + numberWithCommas(hoaDon_select.SoTienPhaiDong - tt) + '</td>' +
                    '<td "></td>' +
                    '</tr>'
            }
            else
                rowsHTML += '<td> <strong> Hóa đơn chưa có dữ liệu thanh toán  </strong> </td>'

            document.getElementById('tbody-lsthp').innerHTML = rowsHTML;


            var text = document.getElementById('keyword').value;
            showTableFinance(text, currentPage, collum, orderby,dateFilter);
        },
        error: function (xhr, status, error) {

            console.error(error);
        }
    });



    document.getElementById('tb1').innerHTML = "Đã cập nhật thành công!";

    document.querySelector('.add-success').style.display = 'block';

    setTimeout(function () {
        document.querySelector('.add-success').style.display = 'none';

    }, 1500);
    // Submit the form

}

// Xoa giao dich lsthp

function deleteRow(index) {
    document.querySelector('.delete-ques-trans').style.display = 'block';
    document.querySelector('#modal-ques-trans').style.display = 'block';

    document.getElementById('delete-trans').addEventListener('click', () => {
        document.querySelector('.delete-ques-trans').style.display = 'none';
        document.querySelector('#modal-ques-trans').style.display = 'none';

        tbody = document.getElementById('tbody-lsthp');
        tbody.deleteRow(index);

        var tt = parseNumericValue(document.getElementById('total-amount-cell').textContent);

        tt -= parseInt(lsthp[index].SoTien);
        document.getElementById("total-amount-cell").textContent = numberWithCommas(tt);

        var remainingFee = parseInt(hoaDon_select.SoTienPhaiDong - tt);
        document.getElementById("npcl-amount-cell").textContent = numberWithCommas(remainingFee);



        lsthp.splice(index, 1);
        var rows = tbody.querySelectorAll('tr');
        // rows.length -=1;
        for (var i = index; i < lsthp.length; i++) {
            var row = tbody.rows[i];
            // var row2 = tbody.rows[i];
            row.cells[0].textContent = i + 1;

            row.querySelector('#edit-lsthp-btn').setAttribute('onclick', 'editRow(' + i + ')');
            row.querySelector('#delete-lsthp-btn').setAttribute('onclick', 'deleteRow(' + i + ')');


        }

    });

    document.getElementById('btn-cancle-delete-trans').addEventListener('click', () => {
        document.querySelector('.delete-ques-trans').style.display = 'none';
        document.querySelector('#modal-ques-trans').style.display = 'none';


    });




}

document.getElementById('delete-trans').addEventListener('click', function (event) {
    document.querySelector('.delete-ques-trans').style.display = 'none';
    document.querySelector('#modal-ques-trans').style.display = 'none';


});

///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////// Chi Phi ////////////////////////

document.getElementById('btn-tab2').addEventListener('mouseenter', () => {
    document.getElementById('nav-container-Tab2').style.display = 'block';
});
document.getElementById('btn-tab2').addEventListener('mouseleave', () => {
    document.getElementById('nav-container-Tab2').style.display = 'none';
});
document.getElementById('nav-container-Tab2').addEventListener('mouseenter', () => {
    document.getElementById('nav-container-Tab2').style.display = 'block';
});
document.getElementById('nav-container-Tab2').addEventListener('mouseleave', () => {
    document.getElementById('nav-container-Tab2').style.display = 'none';
});


document.getElementById('btn-tab1').addEventListener('click', () => {
    window.location.href = "./manageFinance.php";
});

document.getElementById('btn-tab3').addEventListener('click', () => {
    window.location.href = "./manageHistoryFinance.php";

});

