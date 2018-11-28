import { Component, OnInit } from "@angular/core";
import { Item } from "./item";
import { ItemService } from "./item.service";
import { CidadesService } from "./cidades.service";
import { UserService } from "../shared/user/user.service";
import { RouterExtensions } from "nativescript-angular/router";
import { ActivatedRoute } from "@angular/router";
import { Page } from "tns-core-modules/ui/page";
import * as appsettings from "application-settings";
import * as gestures from "ui/gestures";
import { SegmentedBar, SegmentedBarItem } from "ui/segmented-bar";
import { LocationService } from "../shared/location/location.service";
import { fromObject } from "tns-core-modules/data/observable";
import { Router, NavigationEnd } from '@angular/router';

@Component({
    selector: "ns-items",
    moduleId: module.id,
    templateUrl: "./items.component.html",
})
export class ItemsComponent implements OnInit {
    items: Item[] = [];
    tipo: any;
    searchPhrase = "";
    carregando: boolean = false;
    public myItems: Array<SegmentedBarItem> = [];
    loc = fromObject({
        cidade: "",
        uf: ""
    });

    constructor(
        private itemService: ItemService,
        private userService: UserService,
        private routerExtensions: RouterExtensions,
        private route: ActivatedRoute,
        private page: Page,
        private locationService: LocationService,
        private cidadesService: CidadesService,
        private router: Router
    ) {
        console.log("user");
        console.dir(userService.user);
        itemService.inititems();
        //appsettings.remove('locais');
        this.tipo = this.route.snapshot.params["tipo"];
    }

    updateitems(__this, cidade, uf) {
        (<any>__this.loc).cidade = cidade;
        (<any>__this.loc).uf = uf;
        __this.myItems = [];
        __this.cidadesService.locais.forEach(function (row, index) {
            const item = new SegmentedBarItem();
            item.setInlineStyle("font-family: 'FontAwesome', 'fontawesome-webfont';color:red;background-color:green")
            item.title = index == 0 ? '\uf041' : '\uf111';
            __this.myItems.push(item);
        });
        __this.carregando = false;
        __this.carregaitems();
    }

    carregaitems() {
        setTimeout(() => {
            this.items = [];
            this.carregando = true;
            this.userService.db
                .get("key=categoriascomeventos" +
                    "&cidade=" + encodeURI((<any>this.loc).cidade) +
                    "&uf=" + (<any>this.loc).uf)
                .subscribe(res => {
                    if (res != null) {
                        this.items = [];
                        (<any>res).result.forEach(row => {
                            this.items.push({ id: row.id, name: row.nome, menu: new Array<Item>() })
                        });

                        console.dir(this.items);
                    }
                    this.carregando = false;
                });
        });
    }

    init() {
        if (this.userService.user.super == 2) {
            setTimeout(() => {
                var __this = this;
                console.log(appsettings.getString("locais"))
                if (appsettings.hasKey("locais")) console.log("locais ok")
                if (!appsettings.hasKey("locais") && (<any>__this.loc).cidade != "0") {
                    this.locationService.enableLocation(function (isEnabled) {
                        __this.carregando = true;
                        //if (__this.cidadesService.locais.length == 0)
                            __this.locationService.getEndFromlatlong(function (res) {
                                __this.cidadesService.locais.push(
                                    {
                                        cidade: (<any>res).results[0].address_components[0].short_name,
                                        uf: (<any>res).results[0].address_components[1].short_name
                                    }
                                );

                                appsettings.setString("locais", JSON.stringify(__this.cidadesService.locais));

                                __this.updateitems(__this, (<any>res).results[0].address_components[0].short_name,
                                    (<any>res).results[0].address_components[1].short_name)

                            }
                            );
                    },
                        function () {
                            __this.carregando = false;
                            if (__this.cidadesService.locais.length == 0)
                                __this.listacidades('true', true);
                        }
                    );
                }
                else if (appsettings.hasKey("locais")) {
                    __this.cidadesService.locais = JSON.parse(appsettings.getString("locais"));
                    __this.updateitems(__this, __this.cidadesService.locais[__this.cidadesService.curlocal].cidade,
                        __this.cidadesService.locais[__this.cidadesService.curlocal].uf)
                }
                console.dir(this.cidadesService.locais);
            });
        }
        else this.items = this.itemService.getItems();
    }

    ngOnInit(): void {
        this.init();
        this.router.events.subscribe((val) => {
            if (val instanceof NavigationEnd) {
                if (this.router.url == "/items/0/0/onde") {
                    if (this.cidadesService.locais.length == 0 || this.cidadesService.alterado == true) {
                        this.cidadesService.alterado = false;
                        this.init();
                    }
                    else if (this.cidadesService.indexalterado == true) {
                        this.cidadesService.indexalterado = false;
                        (<any>this.loc).cidade = this.cidadesService.locais[this.cidadesService.curlocal].cidade;
                        (<any>this.loc).uf = this.cidadesService.locais[this.cidadesService.curlocal].uf;
                        this.carregaitems();
                    }


                    console.log(this.router.url)
                };

            }
        });

    }



    public onSubmit(args) {

    }

    onSwipe(args: gestures.SwipeGestureEventData) {
        var segmbar: SegmentedBar = <SegmentedBar>this.page.getViewById("segmbar");
        switch (args.direction) {
            case 1:
                if (this.cidadesService.curlocal > 0)
                    this.cidadesService.curlocal--;
                break;
            case 2:
                if (this.cidadesService.curlocal < segmbar.items.length - 1)
                    this.cidadesService.curlocal++;
                break;
        }
    }

    listacidades(addparam, clearhistory) {
        console.log("cidades")
        this.carregando = true;
        this.routerExtensions.navigate(["/cidades/" + addparam],
            {
                clearHistory: clearhistory,
                transition: {
                    name: "slide",
                    duration: 200,
                    curve: "ease"

                }
            }).
            then(() => {
                this.carregando = false;
            });
    }

    onclick(item) {
        if (this.userService.user.super == 2) {
            this.carregando = true;
            if (this.tipo == "onde")
                this.routerExtensions.navigate(["/estilos/" + item.id + "/" + this.cidadesService.locais[this.cidadesService.curlocal].cidade + "/" + this.cidadesService.locais[this.cidadesService.curlocal].uf + "/" + this.tipo],
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
                    });
            else
                this.routerExtensions.navigate(["/estilos/" + item.id + "/0/0/" + this.tipo], { clearHistory: false });
        }
        else
            this.routerExtensions.navigate(["/item/" + item.id], { clearHistory: false });
        console.dir(item);
    }

    public onSelectedIndexChange(args) {
        let segmentedBar = <SegmentedBar>args.object;
        console.dir(args);
        if (!this.cidadesService.alterado && !this.cidadesService.indexalterado) {
            this.cidadesService.curlocal = segmentedBar.selectedIndex;
            (<any>this.loc).cidade = this.cidadesService.locais[this.cidadesService.curlocal].cidade;
            (<any>this.loc).uf = this.cidadesService.locais[this.cidadesService.curlocal].uf;
            if (this.userService.user.super == 2)
                this.carregaitems();
        }

    }
}