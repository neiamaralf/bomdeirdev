import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { DbService } from "../shared/db/db.service";
import { ListPicker } from "tns-core-modules/ui/list-picker";
import { Page } from "tns-core-modules/ui/page";
import { fromObject } from "data/observable";
import { TextField } from "ui/text-field";
import { ActivatedRoute } from "@angular/router";
import { TimePicker } from "ui/time-picker";
import { DatePicker } from "ui/date-picker";
import { SearchBar } from "ui/search-bar";
import { ItemService } from "./item.service";
import { Item } from "./item";
import { StackLayout } from "ui/layouts/stack-layout";
import { Label } from "ui/label";

@Component({
  moduleId: module.id,
  templateUrl: "./eventos.html",
})
export class EventosComponent implements OnInit {
  public artistas: any[];
  titulo: string = "ARTISTA"
  public estilos: any[];
  public locais: any[];
  pagenumber: number = 0;
  curartista: any = null;
  curestilo: any = null;
  curlocal: any = null;
  isLoading: boolean = true;
  label1: Label = new Label();
  label2: Label = new Label();
  label3: Label = new Label();
  evento = fromObject({
    titulo: "",
    descricao: ""
  });
  params = fromObject({
    itemid: 0,
    idcategoria: "",
    idadmin: ""
  });
  item: Item;
  time: string = "20:00:00";
  timeend: string = "20:00:00";
  date: String = "";

  constructor(
    private itemService: ItemService,
    private routerExtensions: RouterExtensions,
    private db: DbService,
    private route: ActivatedRoute,
    private page: Page) {
    this.artistas = [];
    this.estilos = [];
    this.locais = [];
    this.label1.className="whitetext";
    this.label2.className="whitetext";
    this.label3.className="whitetext";
  }

  ngOnInit() {
    this.params.set("acao", this.route.snapshot.params["acao"]);
    var itemid = this.route.snapshot.params["itemid"];
    this.params.set("itemid", itemid);
    this.item = this.itemService.getItem(itemid);
    this.params.set("idcategoria", this.route.snapshot.params["idcategoria"]);
    this.params.set("idadmin", this.route.snapshot.params["idadmin"]);
    var __this = this;
    this.loadlist(this.artistas, "artistas", false, function () {
      __this.loadlist(__this.estilos, "estilos", false, function () {
        __this.loadlist(__this.locais, "locais", true, null);
      });
    });
  }

  updatelstpickercurrent(lstpicker) {
    switch (lstpicker.id) {
      case "artistas":
        this.curartista = lstpicker.items[lstpicker.selectedIndex];
        this.label1.text = 'Artista : ' + this.curartista.row.nome;
        console.dir(this.curartista);
        break;
      case "estilos":
        this.curestilo = lstpicker.items[lstpicker.selectedIndex];
        this.label2.text = 'Estilo : ' + this.curestilo.row.nome;
        console.dir(this.curestilo);
        break;
      case "locais":
        this.curlocal = lstpicker.items[lstpicker.selectedIndex];
        this.label3.text = 'Local : ' + this.curlocal.row.nome;
        console.dir(this.curlocal);
        break;
    }
  }

  selectedIndexChanged(arg) {
    this.updatelstpickercurrent(<any>arg.object)
  }

  public onSubmit(args) {

  }

  filterlistpicker(array, lstpickid, text) {
    var items = [];
    array.forEach(row => {
      var n = row.row.nome.toLowerCase().search(text.toLowerCase());
      if (n === 0)
        items.push(row);
    });
    var lstpick: ListPicker = <ListPicker>this.page.getViewById(lstpickid);
    lstpick.items = items;
    lstpick.selectedIndex = 0;
    this.updatelstpickercurrent(lstpick)
  }

  searchPhrase = "";
  Searchhint = "Digite o artista";

  public onTextChanged(args) {
    let searchBar = <SearchBar>args.object;
    switch (this.pagenumber) {
      case 0:
        this.filterlistpicker(this.artistas, "artistas", searchBar.text);
        break;
      case 1:
        this.filterlistpicker(this.estilos, "estilos", searchBar.text);
        break;
      case 2:
        this.filterlistpicker(this.locais, "locais", searchBar.text);
        break;
    }


  }

  loadlist(array, key, setloading, callback) {
    this.db
      .get("key=" + key + "&idcategoria=" + this.params.get("idcategoria") + "&idadmin=" + this.params.get("idadmin"))
      .subscribe(res => {
        if (res != null) {
          (<any>res).result.forEach(row => {
            array.push({
              row,
              toString: () => { return row.nome; },
            })
          });
          var pickUF: ListPicker = <ListPicker>this.page.getViewById(key);
          pickUF.items = array;
          pickUF.selectedIndex = 0;
          this.updatelstpickercurrent(pickUF);
          console.dir(array);
          if (setloading) {
            var layout: StackLayout = this.page.getViewById("stck");
            this.label1.text = 'Artista : ' + this.curartista.row.nome;
            this.label1.visibility = 'collapse';
            layout.addChild(this.label1);
            this.label2.text = 'Estilo : ' + this.curestilo.row.nome;
            this.label2.visibility = 'collapse';
            layout.addChild(this.label2);
            this.label3.text = 'Local : ' + this.curlocal.row.nome;
            this.label3.visibility = 'collapse';
            layout.addChild(this.label3);
            this.isLoading = false;
          }
        }
        else this.isLoading = false;

        if (callback != null)
          callback();

      });
  }

  atualizatitulo() {
    this.label1.visibility = 'collapse';
    this.label2.visibility = 'collapse';
    this.label3.visibility = 'collapse';

    switch (this.pagenumber) {
      case 0:
        this.Searchhint = "Digite o artista";
        this.titulo = "ARTISTA"
        break;
      case 1:
        this.Searchhint = "Digite o estilo";
        this.titulo = "ESTILO"
        break;
      case 2:
        this.Searchhint = "Digite o local";
        this.titulo = "LOCAL"
        break;
      case 3:
        this.titulo = "DATA"
        break;
      case 4:
        this.titulo = "HORÁRIO INÍCIO"
        break;
      case 5:
        this.titulo = "HORÁRIO FIM"
        break;
      case 6:
        this.titulo = "DADOS DO EVENTO";
        var txt: TextField = <TextField>this.page.getViewById("titulo");
        setTimeout(() => {
          txt.focus();
        }, 100);

        this.label1.visibility = 'visible';
        this.label2.visibility = 'visible';
        this.label3.visibility = 'visible';
        break;
    }
    this.searchPhrase = "";
  }

  goback() {
    if (this.pagenumber == 0)
      this.routerExtensions.backToPreviousPage();
    else {
      this.pagenumber--;
      this.atualizatitulo();
    }
  }

  avancar() {
    this.pagenumber++;
    this.atualizatitulo();
  }

  save() {
    this.db
      .put({
        op: 'adicionar',
        key: 'eventos',
        idadmin: this.params.get("idadmin"),
        idestilo: this.curestilo.row.id,
        idartista: this.curartista.row.id,
        idcategoria: this.params.get("idcategoria"),
        idlocal: this.curlocal.row.id,
        datahorario: this.date + " " + this.time,
        datafim: this.date + " " + this.timeend,
        nome: this.evento.get("titulo"),
        descricao: encodeURI(this.evento.get("descricao")),
      })
      .subscribe(res => {
        this.routerExtensions.backToPreviousPage();
        this.item.menu.push({
          key: (<any>res).key, name: (<any>res).result.nome, id: (<any>res).result.id, menu: null,
        });
        this.item.menu.sort(function (a, b) {
          var nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase();
          if (nameA < nameB)
            return -1;
          if (nameA > nameB)
            return 1;
          return 0;
        });
        console.dir(res);
        console.log((<any>res).status);
      });

  }

  onPickerLoaded(args) {
    let datePicker = <DatePicker>args.object;
    datePicker.minDate = new Date(Date.now());
    datePicker.maxDate = new Date(2045, 4, 12);
    this.date = datePicker.date.toISOString().slice(0, 10);
  }

  onDateChanged(args) {
    let datePicker = <DatePicker>args.object;
    this.date = datePicker.date.toISOString().slice(0, 10);
    console.log(this.date);
  }

  onDTPickerLoaded(args) {
    let timePicker = <TimePicker>args.object;
    timePicker.hour = 20;
    timePicker.minute = 0;
  }

  onTimeChanged(args) {
    let timePicker = <TimePicker>args.object;
    if (this.pagenumber == 4)
      this.time = timePicker.time.toTimeString().slice(0, 8);
    else
      this.timeend = timePicker.time.toTimeString().slice(0, 8);
    console.log(this.time);
  }

}
