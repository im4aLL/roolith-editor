export class Modal {
    constructor(renderer: any, observer: any);
    renderer: any;
    observer: any;
    range: boolean | Range | null;
    sel: boolean | Selection | null;
    editor: HTMLElement | null;
    editorBody: Element | null;
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
