<?php

$path_dir = __DIR__ . '/../lib';

include $path_dir . '/database.php';

//select ls thu chi
function searchHistory($connection, $key, $collumSort, $order)
{

    if ($collumSort != "") {

        $sql = 'SELECT * FROM (SELECT TenHD, hocsinh.TenHS AS "DoiTuong", "thu" AS "Loai", "Học phí" AS LoaiHD, lsthp.ThoiGian AS "ThoiGianTT", lsthp.SoTien FROM lsthp INNER JOIN hdhocphi ON lsthp.MaHD = hdhocphi.MaHD INNER JOIN hocsinh ON hdhocphi.MaHS = hocsinh.MaHS UNION SELECT TenHD, giaovien.TenGV AS "DoiTuong", "chi" AS "Loai", "Lương giáo viên" AS LoaiHD, ThoiGianTT, SoTien FROM luonggv INNER JOIN giaovien ON luonggv.MaGV = giaovien.MaGV WHERE ThoiGianTT IS NOT NULL UNION SELECT TenHD, NULL AS "DoiTuong", "chi" AS "Loai", LoaiHD, ThoiGianTT, SoTien FROM chiphikhac WHERE ThoiGianTT IS NOT NULL ) AS combined_result
            where TenHD like :key or DoiTuong like :key or LoaiHD like :key or ThoiGianTT like :key or SoTien like :key order by ' . $collumSort . " " . $order;
    } else {
        $sql = 'SELECT * FROM (SELECT TenHD, hocsinh.TenHS AS "DoiTuong", "thu" AS "Loai", "Học phí" AS LoaiHD, lsthp.ThoiGian AS "ThoiGianTT", lsthp.SoTien FROM lsthp INNER JOIN hdhocphi ON lsthp.MaHD = hdhocphi.MaHD INNER JOIN hocsinh ON hdhocphi.MaHS = hocsinh.MaHS UNION SELECT TenHD, giaovien.TenGV AS "DoiTuong", "chi" AS "Loai", "Lương giáo viên" AS LoaiHD, ThoiGianTT, SoTien FROM luonggv INNER JOIN giaovien ON luonggv.MaGV = giaovien.MaGV WHERE ThoiGianTT IS NOT NULL UNION SELECT TenHD, NULL AS "DoiTuong", "chi" AS "Loai", LoaiHD, ThoiGianTT, SoTien FROM chiphikhac WHERE ThoiGianTT IS NOT NULL ) AS combined_result
            where TenHD like :key or DoiTuong like :key or LoaiHD like :key or ThoiGianTT like :key or SoTien like :key ORDER BY ThoiGianTT DESC';
    }

    //         $sql = ' SELECT * FROM (SELECT TenHD, hocsinh.TenHS AS "DoiTuong", "thu" AS "Loai", "Học phí" AS LoaiHD, lsthp.ThoiGian AS "ThoiGianTT", lsthp.SoTien FROM lsthp INNER JOIN hdhocphi ON lsthp.MaHD = hdhocphi.MaHD INNER JOIN hocsinh ON hdhocphi.MaHS = hocsinh.MaHS UNION SELECT TenHD, giaovien.TenGV AS "DoiTuong", "chi" AS "Loai", "Lương giáo viên" AS LoaiHD, ThoiGianTT, SoTien FROM luonggv INNER JOIN giaovien ON luonggv.MaGV = giaovien.MaGV WHERE ThoiGianTT IS NOT NULL UNION SELECT TenHD, NULL AS "DoiTuong", "chi" AS "Loai", LoaiHD, ThoiGianTT, SoTien FROM chiphikhac WHERE ThoiGianTT IS NOT NULL ) AS combined_result

    // where TenHD like :key or DoiTuong like :key or LoaiHD like :key or ThoiGianTT like :key or SoTien like :key ORDER BY ThoiGianTT DESC';
    try {
        $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $statement = $connection->prepare($sql);
        $statement->bindValue(':key', "%$key%", PDO::PARAM_STR);
        $statement->execute();

        $list = $statement->fetchAll(PDO::FETCH_ASSOC);

        $connection = null;
        return $list;
    } catch (PDOException $e) {
        echo $e->getMessage();
    }
}
