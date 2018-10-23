<?php
header('Access-Control-Allow-Origin: *');
include 'tokengenerate.php';
include 'conexao.php';

switch($key) {
  case "asserttoken":
  $token=$json_obj->{'jsondata'}->{'token'};
  $userid=$json_obj->{'jsondata'}->{'id'};
  if($userid=='')$userid=-1;
  if($userid==-1){
    $stmt=$pdo->query("SELECT token FROM tokens WHERE token='$token' AND userid=-1");
    if($row=$stmt->fetch(PDO::FETCH_OBJ))
      echo json_encode(array('status'=>'success','result'=>$row));
    else
     echo  json_encode(array('status'=>'erro','msg'=>'problema ao verificar token'));
  }
  else{
  $stmt=$pdo->query("SELECT t.token,u.id,u.email,u.super FROM tokens AS t,admins AS u WHERE t.token='$token' AND t.userid=$userid AND u.id=$userid");
  if($row=$stmt->fetch(PDO::FETCH_OBJ))
    echo json_encode(array('status'=>'success','result'=>$row));
  else
   echo  json_encode(array('status'=>'erro','msg'=>'problema ao verificar token'));
  }
  break;
case "logout":
 $token=$json_obj->{'jsondata'}->{'token'};
 $userid=$json_obj->{'jsondata'}->{'id'};
 if($userid=='')$userid=-1;
 $stmt=$pdo->query("DELETE FROM tokens WHERE token='$token' AND userid=$userid");
 if($stmt)
  echo json_encode(array('status'=>'success'));
 else
  echo  json_encode(array('status'=>'erro','msg'=>'problema ao efetuar logout')); 
 break;
case "login":
  $email=$json_obj->{'jsondata'}->{'email'};
  $password=$json_obj->{'jsondata'}->{'password'};  
  $DeviceModel=$json_obj->{'jsondata'}->{'DeviceModel'};
  $DeviceType=$json_obj->{'jsondata'}->{'DeviceType'};
  $OS=$json_obj->{'jsondata'}->{'OS'};
  $OSVersion=$json_obj->{'jsondata'}->{'OSVersion'};
  $SDKVersion=$json_obj->{'jsondata'}->{'SDKVersion'};
  if($password!=""&&$email!="") {
    try {
      $stmt=$pdo->query("SELECT id FROM admins WHERE email='$email' AND senha='$password'");
      if($row=$stmt->fetch(PDO::FETCH_OBJ)) {
        $token=generateRandomString();
        $update="INSERT INTO tokens(token, userid,data,DeviceModel,DeviceType,OS,OSVersion,SDKVersion) VALUES('$token',$row->id,now(),'$DeviceModel','$DeviceType','$OS','$OSVersion','$SDKVersion')";
        $qr=$pdo->query($update);
        if($qr) {
          $st="SELECT u.id,u.email,u.super,t.token FROM admins AS u, tokens AS t WHERE u.id=$row->id AND t.token='$token'";
          $query=$pdo->query($st);
          if($row=$query->fetch(PDO::FETCH_OBJ)) {
            echo json_encode(array('status'=>'success','result'=>$row));
          }
          else echo json_encode(array('status'=>'erro','msg'=>'Problema desconhecido, contate o programador: neiamaralf@athena3d.com.br'));
        }
        else echo json_encode(array('status'=>'erro','msg'=>'problema ao inserir token'));
      }
      else echo json_encode(array('status'=>'erro','msg'=>'Email não cadastrado, por favor verifique.'));
    }
    catch(PDOException $e) {
     echo json_encode(array('status'=>'erro','msg'=>$e->getMessage()));
    }
  }
  else{
    $token=generateRandomString();
    $update="INSERT INTO tokens(token, userid,data,DeviceModel,DeviceType,OS,OSVersion,SDKVersion) VALUES('$token',-1,now(),'$DeviceModel','$DeviceType','$OS','$OSVersion','$SDKVersion')";
    $qr=$pdo->query($update);
    if($qr) {
      $st="SELECT token FROM  tokens  WHERE  token='$token'";
      $query=$pdo->query($st);
      if($row=$query->fetch(PDO::FETCH_OBJ)) {
        echo json_encode(array('status'=>'success','result'=>$row));
      }
      else echo json_encode(array('status'=>'erro','msg'=>'Problema desconhecido, contate o programador: neiamaralf@athena3d.com.br'));
    }
    else echo json_encode(array('status'=>'erro','msg'=>'problema ao inserir token'));
  }
  break;
}
?>