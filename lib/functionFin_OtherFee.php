<?php


$path_dir = __DIR__ . '/../lib';

include $path_dir . '/database.php';

function searchChiPhiKhac($connection, $key,$collumSort, $order)
{   

    if ($collumSort !=""){
        if($collumSort == "ThoiGian"){
            $sql = 'SELECT MaHD, TenHD, LoaiHD, ThoiGian, SoTien, ThoiGianTT, TrangThai  FROM chiphikhac WHERE  
            MaHD like :key or TenHD like :key or LoaiHD like :key or ThoiGian like :key or SoTien like :key or ThoiGianTT like :key  or TrangThai like :key order by STR_TO_DATE(CONCAT("01/", ThoiGian), "%d/%m/%Y" )'.$order ;
        }else{

            $sql = "SELECT MaHD, TenHD, LoaiHD, ThoiGian, SoTien, ThoiGianTT, TrangThai  FROM chiphikhac WHERE  
            MaHD like :key or TenHD like :key or LoaiHD like :key or ThoiGian like :key or SoTien like :key or ThoiGianTT like :key  or TrangThai like :key order by ".$collumSort." ".$order ;
        }

       
    }else{
        $sql = "SELECT MaHD, TenHD, LoaiHD, ThoiGian, SoTien, ThoiGianTT, TrangThai  FROM chiphikhac WHERE  
        MaHD like :key or TenHD like :key or LoaiHD like :key or ThoiGian like :key or SoTien like :key or ThoiGianTT like :key  or TrangThai like :key order by MaHD desc" ;
    }

    // $sql = "SELECT MaHD, TenHD, LoaiHD, ThoiGian, SoTien, ThoiGianTT, TrangThai  FROM chiphikhac WHERE  
    //      MaHD like :key or TenHD like :key or LoaiHD like :key or ThoiGian like :key or SoTien like :key or ThoiGianTT like :key  or TrangThai like :key order by MaHD desc";
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


function listBillCPK($connection)
{
 
     $sql = "SELECT MaHD, TenHD, LoaiHD, ThoiGian, SoTien, ThoiGianTT, TrangThai  FROM chiphikhac  ";
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


// // insert chi phi khac
function insertChiPhiKhac($connection, $tenHD, $loaiHD, $tg, $st, $tgtt,$tt)
{
    
    $sql = "insert into  chiphikhac (TenHD, LoaiHD, ThoiGian, SoTien, ThoiGianTT, TrangThai) values(?,?,?,?,?,?)";
    try {
        $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $statement =  $connection->prepare($sql);

        $statement->bindParam(1, $tenHD);
        $statement->bindParam(2, $loaiHD);
        $statement->bindParam(3, $tg);
        $statement->bindParam(4, $st);
        $statement->bindParam(5, $tgtt);
        $statement->bindParam(6, $tt);

        $statement->execute();


        $connection = null;
    } catch (PDOException $e) {
        echo $e->getMessage();
    }
}


// // update trang thai luonggv
function updateStatusChiPhiKhac($connection, $tt, $tg,$mal)
{

    $sql = "update chiphikhac set  TrangThai = ?  , ThoiGianTT = ? where MaHD = ?";
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

// update chi phi khac
function updateChiPhiKhac($connection, $tenhd, $loaiHD,$tg , $st , $tt, $tg_tt, $mahd)
{

    $sql = "update chiphikhac set TenHD = ?, LoaiHD = ?, ThoiGian = ?, SoTien = ?,  TrangThai = ?  , ThoiGianTT = ? where MaHD = ?";
    try {
        $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $statement =  $connection->prepare($sql);

        $statement->bindParam(1, $tenhd);
        $statement->bindParam(2, $loaiHD);
        $statement->bindParam(3, $tg);
        $statement->bindParam(4, $st);
        $statement->bindParam(5, $tt);
        $statement->bindParam(6, $tg_tt);
        $statement->bindParam(7, $mahd);
        


        $statement->execute();

        $connection = null;
    } catch (PDOException $e) {
        echo $e->getMessage();
    }
}

//  //Xoa chi phi khac
function deleteChiPhiKhac($connection, $mahd)
{
    $sql = "delete from chiphikhac where MaHD = ?";
    try {
        $connection -> setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $statement =  $connection->prepare($sql);
        $statement-> execute([$mahd]);
        $connection = null;
    } catch (PDOException $e) {
        echo $e->getMessage();
    }

}
