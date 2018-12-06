import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { DbService } from "../../shared/db/db.service";
import { TextView } from "ui/text-view";
import { Page } from "tns-core-modules/ui/page";
import { TimePicker } from "ui/time-picker";
import { DatePicker } from "ui/date-picker";
import { ListPicker } from "tns-core-modules/ui/list-picker";
import { SearchBar } from "ui/search-bar";
import { UserService } from "../../shared/user/user.service";
import { ItemService } from "../../item/item.service";

@Component({
 selector: "ns-editaeventos",
 moduleId: module.id,
 templateUrl: "./editaeventos.html",
})
export class EditaEventoComponent implements OnInit {
 public campo: string;
 public oldvalor: any;
 public valor: any;
 public lstpickeritems: any[];
 carregando: boolean = false;
 alterado: boolean = false;
 searchPhrase = "";
 Searchhint = "";

 constructor(
  private routerExtensions: RouterExtensions,
  private route: ActivatedRoute,
  private db: DbService,
  private page: Page,
  private userService: UserService,
  private itemService:ItemService,
  private router: Router
 ) {
  this.campo = this.route.snapshot.params["campo"];
  this.Searchhint = "Digite o " + this.campo;
  if (this.campo == 'data' || this.campo == 'horario') {
   this.valor = JSON.parse(this.route.snapshot.params["valor"]);
   this.oldvalor = JSON.parse(this.route.snapshot.params["valor"]);
  }
  else {
   this.valor = this.route.snapshot.params["valor"];
   this.oldvalor = this.route.snapshot.params["valor"];
  }

  if (this.valor == "indefinido") this.valor = ""

  console.log(this.campo)
  console.log(this.route.snapshot.params["iditem"])
 }
 ngOnInit(): void {
  
  if (this.campo != 'data' && this.campo != 'horario' && this.campo != 'local' && this.campo != 'estilo' && this.campo != 'artista') {
   var txt: TextView = <TextView>this.page.getViewById("txtvalor");
   setTimeout(() => {
    txt.focus(); // Shows the soft input method, ususally a soft keyboard.
   }, 100);
  }
  switch (this.campo) {
   case "local":
    this.loadlist("locais")
    break;
   case "estilo":
    this.loadlist("estilos")
    break;
   case "artista":
    this.loadlist("artistas")
    break;
  }
 }

 loadlist(key) {
  this.lstpickeritems = [];
  this.carregando = true;
  this.db
   .get("key=" + key + "&idcategoria=" + this.route.snapshot.params["idcategoria"] + "&idadmin=" + this.route.snapshot.params["idadmin"])
   .subscribe(res => {
    if (res != null) {
     (<any>res).result.forEach(row => {
      this.lstpickeritems.push({
       row,
       toString: () => { return row.nome; },
      })
     });
     var pickUF: ListPicker = <ListPicker>this.page.getViewById(this.campo);
     pickUF.items = this.lstpickeritems;
     this.setlistpickerrightindex(pickUF);
     //console.dir(this.lstpickeritems);
     this.carregando = false;
    }
    else this.carregando = false;

   });
 }

 updatelstpickercurrent(lstpicker) {
  this.valor = lstpicker.items[lstpicker.selectedIndex];
  console.dir(this.valor);
 }

 selectedIndexChanged(arg) {
  this.updatelstpickercurrent(<any>arg.object)
 }

 filterlistpicker(text) {
  var items = [];
  this.lstpickeritems.forEach(row => {
   var n = row.row.nome.toLowerCase().search(text.toLowerCase());
   if (n === 0)
    items.push(row);
  });
  var lstpick: ListPicker = <ListPicker>this.page.getViewById(this.campo);
  lstpick.items = items;
  lstpick.selectedIndex = 0;
  this.updatelstpickercurrent(lstpick);
  if (text == "") this.setlistpickerrightindex(lstpick)
 }

 setlistpickerrightindex(lstpicker) {
  var index = 0;
  console.log("this.valor.row.nome = " + this.valor.row.nome)
  for (var i = 0; i < lstpicker.items.length; i++) {
   console.log("lstpicker.items[i].row.nome = " + lstpicker.items[i].row.nome)
   if (lstpicker.items[i].row.nome == this.oldvalor) {
    index = i;
    break;
   }
  }
  lstpicker.selectedIndex = index;
  this.updatelstpickercurrent(lstpicker)
 }

 public onTextChanged(args) {
  let searchBar = <SearchBar>args.object;
  this.filterlistpicker(searchBar.text);
 }

 public onSubmit(args) {

 }

 OntextChange() {
  console.log("changed")
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
    ;
    this.itemService.campoalterado=JSON.stringify(
     {
      campo: this.campo,
      valor: this.valor,
     });
    this.routerExtensions.backToPreviousPage();
   });
 }

 horainiloaded: boolean = false;
 horafimloaded: boolean = false;
 datainiloaded: boolean = false;
 datafimloaded: boolean = false;

 onDataIniLoaded(args) {
  if (this.campo == 'data') {
   let datePicker = <DatePicker>args.object;
   //datePicker.minDate = new Date(Date.now());
   //datePicker.maxDate = new Date(2045, 4, 12);
   var t = this.valor.data.split(/[- :]/);
   datePicker.date = new Date(Date.UTC(t[0], t[1] - 1, t[2], 23));
   this.datainiloaded = true;
  }
 }

 onDataIniChanged(args) {
  if (this.datainiloaded && this.campo == 'data') {
   let datePicker = <DatePicker>args.object;
   this.valor.data = datePicker.date.toISOString().slice(0, 10);
   //this.alterado=this.valor.data!=this.oldvalor.data;
   console.log(this.valor);
   console.log(this.oldvalor);
  }
 }

 onDataFimLoaded(args) {
  if (this.campo == 'data') {
   let datePicker = <DatePicker>args.object;
   //datePicker.minDate = new Date(Date.now());
   //datePicker.maxDate = new Date(2045, 4, 12);
   var t = this.valor.datafim.split(/[- :]/);
   datePicker.date = new Date(Date.UTC(t[0], t[1] - 1, t[2], 23));
   this.datafimloaded = true;
  }
 }

 onDataFimChanged(args) {
  if (this.datafimloaded && this.campo == 'data') {
   let datePicker = <DatePicker>args.object;
   this.valor.datafim = datePicker.date.toISOString().slice(0, 10);
   console.log(this.valor);
  }
 }

 onHoraIniLoaded(args) {
  if (this.campo == 'horario') {
   let timePicker = <TimePicker>args.object;
   timePicker.hour = this.valor.hora;
   timePicker.minute = this.valor.minutos;
   this.horainiloaded = true;
   console.log(this.valor);
  }

 }

 onHoraIniChanged(args) {
  if (this.horainiloaded && this.campo == 'horario') {
   let timePicker = <TimePicker>args.object;
   this.valor.hora = timePicker.hour;
   this.valor.minutos = timePicker.minute;
   console.log(this.valor);
   console.log(this.oldvalor);
  }

 }

 onHoraFimLoaded(args) {
  if (this.campo == 'horario') {
   let timePicker = <TimePicker>args.object;
   timePicker.hour = this.valor.horafim;
   timePicker.minute = this.valor.minutosfim;
   this.horafimloaded = true;
   console.log(this.valor);
  }
 }

 onHoraFimChanged(args) {
  if (this.horafimloaded && this.campo == 'horario') {
   let timePicker = <TimePicker>args.object;
   this.valor.horafim = timePicker.hour;
   this.valor.minutosfim = timePicker.minute;
   console.log(this.valor);
  }
 }

 onSwipe(args) {
  console.log("onSwipe");
 }
}
