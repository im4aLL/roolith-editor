export class Observer {
    static events: any[];
    static listen(name: any, callback: any): void;
    static listeners(eventNames: any[] | undefined, callback: any): void;
    static dispatch(name: any, arg: any): void;
}
