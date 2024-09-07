<?php
        require '../lib/functionStudent.php';

        $mahs = $_POST['id'];
        echo checkAccStudent($connection,$mahs);


?>