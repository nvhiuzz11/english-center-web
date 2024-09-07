


function convertDateFormat(dateString) {
    var dateParts = dateString.split("-");
    var formattedDate = dateParts[2] + "-" + dateParts[1] + "-" + dateParts[0];
    return formattedDate;
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

var filteredData_ds = dsHoaDon;
hienthids('', '', filteredData_ds);
function hienthids(status, kind, filteredData) {
    filteredData_ds = [];
    document.querySelector(".tbody-1").innerHTML = '';
    document.querySelector(".tbody-5").innerHTML = '';
    if (status && kind) {

        filteredData = dsHoaDon.filter(function (hoaDon) {
            return hoaDon['TrangThai'] === status;
        });

        filteredData = filteredData.filter(function (hoaDon) {
            return hoaDon['TenHS'] === kind;
        });
    }
    else {
        if (kind) {
            filteredData = dsHoaDon.filter(function (hoaDon) {
                return hoaDon['TenHS'] === kind;
            });
        }
        else if (status) {
            filteredData = dsHoaDon.filter(function (hoaDon) {
                return hoaDon['TrangThai'] === status;
            });
        }

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

            var soBuoi = parseInt(filteredData[i]['SoTien'] / filteredData[i]['HocPhi']);
            html += '<tr onclick="handleRowClick(' + i + ')">';
            html += '<td style="width:20px ;background-color:' + color + '">' + (i + 1) + '</td>';
            html += '<td style = "background-color:' + color + '">' + filteredData[i]['MaHD'] + '</td>';
            html += '<td style = "background-color:' + color + '">' + filteredData[i]['TenHD'] + '</td>';
            html += '<td style = "background-color:' + color + '">' + filteredData[i]['TenHS'] + '</td>';
            html += '<td style = "background-color:' + color + '">' + filteredData[i]['MaLop'] + '<br> (' + soBuoi + ' buổi )' + '</td>';
            html += '<td style = "background-color:' + color + '">' + filteredData[i]['ThoiGian'] + '</td>';
            html += '<td style = "background-color:' + color + '">' + numberWithCommas(filteredData[i]['SoTien']) + '</td>';
            html += '<td style = "background-color:' + color + '">' + filteredData[i]['GiamHocPhi'] + '%</td>';
            html += '<td style = "background-color:' + color + '">' + numberWithCommas(filteredData[i]['SoTienGiam']) + '</td>';
            html += '<td style = "background-color:' + color + '">' + numberWithCommas(filteredData[i]['SoTienPhaiDong']) + '</td>';
            html += '<td style = "background-color:' + color + '">' + numberWithCommas(filteredData[i]['SoTienDaDong']) + '</td>';
            html += '<td style = "background-color:' + color + '">' + numberWithCommas(filteredData[i]['NoPhiConLai']) + '</td>';

            html += '<td style = "background-color:' + color + '">' + filteredData[i]['TrangThai'] + '</td>';

            html += '</tr>';

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
var selectKind = document.getElementById('select-child');
var selectStatus = document.getElementById('select-status');
var check_status = false;
var check_kind = false;
var selectedKind = '';
var selectedStatus = '';


selectStatus.addEventListener('change', function () {
    selectedStatus = selectStatus.value;

    hienthids(selectedStatus, selectedKind, filteredData_ds);

});


selectKind.addEventListener('change', function () {
    selectedKind = selectKind.value;

    hienthids(selectedStatus, selectedKind, filteredData_ds);
});

function showTableBill(text) {

    $.ajax({
        url: '../../api/showTableBillFee.php',
        type: 'POST',
        data: {
            key: text,
            maph : detailParent[0].MaPH,
        },
        success: function (res) {
            dsHoaDon = JSON.parse(res);
            hienthids(selectedStatus, selectedKind, dsHoaDon);

        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });

}


function searchList() {
    var text = document.getElementById('keyword').value;
    showTableBill(text);
    removeSortIcons();
}


function parseNumericValue(value) {
    return parseInt(value.replace(/,/g, ''));
}
function parseDateValue(value) {
    var parts = value.split('/');
    var month = parseInt(parts[0]);
    var year = parseInt(parts[1]);
    return new Date(year, month - 1);
}

var sortDirection = {}; 

function sortTable(columnIndex) {
    var table = document.getElementById('table-1');
    var tbody = table.querySelector('.tbody-1');
    var rows = Array.from(tbody.getElementsByTagName('tr'));
    var sttValues = rows.map(function (row) {
        return parseInt(row.getElementsByTagName('td')[0].innerText.trim());
    });

    rows.sort(function (a, b) {
        var aValue = a.getElementsByTagName('td')[columnIndex].innerText.trim();
        var bValue = b.getElementsByTagName('td')[columnIndex].innerText.trim();


        if (columnIndex === 2 || columnIndex === 3 || columnIndex === 4 || columnIndex === 12) {
            if (sortDirection[columnIndex] === 'asc') {
                return aValue.localeCompare(bValue);
            } else {
                return bValue.localeCompare(aValue);
            }
        }
        else
            if (columnIndex === 0) {
                // return parseInt(aValue) - parseInt(bValue);
                return;
            } else if (columnIndex === 5) {
                var aDate = parseDateValue(aValue);
                var bDate = parseDateValue(bValue);

                if (sortDirection[columnIndex] === 'asc') {
                    return aDate - bDate;
                } else {
                    return bDate - aDate;
                }
            } else {
                aValue = parseNumericValue(aValue);
                bValue = parseNumericValue(bValue);

                if (sortDirection[columnIndex] === 'asc') {
                    return aValue - bValue;
                } else {
                    return bValue - aValue;
                }
            }


    });



    rows.forEach(function (row, index) {
        var sttCell = row.getElementsByTagName('td')[0];
        sttCell.innerText = sttValues[index];
    });

    rows.forEach(function (row) {
        tbody.appendChild(row);
    });


    
    if (sortDirection[columnIndex] === 'asc') {
        sortDirection[columnIndex] = 'desc';
    } else {
        sortDirection[columnIndex] = 'asc';
    }

    
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
    sortIcon.src = '../../assets/images/iconSort.png';
    sortIcon.style.width = '20px';
    sortIcon.style.backgroundColor = 'white';
    sortIcon.style.borderRadius = '30px';
    if (sortDirection[columnIndex] === 'desc') {
        sortIcon.style.transform = 'rotate(180deg)';

    }
    clickedHeader.appendChild(sortIcon);
}

// chi tiêt lich su tt
const rows = document.querySelectorAll('.tbody-1 tr');
const modalBg = document.querySelector('.modal-bg');
const modalContent = document.querySelector('.modal-content');


var maHD_select;
var hoaDon_select;

var lsthp = [];
function handleRowClick(index) {
    var selectedRow = filteredData_ds[index];
    maHD_select = selectedRow.MaHD;

    for (var i = 0; i < dsHoaDon.length; i++) {
        if (maHD_select == dsHoaDon[i].MaHD)
            hoaDon_select = dsHoaDon[i];
    }

    lsthp = [];
    var k = 0;
    for (var i = 0; i < ds_LS_THP.length; i++) {
        if (maHD_select == ds_LS_THP[i].MaHD)
            lsthp[k++] = ds_LS_THP[i];
    }

    document.getElementById('id-bill-lsthp').textContent = numberWithCommas(hoaDon_select.MaHD);
    document.getElementById('stpd-lsthp').textContent = numberWithCommas(hoaDon_select.SoTienPhaiDong);
    var tt = document.getElementById('tt-lsthp');
    if (hoaDon_select.TrangThai == 'Hoàn thành') {
        tt.style.color = 'green';
    }
    else if (hoaDon_select.TrangThai == 'Còn nợ') {
        tt.style.color = 'purple';
    }
    else
        tt.style.color = 'red';
    tt.textContent = hoaDon_select.TrangThai;
    var tbody = document.getElementById('tbody-lsthp');

    // Xây dựng chuỗi HTML cho các hàng

    var rowsHTML = '';
    var tt = 0;
    if (lsthp.length != '0') {
        for (var i = 0; i < lsthp.length; i++) {
            var giaoDich = lsthp[i];
            rowsHTML += '<tr>' +
                '<td>' + (i + 1) + '</td>' +
                '<td>' + giaoDich.MaGD + '</td>' +
                // '<td class="thoi-gian">' + convertDateFormat(giaoDich.ThoiGian) + '</td>' +
                '<td> <input type="date" value ="' + giaoDich.ThoiGian + '" required readonly>' + '</td>' +
                '<td  class="so-tien" pattern="[0-9,]+">' + numberWithCommas(giaoDich.SoTien) + '</td>' +
                '</tr>';
            tt += parseInt(giaoDich.SoTien);
        }
        rowsHTML += '<tr>' +
            '<td> </td>' +
            '<td> </td>' +
            '<td> Tổng tiền : </td>' +
            '<td id="total-amount-cell">' + numberWithCommas(tt) + '</td>' +
            '</tr>';
        rowsHTML += '<tr>' +
            '<td> </td>' +
            '<td> </td>' +

            '<td> Nợ phí còn lại : </td>' +
            '<td id="npcl-amount-cell">' + numberWithCommas(hoaDon_select.SoTienPhaiDong - tt) + '</td>' +

            '</tr>'
    }
    else
        rowsHTML = "Hóa đơn chưa có dữ liệu thanh toán";

    tbody.innerHTML = rowsHTML;
    modalBg.style.display = 'block';
}

document.querySelector('.close-btn').addEventListener('click', () => {

    modalBg.style.display = 'none';
    document.getElementById('tbody-lsthp').innerHTML = '';

});




document.getElementById('btn-add-trans').addEventListener('click', function () {

    var newPageUrl = '../../pages/recharge/recharge.html';

    // Mở tab mới
    window.open(newPageUrl, '_blank');
});


var button = document.getElementById('btn-nofi');
var hiddenDiv = document.getElementById('div-nofi');

button.addEventListener('click', function () {
    hiddenDiv.style.display = hiddenDiv.style.display === 'block' ? 'none' : 'block';

});


var divNofiContainer = document.getElementById('div-nofi');
showNotification();
function showNotification() {
    divNofiContainer.innerHTML = "";

    ds_yeuCau.forEach(function (yeuCau) {

        var nofiDiv = document.createElement('div');
        nofiDiv.id = 'nofi';
        nofiDiv.innerHTML = '<p>Học viên ' + yeuCau.TenHS + ' đã gửi yêu cầu liên kết với bạn</p>' +
            '<button onclick="tuChoi(' + yeuCau.MaHS + ',' + yeuCau.MaPH + ')">Từ chối</button>' +
            '<button onclick="chapNhan(' + yeuCau.MaHS + ',' + yeuCau.MaPH + ')">Chấp nhận</button>';

        divNofiContainer.appendChild(nofiDiv);


    });

    dsHoaDon_CD.forEach(function (yeuCau) {
        yeuCau

        var nofiDiv = document.createElement('div');
        nofiDiv.id = 'nofi';
        nofiDiv.innerHTML = '<p> Hóa đơn ' + yeuCau.TenHD + ' (' + numberWithCommas(yeuCau.SoTienPhaiDong) + ' VND) của  Học viên ' + yeuCau.TenHS + '  chưa được thanh toán</p>'
        divNofiContainer.appendChild(nofiDiv);
    });



    dsHoaDon_CN.forEach(function (yeuCau) {

        var nofiDiv = document.createElement('div');
        nofiDiv.id = 'nofi';
        nofiDiv.innerHTML = '<p> Hóa đơn ' + yeuCau.TenHD + ' còn nợ (' + numberWithCommas(yeuCau.NoPhiConLai) + ' VND) của  Học viên ' + yeuCau.TenHS + '  chưa được thanh toán</p>'
        divNofiContainer.appendChild(nofiDiv);
    });
    var imgElement = document.getElementById("img-nofi");


    if (ds_yeuCau.length || dsHoaDon_CD.length || dsHoaDon_CN.length) {
        imgElement.src = "../../assets/images/bell-1.png";
    } else {
        imgElement.src = "../../assets/images/bell.png";
        document.getElementById('div-nofi').innerHTML = "<p>Không có thông báo mới!</p>";
    }


}









function tuChoi(maHS, maPH) {
    

    $.ajax({
        url: '../../api/replyRequest.php',
        type: 'POST',
        data: {
            maph: maPH,
            mahs: maHS,
            rep: "refuse",
            nyc : "ph",
        },
        success: function (res) {
            
            ds_yeuCau = JSON.parse(res).listRequest;
          
            showNotification();

            
        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });


}

function chapNhan(maHS, maPH) {


    $.ajax({
        url: '../../api/replyRequest.php',
        type: 'POST',
        data: {
            maph: maPH,
            mahs: maHS,
            rep: "accept",
            nyc : "ph",
        },
        success: function (res) {
           
            ds_yeuCau = JSON.parse(res).listRequest;
         
            showNotification();
 
        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });
}