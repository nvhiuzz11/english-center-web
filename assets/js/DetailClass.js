showDetailClass();

function showDetailClass() {
    $.ajax({
        url: '../api/detailClass.php',
        type: 'POST',
        data: {
            maLop: malop,
        },
        success: function (res) {
            document.getElementById("form_delete").innerHTML = res;

        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });
}

showEditClass();
function showEditClass() {
    $.ajax({
        url: '../api/editClass.php',
        type: 'POST',
        data: {
            maLop: malop,
        },
        success: function (res) {
            document.getElementById("form_edit").innerHTML = res;

        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });

}


showStudent();
function showStudent() {
    $.ajax({
        url: '../api/showStudents.php',
        type: 'POST',
        data: {
            malop: malop,
        },
        success: function (res) {
            document.getElementById("tbody-student").innerHTML = res;

        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });



}






function formatNumber(input) {
    let value = input.value;

    value = value.replace(/[^\d,]/g, '');

    value = value.replace(/,/g, '');

    value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    input.value = value;
}

var maHS_delete;
listStudents();
function listStudents() {
    const selectElement = document.getElementById("select-student");
    selectElement.innerHTML = '';
    listAddStudent.forEach(item => {
        const option = document.createElement('option');
        option.value = item.MaHS;
        option.textContent = `${item.MaHS}. ${item.TenHS} - ${new Date(item.NgaySinh).toLocaleDateString()} - ${item.DiaChi}`;
        selectElement.appendChild(option);
    });

    document.getElementById("div-btn-delete").innerHTML = "";
    jsonListStudents.forEach(data => {
        const form = document.createElement('form');
        form.style.marginBottom = '34px';

        const input = document.createElement('input');
        input.type = 'hidden';
        input.value = data.MaHS;
        input.name = 'deleteHocsinh';

        const button = document.createElement('button');
        button.classList.add('btn');

        button.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
            </svg>`;

        button.addEventListener('click', function (event) {
            event.preventDefault();

            maHS_delete = input.value;
            
            document.querySelector('#modal-ques2').style.display = 'block';
           





        });

        form.appendChild(input);
        form.appendChild(button);
        document.getElementById("div-btn-delete").appendChild(form);
    });

}


const yesDelete = document.getElementById('yesDeleteStudent');
const noDelete = document.getElementById('noDeleteStudent');

yesDelete.addEventListener('click', function (event) {
   

    $.ajax({
        url: '../api/deleteStudentClass.php',
        type: 'POST',
        data: {
            malop: malop,
            mahs: maHS_delete,
        },
        success: function (res) {

            listAddStudent = JSON.parse(res).listNo;
            jsonListStudents = JSON.parse(res).listYes;

            listStudents();
            showStudent();
            showDetailClass();
            showLisAttendance();
            showDetailAdttendance();
            showAddAttend();
        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });

    document.querySelector('#modal-ques2').style.display = 'none';
    document.querySelector('.delete-success').style.display = 'block';
    setTimeout(function () {
        document.querySelector('.delete-success').style.display = 'none';


    }, 1000);

});

noDelete.addEventListener('click', function (event) {

    document.querySelector('#modal-ques2').style.display = 'none';

});
var time_old ="";

function showDetails(id) {
    var detailsBox = document.getElementById('details-' + id);

    const boxTime = document.getElementById('boxTime' + id);
    detailsBox.classList.add('active');
    boxTime.classList.add('active');
     time_old = document.getElementById("updateTime").value;

    const closebtnboxTime = document.getElementById('closebtnboxTime' + id);
    closebtnboxTime.addEventListener('click', () => {
        detailsBox.classList.remove('active');
        boxTime.classList.remove('active');

    });




}




document.getElementById('div-detail').addEventListener('click', function (event) {
     
    if (event.target && event.target.matches('[id^="submitDiemDanh"]')) {
        event.preventDefault();

        const detailDiv = event.target.closest('.detailTimeAttendance');
        const checkboxes = detailDiv.querySelectorAll('input[type="checkbox"]');
        const time_new = detailDiv.querySelector('#updateTime').value;

        var data = [];

        checkboxes.forEach(checkbox => {
            const maHS = checkbox.parentNode.previousElementSibling.previousElementSibling.textContent.trim();
            const isChecked = checkbox.checked;

            data.push({ MaHS: maHS, isChecked: isChecked });
        });

        

        $.ajax({
            url: '../api/updateAttendAd.php',
            type: 'POST',
            data: {
                malop: malop,
                date_new: time_new,
                date_old: time_old,
                data: JSON.stringify(data),
            },
            success: function (res) {

                

                showStudent();
                showDetailClass();
                showLisAttendance();
                showDetailAdttendance();
                showAddAttend();
            },
            error: function (xhr, status, error) {
                console.error(error);
            }
        });



        document.querySelector('.update-success').style.display = 'block';
        setTimeout(function () {
            document.querySelector('.update-success').style.display = 'none';

        }, 1000);


    }
    else if (event.target && event.target.matches('[value="Xóa dữ liệu điểm danh"]')) {
        event.preventDefault();

        const detailDiv = event.target.closest('.detailTimeAttendance');
        const time = detailDiv.querySelector('#updateTime').value;
        ///
        document.querySelector('#modal-ques3').style.display = 'block';
        const yesDelete = document.getElementById('yesDeleteAttend');
        const noDelete = document.getElementById('noDeleteAttend');

        yesDelete.addEventListener('click', function (event) {

            event.preventDefault();

            $.ajax({
                url: '../api/deleteAttendAd.php',
                type: 'POST',
                data: {
                    malop: malop,
                    date: time,
                },
                success: function (res) {



                    showStudent();
                    showDetailClass();
                    showLisAttendance();
                    showDetailAdttendance();
                    showAddAttend();
                },
                error: function (xhr, status, error) {
                    console.error(error);
                }
            });


            document.querySelector('#modal-ques3').style.display = 'none';
            document.querySelector('.delete-success').style.display = 'block';
            setTimeout(function () {
                document.querySelector('.delete-success').style.display = 'none';

            }, 1000);

        });

        noDelete.addEventListener('click', function (event) {

            document.querySelector('#modal-ques3').style.display = 'none';

        });






    }


});


// diem danh
showLisAttendance();
function showLisAttendance() {
    $.ajax({
        url: '../api/showAttendance.php',
        type: 'POST',
        data: {
            malop: malop,
        },
        success: function (res) {
            document.getElementById("listdday").innerHTML = res;
        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });

}

showDetailAdttendance();
function showDetailAdttendance() {

    $.ajax({
        url: '../api/showDetailAttend.php',
        type: 'POST',
        data: {
            malop: malop,
        },
        success: function (res) {
            document.getElementById("div-detail").innerHTML = res;
        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });

}


showAddAttend();
function showAddAttend() {

    $.ajax({
        url: '../api/showAddAttend.php',
        type: 'POST',
        data: {
            malop: malop,
        },
        success: function (res) {
            document.getElementById("tbody-addAttend").innerHTML = res;
        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });

}

document.getElementById("btn-add-attend").addEventListener('click', function (event) {

    event.preventDefault();
    var time = document.getElementById("addTime").value;

    if (!time) {
        document.getElementById("err-add").textContent = "*Chưa chọn ngày!";
        return;
    }

    document.getElementById("err-add").textContent = "";

    var check = false;
    listTime.forEach(data => {

        if (data['ThoiGian'] == time) {
            document.getElementById("err-add").textContent = "*Thời gian đã có dữ liệu điểm danh!";
            check = true;
        }
    });
    if (check) {
        return;
    }






    const tbody = document.getElementById('tbody-addAttend');

    const data = [];

    for (let i = 0; i < tbody.rows.length; i++) {
        const row = tbody.rows[i];
        const maHS = row.cells[1].textContent.trim();
        const checkbox = row.cells[3].querySelector('input[type="checkbox"]');


        const isChecked = checkbox.checked;


        data.push({ MaHS: maHS, isChecked: isChecked });
    }
    if(data.length ==0){
        document.getElementById("err-add").textContent = "*Lớp chưa có học sinh";
    }else{
        document.getElementById("err-add").textContent = "";
    $.ajax({
        url: '../api/addAttendAd.php',
        type: 'POST',
        data: {
            malop: malop,
            date: time,
            data: JSON.stringify(data),
        },
        success: function (res) {

           

            showStudent();
            showDetailClass();
            showLisAttendance();
            showDetailAdttendance();
            showAddAttend();
        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });

    addboxDateDD.classList.remove('active');
    boxDateDD.classList.remove('active');
    document.getElementById("form-add-attend").reset();


    document.querySelector('.add-success2').style.display = 'block';
    setTimeout(function () {
        document.querySelector('.add-success2').style.display = 'none';

    }, 1000);
    }
});







// hiển thị ra box thêm điểm danh + ngày
function showAddDateDD() {
    var addboxDateDD = document.getElementById('addboxDateDD');
    const boxDateDD = document.getElementById('boxDateDD');
    addboxDateDD.classList.add('active');
    boxDateDD.classList.add('active');

    const closeboxDateDD = document.getElementById('closeboxDateDD');
    closeboxDateDD.addEventListener('click', () => {
        document.getElementById("err-add").textContent = "";
        addboxDateDD.classList.remove('active');
        boxDateDD.classList.remove('active');
    });
}


const submit_discount = document.getElementById('discount');
submit_discount.addEventListener('click', function (event) {

    event.preventDefault();


    const studentRows = document.querySelectorAll('.tr-student');
    if (studentRows.length != 0) {
        const data = [];
        studentRows.forEach(row => {
            const maHS = row.getAttribute('data-maHS');

            const discountInput = row.querySelector('input[name^="discount"]');
            const discountValue = discountInput.value;

            data.push({ MaHS: maHS, DiscountValue: discountValue });
        });


        $.ajax({
            url: '../api/updateDiscount.php',
            type: 'POST',
            data: {
                malop: malop,
                data: JSON.stringify(data),
            },
            success: function (res) {



                jsonListStudents = JSON.parse(res)

                listStudents();
                showStudent();
            },
            error: function (xhr, status, error) {
                console.error(error);
            }
        });


        document.querySelector('.update-success').style.display = 'block';
        setTimeout(function () {
            document.querySelector('.update-success').style.display = 'none';


        }, 1000);
    }

})
var buttonClicked = false;

function addDiscount() {
    buttonClicked = true;
    var container = document.getElementById("addDiscount");
    var card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
		<label class="" id="lbdiscount" style="color:red; font-size:13px ; font-style: italic "></label>
							Thời gian bát đầu : <input type="date" name="startDiscount" id="startDiscount" ><br>
							Thời gian kết thúc: <input type="date" name="endDiscount" id="endDiscount"> <br>
							<input type="text" name="discountpercent" id="discountpercent" placeholder="Nhập % khuyến mại">
                            <label id="lbvv2"></label>
							<button class="delete-button" onclick="deleteDiscount(this)">Xóa khuyến mại :</button>
  `;
    container.appendChild(card);
}

function deleteDiscount(button) {
    buttonClicked = false;
    var index = button.getAttribute("data-index");
    var card = button.parentNode;
    var container = card.parentNode;
    container.removeChild(card);

}


document.getElementById('addStudent-submit').addEventListener('click', function (event) {
    event.preventDefault();


    const selectedValues = Array.from(document.getElementById('select-student').selectedOptions).map(option => option.value);
    if (selectedValues.length == 0) {
        document.getElementById("empty-student").textContent = "Chưa chọn học sinh !";
    } else {
        document.getElementById("empty-student").textContent = "";
        $.ajax({
            url: '../api/addStudentOnClass.php',
            type: 'POST',
            data: {
                malop: malop,
                addstudents: selectedValues,
            },
            success: function (res) {

                listAddStudent = JSON.parse(res).listNo;
                jsonListStudents = JSON.parse(res).listYes;

                listStudents();
                showStudent();
                showDetailClass();
                showLisAttendance();
                showDetailAdttendance();
                showAddAttend();
            },
            error: function (xhr, status, error) {
                console.error(error);
            }
        });


        document.querySelector('.add-success').style.display = 'block';
        setTimeout(function () {
            document.querySelector('.add-success').style.display = 'none';

        }, 1000);

    }



});


function showHideDiv(ele) {
    var srcElement = document.getElementById(ele);
    if (srcElement != null) {
        if (srcElement.style.display == "block") {
            srcElement.style.display = 'none';
            document.getElementById("btn-discount").value = "Thêm khuyến mãi";

        } else {
            srcElement.style.display = 'block';
            document.getElementById("btn-discount").value = "Xóa khuyến mãi";

        }
        return false;
    }
}




// thông báo xóa lớp

document.getElementById('delete').addEventListener('click', function (event) {
    const form = document.getElementById('form_delete')
    event.preventDefault();

    document.querySelector('#modal-ques').style.display = 'block';
    const yesDelete = document.getElementById('yesDelete');
    const noDelete = document.getElementById('noDelete');

    yesDelete.addEventListener('click', function (event) {



        document.querySelector('#modal-ques').style.display = 'none';
        document.querySelector('.delete-success').style.display = 'block';

        $.ajax({
            url: '../api/deleteClass.php',
            type: 'POST',
            data: {
                malop: malop,
            },
            success: function (res) {

            },
            error: function (xhr, status, error) {
                console.error(error);
            }
        });
        document.querySelector(".delete-success").style.display = "block"
        setTimeout(function () {
            window.location.href = '../manage/ListClass.php';
        }, 700);
    });

    noDelete.addEventListener('click', function (event) {
        document.querySelector('#modal-ques').style.display = 'none';
    });
});


// sửa lớp nào
// hiển thị box chính
const openBtn = document.getElementById('open-btn');
const overlay = document.getElementById('overlay');
const box = document.getElementById('box');
const closeBtn = document.getElementById('close-btn');

openBtn.addEventListener('click', () => {
    overlay.classList.add('active');
    box.classList.add('active');
});

closeBtn.addEventListener('click', () => {
    overlay.classList.remove('active');
    box.classList.remove('active');
});


//them, xoa lich hoc
// document.getElementById('btn-add-schedule').addEventListener('click', function (event) {
//         event.preventDefault();
//         var containerDiv = document.getElementById("schedule-container");

//         var html = ''




// });


function addSchedule() {
    let scheduleContainer = document.getElementById('schedule-container');
    let newDiv = document.createElement('div');
    let newSelect = document.createElement('select');

    newSelect.setAttribute('style', 'width: 80% !important; margin-right:5px');
    newSelect.classList.add('w-100', 'mb-2');

    var newOption = document.createElement('option');
    newOption.value = "";
    newOption.text = "Thời gian";
    newSelect.appendChild(newOption);

    listSchedule.forEach(schedule => {
        var newOption = document.createElement('option');
        newOption.value = schedule.MaLich;
        newOption.text = schedule.Ngay + " - " + schedule.TGBatDau + "-" + schedule.TGKetThuc;
        newSelect.appendChild(newOption);
    });


    let newButton = document.createElement('button');
    newButton.id = 'btn-delete-schedule';

    newButton.onclick = function () { deleteSchedule(this); };
    newButton.textContent = 'Xóa';

    newDiv.appendChild(newSelect);
    newDiv.appendChild(newButton);
    scheduleContainer.appendChild(newDiv);

    getSelectedValues();
}

function deleteSchedule(element) {
    let scheduleContainer = document.getElementById('schedule-container');
    scheduleContainer.removeChild(element.parentNode);

    getSelectedValues();
}



document.getElementById("form_edit").addEventListener("submit", function (event) {

    event.preventDefault();

});

function getSelectedValues() {
    let scheduleContainer = document.getElementById('schedule-container');
    let selects = scheduleContainer.querySelectorAll('select');
    let selectedValues = [];
    for (let select of selects) {
        selectedValues.push(select.value);
    }
    
}




// sửa lớp tiếp nào baby

document.getElementById('btn-update').addEventListener('click', function (event) {
    const formUpadte = document.getElementById('form_edit');

    event.preventDefault();
    const classcode = document.getElementById('classcode').value;
    const classname = document.getElementById('classname').value;
    const classAge = document.getElementById('classAge').value;
    const classTimeOpen = document.getElementById('classTimeOpen').value;
    const price = document.getElementById('price').value;
    const numberlessons = document.getElementById('numberlessons').value;
    const students = document.getElementById('students').value;
    const teachers = document.getElementById('teachers').value;
    const TeacherSalarie = document.getElementById('TeacherSalarie').value;
    const condition = document.getElementById('SelectCondition').value;




    var teacherScheduleArray = [];
    var schedules = [];

    let scheduleContainer = document.getElementById('schedule-container');
    let selects = scheduleContainer.querySelectorAll('select');

    for (let select of selects) {
        if (select.value != "") {
            teacherScheduleArray.push({
                idSchedules: select.value,
                MAGV: teachers
            });
            schedules.push(select.value);
        }
    }
    


    // for (let i = 0; i <= 10; i++) {
    //     const element = document.getElementById(`schedules${i}`);
    //     const idSchedules = element ? element.value : "";

    //     if (idSchedules != "") {
    //         teacherScheduleArray.push({
    //             idSchedules: idSchedules,
    //             MAGV: teachers
    //         });
    //         schedules.push(idSchedules);
    //     }

    // }


    var check = false;



    const element_startDiscount = document.getElementById('startDiscount');
    const startDiscount = element_startDiscount ? element_startDiscount.value : "";

    const element_endDiscount = document.getElementById('endDiscount');
    const endDiscount = element_endDiscount ? element_endDiscount.value : "";

    const element_discountpercent = document.getElementById('discountpercent');
    const discountpercent = element_discountpercent ? element_discountpercent.value : "";

    if (startDiscount) {
        if (!startDiscount || !endDiscount || !discountpercent) {
            document.getElementById('lbdiscount').textContent = '*Bạn đang thiếu dữ liệu';
            check = true;
        } else if (startDiscount == endDiscount) {
            document.getElementById('lbdiscount').textContent = '*Lịch trùng nhau';
            check = true;
        }
        else {
            document.getElementById('lbdiscount').textContent = "";
        }
    } else if (buttonClicked) {
        if (!startDiscount || !endDiscount || !discountpercent) {
            document.getElementById('lbdiscount').textContent = '*Bạn đang thiếu dữ liệu';
            check = true;
        } else if (startDiscount == endDiscount) {
            document.getElementById('lbdiscount').textContent = '*Lịch trùng nhau';
            check = true;
        }
        else {
            document.getElementById('lbdiscount').textContent = "";
        }
    }

    // kiểm tra dữ liệu nhập vào
    var erorr_empty = "*Dữ liệu không để trống";
    if (!classcode) {
        document.getElementById('lbclasscode').textContent = erorr_empty;
        check = true;
    } else
        document.getElementById('lbclasscode').textContent = "";

    if (!classname) {
        document.getElementById('lbclassname').textContent = erorr_empty;
        check = true;
    } else
        document.getElementById('lbclassname').textContent = "";

    if (!classAge) {
        document.getElementById('lbclassAge').textContent = erorr_empty;
        check = true;
    } else
        document.getElementById('lbclassAge').textContent = "";

    if (!classTimeOpen) {
        document.getElementById('lbclassTimeOpen').textContent = erorr_empty;
        check = true;
    } else
        document.getElementById('lbclassTimeOpen').textContent = "";

    if (teacherScheduleArray.length == 0) {
        document.getElementById('lbschedules').textContent = '*Chưa có lịch học';
    } else {
        if (checkDuplicateSchedules(teacherScheduleArray)) {
            document.getElementById('lbschedules').textContent = '*Lịch học trùng nhau';
            check = true;
        } else if (hasDuplicateElements(teacherScheduleArray, listtimeTeacher)) {
            document.getElementById('lbschedules').textContent = '*Lịch học của giáo viên đã tồn tại ';
            check = true;
        } else {
            document.getElementById('lbschedules').textContent = "";
        }
    }

    if (!price) {
        document.getElementById('lbprice').textContent = erorr_empty;
        check = true;
    } else
        document.getElementById('lbprice').textContent = "";

    if (!numberlessons) {
        document.getElementById('lbnumberlessons').textContent = erorr_empty;
        check = true;
    } else
        document.getElementById('lbnumberlessons').textContent = "";
    if (!students) {
        document.getElementById('lbstudents').textContent = erorr_empty;
        check = true;
    } else
        document.getElementById('lbstudents').textContent = "";

    if (!teachers) {
        document.getElementById('lbteacher').textContent = erorr_empty;
        check = true;
    } else
        document.getElementById('lbteacher').textContent = "";

    if (!TeacherSalarie) {
        document.getElementById('lbTeacherSalarie').textContent = erorr_empty;
        check = true;
    } else
        document.getElementById('lbTeacherSalarie').textContent = "";

    if (check) {
        return;
    }



    const data = {
        classcode: classcode,
        classname: classname,
        classAge: classAge,
        classTimeOpen: classTimeOpen,
        SelectCondition: condition,
        price: price,
        numberlessons: numberlessons,
        students: students,
        teachers: teachers,
        TeacherSalarie: TeacherSalarie,
        startDiscount: startDiscount,
        endDiscount: endDiscount,
        discountpercent: discountpercent,

    };
    const compressedData = JSON.stringify(data);

    $.ajax({
        url: '../api/updateClass.php',
        type: 'POST',
        data: {
            compressedData: compressedData,
            schedules: schedules,
        },
        success: function (res) {
           
            showDetailClass();
            showEditClass();

        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });

    document.querySelector('.update-success').style.display = 'block';
    document.querySelector('#overlay').style.position = 'fixed';

    setTimeout(function () {
        document.querySelector('.update-success').style.display = 'none';
    }, 1500);
});

// cap nhat diem danh



function checkDuplicateSchedules(scheduleArray) {
    const idSet = new Set();

    for (const schedule of scheduleArray) {
        if (idSet.has(schedule.idSchedules)) {

            return true;
        } else {
            idSet.add(schedule.idSchedules);
        }
    }
    return false;
}

function hasDuplicateElements(arr1, arr2) {
    for (let i = 0; i < arr1.length; i++) {
        for (let j = 0; j < arr2.length; j++) {

            if (arr1[i].MAGV == arr2[j].MAGV && arr1[i].idSchedules == arr2[j].MaLich) {


                return true;
            }
        }
    }
    return false;
}






// hiện thêm học sinh
const openBtnaddtudents = document.getElementById('addStudent');
const overlayaddStudent = document.getElementById('overlay-addStudent');
const boxaddStudent = document.getElementById('box-addStudent');
const closebtnstudents = document.getElementById('close-btn-addStudent');
openBtnaddtudents.addEventListener('click', () => {
    overlayaddStudent.classList.add('active');
    boxaddStudent.classList.add('active');
});
closebtnstudents.addEventListener('click', () => {
    document.getElementById("empty-student").textContent = "";
    overlayaddStudent.classList.remove('active');
    boxaddStudent.classList.remove('active');
    
});


// //hiện danh boxStudents
// const openBtnlistStudents = document.getElementById('opten-listStudents');
// const overlayStudent = document.getElementById('overlayStudent');
// const boxStudent = document.getElementById('boxStudent');
// const closebtnstudents = document.getElementById('closebtnstudents');

// openBtnlistStudents.addEventListener('click', () => {
//     overlayStudent.classList.add('active');
//     boxStudent.classList.add('active');
// });

// closebtnstudents.addEventListener('click', () => {
//     overlayStudent.classList.remove('active');
//     boxStudent.classList.remove('active');
// });

// // hiện boxAttendance điểm danh

// const openBtnlistAttendance = document.getElementById('opten-listAttendance');
// const overlayAttendance = document.getElementById('overlayAttendance');
// const boxAttendance = document.getElementById('boxAttendance');
// const closebtnAttendance = document.getElementById('closebtnAttendance');

// openBtnlistAttendance.addEventListener('click', () => {
//     overlayAttendance.classList.add('active');
//     boxAttendance.classList.add('active');
// });

// closebtnAttendance.addEventListener('click', () => {
//     overlayAttendance.classList.remove('active');
//     boxAttendance.classList.remove('active');
// });


// thêm dấu phẩy nhé
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function convertDateFormat(dateString) {
    var dateParts = dateString.split("-");
    var formattedDate = dateParts[2] + "-" + dateParts[1] + "-" + dateParts[0];
    return formattedDate;
}