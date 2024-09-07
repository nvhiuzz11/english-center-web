
showclassOn();

function showclassOn(){
    document.getElementById("class-on").innerHTML="";
    if (!ds_lopMo || ds_lopMo.length === 0) {
        document.getElementById("class-on").innerHTML = '<h2> Không có lớp đang dạy </h2>';
      } else {
          ds_lopMo.forEach(function(classItem) {
          if (classItem['TrangThai'] === 'Đang mở' || classItem['TrangThai'] === 'Chưa mở') {
            var tableContent = '';
            for (var i = 0; i < ds_lichhoc.length; i++) {
              if (classItem['MaLop'] === ds_lichhoc[i]['MaLop']) {
                tableContent += ds_lichhoc[i]['Ngay'] + ', ' + ds_lichhoc[i]['TGBatDau'] + ' - ' + ds_lichhoc[i]['TGKetThuc'] + '<br>';
              }
            }
      
            var classHtml = '<div class="class" onclick="showHiddenInfo(event, \'' + classItem['MaLop'] + '\')">' +
              '<table>' +
              '<tr><td><h2>Mã lớp:</h2></td><td>' + classItem['MaLop'] + '</td></tr>' +
              '<tr><td><h3>Tên lớp:</h3></td><td>' + classItem['TenLop'] + '</td></tr>' +
              '<tr><td><p>Lứa tuổi :</p></td><td>' + classItem['LuaTuoi'] + ' tuổi' + '</td></tr>' +
              '<tr><td><p>Số học sinh:</p></td><td>' + classItem['SLHS'] + '/' + classItem['SLHSToiDa'] + ' học viên' + '</td></tr>' +
              '<tr><td><p>Thời gian bắt đầu :</p></td><td>' + formatDate(classItem['ThoiGian'])  + '</td></tr>' +
              '<tr><td><p>Số buổi đã dạy:</p></td><td>' + classItem['SoBuoiDaToChuc'] + '/' + classItem['SoBuoi'] + ' buổi' + '</td></tr>' +
              '<tr><td><p>Thời gian:</p></td><td>' + tableContent + '</td></tr>' +
              '<tr><td><p>Lương:</p></td><td>' + Number(classItem['TienTraGV']).toLocaleString() + ' /buổi' + '</td></tr>' +
              '<tr><td><p>Lứa tuổi :</p></td><td>' + classItem['LuaTuoi'] + ' tuổi' + '</td></tr>' +
              '<tr><td><p>Trạng thái:</p></td><td>' + classItem['TrangThai'] + '</td></tr>' +

              '</table>' +
              '</div>';
      
              document.getElementById("class-on").innerHTML += classHtml;
          }
        });
      }
}

showClassOff();
function showClassOff(){
 
    document.getElementById("class-off").innerHTML="";
    if (!ds_lopDong || ds_lopDong.length == 0) {
        document.getElementById("class-off").innerHTML = '<h2> Không có lớp hoàn thành </h2>';
      } else {
        ds_lopDong.forEach(function(classItem) {
          
          if (classItem['TrangThai'] == 'Đã đóng') {
            var tableContent = '';
            for (var i = 0; i < ds_lichhoc.length; i++) {
              if (classItem['MaLop'] === ds_lichhoc[i]['MaLop']) {
                tableContent += ds_lichhoc[i]['Ngay'] + ', ' + ds_lichhoc[i]['TGBatDau'] + ' - ' + ds_lichhoc[i]['TGKetThuc'] + '<br>';
              }
            }
           
            var classHtml = '<div class="class" onclick="showHiddenInfo(event, \'' + classItem['MaLop'] + '\')">' +
              '<table>' +
              '<tr><td><h2>Mã lớp:</h2></td><td>' + classItem['MaLop'] + '</td></tr>' +
              '<tr><td><h3>Tên lớp:</h3></td><td>' + classItem['TenLop'] + '</td></tr>' +
              '<tr><td><p>Lứa tuổi :</p></td><td>' + classItem['LuaTuoi'] + ' tuổi' + '</td></tr>' +
              '<tr><td><p>Số học sinh:</p></td><td>' + classItem['SLHS'] + '/' + classItem['SLHSToiDa'] + ' học viên' + '</td></tr>' +
              '<tr><td><p>Thời gian bắt đầu :</p></td><td>' + formatDate(classItem['ThoiGian'])  + '</td></tr>' +
              '<tr><td><p>Số buổi đã dạy:</p></td><td>' + classItem['SoBuoiDaToChuc'] + '/' + classItem['SoBuoi'] + ' buổi' + '</td></tr>' +
              '<tr><td><p>Thời gian:</p></td><td>' + tableContent + '</td></tr>' +
              '<tr><td><p>Lương:</p></td><td>' + Number(classItem['TienTraGV']).toLocaleString() + ' /buổi' + '</td></tr>' +
              '<tr><td><p>Trạng thái:</p></td><td>' + classItem['TrangThai'] + '</td></tr>' +

              '</table>' +
              '</div>';
      
              document.getElementById("class-off").innerHTML += classHtml;
          }
        });
      }

}



var class_select = '';
var date_select = '';


var diemDanhGrouped = {};

for (var i = 0; i < ds_diemdanh.length; i++) {
    var diemDanh = ds_diemdanh[i];
    var maLop = diemDanh.MaLop;
    var thoiGian = diemDanh.ThoiGian;
    var key = maLop + '-' + thoiGian;

    

    if (!diemDanhGrouped.hasOwnProperty(key)) {
        diemDanhGrouped[key] = [];
    }

    diemDanhGrouped[key].push(diemDanh);
}

var dateListDiv = document.getElementById('date-list');
function showHiddenInfo(event, maLopp) {
    
    document.getElementById('modal-bg').style.display = 'block';

    document.getElementById('modal-content').scrollTop=0;
    dateListDiv.innerHTML = '';
    var check_empty = true;
    for (var key in diemDanhGrouped) {
        if (diemDanhGrouped.hasOwnProperty(key)) {
            var diemDanhArray = diemDanhGrouped[key];
            var maLop = diemDanhArray[0].MaLop;

            if (maLop == maLopp) {
                createAttendanceDateDiv(diemDanhArray);
                check_empty = false;
            }
           

        }
    }
    if(check_empty){
        dateListDiv.innerHTML = '<p style="margin-left:100px; font-size:18px; font-style:italic">Chưa có dữ liệu điểm danh!</p>';      
    }
    class_select = maLopp;
}

function createAttendanceDateDiv(diemDanhArray) {
    var thoiGian = diemDanhArray[0].ThoiGian;

    var dateDiv = document.createElement('div');
    dateDiv.className = 'date';
    dateDiv.addEventListener('click', function () {
        showAttendanceInterface(thoiGian, diemDanhArray);
    });

    var timeP = document.createElement('p');
    timeP.style.marginLeft = '50px';
    timeP.id = 'time';
    timeP.textContent = 'Ngày: ' + formatDate(thoiGian);

    var numberP = document.createElement('p');
    numberP.id = 'number';
    var diHocCount = 0;
    var nghiHocCount = 0;

    for (var i = 0; i < diemDanhArray.length; i++) {
        var dd = parseInt(diemDanhArray[i].dd);
        if (dd === 1) {
            diHocCount++;
        } else if (dd === 0) {
            nghiHocCount++;
        }

       
    }

    numberP.textContent = 'Sĩ số: ' + diHocCount + '/' + (diHocCount + nghiHocCount);

    var absentP = document.createElement('p');
    absentP.style.marginRight = '30px';
    absentP.id = 'absent';
    absentP.textContent = 'Vắng: ' + nghiHocCount;

    dateDiv.appendChild(timeP);
    dateDiv.appendChild(numberP);
    dateDiv.appendChild(absentP);

    dateListDiv.appendChild(dateDiv);
}


function showAttendanceInterface(thoiGian, diemDanhArray) {


    date_select = thoiGian;
    document.getElementById('modal-bg-update').style.display = 'block';
    document.getElementById('modal-content-update').scrollTop=0;
    // Hiển thị thông tin thời gian
    // var timeHeader = document.getElementById('time-header');
    // timeHeader.textContent = 'Thời gian: ' + formatDate(thoiGian);
    document.getElementById("time-update").value = thoiGian;

    // Lấy tbody của bảng điểm danh
    var tbody = document.getElementById('tbody-listStudent');
    tbody.innerHTML = '';

    // Hiển thị danh sách học sinh
    for (var i = 0; i < diemDanhArray.length; i++) {
        var diemDanh = diemDanhArray[i];
        var stt = i + 1;
        var maHS = diemDanh.MaHS;
        var tenHS = diemDanh.TenHS;
        var dd = parseInt(diemDanh.dd);


        var row = document.createElement('tr');

        var sttCell = document.createElement('td');
        sttCell.textContent = stt;
        row.appendChild(sttCell);

        var maHSCell = document.createElement('td');
        maHSCell.textContent = maHS;
        row.appendChild(maHSCell);

        var tenHSCell = document.createElement('td');
        tenHSCell.textContent = tenHS;
        row.appendChild(tenHSCell);

        var ddCell = document.createElement('td');
        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = dd === 1;
        ddCell.appendChild(checkbox);
        row.appendChild(ddCell);

        tbody.appendChild(row);


    }
    document.getElementById('time-update').value = thoiGian;
    document.getElementById('class-update').value = diemDanhArray[0].MaLop;


}



document.getElementById('close').addEventListener('click', function () {
    document.getElementById('modal-bg').style.display = 'none';
    document.getElementById('date-list').innerHTML = '';
});

document.getElementById('close-update').addEventListener('click', function () {
    document.getElementById('modal-bg-update').style.display = 'none';
});




document.getElementById('btn-update').addEventListener('click', function (event) {


    //   var check = true;

    event.preventDefault();


    for(var i= 0;i<ds_lopDong.length ;i++){
        if(class_select == ds_lopDong[i].MaLop){
            document.querySelector('.add-cant').style.display = 'block';
            document.querySelector('#modal-noti-add').style.display = 'block';
            return;
        }
    }

    var checkboxes = document.querySelectorAll('#attendance tbody input[type="checkbox"]');

    // Tạo một mảng để lưu trữ dữ liệu điểm danh
    var danhSachDiemDanh = [];

    // Lặp qua từng checkbox và lấy dữ liệu tương ứng
    checkboxes.forEach(function (checkbox) {
        var stt = checkbox.parentElement.parentElement.cells[0].textContent;
        var maHS = checkbox.parentElement.parentElement.cells[1].textContent;
        var tenHS = checkbox.parentElement.parentElement.cells[2].textContent;
        var diemDanh = checkbox.checked ? 1 : 0;

        // Tạo một đối tượng để lưu trữ dữ liệu điểm danh
        var diemDanhObj = {
            maHS: maHS,
            tenHS: tenHS,
            diemDanh: diemDanh
        };

    
        danhSachDiemDanh.push(diemDanhObj);
    });
    var time = document.getElementById('time-update').value;

    $.ajax({
        url: '../../api/updateAttend.php',
        type: 'POST',
        data: {
            malop :  class_select,
            date_new: time,
            date_old: date_select,
            danhSachDiemDanh: danhSachDiemDanh,
            magv : detailTeacher[0].MaGV,
        },
        success: function (res) {
            ds_lopMo = JSON.parse(res).dslop;
            ds_diemdanh = JSON.parse(res).dsdd;

         diemDanhGrouped = {};

        for (var i = 0; i < ds_diemdanh.length; i++) {
            var diemDanh = ds_diemdanh[i];
            var maLop = diemDanh.MaLop;
            var thoiGian = diemDanh.ThoiGian;
            var key = maLop + '-' + thoiGian;

            if (!diemDanhGrouped.hasOwnProperty(key)) {
                diemDanhGrouped[key] = [];
            }

                diemDanhGrouped[key].push(diemDanh);
        }

        showclassOn();
        showHiddenInfo("", class_select);

        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });

    
    document.getElementById('modal-bg-update').style.display = 'none';
    document.getElementById('tb1').innerHTML = "Đã cập nhật điểm danh thành công!";

    document.querySelector('.add-success').style.display = 'block';

    setTimeout(function () {
        document.querySelector('.add-success').style.display = 'none';
        
    }, 1500);
});


function formatDate(dateString) {
    var dateParts = dateString.split('-');
    var year = dateParts[0];
    var month = dateParts[1];
    var day = dateParts[2];

    var formattedDate = day + '-' + month + '-' + year;
    return formattedDate;
}


document.getElementById('close-add').addEventListener('click', function () {
   
    document.getElementById('modal-bg-add').style.display = 'none';
    document.getElementById('error-time').innerHTML =  "";

});

document.getElementById('close-err').addEventListener('click', function () {
    document.querySelector('#modal-noti-add').style.display = 'none';
    document.querySelector('.add-cant').style.display = 'none';
    
});

document.getElementById('btn-add').addEventListener('click', function () {

    

    for(var i= 0;i<ds_lopDong.length ;i++){
        if(class_select == ds_lopDong[i].MaLop){
            document.getElementById('tb2').innerHTML = "Lớp đã đóng ~<br> Không thể cập nhật!"
            document.querySelector('.add-cant').style.display = 'block';
            document.querySelector('#modal-noti-add').style.display = 'block';
            return;
        }
    }
    for(var i= 0;i<ds_lopMo.length ;i++){
        if(class_select == ds_lopMo[i].MaLop && ds_lopMo[i].TrangThai == "Chưa mở" ){
            document.getElementById('tb2').innerHTML = "Lớp chưa mở ~<br> Không thể cập nhật!"
            document.querySelector('.add-cant').style.display = 'block';
            document.querySelector('#modal-noti-add').style.display = 'block';
            return;
        }
    }

    var html = '';
    var k=1;
    for (var i = 0; i < ds_hocsinh.length; i++) {
        if(ds_hocsinh[i].MaLop == class_select){
            html += '<tr>'
            html += '<td>' + (k++) + '</td>';
            html += '<td>' + ds_hocsinh[i].MaHS + '</td>';
            html += '<td>' + ds_hocsinh[i].TenHS + '</td>';
            html += '<td>  <input type="checkbox">  </td>';
            html += '</tr>';
        }

       
    }
    document.getElementById('tbody-listStudent-add').innerHTML = html

    document.getElementById('modal-bg-add').style.display = 'block';
});

document.getElementById('btn-add-submit').addEventListener('click', function (event) {


    event.preventDefault();

   
    var time =  document.getElementById('time-add').value ;



    if(!time){
        document.getElementById('error-time').innerHTML =  "Chưa nhập ngày tháng";
        return;
    }
    else
    document.getElementById('error-time').innerHTML =  "";

    var check = false;
    ds_diemdanh.forEach(data => {

        if (data['ThoiGian'] == time) {
            document.getElementById("error-time").textContent = "*Thời gian đã có dữ liệu điểm danh!";
            check = true;
        }
    });
    if (check) {
        return;
    }

    var checkboxes = document.querySelectorAll('#attendance-add tbody input[type="checkbox"]');

    
    var danhSachDiemDanh = [];

    // Lặp qua từng checkbox và lấy dữ liệu tương ứng
    checkboxes.forEach(function (checkbox) {
        var stt = checkbox.parentElement.parentElement.cells[0].textContent;
        var maHS = checkbox.parentElement.parentElement.cells[1].textContent;
        var tenHS = checkbox.parentElement.parentElement.cells[2].textContent;
        var diemDanh = checkbox.checked ? 1 : 0;

        // Tạo một đối tượng để lưu trữ dữ liệu điểm danh
        var diemDanhObj = {
            maHS: maHS,
            tenHS: tenHS,
            diemDanh: diemDanh
        };

        // Thêm đối tượng vào mảng danhSachDiemDanh
        danhSachDiemDanh.push(diemDanhObj);
    });



    $.ajax({
        url: '../../api/addAttend.php',
        type: 'POST',
        data: {
            malop :  class_select,
            time : time,
            danhSachDiemDanh: danhSachDiemDanh,
            magv : detailTeacher[0].MaGV,
        },
        success: function (res) {
            ds_lopMo = JSON.parse(res).dslop;
            ds_diemdanh = JSON.parse(res).dsdd;

         diemDanhGrouped = {};

        for (var i = 0; i < ds_diemdanh.length; i++) {
            var diemDanh = ds_diemdanh[i];
            var maLop = diemDanh.MaLop;
            var thoiGian = diemDanh.ThoiGian;
            var key = maLop + '-' + thoiGian;

            if (!diemDanhGrouped.hasOwnProperty(key)) {
                diemDanhGrouped[key] = [];
            }

                diemDanhGrouped[key].push(diemDanh);
        }

        showclassOn();
        showHiddenInfo("", class_select);

        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });

    document.getElementById('modal-bg-add').style.display = 'none';
    document.getElementById('tb1').innerHTML = "Đã thêm  điểm danh thành công!";

    document.querySelector('.add-success').style.display = 'block';

    setTimeout(function () {
        document.querySelector('.add-success').style.display = 'none';
       
    }, 1500);
});


document.getElementById('btn-delete').addEventListener('click', () => {
    for(var i= 0;i<ds_lopDong.length ;i++){
        if(class_select == ds_lopDong[i].MaLop){
            document.getElementById('tb2').innerHTML = "Lớp đã đóng ~<br> Không thể cập nhật!"
            document.querySelector('.add-cant').style.display = 'block';
            document.querySelector('#modal-noti-add').style.display = 'block';
            return;
        }
    }
    for(var i= 0;i<ds_lopMo.length ;i++){
        if(class_select == ds_lopMo[i].MaLop && ds_lopMo[i].TrangThai == "Chưa mở" ){
            document.getElementById('tb2').innerHTML = "Lớp chưa mở ~<br> Không thể cập nhật!"
            document.querySelector('.add-cant').style.display = 'block';
            document.querySelector('#modal-noti-add').style.display = 'block';
            return;
        }
    }
    
    document.querySelector('.delete-ques').style.display = 'block';
    document.querySelector('#modal-noti-delete').style.display = 'block';
});
document.getElementById('delete-cancle').addEventListener('click', () => {
    document.querySelector('#modal-noti-delete').style.display = 'none';
    document.querySelector('.delete-ques').style.display = 'none';
});
document.getElementById('delete').addEventListener('click', function(event) {


    event.preventDefault();

  

  



    
    $.ajax({
        url: '../../api/deleteAttend.php',
        type: 'POST',
        data: {
            malop :  class_select,
            time : date_select,
            magv : detailTeacher[0].MaGV,
        },
        success: function (res) {
            ds_lopMo = JSON.parse(res).dslop;
            ds_diemdanh = JSON.parse(res).dsdd;

         diemDanhGrouped = {};

        for (var i = 0; i < ds_diemdanh.length; i++) {
            var diemDanh = ds_diemdanh[i];
            var maLop = diemDanh.MaLop;
            var thoiGian = diemDanh.ThoiGian;
            var key = maLop + '-' + thoiGian;

            if (!diemDanhGrouped.hasOwnProperty(key)) {
                diemDanhGrouped[key] = [];
            }

                diemDanhGrouped[key].push(diemDanh);
        }

        showclassOn();
        showHiddenInfo("", class_select);

        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });
    
    document.querySelector('#modal-noti-delete').style.display = 'none';
    document.querySelector('.delete-ques').style.display = 'none';
   
    document.getElementById('modal-bg-update').style.display = 'none';
    document.getElementById('tb1').innerHTML = "Đã xóa điểm danh thành công!";

    document.querySelector('.add-success').style.display = 'block';

    setTimeout(function () {
        document.querySelector('.add-success').style.display = 'none';
        
    }, 1500);

});



////
// document.getElementById("link-wageTeacher").addEventListener("click", function(event) {
//     event.preventDefault(); 
  
   
//     var data = {
//       key1: MaGV,
     
//     };
  
//     // Tạo một form ẩn
//     var form = document.createElement("form");
//     form.method = "POST";
//     form.action = "./userTeacher_wage.php";
  
//     // Thêm các input chứa dữ liệu vào form
//     for (var key in data) {
//       if (data.hasOwnProperty(key)) {
//         var input = document.createElement("input");
//         input.type = "hidden";
//         input.name = key;
//         input.value = data[key];
//         form.appendChild(input);
//       }
//     }
  
//     // Gắn form vào body và tự động submit
//     document.body.appendChild(form);
//     form.submit();
//   });
  