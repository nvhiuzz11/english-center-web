const ServerUrl = "https://english-center-backend.vercel.app";
const ClassStatus = {
    UnOpen: 1,
    Opening: 2,
    Finish: 3,
    Disable: 4
}
const accessToken = localStorage.getItem("accessToken");

const formatDate = (date) => {
    return date.split("T")[0]
}

function showSpinner() {
    document.getElementById("loadingSpinner").style.display = "flex";
}
  
function hideSpinner() {
    document.getElementById("loadingSpinner").style.display = "none";
}
//query class list
let classCode = "";
var classStatus = 0;
const getClasses = async ({classCode, classStatus, centerId} = {}) => {
    showSpinner();
    console.log("classStatus", classStatus);
    console.log("classcode", classCode);
    console.log("centerId", centerId)
    let conds = {
        page: 1,
        perPage: 50,
        includeStudent: true,
        includeProgram: true,
        includeTeacher: true,
        includeCenter: true,
        includeSchedule: true,
        active: true
    };
    if(classCode && classCode.length) {
        conds = {
            ...conds,
            code: String(classCode)
        }
    }
    if(classStatus) {
        conds = {
            ...conds,
            status: classStatus
        }
    }
    if(centerId) {
        conds = {
            ...conds,
            centerId: centerId
        }
    }
    try {
        let query = `${ServerUrl}/api/class?${new URLSearchParams(conds).toString()}`;
        let resp = await fetch(query, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            }
        });
        if(resp.status != 200) throw resp.error;
        let data = await resp.json();
        let htmlText = buildList(data.docs);
        document.getElementById("classes-container").innerHTML = htmlText;
        resetAddInput();
        hideSpinner();
    }
    catch (err) {
        console.error("api error", err);
        hideSpinner();
    }
}

const buildList = (data) => 
    data.map(item => `
        <div class='classList-item-container'>
            <div>
                <div class='class-code${item.status === ClassStatus.Opening ? "1" : (item.status === ClassStatus.Finish ? "2" : "Off")}'>
                    ${item.code || ""}
                </div>
                <div class='info'>
                    <h2>
                        ${item.name || ""}
                    </h2>
                    <p>Giảng viên:
                        ${item.teachers[0]?.name || ""}
                    </p>
                    <div class='column'>
                        <p>Lịch học:
                        </p>
                        <div class='center'>
                            ${(item.schedules || [])?.map(sche => `
                                    <div> ${sche.dayLabel || ""} - ${formatDate(sche.startAt) || ""} - ${formatDate(sche.endAt) || ""} </div>
                                `)}
                        </div>
                    </div>

                    <p>Lứa tuổi:
                        ${item.fromAge}
                    </p>
                    <p>Số lượng học sinh:
                        ${item.studentQuantity || 0} / ${item.maxQuantity || 0}
                    </p>
                </div>
            </div>
            <div class='details detail-class-list'>
                <button onclick="changeDetailPath(${item.id})">Xem chi tiết</button>
            </div>
        </div>
        `).join("");

const changeDetailPath = (id) => {
    window.location.href = `./manageDetailClass.html?id=${id}`;
}

const getDetailClass = async (id) => {
    try {
        showSpinner();
        let query = `${ServerUrl}/api/class/${id}`;
        let resp = await fetch(query, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            }
        });
        if(resp.status != 200) throw resp.error;
        let data = resp.json();
        let htmlText = buildDetail(data);
        document.getElementById("class-detail-container").innerHTML = htmlText;
        hideSpinner();
    }
    catch (err) {
        console.error("api error", err);
        hideSpinner();
    }
}

const buildDetail = (data) => 
    `

    `;

const onHandlerDeleteClass = async (classId) => {
    try {
        showSpinner();
        let query = `${ServerUrl}/api/class-deactive/${id}`;
        let resp = await fetch(query, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                status: 4
            })
        });
        if(resp.status != 200) throw resp.error;
        closeConfirmDialog();
        await getClasses();
        openConfirmDialog(
            {
                title: "Hủy kích hoạt thành công",
                content: "Lớp đã được hủy kích hoạt"
            },
            "noti",
            "sucess"
        );
    }
    catch (err) {
        console.error("api error", err);
        closeConfirmDialog();
        openConfirmDialog(
            {
                title: "Hủy kích hoạt thất bại",
                content: "hủy kích hoạt thất bại"
            },
            "noti",
            "fail"
        );
        hideSpinner();
    }
}

//run
getClasses({classStatus: ClassStatus.Opening});
//search
let searchInput = document.getElementById("searchClassv2");
searchInput.addEventListener("change", ()=> getClasses({classStatus: parseInt(selectStatus.value), classCode: searchInput.value, centerId: parseInt(centerSelect.value)}))
//select change
let selectStatus = document.getElementById("province select_class_box");
selectStatus.addEventListener("change", ()=> getClasses({classStatus: parseInt(selectStatus.value), classCode: searchInput.value, centerId: parseInt(centerSelect.value)}))
//centerId change
let centerSelect = $("#center_select_class_box")
centerSelect.addEventListener("change", ()=> getClasses({classStatus: parseInt(selectStatus.value), classCode: searchInput.value, centerId: parseInt(centerSelect.value)}))

//select add
const openBtn = document.getElementById('open-btn');
	const overlay = document.getElementById('overlay');
	const box = document.getElementById('box');
	const closeBtn = document.getElementById('close-btn');
    let errorAddMessage = document.getElementById('errorAddMessage');

	openBtn.addEventListener('click', () => {
		overlay.classList.add('active');
		box.classList.add('active');
	});

	closeBtn.addEventListener('click', () => {
		overlay.classList.remove('active');
		box.classList.remove('active');
	});
let addCode = document.getElementById('addclasscode');
let addName = document.getElementById('addclassname');
let addFromAge = document.getElementById('addclassFromAge');
// let addToAge = document.getElementById('addclassToAge');
let addClassPrice = document.getElementById('addClassPrice');
let addclassFromTimeOpen = document.getElementById('addclassFromTimeOpen');
// let addclassToTimeOpen = document.getElementById('addclassToTimeOpen');
let addnumberlessons = document.getElementById('addnumberlessons');
let addMaxStudents = document.getElementById('addMaxStudents');
let addteachers = document.getElementById('addteachers');
let addTeacherSalary = document.getElementById('addTeacherSalary');
let addSelectCondition = document.getElementById('addSelectCondition');
let addProgramSelect = document.getElementById('addProgramSelect');
let addCenterSelect = document.getElementById('addCenterSelect');

const resetAddInput = () => {
    addCode.value = "";
    addName.value = "";
    addFromAge.value = "";
    // addToAge.value = "";
    addClassPrice.value = "";
    addclassFromTimeOpen.value = "";
    // addclassToTimeOpen.value = "";
    addnumberlessons.value = "";
    addMaxStudents.value = "";
    addteachers.value = "";
    addTeacherSalary.value = "";
    addSelectCondition.value = "";
    addProgramSelect.value = "";
    addCenterSelect.value="";
    counter = 0;
}

const checkValue = () => {
    if(
        !addCode.value ||
        !addName.value ||
        !addFromAge.value ||
        // !addToAge.value ||
        !addClassPrice.value ||
        !addclassFromTimeOpen.value ||
        // !addclassToTimeOpen.value ||
        !addnumberlessons.value ||
        !addMaxStudents.value ||
        !addteachers.value ||
        !addTeacherSalary.value ||
        !addSelectCondition.value ||
        // !addProgramSelect.value ||
        !addCenterSelect.value
    ) {
        errorAddMessage.innerHTML = "Vui lòng nhập đủ thông tin";
        return false;
    }
    return true;
}

let counter = 0;
const addCard = async () => {
    var container = document.getElementById("addSchedules");
		var card = document.createElement("div");
		card.className = "card";
		card.style.width = "100%";
		card.style.display ="flex";
		card.style.flexDirection = "row";
		card.style.border = "unset";
		card.style.marginTop = "5px";
		card.innerHTML = `
  		<select style='width: 70%; margin-right:5px' name="schedules${counter}" id="schedules${counter}" class="addScheduleSelect">
          <option value="">Thời gian</option>
          
        </select>
        <button class="delete-button" data-index="${counter}" onclick="deleteCard(this)">Xóa</button>
  `;
		container.appendChild(card);
		counter++; // Tăng giá trị của biến đếm
        await setupScheduleList();
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

$("#add-class-btn").addEventListener("click", async ()=> {
    await onConfirmAddClass();
});

const onConfirmAddClass = async () => {
    try {
        if(!checkValue()) return;
        showSpinner();
        let scheduleIds = [];
        let schedules = document.querySelectorAll(".addScheduleSelect");
        schedules?.forEach((item) => {
            let value = item.value;
            scheduleIds.push(parseInt(value));
        })
        let code = addCode.value;
        let name = addName.value;
        let fromAge = parseInt(addFromAge.value);
        // let toAge = parseInt(addToAge.value);
        let startAt = new Date(addclassFromTimeOpen.value);
        // let endAt = new Date(addclassToTimeOpen.value);
        
        let maxQuantity = parseInt(addMaxStudents.value);
        let fee = parseInt(addClassPrice.value);
        let totalSession = parseInt(addnumberlessons.value);
        let status = parseInt(addSelectCondition.value);
        let programId = parseInt(addProgramSelect.value);
        let centerId = parseInt(addCenterSelect.value);
        let body = {
            teachedSession: 0,
            code,
            name,
            fromAge,
            // toAge,
            startAt,
            // endAt,
            studentQuantity: 0,
            maxQuantity,
            fee,
            totalSession,
            status,
            programId,
            centerId
        };
        console.log("body add", body);
        let query = `${ServerUrl}/api/class`;
        let resp = await fetch(query, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(body),
        });
        let data = await resp.json();
        if(!data || !data.id) throw resp.error;
        //attach schedule
        let queryAttachSchedule = `${ServerUrl}/api/apply-schedule`;
        scheduleIds = [...new Set(scheduleIds)];
        console.log("schedule", scheduleIds)
        if(scheduleIds && scheduleIds.length) {
            for(let item of scheduleIds) {
                await fetch(queryAttachSchedule, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({
                        classId: data.id,
                        scheduleId: item
                    }),
                });
                
            }
        }
        //attach teacher
        let teacherId= addteachers.value;
        let salary = addTeacherSalary.value;
        let teacherquery = `${ServerUrl}/api/add-teacher-to-class`;
        let teacherResp = await fetch(teacherquery, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                classId: data.id,
                teacherId: teacherId,
                salary: salary
            }),
        });
        if(teacherResp.status != 200) throw teacherResp.error;
        //reset
        addSelectCondition.value = ClassStatus.Opening;
        await getClasses({classStatus: ClassStatus.Opening});
        overlay.classList.remove('active');
		box.classList.remove('active');
        resetAddInput();
        hideSpinner();
    }
    catch (err) {
        console.error(err);
        hideSpinner();
    }
}

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
        let data = teachers.map(item => {
            return `<option value="${item.id}">${item.name}</option>`
        });
        addteachers.innerHTML = `<option value="">Tên giáo viên</option>` + data;
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
        let data = centers.map(item => {
            return `<option value="${item.id}">${item.name}</option>`
        });
        addCenterSelect.innerHTML = `<option value="0">Chọn trung tâm</option>` + data;
        $("#center_select_class_box").innerHTML = `<option value="0">Chọn trung tâm</option>` + data;

    }
    catch (err) {
        console.error(err);
    }
}

const setupScheduleList = async () => {
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
        let data = (schedules.docs || [])?.map(item => {
            return `<option value="${item.id}">${item.dayLabel} - ${formatDate(item.startAt)} - ${formatDate(item.endAt)}</option>`
        });
        console.log(data);
        let addScheduleSelects = document.querySelectorAll(".addScheduleSelect");
        for(let item of addScheduleSelects) {
            console.log("item", item);
            item.innerHTML = `<option value="0">Chọn lịch học</option>` + data;
        }
    }
    catch (err) {
        console.error(err);
    }
}

const setupProgramList = async () => {
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
        }).join("");
        console.log(data);
        let addProgramSelect = document.getElementById("addProgramSelect");
        addProgramSelect.innerHTML = `<option value="0">Chọn Chương trình giảm giá</option>` + data;
    }
    catch (err) {
        console.error(err);
    }
}

setupCenter();
setupTeacher();
setupScheduleList();
setupProgramList();

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
        await setupScheduleList();
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
        await setupProgramList();
       

        onCloseCreateDialog();
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