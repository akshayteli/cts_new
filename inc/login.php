<?php
include "db.php";
include "function.php";
// login_id": un,"
$un=$_POST['login_id'];
$pw=$_POST['password'];
// echo $un;
// echo $pw;
$cond="login_id='".$un."' and password='".$pw."'";

// $sql = "SELECT * FROM login";
// $result =singlerec('*','login','login_id ='".$un."' and password ='".$pw."'');
$result =singlerec("*","login",$cond);
if($result){
	$str = '{
		"login_id" : "'.$result[0].'",
		"user_group": "'.$result[2].'",
	    "rep_manager_id": "'.$result[3].'"

	}';
	echo $str;
} else {
	echo 'Invalid User';
}


?>