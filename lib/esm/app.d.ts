export class RoolithEditor {
    constructor(selector: any, settings?: {});
    selector: any;
    instanceId: string;
    settings: {};
    renderer: Renderer | null;
    eventHandler: EventHandler | null;
    modal: Modal | null;
    openModalCallback: any;
    observer: typeof Observer;
    on: typeof Observer.listen;
    init(): void;
    insertContent(content?: string): void;
    openModal(title: string | undefined, content: string | undefined, callback: any): void;
    closeModal(): void;
    change(callback?: any): void;
    observeModalInsert(): void;
}
import { Renderer } from "./renderer";
import { EventHandler } from "./eventHandler";
import { Modal } from "./modal";
import { Observer } from "./observer";
