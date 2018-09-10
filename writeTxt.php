<?php
$value = file_get_contents($_POST["file"]) + $_POST["kaffee"];
file_put_contents($_POST["file"], $value);

echo $value;
?>