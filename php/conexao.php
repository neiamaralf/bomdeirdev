<?php 
$hn='localhost';
$un='athen394';
$pwd='ldae08';
$db='athen394_bomdeir';
$cs='utf8';
$dsn="mysql:host=".$hn.";port=3306;dbname=".$db.";charset=".$cs;
$opt=array(PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION,PDO::ATTR_DEFAULT_FETCH_MODE=>PDO::FETCH_OBJ,PDO::ATTR_EMULATE_PREPARES=>false,);
$pdo=new PDO($dsn,$un,$pwd,$opt);
$json_str = file_get_contents('php://input');
$json_obj = json_decode($json_str);
$key= $json_obj->{'jsondata'}->{'key'};
$data=array();
?>