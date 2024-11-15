const ServerUrl = "https://english-center-backend.vercel.app";
const ClassStatus = {
    UnOpen: 1,
    Opening: 2,
    Finish: 3,
    Disable: 4
}
var counter = 0;
var $ = document.querySelector.bind(document)
var $$ = document.querySelectorAll.bind(document)
const accessToken = localStorage.getItem("accessToken");

function showSpinner() {
    document.getElementById("loadingSpinner").style.display = "flex";
}
  
function hideSpinner() {
    document.getElementById("loadingSpinner").style.display = "none";
}
const queryStr = window.location.search;
const urlParams = new URLSearchParams(queryStr);
const classId = parseInt(urlParams.get('id'));

var currentScheduleIds = [];
var teachersSearch = [];
var centerSearch = [];
var programSearch = [];
var studentSearch = [];
var classStudents = [];
var classAttendances = [];
var classInfo = {}
var teacher = {};

//format
const formatDate = (date) => {
    return date.split("T")[0]
}

function formatCash(str) {
    return str.split('').reverse().reduce((prev, next, index) => {
        return ((index % 3) ? next : (next + ',')) + prev
    })
}

const getClassDetail = async (id) => {
    showSpinner();
    try {
        let queryConds = {
            includeSchedule: true,
            includeCenter: true,
            includeProgram:true,
            includeTeacher: true,
            includeStudent: true
        }
        let query = `${ServerUrl}/api/class/${id}?${new URLSearchParams(queryConds).toString()}`;
        let resp = await fetch(query, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            }
        });
        if(resp.status != 200) throw resp.error;
        let data = await resp.json();
        console.log("Data", data);
        classInfo = {...data};
        $("#detail-class-h1").innerHTML = `Thông tin chi tiết lớp ${data.code}`;
        $(".detai_code").innerHTML = `${data.code}`;
        $(".detai_name").innerHTML = data.name;
        $(".detai_fromAge").innerHTML = data.fromAge;
        $(".detai_startAt").innerHTML = formatDate(data.startAt);
        $(".detai_schedule").innerHTML = `${(data.schedules || [])?.map(sche => `
            <div> ${sche.dayLabel || ""} - ${sche.startAt || ""} - ${sche.endAt || ""} </div>
        `)}`;
        $(".detai_fee").innerHTML =  formatCash((data.fee || 0)?.toString()) + " vnd";
        $(".detai_total_session_used").innerHTML = data.teachedSession;
        $(".detai_total_session").innerHTML = data.totalSession;
        $(".detai_quantity").innerHTML = data.studentQuantity;
        $(".detai_max_quan").innerHTML = data.maxQuantity;
        $(".detai_teacherName").innerHTML = data.teachers[0]?.name || "";
        $(".detai_salary").innerHTML = formatCash(data.teachers[0]?.TeacherClasses?.salary?.toString() || "") + " vnd";
        $(".detai_program").innerHTML = (data?.program?.reducePercent || 0) + "%";
        $(".detai_center").innerHTML = (data?.center?.name || "");
        classStudents = [...data.students];
        await updateDataDialog(data);
        await updateStudentList(data);
        $("#attendance_title").innerHTML = `Quản lý điểm danh lớp ${data.code}`;
        currentScheduleIds = [...new Set(data.schedules.map(item => item.id))];
        counter = data?.schedules?.length || 0;
        teacher = {...(data?.teachers[0] || {})};
        hideSpinner();
    }
    catch (err) {
        console.error("api error", err);
        hideSpinner();
    }
}

const init = async () => {
    try {
        await setupCenter();
        await setupSchedule();
        await setupTeacher();
        await setupProgram();
        await setupStudents();
    }
    catch (err) {
        console.error(err);
    }
}

const build = (data) => {
    return `

    `
}

const openBtn = document.getElementById('open-btn-edit');
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

    const setupTeacher = async () => {
        try {
            
            let resp = await fetch(`${ServerUrl}/api/search-teacher`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            let teachers = await resp.json();
            teachersSearch = [...teachers];
        }
        catch (err) {
            console.error(err);
        }
    }
    
    const setupCenter = async () => {
        try {
            let resp = await fetch(`${ServerUrl}/api/search-center`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            let centers = await resp.json();
            centerSearch = [...centers];
        }
        catch (err) {
            console.error(err);
        }
    }
var listSchedules = [];   
    const setupSchedule = async (currentIds) => {
        try {
            let resp = await fetch(`${ServerUrl}/api/schedules`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            let schedules = await resp.json();
            console.log("sche", schedules);
            let data = (el) => (schedules.docs || [])?.map(item => {
                return `<option ${el === item.id ? "selected" : ""} value="${item.id}">${item.dayLabel} - ${item.startAt} - ${item.endAt}</option>`
            });
            console.log(data);
            listSchedules = [...schedules.docs];
            // let uScheduleSelects = document.querySelectorAll(".uScheduleSelect");
            // let index = 0;
            // for(let item of uScheduleSelects) {
            //     console.log("item", item);
            //     item.innerHTML = `<option value="0">Chọn trung tâm</option>` + data(currentIds[index]);
            //     index++;
            // }
        }
        catch (err) {
            console.error(err);
        }
    }
    
    const setupProgram = async (data) => {
        try {
            let resp = await fetch(`${ServerUrl}/api/programs`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            let programs = await resp.json();
            let data = (programs.docs || [])?.map(item => {
                return `<option value="${item.id}">${item.reducePercent}% - ${formatDate(item.startAt)} - ${formatDate(item.endAt)}</option>`
            });
            console.log(data);
            programSearch = [...programs.docs];
            // let uScheduleSelects = document.querySelectorAll(".uScheduleSelect");
            // for(let item of uScheduleSelects) {
            //     console.log("item", item);
            //     item.innerHTML = `<option value="0">Chọn trung tâm</option>` + data;
            // }
        }
        catch (err) {
            console.error(err);
        }
    }

    const setupStudents = async () => {
        try {
            let resp = await fetch(`${ServerUrl}/api/search-student`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            console.log("resp", resp);
            let students = await resp.json();
            let data = (students || [])?.map(item => {
                return `<option value="${item.id}">${item.name}</option>`
            });
            studentSearch = [...students];
            $("#select-student-add-list").innerHTML = `<option value="">Chọn học sinh</option>` + data;
            
        }
        catch (err) {
            console.error(err);
        }
    }

const addCard = async () => {
    var container = document.getElementById("updateScheduleDetails");
		var card = document.createElement("div");
		card.className = "card";
		card.style.width = "100%";
		card.style.display ="flex";
		card.style.flexDirection = "row";
		card.style.border = "unset";
		card.style.marginTop = "5px";
		card.innerHTML = `
  		<select style='width: 70%; margin-right:5px' name="schedules${counter}" id="schedules${counter}" class="uScheduleSelect">
          <option value="">Thời gian</option>
                    ${listSchedules.map(el => `<option value="${el.id}">${el.dayLabel} - ${el.startAt} - ${el.endAt}</option>`).join("")}
        </select>
        <button class="delete-button" data-index="${counter}" onclick="deleteCard(this)">Xóa</button>
  `;
		container.appendChild(card);
		counter++; // Tăng giá trị của biến đếm
        await setupSchedule(currentScheduleIds);
}

function deleteCard(button) {
    var index = button.getAttribute("data-index");
    var card = button.parentNode;
    var container = card.parentNode;
    container.removeChild(card);

    // Cập nhật giá trị biến đếm
    counter--;

    // Cập nhật thuộc tính name của các thẻ select
    var cards = container.getElementsByClassName("card");
    for (var i = 0; i < cards.length; i++) {
        var select = cards[i].querySelector("select");
        select.setAttribute("name", "schedules" + (i + 1));
    }
}

const updateDataDialog = async (data) => {
    try {
        $("#detail_u_code_value").value = data.code;
        $("#detail_u_name_value").value = data.name;
        $("#detail_u_fromAge_value").value = data.fromAge;
        // $("#detail_u_toAge_value").value = data.toAge;
        $("#detail_u_fee_value").value = data.fee;
        $("#detail_u_startAt_value").value = formatDate(data.startAt);
        // $("#detail_u_endAt_value").value = formatDate(data.endAt);
        let index = 0;
        textHtml = "";
        firstHtml = "";
        console.log("schedules of data", data.schedules);
        for(let item of data.schedules || []) {
            if(index) {
                textHtml += `<div style="width:100%;display:flex;flex-direction:row;border:unset;margin-top:5px;"><br><select style="width: 70%;" name="schedules${index}" id="detail_u_schedule_value"
                    class="uScheduleSelect">
                    <option value="">Thời gian</option>
                    ${listSchedules.map(el => `<option ${el.id === item.id ? "selected" : ""} value="${el.id}">${el.dayLabel} - ${el.startAt} - ${el.endAt}</option>`).join("")}
                </select>
                <button class="delete-button" data-index="${index}" onclick="deleteCard(this)">Xóa</button></div>`
            }
            else {
                firstHtml += `
                <option value="">Thời gian</option>
                ${listSchedules.map(el => `<option ${el.id === item.id ? "selected" : ""} value="${el.id}">${el.dayLabel} - ${el.startAt} - ${el.endAt}</option>`).join("")}
                <button class="delete-button" data-index="${index}" onclick="deleteCard(this)">Xóa</button>
                `
            }
            index++;
        }
        if(!data.schedules?.length) {
            firstHtml += `
                <option value="">Thời gian</option>
                ${listSchedules.map(el => `<option value="${el.id}">${el.dayLabel} - ${el.startAt} - ${el.endAt}</option>`).join("")}
                <button class="delete-button" data-index="${index}" onclick="deleteCard(this)">Xóa</button>
                `
        }
        $("#detail_u_schedule_value_1").innerHTML = firstHtml;
        $("#updateScheduleDetails").innerHTML = textHtml;
        $("#detail_u_totalSession_value").value = data.totalSession;
        $("#detail_u_maxStudent_value").value = data.maxQuantity;
        let curTeacher = teachersSearch.find(item => item.id === data?.teachers[0]?.id);
        let teacherSeletHtml = "";
        if(curTeacher) {
            for(let item of teachersSearch) {
                teacherSeletHtml += `<option ${item.id === curTeacher?.id ? "selected" : ""} value=${item.id}>${item.name}</option>`;
            }
        }
        else {
            for(let item of teachersSearch) {
                teacherSeletHtml += `<option value=${item.id}>${item.name}</option>`;
            }
        }
        $("#detail_u_teacher_value").innerHTML = `<option value="">Tên giáo viên</option>` + teacherSeletHtml;
        $("#detail_u_salary_value").value = data.teachers?.[0]?.TeacherClasses?.salary || "";

        let statusHtml = `
            <option ${data.status === 1 ? "selected": ""} value="1">Chưa mở</option>
            <option ${data.status === 2 ? "selected": ""} value="2">Đang mở</option>
            <option ${data.status === 3 ? "selected": ""} value="3">Đã đóng</option>
        `
        $("#detail_u_status_value").innerHTML = statusHtml;

        let curCenter = centerSearch.find(item => item.id === data?.center?.id);
        let centerSelectHtml = "";
        if(curCenter) {
            for(let item of centerSearch) {
                centerSelectHtml += `<option ${item.id === curCenter?.id ? "selected" : ""} value=${item.id}>${item.name}</option>`;
            }
        }
        else {
            for(let item of centerSearch) {
                centerSelectHtml += `<option value=${item.id}>${item.name}</option>`;
            }
        }
        $("#detail_u_center_value").innerHTML = `<option value="">Tên Trung tâm</option>` + centerSelectHtml;
        console.log("search", programSearch);
        let curProgram = programSearch.find(item => item.id === data?.program?.id);
        console.log("search", curProgram);
        
        let programSelectHtml = "";
        if(curProgram) {
            for(let item of programSearch) {
                programSelectHtml += `<option ${item.id === curProgram?.id ? "selected" : ""} value=${item.id}>${item.reducePercent}% - ${formatDate(item.startAt)} - ${formatDate(item.endAt)}</option>`;
            }
        }
        else {
            for(let item of programSearch) {
                programSelectHtml += `<option value=${item.id}>${item.reducePercent}% - ${formatDate(item.startAt)} - ${formatDate(item.endAt)}</option>`;
            }
        }
        console.log("search", programSelectHtml);

        $("#detail_u_proggram_value").innerHTML = `<option value="0">Chọn Chương trình giảm giá</option>` + programSelectHtml;
    }
    catch (err) {
        console.error(err);
    }
}

//delete
$(".delete_detail_class_btn").addEventListener("click", () => {
    openConfirmDialog(
        {
            content: "Xác nhận xoá lớp này, các dữ liệu liên quan sẽ bị xóa"
        },
        "confirm",
        "",        
        () => {
            closeConfirmDialog();
            classDelete();
        }
    )
})

const classDelete = async () => {
    try {
        showSpinner();
        let query = `${ServerUrl}/api/class/${classId}`;
        let resp = await fetch(query, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });
        if(resp.status != 200) {
            await openErrorDialog(resp);
            throw resp;
        }
        closeConfirmDialog();
        hideSpinner();
        openConfirmDialog(
            {
                title: "Thành công",
                content: "Lớp đã được hủy kích hoạt"
            },
            "confirm",
            "sucess",
            ()=> {
                window.location.href = './manageClass.html';
            }
        );
    }
    catch (err) {
        console.error(err);
        hideSpinner();
    }
}

//ds hoc sinh

const updateStudentList = async (data) => {
    console.log("upd");
    $("#student-list-title").innerHTML = "Danh sách học sinh lớp " + data.code;
    let rowHtml = (el, data, index) =>`
        <tr class="tr-student" data-mahs=${el.id}>
                                            <td>${(index + 1) || ""}</td>
                                            <td>${el.id}</td>
                                            <td>${el.name}</td>
                                            <td>${formatDate(el.birthday)}</td>
                                            <td>${el.gender === 1 ? "Nam" : "Nữ"}</td>
                                            <td>${el.address || ""}</td>
                                            <td>${el.phone || ""}</td>
                                            <td>${el.joinCount} / ${data.totalSession}</td>
                                            <td>${el?.StudentClasses?.reducePercent + "%"}</td>
                                            <td>
                                            <button id="update-reduce-student-btn" onclick="onOpenReduceBox(${el?.StudentClasses?.reducePercent},${el?.id})">Cập nhật giảm giá</button>
                                            <button id="remove-student-btn" onclick="onRemoveStudent(${el.id})">Xóa</button>
                                            </td>
    `
    let tableHtml = data.students?.map((item, index) => rowHtml(item, data, index)).join("");
    $("#tbody-student").innerHTML = tableHtml;
}
//add btn
const openBtnaddtudents = document.getElementById('addStudent');
const overlayaddStudent = document.getElementById('overlay-addStudent');
const boxaddStudent = document.getElementById('box-addStudent');
const closebtnstudents = document.getElementById('close-btn-addStudent');
openBtnaddtudents.addEventListener('click', () => {
    overlayaddStudent.classList.add('active');
    boxaddStudent.classList.add('active');
});
closebtnstudents.addEventListener('click', () => {
    overlayaddStudent.classList.remove('active');
    boxaddStudent.classList.remove('active'); 
});

const onOpenReduceBox = (value, id)=> {
    $("#overlay-edit-program").classList.add('active');
    $("#box-edit-program").classList.add('active');
    $("#edit-student-program").value = value || 0;
    $("#edit-student-submit").addEventListener("click", ()=>{
        onUpdateReduce($("#edit-student-program").value,id)
    })
}

$("#close-btn-edit-program").addEventListener("click", ()=>{
    $("#overlay-edit-program").classList.remove('active');
    $("#box-edit-program").classList.remove('active');
})

//diem danh

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

const getAttendances = async () => {
    try {
        let queryConds = {
            classId
        }
        let query = `${ServerUrl}/api/attendances?${new URLSearchParams(queryConds).toString()}`;
        let resp = await fetch(query, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            }
        });
        if(resp.status != 200) throw resp.error;
        let data = await resp.json();
        classAttendances = [...data];
        updateAttendancePage(data);
    }
    catch (err) {
        console.error(err);
    }
}

const updateAttendancePage = (data) => {
    let rowHtml = (el, index) =>`
        <tr onclick="showDetails(${el.id})">
        <td>${index}</td>
        <td>${formatDate(el.date)}</td>
        <td>${el?.studentIds?.length || 0} / ${classInfo.studentQuantity}</td>
    </tr>
    `
    let tableHtml = data?.map((item, index) => rowHtml(item,index+1)).join("");
    $("#listdday").innerHTML = tableHtml;
    //add form
    let rowHtmladd = (data, index, studentIds = []) => `
    <tr>
        <td>${index}</td>
        <td>${data.id}</td>
        <td>${data.name}</td>
        <td style="text-align: center;">
            <input type="checkbox" class="checkbox-add" id=${data.id} name="editdd48"}>
        </td>
    </tr>`

    let rawHtml = classStudents.map((item,i) => rowHtmladd(item, i+1, data.studentIds)).join("");
    $("#tbody-addAttend").innerHTML = rawHtml;
}
$("#closebtnboxTime-attendance").addEventListener("click", ()=> {
    $(".detailTimeAttendance").classList.remove("active");
    $("#div-detail").classList.remove("active");
})
var curAttendanceId = 0;
const showDetails = (id) => {
    let data = classAttendances.find(item => item.id === id);
    $(".detailTimeAttendance").classList.add("active");
    $("#div-detail").classList.add("active");

    let rowHtml = (data, index, studentIds = []) => `
    <tr>
        <td>${index}</td>
        <td>${data.id}</td>
        <td>${data.name}</td>
        <td style="text-align: center;">
            <input type="checkbox" class="checkbox-update" id=${data.id} name="editdd48" ${studentIds.includes(data.id) ? "checked" : ""}>
        </td>
    </tr>`

    let rawHtml = classStudents.map((item,i) => rowHtml(item, i+1, data.studentIds)).join("");
    $("#detail-atten-table").innerHTML = rawHtml;
    console.log("data.date",formatDate(data.date))
    $("#attendance-time-select").value = (formatDate(data.date));
    curAttendanceId = id;
}



//run 
const run = async (classId, notInIt) => {
    try {
        showSpinner();
        if(!notInIt) {
            await init();
        }
        await getClassDetail(classId);
        await getAttendances();
        hideSpinner();
    }
    catch (err) {
        console.error(err);
        hideSpinner();
    }
}
run(classId);


const onReload = async () => {
    await run(classId, true);
    // await getAttendances();
}

const onDelete = () => {

}

$("#update-class-btn").addEventListener("click", async ()=>{
    await onUpdateClass();
})

const onUpdateClass = async () => {

    try {
        let code = $("#detail_u_code_value").value
        let name = $("#detail_u_name_value").value
        let fromAge = $("#detail_u_fromAge_value").value
        // let toAge = $("#detail_u_toAge_value").value
        let startAt = $("#detail_u_startAt_value").value
        // let endAt = $("#detail_u_endAt_value").value
        let fee = $("#detail_u_fee_value").value
        let totalSession = $("#detail_u_totalSession_value").value
        let maxQuantity = $("#detail_u_maxStudent_value").value
        let teacherId = $("#detail_u_teacher_value").value
        let salary = $("#detail_u_salary_value").value
        let programId =  $("#detail_u_proggram_value").value
        let status = $("#detail_u_status_value").value;
        let centerId = $("#detail_u_center_value").value;
    
        let body = {
            code,
            name,
            fromAge,
            // toAge,
            startAt,
            // endAt,
            fee,
            totalSession,
            maxQuantity,
            status,
            programId,
            centerId
        }
    
        console.log("body === ", body);
        showSpinner();
        let classQuery = `${ServerUrl}/api/class/${classId}`;
            let resp = await fetch(classQuery, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(body)
            });
        if(resp.status != 200) {
            await openErrorDialog(resp);
            throw resp;
        }

        if(teacher.id != teacherId) {
            let updTeacherQuery = `${ServerUrl}/api/update-teacher-to-class`;
            let resp = await fetch(updTeacherQuery, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(
                    {
                        classId: classId,
                        teacherId: teacherId,
                        salary: salary
                    }
                )
            });
            if(resp.status != 200) {
                await openErrorDialog(resp);
                throw resp;
            }
        }
        let scheduleEls = document.querySelectorAll(".uScheduleSelect");
        console.log("schedules before", scheduleEls);
        let schedules = [];
        for(let item of scheduleEls) {
            if(!item || !Number.isInteger(item)) continue;
            console.log("item", item.value);
            schedules.push(item.value)
        }
        let updSchedule = `${ServerUrl}/api/update-bulk-schedule`;
        let resp1 = await fetch(updSchedule, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(
                {
                    classId: classId,
                    scheduleIds: schedules
                }
            )
        });
        if(resp1.status != 200) {
            await openErrorDialog(resp1);
            throw resp1;
        }    
        
        await onReload();
        overlay.classList.remove('active');
		box.classList.remove('active');
        hideSpinner();
    }
    catch (err) {
        console.error(err);
        hideSpinner();
    }

}

$(".student-add-to-class-btn").addEventListener("click", async ()=> {
    console.log("clicked")
    await onAddStudent($("#select-student-add-list").value);
})

const onAddStudent = async (studentId) => {
    try {
        console.log("studentId", studentId)
        if(!studentId) return;
        showSpinner();
        let classQuery = `${ServerUrl}/api/register-by-admin`;
            let resp = await fetch(classQuery, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    studentId,
                    classId
                })
            });
        if(resp.status != 200) {
            await openErrorDialog(resp);
            throw resp;
        }


        await onReload();
        overlayaddStudent.classList.remove('active');
        boxaddStudent.classList.remove('active');
        $("#select-student-add-list").value = "";
        hideSpinner();
    }
    catch (err) {
        console.error(err);
        hideSpinner();
    }
}

const onRemoveStudent = async (studentId) => {
    try {
        if(!studentId) return;
        showSpinner();
        let classQuery = `${ServerUrl}/api/unregister-by-admin`;
            let resp = await fetch(classQuery, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    studentId,
                    classId
                })
            });
            if(resp.status != 200) {
                await openErrorDialog(resp);
                throw resp;
            }

        await onReload();
        hideSpinner();
    }
    catch (err) {
        console.error(err);
        hideSpinner();
    }
}

const onUpdateReduce = async (value, id) => {
    try {
        if(!id) return;
        showSpinner();
        let classQuery = `${ServerUrl}/api/student-reduce-value`;
            let resp = await fetch(classQuery, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    studentId: id,
                    classId,
                    reducePercent: parseFloat(value)
                })
            });
            if(resp.status != 200) {
                await openErrorDialog(resp);
                throw resp;
            }

        await onReload();
        $("#overlay-edit-program").classList.remove('active');
        $("#box-edit-program").classList.remove('active');
        hideSpinner();
    }
    catch (err) {
        console.error(err);
        hideSpinner();
    }
}

$("#btn-add-attend").addEventListener("click", async ()=>{
    await onCreateAttendance();
})
const onCreateAttendance = async () => {
    try {
        let studentChecker = $$(".checkbox-add");
        console.log("ssss", studentChecker);
        let timer = $("#addTime");
        let studentIds = [];
        studentChecker?.forEach(item => {
            if(item.checked) {
                console.log(item.id);
                studentIds.push(item.id);
            }
        });
        studentIds = [... new Set(studentIds)];
        console.log("studentIds", studentIds);
        showSpinner();
        let classQuery = `${ServerUrl}/api/attendance`;
            let resp = await fetch(classQuery, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    date: new Date(timer.value),
                    classId,
                    studentIds: studentIds
                })
            });
            if(resp.status != 200) {
                await openErrorDialog(resp);
                throw resp;
            }

        await onReload();
        document.getElementById("err-add").textContent = "";
        addboxDateDD.classList.remove('active');
        boxDateDD.classList.remove('active');
        hideSpinner();
    }
    catch (err) {
        console.error(err);
        hideSpinner();
    }
}

$("#confirm-update-attendance").addEventListener("click", async ()=> {
    await onUpdateAttendance(curAttendanceId);
})

const onUpdateAttendance = async (id) => {
    try {
        if(!id) return;
        let studentChecker = $$(".checkbox-update");
        let timer = $("#attendance-time-select").value;
        let studentIds = [];
        studentChecker?.forEach(item => {
            if(item.checked) {
                console.log(item.id);
                studentIds.push(item.id);
            }
        });
        studentIds = [... new Set(studentIds)];
        console.log("studentIds", studentIds);
        showSpinner();
        let classQuery = `${ServerUrl}/api/attendance/${id}`;
            let resp = await fetch(classQuery, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    date: new Date(timer),
                    classId,
                    studentIds: studentIds
                })
            });
            if(resp.status != 200) {
                await openErrorDialog(resp);
                throw resp;
            }

        await onReload();
        $(".detailTimeAttendance").classList.remove("active");
        $("#div-detail").classList.remove("active");
        hideSpinner();
    }
    catch (err) {
        console.error(err);
        hideSpinner();
    }
}

$("#delete-update-attendance").addEventListener("click", async ()=> {
    await onDeleteAttendance(curAttendanceId);
})

const onDeleteAttendance = async (id) => {
    try {
        if(!id) return;
        showSpinner();
        let classQuery = `${ServerUrl}/api/attendance/${id}`;
            let resp = await fetch(classQuery, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            });
        if(resp.status != 200) {
            await openErrorDialog(resp);
            throw resp;
        }

        await onReload();
        $(".detailTimeAttendance").classList.remove("active");
        $("#div-detail").classList.remove("active");
        hideSpinner();
    }
    catch (err) {
        console.error(err);
        hideSpinner();
    }
}

const openErrorDialog = async (resp) => {
    try {
        let json = await resp.json();
        console.log("json", json.message);
        openConfirmDialog(
            {
                title: "Đã có lỗi xảy ra",
                content: json?.message || "Đã có lỗi xảy ra"
            },
            ""
        )
    }
    catch (err) {
        console.error(err);
    }
}

/// tạo mới lịch + giảm giá
const scheCreDialog = document.getElementById('schedule-create-dialog');
const progCreDialog = document.getElementById('program-create-dialog');
$(".program-btn-create").addEventListener("click", ()=> {
    console.log("click");
    progCreDialog.classList.add('open-create-dialog');
})

$(".schedule-btn-create").addEventListener("click", ()=> {
    scheCreDialog.classList.add('open-create-dialog');
})

const onCloseCreateDialog = () => {
    scheCreDialog.classList.remove("open-create-dialog");
    progCreDialog.classList.remove("open-create-dialog");
}

$("#program-create-confirm-btn").addEventListener("click", async ()=> {
    await onCreateProgram();
})

$("#schedule-create-confirm-btn").addEventListener("click", async ()=> {
    await onCreateSchedule();
})

const onCreateSchedule = async () => {
    try {
        let date = $("#create-schedule-date").value;
        let startAt = $("#create-schedule-startAt").value;
        let endAt = $("#create-schedule-endAt").value;

        showSpinner();
        let query = `${ServerUrl}/api/schedule`;
            let resp = await fetch(query, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    date: date,
                    startAt,
                    endAt: endAt
                })
            });
        if(resp.status != 200) {
            await openErrorDialog(resp);
            throw resp;
        }
        await setupSchedule();
        let index = 0;
        textHtml = "";
        firstHtml = "";
        let scheduleEls = document.querySelectorAll(".uScheduleSelect");
        console.log("schedules before", scheduleEls);
        let schedules = [];
        for(let item of scheduleEls) {
            console.log("item", item.value);
            schedules.push({
                id: item.value
            })
        }
        console.log("schedules after", schedules);
        for(let item of schedules || []) {
            if(index) {
                textHtml += `<div style="width:100%;display:flex;flex-direction:row;border:unset;margin-top:5px;"><br><select style="width: 70%;" name="schedules${index}" id="detail_u_schedule_value"
                    class="uScheduleSelect">
                    <option value="">Thời gian</option>
                    ${listSchedules.map(el => `<option ${el.id == item.id ? "selected" : ""} value="${el.id}">${el.dayLabel} - ${el.startAt} - ${el.endAt}</option>`).join("")}
                </select>
                <button class="delete-button" data-index="${index}" onclick="deleteCard(this)">Xóa</button></div>`
            }
            else {
                firstHtml += `
                <option value="">Thời gian</option>
                ${listSchedules.map(el => `<option ${el.id == item.id ? "selected" : ""} value="${el.id}">${el.dayLabel} - ${el.startAt} - ${el.endAt}</option>`).join("")}
                <button class="delete-button" data-index="${index}" onclick="deleteCard(this)">Xóa</button>
                `
            }
            index++;
        }
        $("#detail_u_schedule_value_1").innerHTML = firstHtml;
        $("#updateScheduleDetails").innerHTML = textHtml;

        onCloseCreateDialog();
        hideSpinner();
    }
    catch (err) {
        console.error(err);
        hideSpinner();
    }
}

const onCreateProgram = async () => {
    try {
        let reducePercent = $("#create-program-percent").value;
        let startAt = $("#create-program-startAt").value;
        let endAt = $("#create-program-endAt").value;

        showSpinner();
        let query = `${ServerUrl}/api/program`;
            let resp = await fetch(query, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    reducePercent,
                    startAt,
                    endAt,
                    status: 1
                })
            });
        if(resp.status != 200) {
            await openErrorDialog(resp);
            throw resp;
        }
        await setupProgram();
        let programId = $("#detail_u_proggram_value").value;
        let curProgram = programSearch.find(item => item.id == programId);
        
        let programSelectHtml = "";
        if(curProgram) {
            for(let item of programSearch) {
                programSelectHtml += `<option ${item.id === curProgram?.id ? "selected" : ""} value=${item.id}>${item.reducePercent}% - ${formatDate(item.startAt)} - ${formatDate(item.endAt)}</option>`;
            }
        }
        else {
            for(let item of programSearch) {
                programSelectHtml += `<option value=${item.id}>${item.reducePercent}% - ${formatDate(item.startAt)} - ${formatDate(item.endAt)}</option>`;
            }
        }
        console.log("search", programSelectHtml);

        $("#detail_u_proggram_value").innerHTML = `<option value="0">Chọn Chương trình giảm giá</option>` + programSelectHtml;

        onCloseCreateDialog();
        hideSpinner();
    }
    catch (err) {
        console.error(err);
        hideSpinner();
    }
}