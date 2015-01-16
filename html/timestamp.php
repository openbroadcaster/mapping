<?php
$filename = "../includes/alerts.json";
if (file_exists($filename)) {
    $time_stamp = gmdate ("F d Y H:i:s", filemtime($filename));
    echo " Last NAAD Update: " . json_encode($time_stamp) . " UTC";
}
?>
