<?php


$path_dir = __DIR__ . '/../lib';

include $path_dir . '/database.php';

function selectStudent($connection,$ma){
    $sql = "select * from hocsinh where MaHS = ?";
    try{
        $connection -> setAttribute(PDO:: ATTR_ERRMODE, PDO:: ERRMODE_EXCEPTION);
        $statement =  $connection->prepare($sql);
        $statement-> execute([$ma]);

        $listClass  = $statement-> fetchAll(PDO:: FETCH_ASSOC);

        $connection = null;
        return $listClass;
    } catch (PDOException $e){
        echo $e->getMessage();
    }
}


// // select ten hs 
function selectTenHS($connection, $magv)
{

    $sql = "SELECT  TenHS FROM hocsinh WHERE MaHS = ?";

    try {
        $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $statement =  $connection->prepare($sql);
        $statement->bindParam(1, $magv);
        $statement->execute();

        $list = $statement->fetchAll(PDO::FETCH_ASSOC);

        $connection = null;
        return $list;
    } catch (PDOException $e) {
        echo $e->getMessage();
    }
}

// // select danh sach lop 
function listDD($connection, $mahs, $tt)
{
    $sql = 'SELECT hs_lop.MaHS , hs_lop.MaLop , TenLop , LuaTuoi, ThoiGian,SLHS, SLHSToiDa,  SoBuoiDaToChuc, lop.HocPhi,SoBuoi,SoBuoiDaToChuc, SoBuoiNghi, GiamHocPhi FROM lop INNER JOIN hs_lop WHERE lop.MaLop =  hs_lop.MaLop AND hs_lop.MaHS = ? AND TrangThai = ?';
    try {
        $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $statement =  $connection->prepare($sql);
        $statement->bindParam(1, $mahs);
        $statement->bindParam(2, $tt);
        $statement->execute();

        $list  = $statement->fetchAll(PDO::FETCH_ASSOC);

        $connection = null;
        return $list;
    } catch (PDOException $e) {
        echo $e->getMessage();
    }
}

///
function listDD_HD($connection, $mahs)
{
    $a ="Đang mở";
    $b= "Chưa mở";
    $sql = 'SELECT hs_lop.MaHS , hs_lop.MaLop , TenLop , LuaTuoi, ThoiGian,SLHS, SLHSToiDa,  SoBuoiDaToChuc, lop.HocPhi,SoBuoi,SoBuoiDaToChuc, SoBuoiNghi, GiamHocPhi FROM lop INNER JOIN hs_lop WHERE lop.MaLop =  hs_lop.MaLop AND hs_lop.MaHS = ? AND (TrangThai = ? or TrangThai = ?)';
    try {
        $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $statement =  $connection->prepare($sql);
        $statement->bindParam(1, $mahs);
        $statement->bindParam(2, $a);
        $statement->bindParam(3, $b);
        $statement->execute();

        $list  = $statement->fetchAll(PDO::FETCH_ASSOC);

        $connection = null;
        return $list;
    } catch (PDOException $e) {
        echo $e->getMessage();
    }
}


///
function listNgayNghi($connection,$mahs)
{
    $sql = 'SELECT MaLop  , ThoiGian  FROM diemdanh WHERE dd = "0" AND MaHS = ?';
    try {
        $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $statement =  $connection->prepare($sql);
        $statement->bindParam(1, $mahs);
        $statement->execute();

        $list  = $statement->fetchAll(PDO::FETCH_ASSOC);

        $connection = null;
        return $list;
    } catch (PDOException $e) {
        echo $e->getMessage();
    }
}


// select hoc sinh cua phu huynh
function studentOfParent($connection, $maph)
{
    $sql = "SELECT ph_hs.MaHS, hocsinh.TenHS, hocsinh.GioiTinh, hocsinh.NgaySinh, hocsinh.Tuoi, hocsinh.DiaChi, hocsinh.SDT, hocsinh.Email  FROM ph_hs INNER JOIN hocsinh WHERE ph_hs.MaHS =  hocsinh.MaHS AND ph_hs.MaPH = ?";
    try {
        $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $statement =  $connection->prepare($sql);
        $statement->execute([$maph]);

        $list  = $statement->fetchAll(PDO::FETCH_ASSOC);

        $connection = null;
        return $list;
    } catch (PDOException $e) {
        echo $e->getMessage();
    }
}


// // select ds lienket phuhuynh hoc sinh 
function selectdslk2($connection, $magv)
{

    $sql = 'SELECT yeucaulienket.MaHS,yeucaulienket.MaPH, TenHS,TenPH  FROM yeucaulienket , hocsinh , phuhuynh WHERE yeucaulienket.MaHS = hocsinh.MaHS and yeucaulienket.MaPH =  phuhuynh.MaPH and  nyc = "hs" and  yeucaulienket.MaPH = ? ';

    try {
        $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $statement =  $connection->prepare($sql);
        $statement->bindParam(1, $magv);
        $statement->execute();

        $list = $statement->fetchAll(PDO::FETCH_ASSOC);

        $connection = null;
        return $list;
    } catch (PDOException $e) {
        echo $e->getMessage();
    }
}

function listSchedules($connection)
{
    $sql = "SELECT lop_lichhoc.MaLich ,lop_lichhoc.MaLop ,lichhoc.Ngay , lichhoc.TGBatDau, lichhoc.TGKetThuc FROM lop_lichhoc INNER JOIN lichhoc WHERE lop_lichhoc.MaLich = lichhoc.MaLich;";
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

// select phu huynh cua hoc vien

function parentOfStudent($connection,$mahs)
{
    $sql = 'SELECT ph_hs.MaHS , ph_hs.MaPH , phuhuynh.TenPH, phuhuynh.GioiTinh, phuhuynh.NgaySinh, phuhuynh.Tuoi, phuhuynh.DiaChi, phuhuynh.SDT, phuhuynh.Email FROM phuhuynh INNER JOIN ph_hs WHERE ph_hs.MaPH =  phuhuynh.MaPH and ph_hs.MaHS =?';
    try {
        $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $statement =  $connection->prepare($sql);
        $statement->bindParam(1, $mahs);
        $statement->execute();

        $list  = $statement->fetchAll(PDO::FETCH_ASSOC);

        $connection = null;
        return $list;
    } catch (PDOException $e) {
        echo $e->getMessage();
    }
}


// select ma ph
function listMaPH($connection)
{
    $sql = "SELECT MaPH , TenPH FROM phuhuynh;";
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


// insert yeucaulienket
function insertLienKet($mahs, $maph,$nyc, $connection)
{
    $sql = "insert into yeucaulienket(MaHS,MaPH,nyc) values(?,?,?)";
    try {
        $statement = $connection->prepare($sql);

        $statement->bindParam(1, $mahs);
        $statement->bindParam(2, $maph);
   
        $statement->bindParam(3, $nyc);
        $statement->execute();
    } catch (PDOException $e) {
        echo $e->getMessage();
    }
}

// // select ds lienket phuhuynh hoc sinh 
function selectdslk($connection, $magv)
{

    $sql = 'SELECT yeucaulienket.MaHS,yeucaulienket.MaPH, TenHS,TenPH  FROM yeucaulienket , hocsinh , phuhuynh WHERE yeucaulienket.MaHS = hocsinh.MaHS and yeucaulienket.MaPH =  phuhuynh.MaPH and  nyc = "ph" and  yeucaulienket.MaHS = ? ';

    try {
        $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $statement =  $connection->prepare($sql);
        $statement->bindParam(1, $magv);
        $statement->execute();

        $list = $statement->fetchAll(PDO::FETCH_ASSOC);

        $connection = null;
        return $list;
    } catch (PDOException $e) {
        echo $e->getMessage();
    }
}

// // delêt ds lienket phuhuynh hoc sinh 
function deletedslk($connection, $mahs , $maph)
{

    $sql = 'DELETE FROM yeucaulienket WHERE MaHS = ? and MaPH =?';

    try {
        $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $statement =  $connection->prepare($sql);
        $statement->bindParam(1, $mahs);
        $statement->bindParam(2, $maph);
        $statement->execute();

        $list = $statement->fetchAll(PDO::FETCH_ASSOC);

        $connection = null;
        return $list;
    } catch (PDOException $e) {
        echo $e->getMessage();
    }
}

// insert ph-hs
function insertPHHS($Mahs, $Maph, $connection)
{
    $sql = "insert into ph_hs values(?,?)";
    try {
        $statement = $connection->prepare($sql);
        $statement->bindParam(1, $Mahs);
        $statement->bindParam(2, $Maph);
        $statement->execute();
    } catch (PDOException $e) {
        echo $e->getMessage();
    }
}