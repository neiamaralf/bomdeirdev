import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { LoginComponent } from "./pages/login/login.component";
import { EstilosEvtComponent } from "./pages/estilos/estilosevt.component";
import { EditaEventoComponent } from "./pages/admin/editaeventos";
import { ItemsComponent } from "./item/items.component";
import { CidadesComponent } from "./item/cidades";
import { ItemDetailComponent } from "./item/item-detail.component";
import { SubItemDetailComponent } from "./item/subitem-detail.component";
import { CepComponent } from "./item/cep";
import { EventosComponent } from "./item/eventos";
import { BuscaCepComponent } from "./item/buscacep";
import { LocaisComponent } from "./item/locais";

const routes: Routes = [
 { path: "", component: LoginComponent },
 { path: "items/:cidade/:uf/:tipo", component: ItemsComponent },
 { path: "estilos/:idcategoria/:cidade/:uf/:tipo", component: EstilosEvtComponent },
 { path: "subitem/:id", component: SubItemDetailComponent },
 { path: "item/:id", component: ItemDetailComponent },
 { path: "editaeventos/:campo/:iditem/:valor/:idcategoria/:idadmin", component: EditaEventoComponent },
 { path: "cep/:itemid/:idcategoria/:idadmin", component: CepComponent },
 { path: "eventos/:itemid/:acao/:idcategoria/:idadmin", component: EventosComponent },
 { path: "buscacep/:itemid/:idcategoria/:idadmin", component: BuscaCepComponent },
 { path: "cidades/:add", component: CidadesComponent },
 { path: "locais/:itemid/:acao/:cep/:logradouro/:bairro/:localidade/:uf/:idcategoria/:idadmin", component: LocaisComponent },
];

@NgModule({
 imports: [NativeScriptRouterModule.forRoot(routes)],
 exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
