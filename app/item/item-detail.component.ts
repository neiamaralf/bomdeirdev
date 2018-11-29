import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Item } from "./item";
import { ItemService } from "./item.service";
import { RouterExtensions } from "nativescript-angular/router";
import { UserService } from "../shared/user/user.service";

@Component({
 selector: "ns-details",
 moduleId: module.id,
 templateUrl: "./item-detail.component.html",
})
export class ItemDetailComponent implements OnInit {
 item: Item;

 constructor(
  private itemService: ItemService,
  private route: ActivatedRoute,
  private routerExtensions: RouterExtensions,
  private userService: UserService,
  private router: Router
 ) { }

 goback() {
  this.routerExtensions.backToPreviousPage();
 }

 ngOnInit(): void {
  const id = this.route.snapshot.params["id"];
  this.item = this.itemService.getItem(id);
 }

 onclick(item) {
  if (item.name == "EVENTOS") {
   this.routerExtensions.navigate([encodeURI("/estilos/" + item.iddono + "/0/0/admin")],
    {
     clearHistory: false,
     transition: {
      name: "slide",
      duration: 500,
      curve: "ease"
     }
    }).
    then(() => {
     //this.carregando = false;
    });
  }

  else {
   console.dir(item);
   this.router.navigate(["/subitem/" + item.id]);
  }

 }
}
