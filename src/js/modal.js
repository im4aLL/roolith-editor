import { Helper } from "./helper";
import { Template } from "./template";

export class Modal {
    constructor(renderer) {
        this.renderer = renderer;

        this.range = null;
        this.editor = document.getElementById(this.renderer.editorId);
        this.editorBody = this.editor.querySelector('.roolith__editor__content');
        this.watchKeyboard();
    }

    open(settings = { title: 'Untitled', content: '' }) {
        this.range = Helper.saveSelection();
        this.setFocusToEditor(() => {
            this.range = Helper.saveSelection();
        });

        document.body.insertAdjacentHTML('afterend', Helper.parseTemplate(Template.modal, { title: settings.title, content: settings.content }));

        this.registerCloseEvent();
    }

    close() {
        const modal = document.querySelector('.roolith__editor__modal');

        if (modal) {
            this.unregisterCloseEvent();
            document.querySelector('.roolith__editor__modal').remove();

            if (this.range) {
                Helper.restoreSelection(this.range);
            }
        }
    }

    registerCloseEvent() {
        document.querySelector('.roolith__editor__modal__close').addEventListener('click', this.close.bind(this));
    }

    unregisterCloseEvent() {
        document.querySelector('.roolith__editor__modal__close').removeEventListener('click', this.close.bind(this));
    }

    setFocusToEditor(callback) {
        if (!this.range || (this.range && this.range.commonAncestorContainer !== this.editorBody)) {
            this.editorBody.focus();
            
            if (callback) {
                callback.call(this, this.editorBody);
            }
        }
    }

    watchKeyboard() {
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') {
                this.close();
            }
        });
    }
}