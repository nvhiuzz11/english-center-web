var countData = ds_hocsinh.length;
var currentPage = 1;
var collum = "MaHS";
var orderby ="DESC"; 
showTableStudent("", 1,collum,orderby);
showindex();

function convertDateFormat(dateString) {
    var dateParts = dateString.split("-");
    var formattedDate = dateParts[2] + "-" + dateParts[1] + "-" + dateParts[0];
    return formattedDate;
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}



function showTableStudent(text, page, collumSort ,order) {

    $.ajax({
        url: '../api/showTableStudent.php',
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

// tim kiem
function searchList() {
    collum ="";
    orderby = "";
    var text = document.getElementById('keyword').value;
    currentPage = 1;
    showTableStudent(text, 1,collum,orderby);
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
    showTableStudent(text, pageNumber,collum,orderby);
    var table = document.querySelector(".tbody-1");
    table.scrollTo({ top: table.offsetTop, behavior: 'smooth' });
}



document.getElementById('cancle-change-pass').addEventListener('click', () => {
    document.getElementById('div-change-pass').style.display = 'none';
    document.getElementById('err-pass').textContent = '';
    document.getElementById('new-password').value = '';

});



const rows = document.querySelectorAll('.tbody-1 tr');
const modalBg = document.querySelector('.modal-bg');
const modalContent = document.querySelector('.modal-content');

var stt_select;

var classes = [];
var student_select;
var dsph_lk = [];
var maPH_delete;
// khi nhấn vào 1 hàng , hiển thị thông tin chi tiêt
document.querySelector('.tbody-1').addEventListener('click', function (event) {

    if (event.target.tagName === 'TD') {


        stt_select = event.target.parentNode.cells[1].textContent;




        for (var i = 0; i < ds_hocsinh.length; i++) {
            if (stt_select == ds_hocsinh[i].MaHS)
                student_select = ds_hocsinh[i];
        }

        // lay tt phu huynh
        var phhs = [];
        var j = 0;
        for (var i = 0; i < ds_ph_hs.length; i++) {
            if (ds_ph_hs[i].MaHS === student_select.MaHS) {
                phhs[j++] = ds_ph_hs[i].TenPH;
            }
        }

        document.getElementById('Student-name').textContent = student_select.TenHS;
        document.getElementById('Student-gender').textContent = student_select.GioiTinh;
        document.getElementById('Student-age').textContent = student_select.Tuoi;

        document.getElementById('Student-id').textContent = student_select.MaHS;
        document.getElementById('Student-address').textContent = student_select.DiaChi;
        document.getElementById('Student-date').textContent = convertDateFormat(student_select.NgaySinh);
        document.getElementById('Student-phone').textContent = student_select.SDT;
        document.getElementById('Student-email').textContent = student_select.Email;



        phhs.forEach(function (name) {
            const pTag = document.createElement("p");
            pTag.innerText = name;
            const tdTag = document.getElementById("Student-parent");
            tdTag.appendChild(pTag);

        });

        // document.getElementById('Student-parent').textContent =


        var img = document.getElementById("img");

        if (student_select.GioiTinh == "Nam") {
            img.src = "../assets/images/Student-male-icon.png";
        } else {
            img.src = "../assets/images/Student-female-icon.png";
        }

        document.getElementById("tab1").classList.add("show");
        document.getElementById("tab2").classList.remove("show");
        document.getElementById("tab3").classList.remove("show");
        document.getElementById("tab4").classList.remove("show");
        document.getElementById("tb1").classList.add("active");
        document.getElementById("tb2").classList.remove("active");
        document.getElementById("tb3").classList.remove("active");
        document.getElementById("tb4").classList.remove("active");

        // thong tin lop cua hoc vien
        classes = [];
        var k = 0;
        for (var i = 0; i < ds_hs_lop.length; i++) {
            if (ds_hs_lop[i].MaHS === student_select.MaHS) {
                classes[k++] = ds_hs_lop[i];
            }
        }


        var html = '';
        var color = '';
        if (classes.length === '0') {
            html += '<p>Học sinh chưa tham gia lớp học nào </p>';
        } else {
            html += '<p> Số lớp đã tham gia: ' + classes.length + '</p>';

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
                    '<p id="num-of-session">Số buổi học:  ' + classes[i]['SoBuoiDaToChuc'] + '/' + classes[i]['SoBuoi'] + ' (Vắng : ' + classes[i]['SoBuoiNghi'] + ') </p>' +
                    '</td>' +
                    '</tr>' +
                    '<tr>' +

                    '<td>' +
                    '<p id="name-class">Tên lớp học:  ' + classes[i]['TenLop'] + '</p>' +
                    '</td>' +

                    '<td>' +
                    '<p id="name =name-teacher">Tên giáo viên:  ' + classes[i]['TenGV'] + '</p>' +
                    '</td>' +
                    '</tr>' +
                    '<tr>' +

                    '<td>' +
                    '<p id="fee-class">Học phí:  ' + numberWithCommas(classes[i]['HocPhi']) + '/buổi' + '</p>' +
                    '</td>' +

                    '<td>' +
                    '<p id="de-fee-class">Giảm học phí:  ' + classes[i]['GiamHocPhi'] + '%' + '</p>' +
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

            document.querySelector(".class-of-student").innerHTML = html;

        }

        // thong tin tai khoan

        for (var i = 0; i < ds_tk_hs.length; i++) {
            if (ds_tk_hs[i].MaHS === student_select.MaHS) {
                document.getElementById('name-login').textContent = ds_tk_hs[i]['UserName'];
                document.getElementById('username-login').value = ds_tk_hs[i]['UserName'];
                document.getElementById('password').value = ds_tk_hs[i]['Password'];
                document.getElementById('date_logup').textContent = "Ngày đăng ký  :  " + convertDateFormat(ds_tk_hs[i]['NgayDK']);
                break;
            }
        }


        showParent();


        modalBg.style.display = 'block';
    }
});


function showParent() {
    //thong tin phu huynh cua hoc sinh
    var parent = [];
    var k = 0, j = 0;

    dsph_lk = ds_phuhuynh;

    for (var i = 0; i < ds_ph_hs.length; i++) {
        if (ds_ph_hs[i].MaHS === student_select.MaHS) {
            parent[k++] = ds_ph_hs[i];
        }
    }

    var html = '';

    if (parent.length === '0') {
        html += '<p> Học sinh này chưa liên kết với phụ huynh</p>';
    } else {
        html += '<p> Số phụ huynh liên kết : ' + parent.length + '</p>';

        for (var i = 0; i < parent.length; i++) {

            dsph_lk = dsph_lk.filter(phuhuynh => phuhuynh.MaPH != parent[i]['MaPH']);

            html += '<div class="parent">' +
                '<p></p>' +
                '<table>' +
                '<td>' +
                '<p ><strong> Mã phụ huynh :</strong>' + '   ' + parent[i]['MaPH'] + '</p>' +
                '</td>' +
                '<td>' +
                '<button  class="delete-button" data-maph="' + parent[i]['MaPH'] + '" style=" float: right ;background-color: cadetblue;"> Xóa' +
                '</td>' +
                '<tr>' +

                '<td>' +
                '<p ><strong> Họ tên :</strong>' + '   ' + parent[i]['TenPH'] + '</p>' +
                '</td>' +

                '<td>' +
                '<p ><strong> Tuổi :</strong>' + '   ' + parent[i]['Tuoi'] + '</p>' +
                '</td>' +

                '</tr>' +


                '<tr>' +

                '<td>' +
                '<p ><strong> Giới tính :</strong>' + '   ' + parent[i]['GioiTinh'] + '</p>' +
                '</td>' +

                '<td>' +
                '<p ><strong> Ngày sinh :</strong>' + '   ' + convertDateFormat(parent[i]['NgaySinh']) + '</p>' +
                '</td>' +
                '</tr>' +
                '<tr>' +

                '<td>' +
                '<p ><strong>Số điện thoại :</strong>' + '   ' + parent[i]['SDT'] + '</p>' +
                '</td>' +

                '<td>' +
                '<p ><strong>Email :</strong>' + '   ' + parent[i]['Email'] + '</p>' +
                '</td>' +
                '</tr>' +


                '</table>' +
                '</div>';
        }






        document.querySelector("#parent-infor").innerHTML = html;


    }



    const selectElement = document.getElementById('select-parent');
    const options = selectElement.querySelectorAll('option:not(:first-child)');

    options.forEach(option => {
        option.remove();
    });

    dsph_lk.forEach((phuHuynh) => {
        const option = document.createElement('option');
        option.value = phuHuynh.MaPH;
        option.textContent = `${phuHuynh.MaPH}. ${phuHuynh.TenPH} - ${phuHuynh.Tuoi} tuổi`;
        document.getElementById('select-parent').appendChild(option);
    });

    /// xoa lien ket


    document.querySelectorAll('.delete-button').forEach(button => {
        button.addEventListener('click', function (event) {

            maPH_delete = event.target.dataset.maph;

            ds_phuhuynh.forEach((phuHuynh) => {
                if (phuHuynh.MaPH == maPH_delete) {
                    document.getElementById('txt-quest-link').textContent = "Bạn chắc chắn muốn xóa liên kết phụ huynh " + maPH_delete + "." + phuHuynh.TenPH;
                }
            });


            document.getElementById('modal-ques-link').style.display = 'block';
            document.querySelector('.delete-ques-link').style.display = 'block';
        });
    });
}
// xoa lien ket
document.getElementById('delete-cancle-link').addEventListener('click', () => {

    document.getElementById('modal-ques-link').style.display = 'none';
    document.querySelector('.delete-ques-link').style.display = 'none';

});


document.getElementById('delete-link').addEventListener('click', () => {

    $.ajax({
        type: 'POST',
        url: '../api/deleteLinkParent.php',
        data: {
            maph: maPH_delete,
            mahs: student_select.MaHS,
        },
        success: function (res) {
            ds_ph_hs = JSON.parse(res);
            showParent();

            var text = document.getElementById('keyword').value;
            showTableStudent(text, currentPage,collum,orderby);
        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });

    document.getElementById('modal-ques-link').style.display = 'none';
    document.querySelector('.delete-ques-link').style.display = 'none';

    document.querySelector('.delete-success').style.display = 'block';
    setTimeout(function () {
        document.querySelector('.delete-success').style.display = 'none';
    }, 1000);

});


document.querySelector('.close-btn').addEventListener('click', () => {

    document.getElementById('div-change-pass').style.display = 'none';

    modalBg.style.display = 'none';
    document.getElementById('err-pass').textContent = "";
    document.getElementById('err-username').textContent = "";


    const paragraphs = document.getElementsByTagName("p");
    while (paragraphs.length > 0) {
        paragraphs[0].parentNode.removeChild(paragraphs[0]);
    }
    document.querySelector(".class-of-student").innerHTML = '';

});



const editButton = document.getElementById('edit-button');
// const tdList = document.querySelectorAll('td[contenteditable]');

const modalBgEdit = document.querySelector('.modal-bg-edit');
const modalContentEdit = document.querySelector('.modal-content-edit');

// Khi  nhấn vào nút "Sửa"
editButton.addEventListener('click', () => {
    document.getElementById('lb_phone_edit').textContent = "";
    document.getElementById('lb_email_edit').textContent = "";
    document.getElementById('lb_name_edit').textContent = "";

    document.getElementById('lb_address_edit').textContent = "";
    document.getElementById('lb_birthday_edit').textContent = "";

    modalBgEdit.style.display = "block";


    document.getElementById('sudent_name_edit').value = student_select.TenHS;

    var gt = student_select.GioiTinh;
    var selectTag = document.getElementById("gender_edit");
    for (var i = 0; i < selectTag.options.length; i++) {
        if (selectTag.options[i].value == gt) {
            selectTag.options[i].selected = true; // nếu giống nhau, đặt thuộc tính selected cho option
            break;
        }
    }

    document.getElementById('birthday_edit').value = student_select.NgaySinh;
    document.getElementById('age_edit').value = student_select.Tuoi;
    document.getElementById('Student-id_edit').textContent = "Mã Học sinh : " + student_select.MaHS;
    document.getElementById('address_edit').value = student_select.DiaChi;
    document.getElementById('phone_number_edit').value = student_select.SDT;
    document.getElementById('email_edit').value = student_select.Email;
    // document.getElementById('education_edit').value = student_select.TrinhDo;
    document.getElementById('id_edit').value = student_select.MaHS;
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
    const Student_name = document.getElementById('sudent_name_edit').value;
    const age = document.getElementById('age_edit').value;
    const address = document.getElementById('address_edit').value;
    const birthday = document.getElementById('birthday_edit').value;

    var erorr_empty = "*Dữ liệu không để trống";

    //Kiểm tra dữ liệu nhập vào
    if (!Student_name) {
        document.getElementById('lb_name_edit').textContent = erorr_empty;
        check = false;
    } else
        document.getElementById('lb_name_edit').textContent = "";

    if (!birthday) {
        document.getElementById('lb_birthday_edit').textContent = erorr_empty;
        check = false;
    } else
        document.getElementById('lb_birthday_edit').textContent = "";

    if (!address) {

        document.getElementById('lb_address_edit').textContent = erorr_empty;
        check = false;
    } else
        document.getElementById('lb_address_edit').textContent = "";

    if (!(/^(0[0-9]{9})$/.test(phone_number)) && phone_number) {
        document.getElementById('lb_phone_edit').textContent = "*Số điện thoại không chính xác (0..; 10 chữ số)";
        check = false;
    } else
        document.getElementById('lb_phone_edit').textContent = "";

    if (!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) && email) {
        document.getElementById('lb_email_edit').textContent = "*Email không chính xác";
        check = false;
    } else
        document.getElementById('lb_email_edit').textContent = "";

    if (!check)
        return;


    $.ajax({
        type: 'POST',
        url: '../api/updateInforStudent.php',
        data: {
            id: id,
            name: Student_name,
            gender: gender,
            birthday: birthday,
            age: age,
            address: address,
            phone: phone_number,
            email: email,
        },
        success: function (res) {

            ds_hocsinh = JSON.parse(res);
            for (var i = 0; i < ds_hocsinh.length; i++) {
                if (ds_hocsinh[i].MaHS === student_select.MaHS) {
                    student_select = ds_hocsinh[i];
                    break;
                }
            }

            document.getElementById('Student-name').textContent = student_select.TenHS;
            document.getElementById('Student-gender').textContent = student_select.GioiTinh;
            document.getElementById('Student-age').textContent = student_select.Tuoi;

            document.getElementById('Student-id').textContent = student_select.MaHS;
            document.getElementById('Student-address').textContent = student_select.DiaChi;
            document.getElementById('Student-date').textContent = convertDateFormat(student_select.NgaySinh);
            document.getElementById('Student-phone').textContent = student_select.SDT;
            document.getElementById('Student-email').textContent = student_select.Email;
            if (student_select.GioiTinh == "Nam") {
                img.src = "../assets/images/Student-male-icon.png";
            } else {
                img.src = "../assets/images/Student-female-icon.png";
            }
          

            var text = document.getElementById('keyword').value;
            showTableStudent(text, currentPage,collum,orderby);


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


// Khi nhan nut Xoa

function deleteStudent() {
    $.ajax({
        url: '../api/deleteStudent.php',
        type: 'POST',
        data: {
            id: student_select.MaHS,
        },
        success: function (res) {
            ds_hocsinh = JSON.parse(res);
            var text = document.getElementById('keyword').value;
            showTableStudent(text, currentPage,collum,orderby);
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
    document.querySelector(".class-of-student").innerHTML = '';



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
        url: '../api/checkAccStudent.php',
        type: 'POST',
        data: {
            id: student_select.MaHS,
        },
        success: function (res) {

            if (res) {
                document.querySelector('.delete-ques').style.display = 'none';
                document.querySelector('.delete-ques2').style.display = 'block';
            }
            else {
                deleteStudent();
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
    deleteStudent();



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
        url: '../api/changeAccStudent.php',
        type: 'POST',
        data: {
            id: student_select.MaHS,
            username: username,
            pass: pass,
        },
        success: function (res) {
            ds_tk_hs = JSON.parse(res);

            for (var i = 0; i < ds_tk_hs.length; i++) {
                if (ds_tk_hs[i].MaHS === student_select.MaHS) {
                    document.getElementById('name-login').textContent = ds_tk_hs[i]['UserName'];
                    document.getElementById('username-login').value = ds_tk_hs[i]['UserName'];
                    document.getElementById('password').value = ds_tk_hs[i]['Password'];
                    document.getElementById('date_logup').textContent = "Ngày đăng ký  :  " + convertDateFormat(ds_tk_hs[i]['NgayDK']);
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




var sortDirection = {};

function sortTable(columnIndex) {
  

    if (columnIndex == 1 ) collum = "MaHS";
    else if(columnIndex == 2) collum = "TenHS";
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
    showTableStudent(text, currentPage,collum,orderby);


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


// them hoc sinh


document.querySelector('.add-student-button').addEventListener('click', () => {
    document.querySelector('.modal-bg-add').style.display = 'block';

});


document.querySelector('.cancle-btn-add').addEventListener('click', () => {
    document.querySelector('.modal-bg-add').style.display = 'none';
    document.querySelector('.parent_add').selectedIndex = 0;

    document.getElementById('phone_number_add').value = "";
    document.getElementById('email_add').value = "";
    document.getElementById('student_name_add').value = "";
    document.getElementById('age_add').value = "";

    document.getElementById('address_add').value = "";
    document.getElementById('birthday_add').value = "";

    const parentContainer = document.getElementById('parentContainer');
    while (parentContainer.firstChild) {
        parentContainer.removeChild(parentContainer.firstChild);
    }
    document.getElementById('lb_name_add').textContent = "";
    document.getElementById('lb_birthday_add').textContent = "";

    document.getElementById('lb_address_add').textContent = "";
    document.getElementById('lb_phone_add').textContent = "";
    document.getElementById('lb_email_add').textContent = "";


});


document.getElementById('add').addEventListener('click', function (event) {
    var check = true;

    event.preventDefault();
    const phone_number = document.getElementById('phone_number_add').value;
    const email = document.getElementById('email_add').value;
    const name = document.getElementById('student_name_add').value;
    const age = document.getElementById('age_add').value;
    const gender = document.getElementById('gender_add').value;

    const address = document.getElementById('address_add').value;

    const birthday = document.getElementById('birthday_add').value;

    var erorr_empty = "*Dữ liệu không để trống";

    //Kiểm tra dữ liệu nhập vào

    if (!name) {
        document.getElementById('lb_name_add').textContent = "Tên học sinh không được để trống";
        check = false;
    } else
        document.getElementById('lb_name_add').textContent = "";

    if (!birthday) {
        document.getElementById('lb_birthday_add').textContent = "Ngày sinh không được để trống";
        check = false;
    } else
        document.getElementById('lb_birthday_add').textContent = "";

    if (!address) {
        document.getElementById('lb_address_add').textContent = "Địa chỉ không được để trống";
        check = false;
    } else
        document.getElementById('lb_address_add').textContent = "";

    if (!(/^(0[0-9]{9})$/.test(phone_number)) && phone_number) {
        document.getElementById('lb_phone_add').textContent = "Định dạng số điện thoại không đúng";
        check = false;
    } else
        document.getElementById('lb_phone_add').textContent = "";

    if (!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) && email) {
        document.getElementById('lb_email_add').textContent = "Định dạng email không đúng";
        check = false;
    } else
        document.getElementById('lb_email_add').textContent = "";

    if (!check)
        return;

    const selects = document.querySelectorAll('.parent_add');
    const selectedValues = [];
    const seenValues = {}

    selects.forEach((select) => {
        const selectedOption = select.options[select.selectedIndex];
        if (selectedOption.value != "") {

            if (!seenValues[selectedOption.value]) {
                seenValues[selectedOption.value] = true;
                selectedValues.push(selectedOption.value);
            }
        }
    });

    $.ajax({
        url: '../api/addStudent.php',
        type: 'POST',
        data: {
            name: name,
            gender: gender,
            date: birthday,
            age: age,
            address: address,
            phone: phone_number,
            email: email,
            parents: selectedValues,
        },
        success: function (res) {

            ds_hocsinh = JSON.parse(res).student;
            ds_ph_hs = JSON.parse(res).phhs;
            ds_tk_hs = JSON.parse(res).acc;

            var text = document.getElementById('keyword').value;
            showTableStudent(text, currentPage,collum,orderby);

        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });

    document.getElementById('phone_number_add').value = "";
    document.getElementById('email_add').value = "";
    document.getElementById('student_name_add').value = "";
    document.getElementById('age_add').value = "";

    document.getElementById('address_add').value = "";
    document.getElementById('birthday_add').value = "";
    document.querySelector('.parent_add').selectedIndex = 0;

    const parentContainer = document.getElementById('parentContainer');
    while (parentContainer.firstChild) {
        parentContainer.removeChild(parentContainer.firstChild);
    }




    document.querySelector('.add-success').style.display = 'block';

    setTimeout(function () {
        document.querySelector('.add-success').style.display = 'none';

    }, 1000);

});

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

function addParent() {
    const parentContainer = document.getElementById('parentContainer');
    const newParent = document.createElement('div');
    newParent.classList.add('parent');
    newParent.style.padding = 0;
    newParent.innerHTML = `
      <select name="parent_add" class="parent_add" style="width: 50%;">
        <option value="">Chọn phụ huynh</option>
      </select>
      <button class="removeBtn"  style="background-color: lightcoral;" onclick="removeParent(this)">-</button>
    `;

    parentContainer.appendChild(newParent);

    const newSelect = newParent.querySelector('.parent_add');

    // Điền dữ liệu về phụ huynh vào select
    ds_phuhuynh.forEach((phuHuynh) => {
        const option = document.createElement('option');
        option.value = phuHuynh.MaPH;
        option.textContent = `${phuHuynh.MaPH}. ${phuHuynh.TenPH} - ${phuHuynh.Tuoi} tuổi`;
        newSelect.appendChild(option);
    });


}


function removeParent(btn) {
    const parentToRemove = btn.parentNode;
    const parentContainer = document.getElementById('parentContainer');
    parentContainer.removeChild(parentToRemove);
}



///////////////// them lien kett phu huynh
document.getElementById('add-parent').addEventListener('click', () => {
    document.getElementById('modal-add-link').style.display = 'block';

});

function removeParent2(btn) {
    const parentToRemove = btn.parentNode;
    const parentContainer = document.getElementById('parentContainer2');
    parentContainer.removeChild(parentToRemove);
}


function addLinkParent() {
    const parentContainer = document.getElementById('parentContainer2');
    const newParent = document.createElement('div');
    newParent.classList.add('parent2');
    newParent.style.padding = 0;
    newParent.innerHTML = `
      <select name="parent_add2" class="parent_add2" style="width: 60%;" required>
        <option value="">Chọn phụ huynh</option>
      </select>
      <button class="removeBtn"  style="background-color: lightcoral;" onclick="removeParent2(this)">-</button>
    `;

    parentContainer.appendChild(newParent);

    const newSelect = newParent.querySelector('.parent_add2');


    dsph_lk.forEach((phuHuynh) => {
        const option = document.createElement('option');
        option.value = phuHuynh.MaPH;
        option.textContent = `${phuHuynh.MaPH}. ${phuHuynh.TenPH} - ${phuHuynh.Tuoi} tuổi`;
        newSelect.appendChild(option);
    });


}



document.getElementById('btn-cancle-link').addEventListener('click', () => {
    document.getElementById('modal-add-link').style.display = 'none';
    document.querySelector('.parent_add2').selectedIndex = 0;


    const parentContainer = document.getElementById('parentContainer2');
    while (parentContainer.firstChild) {
        parentContainer.removeChild(parentContainer.firstChild);
    }
});


document.getElementById('btn-add-link').addEventListener('click', () => {
    const selects = document.querySelectorAll('.parent_add2');
    const selectedValues = [];
    const seenValues = {}

    selects.forEach((select) => {
        const selectedOption = select.options[select.selectedIndex];
        if (selectedOption.value != "") {

            if (!seenValues[selectedOption.value]) {
                seenValues[selectedOption.value] = true;
                selectedValues.push(selectedOption.value);
            }
        }
    });


    $.ajax({
        url: '../api/addLinkParent.php',
        type: 'POST',
        data: {
            id: student_select.MaHS,
            parents: selectedValues,
        },
        success: function (res) {
            ds_ph_hs = JSON.parse(res);
            showParent();

            var text = document.getElementById('keyword').value;
            showTableStudent(text, currentPage,collum,orderby);
        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });


    document.getElementById('modal-add-link').style.display = 'none';

    document.querySelector('.parent_add2').selectedIndex = 0;


    const parentContainer = document.getElementById('parentContainer2');
    while (parentContainer.firstChild) {
        parentContainer.removeChild(parentContainer.firstChild);
    }


    document.getElementById('noti-add-link').style.display = 'block';

    setTimeout(function () {
        document.getElementById('noti-add-link').style.display = 'none';

    }, 1000);

});

