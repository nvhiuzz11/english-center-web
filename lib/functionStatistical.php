<?php


$path_dir = __DIR__ . '/../lib';

include $path_dir . '/database.php';


// // select so luong nguoi dung
function listCountUser($connection)
{
    $sql = 'SELECT "Giáo viên" as "Ten" , count(*) as "SoLuong" FROM giaovien UNION SELECT "Học sinh" as "Ten" , count(*) as "SoLuong" FROM hocsinh UNION SELECT "Phụ huynh" as "Ten" , count(*) as "SoLuong" FROM phuhuynh';
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

// // select so luong hs lien ket/ tong hs
function listCountHSlk($connection)
{
    $sql = 'SELECT COUNT(*) as"SoHS" FROM (SELECT DISTINCT MaHS from ph_hs) b1 UNION SELECT COUNT(*) FROM hocsinh;';
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

// // select so luong ph lien ket/ tong ph
function listCountPHlk($connection)
{
    $sql = 'SELECT COUNT(*) as "SoPH" FROM (SELECT DISTINCT MaPH from ph_hs)b2 UNION SELECT COUNT(*) FROM phuhuynh;';
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

// select MaLop diem danh  theo thanh trong ds diem danh

function listLopHDTheoThang($connection)
{
    $sql = 'SELECT b1.Thang , b1.Nam , MaLop FROM (SELECT DISTINCT MaLop, month(ThoiGian) as "Thang" , year(ThoiGian) as "Nam" FROM diemdanh) b1;';
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

// so lop hoat dong trong thang
function listSoLopHD($connection)
{
    $sql = 'SELECT b1.Thang , b1.Nam , COUNT(MaLop) as "SoLop"  FROM (SELECT DISTINCT MaLop, month(ThoiGian) as "Thang"   , year(ThoiGian) as "Nam" FROM diemdanh) b1 GROUP by b1.Thang , b1.Nam;';
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

// so hs Nam Nu
function listSoNamNu($connection)
{
    $sql = 'SELECT COUNT(*) as "so" FROM hocsinh WHERE GioiTinh = "Nữ"
    UNION
    SELECT COUNT(*) "so" FROM hocsinh WHERE GioiTinh = "Nam"';
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

// so hs theo do  tuoi
function listHSTheoTuoi($connection)
{
    $sql = 'SELECT Tuoi, COUNT(MaHS) as "so" FROM hocsinh GROUP BY Tuoi';
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

//
// so hs dang ky hoc theo tung thang
function listHSDangKyHoc($connection)
{
    $sql = 'SELECT b1.Thang , b1.Nam , count(MaHS) as "so" FROM ( SELECT DISTINCT MaHS, month(ThoiGian)as "Thang" , year(ThoiGian) as "Nam" FROM diemdanh) b1 GROUP BY b1.Thang , b1.Nam';
    
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
// tong so hoc sinh tang theo tung thang
function listHSTangTheoThang($connection)
{
    $sql = 'SELECT month(NgayDK) as "Thang" , year(NgayDK) as "Nam" , COUNT(MaHS) as "so" FROM tk_hs GROUP BY month(NgayDK) , year(NgayDK);';
    
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

// so luong hoc sinh di hoc/ nghi hoc
function listCountHSDD($connection)
{
    $sql = 'SELECT COUNT(*) as "so" FROM diemdanh WHERE dd = "1" UNION SELECT COUNT(*)   FROM diemdanh WHERE dd = "0";';
    
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
//  ds hs nghi nhieu
function listHSAbsent($connection)
{
    $sql = 'SELECT diemdanh.MaHS,MaLop,TenHS ,COUNT(ThoiGian) AS "so" FROM diemdanh INNER JOIN hocsinh WHERE dd = "0" and diemdanh.MaHS = hocsinh.MaHS GROUP BY MaHS,MaLop,TenHS ORDER BY COUNT(ThoiGian) DESC LIMIT 20;';
    
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

//  ds hs nghi nhieu
function countClass($connection)
{
    $sql = 'SELECT count(MaLop) as"so" FROM lop WHERE TrangThai = "Đang mở" UNION all SELECT count(MaLop) as"so" FROM lop WHERE TrangThai = "Đã đóng" UNION all SELECT COUNT(MaLop) as"so" FROM lop;';
    
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



