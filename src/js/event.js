import { Helper } from "./helper";

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
        console.log(button);

        let commandName = button.getAttribute('data-command');
        let showUi = false;
        let value = null;

        if (commandName.indexOf(':') > -1) {
            const arr = commandName.split(':');
            commandName = arr[0];
            value = arr[1];
        }

        this.editorBody.focus();

        if (commandName === 'createLink') {
            this.executeLinkCommand(event);
        } else {
            this.executeCommand(event, commandName, showUi, value);
        }
    }

    executeCommand(event, commandName, showUi = false, value = null) {
        try {
            event.preventDefault();
            document.execCommand(commandName, showUi, value);

            if (commandName === 'removeFormat') {
                document.execCommand('formatBlock', false, 'div');
            }
        } catch (e) {
            console.log(e);
        }
    }

    executeLinkCommand(event) {
        const linkUrl = prompt('Enter a URL:', 'http://');
        const selectionText = Helper.getSelection();

        if (selectionText) {
            this.executeCommand(event, 'insertHTML', false, '<a href="' + linkUrl + '" target="_blank">' + selectionText + '</a>');
        }
    }
}