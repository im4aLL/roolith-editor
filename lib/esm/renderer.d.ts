export class Renderer {
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
