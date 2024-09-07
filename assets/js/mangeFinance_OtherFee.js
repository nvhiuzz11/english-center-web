var countData = dsHoaDon.length;
var currentPage = 1;
var collum = "";
var orderby = "";
var selectedKind = "";
var selectedStatus = "";
var dateFilter = "";
showTableFinance("",  1, collum, orderby, "");


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






function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
//Hiẹn thị bảng


var filteredData_ds;

function hienthids(status, kind, filteredData, page, date) {
    filteredData_ds = [];
    document.querySelector(".tbody-1").innerHTML = '';
    document.querySelector(".tbody-5").innerHTML = '';
    filteredData = dsHoaDon;
    if (status && kind) {

        filteredData = dsHoaDon.filter(function (hoaDon) {
            return hoaDon['TrangThai'] === status;
        });

        filteredData = filteredData.filter(function (hoaDon) {
            return hoaDon['LoaiHD'] === kind;
        });
    }
    else {
        if (kind) {
            filteredData = dsHoaDon.filter(function (hoaDon) {
                return hoaDon['LoaiHD'] === kind;
            });
        }
        else if (status) {
            filteredData = dsHoaDon.filter(function (hoaDon) {
                return hoaDon['TrangThai'] === status;
            });
        }

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
        return;
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

            if (i >= (page - 1) * 50 && i <= page * 50 - 1) {
                
                html += '<tr onclick="handleRowClick(' + i + ')">';
                html += '<td style="width:20px ;background-color:' + color + '">' + (i + 1) + '</td>';
                html += '<td style = "background-color:' + color + '">' + filteredData[i]['MaHD'] + '</td>';
                html += '<td style = "background-color:' + color + '">' + filteredData[i]['TenHD'] + '</td>';
                html += '<td style = "background-color:' + color + '">' + filteredData[i]['LoaiHD'] + '</td>';
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
        html_last += '<td >' + 'Tổng : </td>';
        html_last += '<td >' + numberWithCommas(tongSoTien) + '</td>';
        html_last += '<td >' + 'Đã thanh toán :</td>';
        html_last += '<td >' + numberWithCommas(tienDaTT) + '(' + dem1 + ')</td>';
        html_last += '</tr>';

        html_last += '<tr>';
        html_last += '<td style="width:20px ;  ">' + '</td>';
        html_last += '<td >' + '</td>';
        html_last += '<td >' + '</td>';
        html_last += '<td >' + '</td>';
        html_last += '<td >' + ' </td>';
        html_last += '<td >' + '</td>';
        html_last += '<td >' + 'Chưa thanh toán :</td>';
        html_last += '<td >' + numberWithCommas(tienChuaTT) + '(' + dem0 + ')</td>';
        html_last += '</tr>';


        document.querySelector(".tbody-1").innerHTML = html;
        document.querySelector(".tbody-5").innerHTML = html_last;
    }
}



var selectKind = document.getElementById('select-kind-bill');
var selectStatus = document.getElementById('select-status');
var check_status = false;
var check_kind = false;



selectStatus.addEventListener('change', function () {
    selectedStatus = selectStatus.value;
    currentPage = 1;
    hienthids(selectedStatus, selectedKind, filteredData_ds, currentPage, dateFilter);
    showindex();
});


selectKind.addEventListener('change', function () {
    selectedKind = selectKind.value;
    currentPage = 1;
    hienthids(selectedStatus, selectedKind, filteredData_ds, currentPage, dateFilter);
    showindex();
});

document.getElementById("month-year").addEventListener('change',function(){
    dateFilter = document.getElementById("month-year").value;
    currentPage = 1;
    hienthids(selectedStatus, selectedKind, filteredData_ds, currentPage, dateFilter);
    showindex();
    
});




function showTableFinance(text, page, collumSort, order, date) {

    $.ajax({
        url: '../api/showTableOtherFee.php',
        type: 'POST',
        data: {
            key: text,
            collumSort: collumSort,
            order: order,
        },
        success: function (res) {
            dsHoaDon = JSON.parse(res);
            
            hienthids(selectedStatus, selectedKind, filteredData_ds, page, date);
            showindex();
        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });

}


function searchList() {
    collum = "";
    orderby = "";
    var text = document.getElementById('keyword').value;
    currentPage = 1;
    showTableFinance(text, 1, collum, orderby, dateFilter);
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
    showTableFinance(text, pageNumber, collum, orderby, dateFilter);
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

    if (columnIndex == 1) collum = "MaHD";
    else if (columnIndex == 2) collum = "TenHD";
    else if (columnIndex == 3) collum = "LoaiHD";
    else if (columnIndex == 4) collum = "ThoiGian";
    else if (columnIndex == 5) collum = "SoTien";
    else if (columnIndex == 6) collum = "ThoiGianTT";
    else if (columnIndex == 7) collum = "TrangThai";


    if (sortDirection[columnIndex] === 'asc') {
        sortDirection[columnIndex] = 'desc';
        orderby = "desc";

    } else {
        sortDirection[columnIndex] = 'asc';
        orderby = "asc";
    }
    var text = document.getElementById('keyword').value;
    showTableFinance(text, currentPage, collum, orderby, dateFilter);

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

document.querySelector('.btn-close-add').addEventListener('click', () => {
    modalBgAdd.style.display = 'none';
    document.getElementById('form-add-bill').reset();
    document.getElementById('lb-name-add').textContent = "";

    document.getElementById('lb-time-add').textContent = "";


    document.getElementById('lb-kind-add').textContent = "";

    document.getElementById('lb-money-add').textContent = "";
})


// Khi nhấn tao

document.getElementById('sumit-bill-add').addEventListener('click', function (event) {
    var check = true;

    event.preventDefault();

    const name_bill = document.getElementById('bill-name-add').value;
    const month_bill = document.getElementById('bill-month-add').value;
    const year_bill = document.getElementById('bill-year-add').value;
    const kind_bill = document.getElementById('bill-kind-add').value;
    const money = document.getElementById('money-add-bill').value;
    const status = document.getElementById('bill-status-add').value;

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
    if (!kind_bill) {

        document.getElementById('lb-kind-add').textContent = "*Chưa chọn loại hóa đơn";
        check = false;
    } else
        document.getElementById('lb-kind-add').textContent = "";
    if (!money) {

        document.getElementById('lb-money-add').textContent = "*Chưa ghi số tiền";
        check = false;
    } else
        document.getElementById('lb-money-add').textContent = "";


    if (!check)
        return;


    $.ajax({
        url: '../api/addOtherFee.php',
        type: 'POST',
        data: {
            name: name_bill,
            month: month_bill,
            year: year_bill,
            kind: kind_bill,
            money: money,
            status: status,
        },
        success: function (res) {
            var text = document.getElementById('keyword').value;
            showTableFinance(text, currentPage, collum, orderby, dateFilter);
        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });



    document.getElementById('tb1').innerHTML = 'Đã thêm hóa đơn "' + name_bill + '"' + " thành công!";
    document.getElementById('form-add-bill').reset();
    document.querySelector('.add-success').style.display = 'block';

    setTimeout(function () {
        document.querySelector('.add-success').style.display = 'none';

    }, 1500);
});




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



    maHD_select = selectedRow.MaHD;



    for (var i = 0; i < dsHoaDon.length; i++) {
        if (maHD_select == dsHoaDon[i].MaHD)
            hoaDon_select = dsHoaDon[i];
    }

    document.getElementById('id-bill-detail').textContent = maHD_select;
    document.getElementById('name-bill-detail').textContent = hoaDon_select.TenHD;
    document.getElementById('kind-bill-detail').textContent = hoaDon_select.LoaiHD;
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


    const status = document.getElementById('status-detail').value;

    event.preventDefault();

    $.ajax({
        url: '../api/updateStatusOF.php',
        type: 'POST',
        data: {
            id: hoaDon_select.MaHD,
            status: status,
        },
        success: function (res) {
            dsHoaDon = JSON.parse(res);

            for (var i = 0; i < dsHoaDon.length; i++) {
                if (hoaDon_select.MaHD == dsHoaDon[i].MaHD)
                    hoaDon_select = dsHoaDon[i];
            }


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

            var text = document.getElementById('keyword').value;
            showTableFinance(text, currentPage, collum, orderby, dateFilter);
        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });


    document.getElementById('tb1').innerHTML = "Đã cập nhật trạng thái  thành công! ";

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


    var time = hoaDon_select.ThoiGian;
    var tt = hoaDon_select.TrangThai;
    var kind = hoaDon_select.LoaiHD;
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

    select = document.getElementById("bill-kind-edit");
    for (var i = 0; i < select.options.length; i++) {
        var option = select.options[i];
        if (option.value == kind) {
            option.selected = true;
        }
    }



    document.getElementById('id-bill-edit').value = maHD_select;
    document.getElementById('bill-name-edit').value = hoaDon_select.TenHD;


    document.getElementById('money-edit-bill').value = numberWithCommas(hoaDon_select.SoTien);


    if (hoaDon_select.ThoiGianTT != null)
        document.getElementById('time-tt-edit-bill').value = hoaDon_select.ThoiGianTT;
    // else {
    //     document.getElementById('time-tt-edit-bill').value = '';

    // }



    modalBgEdit.style.display = "block";



});

document.querySelector('.cancle-btn').addEventListener('click', () => {
    modalBgEdit.style.display = 'none';

    document.getElementById('lb-name-edit').textContent = "";
    document.getElementById('lb-time-edit').textContent = "";
    document.getElementById('lb-kind-edit').textContent = "";
    document.getElementById('lb-money-edit').textContent = "";
    document.getElementById('lb-time-tt-edit').textContent = "";
    document.getElementById('form-edit-bill').reset();


});

// Cap nhat sua hoa don
document.getElementById('update-bill-edit').addEventListener('click', function (event) {
    var check = true;

    event.preventDefault();

    const name_bill = document.getElementById('bill-name-edit').value;
    const month_bill = document.getElementById('bill-month-edit').value;
    const year_bill = document.getElementById('bill-year-edit').value;
    const kind_bill = document.getElementById('bill-kind-edit').value;
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
    if (!kind_bill) {

        document.getElementById('lb-kind-edit').textContent = "*Chưa chọn loại hóa đơn";
        check = false;
    } else
        document.getElementById('lb-kind-edit').textContent = "";
    if (!money) {

        document.getElementById('lb-money-edit').textContent = "*Chưa ghi số tiền";
        check = false;
    } else
        document.getElementById('lb-money-edit').textContent = "";

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
        url: '../api/updateOtherFee.php',
        type: 'POST',
        data: {
            id: hoaDon_select.MaHD,
            name: name_bill,
            month: month_bill,
            year: year_bill,
            money: money,
            time: time_tt,
            status: status,
            kind: kind_bill,
        },
        success: function (res) {
            dsHoaDon = JSON.parse(res);

            for (var i = 0; i < dsHoaDon.length; i++) {
                if (hoaDon_select.MaHD == dsHoaDon[i].MaHD)
                    hoaDon_select = dsHoaDon[i];
            }

            document.getElementById('id-bill-detail').textContent = maHD_select;
            document.getElementById('name-bill-detail').textContent = hoaDon_select.TenHD;
            document.getElementById('kind-bill-detail').textContent = hoaDon_select.LoaiHD;
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

            var text = document.getElementById('keyword').value;
            showTableFinance(text, currentPage, collum, orderby, dateFilter);
        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });

    modalBgEdit.style.display = 'none';
    document.getElementById('tb1').innerHTML = 'Đã cập nhật sửa đổi  hóa đơn "' + name_bill + '"' + " thành công!";
    document.getElementById('form-edit-bill').reset();
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
        url: '../api/deleteOtherFee.php',
        type: 'POST',
        data: {
            mahd: hoaDon_select.MaHD,
        },
        success: function (res) {
            var text = document.getElementById('keyword').value;
            showTableFinance(text, currentPage, collum, orderby, dateFilter);
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
        url: '../api/deleteOtherFee.php',
        type: 'POST',
        data: {
            mahd: hoaDon_select.MaHD,
        },
        success: function (res) {
            var text = document.getElementById('keyword').value;
            showTableFinance(text, currentPage, collum, orderby, dateFilter);
        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });


    document.querySelector('#modal-ques').style.display = 'none';
    document.querySelector('.delete-bill-ques-2').style.display = 'none';
    modalBg.style.display = 'none';
    document.querySelector('.delete-success').style.display = 'block';
    setTimeout(function () {
        document.querySelector('.delete-success').style.display = 'none';
    }, 1500);

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




