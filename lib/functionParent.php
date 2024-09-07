<?php


$path_dir = __DIR__ . '/../lib';

include $path_dir . '/database.php';
// select danh sách phụ huynh
function listParent($connection)
{
    $sql = "select * from phuhuynh";
    try {
        $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $statement =  $connection->prepare($sql);
        $statement->execute();

        $listParent  = $statement->fetchAll(PDO::FETCH_ASSOC);

        $connection = null;
        return $listParent;
    } catch (PDOException $e) {
        echo $e->getMessage();
    }
}
function deleteLKPHHS($connection, $MaHS)
{
    $sql = "delete from yeucaulienket where MaPH = ?";
    try {
        $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $statement =  $connection->prepare($sql);
        $statement->execute([$MaHS]);
        $connection = null;
    } catch (PDOException $e) {
        echo $e->getMessage();
    }
}




// update phu huynh

function updateParentbyID($connection, $MaPH, $ten, $gt, $ns, $tuoi, $dc, $sdt, $email)
{

    $sql = "update phuhuynh set TenPH = ? , GioiTinh = ? , NgaySinh = ?, Tuoi= ?, DiaChi = ?, SDT = ? ,  Email = ?  where MaPH = ?";
    try {
        $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $statement =  $connection->prepare($sql);

        $statement->bindParam(1, $ten);
        $statement->bindParam(2, $gt);
        $statement->bindParam(3, $ns);
        $statement->bindParam(4, $tuoi);
        $statement->bindParam(5, $dc);
        $statement->bindParam(6, $sdt);
        $statement->bindParam(7, $email);
        $statement->bindParam(8, $MaPH);

        $statement->execute();

        $connection = null;
    } catch (PDOException $e) {
        echo $e->getMessage();
    }
}

// insert Phu huynh

function insertParent($connection, $ten, $gt, $ns, $tuoi, $dc, $sdt, $email)
{
    $sql = "insert into  phuhuynh (TenPH, GioiTinh, NgaySinh, Tuoi, DiaChi, SDT, Email) values(?,?,?,?,?,?,?)";
    try {
        $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $statement =  $connection->prepare($sql);

        $statement->bindParam(1, $ten);
        $statement->bindParam(2, $gt);
        $statement->bindParam(3, $ns);
        $statement->bindParam(4, $tuoi);
        $statement->bindParam(5, $dc);
        $statement->bindParam(6, $sdt);
        $statement->bindParam(7, $email);
        $statement->execute();
        $maph = $connection->lastInsertId();

        if ($maph) {
            return $maph;
        } else {
            return null;
        }

        $connection = null;
    } catch (PDOException $e) {
        echo $e->getMessage();
    }
}

//insert tk_ph

function inserttk_ph($connection, $maph, $username, $pass, $ngaydk)
{
    $sql = "insert into tk_ph values(?,?,?,?)";
    try {
        $statement = $connection->prepare($sql);

        $statement->bindParam(1, $username);
        $statement->bindParam(2, $pass);
        $statement->bindParam(3, $maph);
        $statement->bindParam(4, $ngaydk);
        $statement->execute();
    } catch (PDOException $e) {
        echo $e->getMessage();
    }
}

// insert ph-hs
function insertph_hs($connection, $mahs, $maph)
{
    $sql = "insert into ph_hs values(?,?)";
    try {
        $statement = $connection->prepare($sql);

        $statement->bindParam(1, $mahs);
        $statement->bindParam(2, $maph);

        $statement->execute();
    } catch (PDOException $e) {
        echo $e->getMessage();
    }
}

// search phu huynh
function searchParent($connection, $key,$page,$collumSort, $order)
{
    $start = ($page-1) *50 ;
    if ($collumSort !=""){
        $sql = "select phuhuynh.MaPH, TenPH , GioiTinh,Tuoi,DiaChi, b1.dshs from phuhuynh  
        LEFT JOIN (SELECT ph_hs.MaPH,  GROUP_CONCAT(hocsinh.TenHS) AS dshs FROM ph_hs INNER JOIN hocsinh ON ph_hs.MaHS = hocsinh.MaHS GROUP BY ph_hs.MaPH) b1 on phuhuynh.MaPH = b1.MaPH WHERE phuhuynh.MaPH like :key or TenPH like :key or GioiTinh like :key or NgaySinh like :key or Tuoi like :key  or  DiaChi like :key  or  SDT like :key or  Email like :key or b1.dshs like :key order by ".$collumSort." ".$order." limit 50 offset ".strval($start) ;
    }else{
        $sql = "select phuhuynh.MaPH, TenPH , GioiTinh,Tuoi,DiaChi, b1.dshs from phuhuynh  
        LEFT JOIN (SELECT ph_hs.MaPH,  GROUP_CONCAT(hocsinh.TenHS) AS dshs FROM ph_hs INNER JOIN hocsinh ON ph_hs.MaHS = hocsinh.MaHS GROUP BY ph_hs.MaPH) b1 on phuhuynh.MaPH = b1.MaPH WHERE phuhuynh.MaPH like :key or TenPH like :key or GioiTinh like :key or NgaySinh like :key or Tuoi like :key  or  DiaChi like :key  or  SDT like :key or  Email like :key or b1.dshs like :key limit 50 offset ".strval($start) ;
    }    
    // $sql = "select phuhuynh.MaPH, TenPH , GioiTinh,Tuoi,DiaChi, b1.dshs from phuhuynh  
    //    LEFT JOIN (SELECT ph_hs.MaPH,  GROUP_CONCAT(hocsinh.TenHS) AS dshs FROM ph_hs INNER JOIN hocsinh ON ph_hs.MaHS = hocsinh.MaHS GROUP BY ph_hs.MaPH) b1 on phuhuynh.MaPH = b1.MaPH WHERE phuhuynh.MaPH like :key or TenPH like :key or GioiTinh like :key or NgaySinh like :key or Tuoi like :key  or  DiaChi like :key  or  SDT like :key or  Email like :key or b1.dshs like :key";
    try {
        $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $statement =  $connection->prepare($sql);
        $statement->bindValue(':key', "%$key%", PDO::PARAM_STR);
        $statement->execute();

        $listParent  = $statement->fetchAll(PDO::FETCH_ASSOC);

        $connection = null;
        return $listParent;
    } catch (PDOException $e) {
        echo $e->getMessage();
    }
}


function searchList($connection, $key)
{
    
   
    $sql = "select phuhuynh.MaPH, TenPH , GioiTinh,Tuoi,DiaChi, b1.dshs from phuhuynh  
    LEFT JOIN (SELECT ph_hs.MaPH,  GROUP_CONCAT(hocsinh.TenHS) AS dshs FROM ph_hs INNER JOIN hocsinh ON ph_hs.MaHS = hocsinh.MaHS GROUP BY ph_hs.MaPH) b1 on phuhuynh.MaPH = b1.MaPH WHERE phuhuynh.MaPH like :key or TenPH like :key or GioiTinh like :key or NgaySinh like :key or Tuoi like :key  or  DiaChi like :key  or  SDT like :key or  Email like :key or b1.dshs like :key" ;
    try {
        $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $statement =  $connection->prepare($sql);
        $statement->bindValue(':key', "%$key%", PDO::PARAM_STR);
     
        $statement->execute();

        $listStudent  = $statement->fetchAll(PDO::FETCH_ASSOC);

        $connection = null;
        return $listStudent;
    } catch (PDOException $e) {
        echo $e->getMessage();
    }
}

// Xoa phu huynh
function deleteParent($connection, $MaPH)
{
    $sql = "delete from phuhuynh where MaPH = ?";
    try {
        $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $statement =  $connection->prepare($sql);
        $statement->execute([$MaPH]);
        $connection = null;
    } catch (PDOException $e) {
        echo $e->getMessage();
    }
}
// Xoa hs trong ph_hs
function deleteParent_ph_hs($connection, $MaPH)
{
    $sql = "delete from ph_hs where MaPH = ?";
    try {
        $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $statement =  $connection->prepare($sql);
        $statement->execute([$MaPH]);
        $connection = null;
    } catch (PDOException $e) {
        echo $e->getMessage();
    }
}


// Xoa  tai khoan phu huynh
function deletetk_ph($connection, $MaPH)
{
    $sql = "delete from tk_ph where MaPH = ?";
    try {
        $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $statement =  $connection->prepare($sql);
        $statement->execute([$MaPH]);
        $connection = null;
    } catch (PDOException $e) {
        echo $e->getMessage();
    }
}




// select ds hs_ph cung tt hoc sinh
function listph_hs($connection)
{
    $sql = "SELECT ph_hs.MaHS , MaPH , hocsinh.TenHS, hocsinh.GioiTinh, hocsinh.NgaySinh, hocsinh.Tuoi, hocsinh.DiaChi, hocsinh.SDT , hocsinh.Email FROM `ph_hs` INNER JOIN hocsinh WHERE ph_hs.MaHS =  hocsinh.MaHS;";

    try {
        $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $statement =  $connection->prepare($sql);
        $statement->execute();

        $list = $statement->fetchAll(PDO::FETCH_ASSOC);
        $connection = null;
        return $list;
    } catch (PDOException $e) {
        echo $e->getMessage();
    }
}

// select ds hs_lop cung tt lop

function lisths_lop($connection)
{
    $sql = "SELECT MaHS, lop.MaLop , lop.TenLop, lop.LuaTuoi, lop.ThoiGian, lop.SLHS, lop.SLHSToiDa, lop.HocPhi, lop.SoBuoi, lop.SoBuoiDaToChuc, lop.TrangThai , hs_lop.SoBuoiNghi , hs_lop.GiamHocPhi , giaovien.TenGV FROM `hs_lop` inner JOIN lop INNER JOIN gv_lop INNER JOIN giaovien WHERE hs_lop.MaLop = lop.MaLop AND lop.MaLop = gv_lop.MaLop AND gv_lop.MAGV = giaovien.MaGV;";

    try {
        $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $statement =  $connection->prepare($sql);
        $statement->execute();

        $list = $statement->fetchAll(PDO::FETCH_ASSOC);

        $connection = null;
        return $list;
    } catch (PDOException $e) {
        echo $e->getMessage();
    }
}

// select tai khoan


function listtk_ph($connection)
{

    $sql = "select * from tk_ph ";
    try {
        $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $statement =  $connection->prepare($sql);
        $statement->execute();

        $list = $statement->fetchAll(PDO::FETCH_ASSOC);

        $connection = null;
        return $list;
    } catch (PDOException $e) {
        echo $e->getMessage();
    }
}

// update mat khau tk ph
function updatePassPH($connection, $username, $pass, $maph)
{

    $sql = "update tk_ph set UserName = ? ,  Password = ? where MaPH =?";
    try {
        $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $statement =  $connection->prepare($sql);

        $statement->bindParam(1, $username);
        $statement->bindParam(2, $pass);
        $statement->bindParam(3, $maph);


        $statement->execute();

        $connection = null;
    } catch (PDOException $e) {
        echo $e->getMessage();
    }
}

// select hs_lop

function listLopOfchid($connection)
{

    $sql = "select * from hs_lop ";
    try {
        $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $statement =  $connection->prepare($sql);
        $statement->execute();

        $list = $statement->fetchAll(PDO::FETCH_ASSOC);

        $connection = null;
        return $list;
    } catch (PDOException $e) {
        echo $e->getMessage();
    }
}


// select danh sách học viên
function listStudent($connection)
{
    $sql = "select * from hocsinh";
    try {
        $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $statement =  $connection->prepare($sql);
        $statement->execute();

        $listStudent  = $statement->fetchAll(PDO::FETCH_ASSOC);

        $connection = null;
        return $listStudent;
    } catch (PDOException $e) {
        echo $e->getMessage();
    }
}



function delete_ph_hs($connection, $maph, $mahs)
{
    $sql = "delete from ph_hs where MaPH = ?  and MaHS =?";
    try {
        $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $statement =  $connection->prepare($sql);
        $statement->bindParam(1, $maph);
        $statement->bindParam(2, $mahs);
        $statement->execute();
        $connection = null;
    } catch (PDOException $e) {
        echo $e->getMessage();
    }
}



function checkAccParent($connection, $maph)
{


    $sql = "select * from ph_hs where MaPH = ?";
    try {
        $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $statement =  $connection->prepare($sql);
        $statement->execute([$maph]);

        $list = $statement->fetchAll(PDO::FETCH_ASSOC);
        if ($list) {
            return true;
        }
    } catch (PDOException $e) {
        echo $e->getMessage();
    }

    $sql = "select * from yeucaulienket where MaPH = ?";
    try {
        $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $statement =  $connection->prepare($sql);
        $statement->execute([$maph]);

        $list = $statement->fetchAll(PDO::FETCH_ASSOC);
        if ($list) {
            return true;
        }
    } catch (PDOException $e) {
        echo $e->getMessage();
    }


    return false;
}
