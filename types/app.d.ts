export class RoolithEditor {
    constructor(selector: any, settings?: {});
    selector: any;
    instanceId: string;
    settings: {};
    renderer: Renderer;
    eventHandler: EventHandler;
    modal: Modal;
    openModalCallback: any;
    observer: typeof Observer;
    on: any;
    init(): void;
    insertContent(content?: string): void;
    openModal(title: string, content: string, callback: any): void;
    closeModal(): void;
    change(callback?: any): void;
    observeModalInsert(): void;
}
declare class Renderer {
    constructor(selector: any, instanceId: any, settings: any);
    selector: any;
    instanceId: any;
    settings: any;
    buttons: string[];
    editorId: string;
    getButtons(): string[];
    getEditorId(): string;
    generate(): void;
    generateSkeleton(): void;
    generateToolbar(): void;
    hideSelector(): void;
    attachInstanceClass(): void;
    getToolbarIcon(button: any): any;
    applyStyles(): void;
}
declare class EventHandler {
    constructor(renderer: any, modal: any, observer: any, settings: any);
    renderer: any;
    modal: any;
    observer: any;
    settings: any;
    editor: HTMLElement;
    editorBody: Element;
    register(): void;
    unregister(): void;
    registerToolbarEvents(): void;
    unregisterToolbarEvents(): void;
    toolbarButtonClickEvent(button: any, event: any): void;
    executeLinkCommand(event: any): boolean;
    executeVideoUrlCommand(event: any): void;
    executeImageCommand(event: any): void;
    executeVideoCommand(event: any): void;
    executeCommand(event: any, commandName: any, showUi?: boolean, value?: any): void;
    registerDocumentClick(): void;
    unregisterDocumentClick(): void;
    closeDropdown(): void;
    registerContentChangeEvent(): void;
    unregisterContentChangeEvent(): void;
    onChangeEditorBody(event: any): void;
}
declare class Modal {
    constructor(renderer: any, observer: any);
    renderer: any;
    observer: any;
    range: boolean | Range;
    sel: boolean | Selection;
    editor: HTMLElement;
    editorBody: Element;
    open(settings?: {
        title: string;
        content: string;
    }): void;
    close(): void;
    registerCloseEvent(): void;
    unregisterCloseEvent(): void;
    registerInsertEvent(): void;
    unregisterInsertEvent(): void;
    insertContent(): void;
    setFocusToEditor(callback: any): void;
    watchKeyboard(): void;
}
declare class Observer {
    static events: any[];
    static listen(name: any, callback: any): void;
    static listeners(eventNames: any[], callback: any): void;
    static dispatch(name: any, arg: any): void;
}
export {};
