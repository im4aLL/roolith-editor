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

        this.init();
    }

    init() {
        this.renderer = new Renderer(this.selector, this.instanceId, this.settings);
        this.renderer.generate();
        this.modal = new Modal(this.renderer);

        this.event = new Event(this.renderer, this.modal, this.settings);
        this.event.register();

        this.observe();
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

    observe() {
        Observer.listen('modalInsert', (eventName, value) => {
            if (value.command === 'image') {
                const html = `<img src="${value.roolithModalImageUrl}" title="${value.roolithModalImageTitle}">`;
                this.insertContent(html);
            } else if (value.command === 'video') {
                this.insertContent(value.roolithModalEmbededCode);
            }
        });
    }
}

window.RoolithEditor = RoolithEditor;