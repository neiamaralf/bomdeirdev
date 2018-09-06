import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { UserService } from "../../shared/user/user.service";
import { Page } from "ui/page";
import { Color } from "color";
import { View } from "ui/core/view";

@Component({
  selector: "my-app",
  templateUrl: "./pages/login/login.html",
  styleUrls: ["pages/login/login-common.css", "pages/login/login.css"]
})
export class LoginComponent implements OnInit {
  isLoggingIn = true;
  admin = false;
  email = "f"
  senha = ""

  @ViewChild("container") container: ElementRef;

  constructor(public userService: UserService, private page: Page) {
    userService.user.email = ""
    userService.user.senha = ""
    userService.verifytoken(this);
  }

  showadmin() {
    this.admin = !this.admin;
  }


  ngOnInit() {
    this.page.actionBarHidden = true;
    //this.page.backgroundImage = "res://bg_login";
  }

  submit() {
    if (this.isLoggingIn)
      this.userService.login(this);
    else
      this.userService.register(this);
  }


  toggleDisplay() {
    this.isLoggingIn = !this.isLoggingIn;
    let container = <View>this.container.nativeElement;
    container.animate({
      backgroundColor: this.isLoggingIn ? new Color("darkgray") : new Color("#601217"),
      duration: 200
    });
  }
}
