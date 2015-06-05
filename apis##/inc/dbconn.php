<?php

	// $hostname = "localhost";
	// $username = "root";
	// $password = "";

	$databaseName = "bajaj";

	$hostname = getenv('DB_HOST');
	$username = getenv("DB_USER");
	$password = getenv("DB_PASSWORD");

	//Connecting to database
	$link = mysql_connect($hostname, $username, $password); 
	if (!$link) {
		die('Could not connect: ' . mysql_error());
	}

	mysql_select_db($databaseName); 

?>