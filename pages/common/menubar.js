//menuBar khi chưa đăng nhập 
const menuBarHTML  = `<div class="PageMenuBar">
<a class="PageLogoWrap">
    <img class="PageLogoImg" src="../../assets/images/logo-web.png"/>
</a>
<div class="menubar-btnwrap">

  <a href="/pages/home/home.html" class="PageLogoBtn">Login LoDuHi</a>
</div>
</div>`
//isAuthentication === false
//document.querySelector("#menu-bar").innerHTML = menuBarHTML
//menuBar khi đã đăng nhập 
const authMenuBarHTMl = ` <div class="PageMenuBar">
<a class="PageLogoWrap">
    <img src="../../assets/images/logo-web.png" class="PageLogoImg"/>
</a>
<div class="menubar-left">
  <a class="menubar-nav">Tab1</a>
  <a class="menubar-nav">Tab2</a>
  <a class="menubar-nav">Tab3</a>
  <a class="menubar-nav last-nav">Tab4</a>
  <div class="menubar-info-wrap">
    <div class="menubar-info">
      <div class="menubar-name">Hieu lo.n</div>
      <div class="menubar-dropdown">
          <button class="menubar-avt-wrap menubar-drop-btn">
            <img src="../../assets/images/Student-male-icon.png" alt="" class="menubar-avt">
          </button>
          <ul class="menubar-dropdown-menu">
              <li class="menubar-dropdown-item"><a  href="#">Thông tin cá nhân</a></li>
            <li class="menubar-dropdown-item"><a  href="#">Chi tiết lớp học</a></li>
            <li class="menubar-dropdown-item"><a  href="#">Đăng xuất</a></li>
          </ul>
        </div>
    </div>
  </div>
</div>
  
</div>`
//isAuthentication === true
// document.querySelector("#menu-bar").innerHTML = authMenuBarHTMl
// var $ = document.querySelector.bind(document)
// var $$ = document.querySelectorAll.bind(document)
function menubarv2(tenHS,gioitinh,obj = "student",preDirectLink = "."){
  let pathname = window.location.pathname;
  
  const authMenuBarHTMl = ` <div class="PageMenuBar">
<a class="PageLogoWrap" href="../main_pages/${obj === "teacher" ? "homeTeacher" :""}${obj === "student" ? "homeStudent" :""}${obj === "parent" ? "homeParent" :""}.php">
    <img src="../../assets/images/logo-web.png" class="PageLogoImg"/>
</a>
<div class="menubar-left">
  ${obj === "parent" ? (
    `<a class="menubar-nav ${pathname.includes("/userParent_child") ? "menubar-active" : ""}"  href="${preDirectLink}/userParent_child.php" >Thông tin của con</a>
    <a class="menubar-nav ${pathname.includes("/userParent_Fee") ? "menubar-active" : ""}  last-nav"  href="${preDirectLink}/userParent_Fee.php" >Học phí của con</a>`
  ) : ""}
  ${obj === "student" ? (
    (`<a class="menubar-nav ${pathname.includes("/userStudent_class") ? "menubar-active" : ""}"  href="${preDirectLink}/userStudent_class.php" >Thông tin lớp học</a>
    <a class="menubar-nav ${pathname.includes("/userStudent_link") ? "menubar-active" : ""}  last-nav" href="${preDirectLink}/userStudent_link.php">Liên kết với phụ huynh</a>`)
  ): ""}
  ${obj === "teacher" ? (
    `<a class="menubar-nav ${pathname.includes("/homeTeacher") ? "menubar-active" : ""}"  href="${preDirectLink}/homeTeacher.php">Thông tin lớp dạy</a>
    <a class="menubar-nav ${pathname.includes("/userTeacher_wage") ? "menubar-active" : ""}  last-nav"  href="${preDirectLink}/userTeacher_wage.php"">Lịch sử lương</a>`
  ): ""}
  <div class="menubar-info-wrap">
    <div class="menubar-info">
      <div class="menubar-name">` + tenHS + `</div>
      <div class="menubar-dropdown">
          <button class="menubar-avt-wrap menubar-drop-btn">
            <img alt="" class="menubar-avt">
          </button>
          <ul class="menubar-dropdown-menu" id ="a123">
              <li class="menubar-dropdown-item"><a  href="../personal/${obj === "teacher" ? "personal_Teacher" :""}${obj === "student" ? "personal_Student" :""}${obj === "parent" ? "personal_Parent" :""}.php">Thông tin cá nhân</a></li>
      
              <li class="menubar-dropdown-item">  <form action="" method="post"> <input type="submit" name ="btn-logout"  id ="btn-logout" value ="Đăng xuất" style="border: none;background-color: unset;"></form></li>          </ul>
          </ul>
        </div>
    </div>
  </div>
</div>

</div>`
    //isAuthentication === true
    document.querySelector("#menu-bar").innerHTML = authMenuBarHTMl
    var $ = document.querySelector.bind(document)
    var $$ = document.querySelectorAll.bind(document)


    $(".menubar-drop-btn").onclick = () => {

      $(".menubar-dropdown-menu").classList.toggle("menubar-show")

    }

    var img2 = document.querySelector(".menubar-avt");
    if (gioitinh == "Nam") {

      img2.src = `../../assets/images/${obj === "teacher" ? "Teacher-male-icon" :""}${obj === "student" ? "Student-male-icon" :""}${obj === "parent" ? "Parent-male-icon" :""}.png`;
    } else {

      img2.src = `../../assets/images/${obj === "teacher" ? "Teacher-female-icon" :""}${obj === "student" ? "Student-female-icon" :""}${obj === "parent" ? "Parent-female-icon" :""}.png`;
    }
}

$(".menubar-drop-btn").onclick = ()=>{
  $(".menubar-dropdown-menu").classList.toggle("menubar-show")
}