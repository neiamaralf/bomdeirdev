import { Injectable } from "@angular/core";
import { Item } from "./item";
import { UserService } from "../shared/user/user.service";

@Injectable()
export class ItemService {
    private items = new Array<Item>(
    );

    constructor(private userService: UserService) {
        console.log("itemservice");
        console.dir(userService.user);
        console.log(userService.user.super);
        this.inititems();
    }

    inititems() {
        this.items = [];
        if (this.userService.user.super == 0) {
            this.items.push(
                {
                    id: 1, name: "MÚSICA", menu: new Array<Item>(
                        { id: 8, iddono: 1, key: "estilos", name: "ESTILOS", menu: new Array<Item>() }
                    )
                },
                {
                    id: 2, name: "TEATRO", menu: new Array<Item>(
                        { id: 9, iddono: 2, key: "estilos", name: "ESTILOS", menu: new Array<Item>() }
                    )
                },
                {
                    id: 3, name: "ARTE", menu: new Array<Item>(
                        { id: 10, iddono: 3, key: "estilos", name: "ESTILOS", menu: new Array<Item>() }
                    )
                },
                {
                    id: 4, name: "CINEMA", menu: new Array<Item>(
                        { id: 11, iddono: 4, key: "estilos", name: "ESTILOS", menu: new Array<Item>() }
                    )
                },
                {
                    id: 5, name: "GASTRONOMIA", menu: new Array<Item>(
                        { id: 12, iddono: 5, key: "estilos", name: "ESTILOS", menu: new Array<Item>() }
                    )
                },
                {
                    id: 6, name: "DANÇA", menu: new Array<Item>(
                        { id: 13, iddono: 6, key: "estilos", name: "ESTILOS", menu: new Array<Item>() }
                    )
                },
                {
                    id: 7, name: "REQUISIÇÕES", menu: new Array<Item>(
                        { id: 14, iddono: 7, key: "getrequisicoes", name: "REQUISIÇÕES", menu: new Array<Item>() }
                    )
                });
        }
        else if (this.userService.user.super == 1) {
            this.items.push(
                {
                    id: 1, name: "MÚSICA", menu: new Array<Item>(
                        { id: 8, iddono: 1, key: "artistas", name: "ARTISTAS", menu: new Array<Item>() },
                        { id: 9, iddono: 1, key: "locais", name: "LOCAIS", menu: new Array<Item>() },
                        { id: 10, iddono: 1, key: "eventos", name: "EVENTOS", menu: new Array<Item>() }
                    )
                },
                {
                    id: 2, name: "TEATRO", menu: new Array<Item>(
                        { id: 11, iddono: 2, key: "artistas", name: "ARTISTAS", menu: new Array<Item>() },
                        { id: 12, iddono: 2, key: "locais", name: "LOCAIS", menu: new Array<Item>() },
                        { id: 13, iddono: 2, key: "eventos", name: "EVENTOS", menu: new Array<Item>() }
                    )
                },
                {
                    id: 3, name: "ARTE", menu: new Array<Item>(
                        { id: 14, iddono: 3, key: "artistas", name: "ARTISTAS", menu: new Array<Item>() },
                        { id: 15, iddono: 3, key: "locais", name: "LOCAIS", menu: new Array<Item>() },
                        { id: 16, iddono: 3, key: "eventos", name: "EVENTOS", menu: new Array<Item>() }
                    )
                },
                {
                    id: 4, name: "CINEMA", menu: new Array<Item>(
                        { id: 17, iddono: 4, key: "locais", name: "LOCAIS", menu: new Array<Item>() },
                        { id: 18, iddono: 4, key: "eventos", name: "EVENTOS", menu: new Array<Item>() }
                    )
                },
                {
                    id: 5, name: "GASTRONOMIA", menu: new Array<Item>(
                        { id: 19, iddono: 5, key: "locais", name: "LOCAIS", menu: new Array<Item>() },
                        { id: 20, iddono: 5, key: "eventos", name: "EVENTOS", menu: new Array<Item>() }
                    )
                },
                {
                    id: 6, name: "DANÇA", menu: new Array<Item>(
                        { id: 21, iddono: 6, key: "locais", name: "LOCAIS", menu: new Array<Item>() },
                        { id: 22, iddono: 5, key: "eventos", name: "EVENTOS", menu: new Array<Item>() }
                    )
                },
                {
                    id: 7, name: "REQUISIÇÕES", menu: new Array<Item>(
                        { id: 23, iddono: 7, key: "getreqpend", name: "PENDENTES", menu: new Array<Item>() },
                        { id: 24, iddono: 7, key: "getreqaprovadas", name: "APROVADAS", menu: new Array<Item>() }
                    )
                });
        }
        else if (this.userService.user.super == 2) {
            this.items.push(
                {
                    id: 1, name: "MÚSICA", menu: new Array<Item>()
                },
                {
                    id: 2, name: "TEATRO", menu: new Array<Item>(

                    )
                },
                {
                    id: 3, name: "ARTE", menu: new Array<Item>(

                    )
                },
                {
                    id: 4, name: "CINEMA", menu: new Array<Item>(

                    )
                }
            );
        }

    }

    getItems(): Item[] {
        return this.items;
    }

    filterByIdNivel(id): Item {
        var filtered: Item;
        this.items.forEach(function (item) {
            if (item.id == id) { filtered = item; return; }
            else if (item.menu) {
                item.menu.forEach(function (subitem) {
                    if (subitem.id == id) { filtered = subitem; return; }
                })
            }
        });
        return filtered;
    }

    getItem(id: number): Item {
        return this.filterByIdNivel(id);
    }
}
