var toastEl = (text, title, type = "success") => `
<div class="toast toast-div" style="position: fixed; right: 15px;">
  <div class="toast-header toast-header-cus ${type =="success" ? "toast-success":"toas-fail"}">
    <strong class="mr-auto">${title || "Thông báo"}</strong>
    <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
  <div class="toast-body">
  ${text || (type === "success"? "Thành công" : "Đã có lỗi xảy ra")}
  </div>
</div>
`

function useToast(text,title,type = "success"){
    const toastDiv = document.querySelector(".toastDiv");
    toastDiv.innerHTML = toastEl(text,title,type);
    $('.toast').toast({
        animation:true,
        autohide:true,
        delay:1000
    });
    $('.toast').toast("show");

}