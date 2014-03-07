<?php #! /usr/bin/php5 -q
################################################################################
#                                  CGE MAP                                     #
################################################################################


// CONNECT TO THE DATABASE
// TODO: !!!!
header('Content-Type: application/json');
/* $string_1 = file_get_contents("./influenza_data_2.json"); */
$string_2 = file_get_contents("./influenza_data.json");
$string_3 = file_get_contents("./DT104.json");
$string_4 = file_get_contents("./influenza_data.js");
/* $result = array_merge($string_1, $string_2, $string_3); */
echo $string_2;


?>
