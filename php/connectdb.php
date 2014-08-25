<?php
	define ('DB_USER', 'jacques');
	define ('DB_PASSWORD', 'netandre2008!');
	define ('DB_HOST','localhost');
	define ('DB_NAME','jacques_flexitutor');
	
	//Run the connection to the Database
	$dbc = mysqli_connect(DB_HOST,DB_USER,DB_PASSWORD,DB_NAME) or die('Could not connect to MySQL: ' . mysqli_connect_error());
?>