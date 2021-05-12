import { Helper } from "./helper";
import { Observer } from "./observer";
import { Template } from "./template";

export class Modal {
    constructor(renderer) {
        this.renderer = renderer;

        this.range = null;
        this.sel = null;
        this.editor = document.getElementById(this.renderer.editorId);
        this.editorBody = this.editor.querySelector('.roolith__editor__content');
        this.watchKeyboard();
    }

    open(settings = { title: 'Untitled', content: '' }) {
        this.range = Helper.saveSelection();
        this.sel = Helper.getSelection();

        document.body.insertAdjacentHTML('afterend', Helper.parseTemplate(Template.modal, { title: settings.title, content: settings.content }));

        this.registerCloseEvent();
        this.registerInsertEvent();
    }

    close() {
        const modal = document.querySelector('.roolith__editor__modal');

        if (modal) {
            this.unregisterCloseEvent();
            this.unregisterInsertEvent();
            document.querySelector('.roolith__editor__modal').remove();

            if (this.range) {
                Helper.restoreSelection(this.range, this.sel);
            }
        }
    }

    registerCloseEvent() {
        document.querySelector('.roolith__editor__modal__close').addEventListener('click', this.close.bind(this));
    }

    unregisterCloseEvent() {
        document.querySelector('.roolith__editor__modal__close').removeEventListener('click', this.close.bind(this));
    }

    registerInsertEvent() {
        document.querySelector('.roolith__editor__modal__cta').addEventListener('click', this.insertContent.bind(this));
    }

    unregisterInsertEvent() {
        document.querySelector('.roolith__editor__modal__cta').removeEventListener('click', this.insertContent.bind(this));
    }

    insertContent() {
        const fields = document.querySelectorAll('.roolith__editor__modal__content .roolith__editor__modal__form__item__field');
        const commandName = document.querySelector('.roolith__editor__modal__content .roolith__editor__modal__form').getAttribute('data-command');
        this.close();

        if (fields) {
            const obj = {};
            obj['command'] = commandName;
            fields.forEach(field => {
                obj[field.getAttribute('name')] = field.value;
            });

            Observer.dispatch('modalInsert', obj);
        }
    }

    setFocusToEditor(callback) {
        if (document.activeElement !== this.editorBody) {
            Helper.putCaretAtEnd(this.editorBody);
            
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