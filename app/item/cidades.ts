import { Component, OnInit } from "@angular/core";
import { CidadesService } from "./cidades.service";
import * as appsettings from "application-settings";
import { SearchBar } from "ui/search-bar";
import { Page } from "tns-core-modules/ui/page";
import { RouterExtensions } from "nativescript-angular/router";
import { UserService } from "../shared/user/user.service";

@Component({
    selector: "ns-cidades",
    moduleId: module.id,
    templateUrl: "./cidades.html",
})
export class CidadesComponent implements OnInit {
 carregando:boolean=false;
    showaddlocal: boolean = false;
    cidades: any[] = [];

    constructor(
        private userService:UserService,
        private routerExtensions: RouterExtensions,
        private page: Page,
        private cidadesService: CidadesService
    ) {
    }
    ngOnInit(): void {
    }

    localclic(item,i){
        this.routerExtensions.backToPreviousPage();
        return;
       /* this.carregando = true;
        this.routerExtensions.navigate(["/"],
            {
                clearHistory: false,
                transition: {
                    name: "slide",
                    duration: 500,
                    curve: "ease"

                }
            }).
            then(() => {
                this.carregando = false;
            });*/
    }

    goback() {
        if (this.showaddlocal)
            this.showaddlocal = false;        
        else
            this.routerExtensions.backToPreviousPage();
    }

    
    dellocal(index) {
        if (index == 0) return;
        this.cidadesService.locais.splice(index, 1);
        appsettings.setString("locais", JSON.stringify(this.cidadesService.locais));
    }

    add() {
        var searchBar: SearchBar = <SearchBar>this.page.getViewById("sblocal");
        this.showaddlocal = true;
        setTimeout(() => {
            searchBar.focus();
        }, 500);
    }

    public onTextChanged(args) {
        let searchBar = <SearchBar>args.object;
        console.log("SearchBar text changed! New value: " + searchBar.text);
        this.cidades = [];
        this.userService.db
            .get("key=cidadeoucep" +
                "&cidade=" + encodeURI(searchBar.text))
            .subscribe(res => {
                if (res != null) {
                    (<any>res).result.forEach(row => {
                        this.cidades.push({
                            row
                        })
                    });
                    console.dir(this.cidades);
                }
                //this.carregando = false;
            });
    }

    lvcidades(item) {
        console.dir(item);
        this.showaddlocal = false;
        this.cidadesService.locais.push(
            {
                cidade: item.row.nome,
                uf: item.row.uf
            }
        )
        appsettings.setString("locais", JSON.stringify(this.cidadesService.locais));
    }
}