<?php
header('Access-Control-Allow-Origin: *');
include 'conexao.php';

switch($key) { 
case "adduser":
  $name=$json_obj->{'jsondata'}->{'name'};
  $password=$json_obj->{'jsondata'}->{'password'};
  $email=$json_obj->{'jsondata'}->{'email'};
  $super=$json_obj->{'jsondata'}->{'super'};
  $sql="INSERT INTO admins(senha,email,super,datacadastro) VALUES('$password','$email',$super,now())";
  
  try {
    $qr=$pdo->query($sql);
    if($qr) {     
        $stmt=$pdo->query("SELECT * FROM admins WHERE email='$email' ");
        if($row=$stmt->fetch(PDO::FETCH_OBJ)) {          
          echo json_encode(array('status'=>'success','result'=>$row));
        }          
    }
    else
     echo json_encode(array('status'=>'erro','msg'=>'Problema desconhecido, contate o programador: neiamaralf@athena3d.com.br'));
  }
  catch(PDOException $e) {
    echo json_encode(array('status'=>'erro','msg'=>$e->getMessage()));
  }
  break;  
  case "estilos":
  $op=$json_obj->{'jsondata'}->{'op'};
  if($op=="adicionar"){
    $name=$json_obj->{'jsondata'}->{'name'};
    $idcategoria=$json_obj->{'jsondata'}->{'idcategoria'};
    $sql="INSERT INTO estilos(nome,idcategoria) VALUES('$name',$idcategoria)";  
    try {
      $qr=$pdo->query($sql);
      if($qr) {     
          $stmt=$pdo->query("SELECT * FROM estilos WHERE idcategoria = $idcategoria AND id = (SELECT MAX(ID) FROM estilos WHERE idcategoria = $idcategoria)");
          
          if($row=$stmt->fetch(PDO::FETCH_OBJ)) {          
            echo json_encode(array('status'=>'success','key'=>$key,'result'=>$row));
          }          
      }
      else
       echo json_encode(array('status'=>'erro','msg'=>'Problema desconhecido, contate o programador: neiamaralf@athena3d.com.br'));
    }
    catch(PDOException $e) {
      echo json_encode(array('status'=>'erro','msg'=>$e->getMessage()));
    }

  }
  else{
    $name=$json_obj->{'jsondata'}->{'name'};
    $id=$json_obj->{'jsondata'}->{'id'};  
    $sql="UPDATE estilos SET nome='$name' WHERE id = $id";
    try {
      $qr=$pdo->query($sql);
      if($qr) {     
          $stmt=$pdo->query("SELECT * FROM estilos WHERE id = $id");
          
          if($row=$stmt->fetch(PDO::FETCH_OBJ)) {          
            echo json_encode(array('status'=>'success','key'=>$key,'result'=>$row));
          }          
      }
      else
       echo json_encode(array('status'=>'erro','msg'=>'Problema desconhecido, contate o programador: neiamaralf@athena3d.com.br'));
    }
    catch(PDOException $e) {
      echo json_encode(array('status'=>'erro','msg'=>$e->getMessage()));
    }
  }  
  break;
  case "artistas":
  $op=$json_obj->{'jsondata'}->{'op'};
  if($op=="adicionar"){
    $name=$json_obj->{'jsondata'}->{'name'};
    $idcategoria=$json_obj->{'jsondata'}->{'idcategoria'};
    $idadmin=$json_obj->{'jsondata'}->{'idadmin'};
    $sql="INSERT INTO artistas(nome,idcategoria,idadmin) VALUES('$name',$idcategoria,$idadmin)";  
    try {
      $qr=$pdo->query($sql);
      if($qr) {     
          $stmt=$pdo->query("SELECT * FROM artistas WHERE idcategoria = $idcategoria AND id = (SELECT MAX(ID) FROM artistas WHERE idcategoria = $idcategoria)");
          
          if($row=$stmt->fetch(PDO::FETCH_OBJ)) {          
            echo json_encode(array('status'=>'success','key'=>$key,'result'=>$row));
          }          
      }
      else
       echo json_encode(array('status'=>'erro','msg'=>'Problema desconhecido, contate o programador: neiamaralf@athena3d.com.br'));
    }
    catch(PDOException $e) {
      echo json_encode(array('status'=>'erro','msg'=>$e->getMessage()));
    }

  }
  else{
  $name=$json_obj->{'jsondata'}->{'name'};
  $id=$json_obj->{'jsondata'}->{'id'};  
  $sql="UPDATE artistas SET nome='$name' WHERE id = $id";
  try {
    $qr=$pdo->query($sql);
    if($qr) {     
        $stmt=$pdo->query("SELECT * FROM artistas WHERE id = $id");
        
        if($row=$stmt->fetch(PDO::FETCH_OBJ)) {          
          echo json_encode(array('status'=>'success','key'=>$key,'result'=>$row));
        }          
    }
    else
     echo json_encode(array('status'=>'erro','msg'=>'Problema desconhecido, contate o programador: neiamaralf@athena3d.com.br'));
  }
  catch(PDOException $e) {
    echo json_encode(array('status'=>'erro','msg'=>$e->getMessage()));
  }
}
  break;
  case "locais":
  $op=$json_obj->{'jsondata'}->{'op'};
  if($op=="adicionar"){
    $nome=$json_obj->{'jsondata'}->{'nome'};
    $numero=$json_obj->{'jsondata'}->{'numero'};
    $complemento=$json_obj->{'jsondata'}->{'complemento'};
    $fone=$json_obj->{'jsondata'}->{'fone'};
    $email=$json_obj->{'jsondata'}->{'email'};
    $site=$json_obj->{'jsondata'}->{'site'};
    $cep=$json_obj->{'jsondata'}->{'cep'};
    $logradouro=$json_obj->{'jsondata'}->{'logradouro'};
    $bairro=$json_obj->{'jsondata'}->{'bairro'};
    $localidade=$json_obj->{'jsondata'}->{'localidade'};
    $uf=$json_obj->{'jsondata'}->{'uf'};
    $idadmin=$json_obj->{'jsondata'}->{'idadmin'};
    $sql="INSERT INTO locais(nome,numero,complemento,fone,email,site,cep,logradouro,bairro,localidade,uf,idadmin) VALUES('$nome',$numero,'$complemento','$fone','$email','$site','$cep','$logradouro','$bairro','$localidade','$uf',$idadmin)";  
    try {
      $qr=$pdo->query($sql);
      if($qr) {     
          $stmt=$pdo->query("SELECT * FROM locais WHERE idadmin = $idadmin AND id = (SELECT MAX(ID) FROM locais WHERE idadmin = $idadmin)");
          
          if($row=$stmt->fetch(PDO::FETCH_OBJ)) {          
            echo json_encode(array('status'=>'success','key'=>$key,'result'=>$row));
          }          
      }
      else
       echo json_encode(array('status'=>'erro','msg'=>'Problema desconhecido, contate o programador: neiamaralf@athena3d.com.br'));
    }
    catch(PDOException $e) {
      echo json_encode(array('status'=>'erro','msg'=>$e->getMessage()));
    }

  }
  else{  
  $id=$json_obj->{'jsondata'}->{'id'};  
  $nome=$json_obj->{'jsondata'}->{'nome'};
  $numero=$json_obj->{'jsondata'}->{'numero'};
  $complemento=$json_obj->{'jsondata'}->{'complemento'};
  $fone=$json_obj->{'jsondata'}->{'fone'};
  $email=$json_obj->{'jsondata'}->{'email'};
  $site=$json_obj->{'jsondata'}->{'site'};
  $sql="UPDATE locais SET nome='$nome',numero=$numero,complemento='$complemento',fone='$fone',email='$email',site='$site' WHERE id = $id";
  try {
    $qr=$pdo->query($sql);
    if($qr) {     
        $stmt=$pdo->query("SELECT * FROM locais WHERE id = $id");
        
        if($row=$stmt->fetch(PDO::FETCH_OBJ)) {          
          echo json_encode(array('status'=>'success','key'=>$key,'result'=>$row));
        }          
    }
    else
     echo json_encode(array('status'=>'erro','msg'=>'Problema desconhecido, contate o programador: neiamaralf@athena3d.com.br'));
  }
  catch(PDOException $e) {
    echo json_encode(array('status'=>'erro','msg'=>$e->getMessage()));
  }
}
  break;
  case 'eventos':
  $op=$json_obj->{'jsondata'}->{'op'};
  if($op=="adicionar"){  
    $idadmin=$json_obj->{'jsondata'}->{'idadmin'};
    $idestilo=$json_obj->{'jsondata'}->{'idestilo'};
    $idartista=$json_obj->{'jsondata'}->{'idartista'};
    $idcategoria=$json_obj->{'jsondata'}->{'idcategoria'};
    $idlocal=$json_obj->{'jsondata'}->{'idlocal'};
    $datahorario=$json_obj->{'jsondata'}->{'datahorario'};
    $nome=$json_obj->{'jsondata'}->{'nome'};
    $descricao=$json_obj->{'jsondata'}->{'descricao'};
    $sql="INSERT INTO eventos(idadmin,idestilo,idartista,idcategoria,idlocal,datahorario,nome,descricao) VALUES($idadmin,$idestilo,$idartista,$idcategoria,$idlocal,'$datahorario','$nome','$descricao')";  
    try {
      $qr=$pdo->query($sql);
      if($qr) {     
          $stmt=$pdo->query("SELECT * FROM eventos WHERE idadmin = $idadmin AND id = (SELECT MAX(ID) FROM eventos WHERE idadmin = $idadmin)");
          
          if($row=$stmt->fetch(PDO::FETCH_OBJ)) {          
            echo json_encode(array('status'=>'success','key'=>$key,'result'=>$row));
          }          
      }
      else
       echo json_encode(array('status'=>'erro','msg'=>'Problema desconhecido, contate o programador: neiamaralf@athena3d.com.br'));
    }
    catch(PDOException $e) {
      echo json_encode(array('status'=>'erro','msg'=>$e->getMessage()));
    }

  }
  break;
}


?>