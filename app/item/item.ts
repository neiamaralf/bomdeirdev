export interface Item {
    id: number;
    iddono?: number;
    key?: string;
    name: string;
    menu: Array<Item>;
}
