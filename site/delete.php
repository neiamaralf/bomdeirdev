<?php
 header('Access-Control-Allow-Origin: *'); 
 include 'conexao.php';
 $key= $_REQUEST['key'];
 switch($key) {
  case 'eventos':
  $id=$_REQUEST['id'];
  $sql="DELETE FROM eventos  WHERE  id=$id";
  $stmt=$pdo->query($sql);
  if($stmt){
   echo json_encode(array('status'=>'success'));
  } 
  break;
  case 'estilos':
  case 'locais':
  case 'artistas':
  $idkey=$key=='estilos'?'idestilo':$key=='locais'?'idlocal':'idartista';
  $id=$_REQUEST['id'];
  $sql="SELECT id FROM eventos  WHERE  $idkey=$id";
  $stmt=$pdo->query($sql);
  if($stmt->rowCount()>0){
      echo json_encode(array('status'=>'erro'));
  }
  else{
      $sql="DELETE FROM $key  WHERE  id=$id";
      $stmt=$pdo->query($sql);
      if($stmt){
          echo json_encode(array('status'=>'success'));
      }
  }
  
  break;
 }
 ?>
