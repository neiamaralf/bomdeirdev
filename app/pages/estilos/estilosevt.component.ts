import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Item } from "../../item/item";
import { ItemService } from "../../item/item.service";
import { UserService } from "../../shared/user/user.service";
import { RouterExtensions } from "nativescript-angular/router";
import { ActivatedRoute } from "@angular/router";
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
  carregando: boolean = false;
  showcalendar: boolean = false;
  showwebview: boolean = false;
  showmap: boolean = false;
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
    private route: ActivatedRoute) {
    const id = this.route.snapshot.params["idcategoria"];
    this.tipo = this.route.snapshot.params["tipo"];
    this.item = this.itemService.getItem(id);
    this.item.menu = [];
    this.loadlist(this.item.menu, "estilosevt", "-1");
    this._monthViewStyle = this.getMonthViewStyle();
    this._eventsViewMode = calendarModule.CalendarEventsViewMode.Inline;
    this.eventos.push({
      row: { nome: '', descricao: '' }
    });
    this.curevento = this.eventos[0];
    this._viewMode = calendarModule.CalendarViewMode.Month;
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
    /*monthViewStyle.backgroundColor = "Gray";
    monthViewStyle.showTitle = true;
    monthViewStyle.showWeekNumbers = false;
    monthViewStyle.showDayNames = true;

    const todayCellStyle = new DayCellStyle();
    todayCellStyle.cellBackgroundColor = "#66bbae";
    todayCellStyle.cellBorderWidth = 2;
    todayCellStyle.cellBorderColor = "#f1e8ca";
    todayCellStyle.cellTextColor = "#5b391e";
    todayCellStyle.cellTextFontName = "Times New Roman";
    todayCellStyle.cellTextFontStyle = "Bold";
    todayCellStyle.cellTextSize = 14;
    monthViewStyle.todayCellStyle = todayCellStyle;

    const dayCellStyle = new DayCellStyle();
    dayCellStyle.showEventsText = false;
    dayCellStyle.eventTextColor = "White";
    dayCellStyle.eventFontName = "Times New Roman";
    dayCellStyle.eventFontStyle = "BoldItalic";
    dayCellStyle.eventTextSize = 8;
    dayCellStyle.cellAlignment = "Top";
    dayCellStyle.cellPaddingHorizontal = 10;
    dayCellStyle.cellPaddingVertical = 5;
    dayCellStyle.cellBackgroundColor = "#ffffff";
    dayCellStyle.cellBorderWidth = 1;
    dayCellStyle.cellBorderColor = "#f1e8ca";
    dayCellStyle.cellTextColor = "#745151";
    dayCellStyle.cellTextFontName = "Times New Roman";
    dayCellStyle.cellTextFontStyle = "Bold";
    dayCellStyle.cellTextSize = 10;
    monthViewStyle.dayCellStyle = dayCellStyle;

    const weekendCellStyle = new DayCellStyle();
    weekendCellStyle.eventTextColor = "BlueViolet";
    weekendCellStyle.eventFontName = "Times New Roman";
    weekendCellStyle.eventFontStyle = "BoldItalic";
    weekendCellStyle.eventTextSize = 8;
    weekendCellStyle.cellAlignment = "Top";
    weekendCellStyle.cellPaddingHorizontal = 10;
    weekendCellStyle.cellPaddingVertical = 5;
    weekendCellStyle.cellBackgroundColor = "Gray";
    weekendCellStyle.cellBorderWidth = 1;
    weekendCellStyle.cellBorderColor = "#f1e8ca";
    weekendCellStyle.cellTextColor = "#745151";
    weekendCellStyle.cellTextFontName = "Times New Roman";
    weekendCellStyle.cellTextFontStyle = "Bold";
    weekendCellStyle.cellTextSize = 12;
    monthViewStyle.weekendCellStyle = weekendCellStyle;

    const selectedCellStyle = new DayCellStyle();
    selectedCellStyle.eventTextColor = "Blue";
    selectedCellStyle.eventFontName = "Times New Roman";
    selectedCellStyle.eventFontStyle = "Bold";
    selectedCellStyle.eventTextSize = 8;
    selectedCellStyle.cellAlignment = "Top";
    selectedCellStyle.cellPaddingHorizontal = 10;
    selectedCellStyle.cellPaddingVertical = 5;
    selectedCellStyle.cellBackgroundColor = "#dbcbbb";
    selectedCellStyle.cellBorderWidth = 2;
    selectedCellStyle.cellBorderColor = "#745151";
    selectedCellStyle.cellTextColor = "Black";
    selectedCellStyle.cellTextFontName = "Times New Roman";
    selectedCellStyle.cellTextFontStyle = "Bold";
    selectedCellStyle.cellTextSize = 18;
    monthViewStyle.selectedDayCellStyle = selectedCellStyle;

    const dayNameCellStyle = new CellStyle();
    dayNameCellStyle.cellBackgroundColor = "#f1e8ca";
    dayNameCellStyle.cellBorderWidth = 1;
    dayNameCellStyle.cellBorderColor = "#745151";
    dayNameCellStyle.cellTextColor = "#745151";
    dayNameCellStyle.cellTextFontName = "Times New Roman";
    dayNameCellStyle.cellTextFontStyle = "Bold";
    dayNameCellStyle.cellTextSize = 10;
    monthViewStyle.dayNameCellStyle = dayNameCellStyle;

    const titleCellStyle = new DayCellStyle();
    titleCellStyle.cellBackgroundColor = "#bbcbdb";
    titleCellStyle.cellBorderWidth = 1;
    titleCellStyle.cellBorderColor = "#745151";
    titleCellStyle.cellTextColor = "#dd855c";
    titleCellStyle.cellTextFontName = "Times New Roman";
    titleCellStyle.cellTextFontStyle = "Bold";
    titleCellStyle.cellTextSize = 18;
    monthViewStyle.titleCellStyle = titleCellStyle;
*/
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
    var hora = data.getUTCHours() < 10 ? "0" + data.getUTCHours() : data.getUTCHours();
    var minutos = data.getUTCMinutes() < 10 ? "0" + data.getUTCMinutes() : data.getUTCMinutes();
    var horafim = datafim.getUTCHours() < 10 ? "0" + datafim.getUTCHours() : datafim.getUTCHours();
    var minutosfim = datafim.getUTCMinutes() < 10 ? "0" + datafim.getUTCMinutes() : datafim.getUTCMinutes();
    item.row.ano = data.getUTCFullYear();
    item.row.data = diames + "\\" + mes + "\\" + data.getUTCFullYear() + " - " + semana[data.getDay()];
    item.row.time = hora + ":" + minutos;
    item.row.timefim = horafim + ":" + minutosfim;
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

  loadlist(array, key, idestilo) {
    this.carregando = true;
    this.userService.db
      .get(encodeURI("key=" + key +
        "&idcategoria=" + this.route.snapshot.params["idcategoria"] +
        "&cidade=" + this.route.snapshot.params["cidade"] +
        "&uf=" + this.route.snapshot.params["uf"] +
        "&idestilo=" + idestilo))
      .subscribe(res => {
        if (res != null) {
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
            if (key == "eventosregiao") {
              var startDate: Date
                , endDate: Date
                , event: CalendarEvent;
              var t = row.datahorario.split(/[- :]/);
              console.dir(t)
              //console.log("hora=" + t[3])
              startDate = new Date(t[0], t[1] - 1, t[2], t[3], t[4], t[5], 0);
              /* console.log(startDate.toISOString());
               console.log(startDate.toJSON());
               console.log(startDate.toLocaleDateString());
               console.log(startDate.toLocaleString());
               console.log(startDate.toLocaleTimeString());
               console.log(startDate.toTimeString());*/
              t = row.datafim.split(/[- :]/);

              endDate = new Date(t[0], t[1] - 1, t[2], t[3], t[4], t[5], 0);

              let colors: Array<Color> = [new Color(200, 188, 26, 214), new Color(220, 255, 109, 130), new Color(255, 55, 45, 255), new Color(199, 17, 227, 10), new Color(255, 255, 54, 3)];

              event = new CalendarEvent(row.nome + ":" + row.id, startDate, endDate, false, colors[(i++) * 10 % (colors.length - 1)]);
              this._events.push(event);
              this.configureevento(array[array.length - 1])


            }

          });
          if (key == "eventosregiao") {
            this.cureventindex = 0;
            this._calendar.nativeElement.goToDate(this._events[this.cureventindex].startDate)
          }

          console.dir(array);
        }
        this.carregando = false;
      });
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
            console.log("Location error received: " + error);
            alert("Location error received: " + error);
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
    this.userService.db
      .geturl("https://www.athena3d.com.br/bomdeir/clima.php?cidade=" + this.userService.db.__encodeURI(item.row.localidade), "application/xml")
      .subscribe(res => {
        console.log("aqui")
        var idcidade;
        if ((<any>res).cidade.length != undefined) {
          console.dir((<any>res).cidade[0]);
          for (let i = 0; i < (<any>res).cidade.length; i++) {
            if ((<any>res).cidade[i].uf == item.row.uf) {
              idcidade = (<any>res).cidade[i].id;
            }
          };
        }
        else
          idcidade = (<any>res).cidade.id;
        this.userService.db
          .geturl("https://www.athena3d.com.br/bomdeir/clima.php?idcidade=" + idcidade, "application/xml")
          .subscribe(res => {
            this.curevento.row.clima=(<any>res).previsao[0].tempo;
            this.curevento.row.minima=(<any>res).previsao[0].minima;
            this.curevento.row.maxima=(<any>res).previsao[0].maxima;
            console.dir((<any>res).previsao[0]);
          });
      });

    this.pagenumber++;
    console.dir(this.curevento);
  }

  goback() {
    if (this.showwebview)
      this.showwebview = false;
    else if (this.showmap)
      this.showmap = false;
    else if (this.pagenumber == 0)
      this.routerExtensions.backToPreviousPage();
    else
      this.pagenumber--;
  }

  onSwipe(args: SwipeGestureEventData) {
    console.log("Swipe!");
    console.log("Object that triggered the event: " + args.object);
    console.log("View that triggered the event: " + args.view);
    console.log("Event name: " + args.eventName);
    console.log("Swipe Direction: " + args.direction);
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

  ngOnInit(): void {
    //this.item = this.itemService.getItem();
    //console.log("items");
    //console.dir(this.items);
  }
}