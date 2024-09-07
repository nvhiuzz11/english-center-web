
showParent();
showRequest();

function showRequest() {
     document.getElementById('div-nofi').innerHTML="";
    ds_yeuCau.forEach(function (yeuCau) {
      
        var nofiDiv = document.createElement('div');
        nofiDiv.id = 'nofi';
        nofiDiv.innerHTML = '<p>Phụ huynh ' + yeuCau.TenPH + ' đã gửi yêu cầu liên kết với bạn</p>' +
            '<button onclick="tuChoi(' + yeuCau.MaHS + ',' + yeuCau.MaPH + ')">Từ chối</button>' +
            '<button onclick="chapNhan(' + yeuCau.MaHS + ',' + yeuCau.MaPH + ')">Chấp nhận</button>';

            document.getElementById('div-nofi').appendChild(nofiDiv);
    });
    
}

function showParent() {

    var html = '';

    if (!ds_ph || ds_ph.length === 0) {
        html += '<p style="font-style: italic;">Bạn chưa liên kết đến phụ huynh nào ~</p>';
    } else {
        ds_ph.forEach(function (parent) {
            html += '<div id="parent">';
            html += '<table style="width:100%">';
            html += '<tr><td>Tên: ' + parent['MaPH'] + ' - ' + parent['TenPH'] + '</td></tr>';
            html += '<tr><td style="width: 210px">Giới tính: ' + parent['GioiTinh'] + '</td>';
            html += '<td>Tuổi: ' + parent['Tuoi'] + '</td></tr>';
            html += '</table></div>';
        });
    }

    document.getElementById('div-parent').innerHTML = html;

}

document.getElementById('btn-link').addEventListener('click', function (event) {
    var check = true;
    var check_value = false;
    var check_has = false;

    event.preventDefault();



    var maph = document.getElementById('maPH-link').value;
    var tenph;
    for (var i = 0; i < ds_ph.length; i++) {
        if (ds_ph[i].MaPH == maph) {
            var check_has = true;
        }
    }

    for (var i = 0; i < ds_maPH.length; i++) {
        if (ds_maPH[i].MaPH == maph) {
            check_value = true;
            tenph = ds_maPH[i].TenPH;
        }
    }
    if (!maph) {
        document.getElementById('err').textContent = "Chưa nhập mã phụ huynh";
        check = false;
    } else if (check_has) {
        document.getElementById('err').textContent = "Phụ huynh này đã liên kết";
        check = false;
    } else if (!check_value) {
        document.getElementById('err').textContent = "Mã phụ huynh không chính xác";
        check = false;
    } else
        document.getElementById('err').textContent = "";

    if (!check)
        return;


    $.ajax({
        url: '../../api/sentRequest.php',
        type: 'POST',
        data: {
            maph: maph,
            mahs: detailStudent[0].MaHS,
            nyc : "hs"
        },
        success: function (res) {

            
        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });



    document.getElementById('tb1').innerHTML = "Đã gửi yêu cầu liên kết !";
    document.getElementById('maPH-link').value = "";
    document.querySelector('.add-success').style.display = 'block';

    setTimeout(function () {
        document.querySelector('.add-success').style.display = 'none';

    }, 1500);

});


///
var button = document.getElementById('btn-nofi');
var hiddenDiv = document.getElementById('div-nofi');

button.addEventListener('click', function () {
    hiddenDiv.style.display = hiddenDiv.style.display === 'block' ? 'none' : 'block';

});







function tuChoi(maHS, maPH) {
    

    $.ajax({
        url: '../../api/replyRequest.php',
        type: 'POST',
        data: {
            maph: maPH,
            mahs: maHS,
            rep: "refuse",
            nyc : "hs",
        },
        success: function (res) {
            ds_ph = JSON.parse(res).listParent;
            ds_yeuCau = JSON.parse(res).listRequest;
            console.log(ds_ph);
            console.log(ds_yeuCau);
            showRequest();
            showParent();
        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });


}

function chapNhan(maHS, maPH) {


    $.ajax({
        url: '../../api/replyRequest.php',
        type: 'POST',
        data: {
            maph: maPH,
            mahs: maHS,
            rep: "accept",
            nyc : "hs",
        },
        success: function (res) {
            ds_ph = JSON.parse(res).listParent;
            ds_yeuCau = JSON.parse(res).listRequest;
            showRequest();
            showParent();
 
        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });
}