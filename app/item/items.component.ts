import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Item } from "./item";
import { ItemService } from "./item.service";
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

class local {
    cidade: string;
    uf: string;
}

@Component({
    selector: "ns-items",
    moduleId: module.id,
    templateUrl: "./items.component.html",
})
export class ItemsComponent implements OnInit {

    items: Item[];
    tipo: any;
    locais: Array<local> = [];
    cidades: any[] = [];
    showlocais: boolean = false;
    showaddlocal: boolean = false;
    tabSelectedIndex: number = 0;
    searchPhrase = "";
    carregando: boolean = false;
    public myItems: Array<SegmentedBarItem>;
    loc = fromObject({
        cidade: "",
        uf: ""
    });
    @ViewChild("container") container: ElementRef;
    constructor(
        private itemService: ItemService,
        private userService: UserService,
        private routerExtensions: RouterExtensions,
        private route: ActivatedRoute,
        private page: Page,
        private locationService: LocationService) {
        console.log("user");
        console.dir(userService.user);
        itemService.inititems();


        //appsettings.remove('locais');

       
        this.tipo = this.route.snapshot.params["tipo"];
        
    }

    ngOnInit(): void {
        ItemsComponent.__this = this;
        this.items = this.itemService.getItems();
        if (this.userService.user.super == 2) {
            this.items = [];
            var __this = this;
            __this.carregando = true;
            this.locationService.getEndFromlatlong(this.loc, function (res) {
                //console.dir(res);
                (<any>__this.loc).cidade = (<any>res).results[0].address_components[0].short_name;
                (<any>__this.loc).uf = (<any>res).results[0].address_components[1].short_name;
    
                // __this.routerExtensions.navigate(["/items/" + (<any>__this.loc).cidade + "/" + (<any>__this.loc).uf + "/" + page], { clearHistory: false });
                //console.dir((<any>__this.loc));
                if (!appsettings.hasKey("locais") && (<any>__this.loc).cidade != "0") {
                    __this.locais.push(
                        {
                            cidade: (<any>__this.loc).cidade,
                            uf: (<any>__this.loc).uf
                        }
                    )
                    appsettings.setString("locais", JSON.stringify(__this.locais));
                }
                else if (appsettings.hasKey("locais")) {
                    __this.locais = JSON.parse(appsettings.getString("locais"));
    
                }
                __this.myItems = [];
                __this.locais.forEach(function (row, index) {
                    const item = new SegmentedBarItem();
                    item.setInlineStyle("font-family: 'FontAwesome', 'fontawesome-webfont';color:red;background-color:green")
                    item.title = index == 0 ? '\uf041' : '\uf111';
                    ItemsComponent.__this.myItems.push(item);
    
                });
    
    
                __this.carregando = false;
            });
            console.dir(this.locais);
            this.carregaitems()

        }
        //console.log("items");
        //console.dir(this.items);


    }


    listacidades() {
        this.showlocais = true;
        console.log(this.showlocais)
    }

    localclic(item, index) {
        console.dir(item);
        var segmbar: SegmentedBar = <SegmentedBar>ItemsComponent.__this.page.getViewById("segmbar");
        this.tabSelectedIndex = index;
        segmbar.selectedIndex = this.tabSelectedIndex;
        this.showlocais = false;
    }

    dellocal(index) {
        if (index == 0) return;
        this.locais.splice(index, 1);
        var segmbar: SegmentedBar = <SegmentedBar>ItemsComponent.__this.page.getViewById("segmbar");
        this.myItems.splice(index, 1);
        segmbar.items.splice(index, 1);
        appsettings.setString("locais", JSON.stringify(this.locais));
        this.tabSelectedIndex = 0;
        segmbar.selectedIndex = 0;
    }

    add() {
        var searchBar: SearchBar = <SearchBar>this.page.getViewById("sblocal");
        this.showaddlocal = true;
        setTimeout(() => {
            searchBar.focus();
        }, 500);
    }

    lvcidades(item) {
        console.dir(item);
        this.showaddlocal = false;
        //this.showlocais = false;
        this.locais.push(
            {
                cidade: item.row.nome,
                uf: item.row.uf
            }
        )
        const si = new SegmentedBarItem();
        si.setInlineStyle("font-family: 'FontAwesome', 'fontawesome-webfont';color:red;background-color:green")
        //item.id=
        si.title = this.locais.length == 1 ? '\uf041' : '\uf111';
        this.myItems.push(si);
        var segmbar: SegmentedBar = <SegmentedBar>ItemsComponent.__this.page.getViewById("segmbar");
        segmbar.selectedIndex = this.myItems.length - 1;
        appsettings.setString("locais", JSON.stringify(this.locais));


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

        /* let container = <View>ItemsComponent.__this.container.nativeElement;
     container.animate({
       backgroundColor:  new Color("#601217"),
       duration: 200
     });*/
    }

    goback() {
        if (this.showaddlocal)
            this.showaddlocal = false;
        else if (this.showlocais)
            this.showlocais = false;
        else
            this.routerExtensions.backToPreviousPage();
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

    onclick(item) {
        
        if (this.userService.user.super == 2) {
            this.carregando = true;
            if (this.tipo == "onde")
                this.routerExtensions.navigate(["/estilos/" + item.id + "/" + this.locais[this.tabSelectedIndex].cidade + "/" + this.locais[this.tabSelectedIndex].uf + "/" + this.tipo],
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
        (<any>this.loc).cidade = this.locais[this.tabSelectedIndex].cidade;
        (<any>this.loc).uf = this.locais[this.tabSelectedIndex].uf;
        if (this.userService.user.super == 2)
            this.carregaitems()
    }

    

}