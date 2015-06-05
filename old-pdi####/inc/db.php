<?php
	$dbname = "bajajPrj";
	$hostname = "bajajPrj.db.11965675.hostedresource.com";
	$username = "bajajPrj";
	$password = "Bajaj@123";
	$conn = new mysqli($hostname, $username, $password, $dbname);
	// Check connection
	if ($conn->connect_error) {
	    die("Connection failed: ". $conn->connect_error);
	}
 ?>