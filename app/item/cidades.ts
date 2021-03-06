import { Component, OnInit } from "@angular/core";
import { CidadesService } from "./cidades.service";
import * as appsettings from "application-settings";
import { SearchBar } from "ui/search-bar";
import { Page } from "tns-core-modules/ui/page";
import { RouterExtensions } from "nativescript-angular/router";
import { ActivatedRoute } from '@angular/router';
import { UserService } from "../shared/user/user.service";

@Component({
 selector: "ns-cidades",
 moduleId: module.id,
 templateUrl: "./cidades.html",
})
export class CidadesComponent implements OnInit {
 carregando: boolean = false;
 showaddlocal: boolean = false;
 cidades: any[] = [];

 constructor(
  private userService: UserService,
  private routerExtensions: RouterExtensions,
  private page: Page,
  private cidadesService: CidadesService,
  private router: ActivatedRoute
 ) {
  if (router.snapshot.params["add"] == "true") {
   this.showaddlocal = true;
  }
 }
 ngOnInit(): void {
 }

 localclic(item, i) {
  console.log(i);
  if (i != this.cidadesService.curlocal) {
   this.cidadesService.indexalterado = true;
   this.cidadesService.curlocal = i;
  }
  if (this.routerExtensions.canGoBack())
   this.routerExtensions.backToPreviousPage();
  else {
   this.cidadesService.alterado = true;
   this.routerExtensions.navigate(["/items/0/0/onde"],
    {
     clearHistory: true,
     transition: {
      name: "slide",
      duration: 200,
      curve: "ease"
     }
    }).
    then(() => {
     this.carregando = false;
    });
  }

 }

 goback() {
  if (this.showaddlocal)
   this.showaddlocal = false;
  else
   this.routerExtensions.backToPreviousPage();
 }


 dellocal(index) {
  this.cidadesService.alterado = true;
  this.cidadesService.curlocal = 0;
  this.cidadesService.locais.splice(index, 1);
  if (this.cidadesService.locais.length == 0)
   appsettings.remove("locais");
  else
   appsettings.setString("locais", JSON.stringify(this.cidadesService.locais));
 }

 add() {
  var searchBar: SearchBar = <SearchBar>this.page.getViewById("sblocal");
  this.showaddlocal = true;
  setTimeout(() => {
   searchBar.focus();

  }, 500);
 }

 public onTextChanged(args) {
  let searchBar = <SearchBar>args.object;
  console.log("SearchBar text changed! New value: " + searchBar.text);
  if (searchBar.text != undefined) {

   this.cidades = [];
   this.userService.db
    .get("key=cidadeoucep" +
     "&cidade=" + searchBar.text)
    .subscribe(res => {
     if (res != null) {
      (<any>res).result.forEach(row => {
       this.cidades.push({
        row
       })
      });
      console.dir(this.cidades);
     }
     //this.carregando = false;
    });
  }
 }

 lvcidades(item) {
  //console.dir(item);
  this.showaddlocal = false;
  if (this.cidadesService.locais.find(x => x.cidade == item.row.nome) == undefined) {
   this.cidadesService.locais.push(
    {
     cidade: item.row.nome,
     uf: item.row.uf
    }
   )
   this.cidadesService.alterado = true;
   this.cidadesService.curlocal = 0;
   appsettings.setString("locais", JSON.stringify(this.cidadesService.locais));
  }

 }
}