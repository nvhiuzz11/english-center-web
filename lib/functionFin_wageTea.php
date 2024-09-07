<?php


$path_dir = __DIR__ . '/../lib';

include $path_dir . '/database.php';

//search  LuongGV x giaovien
function searchLuongGV($connection,$key,$collumSort,$order)
{

    if ($collumSort != "") {
        if ($collumSort == "ThoiGian") {
            $sql = 'SELECT luonggv.MaGV , MaLuong, TenHD ,ThoiGian, Lop,ThoiGianTT, SoTien, TrangThai, giaovien.TenGV, giaovien.TenGV, giaovien.GioiTinh, giaovien.NgaySinh, giaovien.Tuoi, giaovien.QueQuan, giaovien.DiaChi, giaovien.TrinhDo, giaovien.SDT, giaovien.Email  FROM luonggv INNER JOIN giaovien WHERE luonggv.MaGV =  giaovien.MaGV and
            (MaLuong like :key or luonggv.MaGV like :key or giaovien.TenGV like :key or ThoiGian like :key or ThoiGianTT like :key or Lop like :key  or TenHD like :key) order by STR_TO_DATE(CONCAT("01/", ThoiGian), "%d/%m/%Y" )' . $order;
        } else {

            $sql = "SELECT luonggv.MaGV , MaLuong, TenHD ,ThoiGian, Lop,ThoiGianTT, SoTien, TrangThai, giaovien.TenGV, giaovien.TenGV, giaovien.GioiTinh, giaovien.NgaySinh, giaovien.Tuoi, giaovien.QueQuan, giaovien.DiaChi, giaovien.TrinhDo, giaovien.SDT, giaovien.Email  FROM luonggv INNER JOIN giaovien WHERE luonggv.MaGV =  giaovien.MaGV and
            (MaLuong like :key or luonggv.MaGV like :key or giaovien.TenGV like :key or ThoiGian like :key or ThoiGianTT like :key or Lop like :key  or TenHD like :key) order by " . $collumSort . " " . $order;
        }
    } else {
        $sql = "SELECT luonggv.MaGV , MaLuong, TenHD ,ThoiGian, Lop,ThoiGianTT, SoTien, TrangThai, giaovien.TenGV, giaovien.TenGV, giaovien.GioiTinh, giaovien.NgaySinh, giaovien.Tuoi, giaovien.QueQuan, giaovien.DiaChi, giaovien.TrinhDo, giaovien.SDT, giaovien.Email  FROM luonggv INNER JOIN giaovien WHERE luonggv.MaGV =  giaovien.MaGV and
        (MaLuong like :key or luonggv.MaGV like :key or giaovien.TenGV like :key or ThoiGian like :key or ThoiGianTT like :key or Lop like :key  or TenHD like :key) order by MaLuong desc";
    }

    // $sql = "SELECT luonggv.MaGV , MaLuong, TenHD ,ThoiGian, Lop,ThoiGianTT, SoTien, TrangThai, giaovien.TenGV, giaovien.TenGV, giaovien.GioiTinh, giaovien.NgaySinh, giaovien.Tuoi, giaovien.QueQuan, giaovien.DiaChi, giaovien.TrinhDo, giaovien.SDT, giaovien.Email  FROM luonggv INNER JOIN giaovien WHERE luonggv.MaGV =  giaovien.MaGV and
    //      (MaLuong like :key or luonggv.MaGV like :key or giaovien.TenGV like :key or ThoiGian like :key or ThoiGianTT like :key or Lop like :key  or TenHD like :key) order by MaLuong desc";
    try {
        $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $statement =  $connection->prepare($sql);
        $statement->bindValue(':key', "%$key%", PDO::PARAM_STR);
        $statement->execute();

        $list  = $statement->fetchAll(PDO::FETCH_ASSOC);

        $connection = null;
        return $list;
    } catch (PDOException $e) {
        echo $e->getMessage();
    }
}


function listBillLGV($connection)
{

    $sql = "SELECT luonggv.MaGV , MaLuong, TenHD ,ThoiGian, Lop,ThoiGianTT, SoTien, TrangThai, giaovien.TenGV, giaovien.TenGV, giaovien.GioiTinh, giaovien.NgaySinh, giaovien.Tuoi, giaovien.QueQuan, giaovien.DiaChi, giaovien.TrinhDo, giaovien.SDT, giaovien.Email  FROM luonggv INNER JOIN giaovien WHERE luonggv.MaGV =  giaovien.MaGV ";
    try {
        $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $statement = $connection->prepare($sql);
        $statement->execute();

        $list = $statement->fetchAll(PDO::FETCH_ASSOC);

        $connection = null;
        return $list;
    } catch (PDOException $e) {
        echo $e->getMessage();
    }
}

//select  gv_lop x lop

function select_gv_LopxLop($connection)
{
    $sql = "SELECT gv_lop.MaLop , MaGV, TienTraGV, lop.TenLop, lop.LuaTuoi, lop.ThoiGian, lop.SLHS, lop.SLHSToiDa, lop.HocPhi,lop.SoBuoi,lop.SoBuoiDaToChuc,lop.TrangThai  FROM gv_lop INNER JOIN lop WHERE gv_lop.MaLop = lop.MaLop AND lop.TrangThai = 'Đang mở';";
    try {
        $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $statement =  $connection->prepare($sql);
        $statement->execute();

        $list  = $statement->fetchAll(PDO::FETCH_ASSOC);

        $connection = null;
        return $list;
    } catch (PDOException $e) {
        echo $e->getMessage();
    }
}

function select_gv_LopxDD($connection)
{
    $sql = "SELECT gv_lop.MaGV ,giaovien.TenGV ,gv_lop.MaLop , b2.ThoiGian FROM gv_lop INNER JOIN (SELECT DISTINCT MaLop , ThoiGian FROM diemdanh)b2 INNER JOIN giaovien WHERE gv_lop.MaLop = b2.MaLop AND gv_lop.MaGV = giaovien.MaGV;";
    try {
        $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $statement =  $connection->prepare($sql);
        $statement->execute();

        $list  = $statement->fetchAll(PDO::FETCH_ASSOC);

        $connection = null;
        return $list;
    } catch (PDOException $e) {
        echo $e->getMessage();
    }
}

// select so buoi day

function selectSoBuoiDay($connection, $month, $year, $magv)
{
    $begin = date("$year-$month-01");

    $finish = date("Y-m-t", strtotime($begin));

    $sql = 'SELECT gv_lop.MaGV ,gv_lop.MaLop ,gv_lop.TienTraGV,count(DISTINCT b2.ThoiGian) "SoBuoiDay" FROM gv_lop INNER JOIN (SELECT DISTINCT MaLop , ThoiGian FROM diemdanh)b2 INNER JOIN giaovien WHERE gv_lop.MaLop = b2.MaLop and gv_lop.MaGV = ? AND b2.ThoiGian BETWEEN ? AND ? group By gv_lop.MaGV , gv_lop.MaLop, gv_lop.TienTraGV;';
    try {
        $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $statement = $connection->prepare($sql);
        $statement->bindParam(2, $begin);
        $statement->bindParam(3, $finish);
        $statement->bindParam(1, $magv);
        $statement->execute();

        $list = $statement->fetchAll(PDO::FETCH_ASSOC);

        $connection = null;
        return $list;
    } catch (PDOException $e) {
        echo $e->getMessage();
    }
}

// insert Luong gv
function insertluongGV($connection, $tenHD, $magv, $lop, $tg, $st)
{
    $s = 'Chưa thanh toán';
    $sql = "insert into  luonggv (TenHD, MaGV, Lop, ThoiGian, SoTien, TrangThai) values(?,?,?,?,?,?)";
    try {
        $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $statement =  $connection->prepare($sql);

        $statement->bindParam(1, $tenHD);
        $statement->bindParam(2, $magv);
        $statement->bindParam(3, $lop);
        $statement->bindParam(4, $tg);
        $statement->bindParam(5, $st);
        $statement->bindParam(6, $s);

        $statement->execute();


        $connection = null;
    } catch (PDOException $e) {
        echo $e->getMessage();
    }
}

//select danhs sach giao vien
function selectTeacher($connection)
{
    $sql = "select * from giaovien";
    try {
        $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $statement =  $connection->prepare($sql);
        $statement->execute();

        $list  = $statement->fetchAll(PDO::FETCH_ASSOC);

        $connection = null;
        return $list;
    } catch (PDOException $e) {
        echo $e->getMessage();
    }
}


// update trang thai luonggv
function updateStatusLuonggv($connection, $tt, $tg, $mal)
{

    $sql = "update luonggv set  TrangThai = ?  , ThoiGianTT = ? where MaLuong = ?";
    try {
        $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $statement =  $connection->prepare($sql);

        $statement->bindParam(1, $tt);
        $statement->bindParam(2, $tg);
        $statement->bindParam(3, $mal);
        $statement->execute();

        $connection = null;
    } catch (PDOException $e) {
        echo $e->getMessage();
    }
}



// update trang thai luonggv
function updateLuongGV($connection, $maluong, $tenhd, $magv, $tg, $tgtt, $sotien, $tt)
{

    $sql = "update luonggv set  TrangThai = ?  , ThoiGianTT = ? ,  TenHD = ? ,MaGV =? , ThoiGian = ?, SoTien = ? where MaLuong = ?";
    try {
        $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $statement =  $connection->prepare($sql);

        $statement->bindParam(1, $tt);
        $statement->bindParam(2, $tgtt);
        $statement->bindParam(3, $tenhd);
        $statement->bindParam(4, $magv);
        $statement->bindParam(5, $tg);
        $statement->bindParam(6, $sotien);
        $statement->bindParam(7, $maluong);;

        $statement->execute();

        $connection = null;
    } catch (PDOException $e) {
        echo $e->getMessage();
    }
}

//Xoa hoa don hoc phi
function deleteLuongGV($connection, $mahd)
{
    $sql = "delete from luonggv where MaLuong = ?";
    try {
        $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $statement =  $connection->prepare($sql);
        $statement->execute([$mahd]);
        $connection = null;
    } catch (PDOException $e) {
        echo $e->getMessage();
    }
}


//select danhs sach day hoc
function selectSoBuoiDayAll($connection)
{
    $sql = "SELECT b3.MaGV,b3.MaLop ,b3.TienTraGV ,MONTH(b3.ThoiGian) \"Thang\" ,year(b3.ThoiGian) \"Nam\" , COUNT(DISTINCT b3.ThoiGian) AS SoBuoiDay FROM (SELECT gv_lop.MaGV ,gv_lop.MaLop ,gv_lop.TienTraGV, b2.ThoiGian FROM gv_lop INNER JOIN (SELECT DISTINCT MaLop , ThoiGian FROM diemdanh)b2 INNER JOIN giaovien WHERE gv_lop.MaLop = b2.MaLop)b3 GROUP by b3.MaGV,b3.MaLop, b3.TienTraGV ,MONTH(b3.ThoiGian) ,year(b3.ThoiGian);";
    try {
        $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $statement =  $connection->prepare($sql);
        $statement->execute();

        $list  = $statement->fetchAll(PDO::FETCH_ASSOC);

        $connection = null;
        return $list;
    } catch (PDOException $e) {
        echo $e->getMessage();
    }
}
