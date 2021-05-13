import { Event } from "./event";
import { Helper } from "./helper";
import { Renderer } from "./renderer";
import { Modal } from "./modal";
import { Observer } from "./observer";

export class RoolithEditor {
    constructor(selector, settings = {}) {
        this.selector = selector;
        this.instanceId = Helper.generateInstanceId(15);
        this.settings = {...settings};
        this.renderer = null;
        this.event = null;
        this.modal = null;
        this.observer = Observer;
        this.on = this.observer.listen.bind(this);

        this.init();
    }

    init() {
        this.renderer = new Renderer(this.selector, this.instanceId, this.settings);
        this.renderer.generate();
        this.modal = new Modal(this.renderer, this.observer);

        this.event = new Event(this.renderer, this.modal, this.observer, this.settings);
        this.event.register();

        this.observeModalInsert();
    }

    insertContent(content = '') {
        this.closeModal();

        this.modal.setFocusToEditor();
        
        if (content && content.length > 0) {
            Helper.insertAtCaret(content);
        }
    }

    openModal(title = '', content = '') {
        this.modal.open({ title, content });
    }

    closeModal() {
        this.modal.close();
    }

    change(callback = null) {
        if (callback) {
            callback.call(this);
        }
    }

    observeModalInsert() {
        this.observer.listen('modalInsert', value => {
            if (value.command === 'image' && value.roolithModalImageUrl?.length > 0) {
                const html = `<img src="${value.roolithModalImageUrl}" title="${value.roolithModalImageTitle}">`;
                this.insertContent(html);
            } else if (value.command === 'video' && value.roolithModalEmbededCode?.length > 0) {
                this.insertContent(value.roolithModalEmbededCode);
            }
        });
    }
}

window.RoolithEditor = RoolithEditor;