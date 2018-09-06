import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";
import * as dialogs from "ui/dialogs";
import { Item } from "./item";
import { ItemService } from "./item.service";
import { DbService } from "../shared/db/db.service";
import { UserService } from "../shared/user/user.service";
import { Page } from "tns-core-modules/ui/page";

@Component({
    selector: "ns-subdetails",
    moduleId: module.id,
    templateUrl: "./subitem-detail.component.html",
})
export class SubItemDetailComponent {
    item: Item;
    isLoading = true;

    constructor(
        private itemService: ItemService,
        private route: ActivatedRoute,
        private router: Router,
        private db: DbService,
        private userService: UserService,
        private page: Page,
        private routerExtensions: RouterExtensions
    ) {
        this.ngOnInit();
    }

    goback() {
        this.routerExtensions.backToPreviousPage();
    }

    obterlista() {
        this.isLoading = true;
        if (this.userService.user.super == 2) {
            this.router.navigate(["/buscas/" + this.item.id + "/" + this.item.iddono + "/" + this.userService.user.id + "/" + this.item.key]);
        }
        else
            this.db
                .get("key=" + this.item.key + "&idcategoria=" + this.item.iddono + "&idadmin=" + this.userService.user.id)
                .subscribe(res => {
                    if (res != null) {
                        this.item.menu = [];
                        (<any>res).result.forEach(row => {
                            this.item.menu.push({
                                key: (<any>res).key, name: row.nome, id: row.id, menu: null,
                            });
                        });
                        console.log("item...");
                        console.dir(this.item);
                    }
                    this.isLoading = false;
                });
    }

    add() {
        console.dir(this.item);
        var title = "INSERIR " + this.item.name;
        console.dir(this.userService.user);
        if ((this.userService.user.super == 1) && (this.item.key == "locais")) {
            this.router.navigate(["/cep/" + this.item.id + "/" + this.item.iddono + "/" + this.userService.user.id]);
        }
        else if ((this.userService.user.super == 1) && (this.item.key == "eventos")) {
            this.router.navigate(["/eventos/" + this.item.id + "/inserir/" + this.item.iddono + "/" + this.userService.user.id]);
        }
        else
            dialogs.prompt({
                title: title,
                message: "",
                okButtonText: "Inserir",
                cancelButtonText: "Cancelar",
                defaultText: "",
                inputType: dialogs.inputType.text
            }).then(r => {
                if (r.result) {
                    this.db
                        .put({
                            op: 'adicionar',
                            key: this.item.key,
                            name: r.text.toUpperCase(),
                            idcategoria: this.item.iddono,
                            idadmin: this.userService.user.id
                        })
                        .subscribe(res => {
                            this.item.menu.push({
                                key: (<any>res).key, name: (<any>res).result.nome, id: (<any>res).result.id, menu: null,

                            });
                            console.dir(res);
                            console.log((<any>res).status);
                        });
                }
                console.log("Dialog result: " + r.result + ", text: " + r.text);
            });
    }

    delete(item) {
        this.db
            .delete("key=" + item.key + "&id=" + item.id)
            .subscribe(res => {
                console.dir(res);
                console.log((<any>res).status);
                if (res != null) {
                    var index = this.item.menu.indexOf(item, 0);
                    this.item.menu.splice(index, 1);
                }

            });



    }

    onclick(item) {
        console.dir(item);
        dialogs.prompt({
            title: "Editar",
            message: "",
            okButtonText: "Salvar",
            cancelButtonText: "Cancelar",
            neutralButtonText: "Apagar",
            defaultText: item.name,
            inputType: dialogs.inputType.text
        }).then(r => {
            switch (r.result) {
                case true:
                    this.db
                        .put({
                            op: 'atualizar',
                            key: item.key,
                            name: r.text.toUpperCase(),
                            id: item.id
                        })
                        .subscribe(res => {
                            item.name = (<any>res).result.nome;
                        });
                    break;
                case false:
                    break;
                default:
                    this.delete(item);

            }
            console.log("Dialog result: " + r.result + ", text: " + r.text);
        });
    }

    ngOnInit(): void {
        console.log("ngOnInit");
        var id: number = this.route.snapshot.params["id"]; console.log(id);
        this.item = this.itemService.getItem(id); console.dir(this.item);
        this.obterlista();


    }
}
