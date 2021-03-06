import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Item } from "../../item/item";
import { ItemService } from "../../item/item.service";
import { UserService } from "../../shared/user/user.service";
import { RouterExtensions } from "nativescript-angular/router";
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router";
import { WebView } from "tns-core-modules/ui/web-view";
import { LocationService, LocationData } from "../../shared/location/location.service";
import { MapView, Marker, Position, Bounds } from 'nativescript-google-maps-sdk';
import { SwipeGestureEventData } from "ui/gestures";
import { registerElement } from 'nativescript-angular/element-registry';
import { RadCalendar, CalendarEvent, CalendarSelectionEventData } from "nativescript-ui-calendar";
import { RadCalendarComponent } from "nativescript-ui-calendar/angular";
import * as calendarModule from "nativescript-ui-calendar";
import { Color } from "tns-core-modules/color";
import * as TNSPhone from 'nativescript-phone';
import { localize } from "nativescript-localize";

registerElement('MapView', () => MapView);

@Component({
 selector: "ns-estilosevt",
 moduleId: module.id,
 templateUrl: "./estilosevt.component.html",
})
export class EstilosEvtComponent implements OnInit {
 @ViewChild("myWebView") webViewRef: ElementRef;
 @ViewChild("myCalendar") _calendar: RadCalendarComponent;
 location: LocationData = { latitude: 0, longitude: 0, altitude: 0 };
 currentlocation: LocationData = { latitude: 0, longitude: 0, altitude: 0 };
 pagenumber: number = 0;
 item: Item;
 carregando: boolean = true;
 showcalendar: boolean = false;
 showwebview: boolean = false;
 showmap: boolean = false;
 editaevento: boolean = false;
 private _viewMode;
 mapView: MapView;
 public eventos: any[] = [];
 curevento: any = null;
 tipo: any;
 zoom = 15;
 minZoom = 0;
 maxZoom = 40;
 bearing = 0;
 tilt = 0;
 padding = [40, 40, 40, 40];
 lastCamera: String;
 public _events: Array<CalendarEvent> = new Array<CalendarEvent>();;
 cureventindex: number = -1;
 private _monthViewStyle: calendarModule.CalendarMonthViewStyle;
 private _eventsViewMode;

 constructor(private itemService: ItemService,
  private userService: UserService,
  private locationService: LocationService,
  private routerExtensions: RouterExtensions,
  private route: ActivatedRoute,
  private router: Router) {
  const id = this.route.snapshot.params["idcategoria"];
  this.tipo = this.route.snapshot.params["tipo"];
  this.item = this.itemService.getItem(id);
  this.editaevento = userService.user.super == 1;
  this._monthViewStyle = this.getMonthViewStyle();
  this._eventsViewMode = calendarModule.CalendarEventsViewMode.Inline;
  this.eventos.push({
   row: { nome: '', descricao: '' }
  });
  this.curevento = this.eventos[0];
  this._viewMode = calendarModule.CalendarViewMode.Month;
 }

 ngOnInit(): void {
  this.router.events.subscribe((val) => {
   if (val instanceof NavigationEnd) {

    console.log(this.router.url);

    if (this.itemService.campoalterado != "") {
     var obj = JSON.parse(this.itemService.campoalterado);
     console.dir(obj);
     switch (obj.campo) {
      case "nome":
       this.curevento.row.nome = obj.valor;
       break;
      case "data":
       var time = this.curevento.row.datahorario.slice(10, 20);
       var timefim = this.curevento.row.datafim.slice(10, 20);
       this.curevento.row.datahorario = obj.valor.data + time;
       this.curevento.row.datafim = obj.valor.datafim + timefim;
       this.configureevento(this.curevento);
       break;
      case "horario":
       var ti = (obj.valor.hora < 10 ? "0" + obj.valor.hora : obj.valor.hora) + ":" + (obj.valor.minutos < 10 ? "0" + obj.valor.minutos : obj.valor.minutos) + ":00";
       var tf = (obj.valor.horafim < 10 ? "0" + obj.valor.horafim : obj.valor.horafim) + ":" + (obj.valor.minutosfim < 10 ? "0" + obj.valor.minutosfim : obj.valor.minutosfim) + ":00";
       var data = this.curevento.row.datahorario.slice(0, 11);
       var datafim = this.curevento.row.datafim.slice(0, 11);
       this.curevento.row.datahorario = data + ti.toString();
       console.log(this.curevento.row.datahorario)
       this.curevento.row.datafim = datafim + tf.toString();
       this.configureevento(this.curevento);
       break;
      case "local":
       this.curevento.row.nomelocal = obj.valor.row.nome;
       this.curevento.row.logradouro = obj.valor.row.logradouro;
       this.curevento.row.numero = obj.valor.row.numero;
       this.curevento.row.complemento = obj.valor.row.complemento;
       this.curevento.row.cep = obj.valor.row.cep;
       this.curevento.row.bairro = obj.valor.row.bairro;
       this.curevento.row.localidade = obj.valor.row.localidade;
       this.curevento.row.uf = obj.valor.row.uf;
       this.curevento.row.fone = obj.valor.row.fone;
       this.curevento.row.site = obj.valor.row.site;
       break;
      case "descricao":
       this.curevento.row.descricao = obj.valor;
       break;
      case "artista":
      case "estilo":
       this.curevento.row.estilo = obj.valor.row.nome;
       break;
     }
    }
   }
  });
  if (this.userService.user.super == 2) {
   this.item.menu = [];
   this.loadlist(this.item.menu, "estilosevt", "-1");
  }
  else {
   this.curevento = null;
   this.eventos = [];
   this.loadlist(this.eventos, "eventosadmin", this.userService.user.id);
   this.pagenumber = 1;
  }
 }

 loadlist(array, key, id) {
  this.carregando = true;
  this.userService.db
   .get(key == "eventosadmin" ? "key=" + key + "&idcategoria=" + this.route.snapshot.params["idcategoria"] + "&idadmin=" + id : "key=" + key +
    "&idcategoria=" + this.route.snapshot.params["idcategoria"] +
    "&cidade=" + this.route.snapshot.params["cidade"] +
    "&uf=" + this.route.snapshot.params["uf"] +
    "&idestilo=" + id)
   .subscribe(res => {
    if (res != null) {
     var i = 0;
     this.cureventindex = -1;
     this.goToCurrentDay();
     this._calendar.nativeElement.reload()
     this._calendar.nativeElement.selectedDate = new Date();
     this._events = new Array<CalendarEvent>();
     (<any>res).result.forEach(row => {
      array.push({
       row,
       toString: () => { return row.nome; },
      })
      if (key == "eventosregiao" || key == "eventosadmin") {
       var startDate: Date, endDate: Date, event: CalendarEvent;
       var t = row.datahorario.split(/[- :]/);
       //console.dir(t);
       startDate = new Date(t[0], t[1] - 1, t[2], t[3], t[4], t[5], 0);
       t = row.datafim.split(/[- :]/);
       endDate = new Date(t[0], t[1] - 1, t[2], t[3], t[4], t[5], 0);
       let colors: Array<Color> = [new Color(200, 188, 26, 214), new Color(220, 255, 109, 130), new Color(255, 55, 45, 255), new Color(199, 17, 227, 10), new Color(255, 255, 54, 3)];
       event = new CalendarEvent(row.nome + ":" + row.id, startDate, endDate, false, colors[(i++) * 10 % (colors.length - 1)]);
       this._events.push(event);
       this.configureevento(array[array.length - 1]);
      }
     });
     if (key == "estilosevt") {
      var row: any = {
       id: "-1",
       nome: "TODOS",
       idcategoria: "1"
      };
      (<any>this.item.menu).push({
       row,
       toString: () => { return row.nome; },
      });
     }
     if (key == "eventosregiao" || key == "eventosadmin") {
      this.cureventindex = 0;
      this._calendar.nativeElement.goToDate(this._events[this.cureventindex].startDate)
     }
     console.dir(array);
    }
    this.carregando = false;
   });
 }

 editaitem(campo) {
  if (this.editaevento) {
   var valor: any = "indefinido";
   switch (campo) {
    case "nome":
     valor = this.curevento.row.nome;
     break;
    case "data":
     valor = JSON.stringify(
      {
       data: this.curevento.row.datahorario.slice(0, 10),
       datafim: this.curevento.row.datafim.slice(0, 10),
      });

     break;
    case "horario":
     valor = JSON.stringify(
      {
       hora: this.curevento.row.hora,
       minutos: this.curevento.row.minutos,
       horafim: this.curevento.row.horafim,
       minutosfim: this.curevento.row.minutosfim
      });
     break;
    case "site":
    case "fone":
     campo = "local"
     valor = this.curevento.row.nomelocal;
     break;
    case "local":
     valor = this.curevento.row.nomelocal;
     console.dir(valor)
     break;
    case "descricao":
     valor = this.curevento.row.descricao;
     break;
    case "estilo":
     valor = this.curevento.row.estilo;
     break;
    case "artista":
     valor = this.curevento.row.artista;
     break;
   }
   if (valor == "") valor = "indefinido"
   this.routerExtensions.navigate(["/editaeventos/" + campo + "/" + this.curevento.row.id + "/" + valor + "/" + this.route.snapshot.params["idcategoria"] + "/" + this.userService.user.id],
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
   switch (campo) {
    case 'local':
     this.abremapa();
     break;
    case 'site':
     this.abresite();
     break;
    case 'fone':
     this.ligafone();
     break;
   }
  }
 }

 get viewMode() {
  return this._viewMode;
 }

 get eventSource() {
  return this._events;
 }

 ligafone() {
  TNSPhone.dial(this.curevento.row.fone, false);
 }

 showCalendar() {
  this.showcalendar = !this.showcalendar
 }

 goToCurrentDay() {
  const date = new Date();
  this._calendar.nativeElement.goToDate(date);
 }

 prevevt() {
  if (this.cureventindex > 0)
   this.cureventindex--;
  else
   this.cureventindex = this._events.length - 1;
  this._calendar.nativeElement.goToDate(this._events[this.cureventindex].startDate)
 }

 nextevt() {
  this.cureventindex = ((this.cureventindex + 1) % this._events.length)
  this._calendar.nativeElement.goToDate(this._events[this.cureventindex].startDate)
 }

 getMonthViewStyle(): calendarModule.CalendarMonthViewStyle {
  const monthViewStyle = new calendarModule.CalendarMonthViewStyle();
  return monthViewStyle;
 }

 get monthViewStyle() {
  return this._monthViewStyle;
 }

 get eventsViewMode() {
  return this._eventsViewMode;
 }

 public tapevento(args: calendarModule.CalendarInlineEventSelectedData) {
  const calendar: RadCalendar = <RadCalendar>args.object;
  console.dir(<any>args.eventData);
  var s = args.eventData.title.split(/[:]/)
  for (var i = 0; i < this.eventos.length; i++) {
   if (this.eventos[i].row.id == s[1]) {
    this.cureventindex = i;
    break;
   }
  }
  this.eventoclick(this.eventos[this.cureventindex])
 }


 onDateSelected(args: CalendarSelectionEventData) {
  const calendar: RadCalendar = args.object;
  const date: Date = args.date;
  const events: Array<CalendarEvent> = calendar.getEventsForDate(date);
 }

 get(url) {
  return fetch(
   url
  ).then(function (response) {
   return response.json();
  }).then(function (json) {
   return json;
  });
 }

 configureevento(item) {
  var t = item.row.datahorario.split(/[- :]/);
  var data = new Date(Date.UTC(t[0], t[1] - 1, t[2], t[3], t[4], t[5]));
  t = item.row.datafim.split(/[- :]/);
  var datafim = new Date(Date.UTC(t[0], t[1] - 1, t[2], t[3], t[4], t[5]));
  var semana = ["Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado"];
  var meses = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
  var abrevsem = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB"]
  var diames = data.getUTCDate() < 10 ? "0" + data.getUTCDate() : data.getUTCDate();
  var mes = data.getUTCMonth() < 9 ? "0" + (data.getUTCMonth() + 1) : (data.getUTCMonth() + 1);
  var hora = data.getUTCHours();
  var minutos = data.getUTCMinutes();
  var horafim = datafim.getUTCHours();
  var minutosfim = datafim.getUTCMinutes();
  item.row.ano = data.getUTCFullYear();
  item.row.data = diames + "\\" + mes + "\\" + data.getUTCFullYear() + " - " + semana[data.getDay()];
  item.row.time = (hora < 10 ? "0" + hora : hora) + ":" + (minutos < 10 ? "0" + minutos : minutos);
  item.row.realtime = data.toISOString();
  item.row.hora = hora;
  item.row.minutos = minutos;
  item.row.horafim = horafim;
  item.row.minutosfim = minutosfim;
  item.row.timefim = (horafim < 10 ? "0" + horafim : horafim) + ":" + (minutosfim < 10 ? "0" + minutosfim : minutosfim);
  item.row.abrevmes = meses[data.getUTCMonth()];

  item.row.abrevsem = abrevsem[data.getDay()];
  item.row.diames = diames;
  item.row.clima = ''
  item.row.clima = 'ec'


 }

 webViewTouch(event) {

 }

 webViewPan(event) {

 }

 addevento() {
  this.router.navigate(["/eventos/" + this.item.id + "/inserir/" + this.route.snapshot.params["idcategoria"] + "/" + this.userService.user.id]);
 }

 gotocurday() {
  this._calendar.nativeElement.goToDate(new Date())
 }

 abresite() {
  console.log("site");
  let webview: WebView = this.webViewRef.nativeElement;
  //webview.src = this.curevento.row.site;
  //console.dir(webview);
  //this.showmap = false;
  this.showwebview = true;
 }

 onMarkerEvent(args) {
  console.log("Marker Event: '" + args.eventName
   + "' triggered on: " + args.marker.title
   + ", Lat: " + args.marker.position.latitude + ", Lon: " + args.marker.position.longitude, args);
 }

 onMapReady(event) {
  console.log('Map Ready');
  this.mapView = event.object;
 }

 onCoordinateTapped(args) {
  console.log("Coordinate Tapped, Lat: " + args.position.latitude + ", Lon: " + args.position.longitude, args);
 }

 onCameraChanged(args) {
  console.log("Camera changed: " + JSON.stringify(args.camera), JSON.stringify(args.camera) === this.lastCamera);
  this.lastCamera = JSON.stringify(args.camera);
 }

 abremapa() {
  console.log("abremapa");
  this.locationService.getlatlongFromEnd(this.curevento.row)
   .subscribe(res => {
    this.locationService.getLocationOnce()
     .then(location => {
      console.log("Location received: ");
      console.dir(location);
      this.currentlocation.latitude = location.latitude;
      this.currentlocation.longitude = location.longitude;
      console.dir(<any>res);
      this.location.latitude = (<any>res).results[0].geometry.location.lat;//location.latitude;// (<any>res).results[0].geometry.location.lat;
      this.location.longitude = (<any>res).results[0].geometry.location.lng; //location.longitude;//(<any>res).results[0].geometry.location.lng;
      this.location.altitude = 0;

      var marker = new Marker();
      marker.position = Position.positionFromLatLng(this.location.latitude, this.location.longitude);
      marker.title = this.curevento.row.nomelocal;
      marker.snippet = this.curevento.row.nome;
      marker.userData = { index: 0 };
      marker.visible = true;
      this.mapView.addMarker(marker);
      marker = new Marker();
      marker.position = Position.positionFromLatLng(this.currentlocation.latitude, this.currentlocation.longitude);
      marker.title = "EU";
      marker.snippet = "bora lá";
      marker.userData = { index: 1 };
      marker.visible = true;
      this.mapView.addMarker(marker);

      marker = this.mapView.findMarker(function (marker) {
       return marker.userData.index === 1;
      });
      console.log("Moving marker...", marker.userData);
      var __this = this;
      this.locationService.startwatch(__this, marker);
      this.mapView.myLocationEnabled = true;
      this.mapView.settings.zoomControlsEnabled = true;
      this.mapView.settings.compassEnabled = true;
      this.mapView.settings.indoorLevelPickerEnabled = true;
      this.mapView.settings.mapToolbarEnabled = true;
      this.mapView.settings.myLocationButtonEnabled = true;
      this.mapView.settings.rotateGesturesEnabled = true;
      this.mapView.settings.scrollGesturesEnabled = true;
      this.mapView.settings.tiltGesturesEnabled = true;
      this.mapView.settings.zoomGesturesEnabled = true;
      //***  setViewport não funciona
      /*var southwest=Position.positionFromLatLng(this.startpointLatitude,this.startpointLongitude),
       northeast=Position.positionFromLatLng(this.latitude,this.longitude);
       let tmplat=southwest.latitude;
       southwest.latitude=Math.min(southwest.latitude,northeast.latitude);
       northeast.latitude=Math.max(tmplat,northeast.latitude);
       tmplat=southwest.longitude;
       southwest.longitude=Math.max(southwest.longitude,northeast.longitude);
       northeast.longitude=Math.min(tmplat,northeast.longitude);

       let viewport = {
        southwest: {
            latitude: southwest.latitude + 0.001,
            longitude: northeast.longitude + 0.001
        },
        northeast: {
            latitude: northeast.latitude - 0.001,
            longitude: southwest.longitude - 0.001
        }
    }

      var bounds=Bounds.fromCoordinates(
        Position.positionFromLatLng(viewport.southwest.latitude,viewport.southwest.longitude),
        Position.positionFromLatLng(viewport.northeast.latitude,viewport.northeast.longitude)
      );*/

      // this.mapView.setViewport(bounds, 100);
      //console.dir(bounds.southwest.latitude);
      this.showmap = true;
     }).catch(error => {
      console.log(localize("locationerror") + error);
      alert(localize("locationerror") + error);
     });

   });
  //String.fromCharCode(this.dadosclima['ec'].charcod)

 }

 dadosclima = {
  ec: {
   texto: "Encoberto com Chuvas Isoladas",
   charcod: String.fromCharCode(0xf006)
  },
  ci: {
   texto: "Chuvas Isoladas",
   charcod: String.fromCharCode(0xf017)
  },
  c: {
   texto: "Chuva",
   charcod: String.fromCharCode(0xf019)
  },
  in: {
   texto: "Instável",
   charcod: String.fromCharCode(0xf00e)
  },
  pp: {
   texto: "Possibilidade de Pancadas de Chuva",
   charcod: String.fromCharCode(0xf015)
  },
  cm: {
   texto: "Chuva pela Manhã",
   charcod: String.fromCharCode(0xf008)
  },
  cn: {
   texto: "Chuva a Noite",
   charcod: String.fromCharCode(0xf028)
  },
  pt: {
   texto: "Pancadas de Chuva a Tarde",
   charcod: String.fromCharCode(0xf035)
  },
  pm: {
   texto: "Pancadas de Chuva pela Manhã",
   charcod: String.fromCharCode(0xf007)
  },
  np: {
   texto: "Nublado e Pancadas de Chuva",
   charcod: String.fromCharCode(0xf004)
  },
  pc: {
   texto: "Pancadas de Chuva",
   charcod: String.fromCharCode(0xf018)
  },
  pn: {
   texto: "Parcialmente Nublado",
   charcod: String.fromCharCode(0xf002)
  },
  cv: {
   texto: "Chuvisco",
   charcod: String.fromCharCode(0xf01b)
  },
  ch: {
   texto: "Chuvoso",
   charcod: String.fromCharCode(0xf01a)
  },
  t: {
   texto: "Tempestade",
   charcod: String.fromCharCode(0xf01e)
  },
  ps: {
   texto: "Predomínio de Sol",
   charcod: String.fromCharCode(0xf00d)
  },
  e: {
   texto: "Encoberto",
   charcod: String.fromCharCode(0xf00c)
  },
  n: {
   texto: "Nublado",
   charcod: String.fromCharCode(0xf013)
  },
  cl: {
   texto: "Céu Claro",
   charcod: String.fromCharCode(0xf00d)
  },
  nv: {
   texto: "Nevoeiro",
   charcod: String.fromCharCode(0xf03d)
  },
  g: {
   texto: "Geada",
   charcod: String.fromCharCode(0xf077)
  },
  ne: {
   texto: "Neve",
   charcod: String.fromCharCode(0xf076)
  },
  nd: {
   texto: "Não Definido",
   charcod: '?'
  },
  pnt: {
   texto: "Pancadas de Chuva a Noite",
   charcod: String.fromCharCode(0xf024)
  },
  psc: {
   texto: "Possibilidade de Chuva",
   charcod: String.fromCharCode(0xf01c)
  },
  pcm: {
   texto: "Possibilidade de Chuva pela Manhã",
   charcod: String.fromCharCode(0xf00b)
  },
  pct: {
   texto: "Possibilidade de Chuva a Tarde",
   charcod: String.fromCharCode(0xf039)
  },
  pcn: {
   texto: "Possibilidade de Chuva a Noite",
   charcod: String.fromCharCode(0xf02b)
  },
  npt: {
   texto: "Nublado com Pancadas a Tarde",
   charcod: String.fromCharCode(0xf032)
  },
  npn: {
   texto: "Nublado com Pancadas a Noite",
   charcod: String.fromCharCode(0xf027)
  },
  ncn: {
   texto: "Nublado com Possibilidade de Chuva a Noite",
   charcod: String.fromCharCode(0xf029)
  },
  nct: {
   texto: "Nublado com Possibilidade de Chuva a Tarde ",
   charcod: String.fromCharCode(0xf037)
  },
  ncm: {
   texto: "Nublado com Possibilidade de Chuva pela Manhã",
   charcod: String.fromCharCode(0xf009)
  },
  npm: {
   texto: "Nublado com Pancadas pela Manhã",
   charcod: String.fromCharCode(0xf010)
  },
  npp: {
   texto: "Nublado com Possibilidade de Chuva",
   charcod: String.fromCharCode(0xf01d)
  },
  vn: {
   texto: "Variação de Nebulosidade",
   charcod: String.fromCharCode(0xf03e)
  },
  ct: {
   texto: "Chuva a Tarde",
   charcod: String.fromCharCode(0xf036)
  },
  ppn: {
   texto: "Possibilidade de Pancada de Chuva a Noite",
   charcod: String.fromCharCode(0xf02c)
  },
  ppt: {
   texto: "Possibilidade de Pancada de Chuva a Tarde",
   charcod: String.fromCharCode(0xf03a)
  },
  ppm: {
   texto: "Possibilidade de Pancada de Chuva pela Manhã",
   charcod: String.fromCharCode(0xf00e)
  }
 }
 onclick(item) {
  // this.routerExtensions.navigate(["/item/"+item.id], { clearHistory: false });
  //this.curevento=[];
  this.curevento = null;
  this.eventos = [];
  this.loadlist(this.eventos, "eventosregiao", item.row.id.toString());
  console.dir(item);
  this.pagenumber++;
 }

 eventoclick(item) {
  this.curevento = item;
  if (!this.editaevento) {
   this.userService.db
    .geturl("https://www.athena3d.com.br/bomdeir/clima.php?cidade=" + item.row.localidade, "application/xml")
    .subscribe(res => {
     var idcidade = 0;
     if ((<any>res).cidade.length != undefined) {
      for (let i = 0; i < (<any>res).cidade.length; i++) {
       if ((<any>res).cidade[i].uf == item.row.uf && (<any>res).cidade[i].nome == item.row.localidade) {
        idcidade = (<any>res).cidade[i].id;
       }
      };
     }
     else
      idcidade = (<any>res).cidade.id;
     this.userService.db
      .geturl("https://www.athena3d.com.br/bomdeir/clima.php?idcidade=" + idcidade, "application/xml")
      .subscribe(res => {
       this.curevento.row.clima = (<any>res).previsao[0].tempo;
       this.curevento.row.minima = (<any>res).previsao[0].minima;
       this.curevento.row.maxima = (<any>res).previsao[0].maxima;
       console.dir((<any>res).previsao[0]);
      });
    });
  }
  this.pagenumber++;
  console.dir(this.curevento);
 }

 goback() {
  if (this.showwebview)
   this.showwebview = false;
  else if (this.showmap)
   this.showmap = false;
  else if (this.editaevento && this.pagenumber == 1) {
   this.routerExtensions.backToPreviousPage();
  }
  else if (this.pagenumber == 0)
   this.routerExtensions.backToPreviousPage();
  else
   this.pagenumber--;
 }

 onSwipe(args: SwipeGestureEventData) {
  switch (args.direction) {
   case 1:
    this.goback();
    break;
   case 2:
    if (this.pagenumber == 1) {
     if (this.curevento != null)
      this.pagenumber++;
    }
    break;
  }

  /* console.log("Pan!");
       console.log("Object that triggered the event: " + args.object);
       console.log("View that triggered the event: " + args.view);
       console.log("Event name: " + args.eventName);
       console.log("Pan delta: [" + args.deltaX + ", " + args.deltaY + "] state: " + args.state);
 
       this.deltaX = args.deltaX;
       this.deltaY = args.deltaY;
       this.state = args.state;
   this.direction = args.direction;*/
 }
}