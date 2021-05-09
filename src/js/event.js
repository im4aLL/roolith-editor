export class Event {
    constructor(renderer) {
        this.renderer = renderer;

        this.editor = document.getElementById(this.renderer.editorId);
        this.editorBody = this.editor.querySelector('.roolith__editor__content');
    }

    register() {
        this.registerToolbarEvents();
    }

    unregister() {
        this.unregisterToolbarEvents();
    }

    registerToolbarEvents() {
        this.editor.querySelectorAll('.roolith__editor__toolbar__list__item').forEach(button => {
            button.addEventListener('click', this.toolbarButtonClickEvent.bind(this, button));
        });
    }

    unregisterToolbarEvents() {
        this.editor.querySelectorAll('.roolith__editor__toolbar__list__item').forEach(button => {
            button.removeEventListener('click', this.toolbarButtonClickEvent.bind(this, button));
        });
    }

    toolbarButtonClickEvent(button, event) {
        const command = button.getAttribute('data-command');
        this.editorBody.focus();

        try {
            event.preventDefault();
            document.execCommand(command);
        } catch (e) {
            console.log(e);
        }
    }
}