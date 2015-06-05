<?php
include "db.php";
$cond=$_POST['id'];
// $cond='5148826';
$c_val=$_POST['c_val'];
$s_val=$_POST['s_val'];
$tr_l=strlen($cond);
$tr=substr($cond,$tr_l-4,$tr_l);
$trid ='T'.sprintf("%04d", $tr);
echo $c_val;

$sql = "UPDATE container_prd set `container_no`='$c_val',`seal_no`='$s_val',`transaction_id`='$trid' where `lr_no` ='".$cond."'";
$result = $conn->query($sql);
?>