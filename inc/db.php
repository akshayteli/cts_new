<?php
	$hostname = "localhost";
	$username = "root";
	$password = "";
	$databaseName = "cts";
	//Connecting to database
	$conn = mysql_connect($hostname, $username, $password); 
	if (!$conn) {
		die('Could not connect: ' . mysql_error());
	}
	
	mysql_select_db($databaseName); 
	
?>