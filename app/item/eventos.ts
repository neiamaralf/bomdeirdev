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
import { action } from "ui/dialogs";
import { ImageAsset } from 'tns-core-modules/image-asset';
import * as imageSource from "image-source"
import * as imagepicker from "nativescript-imagepicker";
import { ImageCropper } from 'nativescript-imagecropper';
import { takePicture, requestPermissions } from 'nativescript-camera';
import { GestureEventData } from "tns-core-modules/ui/gestures";
@Component({
 moduleId: module.id,
 templateUrl: "./eventos.html",
})
export class EventosComponent implements OnInit {
 public imagemEvento: ImageAsset = null;
 private imageCropper: ImageCropper;
 public artistas: any[];
 titulo: string = "ARTISTA"
 public estilos: any[];
 public locais: any[];
 pagenumber: number = 0;
 curartista: any = null;
 curestilo: any = null;
 curlocal: any = null;
 carregando: boolean = true;
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

 onSwipe(args: GestureEventData, sovolta: boolean = false) {
  switch ((<any>args).direction) {
   case 1:
    this.goback();
    break;
   case 2:
    if (!sovolta)
     this.avancar();
    break;

  }
 }

 constructor(
  private itemService: ItemService,
  private routerExtensions: RouterExtensions,
  private db: DbService,
  private route: ActivatedRoute,
  private page: Page) {
  this.artistas = [];
  this.estilos = [];
  this.locais = [];
  this.label1.className = "whitetext";
  this.label2.className = "whitetext";
  this.label3.className = "whitetext";
 }

 ngOnInit() {
  this.imageCropper = new ImageCropper();
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
      this.carregando = false;
     }
    }
    else this.carregando = false;

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
    this.titulo = "HORÁRIO"
    break;
   case 5:
    this.titulo = "IMAGEM"
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
 imageUrl: any;
 tobase64(imageAsset: ImageAsset) {
  let source = new imageSource.ImageSource();
  source.fromAsset(imageAsset).then((source) => {
   console.log("source:")
   console.dir(source)
   this.imageCropper.show(source, { width: source.width, height: source.height }).then((args) => {
    if (args.image !== null) {
     //this.imagemEvento=source.t;
     console.log("args:")
     console.dir(args)
     console.log("args.image:")
     console.dir(args.image)
     this.imageUrl = args.image;
     //this.imagemEvento=new ImageAsset()
     // this.imageUrl = args.image;
    }
   })
    .catch(function (e) {
     console.log(e);
    });
  });
  imageAsset.getImageAsync(function (nativeImage) {
   let scale = 1;
   let height = 0;
   let width = 0;
   if (imageAsset.android) {
    height = nativeImage.getHeight();
    width = nativeImage.getWidth();
   } else {
    scale = nativeImage.scale;
    width = nativeImage.size.width * scale;
    height = nativeImage.size.height * scale;
   }
   console.log(`Displayed Size: ${width}x${height} with scale ${scale}`);
   console.log(`Image Size: ${width / scale}x${height / scale}`);
   var img = imageSource.fromNativeSource(nativeImage);
   console.log(img.toBase64String("png"));
  });
 }

 public onSelImgGaleria() {
  let context = imagepicker.create({
   mode: "single"
  });
  context
   .authorize()
   .then(() => {
    this.imagemEvento = null;
    return context.present();
   })
   .then((selection) => {
    console.log("Imagem selecionada: " + JSON.stringify(selection));
    this.imagemEvento = selection.length > 0 ? selection[0] : null;
    this.tobase64(this.imagemEvento);
   }).catch(function (e) {
    console.log(e);
   });
 }


 onSelImgCamera(args) {
  requestPermissions().then(
   () => {
    takePicture({ width: 300, height: 300, keepAspectRatio: true, saveToGallery: true })
     .then((imageAsset: any) => {
      this.imagemEvento = imageAsset;
      this.tobase64(this.imagemEvento);
     }, (error) => {
      console.log("Error: " + error);
     });
   },
   () => alert('permissions rejected')
  );
 }

 uploadfotodlg(args) {

  let options = {
   title: "Origem da imagem",
   message: "Escolha a origem da imagem",
   cancelButtonText: "Cancelar",
   actions: ["Câmera", "Galeria"]
  };

  action(options).then((result) => {
   if (result == "Câmera")
    this.onSelImgCamera(args)
   else if (result == "Galeria")
    this.onSelImgGaleria()
  });

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

 onDataIniLoaded(args) {
  let datePicker = <DatePicker>args.object;
  datePicker.minDate = new Date(Date.now());
  this.date = datePicker.date.toISOString().slice(0, 10);
 }

 onDataIniChanged(args) {
  let datePicker = <DatePicker>args.object;
  this.date = datePicker.date.toISOString().slice(0, 10);
  console.log(this.date);
 }

 onDataFimLoaded(args) {
  let datePicker = <DatePicker>args.object;
  datePicker.minDate = new Date(Date.now());
  this.date = datePicker.date.toISOString().slice(0, 10);
 }

 onDataFimChanged(args) {
  let datePicker = <DatePicker>args.object;
  this.date = datePicker.date.toISOString().slice(0, 10);
  console.log(this.date);
 }

 onHoraIniLoaded(args) {
  let timePicker = <TimePicker>args.object;
  timePicker.hour = 20;
  timePicker.minute = 0;
 }

 onHoraIniChanged(args) {
  let timePicker = <TimePicker>args.object;
  this.time = timePicker.time.toTimeString().slice(0, 8);  
  console.log(this.time);
 }

 onHoraFimLoaded(args) {
  let timePicker = <TimePicker>args.object;
  timePicker.hour = 20;
  timePicker.minute = 0;
 }

 onHoraFimChanged(args) {
  let timePicker = <TimePicker>args.object;
  this.timeend = timePicker.time.toTimeString().slice(0, 8);
  console.log(this.timeend);
 }

}
