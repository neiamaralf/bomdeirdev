import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { ActivatedRoute } from "@angular/router";
import { DbService } from "../../shared/db/db.service";
import { TextView } from "ui/text-view";
import { Page } from "tns-core-modules/ui/page";
import { TimePicker } from "ui/time-picker";
import { DatePicker } from "ui/date-picker";

@Component({
 selector: "ns-editaeventos",
 moduleId: module.id,
 templateUrl: "./editaeventos.html",
})
export class EditaEventoComponent implements OnInit {
 public campo: string;
 public oldvalor: any;
 public valor: any;

 constructor(
  private routerExtensions: RouterExtensions,
  private route: ActivatedRoute,
  private db: DbService,
  private page: Page
 ) {
  this.campo = this.route.snapshot.params["campo"];
  this.oldvalor = this.route.snapshot.params["valor"];
  if (this.campo == 'data' || this.campo == 'horario')
   this.valor = JSON.parse(this.route.snapshot.params["valor"]);
  else
   this.valor = this.route.snapshot.params["valor"];
  console.log(this.campo)
  console.log(this.route.snapshot.params["iditem"])
 }
 ngOnInit(): void {
  if (this.campo != 'data' && this.campo != 'horario') {
   var txt: TextView = <TextView>this.page.getViewById("txtvalor");
   setTimeout(() => {
    txt.focus(); // Shows the soft input method, ususally a soft keyboard.
   }, 100);
  }

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
    this.routerExtensions.backToPreviousPage();
   });
 }
 onDataIniLoaded(args) {
  if (this.campo == 'data') {
   let datePicker = <DatePicker>args.object;
   //datePicker.minDate = new Date(Date.now());
   //datePicker.maxDate = new Date(2045, 4, 12);
   var t = this.valor.data.split(/[- :]/);
   datePicker.date = new Date(Date.UTC(t[0], t[1] - 1, t[2],23));
  }
 }

 onDataIniChanged(args) {
  if (this.campo == 'data') {
   let datePicker = <DatePicker>args.object;
   this.valor.data = datePicker.date.toISOString().slice(0, 10);
   console.log(this.valor);
  }
 }

 onDataFimLoaded(args) {
  if (this.campo == 'data') {
   let datePicker = <DatePicker>args.object;
   //datePicker.minDate = new Date(Date.now());
   //datePicker.maxDate = new Date(2045, 4, 12);
   var t = this.valor.datafim.split(/[- :]/);
   datePicker.date = new Date(Date.UTC(t[0], t[1] - 1, t[2],23));

  }
 }

 onDataFimChanged(args) {
  if (this.campo == 'data') {
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
  }

 }

 onHoraIniChanged(args) {
  if (this.campo == 'horario') {
   let timePicker = <TimePicker>args.object;
   this.valor.hora = timePicker.time.toTimeString().slice(0, 8);
   console.log(this.valor);
  }

 }

 onHoraFimLoaded(args) {
  if (this.campo == 'horario') {
   let timePicker = <TimePicker>args.object;
   timePicker.hour = this.valor.horafim;
   timePicker.minute = this.valor.minutosfim;
  }
 }

 onHoraFimChanged(args) {
  if (this.campo == 'horario') {
   let timePicker = <TimePicker>args.object;
   this.valor.horafim = timePicker.time.toTimeString().slice(0, 8);
   console.log(this.valor);
  }
 }

 onSwipe(args) {

 }
}
