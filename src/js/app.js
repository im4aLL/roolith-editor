import { Event } from "./event";
import { Helper } from "./helper";
import { Renderer } from "./renderer";
import { Modal } from "./modal";

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
    }

    insertContent(content = '') {
        this.closeModal();

        this.modal.setFocusToEditor();
        Helper.insertAtCaret(content);
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
}

window.RoolithEditor = RoolithEditor;