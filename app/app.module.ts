import { NgModule, NgModuleFactoryLoader, NO_ERRORS_SCHEMA, SystemJsNgModuleLoader } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { LoginComponent } from "./pages/login/login.component";
import { EstilosEvtComponent } from "./pages/estilos/estilosevt.component";
import { ItemService } from "./item/item.service";
import { CidadesService } from "./item/cidades.service";
import { CidadesComponent } from "./item/cidades";
import { ItemsComponent } from "./item/items.component";
import { DbService } from "./shared/db/db.service";
import { User } from "./shared/user/user";
import { UserService } from "./shared/user/user.service";
import { LocationService } from "./shared/location/location.service";
import * as platform from "platform";
import { NativeScriptUICalendarModule } from "nativescript-ui-calendar/angular";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { ItemDetailComponent } from "./item/item-detail.component";
import { SubItemDetailComponent } from "./item/subitem-detail.component";
import { CepComponent } from "./item/cep";
import { EventosComponent } from "./item/eventos";
import { BuscaCepComponent } from "./item/buscacep";
import { LocaisComponent } from "./item/locais";

declare var GMSServices: any;

if (platform.isIOS) { 
  GMSServices.provideAPIKey("AIzaSyCpX-cfRtq9NrAeY1DRUs1uoLxeMwK_a4I");
}


@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        NativeScriptModule,
        AppRoutingModule,
        NativeScriptHttpClientModule,
        NativeScriptUICalendarModule,
        NativeScriptFormsModule,
    ],
    declarations: [
        AppComponent,
        LoginComponent,
        ItemDetailComponent,
        SubItemDetailComponent,
        EstilosEvtComponent,
        ItemsComponent,
        CepComponent,
        EventosComponent,
        BuscaCepComponent,
        LocaisComponent,
        CidadesComponent
    ],
    providers: [
        User,
        DbService,
        UserService,
        LocationService,
        ItemService,
        CidadesService,
        { provide: NgModuleFactoryLoader, useClass: SystemJsNgModuleLoader }
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class AppModule { }
