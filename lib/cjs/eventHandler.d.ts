export class EventHandler {
    constructor(renderer: any, modal: any, observer: any, settings: any);
    renderer: any;
    modal: any;
    observer: any;
    settings: any;
    editor: HTMLElement | null;
    editorBody: Element | null;
    register(): void;
    unregister(): void;
    registerToolbarEvents(): void;
    unregisterToolbarEvents(): void;
    toolbarButtonClickEvent(button: any, event: any): void;
    executeLinkCommand(event: any): false | undefined;
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
