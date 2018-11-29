import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { fromObject } from "data/observable";
import { DbService } from "../shared/db/db.service";
import { ItemService } from "./item.service";
import { Item } from "./item";
import { TextField } from "ui/text-field";
import { Page } from "tns-core-modules/ui/page";
import { RouterExtensions } from "nativescript-angular/router";

@Component({
 selector: "ns-locais",
 moduleId: module.id,
 templateUrl: "./locais.html",
})
export class LocaisComponent implements OnInit {
 dados = fromObject({
  nome: "",
  numero: "",
  fone: '',
  email: '',
  site: '',
  acao: '',
  cep: '',
  logradouro: '',
  bairro: '',
  localidade: '',
  uf: '',
  idcategoria: '',
  idadmin: '',
  itemid: 0
 });

 item: Item;

 constructor(
  private routerExtensions: RouterExtensions,
  private page: Page,
  private itemService: ItemService,
  private route: ActivatedRoute,
  private db: DbService
 ) {

 }

 ngOnInit(): void {
  var itemid: number = this.route.snapshot.params["itemid"];
  this.dados.set("itemid", itemid);
  this.item = this.itemService.getItem(itemid);
  this.dados.set("acao", this.route.snapshot.params["acao"]);
  this.dados.set("cep", this.route.snapshot.params["cep"]);
  this.dados.set("logradouro", this.route.snapshot.params["logradouro"]);
  this.dados.set("bairro", this.route.snapshot.params["bairro"]);
  this.dados.set("localidade", this.route.snapshot.params["localidade"]);
  this.dados.set("uf", this.route.snapshot.params["uf"]);
  this.dados.set("idcategoria", this.route.snapshot.params["idcategoria"]);
  this.dados.set("idadmin", this.route.snapshot.params["idadmin"]);
  console.dir(this.dados);

  var txt: TextField = <TextField>this.page.getViewById("nome");
  setTimeout(() => {
   txt.focus(); // Shows the soft input method, ususally a soft keyboard.
  }, 100);
 }

 save() {
  this.db
   .put({
    op: 'adicionar',
    key: 'locais',
    nome: this.dados.get("nome"),
    numero: this.dados.get("numero"),
    fone: this.dados.get("fone"),
    email: this.dados.get("email"),
    site: this.dados.get("site"),
    complemento: this.dados.get("complemento"),
    cep: this.dados.get("cep"),
    logradouro: this.dados.get("logradouro"),
    bairro: this.dados.get("bairro"),
    localidade: this.dados.get("localidade"),
    uf: this.dados.get("uf"),
    idcategoria: this.dados.get("idcategoria"),
    idadmin: this.dados.get("idadmin")
   })
   .subscribe(res => {
    this.routerExtensions.backToPreviousPage();
    this.routerExtensions.backToPreviousPage();
    this.item.menu.push({
     key: (<any>res).key, name: (<any>res).result.nome, id: (<any>res).result.id, menu: null,
    });
    this.item.menu.sort(function (a, b) {
     var nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase()
     if (nameA < nameB)
      return -1
     if (nameA > nameB)
      return 1
     return 0
    });
    console.dir(res);
    console.log((<any>res).status);
   });

 }
}