var countData = dsHoaDon.length;
var currentPage = 1;
var collum = "";
var orderby = "";
var selectedStatus = "";
var dateFilter = "";
showTableFinance("", 1, collum, orderby, "");




function convertDateFormat(dateString) {
    var dateParts = dateString.split("-");
    var formattedDate = dateParts[2] + "-" + dateParts[1] + "-" + dateParts[0];
    return formattedDate;
}

function parseCustomDateFormat(dateString, format) {
    var parts = dateString.split('-');
    if (parts.length !== 3) return NaN;

    var day = parseInt(parts[0], 10);
    var month = parseInt(parts[1], 10) - 1;
    var year = parseInt(parts[2], 10);

    return new Date(year, month, day);
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
var filteredData_ds;

function hienthids(status, filteredData, page, date) {
    filteredData_ds = [];
    document.querySelector(".tbody-1").innerHTML = '';
    document.querySelector(".tbody-5").innerHTML = '';
    var filteredData = dsHoaDon;
    if (status !== "") {

        filteredData = dsHoaDon.filter(function (hoaDon) {
            return hoaDon['TrangThai'] === status;
        });
    }

    if (date != "") {
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
    var tongSoTien = 0; var tienChuaTT = 0; var tienDaTT = 0; var dem1 = 0; var dem0 = 0;
    if (filteredData.length != 0) {
        for (var i = 0; i < filteredData.length; i++) {
            if (filteredData[i]['TrangThai'] === 'Đã thanh toán') {
                color = "lightgreen";
                tienDaTT +=  parseInt(filteredData[i]['SoTien']);

                dem1++;
            }
            else {
                color = "#ff9393";
                tienChuaTT +=  parseInt(filteredData[i]['SoTien']);
                dem0++;
            }
            // else { color = "#bcbdff" }
            if (i >= (page - 1) * 50 && i <= page * 50 - 1) {
                html += '<tr onclick="handleRowClick(' + i + ')">';
                html += '<td style="width:20px ;background-color:' + color + '">' + (i + 1) + '</td>';
                html += '<td style = "background-color:' + color + '">' + filteredData[i]['MaLuong'] + '</td>';
                html += '<td style = "background-color:' + color + '">' + filteredData[i]['TenHD'] + '</td>';
                html += '<td style = "background-color:' + color + '">' + filteredData[i]['MaGV'] + '</td>';
                html += '<td style = "background-color:' + color + '">' + filteredData[i]['TenGV'] + '</td>';
                html += '<td style = "background-color:' + color + '">' + filteredData[i]['Lop'] + '</td>';
                html += '<td style = "background-color:' + color + '">' + filteredData[i]['ThoiGian'] + '</td>';
                html += '<td style = "background-color:' + color + '">' + numberWithCommas(filteredData[i]['SoTien']) + '</td>';

                if (filteredData[i]['ThoiGianTT'] != null) {
                    html += '<td style = "background-color:' + color + '">' + convertDateFormat(filteredData[i]['ThoiGianTT']) + '</td>';
                }
                else {
                    html += '<td style = "background-color:' + color + '">' + '' + '</td>';
                }

                html += '<td style = "background-color:' + color + '">' + filteredData[i]['TrangThai'] + '</td>';

                html += '</tr>';
            }

            tongSoTien +=  parseInt(filteredData[i]['SoTien']);
        }

        html_last += '<tr>';
        html_last += '<td style="width:20px ;  ">' + '</td>';
        html_last += '<td >' + '</td>';
        html_last += '<td >' + '</td>';
        html_last += '<td >' + '</td>';
        html_last += '<td >' + '</td>';
        html_last += '<td >' + '</td>';
        html_last += '<td >' + 'Tổng : </td>';
        html_last += '<td >' + numberWithCommas(tongSoTien) + '</td>';
        html_last += '<td >' + 'Đã thanh toán:  </td>';
        html_last += '<td >' + numberWithCommas(tienDaTT) + '(' + dem1 + ') </td>';

        html_last += '</tr>';
        html_last += '<tr>';
        html_last += '<td style="width:20px ;  ">' + '</td>';
        html_last += '<td >' + '</td>';
        html_last += '<td >' + '</td>';
        html_last += '<td >' + '</td>';
        html_last += '<td >' + '</td>';
        html_last += '<td >' + '</td>';
        html_last += '<td >' + '</td>';
        html_last += '<td >' + '</td>';
        html_last += '<td >' + 'Chưa thanh toán: </td>';
        html_last += '<td >' + numberWithCommas(tienChuaTT) + '(' + dem0 + ') </td>';

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
        url: '../api/showTableWageTea.php',
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
    

    if (columnIndex == 1 ) collum = "MaLuong";
    else if(columnIndex == 2) collum = "TenHD";
    else if(columnIndex == 3) collum = "MaGV";
    else if(columnIndex == 4) collum = "TenGV";
    else if(columnIndex == 5) collum = "Lop";
    else if(columnIndex == 6) collum = "ThoiGian";
    else if(columnIndex == 7) collum = "SoTien";
    else if(columnIndex == 8) collum = "ThoiGianTT";
    else if(columnIndex == 9) collum = "TrangThai";



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

const modalBgAdd = document.querySelector('.modal-bg-add');
const modalContentAdd = document.querySelector('.modal-content-add');

document.querySelector('.add-bill-button').addEventListener('click', () => {
    modalBgAdd.style.display = 'block';
})


// thay doi selection chọn giáo viên
var monthSelect = document.getElementById("bill-month-add");
var yearSelect = document.getElementById("bill-year-add");
var teacherSelect = document.getElementById("bill-teacher-add");

monthSelect.addEventListener("change", updateTeacherOptions);
yearSelect.addEventListener("change", updateTeacherOptions);
var addedTeachers = [];

function updateTeacherOptions() {

    var selectedMonth = monthSelect.value;
    var selectedYear = yearSelect.value;
    var check = true;

    if (inputsValue.length != 0) {
        inputs.forEach(input => outputDiv.removeChild(input));
        inputs = [];
        inputsValue = [];
    }
    while (teacherSelect.options.length > 0) {
        teacherSelect.remove(0);
    }

    
    var defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Chọn Giáo viên';
    teacherSelect.appendChild(defaultOption);

    // Tạo mảng tạm thời để lưu trữ các giáo viên đã được thêm vào select bill-teacher-add
    addedTeachers = [];
    // Lặp qua các bản ghi trong dsgv_lopxdd
    for (var i = 0; i < dsgv_lopxdd.length; i++) {
        var diemdanh = dsgv_lopxdd[i];
        var diemdanhMonth = parseInt(diemdanh.ThoiGian.split("-")[1]);
        var diemdanhYear = parseInt(diemdanh.ThoiGian.split("-")[0]);

        // Kiểm tra xem bản ghi đang xét có cùng tháng và năm được chọn hay không
        if ((diemdanhMonth == selectedMonth) && (diemdanhYear == selectedYear)) {

            var teacher = {
                MaGV: diemdanh.MaGV,
                TenGV: diemdanh.TenGV
            };

            // Kiểm tra xem giáo viên đã tồn tại trong mảng tạm thời hay chưa
            var isTeacherAdded = addedTeachers.some(function (addedTeacher) {
                return addedTeacher.MaGV === teacher.MaGV && addedTeacher.TenGV === teacher.TenGV;
            });

            if (!isTeacherAdded && check) {
                var defaultOption = document.createElement('option');
                defaultOption.value = 'Tất cả';
                defaultOption.textContent = 'Tất cả';
                teacherSelect.appendChild(defaultOption);
                check = false;
            }

            // Nếu giáo viên chưa tồn tại trong mảng tạm thời, thêm giáo viên và option tương ứng
            if (!isTeacherAdded) {
                addedTeachers.push(teacher);
                var option = document.createElement("option");
                option.value = teacher.MaGV + '.' + teacher.TenGV;
                option.text = teacher.MaGV + " - " + teacher.TenGV;
                teacherSelect.add(option);
            }
        }
    }
}




// class
const select = document.getElementById("bill-teacher-add");
const outputDiv = document.getElementById("div-bill-class-add");
const options_All = document.querySelectorAll('#bill-teacher-add option');

var inputs = [];
var inputsValue = [];



select.addEventListener("change", (event) => {
    //Xóa input đã chọn nếu có
    var check = true;
    const selectedOption = event.target.value;

    if (selectedOption === 'Tất cả') {
        inputs.forEach(input => outputDiv.removeChild(input));
        inputs = [];
        inputsValue = [];
        const options_All = addedTeachers;
        for (var i = 0; i < options_All.length; i++) {
            const input = document.createElement('input');
            input.type = 'text';
            input.value = options_All[i].MaGV + '.' + options_All[i].TenGV;
            input.setAttribute('readonly', 'readonly');

            inputsValue.push(options_All[i].MaGV);
            inputs.push(input);
            outputDiv.appendChild(input);
        }

    }
    else {

        if (!inputsValue.includes(selectedOption)) {
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

    document.getElementById('form-add-bill').reset();
    document.getElementById('form-add-bill-ps').reset();

    inputs2.forEach(input => outputDiv2.removeChild(input));
    inputs2 = [];
    inputsValue2 = [];
    inputs.forEach(input => outputDiv.removeChild(input));
    inputs = [];
    inputsValue = [];
});

// Khi nhấn tao

document.getElementById('sumit-bill-add').addEventListener('click', function (event) {
    var check = true;

    event.preventDefault();
    const name_bill = document.getElementById('bill-name-add').value;
    const month_bill = document.getElementById('bill-month-add').value;
    const year_bill = document.getElementById('bill-year-add').value;

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

        document.getElementById('lb-class-add').textContent = "*Chưa chọn giáo viên";
        check = false;
    } else
        document.getElementById('lb-class-add').textContent = "";

    document.getElementById('teacher-add-bill').value = inputsValue;
    const teacher_bill = document.getElementById('teacher-add-bill').value;

    if (!check)
        return;

    $.ajax({
        url: '../api/addWageTeacher.php',
        type: 'POST',
        data: {
            name: name_bill,
            month: month_bill,
            year: year_bill,
            teacher: teacher_bill,
        },
        success: function (res) {
            var text = document.getElementById('keyword').value;
            showTableFinance(text, currentPage, collum, orderby,dateFilter);
        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });


    document.getElementById('tb1').innerHTML = "Đã thêm lương giáo viên tháng " + month_bill + "/" + year_bill + " thành công!";
    document.getElementById('form-add-bill').reset();
    inputs.forEach(input => outputDiv.removeChild(input));
    inputs = [];
    inputsValue = [];
    document.querySelector('.add-success').style.display = 'block';

    setTimeout(function () {
        document.querySelector('.add-success').style.display = 'none';

    }, 1500);
});


// Thêm hóa đơn cá nhân

//ds giáo viên
var inputText = document.getElementById("name-teacher-add-bill");



const select2 = document.getElementById("bill-teacher-add-ps");
const outputDiv2 = document.getElementById("div-bill-class-add-ps");
const options_All2 = document.querySelectorAll('#bill-teacher-add-ps option');

var inputs2 = [];
var inputsValue2 = [];



select2.addEventListener("change", (event) => {
    //Xóa input đã chọn nếu có
    var check = true;
    const selectedOption = event.target.value;

    if (selectedOption === 'Tất cả') {
        inputs2.forEach(input => outputDiv2.removeChild(input));
        inputs2 = [];
        inputsValue2 = [];
        const options_All2 = dsgv;
        for (var i = 0; i < options_All2.length; i++) {
            const input = document.createElement('input');
            input.type = 'text';
            input.value = options_All2[i].MaGV + '.' + options_All2[i].TenGV;
            input.setAttribute('readonly', 'readonly');

            inputsValue2.push(options_All2[i].MaGV);
            inputs2.push(input);
            outputDiv2.appendChild(input);
        }

    }
    else {

        if (!inputsValue2.includes(selectedOption)) {
            const input = document.createElement('input');
            input.type = 'text';
            input.value = selectedOption;
            input.setAttribute('readonly', 'readonly');

            inputsValue2.push(selectedOption);
            inputs2.push(input);
            outputDiv2.appendChild(input);
        }
    }
});

document.getElementById('reset-class-ps').addEventListener('click', () => {
    inputs2.forEach(input => outputDiv2.removeChild(input));
    inputs2 = [];
    inputsValue2 = [];
});

document.getElementById('reset-2').addEventListener('click', () => {
    inputs2.forEach(input => outputDiv2.removeChild(input));
    inputs2 = [];
    inputsValue2 = [];
})



function formatNumber(input) {
    let value = input.value;
    // Xóa tất cả ký tự không phải là số và dấu phẩy
    value = value.replace(/[^\d,]/g, '');
    // Xóa dấu phẩy hiện có
    value = value.replace(/,/g, '');
    // Thêm dấu phẩy sau mỗi ba chữ số
    value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    input.value = value;
}



document.getElementById('money-add-bill').addEventListener('blur', function () {


    var value = parseNumericValue(this.value);

    if (!value) {
        this.value = '';
    }
    else {
        this.value = numberWithCommas(value);

    }

});


document.getElementById('sumit-bill-add-ps').addEventListener('click', function (event) {

    var check = true;



    event.preventDefault();
    const name_bill = document.getElementById('bill-name-add-ps').value;
    const money = document.getElementById('money-add-bill').value;



    //Kiểm tra dữ liệu nhập vào
    if (inputsValue2.length === 0) {
        document.getElementById('lb-class-add-ps').textContent = "*Chưa chọn giáo viên";
        check = false;
    } else
        document.getElementById('lb-class-add-ps').textContent = "";



    if (!name_bill) {
        document.getElementById('lb-name-add-ps').textContent = "*Chưa nhập tên hóa đơn";
        check = false;
    } else
        document.getElementById('lb-name-add-ps').textContent = "";

    if (!money) {
        document.getElementById('lb-money-add-ps').textContent = "*Chưa số tiền";
        check = false;
    } else
        document.getElementById('lb-money-add-ps').textContent = "";

    if (!check)
        return;

    document.getElementById('teacher-add-bill-ps').value = inputsValue2;
    const teacher_bill_ps = document.getElementById('teacher-add-bill-ps').value;

    $.ajax({
        url: '../api/addWageTeacherps.php',
        type: 'POST',
        data: {
            name: name_bill,
            money: money,
            teacher: teacher_bill_ps,
        },
        success: function (res) {
            var text = document.getElementById('keyword').value;
            showTableFinance(text, currentPage, collum, orderby,dateFilter);
        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });


    document.getElementById('tb1').innerHTML = "Đã thêm hóa đơn " + name_bill + " cho giáo  viên thành công! ";

    document.getElementById('form-add-bill-ps').reset();
    document.querySelector('.add-success').style.display = 'block';

    setTimeout(function () {
        document.querySelector('.add-success').style.display = 'none';

    }, 1500);
});

//thong tin chi tiet hoa don

const rows = document.querySelectorAll('.tbody-1 tr');
const modalBg = document.querySelector('.modal-bg');
const modalContent = document.querySelector('.modal-content');

const select_tt = document.getElementById('status-detail');
var maHD_select;
var hoaDon_select;

var lsthp = [];
function handleRowClick(index) {
    // Xử lý sự kiện khi bấm vào một dòng
    // var selectedRow = rows[index].cells[1];

    var selectedRow = filteredData_ds[index];


    document.getElementById("btn-tab-3-1").classList.add("active");

    document.getElementById("tab-3-1").style.display = 'block';



    maHD_select = selectedRow.MaLuong;

    for (var i = 0; i < dsHoaDon.length; i++) {
        if (maHD_select == dsHoaDon[i].MaLuong)
            hoaDon_select = dsHoaDon[i];
    }

    document.getElementById('id-bill-detail').textContent = maHD_select;
    document.getElementById('name-bill-detail').textContent = hoaDon_select.TenHD;

    document.getElementById('id-st-detail').textContent = hoaDon_select.MaGV;
    document.getElementById('name-st-bill-detail').textContent = hoaDon_select.TenGV;
    document.getElementById('time-bill-detail').textContent = hoaDon_select.ThoiGian;
    document.getElementById('st-bill-detail').textContent = numberWithCommas(hoaDon_select.SoTien);
    if (hoaDon_select.ThoiGianTT != null)
        document.getElementById('time-tt-bill-detail').textContent = convertDateFormat(hoaDon_select.ThoiGianTT);
    else {
        document.getElementById('time-tt-bill-detail').textContent = '';

    }


    if (hoaDon_select.TrangThai == 'Đã thanh toán') {
        select_tt.value = 'Đã thanh toán';
        select_tt.style.color = 'green';
    }
    else {
        select_tt.value = 'Chưa thanh toán';
        select_tt.style.color = 'red';

    }

    var parts = hoaDon_select.ThoiGian.split("/");
    var month = parts[0]; // "7"
    var year = parts[1];
    var html = '';
    if (hoaDon_select.Lop != "") {


        for (var i = 0; i < dssoBuoiDay.length; i++) {
            if (dssoBuoiDay[i].MaGV == hoaDon_select.MaGV && dssoBuoiDay[i].Thang == month && dssoBuoiDay[i].Nam == year) {
                html += dssoBuoiDay[i].MaLop + ': ' + dssoBuoiDay[i].SoBuoiDay + ' buổi             (' + numberWithCommas(dssoBuoiDay[i].TienTraGV) + ' / buổi)' + '<br>';
            }
        }

        document.getElementById('edit-button').hidden = true;
    } else {
        document.getElementById('edit-button').hidden = false;
    }

    document.getElementById('class-bill-detail').innerHTML = html;




    modalBg.style.display = 'block';



}

select_tt.addEventListener("change", function () {
    if (select_tt.value == 'Đã thanh toán')
        select_tt.style.color = 'green';
    else
        select_tt.style.color = 'red';
});

// cap nhat trang thai hoa don

document.getElementById('update-tt').addEventListener('click', function (event) {


    event.preventDefault();

    const status = document.getElementById('status-detail').value;
    $.ajax({
        url: '../api/updateStatusWage.php',
        type: 'POST',
        data: {
            id: hoaDon_select.MaLuong,
            status: status,
        },
        success: function (res) {
            dsHoaDon = JSON.parse(res);

            for (var i = 0; i < dsHoaDon.length; i++) {
                if (hoaDon_select.MaLuong == dsHoaDon[i].MaLuong)
                    hoaDon_select = dsHoaDon[i];
            }


            if (hoaDon_select.TrangThai == 'Đã thanh toán') {
                select_tt.value = 'Đã thanh toán';
                select_tt.style.color = 'green';
            }
            else {
                select_tt.value = 'Chưa thanh toán';
                select_tt.style.color = 'red';
            }

            if (hoaDon_select.ThoiGianTT != null)
                document.getElementById('time-tt-bill-detail').textContent = convertDateFormat(hoaDon_select.ThoiGianTT);
            else {
                document.getElementById('time-tt-bill-detail').textContent = '';
            }

            var text = document.getElementById('keyword').value;
            showTableFinance(text, currentPage, collum, orderby,dateFilter);
        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });

    document.getElementById('tb1').innerHTML = "Đã cập nhật trạng thái  thành công! ";
    document.getElementById('id-wage').value = maHD_select;
    document.querySelector('.add-success').style.display = 'block';

    setTimeout(function () {
        document.querySelector('.add-success').style.display = 'none';

    }, 1500);

});

document.querySelector('.close-btn').addEventListener('click', () => {

    modalBg.style.display = 'none';

});



////Sua thong tin hoa don
const editButton = document.getElementById('edit-button');


const modalBgEdit = document.querySelector('.modal-bg-edit');
const modalContentEdit = document.querySelector('.modal-content-edit');

// Khi  nhấn vào nút "Sửa"
editButton.addEventListener('click', () => {

    document.getElementById('id-bill-edit').value = hoaDon_select.MaLuong;
    document.getElementById('bill-name-edit').value = hoaDon_select.TenHD;
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

    document.getElementById('money-edit-bill').value = numberWithCommas(hoaDon_select.SoTien);


    if (hoaDon_select.ThoiGianTT != null)
        document.getElementById('time-tt-edit-bill').value = hoaDon_select.ThoiGianTT;
    else {
        document.getElementById('time-tt-edit-bill').value = '';
    }


    modalBgEdit.style.display = "block";
});



document.querySelector('.cancle-btn').addEventListener('click', () => {
    modalBgEdit.style.display = 'none';

    document.getElementById('lb-name-edit').textContent = "";
    document.getElementById('lb-time-edit').textContent = "";
    document.getElementById('lb-time-tt-edit').textContent = "";
    document.getElementById('lb-money-edit').textContent = "";
    document.getElementById('form-edit-bill').reset();


});


// Cap nhat sua hoa don
document.getElementById('update-bill-edit').addEventListener('click', function (event) {
    var check = true;


    event.preventDefault();

    const name_bill = document.getElementById('bill-name-edit').value;
    const month_bill = document.getElementById('bill-month-edit').value;
    const year_bill = document.getElementById('bill-year-edit').value;
    const teacher_bill = document.getElementById('teacher-edit').value;
    const money = document.getElementById('money-edit-bill').value;
    const time_tt = document.getElementById('time-tt-edit-bill').value;
    const status = document.getElementById('bill-status-edit').value;


    //Kiểm tra dữ liệu nhập vào

    if (!name_bill) {
        document.getElementById('lb-name-edit').textContent = "*Chưa nhập tên hóa đơn";
        check = false;
    } else
        document.getElementById('lb-name-edit').textContent = "";

    if (!month_bill) {
        document.getElementById('lb-time-edit').textContent = "*Chưa chọn thời gian";
        check = false;
    } else {

        if (!year_bill) {
            document.getElementById('lb-time-edit').textContent = "*Chưa chọn thời gian";
            check = false;
        } else
            document.getElementById('lb-time-edit').textContent = "";
    }

    if (!money) {

        document.getElementById('lb-money-edit').textContent = "*Chưa ghi số tiền";
        check = false;
    } else
        document.getElementById('lb-money-edit').textContent = "";

    if (!teacher_bill) {

        document.getElementById('lb-time-edit').textContent = "*Chưa ghi số tiền";
        check = false;
    } else
        document.getElementById('lb-time-edit').textContent = "";

    if (status == 'Đã thanh toán') {
        if (!time_tt) {

            document.getElementById('lb-time-tt-edit').textContent = "*Chưa cập nhật thời gian thanh toán";
            check = false;
        } else
            document.getElementById('lb-time-tt-edit').textContent = "";

    }

    if (!check)
        return;


    $.ajax({
        url: '../api/updateWageTeacher.php',
        type: 'POST',
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

            document.getElementById('id-bill-detail').textContent = hoaDon_select.MaLuong;
            document.getElementById('name-bill-detail').textContent = hoaDon_select.TenHD;
            document.getElementById('id-st-detail').textContent = hoaDon_select.MaGV;
            document.getElementById('name-st-bill-detail').textContent = hoaDon_select.TenGV;
            document.getElementById('time-bill-detail').textContent = hoaDon_select.ThoiGian;
            document.getElementById('st-bill-detail').textContent = numberWithCommas(hoaDon_select.SoTien);
            if (hoaDon_select.ThoiGianTT != null)
                document.getElementById('time-tt-bill-detail').textContent = convertDateFormat(hoaDon_select.ThoiGianTT);
            else {
                document.getElementById('time-tt-bill-detail').textContent = '';

            }

            if (hoaDon_select.TrangThai == 'Đã thanh toán') {
                select_tt.value = 'Đã thanh toán';
                select_tt.style.color = 'green';
            }
            else {
                select_tt.value = 'Chưa thanh toán';
                select_tt.style.color = 'red';

            }

            var parts = hoaDon_select.ThoiGian.split("/");
            var month = parts[0]; // "7"
            var year = parts[1];
            var html = '';
            if (hoaDon_select.Lop != null) {


                for (var i = 0; i < dssoBuoiDay.length; i++) {
                    if (dssoBuoiDay[i].MaGV == hoaDon_select.MaGV && dssoBuoiDay[i].Thang == month && dssoBuoiDay[i].Nam == year) {
                        html += dssoBuoiDay[i].MaLop + ': ' + dssoBuoiDay[i].SoBuoiDay + ' buổi             (' + numberWithCommas(dssoBuoiDay[i].TienTraGV) + ' / buổi)' + '<br>';
                    }
                }
            }

            document.getElementById('class-bill-detail').innerHTML = html;

            var text = document.getElementById('keyword').value;
            showTableFinance(text, currentPage, collum, orderby,dateFilter);
        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });




    modalBgEdit.style.display = 'none';
    document.getElementById('tb1').innerHTML = 'Đã cập nhật sửa đổi  hóa đơn "' + name_bill + '"' + " thành công!";

    document.querySelector('.add-success').style.display = 'block';

    setTimeout(function () {
        document.querySelector('.add-success').style.display = 'none';

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

    if (hoaDon_select.TrangThai == 'Đã thanh toán') {
        document.querySelector('.delete-bill-ques-2').style.display = 'block';
        return;
    }


    $.ajax({
        url: '../api/deleteWage.php',
        type: 'POST',
        data: {
            mahd: hoaDon_select.MaLuong,
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
        url: '../api/deleteWage.php',
        type: 'POST',
        data: {
            mahd: hoaDon_select.MaLuong,
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
