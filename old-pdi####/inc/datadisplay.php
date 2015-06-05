<?php

include "db.php";
// Create connection


$sql = "SELECT * FROM `container_prd` GROUP BY `indent_no`";

$result = $conn->query($sql);
$str="";

if ($result->num_rows > 0) {
$str .='[';
    // output data of each row
    while($row = $result->fetch_assoc()) {
       $str .='{
            "indent_no": "'.$row['indent_no'].'",
            "vehicle_no": "'.$row['vehicle_no'].'",
            "lr_no": "'.$row['lr_no'].'",
            "lr_date": "'.$row['lr_date'].'"            
        },';
    }
}
$str3=substr($str,0, -1);  
$str3.=']';
echo $str3;

?>