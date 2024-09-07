var dsHoaDon;
var currentPage = 1;
var collum = "";
var orderby = "";

var selectedKind = '';

showTableFinance("", collum, orderby);



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
document.getElementById("btn-tab3").classList.add("active");







function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


//Hiẹn thị bảng
// var filteredData = dsHoaDon;

var filteredData;
var filteredData_ds;


function hienthids(kind, dsHoaDon_vl, page) {

     filteredData = dsHoaDon_vl;

    if (kind) {
        filteredData = filteredData.filter(function (hoaDon) {
            return hoaDon['Loai'] === kind;
        });
    }


    if (!filteredData.length) {
        document.querySelector(".tbody-1").innerHTML = "Không có kết quả phù hợp";
        document.querySelector(".tbody-5").innerHTML = '';
    }
    else {
        if (kind) {
            filteredData = dsHoaDon_vl.filter(function (hoaDon) {
                return hoaDon['Loai'] === kind;
            });
        }


        var html = '';
        var html_last = '';
        var color = '';
        var tongSoTien = 0;
        var tongThu = 0;
        var tongChi = 0;

        if (filteredData.length != 0) {
            for (var i = 0; i < filteredData.length; i++) {
                if (filteredData[i]['Loai'] === 'thu') {
                    tongThu += parseInt(filteredData[i]['SoTien']);
                    color = "#84e3b5";
                } else {
                    tongChi +=  parseInt(filteredData[i]['SoTien']);
                    color = "#ffd093";
                }
                if (i >= (page - 1) * 50 && i <= page * 50 - 1) {
                    html += '<tr>';
                    html += '<td style="width:100px ;background-color:' + color + '">' + (i + 1) + '</td>';
                    html += '<td style="background-color:' + color + '">' + filteredData[i]['TenHD'] + '</td>';

                    var name = '';
                    if (filteredData[i]['LoaiHD'] == 'Học phí') {
                        name += 'HV: ' + filteredData[i]['DoiTuong'];
                    } else if (filteredData[i]['LoaiHD'] == 'Lương giáo viên') {
                        name += 'GV: ' + filteredData[i]['DoiTuong'];
                    }

                    html += '<td style="background-color:' + color + '">' + name + '</td>';
                    html += '<td style="background-color:' + color + '">' + filteredData[i]['LoaiHD'] + '</td>';
                    html += '<td style="background-color:' + color + '">' + convertDateFormat(filteredData[i]['ThoiGianTT']) + '</td>';
                    html += '<td style="background-color:' + color + '">' + numberWithCommas(filteredData[i]['SoTien']) + '</td>';
                    html += '</tr>';
                }
                tongSoTien +=  parseInt(filteredData[i]['SoTien']);
            }

            html_last += '<tr>';
            html_last += '<td style="width:100px;display: flex; align-items: center"><div style="background-color:#84e3b5; width:10px; height:10px"> </div>: Thu <div style="background-color:#ffd093; width:10px; height:10px;margin-left:10px"> </div>: Chi</td>';
            html_last += '<td></td>';
            html_last += '<td>Tổng: ' + numberWithCommas(tongSoTien) + '</td>';
            html_last += '<td>Thu: ' + numberWithCommas(tongThu) + '</td>';
            html_last += '<td>Chi: ' + numberWithCommas(tongChi) + '</td>';
            html_last += '<td>Thu - Chi: ' + numberWithCommas(tongThu - tongChi) + '</td>';
            html_last += '</tr>';

            document.querySelector(".tbody-1").innerHTML = html;
            document.querySelector(".tbody-5").innerHTML = html_last;
        }
    }
}

var selectKind = document.getElementById('select-kind-bill');

var btnFilter = document.getElementById('btn-filter');
var dateFrom = document.getElementById('date-from');
var dateTo = document.getElementById('date-to');

selectKind.addEventListener('change', function () {
    selectedKind = selectKind.value;
    currentPage = 1;
    filterDate();
    
});



function filterDate() {
    var fromDate = new Date(dateFrom.value);
    var toDate = new Date(dateTo.value);

    if (dateFrom.value && dateTo.value) {

        filteredData_ds = dsHoaDon.filter(function (hoaDon) {
            var hoaDonDate = new Date(hoaDon['ThoiGianTT']);
            return hoaDonDate >= fromDate && hoaDonDate <= toDate;
        });

    }
    else {
        filteredData_ds = dsHoaDon;
    }
   
    hienthids(selectedKind, filteredData_ds, currentPage);
    showindex();
}

btnFilter.addEventListener('click', function (event) {
    event.preventDefault();
    filterDate();
   

});



function showTableFinance(text, collumSort, order) {

    $.ajax({
        url: '../api/showTableHistory.php',
        type: 'POST',
        data: {
            key: text,
            collumSort: collumSort,
            order: order,
        },
        success: function (res) {
            dsHoaDon = JSON.parse(res);
            filterDate();
           
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
    showTableFinance(text, collum, orderby);
    removeSortIcons();
}


function showindex() {
    var html = "";


    var count = Math.ceil(filteredData.length / 50);


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
    showTableFinance(text, collum, orderby);
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
    if (columnIndex == 1) collum = "TenHD";
    else if (columnIndex == 2) collum = "DoiTuong";
    else if (columnIndex == 3) collum = "LoaiHD";
    else if (columnIndex == 4) collum = "ThoiGianTT";
    else if (columnIndex == 5) collum = "SoTien";



    if (sortDirection[columnIndex] === 'asc') {
        sortDirection[columnIndex] = 'desc';
        orderby = "desc";

    } else {
        sortDirection[columnIndex] = 'asc';
        orderby = "asc";
    }
    var text = document.getElementById('keyword').value;
     showTableFinance(text, collum, orderby);


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



///////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////

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

