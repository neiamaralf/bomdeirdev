import { Component, OnInit } from "@angular/core";
import { Item } from "./item";
import { ItemService } from "./item.service";
import { CidadesService } from "./cidades.service";
import { UserService } from "../shared/user/user.service";
import { RouterExtensions } from "nativescript-angular/router";
import { ActivatedRoute } from "@angular/router";
import { Page } from "tns-core-modules/ui/page";
import { SearchBar } from "ui/search-bar";
import * as appsettings from "application-settings";
import * as gestures from "ui/gestures";
import { SegmentedBar, SegmentedBarItem } from "ui/segmented-bar";
import { LocationService } from "../shared/location/location.service";
import { fromObject } from "tns-core-modules/data/observable";

@Component({
    selector: "ns-items",
    moduleId: module.id,
    templateUrl: "./items.component.html",
})
export class ItemsComponent implements OnInit {
    items: Item[];
    tipo: any;
    showlocais: boolean = false;
    tabSelectedIndex: number = 0;
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
        private cidadesService: CidadesService
    ) {
        var __this=this;
        this.page.on(Page.navigatingToEvent, function(){
            console.log("navigating to this page");
            __this.init()
        })
        console.log("user");
        console.dir(userService.user);
        itemService.inititems();
        //appsettings.remove('locais');
        this.tipo = this.route.snapshot.params["tipo"];
    }

    init(){
        ItemsComponent.__this = this;
        this.items = this.itemService.getItems();
        if (this.userService.user.super == 2) {
            this.items = [];
            this.carregando = true;
            var __this = this;
            this.locationService.enableLocation(function () {
                __this.locationService.getEndFromlatlong(__this.loc, function (res) {
                    (<any>__this.loc).cidade = (<any>res).results[0].address_components[0].short_name;
                    (<any>__this.loc).uf = (<any>res).results[0].address_components[1].short_name;
                    if (!appsettings.hasKey("locais") && (<any>__this.loc).cidade != "0") {
                        __this.cidadesService.locais.push(
                            {
                                cidade: (<any>__this.loc).cidade,
                                uf: (<any>__this.loc).uf
                            }
                        )
                        appsettings.setString("locais", JSON.stringify(__this.cidadesService.locais));
                    }
                    else if (appsettings.hasKey("locais")) {
                        __this.cidadesService.locais = JSON.parse(appsettings.getString("locais"));

                    }
                    __this.myItems = [];
                    __this.cidadesService.locais.forEach(function (row, index) {
                        const item = new SegmentedBarItem();
                        item.setInlineStyle("font-family: 'FontAwesome', 'fontawesome-webfont';color:red;background-color:green")
                        item.title = index == 0 ? '\uf041' : '\uf111';
                        __this.myItems.push(item);

                    });
                    __this.carregando = false;
                });
            },
                function () {
                    __this.carregando = false;
                    if (!appsettings.hasKey("locais")) {
                        __this.showlocais = true;
                    }
                    else {
                        __this.cidadesService.locais = JSON.parse(appsettings.getString("locais"));
                        (<any>__this.loc).cidade = __this.cidadesService.locais[0].cidade;
                        (<any>__this.loc).uf = __this.cidadesService.locais[0].uf;
                        __this.myItems = [];
                        __this.cidadesService.locais.forEach(function (row, index) {
                            const item = new SegmentedBarItem();
                            item.setInlineStyle("font-family: 'FontAwesome', 'fontawesome-webfont';color:red;background-color:green")
                            item.title = index == 0 ? '\uf041' : '\uf111';
                            __this.myItems.push(item);
                        });
                        var segmbar: SegmentedBar = <SegmentedBar>__this.page.getViewById("segmbar");
                        __this.tabSelectedIndex = 0;
                        segmbar.selectedIndex = __this.tabSelectedIndex;
                    }



                });
            console.dir(this.cidadesService.locais);
            this.carregaitems();

        }
        console.log("items");
        //console.dir(this.items);
    }

    ngOnInit(): void {
       this.init()
    }

 

    public onSubmit(args) {

    }

    onSwipe(args: gestures.SwipeGestureEventData) {
        console.log("Swipe!");
        console.log("Object that triggered the event: " + args.object);
        console.log("View that triggered the event: " + args.view);
        console.log("Event name: " + args.eventName);
        console.log("Swipe Direction: " + args.direction);
        var segmbar: SegmentedBar = <SegmentedBar>ItemsComponent.__this.page.getViewById("segmbar");
        switch (args.direction) {
            case 1:
                if (ItemsComponent.__this.tabSelectedIndex > 0)
                    ItemsComponent.__this.tabSelectedIndex--;
                break;
            case 2:
                if (ItemsComponent.__this.tabSelectedIndex < segmbar.items.length - 1)
                    ItemsComponent.__this.tabSelectedIndex++;
                break;
        }
        segmbar.selectedIndex = ItemsComponent.__this.tabSelectedIndex;
    }


    carregaitems() {
        //this.carregando = true;
        this.items = [];
        this.userService.db
            .get("key=categoriascomeventos" +
                "&cidade=" + encodeURI((<any>this.loc).cidade) +
                "&uf=" + (<any>this.loc).uf)
            .subscribe(res => {
                if (res != null) {
                    (<any>res).result.forEach(row => {
                        this.items.push({ id: row.id, name: row.nome, menu: new Array<Item>() })
                    });

                    console.dir(this.items);
                }
                //this.carregando = false;
            });
    }

    listacidades() {
        console.log("cidades")
        this.carregando = true;
        this.routerExtensions.navigate(["/cidades"],
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
    }

    onclick(item) {

        if (this.userService.user.super == 2) {
            this.carregando = true;
            if (this.tipo == "onde")
                this.routerExtensions.navigate(["/estilos/" + item.id + "/" + this.cidadesService.locais[this.tabSelectedIndex].cidade + "/" + this.cidadesService.locais[this.tabSelectedIndex].uf + "/" + this.tipo],
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

    static __this: ItemsComponent;
    public tabs: any[] = [];

    public onSelectedIndexChange(args) {
        let segmentedBar = <SegmentedBar>args.object;
        this.tabSelectedIndex = segmentedBar.selectedIndex;
        (<any>this.loc).cidade = this.cidadesService.locais[this.tabSelectedIndex].cidade;
        (<any>this.loc).uf = this.cidadesService.locais[this.tabSelectedIndex].uf;
        if (this.userService.user.super == 2)
            this.carregaitems()
    }



}