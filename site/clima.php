<?php
 header('Access-Control-Allow-Origin: *');
  function download_page($path){
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL,$path);
    curl_setopt($ch, CURLOPT_FAILONERROR,1);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION,1);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
    curl_setopt($ch, CURLOPT_TIMEOUT, 15);
    $retValue = curl_exec($ch);          
    curl_close($ch);
    return $retValue;
}
if(isset($_REQUEST['cidade']))
  $json = json_encode(simplexml_load_string(download_page('http://servicos.cptec.inpe.br/XML/listaCidades?city='.$_REQUEST['cidade'])));
else if(isset($_REQUEST['idcidade']))
$json = json_encode(simplexml_load_string(download_page('http://servicos.cptec.inpe.br/XML/cidade/7dias/'.$_REQUEST['idcidade'].'/previsao.xml')));

mb_convert_variables('UTF-8','ISO-8859-1',$json);
echo $json;
 ?>