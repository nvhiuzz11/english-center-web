var countData = ds_phuhuynh.length;
var currentPage = 1;
var collum = "";
var orderby =""; 
showTableParent("", 1,collum,orderby);
showindex();





function convertDateFormat(dateString) {
    var dateParts = dateString.split("-");
    var formattedDate = dateParts[2] + "-" + dateParts[1] + "-" + dateParts[0];
    return formattedDate;
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


function showTableParent(text, page, collumSort ,order) {

    $.ajax({
        url: '../api/showTableParent.php',
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
    showTableParent(text, 1,collum,orderby);
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
    showTableParent(text, pageNumber,collum,orderby);
    var table = document.querySelector(".tbody-1");
    table.scrollTo({ top: table.offsetTop, behavior: 'smooth' });
}



const rows = document.querySelectorAll('.tbody-1 tr');
const modalBg = document.querySelector('.modal-bg');
const modalContent = document.querySelector('.modal-content');






var stt_select;
var parent_select;



document.querySelector('.tbody-1').addEventListener('click', function (event) {

    if (event.target.tagName === 'TD') {
        stt_select = event.target.parentNode.cells[1].textContent;

        for (var i = 0; i < ds_phuhuynh.length; i++) {
            if (stt_select == ds_phuhuynh[i].MaPH)
                parent_select = ds_phuhuynh[i];
        }

        var hs_of_ph = [];
        var j = 0;
        for (var i = 0; i < ds_hs_of_ph.length; i++) {
            if (ds_hs_of_ph[i].MaPH === parent_select.MaPH) {
                hs_of_ph[j++] = ds_hs_of_ph[i].TenHS;
            }
        }

        document.getElementById('Parent-name').textContent = parent_select.TenPH;
        document.getElementById('Parent-gender').textContent = parent_select.GioiTinh;
        document.getElementById('Parent-age').textContent = parent_select.Tuoi;
        document.getElementById('Parent-id').textContent = parent_select.MaPH;
        document.getElementById('Parent-address').textContent = parent_select.DiaChi;
        document.getElementById('Parent-date').textContent = convertDateFormat(parent_select.NgaySinh);
        document.getElementById('Parent-phone').textContent = parent_select.SDT;
        document.getElementById('Parent-email').textContent = parent_select.Email;


        var html_hs = '';
        hs_of_ph.forEach(function (name) {
            html_hs += '<p class ="infor-student">' + name + '</p>';
        });
        const tdTag = document.getElementById("Parent-parent"); // Lấy đối tượng td có id là Parent-parent
        tdTag.innerHTML = html_hs;



        var img = document.getElementById("img");

        if (parent_select.GioiTinh == "Nam") {
            img.src = "../assets/images/Parent-male-icon.png";
        } else {
            img.src = "../assets/images/Parent-female-icon.png";
        }

        document.getElementById("tab1").classList.add("show");
        document.getElementById("tab2").classList.remove("show");
        document.getElementById("tab3").classList.remove("show");
        document.getElementById("tb1").classList.add("active");
        document.getElementById("tb2").classList.remove("active");
        document.getElementById("tb3").classList.remove("active");

        
       
        //thong tin tai khoan
    
        for (var i = 0; i < ds_tk_ph.length; i++) {
            if (ds_tk_ph[i].MaPH === parent_select.MaPH) {
                document.getElementById('name-login').textContent = ds_tk_ph[i]['UserName'];
                document.getElementById('username-login').value = ds_tk_ph[i]['UserName'];
                document.getElementById('password').value = ds_tk_ph[i]['Password'];
                document.getElementById('date_logup').textContent = "Ngày đăng ký  :  " + convertDateFormat(ds_tk_ph[i]['NgayDK']);
        
            }
        }
        showStudent()
        
        modalBg.style.display = 'block';
    }
});



var dshs_lk = [];
var maHS_delete;
function showStudent(){
    //thong tin con cua phu huynh
    var child = [];
    var k = 0;
    dshs_lk =[];
    dshs_lk = ds_hocsinh;
    for (var i = 0; i < ds_hs_of_ph.length; i++) {
        if (ds_hs_of_ph[i].MaPH === parent_select.MaPH) {
            child[k++] = ds_hs_of_ph[i];
        }
    }






    var html = '';

    if (child.length === '0') {
        html += '<p> Phụ huynh này chưa liên kết với học viên</p>';
    } else {
        html += '<p> Số học viên liên kết : ' + child.length + '</p>';

        for (var i = 0; i < child.length; i++) {

            dshs_lk = dshs_lk.filter(hocsinh => hocsinh.MaHS != child[i]['MaHS']);


            html += '<div class="child">' +
                '<p></p>' +
                '<table>' +
                '<td>' +
                '<p ><strong> Mã học sinh :</strong>' + '   ' + child[i]['MaHS'] + '</p>' +
                '</td>' +
                '<td>' +
                '<button  class="delete-button" data-mahs="' +child[i]['MaHS'] + '" style=" float: right ;background-color: cadetblue;"> Xóa' +
                '</td>' +
                '<tr>' +

                '<td>' +
                '<p ><strong> Họ tên :</strong>' + '   ' + child[i]['TenHS'] + '</p>' +
                '</td>' +

                '<td>' +
                '<p ><strong> Tuổi :</strong>' + '   ' + child[i]['Tuoi'] + '</p>' +
                '</td>' +

                '</tr>' +


                '<tr>' +

                '<td>' +
                '<p ><strong> Giới tính :</strong>' + '   ' + child[i]['GioiTinh'] + '</p>' +
                '</td>' +

                '<td>' +
                '<p ><strong> Ngày sinh :</strong>' + '   ' + convertDateFormat(child[i]['NgaySinh']) + '</p>' +
                '</td>' +
                '</tr>' +
                '<tr>' +

                '<td>' +
                '<p ><strong>Số điện thoại :</strong>' + '   ' + child[i]['SDT'] + '</p>' +
                '</td>' +

                '<td>' +
                '<p ><strong>Email :</strong>' + '   ' + child[i]['Email'] + '</p>' +
                '</td>' +
                '</tr>' +
                '<tr>' +

                '<td>' +
                '<p ><strong> Lớp học :</strong>' + ' 	  ';

            var k = true;
            for (var j = 0; j < ds_hs_lop.length; j++) {
                if (ds_hs_lop[j].MaHS === child[i]['MaHS']) {
                    html += ds_hs_lop[j].MaLop + ' ;  ';
                    k = false;
                }
            }
            if (k) {
                html += "(Chưa tham gia lớp học nào)"
            }
            html += '</p>' +
                '</td>' +
                '</tr>' +

                '</table>' +
                '</div>';
        }


     

        document.querySelector("#child-infor").innerHTML = html;

    }


    const selectElement = document.getElementById('select-student');
    const options = selectElement.querySelectorAll('option:not(:first-child)');

    options.forEach(option => {
        option.remove();
    });

    dshs_lk.forEach((hocsinh) => {
        const option = document.createElement('option');
        option.value = hocsinh.MaHS;
        option.textContent = `${hocsinh.MaHS}. ${hocsinh.TenHS} - ${hocsinh.Tuoi} tuổi`;
        document.getElementById('select-student').appendChild(option);
    });


    /// xoa lien ket


    document.querySelectorAll('.delete-button').forEach(button => {
        button.addEventListener('click', function (event) {

            maHS_delete = event.target.dataset.mahs;

            ds_hocsinh.forEach((hocsinh) => {
                if (hocsinh.MaHS == maHS_delete) {
                    document.getElementById('txt-quest-link').textContent = "Bạn chắc chắn muốn xóa liên kết học sinh " + maHS_delete + "." + hocsinh.TenHS;
                }

            });


            document.getElementById('modal-ques-link').style.display = 'block';
            document.querySelector('.delete-ques-link').style.display = 'block';
        });
    });

}
document.getElementById('delete-cancle-link').addEventListener('click', () => {

    document.getElementById('modal-ques-link').style.display = 'none';
    document.querySelector('.delete-ques-link').style.display = 'none';

});



document.getElementById('delete-link').addEventListener('click', () => {

    $.ajax({
        type: 'POST',
        url: '../api/deleteLinkStudent.php',
        data: {
            maph: parent_select.MaPH,
            mahs: maHS_delete,

        },
        success: function (res) {
            ds_hs_of_ph = JSON.parse(res);
            showStudent();

            var text = document.getElementById('keyword').value;
            showTableParent(text, currentPage,collum,orderby);
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
    document.getElementById('err-pass').textContent = '';
    document.getElementById('err-username').textContent = "";

    const paragraphs = document.getElementsByTagName("p");
    while (paragraphs.length > 0) {
        paragraphs[0].parentNode.removeChild(paragraphs[0]);
    }

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


    document.getElementById('parent_name_edit').value = parent_select.TenPH;

    var gt = parent_select.GioiTinh;
    var selectTag = document.getElementById("gender_edit");
    for (var i = 0; i < selectTag.options.length; i++) {
        if (selectTag.options[i].value == gt) {
            selectTag.options[i].selected = true; // nếu giống nhau, đặt thuộc tính selected cho option
            break;
        }
    }

    document.getElementById('birthday_edit').value = parent_select.NgaySinh;
    document.getElementById('age_edit').value = parent_select.Tuoi;
    document.getElementById('parent-id_edit').textContent = "Mã Học viên : " + parent_select.MaPH;
    document.getElementById('address_edit').value = parent_select.DiaChi;
    document.getElementById('phone_number_edit').value = parent_select.SDT;
    document.getElementById('email_edit').value = parent_select.Email;

    document.getElementById('id_edit').value = parent_select.MaPH;
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
    const parent_name = document.getElementById('parent_name_edit').value;
    const age = document.getElementById('age_edit').value;
    const address = document.getElementById('address_edit').value;
    const birthday = document.getElementById('birthday_edit').value;
    const gender = document.getElementById('gender_edit').value;

    var erorr_empty = "*Dữ liệu không được để trống";

    if (!parent_name) {
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

    if (!(/^(0[0-9]{9})$/.test(phone_number))) {
        document.getElementById('lb_phone_edit').textContent = "*Số điện thoại không chính xác (0..; 10 chữ số)";
        check = false;
    } else
        document.getElementById('lb_phone_edit').textContent = "";

    if (!(/\S+@\S+\.\S+/.test(email))  && email) {
        document.getElementById('lb_email_edit').textContent = "*Email không chính xác (example@xxx.com)";
        check = false;
    } else
        document.getElementById('lb_email_edit').textContent = "";

    if (!check)
        return;


    $.ajax({
        type: 'POST',
        url: '../api/updateInforParent.php',
        data: {
            id: id,
            name: parent_name,
            gender: gender,
            birthday: birthday,
            age: age,
            address: address,
            phone: phone_number,
            email: email,
        },
        success: function (res) {

            ds_phuhuynh = JSON.parse(res);


            for (var i = 0; i < ds_phuhuynh.length; i++) {
                if (ds_phuhuynh[i].MaPH === parent_select.MaPH) {
                    parent_select = ds_phuhuynh[i];
                    break;
                }
            }

            document.getElementById('Parent-name').textContent = parent_select.TenPH;
            document.getElementById('Parent-gender').textContent = parent_select.GioiTinh;
            document.getElementById('Parent-age').textContent = parent_select.Tuoi;
            document.getElementById('Parent-id').textContent = parent_select.MaPH;
            document.getElementById('Parent-address').textContent = parent_select.DiaChi;
            document.getElementById('Parent-date').textContent = convertDateFormat(parent_select.NgaySinh);
            document.getElementById('Parent-phone').textContent = parent_select.SDT;
            document.getElementById('Parent-email').textContent = parent_select.Email;


            var img = document.getElementById("img");
            if (parent_select.GioiTinh == "Nam") {
                img.src = "../assets/images/Parent-male-icon.png";
            } else {
                img.src = "../assets/images/Parent-female-icon.png";
            }
            
            var text = document.getElementById('keyword').value; 
            showTableParent(text, currentPage,collum,orderby);

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

function deleteParent() {
    $.ajax({
        url: '../api/deleteParent.php',
        type: 'POST',
        data: {
            id: parent_select.MaPH,
        },
        success: function (res) {
            ds_phuhuynh = JSON.parse(res);
            var text = document.getElementById('keyword').value;
            showTableParent(text, currentPage,collum,orderby);
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
        url: '../api/checkAccParent.php',
        type: 'POST',
        data: {
            id: parent_select.MaPH,
        },
        success: function (res) {

            if (res) {
                document.querySelector('.delete-ques').style.display = 'none';
                document.querySelector('.delete-ques2').style.display = 'block';
            }
            else {
                deleteParent();
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
    deleteParent();



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
// ẩn hiện mk
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
        url: '../api/changeAccParent.php',
        type: 'POST',
        data: {
            id: parent_select.MaPH,
            username: username,
            pass: pass,
        },
        success: function (res) {
            ds_tk_ph = JSON.parse(res);

            for (var i = 0; i < ds_tk_ph.length; i++) {
                if (ds_tk_ph[i].MaPH === parent_select.MaPH) {
                    document.getElementById('name-login').textContent = ds_tk_ph[i]['UserName'];
                    document.getElementById('username-login').value = ds_tk_ph[i]['UserName'];
                    document.getElementById('password').value = ds_tk_ph[i]['Password'];
                    document.getElementById('date_logup').textContent = "Ngày đăng ký  :  " + convertDateFormat(ds_tk_ph[i]['NgayDK']);
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


// sap xep bang



var sortDirection = {}; 

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



    //     if (columnIndex === 4 || columnIndex === 1) {
    //         var aValue = parseFloat(a.getElementsByTagName('td')[columnIndex].innerText.trim());
    //         var bValue = parseFloat(b.getElementsByTagName('td')[columnIndex].innerText.trim());

    //         if (sortDirection[columnIndex] === 'asc') {
    //             return aValue - bValue;
    //         } else {
    //             return bValue - aValue;
    //         }
    //     } else {
    //         var aValue = a.getElementsByTagName('td')[columnIndex].innerText.trim();
    //         var bValue = b.getElementsByTagName('td')[columnIndex].innerText.trim();
    //         if (sortDirection[columnIndex] === 'asc') {
    //             return aValue.localeCompare(bValue);
    //         } else {
    //             return bValue.localeCompare(aValue);
    //         }
    //     }

    // });
    // rows.forEach(function (row, index) {
    //     var sttCell = row.getElementsByTagName('td')[0];
    //     sttCell.innerText = sttValues[index];
    // });

    // rows.forEach(function (row) {
    //     tbody.appendChild(row);
    // });


    
    if (columnIndex == 1 ) collum = "MaPH";
    else if(columnIndex == 2) collum = "TenPH";
    else if(columnIndex == 3) collum = "GioiTinh";
    else if(columnIndex == 4) collum = "Tuoi";
    else if(columnIndex == 5) collum = "DiaChi";
    else if(columnIndex == 6) collum = "dshs";

    if (sortDirection[columnIndex] === 'asc') {
        sortDirection[columnIndex] = 'desc';
        orderby = "desc";
        
    } else {
        sortDirection[columnIndex] = 'asc';
        orderby = "asc";    
    }
    var text = document.getElementById('keyword').value;
    showTableParent(text, currentPage,collum,orderby);

    
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



// them phu huynh


document.querySelector('.add-parent-button').addEventListener('click', () => {
    document.querySelector('.modal-bg-add').style.display = 'block';

});


document.querySelector('.cancle-btn-add').addEventListener('click', () => {
    document.querySelector('.modal-bg-add').style.display = 'none';
    document.querySelector('.student_add').selectedIndex = 0;

    document.getElementById('phone_number_add').value = "";
    document.getElementById('email_add').value = "";
    document.getElementById('parent_name_add').value = "";
    document.getElementById('age_add').value = "";

    document.getElementById('address_add').value = "";
    document.getElementById('birthday_add').value = "";

    const studentContainer = document.getElementById('studentContainer');
    while (studentContainer.firstChild) {
        studentContainer.removeChild(studentContainer.firstChild);
    }


});


document.getElementById('add').addEventListener('click', function (event) {
    var check = true;

    event.preventDefault();
    const phone_number = document.getElementById('phone_number_add').value;
    const email = document.getElementById('email_add').value;
    const name = document.getElementById('parent_name_add').value;
    const age = document.getElementById('age_add').value;
    const gender = document.getElementById('gender_add').value;

    const address = document.getElementById('address_add').value;

    const birthday = document.getElementById('birthday_add').value;

    var erorr_empty = "*Dữ liệu không để trống";

    //Kiểm tra dữ liệu nhập vào

    if (!name) {
        document.getElementById('lb_name_add').textContent = erorr_empty;
        check = false;
    } else
        document.getElementById('lb_name_add').textContent = "";

    if (!birthday) {
        document.getElementById('lb_birthday_add').textContent = erorr_empty;
        check = false;
    } else
        document.getElementById('lb_birthday_add').textContent = "";

    if (!address) {
        document.getElementById('lb_address_add').textContent = erorr_empty;
        check = false;
    } else
        document.getElementById('lb_address_add').textContent = "";

    if (!/^(0[0-9]{9})$/.test(phone_number)) {
        document.getElementById('lb_phone_add').textContent = "*Số điện thoại không chính xác (0[0-9]; 10 chữ số)";
        check = false;
    } else
        document.getElementById('lb_phone_add').textContent = "";

    if (!/\S+@\S+\.\S+/.test(email) && email) {
        document.getElementById('lb_email_add').textContent = "*Email không chính xác (example@xxx.com)";
        check = false;
    } else
        document.getElementById('lb_email_add').textContent = "";

    if (!check)
        return;

    const selects = document.querySelectorAll('.student_add');
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
        url: '../api/addParent.php',
        type: 'POST',
        data: {
            name: name,
            gender: gender,
            date: birthday,
            age: age,
            address: address,
            phone: phone_number,
            email: email,
            students: selectedValues,
        },
        success: function (res) {
            ds_phuhuynh = JSON.parse(res).parent;
            ds_hs_of_ph = JSON.parse(res).phhs;
            ds_tk_ph = JSON.parse(res).acc;

            var text = document.getElementById('keyword').value;
            
            showTableParent(text,currentPage,collum,orderby);

        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });

    document.getElementById('phone_number_add').value = "";
    document.getElementById('email_add').value = "";
    document.getElementById('parent_name_add').value = "";
    document.getElementById('age_add').value = "";

    document.getElementById('address_add').value = "";
    document.getElementById('birthday_add').value = "";
    document.querySelector('.student_add').selectedIndex = 0;

    const studentContainer = document.getElementById('studentContainer');
    while (studentContainer.firstChild) {
        studentContainer.removeChild(studentContainer.firstChild);
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
    console.log("a");
    var inputDate = document.getElementById("birthday_edit").value;
    var namHienTai = new Date().getFullYear();
    var namInput = new Date(inputDate).getFullYear();

    var age = namHienTai - namInput;
    document.getElementById('age_edit').value = age;
}

function addStudent() {
    const studentContainer = document.getElementById('studentContainer');
    const newstudent = document.createElement('div');
    newstudent.classList.add('student');
    newstudent.style.padding = 0;
    newstudent.innerHTML = `
      <select name="student_add" class="student_add" style="width: 50%;">
        <option value="">Chọn học sinh</option>
      </select>
      <button class="removeBtn"  style="background-color: lightcoral;" onclick="removeStudent(this)">-</button>
    `;

    studentContainer.appendChild(newstudent);

    const newSelect = newstudent.querySelector('.student_add');


    ds_hocsinh.forEach((hocsinh) => {
        const option = document.createElement('option');
        option.value = hocsinh.MaHS;
        option.textContent = `${hocsinh.MaHS}. ${hocsinh.TenHS} - ${hocsinh.Tuoi} tuổi`;
        newSelect.appendChild(option);
    });


}


function removeStudent(btn) {
    const studentToRemove = btn.parentNode;
    const studentContainer = document.getElementById('studentContainer');
    studentContainer.removeChild(studentToRemove);
}

///////////////// them lien kett hoc sinh
document.getElementById('add-student').addEventListener('click', () => {
    document.getElementById('modal-add-link').style.display = 'block';

});

function removeStudent2(btn) {
    const studentToRemove = btn.parentNode;
    const studentContainer = document.getElementById('studentContainer2');
    studentContainer.removeChild(studentToRemove);
}


function addLinkStudent() {


    const studentContainer = document.getElementById('studentContainer2');
    const newstudent = document.createElement('div');
    newstudent.classList.add('student2');
    newstudent.style.padding = 0;
    newstudent.innerHTML = `
      <select name="student_add2" class="student_add2" style="width: 60%;">
        <option value="">Chọn học sinh</option>
      </select>
      <button class="removeBtn"  style="background-color: lightcoral;" onclick="removeStudent(this)">-</button>
    `;

    studentContainer.appendChild(newstudent);

    const newSelect = newstudent.querySelector('.student_add2');


    dshs_lk.forEach((hocsinh) => {
        const option = document.createElement('option');
        option.value = hocsinh.MaHS;
        option.textContent = `${hocsinh.MaHS}. ${hocsinh.TenHS} - ${hocsinh.Tuoi} tuổi`;
        newSelect.appendChild(option);
    });




}



document.getElementById('btn-cancle-link').addEventListener('click', () => {
    document.getElementById('modal-add-link').style.display = 'none';
    document.querySelector('.student_add2').selectedIndex = 0;


    const studentContainer = document.getElementById('studentContainer2');
    while (studentContainer.firstChild) {
        studentContainer.removeChild(studentContainer.firstChild);
    }
});


document.getElementById('btn-add-link').addEventListener('click', () => {
    const selects = document.querySelectorAll('.student_add2');
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
        url: '../api/addLinkStudent.php',
        type: 'POST',
        data: {
            id: parent_select.MaPH,
            students: selectedValues,
        },
        success: function (res) {
            ds_hs_of_ph= JSON.parse(res);
            showStudent();
            
            var text = document.getElementById('keyword').value;
            showTableParent(text, currentPage,collum,orderby);
        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });


    document.getElementById('modal-add-link').style.display = 'none';

    document.querySelector('.student_add2').selectedIndex = 0;


    const studentContainer = document.getElementById('studentContainer2');
    while (studentContainer.firstChild) {
        studentContainer.removeChild(studentContainer.firstChild);
    }


    document.getElementById('noti-add-link').style.display = 'block';

    setTimeout(function () {
        document.getElementById('noti-add-link').style.display = 'none';

    }, 1000);

});

