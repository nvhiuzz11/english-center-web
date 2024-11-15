//init setting
var $ = document.querySelector.bind(document)
var $$ = document.querySelectorAll.bind(document)
const confirmDialog = (data, type = "confirm", status = "", cb = () => {}) => `
<div class="page-confirm-dialog-inner">
    <div class="page-confirm-dialog-title">${data?.title || "Xác nhận"}</div>
    <div class="page-confirm-dialog-content">
        <p>${data?.content || ""}</p>
    </div>
    <div class="btn-confirm-dialog-wrap">
        <button class="close-confirm-dialog-btn" onclick="closeConfirmDialog()">Đóng</button>
        ${type === "confirm" ? `<button class="accept-confirm-dialog-btn" onclick="onConfirm(${cb})">Xác nhận</button>` : ``}
    </div>
</div>
`

//setup

const initConfirmSetup = () => {
    $(".confirm-dialog-wrap").innerHTML = confirmDialog({});
}

const openConfirmDialog = (data, type, status, cb) => {
    $(".confirm-dialog-wrap").innerHTML = confirmDialog(data, type, status, cb);
    $(".confirm-dialog-wrap").classList.add("confirm-dialog-open");
}

const closeConfirmDialog = () => {
    $(".confirm-dialog-wrap").classList.remove("confirm-dialog-open");
}

const onConfirm = (cb) => {
    console.log(cb);
    cb();
}
