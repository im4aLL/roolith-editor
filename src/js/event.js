import { Helper } from "./helper";
import { Template } from "./template";

export class Event {
    constructor(renderer, modal, settings) {
        this.renderer = renderer;
        this.settings = settings;

        this.editor = document.getElementById(this.renderer.editorId);
        this.editorBody = this.editor.querySelector('.roolith__editor__content');
        this.modal = modal;
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

        if (this.settings.registerCustomToolbar) {
            const customToolbar = this.settings.registerCustomToolbar.find(customToolbar => customToolbar.name === commandName);
            if (customToolbar) {
                customToolbar.clickHandler.call(this, event, button);
                return;
            }
        }

        let showUi = false;
        let value = null;

        if (commandName.indexOf(':') > -1) {
            const arr = commandName.split(':');
            commandName = arr[0];
            value = arr[1];
        }

        if (commandName === 'createLink') {
            this.executeLinkCommand(event);
        } else if (commandName === 'image') {
            this.executeImageCommand(event);
        } else {
            this.executeCommand(event, commandName, showUi, value);
        }
    }

    executeLinkCommand(event) {
        const linkUrl = prompt('Enter a URL:', 'http://');
        const selectionText = Helper.getSelection();

        if (selectionText) {
            let value = `<a href="${linkUrl}">${selectionText}</a>`;

            if (this.settings.linkType) {
                value = `<a href="${linkUrl}" target="${this.settings.linkType}">${selectionText}</a>`;
            }

            this.executeCommand(event, 'insertHTML', false, value);
        }
    }

    executeImageCommand(event) {
        this.modal.open({
            title: 'Insert image',
            content: Template.image,
        });
        
        // const linkUrl = prompt('Enter image URL:', 'http://');

        // if (selectionText) {
        //     const value = `<img src="">`;

        //     this.executeCommand(event, 'insertHTML', false, value);
        // }
    }

    executeCommand(event, commandName, showUi = false, value = null) {
        this.editorBody.focus();
        
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
}