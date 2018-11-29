import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { ActivatedRoute } from "@angular/router";
import { DbService } from "../../shared/db/db.service";

@Component({
 selector: "ns-editaeventos",
 moduleId: module.id,
 templateUrl: "./editaeventos.html",
})
export class EditaEventoComponent implements OnInit {
 public campo: string;
 public valor: any;

 constructor(
  private routerExtensions: RouterExtensions,
  private route: ActivatedRoute,
  private db: DbService,
 ) {
  this.campo = this.route.snapshot.params["campo"];
  console.log(this.campo)
  console.log(this.route.snapshot.params["iditem"])
 }
 ngOnInit(): void {
 }

 save() {
  this.db
   .put({
    op: 'atualizar',
    key: 'eventos',
    id: this.route.snapshot.params["iditem"],
    campo: this.campo,
    valor: this.valor
   })
   .subscribe(res => {
    this.routerExtensions.backToPreviousPage();
   });
 }

 /*  nome
data
horario
local
site
fone
fone
descricao
estilo
artista*/
}
