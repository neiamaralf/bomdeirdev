import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { DbService } from "../shared/db/db.service";
import { ListPicker } from "tns-core-modules/ui/list-picker";
import { Page } from "tns-core-modules/ui/page";
import { fromObject } from "data/observable";
import { TextField } from "ui/text-field";
import { ActivatedRoute } from "@angular/router";

@Component({
  moduleId: module.id,
  templateUrl: "./buscacep.html",
})
export class BuscaCepComponent implements OnInit {
  cep: any;
  public estadoss: any[];
  curestado: any;
  carregando: boolean = true;
  cepres: any;
  cepsearch = fromObject({
    cidade: "",
    endereco: ""
  });

  params = fromObject({
    itemid: 0,
    idcategoria: "",
    idadmin: ""
  });

  constructor(
    private routerExtensions: RouterExtensions,
    private db: DbService,
    private route: ActivatedRoute,
    private page: Page) {
    this.estadoss = [];
  }

  ngOnInit() {
    this.params.set("itemid", this.route.snapshot.params["itemid"]);
    this.params.set("idcategoria", this.route.snapshot.params["idcategoria"]);
    this.params.set("idadmin", this.route.snapshot.params["idadmin"]);
    this.listaUFs(this.estadoss);
    var txt: TextField = <TextField>this.page.getViewById("endereco");
    setTimeout(() => {
      txt.focus(); // Shows the soft input method, ususally a soft keyboard.
    }, 100);
  }

  selectedIndexChanged(arg) {
    this.curestado = (<any>arg.object).items[(<any>arg.object).selectedIndex];
    console.dir(this.curestado);
  }

  listaUFs(array) {
    this.db
      .get("key=estados")
      .subscribe(res => {
        if (res != null) {
          (<any>res).result.forEach(row => {
            let nome = row.nome;
            array.push({
              id: row.id,
              nome: row.nome,
              uf: row.uf,
              toString: () => { return nome; },
            })
          });
          var pickUF: ListPicker = <ListPicker>this.page.getViewById("lstpick");
          pickUF.items = array;
          pickUF.selectedIndex = 15;
          this.curestado = pickUF.items[pickUF.selectedIndex];
          console.dir(array);
        }
        this.carregando = false;
      });
  }

  pesqCEP(UF, Cidade, Logradouro): any {
    return this.db
      .geturl("https://viacep.com.br/ws/" + UF + "/" + Cidade + "/" + Logradouro + "/json/", "application/json");
  }

  buscacep() {
    console.dir(this.curestado);
    console.log(this.cepsearch.get("cidade"));
    console.log(this.cepsearch.get("endereco"));
    this.pesqCEP(this.curestado.uf, this.cepsearch.get("cidade"), this.cepsearch.get("endereco"))
      .subscribe(res => {
        console.dir(<any>res);
        this.cepres = <any>res;

      });
  }

  onclick(item) {
    console.dir(item);
    this.routerExtensions.navigate(["/locais/" + this.params.get("itemid") + "/" + "inserir/" + item.cep + "/" + item.logradouro + "/" + item.bairro + "/" + item.localidade + "/" + item.uf + "/" + this.params.get("idcategoria") + "/" + this.params.get("idadmin")], { clearHistory: false });

  }

}
