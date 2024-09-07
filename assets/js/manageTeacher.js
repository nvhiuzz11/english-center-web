var countData = ds_giaovien.length;
var currentPage = 1;
var collum = "";
var orderby =""; 
showTableTeacher("", 1,collum,orderby);
showindex();


function convertDateFormat(dateString) {
    var dateParts = dateString.split("-");
    var formattedDate = dateParts[2] + "-" + dateParts[1] + "-" + dateParts[0];
    return formattedDate;
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function showTableTeacher(text, page, collumSort ,order) {

    $.ajax({
        url: '../api/showTableTeacher.php',
        type: 'POST',
        data: {
            key: text,
            page: page,
            collumSort: collumSort,
            order : order,
        },
        success: function (res) {
            document.querySelector('.tbody-1').innerHTML = res;

            countData = document.getElementById('count-data').textContent;
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
    showTableTeacher(text, 1,collum,orderby);
    removeSortIcons();
}


function showindex() {
    var html = "";


    var count = Math.ceil(countData / 50);
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
    showTableTeacher(text, pageNumber,collum,orderby);
    var table = document.querySelector(".tbody-1");
    table.scrollTo({ top: table.offsetTop, behavior: 'smooth' });
}



const rows = document.querySelectorAll('.tbody-1 tr');
const modalBg = document.querySelector('.modal-bg');
const modalContent = document.querySelector('.modal-content');




var stt_select;

var teacher_select;


document.querySelector('.tbody-1').addEventListener('click', function (event) {

    if (event.target.tagName === 'TD') {
        stt_select = event.target.parentNode.cells[1].textContent;




        for (var i = 0; i < ds_giaovien.length; i++) {
            if (stt_select == ds_giaovien[i].MaGV)
                teacher_select = ds_giaovien[i];
        }



        document.getElementById('teacher-name').textContent = teacher_select.TenGV;
        document.getElementById('teacher-gender').textContent = teacher_select.GioiTinh;
        document.getElementById('teacher-age').textContent = teacher_select.Tuoi;
        document.getElementById('teacher-id').textContent = teacher_select.MaGV;
        document.getElementById('teacher-qq').textContent = teacher_select.QueQuan;
        document.getElementById('teacher-address').textContent = teacher_select.DiaChi;
        document.getElementById('teacher-date').textContent = convertDateFormat(teacher_select.NgaySinh);
        document.getElementById('teacher-phone').textContent = teacher_select.SDT;
        document.getElementById('teacher-email').textContent = teacher_select.Email;
        document.getElementById('teacher-qualification').textContent = teacher_select.TrinhDo;




        var img = document.getElementById("img");

        if (teacher_select.GioiTinh == "Nam") {
            img.src = "../assets/images/Teacher-male-icon.png";
        } else {
            img.src = "../assets/images/Teacher-female-icon.png";
        }

        document.getElementById("tab1").classList.add("show");
        document.getElementById("tab2").classList.remove("show");
        document.getElementById("tab3").classList.remove("show");
        document.getElementById("tb1").classList.add("active");
        document.getElementById("tb2").classList.remove("active");
        document.getElementById("tb3").classList.remove("active");

        // Thong tin lop cua giao vien
        var classes = [];
        var k = 0;
        for (var i = 0; i < ds_gv_lop.length; i++) {
            if (ds_gv_lop[i].MaGV === teacher_select.MaGV) {

                classes[k++] = ds_gv_lop[i];
            }
        }

        var color = '';
        var html = '';

        if (classes.length === '0') {
            html += '<p>Học viên chưa tham gia lớp học nào </p>';
        } else {
            html += '<p> Số lớp dạy:  ' + classes.length + '</p>';

            for (var i = 0; i < classes.length; i++) {
                if (classes[i]['TrangThai'] == 'Đang mở') {
                    color = '#00c608';
                } else if (classes[i]['TrangThai'] == 'Chưa mở') {
                    color = '#ad9d0b';
                } else {
                    color = '#ad0b0b';
                }
                html += '<div class="class">' +
                    '<p></p>' +
                    '<table>' +
                    '<tr>' +

                    '<td>' +
                    '<p id="id-class">Mã lớp học:  ' + classes[i]['MaLop'] + '</p>' +
                    '</td>' +

                    '<td>' +
                    '<p id="num-of-session">Số buổi học:  ' + classes[i]['SoBuoiDaToChuc'] + '/' + classes[i]['SoBuoi'] +
                    '</tr>' +
                    '<tr>' +

                    '<td>' +
                    '<p id="name-class">Tên lớp học:  ' + classes[i]['TenLop'] + '</p>' +
                    '</td>' +

                    '<td>' +
                    '<p id="name =name-teacher">Lứa tuổi:  ' + classes[i]['LuaTuoi'] + '</p>' +
                    '</td>' +
                    '</tr>' +
                    '<tr>' +

                    '<td>' +
                    '<p id="fee-class">Số học sinh:  ' + classes[i]['SLHS'] + '/' + classes[i]['SLHSToiDa'] + '</p>' +
                    '</td>' +

                    '<td>' +
                    '<p id="de-fee-class">Lương:  ' + numberWithCommas(classes[i]['TienTraGV']) + ' / buổi' + '</p>' +
                    '</td>' +
                    '</tr>' +
                    '<tr>' +

                    '<td>' +
                    '<p id="status-class" style ="color:' + color + '" >Trạng thái:  ' + classes[i]['TrangThai'] + '</p>' +
                    '</td>' +
                    '</tr>' +
                    '</table>' +
                    '</div>';
            }

            document.querySelector("#classes-of-teacher").innerHTML = html;

        }



        //thong tin tai khoan
      
        for (var i = 0; i < ds_tk_gv.length; i++) {
            if (ds_tk_gv[i].MaGV === teacher_select.MaGV) {
                document.getElementById('name-login').textContent = ds_tk_gv[i]['UserName'];
                document.getElementById('username-login').value = ds_tk_gv[i]['UserName'];
                document.getElementById('password').value = ds_tk_gv[i]['Password'];
                document.getElementById('date_logup').textContent = "Ngày đăng ký  :  " + convertDateFormat(ds_tk_gv[i]['NgayDK']);
            
            }
        }

     


        modalBg.style.display = 'block';
    }
});



document.querySelector('.close-btn').addEventListener('click', () => {
    document.getElementById('div-change-pass').style.display = 'none';
    document.getElementById('err-pass').textContent = '';
    document.getElementById('new-password').value = '';
    modalBg.style.display = 'none';
});



const editButton = document.getElementById('edit-button');
const tdList = document.querySelectorAll('td[contenteditable]');

const modalBgEdit = document.querySelector('.modal-bg-edit');
const modalContentEdit = document.querySelector('.modal-content-edit');

// Khi người dùng nhấn vào nút "Sửa"
editButton.addEventListener('click', () => {
    document.getElementById('lb_phone_edit').textContent = "";
    document.getElementById('lb_email_edit').textContent = "";
    document.getElementById('lb_name_edit').textContent = "";
    document.getElementById('lb_hometown_edit').textContent = "";
    document.getElementById('lb_address_edit').textContent = "";
    document.getElementById('lb_education_edit').textContent = "";

    document.getElementById('lb_birthday_edit').textContent = "";

    modalBgEdit.style.display = "block";


    document.getElementById('teacher_name_edit').value = teacher_select.TenGV;

    var gt = teacher_select.GioiTinh;
    var selectTag = document.getElementById("gender_edit");
    for (var i = 0; i < selectTag.options.length; i++) {
        if (selectTag.options[i].value == gt) {
            selectTag.options[i].selected = true; // nếu giống nhau, đặt thuộc tính selected cho option
            break;
        }
    }

    document.getElementById('birthday_edit').value = teacher_select.NgaySinh;
    document.getElementById('age_edit').value = teacher_select.Tuoi;
    document.getElementById('teacher-id_edit').textContent = "Mã Giáo viên : " + teacher_select.MaGV;
    document.getElementById('hometown_edit').value = teacher_select.QueQuan;
    document.getElementById('address_edit').value = teacher_select.DiaChi;
    document.getElementById('phone_number_edit').value = teacher_select.SDT;
    document.getElementById('email_edit').value = teacher_select.Email;
    document.getElementById('education_edit').value = teacher_select.TrinhDo;
    document.getElementById('id_edit').value = teacher_select.MaGV;
});

document.querySelector('.cancle-btn').addEventListener('click', () => {
    modalBgEdit.style.display = 'none';
});



// Khi nhấn nút Cập nhật
const submit_update = document.getElementById('update');
submit_update.addEventListener('click', function (event) {
    var check = true;
    
    event.preventDefault();
    const id = document.getElementById('id_edit').value;
    const phone_number = document.getElementById('phone_number_edit').value;
    const email = document.getElementById('email_edit').value;
    const gender = document.getElementById('gender_edit').value;

    const teacher_name = document.getElementById('teacher_name_edit').value;
    const age = document.getElementById('age_edit').value;
    const hometown = document.getElementById('hometown_edit').value;
    const address = document.getElementById('address_edit').value;
    const education = document.getElementById('education_edit').value;
    const birthday = document.getElementById('birthday_edit').value;

    var erorr_empty = "*Dữ liệu không để trống";

    //Kiểm tra dữ liệu nhập vào
    if (!teacher_name) {
        document.getElementById('lb_name_edit').textContent = erorr_empty;
        check = false;
    } else
        document.getElementById('lb_name_edit').textContent = "";

    if (!birthday) {
        document.getElementById('lb_birthday_edit').textContent = erorr_empty;
        check = false;
    } else
        document.getElementById('lb_birthday_edit').textContent = "";

   
    if (!hometown) {

        document.getElementById('lb_hometown_edit').textContent = erorr_empty;
        check = false;
    } else
        document.getElementById('lb_hometown_edit').textContent = "";

    if (!address) {

        document.getElementById('lb_address_edit').textContent = erorr_empty;
        check = false;
    } else
        document.getElementById('lb_address_edit').textContent = "";
    if (!education) {

        document.getElementById('lb_education_edit').textContent = erorr_empty;
        check = false;
    } else
        document.getElementById('lb_education_edit').textContent = "";
    if (!(/^(0[0-9]{9})$/.test(phone_number))) {
        document.getElementById('lb_phone_edit').textContent = "*Số điện thoại không chính xác (0..; 10 chữ số)";
        check = false;
    } else
        document.getElementById('lb_phone_edit').textContent = "";

    if (!(/\S+@\S+\.\S+/.test(email))) {
        document.getElementById('lb_email_edit').textContent = "*Email không chính xác (example@xxx.com)";
        check = false;
    } else
        document.getElementById('lb_email_edit').textContent = "";

    if (!check)
        return;
    document.querySelector('.update-success').style.display = 'block';





   $.ajax({
        type: 'POST',
        url: '../api/updateInforTeacher.php',
        data: {
            id: id,
            name: teacher_name,
            gender: gender,
            date: birthday,
            age: age,
            address: address,
            phone: phone_number,
            email: email,
            hometown: hometown,
            education: education,
        },
        success: function (res) {

            ds_giaovien = JSON.parse(res);
            for (var i = 0; i < ds_giaovien.length; i++) {
                if (ds_giaovien[i].MaGV === teacher_select.MaGV) {
                    teacher_select = ds_giaovien[i];
                    break;
                }
            }


            document.getElementById('teacher-name').textContent = teacher_select.TenGV;
            document.getElementById('teacher-gender').textContent = teacher_select.GioiTinh;
            document.getElementById('teacher-age').textContent = teacher_select.Tuoi;
            document.getElementById('teacher-id').textContent = teacher_select.MaGV;
            document.getElementById('teacher-qq').textContent = teacher_select.QueQuan;
            document.getElementById('teacher-address').textContent = teacher_select.DiaChi;
            document.getElementById('teacher-date').textContent = convertDateFormat(teacher_select.NgaySinh);
            document.getElementById('teacher-phone').textContent = teacher_select.SDT;
            document.getElementById('teacher-email').textContent = teacher_select.Email;
            document.getElementById('teacher-qualification').textContent = teacher_select.TrinhDo;
    
    
            var img = document.getElementById("img");
    
            if (teacher_select.GioiTinh == "Nam") {
                img.src = "../assets/images/Teacher-male-icon.png";
            } else {
                img.src = "../assets/images/Teacher-female-icon.png";
            }

           
            var text = document.getElementById('keyword').value;
            showTableTeacher(text, currentPage,collum,orderby);


        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });

    modalBgEdit.style.display = 'none';
    document.querySelector('.update-success').style.display = 'block';
    setTimeout(function () {
        document.querySelector('.update-success').style.display = 'none';

    }, 1000);

    

});


//Thêm giáo viên
function setAge() {
    var inputDate = document.getElementById("birthday_add").value;
    var namHienTai = new Date().getFullYear();
    var namInput = new Date(inputDate).getFullYear();

    var age = namHienTai - namInput;
    document.getElementById('age_add').value = age;

}



function setAge2() {
    var inputDate = document.getElementById("birthday_edit").value;
    var namHienTai = new Date().getFullYear();
    var namInput = new Date(inputDate).getFullYear();

    var age = namHienTai - namInput;
    document.getElementById('age_edit').value = age;

}

const modalBgAdd = document.querySelector('.modal-bg-add');
const modalContentAdd = document.querySelector('.modal-content-add');

// Khi nhấn "thêm giáo viên"
document.querySelector('.add-teacher-button').addEventListener('click', () => {
    modalBgAdd.style.display = 'block';
})
// Huy bo 
document.querySelector('.cancle-btn-add').addEventListener('click', () => {
    modalBgAdd.style.display = 'none';

    document.getElementById('phone_number_add').value = '';
    document.getElementById('email_add').value = '';
    document.getElementById('teacher_name_add').value = '';
    document.getElementById('age_add').value = '';
    document.getElementById('hometown_add').value = '';
    document.getElementById('address_add').value = '';
    document.getElementById('education_add').value = '';
    document.getElementById('birthday_add').value = '';
    document.getElementById('lb_name_add').textContent = "";

    document.getElementById('lb_birthday_add').textContent = "";
    document.getElementById('lb_hometown_add').textContent = "";
    document.getElementById('lb_address_add').textContent = "";
    document.getElementById('lb_education_add').textContent = "";
    document.getElementById('lb_phone_add').textContent = "";
    document.getElementById('lb_email_add').textContent = "";

});

// Khi nhấn Thêm
const submit_add = document.getElementById('add');
submit_add.addEventListener('click', function (event) {
    var check = true;
    event.preventDefault();
    const phone_number = document.getElementById('phone_number_add').value;
    const email = document.getElementById('email_add').value;
    const teacher_name = document.getElementById('teacher_name_add').value;
    const age = document.getElementById('age_add').value;
    const hometown = document.getElementById('hometown_add').value;
    const address = document.getElementById('address_add').value;
    const education = document.getElementById('education_add').value;
    const birthday = document.getElementById('birthday_add').value;
    const gender = document.getElementById('gender_add').value;
    var erorr_empty = "*Dữ liệu không để trống";

    //Kiểm tra dữ liệu nhập vào

    if (!teacher_name) {
        document.getElementById('lb_name_add').textContent = erorr_empty;
        check = false;
    } else
        document.getElementById('lb_name_add').textContent = "";

    if (!birthday) {
        document.getElementById('lb_birthday_add').textContent = erorr_empty;
        check = false;
    } else
        document.getElementById('lb_birthday_add').textContent = "";

 
    if (!hometown) {

        document.getElementById('lb_hometown_add').textContent = erorr_empty;
        check = false;
    } else
        document.getElementById('lb_hometown_add').textContent = "";

    if (!address) {

        document.getElementById('lb_address_add').textContent = erorr_empty;
        check = false;
    } else
        document.getElementById('lb_address_add').textContent = "";
    if (!education) {

        document.getElementById('lb_education_add').textContent = erorr_empty;
        check = false;
    } else
        document.getElementById('lb_education_add').textContent = "";
    if (!(/^(0[0-9]{9})$/.test(phone_number))) {
        document.getElementById('lb_phone_add').textContent = "*Số điện thoại không chính xác (0[0-9]; 10 chữ số)";
        check = false;
    } else
        document.getElementById('lb_phone_add').textContent = "";

    if (!(/\S+@\S+\.\S+/.test(email))) {
        document.getElementById('lb_email_add').textContent = "*Email không chính xác (example@xxx.com)";
        check = false;
    } else
        document.getElementById('lb_email_add').textContent = "";

    if (!check)
        return;

    $.ajax({
        url: '../api/addTeacher.php',
        type: 'POST',
        data: {
            name: teacher_name,
            gender: gender,
            date: birthday,
            age: age,
            address: address,
            phone: phone_number,
            email: email,
            hometown: hometown,
            education: education,
        },
        success: function (res) {
            ds_giaovien = JSON.parse(res)
            var text = document.getElementById('keyword').value;
            showTableTeacher(text, currentPage,collum,orderby);

        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });


    document.getElementById('phone_number_add').value = '';
    document.getElementById('email_add').value = '';
    document.getElementById('teacher_name_add').value = '';
    document.getElementById('age_add').value = '';
    document.getElementById('hometown_add').value = '';
    document.getElementById('address_add').value = '';
    document.getElementById('education_add').value = '';
    document.getElementById('birthday_add').value = '';


    document.querySelector('.add-success').style.display = 'block';

    setTimeout(function () {
        document.querySelector('.add-success').style.display = 'none';

    }, 1000);

});

// Khi nhan nut Xoa
function deleteTeacher() {
    $.ajax({
        url: '../api/deleteTeacher.php',
        type: 'POST',
        data: {
            id: teacher_select.MaGV,
        },
        success: function (res) {
            ds_giaovien = JSON.parse(res);
            var text = document.getElementById('keyword').value;
            showTableTeacher(text, currentPage,collum,orderby);
        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });
            

    //
    document.querySelector('.delete-ques2').style.display = 'none';
    document.querySelector('.delete-ques').style.display = 'none';
    document.getElementById('modal-ques').style.display = "none";


    document.getElementById('div-change-pass').style.display = 'none';
    modalBg.style.display = 'none';
    const paragraphs = document.getElementsByTagName("p");
    while (paragraphs.length > 0) {
        paragraphs[0].parentNode.removeChild(paragraphs[0]);
    }



    //
    document.querySelector('.delete-success').style.display = 'block';
    setTimeout(function () {
        document.querySelector('.delete-success').style.display = 'none';

    }, 1000);
}

document.getElementById('delete-button').addEventListener('click', () => {
    document.getElementById('modal-ques').style.display = "block";
    document.querySelector('.delete-ques').style.display = 'block';

});



document.getElementById('delete-cancle').addEventListener('click', () => {
    document.querySelector('.delete-ques').style.display = 'none';
    document.getElementById('modal-ques').style.display = "none";

});
document.getElementById('delete').addEventListener('click', function (event) {

    $.ajax({
        url: '../api/checkAccTeacher.php',
        type: 'POST',
        data: {
            id: teacher_select.MaGV,
        },
        success: function (res) {

            if (res) {
                document.querySelector('.delete-ques').style.display = 'none';
                document.querySelector('.delete-ques2').style.display = 'block';
            }
            else {
                deleteTeacher();
            }

        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });



});


document.getElementById('delete-cancle2').addEventListener('click', () => {
    document.querySelector('.delete-ques2').style.display = 'none';
    document.getElementById('modal-ques').style.display = "none";

});

/// xac nhan xoa
document.getElementById('delete2').addEventListener('click', function (event) {

    event.preventDefault();
    deleteTeacher();



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


//  Tài khoản

function togglePassword() {
    var passwordInput = document.getElementById("password");
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
    } else {
        passwordInput.type = "password";
    }
}
// Đổi mật khẩu

document.getElementById('change-pass-btn').addEventListener('click', () => {
    document.getElementById('div-change-pass').style.display = 'block';

});

document.getElementById('change').addEventListener('click', function (event) {


    event.preventDefault();

    var pass = document.getElementById("new-password").value;

    var username = document.getElementById('username-login').value;

    var err_pass = '';
    var err_username = '';
    var check = true;

    if (!pass) {
        err_pass = '*Bạn chưa nhập mật khẩu';
        check = false;
    }
    if (!username) {
        err_username = '*Bạn chưa nhập tên tài khoản';
        check = false;
    }

    document.getElementById('err-pass').textContent = err_pass;
    document.getElementById('err-username').textContent = err_username;


    if (!check) {
        return;
    }



    $.ajax({
        url: '../api/changeAccTeacher.php',
        type: 'POST',
        data: {
            id: teacher_select.MaGV,
            username: username,
            pass: pass,
        },
        success: function (res) {
            ds_tk_gv = JSON.parse(res);
          

            for (var i = 0; i < ds_tk_gv.length; i++) {
                if (ds_tk_gv[i].MaGV === teacher_select.MaGV) {
                    document.getElementById('name-login').textContent = ds_tk_gv[i]['UserName'];
                    document.getElementById('username-login').value = ds_tk_gv[i]['UserName'];
                    document.getElementById('password').value = ds_tk_gv[i]['Password'];
                    document.getElementById('date_logup').textContent = "Ngày đăng ký  :  " + convertDateFormat(ds_tk_gv[i]['NgayDK']);
                    break;
                }
            }

        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });
    document.getElementById('div-change-pass').style.display = 'none';
    document.querySelector('.change-pass-success').style.display = 'block';



    setTimeout(function () {
        document.querySelector('.change-pass-success').style.display = 'none';
        document.getElementById('err-pass').textContent = '';
        document.getElementById('err-username').textContent = '';



    }, 1000);
});

document.getElementById('cancle-change-pass').addEventListener('click', () => {
    document.getElementById('div-change-pass').style.display = 'none';
    document.getElementById('err-pass').textContent = '';
    document.getElementById('err-username').textContent = '';

});


// sap xep

// sap xep bang



var sortDirection = {}; 

function sortTable(columnIndex) {
   


    if (columnIndex == 1 ) collum = "MaGV";
    else if(columnIndex == 2) collum = "TenGV";
    else if(columnIndex == 3) collum = "GioiTinh";
    else if(columnIndex == 4) collum = "Tuoi";
    else if(columnIndex == 5) collum = "DiaChi";

    if (sortDirection[columnIndex] === 'asc') {
        sortDirection[columnIndex] = 'desc';
        orderby = "desc";
        
    } else {
        sortDirection[columnIndex] = 'asc';
        orderby = "asc";    
    }
    var text = document.getElementById('keyword').value;
    showTableTeacher(text, currentPage,collum,orderby);

    
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


