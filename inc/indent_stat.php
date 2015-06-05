<?php
include "db.php";
$cond=$_POST['id'];

$sql = "SELECT * FROM `container_prd` where `indent_no` ='".$cond."' ";
// "SELECT `password` FROM `users` WHERE `username` = '".$loggin_user."' ";
$result = $conn->query($sql);
$str="";

if ($result->num_rows > 0) {
$str .='[';
    // output data of each row
    while($row = $result->fetch_assoc()) {
       $str .='{
            "indent_no": "'.$row['indent_no'].'",
            "lr_no": "'.$row['lr_no'].'",
            "vehicle_no": "'.$row['vehicle_no'].'",
            "container_no": "'.$row['container_no'].'",
            "seal_no": "'.$row['seal_no'].'"
            
        },';
    }
}
$str3=substr($str,0, -1);  
$str3.=']';
echo $str3;

?>