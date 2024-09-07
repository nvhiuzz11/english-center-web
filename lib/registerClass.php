<?php

// regist hoc sinh vao lop chua mo
function registToClass($maHS, $maLop, $giamHP, $connection)
{
    $sql = "insert into hs_lop values(?,?,0,?)";
    try {
        $statement = $connection->prepare($sql);

        $statement->bindParam(1, $maHS);
        $statement->bindParam(2, $maLop);
        $statement->bindParam(3, $giamHP);
        $statement->execute();
    } catch (PDOException $e) {
        echo $e->getMessage();
    }
}

//show danh sach hoc sinh lien ket
function studentOfParentRegister($maPH, $connection)
{
    $sql = "SELECT * FROM hocsinh WHERE hocsinh.MaHS IN ( SELECT MaHS FROM ph_hs WHERE ph_hs.MaPH = ?)";
    try {
        $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $statement =  $connection->prepare($sql);
        $statement->bindParam(1, $maPH);
        $statement->execute();

        $list  = $statement->fetchAll(PDO::FETCH_ASSOC);

        $connection = null;
        return $list;
    } catch (PDOException $e) {
        echo $e->getMessage();
    }
}
//update SLHS cua lop
function updateStudentCount($maLop, $slhs, $connection)
{
    $sql = "UPDATE lop SET SLHS = ? WHERE MaLop = ?";
    try {
        $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $statement =  $connection->prepare($sql);

        $statement->bindParam(1, $slhs);
        $statement->bindParam(2, $maLop);
        $statement->execute();

        $connection = null;
    } catch (PDOException $e) {
        echo $e->getMessage();
    }
}

//check lien ket ph-hs
function checkExistWithChild($maPH, $connection)
{
    $sql = "select * from ph_hs where ph_hs.MaPH = ? ";
    try {
        $statement = $connection->prepare($sql);
        $statement->bindParam(1, $maPH);
        $statement->execute();
        $data = $statement->fetch(PDO::FETCH_ASSOC);
        if ($data) {
            return true;
        } else {
            return false;
        }
    } catch (PDOException $e) {
        echo $e->getMessage();
    }
}
//danh sach hoc sinh
function checkRegistedChild($maLop, $connection)
{
    $sql = "SELECT * FROM `hs_lop` WHERE MaLop = ?;";
    try {
        $statement = $connection->prepare($sql);
        $statement->bindParam(1, $maLop);
        $statement->execute();
        $data = $statement->fetchAll(PDO::FETCH_ASSOC);
        $connection = null;
        return $data;
    } catch (PDOException $e) {
        echo $e->getMessage();
    }
}
function dataClassByIdRegister($malop, $connection)
{
    $sql = "select * from lop where MaLop = ?";
    try {
        $statement = $connection->prepare($sql);
        $statement->bindParam(1, $malop);
        $statement->execute();
        $data = $statement->fetch(PDO::FETCH_ASSOC);
        return $data;
    } catch (PDOException $e) {
        $e->getMessage();
    }
    return null;
}
//
function getDiscountRegister($malop,$connection){
    $sql = "select * from lopghp where MaLop = ?";
    try{
        $statement = $connection->prepare($sql);
        $statement->bindParam(1, $malop);
        $statement->execute();
        $data = $statement->fetch(PDO::FETCH_ASSOC);
        return $data;
    }catch(PDOException $e) {
        $e->getMessage();
    }
}