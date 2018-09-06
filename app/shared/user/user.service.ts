import { Injectable } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { User } from "./user";
import { DbService } from "../db/db.service";
import { Config } from "../config";
import * as appsettings from "application-settings";
import * as platformModule from "tns-core-modules/platform";

@Injectable()
export class UserService {
  constructor(public user: User, public db: DbService, private routerExtensions: RouterExtensions) {
    user.goodtoken = false;
  }

  register(page) {
    return this.db.put({
      key: "adduser",
      email: this.user.email,
      password: this.user.senha,
      super: 1
    }
    )
      .subscribe(res => {
        if ((<any>res).status == 'success') {
          Config.token = (<any>res).result.email;
          alert("Sua conta foi criada com sucesso.");
          page.toggleDisplay();
          console.dir(res);
          console.log((<any>res).status);
        }
        else
          alert((<any>res).msg)
      });
  }

  login(loginpage) {
    console.log("this.user")
    console.dir(this.user)
    return this.db.post({
      key: "login",
      email: loginpage.userService.user.email,
      password: loginpage.userService.user.senha,
      DeviceModel: platformModule.device.model,
      DeviceType: platformModule.device.deviceType,
      OS: platformModule.device.os,
      OSVersion: platformModule.device.osVersion,
      SDKVersion: platformModule.device.sdkVersion
    }
    )
      .subscribe(res => {
        if ((<any>res).status == 'success') {
          Config.token = (<any>res).result.token
          console.dir(res);
          this.user = (<any>res).result;
          console.dir(this.user);
          if (this.user.id == undefined)
            this.user.super = 2;
          this.saveusr();
          if (this.user.super == 2)
            this.routerExtensions.navigate(["/items/0/0/onde"], { clearHistory: true })
          else
            this.routerExtensions.navigate(["/items/0/0/admin"], { clearHistory: true })
        }
        else
          alert((<any>res).msg);
      });
  }

  saveusr() {
    appsettings.setString("usr", JSON.stringify(this.user));
  }

  logout() {
    this.db.post({ key: 'logout', id: this.user.id, token: this.user.token })
      .subscribe(res => {
        if ((<any>res).status == 'success') {
          appsettings.remove('usr');
          this.user.goodtoken = false;
          this.routerExtensions.navigate(["/"], { clearHistory: true });
        } else {
          alert((<any>res).result.msg);
        }
      });
  }

  verifytoken(loginpage) {
    if (!appsettings.hasKey("usr")) return;
    var usr = JSON.parse(appsettings.getString("usr"));
    console.log("usr");
    console.dir(usr);
    this.user = (<any>usr);
    this.db.post({
      key: 'asserttoken',
      id: this.user.id,
      token: this.user.token
    }
    )
      .subscribe(res => {
        if ((<any>res).status == 'success') {
          console.dir((<any>res).result);
          this.user.goodtoken = true;
          if (this.user.super == 2)
            this.routerExtensions.navigate(["/items/0/0/onde"], { clearHistory: true })
          else
            this.routerExtensions.navigate(["/items/0/0/admin"], { clearHistory: true })
          console.dir(this.user);
        }
        else {
          console.log("token inválido");
         // appsettings.remove("usr");
          this.user.email = "";this.user.senha = "";
          this.routerExtensions.navigate(["/"]);
        }
      });

  }

  getCommonHeaders() {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    return headers;
  }


}
