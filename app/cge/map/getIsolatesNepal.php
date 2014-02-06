<?php #! /usr/bin/php5 -q
################################################################################
#                                  CGE MAP                                     #
################################################################################


// CONNECT TO THE DATABASE
// TODO: !!!!
header('Content-Type: application/json');
$string = file_get_contents("./nepal_data.json");
echo $string;


?>
