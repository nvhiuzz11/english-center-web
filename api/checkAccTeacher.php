<?php
    require '../lib/functionTeacher.php';

    
    
    $magv = $_POST['id'];
    echo checkAccTeacher($connection,$magv);

?>
