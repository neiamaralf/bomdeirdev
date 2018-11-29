import { Injectable } from "@angular/core";
import { UserService } from "../shared/user/user.service";
class local {
 cidade: string;
 uf: string;
}

@Injectable()
export class CidadesService {
 public locais: Array<local> = [];
 public curlocal: number = 0;
 public alterado: boolean = false;
 public indexalterado: boolean = false;
 constructor(private userService: UserService) {
  console.log("itemservice");
  console.dir(userService.user);
  console.log(userService.user.super);
  this.inititems();
 }

 inititems() {

 }
}
